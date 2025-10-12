import React, { createContext, useContext, useState } from 'react';
import { useScrapeTask } from '@/hooks/useScrapeTask';

interface ScrapeContextType {
  task: { id: string; status: string } | null;
  logs: string[];
  startScrape: (url: string) => Promise<void>;
  clearTask: () => Promise<void>;
  setReceptionistId: (id: string) => void;
}

const ScrapeContext = createContext<ScrapeContextType | undefined>(undefined);

export const useScrapeContext = () => {
  const context = useContext(ScrapeContext);
  if (!context) {
    throw new Error('useScrapeContext must be used within a ScrapeProvider');
  }
  return context;
};

export const ScrapeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [receptionistId, setReceptionistId] = useState<string>('');
  
  // Use the existing useScrapeTask hook
  const { task, logs, startScrape: originalStartScrape, clearTask } = useScrapeTask(receptionistId);

  // Wrapper function to match the expected interface
  const startScrape = async (url: string) => {
    if (!receptionistId) {
      console.warn('No receptionist ID set in ScrapeContext');
      return;
    }
    return originalStartScrape(url);
  };

  const contextValue: ScrapeContextType = {
    task,
    logs,
    startScrape,
    clearTask,
    setReceptionistId,
  };

  return (
    <ScrapeContext.Provider value={contextValue}>
      {children}
    </ScrapeContext.Provider>
  );
};
