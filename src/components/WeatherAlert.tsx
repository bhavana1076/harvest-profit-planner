import { AlertTriangle, CloudRain, Sun, X } from 'lucide-react';
import { WeatherAlert as WeatherAlertType } from '@/types';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface WeatherAlertProps {
  alerts: WeatherAlertType[];
}

export function WeatherAlertBanner({ alerts }: WeatherAlertProps) {
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  const visibleAlerts = alerts.filter(a => !dismissedIds.includes(a.id));

  if (visibleAlerts.length === 0) return null;

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-destructive/10 border-destructive/30 text-destructive';
      case 'medium':
        return 'bg-warning/10 border-warning/30 text-warning-foreground';
      default:
        return 'bg-primary/10 border-primary/30 text-primary';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="h-5 w-5" />;
      case 'medium':
        return <CloudRain className="h-5 w-5" />;
      default:
        return <Sun className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-2">
      {visibleAlerts.map(alert => (
        <div
          key={alert.id}
          className={cn(
            'flex items-start gap-3 p-3 rounded-lg border',
            getSeverityStyles(alert.severity)
          )}
        >
          <div className="flex-shrink-0 mt-0.5">
            {getSeverityIcon(alert.severity)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">{alert.title}</p>
            <p className="text-sm opacity-80">{alert.description}</p>
            {alert.region && (
              <p className="text-xs mt-1 opacity-60">Region: {alert.region}</p>
            )}
          </div>
          <button
            onClick={() => setDismissedIds([...dismissedIds, alert.id])}
            className="flex-shrink-0 p-1 hover:opacity-70 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
