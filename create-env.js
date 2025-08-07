const fs = require('fs');

const envContent = `ZOOM_JWT_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJwcFBTM29yU1N4QzFpZXN4VkdXcTRnIiwiZXhwIjoxNzg2MTIyMjQ5LCJpYXQiOjE3NTQ1ODYyNDl9.hg7c_os1_zBXMBfu392lF1Qf4OG679674UPQmLBXAC0
MONGODB_URI=mongodb://localhost:27017/counseling-platform
PORT=5000
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development`;

fs.writeFileSync('.env', envContent);
console.log('.env file created successfully!');
console.log('Content:');
console.log(envContent); 