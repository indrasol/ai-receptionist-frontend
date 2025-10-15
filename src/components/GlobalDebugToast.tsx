import React from 'react';
import { PersistentDebugToast } from './PersistentDebugToast';
import { useScrapeContext } from '@/contexts/ScrapeContext';

export const GlobalDebugToast: React.FC = () => {
  const { task, logs, clearTask } = useScrapeContext();

  return (
    <PersistentDebugToast
      task={task}
      logs={logs}
      onClearTask={clearTask}
      isVisible={task !== null || logs.length > 0}
    />
  );
};
