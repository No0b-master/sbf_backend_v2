import multer from "multer";
import { s3 } from "../../utils/doSpacesClient.mjs";
import db from "../../models/index.mjs";
import dotenv  from 'dotenv'

const { VolunteerDocuments , VolunteerStatus} = db;

const storage = multer.memoryStorage();
dotenv.config();

const upload = multer({ storage }).fields([
  { name: "photo", maxCount: 1 },
  { name: "qualification_doc", maxCount: 1 },
  { name: "adhaar_card", maxCount: 1 },
  { name: "pan_card", maxCount: 1 },
  { name: "character_certificate", maxCount: 1 },
]);

const uploadToSpaces = async (file, SBF_id) => {
  const fileKey = `SBF/SBF_Volunteers_Documents/${SBF_id}/${Date.now()}_${file.originalname}`;
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

export const uploadDocuments = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res
        .status(500)
        .json({ status: false, message: "Multer error", error: err });
    }
    const { files } = req;    
    const {SBF_id} = req.body;
    if (!files.photo || !files.qualification_doc || !files.adhaar_card) {
      return res
        .status(400)
        .json({ status: false, message: "Documents with * are required" });
    }

    try {
      const data = {
        SBF_id : SBF_id,
        photo: await uploadToSpaces(files.photo[0], SBF_id),
        qualification_doc: await uploadToSpaces(
          files.qualification_doc[0],
          SBF_id
        ),
        adhaar_card: await uploadToSpaces(files.adhaar_card[0], SBF_id),
        pan_card: files.pan_card
          ? await uploadToSpaces(files.pan_card[0], SBF_id)
          : null,
        character_certificate: files.character_certificate
          ? await uploadToSpaces(files.character_certificate[0], SBF_id)
          : null,
      };

      const existing = await VolunteerDocuments.findOne({ where: { SBF_id } });
      if (existing) {
        return res
          .status(409)
          .json({ status: false, message: "Documents already uploaded" });
      }

      const result = await VolunteerDocuments.create(data);
      await VolunteerStatus.create({
        SBF_id : SBF_id,
        local_level : 0,
        state_level : 0 ,
        national_level : 0
      })

      return res
        .status(201)
        .json({
          status: true,
          message: "Documents uploaded successfully",
          data: result,
        });
    } catch (error) {
      console.error("Upload failed:", error);
      return res
        .status(500)
        .json({ status: false, message: "Upload failed", error });
    }
  });
};
