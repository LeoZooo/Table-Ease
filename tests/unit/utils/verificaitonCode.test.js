const fs = require('fs');
const dotenv = require('dotenv');
const getVerificationCode = require('../../../src/utils/verificaitonCode');

jest.mock('fs');

describe('get verification code', () => {
  beforeEach(() => {
    dotenv.config = jest.fn().mockImplementationOnce(() => {
      const envConfig = dotenv.parse('VERIFICATION_CODE=123456');
      Object.assign(process.env, envConfig);
    });

    fs.readFileSync = jest.fn().mockReturnValue('VERIFICATION_CODE=654321');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should get the verification code from environment variable', () => {
    const verificationCode = getVerificationCode();
    expect(verificationCode).toBe('123456');
  });

  test('should get the verification code from .env file if environment variable is not set', () => {
    process.env.VERIFICATION_CODE = '';

    const verificationCode = getVerificationCode();
    expect(verificationCode).toBe('654321');
  });

  test('should return null if the verification code is not found', () => {
    process.env.VERIFICATION_CODE = '';
    fs.readFileSync = jest.fn().mockReturnValue('');

    const verificationCode = getVerificationCode();
    expect(verificationCode).toBeNull();
  });
});
