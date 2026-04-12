import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeLangContext = createContext({});

export const t_dict = {
  English: { accountSettings: 'Account Settings', preferences: 'Preferences', save: 'Save Changes' },
  Spanish: { accountSettings: 'Configuración de la cuenta', preferences: 'Preferencias', save: 'Guardar cambios' },
  French: { accountSettings: 'Paramètres du compte', preferences: 'Préférences', save: 'Enregistrer' },
  German: { accountSettings: 'Kontoeinstellungen', preferences: 'Präferenzen', save: 'Änderungen speichern' },
};

export const ThemeLangProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('English');

  useEffect(() => {
    const isDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [theme]);

  return (
    <ThemeLangContext.Provider value={{ theme, language, setTheme, setLanguage }}>
      {children}
    </ThemeLangContext.Provider>
  );
};

export const useThemeLang = () => useContext(ThemeLangContext);