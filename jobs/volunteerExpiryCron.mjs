import cron from 'node-cron';
import { Op } from 'sequelize';
import db from '../models/index.mjs';
import { sendEmail } from '../utils/emailService.mjs';
import { expiryEmail } from '../utils/emailTemplates/expiryEmail.mjs';

const VolunteerBasic = db.VolunteerBasic;
const VolunteerStatus = db.VolunteerStatus;

export async function expireVolunteers() {
  const transaction = await db.sequelize.transaction();
  try {
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);

    const expiredVolunteers = await VolunteerBasic.findAll({
      where: {
        isActive: true,
        valid_upto: {
          [Op.lt]: todayStr,
          [Op.ne]: null,
        },
      },
      transaction,
    });

    if (!expiredVolunteers.length) {
      await transaction.commit();
      return;
    }

    const sbfIds = expiredVolunteers.map((v) => v.SBF_id);

    await VolunteerBasic.update(
      {
        isActive: false,
        session: null,
      },
      {
        where: {
          SBF_id: {
            [Op.in]: sbfIds,
          },
        },
        transaction,
      }
    );

    await VolunteerStatus.update(
      {
        local_level: false,
        state_level: false,
        national_level: false,
      },
      {
        where: {
          SBF_id: {
            [Op.in]: sbfIds,
          },
        },
        transaction,
      }
    );

    await transaction.commit();

    for (const volunteer of expiredVolunteers) {
      if (!volunteer.email) continue;
      const { subject, html } = expiryEmail(volunteer.name);
      await sendEmail(volunteer.email, subject, html);
    }

    console.log(`Expired ${expiredVolunteers.length} volunteer application(s).`);
  } catch (error) {
    await transaction.rollback();
    console.error('Error in volunteer expiry cron:', error);
  }
}

export function startVolunteerExpiryCron() {
  cron.schedule(
    '0 0 * * *',
    async () => {
      await expireVolunteers();
    },
    {
      timezone: 'Asia/Kolkata',
    }
  );

  console.log('Volunteer expiry cron scheduled for midnight (Asia/Kolkata).');
}
