import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeLangContextType {
  theme: Theme;
  language: string;
  setTheme: (t: Theme) => void;
  setLanguage: (l: string) => void;
}

const ThemeLangContext = createContext<ThemeLangContextType>({} as ThemeLangContextType);

// Dummy Dictionary Strings to demonstrate language shift.
export const t_dict: Record<string, any> = {
  'English': { accountSettings: 'Account Settings', preferences: 'Preferences', save: 'Save Changes' },
  'Spanish': { accountSettings: 'Configuración de la cuenta', preferences: 'Preferencias', save: 'Guardar cambios' },
  'French': { accountSettings: 'Paramètres du compte', preferences: 'Préférences', save: 'Enregistrer' },
  'German': { accountSettings: 'Kontoeinstellungen', preferences: 'Präferenzen', save: 'Änderungen speichern' },
};

export const ThemeLangProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [language, setLanguage] = useState<string>('English');

  useEffect(() => {
    // Determine active theme
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
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
