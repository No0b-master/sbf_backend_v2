import db from '../models/index.mjs';
const VolunteerBasic = db.VolunteerBasic;
const VolunteerPreference = db.VolunteerPreference;
const { VolunteerDocuments } = db;


export async function getVolunteerData(req, res) {
  try {
    const { SBF_id } = req.body;

    if (!SBF_id) {
      return res.status(400).json({
        status: false,
        message: 'SBF id is required'
      });
    }

    const basic = await VolunteerBasic.findOne({ where: { SBF_id } });
    const preferences = await VolunteerPreference.findOne({ where: { SBF_id } });
    const documents = await VolunteerDocuments.findOne({ where: { SBF_id } });

    if (!basic && !preferences && !documents) {
      return res.status(200).json({
        status: false,
        data : [],
        message: 'No volunteer data found for given SBF ID'
      });
    }

    return res.status(200).json({
      status: true,
      data: {
        basicDetails: basic || null,
        preferences: preferences || null,
        documents: documents || null
      }
    });

  } catch (error) {
    console.error('Error fetching volunteer data:', error);
    return res.status(500).json({
      status: false,
      message: 'Error retrieving volunteer data'
    });
  }
}
