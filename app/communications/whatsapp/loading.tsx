import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function WhatsAppLoading() {
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-4">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>

      <Card className="flex-1 flex overflow-hidden">
        {/* Contacts List */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          <div className="p-3 border-b border-gray-200">
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <div className="p-3 border-b border-gray-200 flex items-center justify-between bg-gray-50">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 bg-opacity-50">
            <div className="space-y-4">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
                    <Skeleton
                      className={`h-16 w-64 rounded-lg ${i % 2 === 0 ? "rounded-tr-none" : "rounded-tl-none"}`}
                    />
                  </div>
                ))}
            </div>
          </div>

          <div className="p-3 border-t border-gray-200 flex items-center space-x-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 flex-1 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
      </Card>
    </div>
  )
}
