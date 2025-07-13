import db from "../models/index.mjs";
import {
  generateSignedUrl,
  generateDownloadUrl,
} from "../utils/signedUrls.mjs";

const { VolunteerDocuments } = db;
export async function viewDocument(req, res) {
  const { SBF_id, type } = req.params;

  try {
    const record = await VolunteerDocuments.findOne({ where: { SBF_id } });
    if (!record || !record[type]) {
      return res
        .status(404)
        .json({ status: false, message: "Document not found" });
    }

    const signedUrl = generateSignedUrl(record[type]); // pass key
    res.redirect(signedUrl);
  } catch (err) {
    res
      .status(500)
      .json({ status: false, message: "Error fetching document", error: err });
  }
}

export async function downloadDocument(req, res) {
  const { SBF_id, type } = req.params;

  try {
    const record = await VolunteerDocuments.findOne({ where: { SBF_id } });
    if (!record || !record[type]) {
      return res
        .status(404)
        .json({ status: false, message: "Document not found" });
    }

    const filename = record[type].split("/").pop(); // original filename
    const signedUrl = generateDownloadUrl(record[type], filename);
    res.redirect(signedUrl);
  } catch (err) {
    res
      .status(500)
      .json({
        status: false,
        message: "Error downloading document",
        error: err,
      });
  }
}
