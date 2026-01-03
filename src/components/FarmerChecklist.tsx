import { useState } from 'react';
import { CheckSquare, Square } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const CHECKLIST_ITEMS = [
  { id: 1, label: 'Bags/packaging ready', category: 'Preparation' },
  { id: 2, label: 'Quality check completed', category: 'Preparation' },
  { id: 3, label: 'Weighed and recorded quantity', category: 'Preparation' },
  { id: 4, label: 'Invoice/bill prepared', category: 'Documents' },
  { id: 5, label: 'ID documents ready', category: 'Documents' },
  { id: 6, label: 'Transport arranged', category: 'Logistics' },
  { id: 7, label: 'Loading assistance confirmed', category: 'Logistics' },
  { id: 8, label: 'Market timing confirmed', category: 'Logistics' },
];

export function FarmerChecklist() {
  const [checked, setChecked] = useState<number[]>([]);

  const toggle = (id: number) => {
    setChecked(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const progress = (checked.length / CHECKLIST_ITEMS.length) * 100;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base">
          <span className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-primary" />
            Pre-Sale Checklist
          </span>
          <span className="text-sm font-normal text-muted-foreground">
            {checked.length}/{CHECKLIST_ITEMS.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Progress bar */}
        <div className="h-2 bg-muted rounded-full mb-4 overflow-hidden">
          <div
            className="h-full bg-success transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="space-y-2">
          {CHECKLIST_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => toggle(item.id)}
              className={cn(
                "w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors",
                checked.includes(item.id)
                  ? "bg-success/10 text-success"
                  : "hover:bg-muted"
              )}
            >
              {checked.includes(item.id) ? (
                <CheckSquare className="h-5 w-5 flex-shrink-0" />
              ) : (
                <Square className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
              )}
              <span className={cn(
                "text-sm",
                checked.includes(item.id) && "line-through"
              )}>
                {item.label}
              </span>
              <span className="ml-auto text-xs text-muted-foreground">
                {item.category}
              </span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
