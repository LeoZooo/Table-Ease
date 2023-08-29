const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const filePath = path.join(__dirname, '../../.env');

dotenv.config({ path: filePath });

const generateRandomCode = (length) => {
  const characters = '0123456789';
  let code = '';
  for (let i = 0; i < length; i += 1) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }
  return code;
};

// Generate a 6 numbers code and replced to the .env file
const saveVerificationCodeToEnvFile = () => {
  const newCode = generateRandomCode(6);
  process.env.VERIFICATION_CODE = newCode;

  const existingEnvData = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
  const updatedEnvData = existingEnvData.replace(/^VERIFICATION_CODE=.*/m, `VERIFICATION_CODE=${newCode}`);

  fs.writeFileSync(filePath, updatedEnvData);

  return newCode;
};

// Auto change the verfication code every 12 hours.
const generateVerificationCode = (time) => {
  return setInterval(saveVerificationCodeToEnvFile, time);
};

module.exports = generateVerificationCode;
