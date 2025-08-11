import db from '../../models/index.mjs';
import { Op } from 'sequelize';

const { VolunteerBasic } = db;


export async function searchVolunteersByQueryAndYear(search = '', year = '', page = 1, limit = 10) {
  const searchQuery = `%${search}%`;
  const pg = page <= 0 ? 1 : parseInt(page);
  const offset = (pg - 1) * limit;

  const conditions = [];

  // Handle year/session filter
  if (year) {
    // Create both formats
    const shortFormat = year.replace(/(\d{4})-(\d{4})/, (_, start, end) => `${start}-${end.slice(2)}`);
    const longFormat = year.replace(/(\d{4})-(\d{2})/, (_, start, end) => `${start}-20${end}`);

    conditions.push({
      [Op.or]: [
        { session: { [Op.like]: `%${year}%` } },
        { session: { [Op.like]: `%${shortFormat}%` } },
        { session: { [Op.like]: `%${longFormat}%` } },
        { session: { [Op.is]: null } }
      ]
    });
  }

  // Search filter
  if (search) {
    conditions.push({
      [Op.or]: [
        { SBF_id: { [Op.like]: searchQuery } },
        { name: { [Op.like]: searchQuery } },
        { dob: { [Op.like]: searchQuery } },
        { blood_group: { [Op.like]: searchQuery } },
        { contact_no: { [Op.like]: searchQuery } },
        { whatsapp_no: { [Op.like]: searchQuery } },
        { email: { [Op.like]: searchQuery } },
        { block: { [Op.like]: searchQuery } },
        { state: { [Op.like]: searchQuery } },
        { district: { [Op.like]: searchQuery } },
        { pin_code: { [Op.like]: searchQuery } },
        { valid_upto: { [Op.like]: searchQuery } }
      ]
    });
  }

  const result = await VolunteerBasic.findAndCountAll({
    where: conditions.length > 0 ? { [Op.and]: conditions } : {},
    offset,
    limit,
    order: [['id', 'DESC']]
  });

  return {
    total: result.count,
    page: pg,
    totalPages: Math.ceil(result.count / limit),
    data: result.rows
  };
}


export async function handleVolunteerSearch(req, res) {
  try {    
    const { query = '', year = '' , page } = req.query;

    if (!year) {
      return res.status(400).json({ status: false, message: 'Year (session) is required' });
    }

    const results = await searchVolunteersByQueryAndYear(query, year, page);

    return res.status(200).json({
      status: true,
      count: results.length,
      data: results
    });
  } catch (err) {
    console.error('Volunteer search failed:', err);
    return res.status(500).json({ status: false, message: 'Something went wrong' });
  }
}