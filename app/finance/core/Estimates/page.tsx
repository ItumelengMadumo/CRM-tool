// This file will serve as a template for creating 7 individual finance document pages

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Estimates {
  title: string
  description: string
  routeBack?: string
}

export default function Estimates({ title, description, routeBack = "/finance" }: Estimates) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-500">{description}</p>
      </div>

      <Card className="border border-black">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <FileText className="mr-2 h-5 w-5 text-[#3396ff]" /> {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">
            Here you can view, create, and manage your Estimaets {title.toLowerCase()}.
          </p>
          <Button variant="outline">Create New {title}</Button>
        </CardContent>
      </Card>

      <Link href={routeBack}>
        <Button variant="ghost" className="text-sm text-blue-500">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to Finance Dashboard
        </Button>
      </Link>
    </div>
  )
}
