import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function ClientsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mt-2"></div>
        </div>
        <div className="h-10 w-28 bg-gray-200 rounded animate-pulse"></div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-[#3396ff]" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
