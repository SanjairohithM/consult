const jwt = require('jsonwebtoken');
const axios = require('axios');

// Test the current token
const currentToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJwcFBTM29yU1N4QzFpZXN4VkdXcTRnIiwiZXhwIjoxNzg2MTIyMjQ5LCJpYXQiOjE3NTQ1ODYyNDl9.hg7c_os1_zBXMBfu392lF1Qf4OG679674UPQmLBXAC0';

console.log('=== TESTING CURRENT TOKEN ===');
console.log('Token:', currentToken);

// Decode the token to see what's in it
try {
  const decoded = jwt.decode(currentToken);
  console.log('\n=== DECODED TOKEN ===');
  console.log('Header:', decoded.header);
  console.log('Payload:', decoded.payload);
  console.log('Issuer (iss):', decoded.payload.iss);
  console.log('Expires (exp):', new Date(decoded.payload.exp * 1000).toISOString());
} catch (error) {
  console.log('Error decoding token:', error.message);
}

// Test the token with Zoom API
async function testZoomToken() {
  try {
    console.log('\n=== TESTING WITH ZOOM API ===');
    const response = await axios.get('https://api.zoom.us/v2/users/me', {
      headers: {
        'Authorization': `Bearer ${currentToken}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Token is valid!');
    console.log('User info:', response.data);
  } catch (error) {
    console.log('❌ Token is invalid');
    console.log('Error:', error.response?.data || error.message);
    
    if (error.response?.data?.code === 124) {
      console.log('\n=== SOLUTION ===');
      console.log('The Client Secret is incorrect. Please:');
      console.log('1. Go to https://marketplace.zoom.us/');
      console.log('2. Sign in and go to "Develop" → "Build App"');
      console.log('3. Create a "JWT App"');
      console.log('4. Copy the correct Client Secret from your app');
      console.log('5. Update the generate-zoom-jwt.js file with the correct secret');
    }
  }
}

testZoomToken(); 