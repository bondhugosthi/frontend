import { useEffect, useState } from 'react';
import { settingsAPI } from './api';

const useSettings = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchSettings = async () => {
      try {
        const response = await settingsAPI.get();
        if (isMounted) {
          setSettings(response.data || null);
        }
      } catch (error) {
        if (isMounted) {
          setSettings(null);
        }
      }
    };

    fetchSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  return settings;
};

export default useSettings;
