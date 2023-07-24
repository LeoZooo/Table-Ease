const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../../verfication-code.txt');

const generateRandomCode = (length) => {
  const characters = '0123456789';
  let code = '';
  for (let i = 0; i < length; i += 1) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }
  return code;
};

const saveVerificationCodeToEnvFile = () => {
  const newCode = generateRandomCode(6);
  process.env.VERIFICATION_CODE = newCode;

  fs.writeFileSync(filePath, newCode, { flag: 'w' });

  // Auto change the verfication code every 12 hours.
  setTimeout(saveVerificationCodeToEnvFile, 1000 * 60 * 60 * 12);
};

saveVerificationCodeToEnvFile();

const getVerificationCode = () => {
  if (fs.existsSync(filePath)) {
    const code = fs.readFileSync(filePath, 'utf8');
    return code;
  }
  return null;
};

module.exports = getVerificationCode;
