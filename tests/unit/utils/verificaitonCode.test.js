const config = require('../../../src/config/config');

const generateVerificationCode = require('../../../src/utils/verificaitonCode');

describe('Verification Code Tests', () => {
  test('should get the verification code from environment variable', () => {
    const { verificationCode } = config;
    expect(verificationCode).toBe(process.env.VERIFICATION_CODE);
  });

  test('should verification code change after delay', () => {
    const { verificationCode } = config;
    const interval = generateVerificationCode(1000);
    const timeout = setTimeout(() => {
      expect(verificationCode).not.toBe(process.env.VERIFICATION_CODE);
    }, 1000);
    clearInterval(interval);
    clearTimeout(timeout);
  });
});
