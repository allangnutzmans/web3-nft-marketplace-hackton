import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-5 w-64" />
            </div>
          </div>

          {/* Address copy box */}
          <div className="flex flex-col items-end bg-white rounded-lg px-4 py-3 shadow-sm">
            <Skeleton className="h-4 w-32 mb-2" />
            <div className="flex items-center w-full">
              <Button variant="ghost" size="sm" className="ml-2">
                <Skeleton className="w-4 h-4" />
              </Button>
              <Skeleton className="h-4 flex-1 ml-2" />
            </div>
          </div>
        </div>

        {/* Purchase cards skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="w-16 h-16 rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                      <Skeleton className="h-3 w-28" />
                    </div>
                  </div>

                  <div className="text-right space-y-2">
                    <Badge variant="outline" className="bg-gray-100">
                      <Skeleton className="w-3 h-3 mr-1" />
                      <Skeleton className="h-4 w-16" />
                    </Badge>
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
