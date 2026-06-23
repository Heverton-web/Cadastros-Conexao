import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '~/components/ui/card';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '~/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint: string;
  accent?: string;
  iconBg?: string;
}

const MetricCard = ({ icon: Icon, label, value, hint, accent = 'text-foreground', iconBg = 'bg-primary/10' }: MetricCardProps) => {
  return (
    <Card className="bg-gradient-to-br from-card/90 to-card/60 backdrop-blur border-border/30 shadow-lg hover:shadow-xl transition-shadow">
      <CardContent className="pt-6 pb-5">
        <div className="flex items-center gap-4">
          <div className={`p-2.5 rounded-xl ${iconBg}`}>
            <Icon className={`w-6 h-6 ${accent}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className={`text-3xl font-bold tracking-tight ${accent}`}>{value}</p>
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help opacity-60 hover:opacity-100" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[280px] text-xs leading-relaxed">
                    {hint}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-xs text-muted-foreground font-medium">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
