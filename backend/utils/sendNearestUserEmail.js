const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS
  }
});

async function sendNearestUserEmailNotification(toEmail, helperName, senderName, senderEmail, latitude, longitude) {
  console.log('Email Data:', { toEmail, helperName, senderName, senderEmail, latitude, longitude });

  const safeHelperName = helperName || 'Helper';
  const safeSenderName = senderName || 'Someone in need';
  const safeSenderEmail = senderEmail || 'no-reply@example.com';
  const safeLat = latitude || '0';
  const safeLng = longitude || '0';

  const locationURL = `https://www.google.com/maps/dir/?api=1&destination=${safeLat},${safeLng}`;

  const timeIST = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour12: true
  });

  if (!process.env.BREVO_SMTP_USER || !process.env.BREVO_SMTP_PASS) {
    console.error('❌ Missing BREVO_SMTP_USER or BREVO_SMTP_PASS in environment variables.');
    return;
  }

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>SOS Alert - Vigilant</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f4f4f7;font-family:'Segoe UI',Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:40px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(135deg,#e74c6f,#c0395a);padding:32px 40px;text-align:center;">
                <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;letter-spacing:1px;">🛡️ Vigilant</h1>
                <p style="margin:6px 0 0;color:#ffd6e0;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Women Safety Network</p>
              </td>
            </tr>

            <!-- Alert Badge -->
            <tr>
              <td style="background:#fff3f5;padding:20px 40px;text-align:center;border-bottom:1px solid #fde0e6;">
                <span style="background:#e74c6f;color:#fff;font-size:12px;font-weight:700;padding:6px 16px;border-radius:20px;letter-spacing:1px;text-transform:uppercase;">🚨 SOS Alert</span>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:36px 40px;">
                <p style="margin:0 0 16px;font-size:16px;color:#333;">Hi <strong>${safeHelperName}</strong>,</p>
                <p style="margin:0 0 24px;font-size:15px;color:#555;line-height:1.7;">
                  You have been identified as the <strong>nearest available helper</strong> on the Vigilant network.
                  Someone nearby needs your immediate assistance.
                </p>

                <!-- Info Card -->
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff8f9;border:1px solid #fde0e6;border-radius:8px;margin-bottom:28px;">
                  <tr>
                    <td style="padding:20px 24px;">
                      <p style="margin:0 0 12px;font-size:13px;color:#999;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Requester Details</p>
                      <table width="100%" cellpadding="6" cellspacing="0">
                        <tr>
                          <td style="font-size:14px;color:#888;width:100px;">👤 Name</td>
                          <td style="font-size:14px;color:#333;font-weight:600;">${safeSenderName}</td>
                        </tr>
                        <tr>
                          <td style="font-size:14px;color:#888;">✉️ Email</td>
                          <td style="font-size:14px;color:#e74c6f;"><a href="mailto:${safeSenderEmail}" style="color:#e74c6f;text-decoration:none;">${safeSenderEmail}</a></td>
                        </tr>
                        <tr>
                          <td style="font-size:14px;color:#888;">🕐 Time</td>
                          <td style="font-size:14px;color:#333;">${timeIST}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- CTA Button -->
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center">
                      <a href="${locationURL}" target="_blank"
                        style="display:inline-block;background:linear-gradient(135deg,#e74c6f,#c0395a);color:#ffffff;font-size:15px;font-weight:700;padding:14px 36px;border-radius:8px;text-decoration:none;letter-spacing:0.5px;">
                        📍 Open Location in Google Maps
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="margin:28px 0 0;font-size:14px;color:#777;line-height:1.7;">
                  Please open the <strong>Vigilant app</strong> and respond as quickly as possible.
                  Your quick action can make a real difference.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f9f9f9;padding:20px 40px;text-align:center;border-top:1px solid #eee;">
                <p style="margin:0;font-size:12px;color:#aaa;">
                  This is an automated alert from <strong>Vigilant</strong> — Women Safety Network.<br/>
                  Replying to this email will contact the requester directly.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: '"Vigilant 🛡️" <noreply.womensafety@gmail.com>', // ✅ verified sender
      to: toEmail,
      replyTo: safeSenderEmail,
      subject: '🚨 SOS Alert — Someone Needs Your Help Nearby',
      html
    });
    console.log('✅ SOS email sent to', toEmail, info.response);
  } catch (error) {
    console.error('❌ Failed to send SOS email to', toEmail, error.message);
  }
}

module.exports = sendNearestUserEmailNotification;
// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//   host: 'smtp-relay.brevo.com',
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.BREVO_SMTP_USER,
//     pass: process.env.BREVO_SMTP_PASS
//   }
// });

// async function sendNearestUserEmailNotification(toEmail, helperName, senderName, senderEmail, latitude, longitude) {
//   console.log('Email Data:', { toEmail, helperName, senderName, senderEmail, latitude, longitude });

//   const safeHelperName = helperName || 'Helper';
//   const safeSenderName = senderName || 'Someone in need';
//   const safeSenderEmail = senderEmail || 'no-reply@example.com';
//   const safeLat = latitude || '0';
//   const safeLng = longitude || '0';

