import db from '../../models/index.mjs';
const VolunteerBasic = db.VolunteerBasic;

export async function saveVolunteerBasicDetails(req, res) {
  try {
    const { SBF_id } = req.body;

    const payload = {
      ...req.body
    } ;


    // Prevent duplicate entry if already exists
    const existing = await VolunteerBasic.findOne({ where: { SBF_id } });
    if (existing) {
      return res.status(409).json({
        status: false,
        message: 'Basic details already submitted for this SBF ID',
      });
    }

    const details = await VolunteerBasic.create(payload);

    return res.status(201).json({
      status: true,
      message: 'Volunteer basic details saved successfully',
      data: details
    });

  } catch (error) {
    console.error('Error saving basic details:', error);
    return res.status(500).json({
      status: false,
      message: 'Failed to save basic details'
    });
  }
}

export async function isBasicDetailsFilled(req, res) {
  try {
    const { SBF_id } = req.body;

    if (!SBF_id) {
      return res.status(400).json({
        status: false,
        message: 'SBF_id is required'
      });
    }

    const record = await VolunteerBasic.findOne({ where: { SBF_id } });

    if (!record) {
      return res.status(200).json({
        status: false,
        message: 'Basic details not filled'
      });
    }

    return res.status(200).json({
      status: true,
      message: 'Basic details already filled',
      data: record
    });

  } catch (error) {
    console.error('Error checking basic details status:', error);
    return res.status(500).json({
      status: false,
      message: 'Something went wrong'
    });
  }
}
