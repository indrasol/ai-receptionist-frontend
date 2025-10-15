import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PersistentDebugToastProps {
  task: { id: string; status: string } | null;
  logs: string[];
  onClearTask: () => void;
  isVisible: boolean;
}

export const PersistentDebugToast: React.FC<PersistentDebugToastProps> = ({
  task,
  logs,
  onClearTask,
  isVisible
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClosed, setIsClosed] = useState(() => {
    return localStorage.getItem('debugToastClosed') === 'true';
  });

  // Reset closed state when a new task starts
  useEffect(() => {
    if (task && task.status === 'queued' && isClosed) {
      setIsClosed(false);
      localStorage.removeItem('debugToastClosed');
    }
  }, [task, isClosed]);

  const handleClose = () => {
    setIsClosed(true);
    localStorage.setItem('debugToastClosed', 'true');
  };

  if (!isVisible || (!task && logs.length === 0) || isClosed) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full">
      <Card className="shadow-lg border-2 border-primary/20 bg-background/95 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              {task && task.status !== 'completed' && task.status !== 'failed' ? (
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              ) : (
                <div className="w-2 h-2 bg-green-500 rounded-full" />
              )}
              <span>Website Scraping</span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-6 w-6 p-0"
              >
                {isExpanded ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronUp className="w-3 h-3" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                title="Close debug toast"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">
              Status: {task ? `${task.status}` : 'No active task'}
            </div>
            
            {isExpanded && (
              <>
                {logs.length > 0 && (
                  <div className="max-h-32 overflow-y-auto bg-muted/30 rounded p-2 text-xs font-mono space-y-1">
                    {logs.slice(-10).map((log, i) => (
                      <div key={`log-${i}-${log.slice(0, 20)}`} className="text-muted-foreground">
                        {log.replace('Scraping', 'Reading').replace('Scrape finished', 'Website reading finished')}
                      </div>
                    ))}
                    {logs.length > 10 && (
                      <div className="text-xs text-muted-foreground/60">
                        ... and {logs.length - 10} more entries
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
            
            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-muted-foreground">
                {logs.length} logs
              </span>
              {/* {task && (
                <Button
                  onClick={onClearTask}
                  size="sm"
                  variant="outline"
                  className="text-xs h-6 px-2 text-red-600 hover:text-red-700 border-red-300"
                >
                  Clear
                </Button>
              )} */}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
