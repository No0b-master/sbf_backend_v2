export function expiryEmail(name) {
  return {
    subject: "SBF Volunteer Application Expired",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2 style="color: #d32f2f;">Application Expired</h2>
        <p>Dear ${name || "Volunteer"},</p>
        <p>
          Your SBF volunteer application has expired.
        </p>
        <p>
          Kindly download the updated ID card after approval from SBF.
        </p>
        <p>
          Regards,<br/>
          SBF Team
        </p>
      </div>
    `,
  };
}
