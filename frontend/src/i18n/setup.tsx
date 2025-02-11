import React from 'react';
import { IntlProvider } from 'react-intl';
import ptMessages from './pt.json';

const messages = {
  pt: ptMessages
};

export const i18nConfig = {
  defaultLocale: 'pt',
  messages
};

export const I18nProvider: React.FC = ({ children }) => (
  <IntlProvider
    messages={messages.pt}
    locale="pt"
    defaultLocale="pt"
  >
    {children}
  </IntlProvider>
);
