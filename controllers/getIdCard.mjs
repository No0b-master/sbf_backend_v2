import db from '../models/index.mjs';
import {idCardTemplate} from '../templates/idCardTemplate.mjs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Readable } from 'stream';
import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
import {s3} from '../utils/doSpacesClient.mjs'
import { generateSignedUrl } from '../utils/signedUrls.mjs';

dotenv.config();

const VolunteerBasic = db.VolunteerBasic;
const VolunteerDocuments = db.VolunteerDocuments



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure DigitalOcean Spaces (S3-Compatible)


const BUCKET_NAME = process.env.DO_SPACES_BUCKET; // e.g. 'sbf-bucket'

const injectDynamicData = (htmlContent, dynamicData) => {
  for (const key in dynamicData) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    htmlContent = htmlContent.replace(regex, dynamicData[key]);
  }
  return htmlContent;
};

const uploadToSpaces = async (file, SBF_id) => {
  const fileKey = `SBF/Ids/${SBF_id}/${Date.now()}_Id_card.pdf`;
  const params = {
    Bucket: BUCKET_NAME,
      Key: fileKey,
      Body: file,
      ContentType: 'application/pdf',
      ACL: 'private'
  };

  const result = await s3.upload(params).promise();
  return fileKey;
};


const generatePdfBuffer = async (html) => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const buffer = await page.pdf({ format: 'A4', printBackground: true });
  await browser.close();
  return buffer;
};

export async function getId(req, res) {
  try {
    const { SBF_id } = req.body;
    if (!SBF_id) {
      return res.status(400).json({ status: false, message: 'SBF_id is required' });
    }

    // Fetch from DB
    const basic = await VolunteerBasic.findOne({ where: { SBF_id } });
    const docs = await VolunteerDocuments.findOne({ where: { SBF_id } });

    if (!basic || !docs) {
      return res.status(404).json({ status: false, message: 'Volunteer data not found' });
    }

    // Inject values
    const dynamicData = {
      name: basic.name,
      SBF_id: basic.SBF_id,
      blood_group: basic.blood_group,
      state: basic.state,
      contact_no: basic.contact_no,
      district: basic.district,
      valid_upto: basic.valid_upto,
      photo: generateSignedUrl(docs.photo),
      sign: generateSignedUrl("SBF/signature.png"),
      vision : generateSignedUrl("SBF/VISION2026.png"),
      logo : generateSignedUrl("SBF/SBF_logo.png"),
    };

    console.log(dynamicData);
    

    const html = injectDynamicData(idCardTemplate, dynamicData);
    const pdfBuffer = await generatePdfBuffer(html);

    const key = `SBF/Ids/${SBF_id}/idCard.pdf`;

    // // Upload to DigitalOcean Spaces
 

    //  s3.upload(command);

      const url = await uploadToSpaces(pdfBuffer, SBF_id)


    // Generate signed URL (valid for 1 hour)
    const signedUrl =  generateSignedUrl(url);

    return res.status(200).json({
      status: true,
      message: 'ID Card generated successfully',
      path: signedUrl
    });
  } catch (error) {
    console.error('Error generating ID card:', error);
    return res.status(500).json({
      status: false,
      message: 'Internal server error',
      error
    });
  }
}
