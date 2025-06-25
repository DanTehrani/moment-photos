import 'dotenv/config';

const getEnvVar = <T>(key: string): T => {
  // eslint-disable-next-line security/detect-object-injection
  const value = process.env[key];

  if (!value && process.env.MOCK_RESPONSE !== 'true') {
    throw new Error(`${key} is not set`);
  }

  return value as T;
};

export const OPENAI_API_KEY = getEnvVar<string>('OPENAI_API_KEY');
export const FIREBASE_PROJECT_ID = getEnvVar<string>('FIREBASE_PROJECT_ID');
export const FIREBASE_CLIENT_EMAIL = getEnvVar<string>('FIREBASE_CLIENT_EMAIL');
export const FIREBASE_PRIVATE_KEY = getEnvVar<string>('FIREBASE_PRIVATE_KEY');
