import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface StatsCardSkeletonProps {
  title?: string;
}

export default function StatsCardSkeleton({ title }: StatsCardSkeletonProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-32" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-8" />
      </CardContent>
    </Card>
  );
}
