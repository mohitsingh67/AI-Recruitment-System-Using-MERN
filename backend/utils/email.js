// import nodemailer from 'nodemailer';

// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: process.env.EMAIL_PORT,
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });

// export const sendApplicationConfirmation = async (candidateEmail, jobTitle, companyName) => {
//   try {
//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: candidateEmail,
//       subject: `Application Received - ${jobTitle}`,
//       html: `
//         <h2>Application Confirmation</h2>
//         <p>Dear Candidate,</p>
//         <p>Thank you for applying to the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>.</p>
//         <p>Your application has been received and is under review. We will contact you shortly.</p>
//         <br/>
//         <p>Best regards,<br/>${companyName} Recruitment Team</p>
//       `
//     });
//   } catch (error) {
//     console.error('Error sending application confirmation:', error);
//   }
// };

// export const sendInterviewScheduledEmail = async (candidateEmail, candidateName, jobTitle, scheduledAt, zoomLink) => {
//   try {
//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: candidateEmail,
//       subject: `Interview Scheduled - ${jobTitle}`,
//       html: `
//         <h2>Interview Scheduled</h2>
//         <p>Dear ${candidateName},</p>
//         <p>Congratulations! Your interview for the <strong>${jobTitle}</strong> position has been scheduled.</p>
//         <p><strong>Date & Time:</strong> ${new Date(scheduledAt).toLocaleString()}</p>
//         <p><strong>Interview Link:</strong> <a href="${zoomLink}">${zoomLink}</a></p>
//         <p>Please join the meeting at the scheduled time. Make sure to test your audio and video before the interview.</p>
//         <br/>
//         <p>Best regards,<br/>Recruitment Team</p>
//       `
//     });
//   } catch (error) {
//     console.error('Error sending interview scheduled email:', error);
//   }
// };

// export const sendApplicationStatusUpdate = async (candidateEmail, candidateName, jobTitle, status) => {
//   const statusMessages = {
//     shortlisted: 'We are pleased to inform you that your application has been shortlisted for further review.',
//     rejected: 'After careful consideration, we have decided to move forward with other candidates.',
//     selected: 'Congratulations! We are delighted to offer you the position.'
//   };

//   try {
//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: candidateEmail,
//       subject: `Application Update - ${jobTitle}`,
//       html: `
//         <h2>Application Status Update</h2>
//         <p>Dear ${candidateName},</p>
//         <p>${statusMessages[status]}</p>
//         <p><strong>Position:</strong> ${jobTitle}</p>
//         <br/>
//         <p>Best regards,<br/>Recruitment Team</p>
//       `
//     });
//   } catch (error) {
//     console.error('Error sending status update email:', error);
//   }
// };

// export const sendInterviewReminderEmail = async (candidateEmail, candidateName, jobTitle, scheduledAt, zoomLink) => {
//   try {
//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: candidateEmail,
//       subject: `Interview Reminder - ${jobTitle}`,
//       html: `
//         <h2>Interview Reminder</h2>
//         <p>Dear ${candidateName},</p>
//         <p>This is a reminder about your upcoming interview for the <strong>${jobTitle}</strong> position.</p>
//         <p><strong>Date & Time:</strong> ${new Date(scheduledAt).toLocaleString()}</p>
//         <p><strong>Interview Link:</strong> <a href="${zoomLink}">${zoomLink}</a></p>
//         <p>See you soon!</p>
//         <br/>
//         <p>Best regards,<br/>Recruitment Team</p>
//       `
//     });
//   } catch (error) {
//     console.error('Error sending interview reminder:', error);
//   }
// };

// export default transporter;



import nodemailer from 'nodemailer';

