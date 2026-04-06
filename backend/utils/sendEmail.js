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
//       from: '"Vigilant 🛡️" <noreply.womensafety@gmail.com>', // ✅ verified sender
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


const axios = require('axios');

// ─── Reusable Email Wrapper ───────────────────────────────────────────────────
function buildEmailHTML({ badgeText, title, subtitle, rows, mapUrl, mapLabel, footerNote }) {
  const rowsHTML = rows.map(({ icon, label, value }) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #f5e6e8;width:40px;vertical-align:middle;font-size:18px;">${icon}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f5e6e8;font-size:13px;color:#999;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;vertical-align:middle;width:110px;">${label}</td>
      <td style="padding:10px 0;border-bottom:1px solid #f5e6e8;font-size:14px;color:#333;font-weight:500;vertical-align:middle;">${value}</td>
    </tr>
  `).join('');

  const mapButton = mapUrl ? `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0 0;">
      <tr><td align="center">
        <a href="${mapUrl}" target="_blank"
          style="display:inline-block;background:linear-gradient(135deg,#e74c6f,#c0395a);color:#fff;
                 font-size:15px;font-weight:700;padding:15px 40px;border-radius:50px;
                 text-decoration:none;letter-spacing:0.5px;box-shadow:0 4px 15px rgba(231,76,111,0.4);">
          📍 ${mapLabel || 'Open in Google Maps'}
        </a>
      </td></tr>
    </table>` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f0f2f5;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f2f5;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:580px;" cellpadding="0" cellspacing="0">

        <!-- TOP LOGO BAR -->
        <tr>
          <td align="center" style="padding-bottom:20px;">
            <table cellpadding="0" cellspacing="0">
              <tr><td style="font-size:22px;font-weight:800;color:#e74c6f;letter-spacing:1px;">🛡️ VIGILANT</td></tr>
              <tr><td align="center" style="font-size:11px;color:#999;letter-spacing:3px;text-transform:uppercase;padding-top:4px;">Women Safety Network</td></tr>
            </table>
          </td>
        </tr>

        <!-- MAIN CARD -->
        <tr>
          <td style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.10);">

            <!-- ALERT BANNER -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:linear-gradient(135deg,#e74c6f 0%,#c0395a 100%);padding:28px 32px;text-align:center;">
                  <div style="display:inline-block;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);border-radius:50px;padding:6px 20px;margin-bottom:14px;">
                    <span style="color:#fff;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">${badgeText}</span>
                  </div>
                  <div style="font-size:26px;font-weight:800;color:#fff;line-height:1.2;margin-top:4px;">${title}</div>
                  <div style="font-size:14px;color:rgba(255,255,255,0.8);margin-top:8px;">${subtitle}</div>
                </td>
              </tr>
            </table>

            <!-- BODY -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:32px;">
                  <table width="100%" cellpadding="0" cellspacing="0"
                    style="background:#fdf5f7;border-radius:12px;border:1px solid #f5dde3;overflow:hidden;">
                    <tr>
                      <td colspan="3" style="padding:14px 20px 10px;font-size:11px;font-weight:700;color:#c0395a;text-transform:uppercase;letter-spacing:1.5px;border-bottom:1px solid #f5dde3;">
                        Alert Information
                      </td>
                    </tr>
                    <tr><td colspan="3" style="padding:0 20px;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        ${rowsHTML}
                      </table>
                    </td></tr>
                  </table>

                  ${mapButton}

                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
                    <tr>
                      <td style="background:#fff8f9;border-left:3px solid #e74c6f;border-radius:0 8px 8px 0;padding:14px 16px;font-size:13px;color:#777;line-height:1.6;">
                        ${footerNote}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="text-align:center;padding:20px 0 8px;">
            <p style="margin:0;font-size:12px;color:#aaa;line-height:1.8;">
              This is an automated alert from <strong style="color:#e74c6f;">Vigilant</strong> — Women Safety Network.<br/>
              Do not reply to this email directly.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── Send Email via Brevo HTTP API (works on Render free tier) ────────────────
async function sendEmail({ to, subject, html, text }) {
  if (!process.env.BREVO_API_KEY) {
    console.error('❌ Missing BREVO_API_KEY in environment variables.');
    return;
  }

  const emailHtml = html || buildEmailHTML({
    badgeText: '📢 Notification',
    title: 'Vigilant Alert',
    subtitle: 'Women Safety Network',
    rows: [{ icon: '📝', label: 'Message', value: text || '' }],
    footerNote: 'Please take immediate action if required.'
  });

  try {
    const response = await axios.post('https://api.brevo.com/v3/smtp/email', {
      sender: { name: 'Vigilant 🛡️', email: 'noreply.womensafety@gmail.com' },
      to: [{ email: to }],
      subject,
      htmlContent: emailHtml
    }, {
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Email sent via Brevo API:', response.data.messageId);
    return response.data;
  } catch (error) {
    console.error('❌ Error sending email:', error.response?.data || error.message);
    throw error;
  }
}

module.exports = { sendEmail, buildEmailHTML };