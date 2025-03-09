const getMissingVariables = (env: { [key: string]: string }): string[] =>
  Object.entries(env)
    .filter(([_, value]) => !value)
    .map(([key, _]) => key);

const validateAppEnv = () => {
  const env = {
    API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || '',
    STORAGE_UPLOAD_URL: process.env.EXPO_PUBLIC_STORAGE_UPLOAD_URL || '',
    VEXO_API_KEY: process.env.EXPO_PUBLIC_VEXO_API_KEY || '',
  };

  const missingVariables = getMissingVariables(env);
  if (missingVariables.length) {
    throw new Error(`Missing environment variables: ${missingVariables.join(', ')}`);
  }

  return env;
};

const { API_BASE_URL, STORAGE_UPLOAD_URL, VEXO_API_KEY } = validateAppEnv();

export { API_BASE_URL, STORAGE_UPLOAD_URL, VEXO_API_KEY };
