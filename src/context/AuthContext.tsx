import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Company {
  id: string;
  name: string;
  industry: string;
  headquarters: string;
  code: string;
  logoColor: string;
}

export const PRESET_COMPANIES: Company[] = [
  { id: 'c1', name: 'Apex Microelectronics', industry: 'Semiconductors & Electronics', headquarters: 'Shenzhen, China', code: 'APEX', logoColor: '#00f2fe' },
  { id: 'c2', name: 'GlobalTech Logistics', industry: 'Freight Forwarding & Warehousing', headquarters: 'Rotterdam, Netherlands', code: 'GTL', logoColor: '#4facfe' },
  { id: 'c3', name: 'Acme Supply Systems', industry: 'Automotive & Assembly Parts', headquarters: 'Stuttgart, Germany', code: 'ACME', logoColor: '#f59e0b' },
  { id: 'c4', name: 'Nexus Pharma Global', industry: 'Cold Chain Pharmaceuticals', headquarters: 'Basel, Switzerland', code: 'NEXUS', logoColor: '#10b981' },
  { id: 'c5', name: 'Titan Heavy Machinery', industry: 'Industrial & Heavy Equipment', headquarters: 'Los Angeles, USA', code: 'TITAN', logoColor: '#8b5cf6' }
];

interface AuthContextType {
  currentCompany: Company;
  allCompanies: Company[];
  loginCompany: (companyId: string) => void;
  registerCompany: (newCompany: Omit<Company, 'id' | 'logoColor'>) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [companies, setCompanies] = useState<Company[]>(() => {
    const saved = localStorage.getItem('supplysense_companies');
    return saved ? JSON.parse(saved) : PRESET_COMPANIES;
  });

  const [currentCompany, setCurrentCompany] = useState<Company>(() => {
    const saved = localStorage.getItem('supplysense_active_company');
    if (saved) {
      const parsed = JSON.parse(saved);
      const exists = companies.find(c => c.id === parsed.id);
      if (exists) return exists;
    }
    return companies[0];
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('supplysense_companies', JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    localStorage.setItem('supplysense_active_company', JSON.stringify(currentCompany));
  }, [currentCompany]);

  const loginCompany = (companyId: string) => {
    const target = companies.find(c => c.id === companyId);
    if (target) {
      setCurrentCompany(target);
      setIsAuthModalOpen(false);
    }
  };

  const registerCompany = (newCompanyData: Omit<Company, 'id' | 'logoColor'>) => {
    const newComp: Company = {
      ...newCompanyData,
      id: `c_${Date.now()}`,
      logoColor: '#6366f1'
    };
    setCompanies(prev => [...prev, newComp]);
    setCurrentCompany(newComp);
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        currentCompany,
        allCompanies: companies,
        loginCompany,
        registerCompany,
        isAuthModalOpen,
        setIsAuthModalOpen
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
