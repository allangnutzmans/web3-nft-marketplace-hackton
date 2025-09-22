import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="h-full">
      <div className="container mx-auto px-4 py-8 max-h-[calc(100vh-8.5rem)]">
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
          {/* Back button skeleton */}
          <div className="flex items-center space-x-4 w-full max-w-4xl">
            <Skeleton className="h-9 w-20" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-left w-full max-w-4xl">
            {/* NFT Image Skeleton */}
            <div>
              <Card className="max-w-[600px]">
                <CardContent className="p-6">
                  <div className="relative aspect-square rounded-lg overflow-hidden mb-4">
                    <Skeleton className="w-full h-full" />
                  </div>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            </div>

            {/* Purchase details skeleton */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <hr />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-5 w-12" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </CardContent>
              </Card>

              {/* Warning card skeleton */}
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Skeleton className="w-5 h-5 rounded" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Network switcher skeleton */}
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-28" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                    <Skeleton className="h-9 w-24" />
                  </div>
                </CardContent>
              </Card>

              {/* Purchase button skeleton */}
              <Skeleton className="h-14 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
