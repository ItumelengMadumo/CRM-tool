"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, FileText, DollarSign, TrendingUp, ArrowRight } from "lucide-react"
import Link from "next/link"


export default function SupportingDocumentation() {
  const [isLoading, setIsLoading] = useState(false)

  const SupportingDocumentation = [
    {
      title: "Contracts",
      description: "Manage invoices, receipts, quotes, and other core financial documents",
      icon: FileText,
      href: "/",
      count: 24,
    },
    {
      title: "Proof of Payments",
      description: "Access contracts, proof of payments, tax documents, and timesheets",
      icon: FileText,
      href: "/",
      count: 12,
    },
    {
      title: "Tax Documents",
      description: "Track expenses, bills, and payment vouchers",
      icon: DollarSign,
      href: "/",
      count: 8,
    },
  ]

  const recentActivity = [
    {
      type: "Invoice",
      number: "INV-2023-001",
      client: "Acme Inc",
      amount: 1250.0,
      date: "2023-06-15",
      status: "paid",
    },
    {
      type: "Receipt",
      number: "REC-2023-005",
      client: "Globex Corp",
      amount: 750.0,
      date: "2023-06-12",
      status: "completed",
    },
    {
      type: "Quote",
      number: "QUO-2023-003",
      client: "Initech",
      amount: 3200.0,
      date: "2023-06-10",
      status: "pending",
    },
    {
      type: "Expense",
      number: "EXP-2023-008",
      client: null,
      amount: 450.0,
      date: "2023-06-08",
      status: "approved",
    },
  ]
 



  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Supporting Documentation</h1>
        <p className="text-gray-500">Access and manage key Suporting  documents</p>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-black">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <CreditCard className="mr-2 h-5 w-5 text-[#3396ff]" /> Financial Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Total Invoiced</span>
                  <span className="text-sm font-medium">$24,500.00</span>
                </div>
                <div className="mt-1 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#3396ff] rounded-full" style={{ width: "75%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Total Received</span>
                  <span className="text-sm font-medium">$18,375.00</span>
                </div>
                <div className="mt-1 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: "56%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Total Expenses</span>
                  <span className="text-sm font-medium">$8,125.00</span>
                </div>
                <div className="mt-1 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: "25%" }}></div>
                </div>
              </div>
              <div className="pt-2">
                <Button variant="secondary" size="sm" className="w-full">
                  View Financial Reports
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Individual Financial Document Cards */}
        {SupportingDocumentation.map((doc) => (
          <Card key={doc.title} className="border border-black">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FileText className="mr-2 h-5 w-5 text-[#3396ff]" /> {doc.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                Manage all your {doc.title.toLowerCase()} in one place.
              </p>
              <Link href={doc.href}>
                <Button variant="outline" size="sm" className="w-full">
                  View {doc.title} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border border-black">{/* Table for recent activity */}
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent> 
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Number</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Client</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-700">Amount</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-700">Date</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentActivity.map((activity, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <span className="font-medium">{activity.type}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm">{activity.number}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm">{activity.client || "—"}</span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="font-medium">${activity.amount.toFixed(2)}</span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="text-sm">{new Date(activity.date).toLocaleDateString()}</span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                activity.status === "paid" || activity.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : activity.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
    </div>
  )
}