//   const locationURL = `https://www.google.com/maps/dir/?api=1&destination=${safeLat},${safeLng}`;

//   const timeIST = new Date().toLocaleString("en-IN", {
//     timeZone: "Asia/Kolkata",
//     hour12: true
//   });

//   if (!process.env.BREVO_SMTP_USER || !process.env.BREVO_SMTP_PASS) {
//     console.error('❌ Missing BREVO_SMTP_USER or BREVO_SMTP_PASS in environment variables.');
//     return;
//   }

//   const html = `
//   <!DOCTYPE html>
//   <html>
//   <head>
//     <meta charset="UTF-8" />
//     <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
//     <title>SOS Alert - Vigilant</title>
//   </head>
//   <body style="margin:0;padding:0;background-color:#f4f4f7;font-family:'Segoe UI',Arial,sans-serif;">
//     <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:40px 0;">
//       <tr>
//         <td align="center">
//           <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

//             <!-- Header -->
//             <tr>
//               <td style="background:linear-gradient(135deg,#e74c6f,#c0395a);padding:32px 40px;text-align:center;">
//                 <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;letter-spacing:1px;">🛡️ Vigilant</h1>
//                 <p style="margin:6px 0 0;color:#ffd6e0;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Women Safety Network</p>
//               </td>
//             </tr>

//             <!-- Alert Badge -->
//             <tr>
//               <td style="background:#fff3f5;padding:20px 40px;text-align:center;border-bottom:1px solid #fde0e6;">
//                 <span style="background:#e74c6f;color:#fff;font-size:12px;font-weight:700;padding:6px 16px;border-radius:20px;letter-spacing:1px;text-transform:uppercase;">🚨 SOS Alert</span>
//               </td>
//             </tr>

//             <!-- Body -->
//             <tr>
//               <td style="padding:36px 40px;">
//                 <p style="margin:0 0 16px;font-size:16px;color:#333;">Hi <strong>${safeHelperName}</strong>,</p>
//                 <p style="margin:0 0 24px;font-size:15px;color:#555;line-height:1.7;">
//                   You have been identified as the <strong>nearest available helper</strong> on the Vigilant network.
//                   Someone nearby needs your immediate assistance.
//                 </p>

//                 <!-- Info Card -->
//                 <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff8f9;border:1px solid #fde0e6;border-radius:8px;margin-bottom:28px;">
//                   <tr>
//                     <td style="padding:20px 24px;">
//                       <p style="margin:0 0 12px;font-size:13px;color:#999;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Requester Details</p>
//                       <table width="100%" cellpadding="6" cellspacing="0">
//                         <tr>
//                           <td style="font-size:14px;color:#888;width:100px;">👤 Name</td>
//                           <td style="font-size:14px;color:#333;font-weight:600;">${safeSenderName}</td>
//                         </tr>
//                         <tr>
//                           <td style="font-size:14px;color:#888;">✉️ Email</td>
//                           <td style="font-size:14px;color:#e74c6f;"><a href="mailto:${safeSenderEmail}" style="color:#e74c6f;text-decoration:none;">${safeSenderEmail}</a></td>
//                         </tr>
//                         <tr>
//                           <td style="font-size:14px;color:#888;">🕐 Time</td>
//                           <td style="font-size:14px;color:#333;">${timeIST}</td>
//                         </tr>
//                       </table>
//                     </td>
//                   </tr>
//                 </table>

//                 <!-- CTA Button -->
//                 <table width="100%" cellpadding="0" cellspacing="0">
//                   <tr>
//                     <td align="center">
//                       <a href="${locationURL}" target="_blank"
//                         style="display:inline-block;background:linear-gradient(135deg,#e74c6f,#c0395a);color:#ffffff;font-size:15px;font-weight:700;padding:14px 36px;border-radius:8px;text-decoration:none;letter-spacing:0.5px;">
//                         📍 Open Location in Google Maps
//                       </a>
//                     </td>
//                   </tr>
//                 </table>

//                 <p style="margin:28px 0 0;font-size:14px;color:#777;line-height:1.7;">
//                   Please open the <strong>Vigilant app</strong> and respond as quickly as possible.
//                   Your quick action can make a real difference.
//                 </p>
//               </td>
//             </tr>

//             <!-- Footer -->
//             <tr>
//               <td style="background:#f9f9f9;padding:20px 40px;text-align:center;border-top:1px solid #eee;">
//                 <p style="margin:0;font-size:12px;color:#aaa;">
//                   This is an automated alert from <strong>Vigilant</strong> — Women Safety Network.<br/>
//                   Replying to this email will contact the requester directly.
//                 </p>
//               </td>
//             </tr>

//           </table>
//         </td>
//       </tr>
//     </table>
//   </body>
//   </html>
//   `;

//   try {
//     const info = await transporter.sendMail({
//       from: '"Vigilant 🛡️" <a63e27001@smtp-brevo.com>',
//       to: toEmail,
//       replyTo: safeSenderEmail,
//       subject: '🚨 SOS Alert — Someone Needs Your Help Nearby',
//       html
//     });
//     console.log('✅ SOS email sent to', toEmail, info.response);
//   } catch (error) {
//     console.error('❌ Failed to send SOS email to', toEmail, error.message);
//   }
// }

