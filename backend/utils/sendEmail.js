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

async function sendEmail({ to, subject, text, html }) {
  if (!process.env.BREVO_SMTP_USER || !process.env.BREVO_SMTP_PASS) {
    console.error('❌ Missing BREVO_SMTP_USER or BREVO_SMTP_PASS in environment variables.');
    return;
  }

  // Wrap plain text in Vigilant branded HTML if no html provided
  const emailHtml = html || `
  <!DOCTYPE html>
  <html>
  <head><meta charset="UTF-8"/></head>
  <body style="margin:0;padding:0;background:#f4f4f7;font-family:'Segoe UI',Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:40px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
            <tr>
              <td style="background:linear-gradient(135deg,#e74c6f,#c0395a);padding:28px 40px;text-align:center;">
                <h1 style="margin:0;color:#fff;font-size:24px;font-weight:700;">🛡️ Vigilant</h1>
                <p style="margin:4px 0 0;color:#ffd6e0;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Women Safety Network</p>
              </td>
            </tr>
            <tr>
              <td style="padding:36px 40px;font-size:15px;color:#444;line-height:1.8;">
                ${text}
              </td>
            </tr>
            <tr>
              <td style="background:#f9f9f9;padding:16px 40px;text-align:center;border-top:1px solid #eee;">
                <p style="margin:0;font-size:12px;color:#aaa;">This is an automated message from <strong>Vigilant</strong> — Women Safety Network.</p>
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
      to,
      subject,
      html: emailHtml
    });
    console.log('✅ Email sent via Brevo:', info.response);
    return info;
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    throw error;
  }
}

module.exports = sendEmail;
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

// async function sendEmail({ to, subject, text, html }) {
//   if (!process.env.BREVO_SMTP_USER || !process.env.BREVO_SMTP_PASS) {
//     console.error('❌ Missing BREVO_SMTP_USER or BREVO_SMTP_PASS in environment variables.');
//     return;
//   }

//   // Wrap plain text in Vigilant branded HTML if no html provided
//   const emailHtml = html || `
//   <!DOCTYPE html>
//   <html>
//   <head><meta charset="UTF-8"/></head>
//   <body style="margin:0;padding:0;background:#f4f4f7;font-family:'Segoe UI',Arial,sans-serif;">
//     <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:40px 0;">
//       <tr>
//         <td align="center">
//           <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
//             <tr>
//               <td style="background:linear-gradient(135deg,#e74c6f,#c0395a);padding:28px 40px;text-align:center;">
//                 <h1 style="margin:0;color:#fff;font-size:24px;font-weight:700;">🛡️ Vigilant</h1>
//                 <p style="margin:4px 0 0;color:#ffd6e0;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Women Safety Network</p>
//               </td>
//             </tr>
//             <tr>
//               <td style="padding:36px 40px;font-size:15px;color:#444;line-height:1.8;">
//                 ${text}
//               </td>
//             </tr>
//             <tr>
//               <td style="background:#f9f9f9;padding:16px 40px;text-align:center;border-top:1px solid #eee;">
//                 <p style="margin:0;font-size:12px;color:#aaa;">This is an automated message from <strong>Vigilant</strong> — Women Safety Network.</p>
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
//       to,
//       subject,
//       html: emailHtml
//     });
//     console.log('✅ Email sent via Brevo:', info.response);
//     return info;
//   } catch (error) {
//     console.error('❌ Error sending email:', error.message);
//     throw error;
//   }
// }

// module.exports = sendEmail;
// const { Resend } = require('resend');

// async function sendEmail({ to, subject, text, html }) {
//   if (!process.env.RESEND_API_KEY) {
//     console.error('❌ Missing RESEND_API_KEY in environment variables.');
//     return;
//   }

//   const resend = new Resend(process.env.RESEND_API_KEY);

//   try {
//     const { data, error } = await resend.emails.send({
//       from: 'Women Safety App <onboarding@resend.dev>', // ✅ Resend free default sender
//       to,
//       subject,
//       // Support both plain text and html
//       ...(html ? { html } : { html: `<p>${text}</p>` })
//     });

//     if (error) {
//       console.error('❌ Resend error:', error);
//       throw error;
//     }

//     console.log('✅ Email sent via Resend:', data.id);
//     return data;
//   } catch (error) {
//     console.error('❌ Error sending email:', error);
//     throw error;
//   }
// }

// module.exports = sendEmail;
// // const nodemailer = require('nodemailer');

// // const transporter = nodemailer.createTransport({
// //   service: 'gmail',
// //   auth: {
// //     user: process.env.EMAIL_USER,
// //     pass: process.env.EMAIL_PASS,
// //   },
// // });

// // async function sendEmail({ to, subject, text }) {
// //   const mailOptions = {
// //     from: process.env.EMAIL_USER,
// //     to,
// //     subject,
// //     text,
// //   };
// //   return transporter.sendMail(mailOptions);
// // }

// // module.exports = sendEmail;
