"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, ArrowLeft, CreditCard, TrendingUp, ArrowRight, DollarSign } from "lucide-react"
import Link from "next/link"
import { useState } from "react"


export default function DeliveryNotes() {
    const [isLoading, setIsLoading] = useState(false)
  
    const Statements = [
      {
        title: "Core Finance Documents",
        description: "Manage invoices, receipts, quotes, and other core financial documents",
        icon: FileText,
        href: "/finance/core",
        count: 24,
      },
      {
        title: "Supporting Documents",
        description: "Access contracts, proof of payments, tax documents, and timesheets",
        icon: FileText,
        href: "/finance/supporting",
        count: 12,
      },
      {
        title: "Expense & Payment Tracking",
        description: "Track expenses, bills, and payment vouchers",
        icon: DollarSign,
        href: "/finance/expense",
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
          <h1 className="text-2xl font-bold text-gray-900">Delivery Notes</h1>
          <p className="text-gray-500">Manage Delivery notes here</p>
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
