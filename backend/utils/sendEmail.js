const axios = require('axios');

// ─── Reusable Email Wrapper ───────────────────────────────────────────────────
function buildEmailHTML({ badgeText, title, subtitle, infoItems, policeItems, mapUrl, footerNote }) {

  // infoItems: array of { label, value, wide?, danger? }
  function renderInfoItem({ label, value, wide = false, danger = false }) {
    return `
      <td style="
        width: ${wide ? '100%' : '50%'};
        padding: 4px;
        box-sizing: border-box;
        vertical-align: top;
        display: inline-block;
      ">
        <div style="
          background: #fdf5f7;
          border: 1px solid #f0dde3;
          border-radius: 8px;
          padding: 12px 14px;
        ">
          <div style="font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:4px;">${label}</div>
          <div style="font-size:14px;font-weight:600;color:${danger ? '#c0395a' : '#222'};">${value}</div>
        </div>
      </td>`;
  }

  const infoRows = infoItems || [];
  const policeRows = policeItems || [];

  const infoHTML = `
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      <tr style="display:flex;flex-wrap:wrap;">
        ${infoRows.map(renderInfoItem).join('')}
      </tr>
    </table>`;

  const policeHTML = policeRows.length ? `
    <div style="font-size:11px;font-weight:700;color:#c0395a;text-transform:uppercase;letter-spacing:1.5px;margin:20px 0 10px;">
      Nearest police station
    </div>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      <tr style="display:flex;flex-wrap:wrap;">
        ${policeRows.map(renderInfoItem).join('')}
      </tr>
    </table>` : '';

  const mapButton = mapUrl ? `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;">
      <tr><td>
        <a href="${mapUrl}" target="_blank"
          style="display:block;background:#c0395a;color:#fff;text-align:center;
                 padding:14px;border-radius:8px;font-size:14px;font-weight:700;
                 text-decoration:none;letter-spacing:0.3px;">
          Open location in Google Maps
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
<body style="margin:0;padding:0;background:#f4f6f9;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;" cellpadding="0" cellspacing="0">

        <!-- CARD -->
        <tr>
          <td style="background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e8eaed;">

            <!-- HEADER -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#c0395a;padding:36px 36px 28px;">

                  <!-- Brand row -->
                  <table cellpadding="0" cellspacing="0" style="margin-bottom:18px;">
                    <tr>
                      <td style="background:rgba(255,255,255,0.15);border-radius:8px;width:36px;height:36px;text-align:center;vertical-align:middle;font-size:18px;">🛡️</td>
                      <td style="padding-left:10px;font-size:13px;font-weight:700;color:rgba(255,255,255,0.9);letter-spacing:2px;text-transform:uppercase;vertical-align:middle;">VIGILANT</td>
                    </tr>
                  </table>

                  <!-- Badge -->
                  <div style="display:inline-block;background:rgba(255,255,255,0.18);border:1px solid rgba(255,255,255,0.3);border-radius:4px;padding:4px 12px;margin-bottom:12px;">
                    <span style="color:#fff;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">${badgeText}</span>
                  </div>

                  <div style="font-size:24px;font-weight:700;color:#fff;line-height:1.25;margin-bottom:6px;">${title}</div>
                  <div style="font-size:13px;color:rgba(255,255,255,0.75);">${subtitle}</div>
                </td>
              </tr>
            </table>

            <!-- BODY -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:28px 36px;">

                  <div style="font-size:11px;font-weight:700;color:#c0395a;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:10px;">
                    Alert details
                  </div>

                  ${infoHTML}
                  ${policeHTML}
                  ${mapButton}

                  <!-- Note -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;">
                    <tr>
                      <td style="background:#fdf5f7;border-left:3px solid #c0395a;border-radius:0 6px 6px 0;padding:12px 16px;font-size:13px;color:#666;line-height:1.6;">
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
          <td style="text-align:center;padding:16px 0 8px;">
            <p style="margin:0;font-size:12px;color:#aaa;line-height:1.8;">
              Automated alert from <strong style="color:#c0395a;">Vigilant</strong> — Women Safety Network.<br/>
              Do not reply to this email.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── Send Email via Brevo HTTP API ────────────────────────────────────────────
async function sendEmail({ to, subject, html, text }) {
  if (!process.env.BREVO_API_KEY) {
    console.error('❌ Missing BREVO_API_KEY in environment variables.');
    return;
  }

  const emailHtml = html || buildEmailHTML({
    badgeText: 'Notification',
    title: 'Vigilant Alert',
    subtitle: 'Women Safety Network',
    infoItems: [{ label: 'Message', value: text || '', wide: true }],
    footerNote: 'Please take immediate action if required.'
  });

  try {
    const response = await axios.post('https://api.brevo.com/v3/smtp/email', {
      sender: { name: 'Vigilant', email: 'noreply.womensafety@gmail.com' },
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


// ─── Example usage ────────────────────────────────────────────────────────────
//
// const { buildEmailHTML, sendEmail } = require('./emailService');
//
// const html = buildEmailHTML({
//   badgeText: 'SOS Alert',
//   title: 'Emergency Alert Triggered',
//   subtitle: 'Immediate attention required — Priya Sharma',
//
//   infoItems: [
//     { label: 'User',             value: 'Priya Sharma' },
//     { label: 'Time',             value: 'Apr 6, 2026 · 10:42 PM' },
//     { label: 'Safety score',     value: '12 / 100',         danger: true },
//     { label: 'Threat detected',  value: 'Weapon (knife)' },
//     { label: 'Location',         value: '12.9716° N, 79.1589° E — Vellore, TN', wide: true },
//   ],
//
//   policeItems: [
//     { label: 'Station',  value: 'Vellore Town PS' },
//     { label: 'Distance', value: '0.8 km away' },
//   ],
//
//   mapUrl: 'https://maps.google.com/?q=12.9716,79.1589',
//
//   footerNote: 'This alert was automatically triggered by Vigilant\'s AI safety system. '
//             + 'If you are an emergency contact, please check on the user immediately '
//             + 'or contact local authorities.',
// });
//
// await sendEmail({ to: 'guardian@example.com', subject: '🚨 SOS Alert — Priya Sharma', html });