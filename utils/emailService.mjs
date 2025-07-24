import { createTransport } from 'nodemailer';

export const transporter = createTransport({
  port: 587,
  host: "smtp.gmail.com",
  service: 'gmail',
  auth: {
    user: 'volunteerssbf@gmail.com',
    pass: 'bdobyqibqnirtify',
  },
  secure: false,
});

export async function sendEmail(to, subject, html) {
  const mailOptions = {
    from: '"SBF Volunteers" <volunteerssbf@gmail.com>',
    to,
    subject,
    html
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error);
  }
}
