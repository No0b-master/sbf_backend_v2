import db from '../../models/index.mjs';
const VolunteerPreference = db.VolunteerPreference;
const VolunteerBasic = db.VolunteerBasic
// Save volunteer preferences
export async function saveVolunteerPreferences(req, res) {
  try {
    const {
      SBF_id,
      qualification,
      skill,
      day_of_week,
      can__work_in_austere_condition,
      deployment_duration,
      deployment_notice,
      evacuation_period
    } = req.body;

    if (!SBF_id || !qualification || !skill || !day_of_week) {
      return res.status(400).json({
        status: false,
        message: 'Missing required fields'
      });
    }

    const basicDetails = await VolunteerBasic.findOne({where: {SBF_id}}) ;
    if(basicDetails){
 const existing = await VolunteerPreference.findOne({ where: { SBF_id } });
    if (existing) {
      return res.status(200).json({
        status: false,
        message: 'Preferences already submitted for this SBF ID'
      });
    }
    

    const newPref = await VolunteerPreference.create({
      SBF_id,
      qualification,
      skill,
      day_of_week,
      can__work_in_austere_condition,
      deployment_duration,
      deployment_notice,
      evacuation_period
    });

    return res.status(201).json({
      status: true,
      message: 'Details saved successfully',
      data: newPref
    });
    }
     return res.status(201).json({
      status: false,
      message: 'Please Fill Basic Details First',

    });

    // Prevent duplicate entry
   

  } catch (error) {
    console.error('Error saving preferences:', error);
    return res.status(500).json({
      status: false,
      message: 'Error saving volunteer preferences'
    });
  }
}

// Get volunteer preferences by SBF_id
export async function getVolunteerPrefs(req, res) {
  try {
    const { SBF_id } = req.body;

    if (!SBF_id) {
      return res.status(200).json({
        status: false,
        message: 'SBF_id is required'
      });
    }

    const prefs = await VolunteerPreference.findOne({ where: { SBF_id } });

    if (!prefs) {
      return res.status(200).json({
        status: false,
        message: 'No preferences found for this SBF ID'
      });
    }

    return res.status(200).json({
      status: true,
      data: prefs
    });

  } catch (error) {
    console.error('Error getting preferences:', error);
    return res.status(500).json({
      status: false,
      message: 'Error retrieving preferences'
    });
  }
}
