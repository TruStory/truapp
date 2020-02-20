import AppConfig from 'shared/app-config.json';

export const generateDocumentTitle = (appendString: string) => {
  document.title = `${AppConfig.app_name} - ${appendString}`;
};
