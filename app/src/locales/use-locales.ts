import { useTranslation } from 'react-i18next';

export const useLocales = () => {
  const { t } = useTranslation();

  return {
    t,
  };
};
