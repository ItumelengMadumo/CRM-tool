import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function EmailLoading() {
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-4">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>

      <Card className="flex-1 flex overflow-hidden">
        {/* Folders Sidebar */}
        <div className="w-56 border-r border-gray-200 flex flex-col bg-gray-50">
          <div className="p-3">
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {Array(7)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
          </div>
        </div>

        {/* Email List */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          <div className="p-3 border-b border-gray-200">
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-3/4" />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Email View */}
        <div className="flex-1 flex flex-col">
          <div className="p-3 border-b border-gray-200 flex items-center justify-between bg-gray-50">
            <Skeleton className="h-6 w-64" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>

          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <div className="flex space-x-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
