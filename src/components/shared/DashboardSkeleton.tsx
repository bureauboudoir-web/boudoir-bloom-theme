import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { SPACING } from "@/lib/design-system";

export const StatCardSkeleton = () => (
  <Card className={SPACING.card}>
    <div className="flex items-center justify-between">
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-16" />
      </div>
      <Skeleton className="h-12 w-12 rounded-lg" />
    </div>
  </Card>
);

export const DashboardSkeleton = ({ cards = 4 }: { cards?: number }) => (
  <div className={SPACING.section}>
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4", SPACING.grid)}>
      {Array.from({ length: cards }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

export const CardSkeleton = () => (
  <Card className={SPACING.card}>
    <div className="space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-20 w-full" />
    </div>
  </Card>
);

export const TableRowSkeleton = () => (
  <div className="flex items-center gap-4 py-3">
    <Skeleton className="h-10 w-10 rounded-full" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-3 w-1/2" />
    </div>
    <Skeleton className="h-8 w-20" />
  </div>
);
