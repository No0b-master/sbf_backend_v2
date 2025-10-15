import db from "../../models/index.mjs";
const VolunteerStatus = db.VolunteerStatus;
const VolunteerBasic = db.VolunteerBasic;
import { approvalEmail } from "../../utils/emailTemplates/approvalEmail.mjs";
import { sendEmail } from "../../utils/emailService.mjs";
import { getFinancialSession } from "../../utils/dates/getSession.mjs";
import { validUtp } from "../../utils/dates/getValidUpto.mjs";
import { getIsActive } from "../../utils/dates/getIsActive.mjs";
export async function approveLocal(req, res) {
  const { SBF_id } = req.body;

  try {
    if (!SBF_id) {
      return res
        .status(400)
        .json({ status: false, message: "SBF id is required" });
    }

    const [status, created] = await VolunteerStatus.findOrCreate({
      where: { SBF_id },
      defaults: { local_level: true },
    });

    if (!created) {
      status.local_level = true;
      await status.save();
    }

    const user = await VolunteerBasic.findOne({ where: { SBF_id } });
    if (user && user.email) {
      const { subject, html } = approvalEmail(user.name, "local");
      await sendEmail(user.email, subject, html);
    }

    return res.status(200).json({
      status: true,
      message: "Local level approved",
      data: status,
    });
  } catch (error) {
    console.error("Error approving local level:", error);
    return res.status(500).json({ status: false, message: "Server error" });
  }
}

export async function approveState(req, res) {
  const { SBF_id } = req.body;

  try {
    if (!SBF_id) {
      return res
        .status(400)
        .json({ status: false, message: "SBF id is required" });
    }

    const [status, created] = await VolunteerStatus.findOrCreate({
      where: { SBF_id },
      defaults: { state_level: true },
    });

    if (!created) {
      status.state_level = true;
      await status.save();
    }

    const user = await VolunteerBasic.findOne({ where: { SBF_id } });
    if (user && user.email) {
      const { subject, html } = approvalEmail(user.name, "state");
      await sendEmail(user.email, subject, html);
    }

    return res.status(200).json({
      status: true,
      message: "State level approved",
      data: status,
    });
  } catch (error) {
    console.error("Error approving state level:", error);
    return res.status(500).json({ status: false, message: "Server error" });
  }
}

export async function approveNational(req, res) {
  const { SBF_id } = req.body;

  try {
    if (!SBF_id) {
      return res
        .status(400)
        .json({ status: false, message: "SBF id is required" });
    }

    const [status, created] = await VolunteerStatus.findOrCreate({
      where: { SBF_id },
      defaults: { national_level: true },
    });

    if (!created) {
      status.national_level = true;
      await status.save();
    }

    const user = await VolunteerBasic.findOne({ where: { SBF_id } });

    user.session = getFinancialSession();
    user.valid_upto = validUtp(getFinancialSession());
    user.isActive = getIsActive(validUtp(getFinancialSession()));
    user.save();

    if (user && user.email) {
      const { subject, html } = approvalEmail(user.name, "national");
      await sendEmail(user.email, subject, html);
    }

    return res.status(200).json({
      status: true,
      message: "National level approved",
      data: status,
    });
  } catch (error) {
    console.error("Error approving national level:", error);
    return res.status(500).json({ status: false, message: "Server error" });
  }
}

export async function getApprovals(req, res) {
  const { SBF_id } = req.body;

  try {
    if (!SBF_id) {
      return res
        .status(400)
        .json({ status: false, message: "SBF id is required" });
    }

    const status = await VolunteerStatus.findOne({ where: { SBF_id } });

    if (!status) {
      return res.status(200).json({
        status: false,
        data: {},
        message: "No approval data found for this SBF ID",
      });
    }

    return res.status(200).json({
      status: true,
      data: status,
    });
  } catch (error) {
    console.error("Error fetching approval status:", error);
    return res.status(500).json({ status: false, message: "Server error" });
  }
}
