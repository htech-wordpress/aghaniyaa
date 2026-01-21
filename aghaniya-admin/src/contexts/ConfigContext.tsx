import React, { createContext, useContext, useEffect, useState } from 'react';
import { getDatabaseInstance } from '@/lib/firebase';
import { ref, get, child } from 'firebase/database';

interface CompanySettings {
    companyName: string;
    companyLogo: string;
    companyEmail: string;
    companyPhone: string;
    companyAddress: string;
    website: string;
}

interface ConfigContextType {
    companySettings: CompanySettings;
    loading: boolean;
}

const defaultCompanySettings: CompanySettings = {
    companyName: 'Aghaniya',
    companyLogo: '', // Fallback or empty
    companyEmail: '',
    companyPhone: '',
    companyAddress: '',
    website: 'https://aghaniyaenterprises.web.app',
};

const ConfigContext = createContext<ConfigContextType>({
    companySettings: defaultCompanySettings,
    loading: true,
});

export const useConfig = () => useContext(ConfigContext);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [companySettings, setCompanySettings] = useState<CompanySettings>(defaultCompanySettings);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            const db = getDatabaseInstance();
            if (!db) return;

            try {
                const snapshot = await get(child(ref(db), 'settings/company'));
                if (snapshot.exists()) {
                    setCompanySettings({ ...defaultCompanySettings, ...snapshot.val() });
                }
            } catch (error) {
                console.error("Failed to fetch company settings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    return (
        <ConfigContext.Provider value={{ companySettings, loading }}>
            {children}
        </ConfigContext.Provider>
    );
};
