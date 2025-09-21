import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PurchaseCardSkeletonProps {
  showActions?: boolean;
  borderColor?: string;
}

export default function PurchaseCardSkeleton({
  showActions = true,
  borderColor = "border-l-orange-500"
}: PurchaseCardSkeletonProps) {
  return (
    <Card className={`border-l-4 ${borderColor}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Skeleton className="h-6 w-40" />
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                <Skeleton className="w-3 h-3 mr-1" />
                <Skeleton className="h-4 w-16" />
              </Badge>
            </div>
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Purchase information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Skeleton className="h-5 w-12 mb-2" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-6 w-6" />
            </div>
          </div>

          <div>
            <Skeleton className="h-5 w-8 mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>

        {/* Transaction hash */}
        <div>
          <Skeleton className="h-5 w-28 mb-2" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-6 w-6" />
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex gap-3 pt-4 border-t">
            <Skeleton className="h-9 flex-1" />
            <Skeleton className="h-9 flex-1" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
