import { ReactNode } from 'react';
import { cn } from '../../utils/helpers';

interface CardProps {
  children: ReactNode;
  title?: string;
  className?: string;
  subtitle?: string;
}

export const Card = ({ children, title, className, subtitle }: CardProps) => {
  return (
    <div className={cn('bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden', className)}>
      {(title || subtitle) && (
        <div className="px-6 py-4 border-bottom border-slate-50">
          {title && <h3 className="text-lg font-semibold text-slate-800">{title}</h3>}
          {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};

export const StatCard = ({
  label,
  value,
  icon: Icon,
  color = 'indigo',
  trend,
}: {
  label: string;
  value: string;
  icon: any;
  color?: string;
  trend?: { value: string; positive: boolean };
}) => {
  const colorClasses: Record<string, string> = {
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    rose: 'bg-rose-50 text-rose-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className={cn('p-3 rounded-xl', colorClasses[color])}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span className={cn('text-sm font-medium', trend.positive ? 'text-emerald-600' : 'text-rose-600')}>
            {trend.positive ? '+' : ''}{trend.value}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        <h4 className="text-2xl font-bold text-slate-800">{value}</h4>
      </div>
    </Card>
  );
};