// ===============================
// Create Email Transporter
// ===============================
const transporter = nodemailer.createTransport({
  service: "gmail", // easier configuration
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ===============================
// Application Confirmation Email
// ===============================
export const sendApplicationConfirmation = async (
  candidateEmail,
  jobTitle,
  companyName
) => {
  try {
    await transporter.sendMail({
      from: `"${companyName} Recruitment" <${process.env.EMAIL_USER}>`,
      to: candidateEmail,
      subject: `Application Received - ${jobTitle}`,
      html: `
        <h2>Application Confirmation</h2>

        <p>Dear Candidate,</p>

        <p>
        Thank you for applying for the 
        <strong>${jobTitle}</strong> position at 
        <strong>${companyName}</strong>.
        </p>

        <p>Your application has been successfully received and is currently under review by our recruitment team.</p>

        <p>We will notify you once there is an update regarding your application.</p>

        <br/>

        <p>Best regards,<br/>
        <strong>${companyName} Recruitment Team</strong></p>
      `
    });

    console.log("Application confirmation email sent");
  } catch (error) {
    console.error("Email sending error:", error);
  }
};

// ===============================
// Application Status Update Email
// ===============================
export const sendApplicationStatusUpdate = async (
  candidateEmail,
  candidateName,
  jobTitle,
  status
) => {

  const statusMessages = {
    pending:
      "Your application has been received and is currently under review by our recruitment team.",

    shortlisted:
      "Congratulations! Your application has been shortlisted for the next stage of the recruitment process.",

    rejected:
      "Thank you for your interest. After careful consideration, we regret to inform you that we will not be moving forward with your application at this time.",

    selected:
      "Congratulations! We are pleased to inform you that you have been selected for the position."
  };

  try {
    await transporter.sendMail({
      from: `"Recruitment Team" <${process.env.EMAIL_USER}>`,
      to: candidateEmail,
      subject: `Application Status Update - ${jobTitle}`,
      html: `
        <h2>Application Status Update</h2>

        <p>Dear ${candidateName},</p>

        <p>${statusMessages[status] || "There is an update regarding your job application."}</p>

        <p><strong>Position:</strong> ${jobTitle}</p>
        <p><strong>Status:</strong> ${status.toUpperCase()}</p>

        <br/>

        <p>If you have any questions, feel free to reply to this email.</p>

        <br/>

        <p>Best regards,<br/>
        <strong>Recruitment Team</strong></p>
      `
    });

    console.log(`Status email sent: ${status}`);
  } catch (error) {
    console.error("Status email error:", error);
  }
};

// // ===============================
// // Interview Scheduled Email
// // ===============================
// export const sendInterviewScheduledEmail = async (
//   candidateEmail,
//   candidateName,
//   jobTitle,
//   scheduledAt,
//   zoomLink
// ) => {
//   try {
//     await transporter.sendMail({
//       from: `"Recruitment Team" <${process.env.EMAIL_USER}>`,
//       to: candidateEmail,
//       subject: `Interview Scheduled - ${jobTitle}`,
//       html: `
//         <h2>Interview Scheduled</h2>

//         <p>Dear ${candidateName},</p>

//         <p>
//         Congratulations! Your interview for the 
//         <strong>${jobTitle}</strong> position has been scheduled.
//         </p>

//         <p><strong>Date & Time:</strong> ${new Date(scheduledAt).toLocaleString()}</p>

//         <p>
//         <strong>Interview Link:</strong><br/>
//         <a href="${zoomLink}">${zoomLink}</a>
//         </p>

//         <p>Please join the meeting on time and ensure your microphone and camera are working properly.</p>

//         <br/>

//         <p>Best regards,<br/>
//         <strong>Recruitment Team</strong></p>
//       `
//     });

//     console.log("Interview scheduled email sent");
//   } catch (error) {
//     console.error("Interview email error:", error);
//   }
// };

export const sendInterviewScheduledEmail = async (
  candidateEmail,
  candidateName,
  jobTitle,
  scheduledAt,
  zoomLink
) => {
  try {
    await transporter.sendMail({
      from: `"Recruitment Team" <${process.env.EMAIL_USER}>`,
      to: candidateEmail,
      subject: `Interview Scheduled - ${jobTitle}`,
      html: `
        <h2>Interview Scheduled 🎯</h2>

        <p>Dear ${candidateName},</p>

        <p>
        Your interview for <strong>${jobTitle}</strong> has been successfully scheduled.
        </p>

        <p><strong>Date & Time:</strong> ${new Date(scheduledAt).toLocaleString()}</p>

        <p>
        👉 <strong>Join Interview:</strong><br/>
        <a href="${zoomLink}" style="color: blue;">Click here to join</a>
        </p>

        <p>Please ensure:</p>
        <ul>
          <li>Stable internet connection</li>
          <li>Camera & mic are working</li>
          <li>Join 5 minutes early</li>
        </ul>

        <br/>

        <p>Best of luck! 🚀</p>

        <br/>

        <p>Best regards,<br/>
        Recruitment Team</p>
      `
    });

    console.log("Interview email sent");
  } catch (error) {
    console.error("Interview email error:", error);
  }
};

// ===============================
// Interview Reminder Email
// ===============================
export const sendInterviewReminderEmail = async (
  candidateEmail,
  candidateName,
  jobTitle,
  scheduledAt,
  zoomLink
) => {
  try {
    await transporter.sendMail({
      from: `"Recruitment Team" <${process.env.EMAIL_USER}>`,
      to: candidateEmail,
      subject: `Interview Reminder - ${jobTitle}`,
      html: `
        <h2>Interview Reminder</h2>

        <p>Dear ${candidateName},</p>

        <p>This is a reminder for your upcoming interview.</p>

        <p><strong>Position:</strong> ${jobTitle}</p>
        <p><strong>Date & Time:</strong> ${new Date(scheduledAt).toLocaleString()}</p>

        <p>
        <strong>Interview Link:</strong><br/>
        <a href="${zoomLink}">${zoomLink}</a>
        </p>

        <p>Please make sure to join the meeting on time.</p>

        <br/>

        <p>Best regards,<br/>
        <strong>Recruitment Team</strong></p>
      `
    });

    console.log("Interview reminder email sent");
  } catch (error) {
    console.error("Reminder email error:", error);
  }
};


// ===============================
// Selection Email (NEW)
// ===============================
export const sendSelectionEmail = async (
  candidateEmail,
  candidateName,
  jobTitle,
  companyName
) => {
  try {
    await transporter.sendMail({
      from: `"${companyName} Hiring Team" <${process.env.EMAIL_USER}>`,
      to: candidateEmail,
      subject: `🎉 Congratulations! You are selected for ${jobTitle}`,
      html: `
        <h2>Congratulations ${candidateName} 🎉</h2>

        <p>
        We are excited to inform you that you have been 
        <strong>selected</strong> for the role of 
        <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.
        </p>

        <p>
        Our team will contact you shortly with further details 
        regarding onboarding and next steps.
        </p>

        <br/>

        <p>We look forward to having you on our team!</p>

        <br/>

        <p>Best regards,<br/>
        <strong>${companyName} Hiring Team</strong></p>
      `
    });

    console.log("Selection email sent");
  } catch (error) {
    console.error("Selection email error:", error);
  }
};

export default transporter;