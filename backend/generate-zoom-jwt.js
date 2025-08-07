const jwt = require('jsonwebtoken');

// Your Zoom app credentials
const accountId = 'xb6DLvYuSvyblFTx3AG-4g';
const clientId = 'ppPS3orSSxC1iesxVGWq4g';
const clientSecret = 'nFxGcXdKHrz7R3GgyE9aYn8FSMdslGEv';

// Generate JWT token
const payload = {
  iss: clientId,
  exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 365), // 1 year expiration
};

const token = jwt.sign(payload, clientSecret);

console.log('=== ZOOM JWT TOKEN ===');
console.log(token);
console.log('\n=== ADD THIS TO YOUR .env FILE ===');
console.log(`ZOOM_JWT_TOKEN=${token}`);
console.log('\n=== TOKEN INFO ===');
console.log('Account ID:', accountId);
console.log('Client ID:', clientId);
console.log('Expires:', new Date(payload.exp * 1000).toISOString()); 