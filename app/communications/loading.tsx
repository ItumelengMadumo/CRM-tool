import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function CommunicationsLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-9 w-32" />
              </div>
            </div>
            <div className="p-6">
              <Skeleton className="h-10 w-full mb-6" />
              <div className="space-y-4">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <div className="p-6 border-b border-gray-200">
              <Skeleton className="h-6 w-48" />
            </div>
            <div className="p-6">
              <Skeleton className="h-10 w-full mb-4" />
              <div className="grid grid-cols-4 gap-2 mb-6">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-10" />
                  ))}
              </div>
              <div className="border rounded-md p-6 flex flex-col items-center justify-center">
                <Skeleton className="h-12 w-12 rounded-full mb-4" />
                <Skeleton className="h-5 w-48 mb-2" />
                <Skeleton className="h-4 w-64 mb-6" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-6 mt-6">
            <Card>
              <div className="p-6 border-b border-gray-200">
                <Skeleton className="h-6 w-48" />
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-48" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6 border-b border-gray-200">
                <Skeleton className="h-6 w-48" />
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-5 w-5 rounded-full" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="h-4 w-16" />
                      </div>
                    ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
