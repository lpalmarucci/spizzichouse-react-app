import i18n from "i18next";
import it from "./assets/translations/it.json";
import { initReactI18next } from "react-i18next";

// initialize i18next with catalog and language to use
i18n.use(initReactI18next).init({
  resources: {
    it: {
      translation: it,
    },
  },
  lng: "it",
});
