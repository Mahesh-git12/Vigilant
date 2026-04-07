
const axios = require('axios');
const { buildEmailHTML } = require('./sendEmail');

async function sendNearestUserEmailNotification(toEmail, helperName, senderName, senderEmail, latitude, longitude) {
  console.log('Email Data:', { toEmail, helperName, senderName, senderEmail, latitude, longitude });

  const safeHelperName = helperName || 'Helper';
  const safeSenderName = senderName || 'Someone in need';
  const safeSenderEmail = senderEmail || 'no-reply@example.com';
  const safeLat = latitude || '0';
  const safeLng = longitude || '0';

  const mapUrl = `https://www.google.com/maps/dir/?api=1&destination=${safeLat},${safeLng}`;
  const timeIST = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", hour12: true });

  if (!process.env.BREVO_API_KEY) {
    console.error('❌ Missing BREVO_API_KEY in environment variables.');
    return;
  }

  const html = buildEmailHTML({
    badgeText: '🚨 Nearest Helper Alert',
    title: 'Someone Needs Your Help!',
    subtitle: `Hi ${safeHelperName}, you've been identified as the nearest available helper`,
    rows: [
      { icon: '👤', label: 'Name',     value: safeSenderName },
      { icon: '✉️', label: 'Email',    value: `<a href="mailto:${safeSenderEmail}" style="color:#e74c6f;text-decoration:none;">${safeSenderEmail}</a>` },
      { icon: '📍', label: 'Location', value: `Lat: ${safeLat}, Lon: ${safeLng}` },
      { icon: '🕐', label: 'Time',     value: timeIST },
    ],
    mapUrl,
    mapLabel: 'Navigate to Their Location',
    footerNote: `Please open the <strong>Vigilant app</strong> immediately and respond to <strong>${safeSenderName}</strong>. Your quick action can save a life.`
  });

  try {
    const response = await axios.post('https://api.brevo.com/v3/smtp/email', {
      sender: { name: 'Vigilant 🛡️', email: 'noreply.womensafety@gmail.com' },
      to: [{ email: toEmail }],
      replyTo: { email: safeSenderEmail },
      subject: `🚨 SOS Alert — ${safeSenderName} Needs Your Help Now`,
      htmlContent: html
    }, {
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ SOS email sent to', toEmail, response.data.messageId);
  } catch (error) {
    console.error('❌ Failed to send SOS email to', toEmail, error.response?.data || error.message);
  }
}

module.exports = sendNearestUserEmailNotification;
