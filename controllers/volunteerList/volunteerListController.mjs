import db from '../../models/index.mjs';
import { Op } from 'sequelize';

const { VolunteerBasic } = db;



export async function searchVolunteersByQueryAndYear(search = '', year = '', page = 1, limit = 10) {
  const searchQuery = `%${search}%`;
  const offset = (page - 1) * limit;

  // Main conditions for the search
  const searchConditions = {
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
  };

  // Final condition: match year OR session is null
  const conditions = {
    [Op.and]: [
      {
        [Op.or]: [
          { session: { [Op.like]: `%${year}%` } },
          { session: null }
        ]
      },
      searchConditions
    ]
  };

  const result = await VolunteerBasic.findAndCountAll({
    where: conditions,
    offset,
    limit,
    order: [['id', 'DESC']]
  });

  return {
    total: result.count,
    page,
    totalPages: Math.ceil(result.count / limit),
    data: result.rows
  };
}


export async function handleVolunteerSearch(req, res) {
  try {
    console.log(req.query);
    
    const { query = '', year = '' } = req.query;

    if (!year) {
      return res.status(400).json({ status: false, message: 'Year (session) is required' });
    }

    const results = await searchVolunteersByQueryAndYear(query, year);

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