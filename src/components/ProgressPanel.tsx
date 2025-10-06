import { Loader2 } from 'lucide-react';

export const ProgressPanel = ({ logs }: { logs: string[] }) => {
  console.log('ProgressPanel received logs:', logs);
  
  return (
    <div className="border rounded-md bg-muted/30 p-3 mt-4 h-48 overflow-y-auto text-xs leading-relaxed font-mono">
      {logs.length === 0 ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          Reading website …
        </div>
      ) : (
        <div className="space-y-1">
          {logs.map((log, i) => (
            <div key={`log-${i}-${log.slice(0, 20)}`} className="text-muted-foreground">
              {log.replace('Scraping', 'Reading').replace('Scrape finished', 'Website reading finished')}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
