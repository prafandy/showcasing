import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18next
  .use(LanguageDetector)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['id', 'en'],
    debug: false,
    detection: {
      order: ['path'],
      lookupFromPathIndex: 0,
    },
    resources: {
      en: {
        translation: {
          components: {
            errors: {
              networkError: {
                title: "Network error",
                message: "There seems to be an issue with the network. Please try again later.",
                retryingMessage: "We are attempting to reload this feature",
              },
              serverTimeout: {
                title: "Server timeout",
                message: "Our servers are taking too long to respond to this request. Please try again later.",
                retryingMessage: "We are attempting to reload this feature",
              },
              unexpectedError: {
                title: "Unexpected error",
                message: "Our team has been informed and will be looking into this shortly.",
              },
            },
          },
        }
      },
      id: {
        translation: {
          components: {
            errors: {
              networkError: {
                title: "Jaringan bermasalah",
                message: "There seems to be an issue with the network. Please try again later.",
                retryingMessage: "We are attempting to reload this feature",
              },
              serverTimeout: {
                title: "Koneksi ke server terputus",
                message: "Our servers are taking too long to respond to this request. Please try again later.",
                retryingMessage: "We are attempting to reload this feature",
              },
              unexpectedError: {
                title: "Masalah tidak teridentifikasi",
                message: "Our team has been informed and will be looking into this shortly.",
              },
            },
          },
        }
      }
    },
  });

export default i18next;