// module.exports = sendNearestUserEmailNotification;
// const { Resend } = require('resend');

// async function sendNearestUserEmailNotification(toEmail, helperName, senderName, senderEmail, latitude, longitude) {
//   console.log('Email Data:', {
//     toEmail,
//     helperName,
//     senderName,
//     senderEmail,
//     latitude,
//     longitude
//   });

//   const safeHelperName = helperName || 'Helper';
//   const safeSenderName = senderName || 'Someone in need';
//   const safeSenderEmail = senderEmail || 'no-reply@example.com';
//   const safeLat = latitude || '0';
//   const safeLng = longitude || '0';

//   const locationURL = `https://www.google.com/maps/dir/?api=1&destination=${safeLat},${safeLng}`;

//   // Get IST formatted date/time
//   const timeIST = new Date().toLocaleString("en-IN", {
//     timeZone: "Asia/Kolkata",
//     hour12: true
//   });

//   if (!process.env.RESEND_API_KEY) {
//     console.error('❌ Missing RESEND_API_KEY in environment variables.');
//     return;
//   }

//   const resend = new Resend(process.env.RESEND_API_KEY);

//   try {
//     const { data, error } = await resend.emails.send({
//       from: 'Women Safety App <onboarding@resend.dev>', // ✅ Resend's free default sender
//       to: toEmail,
//       replyTo: safeSenderEmail,
//       subject: '🚨 SOS Alert - You were selected as a nearest helper!',
//       html: `
//         <p>Hi <b>${safeHelperName}</b>,</p>
//         <p><b>${safeSenderName}</b> (<a href="mailto:${safeSenderEmail}">${safeSenderEmail}</a>) 
//            has selected you as the nearest helper via the Women Safety App.</p>
//         <p>Requester location: 
//            <a href="${locationURL}" target="_blank" rel="noopener noreferrer">
//            📍 Open Directions in Google Maps
//            </a>
//         </p>
//         <p><b>Time:</b> ${timeIST}</p>
//         <p>Please check your app and respond quickly!</p>
//         <hr>
//         <small>This is an automated alert from Women Safety App. Replying to this email will contact the requester directly.</small>
//       `
//     });

//     if (error) {
//       console.error('❌ Resend error:', error);
//     } else {
//       console.log('✅ Email sent via Resend:', data.id);
//     }
//   } catch (error) {
//     console.error('❌ Error sending email:', error);
//   }
// }

// module.exports = sendNearestUserEmailNotification;
// // const nodemailer = require('nodemailer');

// // async function sendNearestUserEmailNotification(toEmail, helperName, senderName, senderEmail, latitude, longitude) {
// //   console.log('Email Data:', {
// //     toEmail,
// //     helperName,
// //     senderName,
// //     senderEmail,
// //     latitude,
// //     longitude
// //   });

// //   const safeHelperName = helperName || 'Helper';
// //   const safeSenderName = senderName || 'Someone in need';
// //   const safeSenderEmail = senderEmail || 'no-reply@example.com';
// //   const safeLat = latitude || '0';
// //   const safeLng = longitude || '0';

// //   const locationURL = `https://www.google.com/maps/dir/?api=1&destination=${safeLat},${safeLng}`;

// //   // Get IST formatted date/time
// //   const timeIST = new Date().toLocaleString("en-IN", {
// //     timeZone: "Asia/Kolkata",
// //     hour12: true
// //   });

// //   if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
// //     console.error('? Missing EMAIL_USER or EMAIL_PASS in environment variables.');
// //     return;
// //   }

// //   const transporter = nodemailer.createTransport({
// //     service: 'gmail',
// //     auth: {
// //       user: process.env.EMAIL_USER,
// //       pass: process.env.EMAIL_PASS
// //     }
// //   });

// //   const mailOptions = {
// //     from: `"Women Safety App" <${process.env.EMAIL_USER}>`,
// //     to: toEmail,
// //     subject: '?? SOS Alert - You were selected as a nearest helper!',
// //     html: `
// //       <p>Hi <b>${safeHelperName}</b>,</p>
// //       <p><b>${safeSenderName}</b> (<a href="mailto:${safeSenderEmail}">${safeSenderEmail}</a>) 
// //          has selected you as the nearest helper via the Women Safety App.</p>
// //       <p>Requester location: 
// //          <a href="${locationURL}" target="_blank" rel="noopener noreferrer">
// //          ?? Open Directions in Google Maps
// //          </a>
// //       </p>
// //       <p><b>Time:</b> ${timeIST}</p>
// //       <p>Please check your app and respond quickly!</p>
// //       <hr>
// //       <small>This is an automated alert from Women Safety App. Replying to this email will contact the requester directly.</small>
// //     `,
// //     replyTo: safeSenderEmail
// //   };

// //   try {
// //     const info = await transporter.sendMail(mailOptions);
// //     console.log('? Email sent:', info.response);
// //   } catch (error) {
// //     console.error('? Error sending email:', error);
// //   }
// // }

// // module.exports = sendNearestUserEmailNotification;
