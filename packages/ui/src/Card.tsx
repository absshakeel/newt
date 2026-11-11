import { cn } from '@gtour/utils';

export function Card({
  children,
  className,
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'article' | 'li' | 'section';
}) {
  return (
    <Tag
      className={cn(
        'rounded-card border border-ink-100/80 bg-white shadow-soft transition-shadow duration-300 ease-premium hover:shadow-lift',
        className
      )}
    >
      {children}
    </Tag>
  );
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('space-y-3 p-6', className)}>{children}</div>;
}
