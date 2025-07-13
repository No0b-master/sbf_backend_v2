import multer from 'multer';
import { s3 } from '../../utils/doSpacesClient.mjs';
import db from '../../models/index.mjs';
import { generateSignedUrl } from '../../utils/signedUrls.mjs';

const {VolunteerDocuments} = db
const storage = multer.memoryStorage();
const upload = multer({ storage }).single('document');

const uploadToSpaces = async (file, SBF_id) => {
  const fileKey = `SBF_Volunteers_Documents/${SBF_id}/${Date.now()}_${file.originalname}`;
  const params = {
    Bucket: process.env.DO_SPACES_BUCKET,
    Key: fileKey,
    Body: file.buffer,
    ACL: 'private',
    ContentType: file.mimetype
  };

  const result = await s3.upload(params).promise();
  return fileKey;
};

export const updateDocument = (req, res) => {
  upload(req, res, async (err) => {    
    if (err) {
      return res.status(500).json({ status: false, message: "Upload error", error: err });
    }

    const { sbf_id, documentType } = req.query;
    const { file } = req;



    if (!file || !sbf_id || !documentType) {
      return res.status(400).json({
        status: false,
        message: "Missing required parameters (file, sbf_id, documentType)"
      });
    }

    const validFields = ['photo', 'qualification_doc', 'adhaar_card', 'pan_card', 'character_certificate'];
    if (!validFields.includes(documentType)) {
      return res.status(400).json({ status: false, message: "Invalid document type" });
    }

    try {
      const fileKey = await uploadToSpaces(file, sbf_id);

      const [updatedRows] = await VolunteerDocuments.update(
        { [documentType]: fileKey },
        { where: { SBF_id: sbf_id } }
      );

      if (updatedRows === 0) {
        return res.status(404).json({ status: false, message: "Volunteer not found" });
      }

      const signedUrl = generateSignedUrl(fileKey);
      return res.status(200).json({
        status: true,
        message: "File updated successfully",
      });

    } catch (error) {
      console.error('Error updating document:', error);
      return res.status(500).json({ status: false, message: "Internal Server Error", error });
    }
  });
};
