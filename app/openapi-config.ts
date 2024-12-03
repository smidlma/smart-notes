import type { ConfigFile } from '@rtk-query/codegen-openapi';

const openAPIConfig: ConfigFile = {
  schemaFile: 'http://localhost:8000/openapi.json',
  apiFile: './src/services/api/empty-api.ts',
  apiImport: 'emptyApi',
  outputFile: './src/services/api/api.ts',
  exportName: 'api',
  hooks: true,
  tag: true,
};

export default openAPIConfig;
