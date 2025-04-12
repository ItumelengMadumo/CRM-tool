"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { Plus, Search, Download, Trash, Eye } from "lucide-react"

type Invoice = {
  id: string
  client: string
  amount: number
  status: "paid" | "pending" | "overdue"
  date: string
  dueDate: string
}

const mockInvoices: Invoice[] = [
  {
    id: "INV-001",
    client: "Acme Inc",
    amount: 1250.0,
    status: "paid",
    date: "2023-05-15",
    dueDate: "2023-06-15",
  },
  {
    id: "INV-002",
    client: "Globex Corp",
    amount: 3750.5,
    status: "pending",
    date: "2023-06-01",
    dueDate: "2023-07-01",
  },
  {
    id: "INV-003",
    client: "Initech",
    amount: 825.75,
    status: "overdue",
    date: "2023-04-15",
    dueDate: "2023-05-15",
  },
  {
    id: "INV-004",
    client: "Umbrella Corp",
    amount: 2100.0,
    status: "paid",
    date: "2023-05-20",
    dueDate: "2023-06-20",
  },
]

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"cards" | "table">("table")
  const [newInvoice, setNewInvoice] = useState({
    client: "",
    amount: "",
    dueDate: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.client.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleCreateInvoice = () => {
    // Validate form
    const newErrors: Record<string, string> = {}

    if (!newInvoice.client.trim()) {
      newErrors.client = "Client is required"
    }

    if (!newInvoice.amount.trim()) {
      newErrors.amount = "Amount is required"
    } else if (isNaN(Number.parseFloat(newInvoice.amount)) || Number.parseFloat(newInvoice.amount) <= 0) {
      newErrors.amount = "Amount must be a positive number"
    }

    if (!newInvoice.dueDate.trim()) {
      newErrors.dueDate = "Due date is required"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Add new invoice
    const today = new Date().toISOString().split("T")[0]
    const newInvoiceWithId = {
      id: `INV-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`,
      client: newInvoice.client,
      amount: Number.parseFloat(newInvoice.amount),
      status: "pending" as const,
      date: today,
      dueDate: newInvoice.dueDate,
    }

    setInvoices([newInvoiceWithId, ...invoices])
    setNewInvoice({ client: "", amount: "", dueDate: "" })
    setErrors({})
    setIsCreateModalOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-500">Manage your invoices and payments</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Invoice
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Invoice List</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search invoices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-md border border-black bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex rounded-md border border-black overflow-hidden">
                <button
                  className={`px-3 py-1 text-sm ${
                    viewMode === "cards" ? "bg-primary text-white" : "bg-white text-gray-700"
                  }`}
                  onClick={() => setViewMode("cards")}
                >
                  Cards
                </button>
                <button
                  className={`px-3 py-1 text-sm ${
                    viewMode === "table" ? "bg-primary text-white" : "bg-white text-gray-700"
                  }`}
                  onClick={() => setViewMode("table")}
                >
                  Table
                </button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === "table" ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Invoice</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Client</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Amount</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{invoice.id}</td>
                      <td className="py-3 px-4">{invoice.client}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            invoice.status === "paid"
                              ? "bg-green-100 text-green-800"
                              : invoice.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm">Issued: {new Date(invoice.date).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-500">Due: {new Date(invoice.dueDate).toLocaleDateString()}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-medium">
                        $
                        {invoice.amount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1 rounded-md hover:bg-gray-100" title="View">
                            <Eye className="h-4 w-4 text-gray-500" />
                          </button>
                          <button className="p-1 rounded-md hover:bg-gray-100" title="Download">
                            <Download className="h-4 w-4 text-gray-500" />
                          </button>
                          <button className="p-1 rounded-md hover:bg-gray-100" title="Delete">
                            <Trash className="h-4 w-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredInvoices.map((invoice) => (
                <Card key={invoice.id} className="border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-medium">{invoice.id}</h3>
                        <p className="text-sm text-gray-500">{invoice.client}</p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          invoice.status === "paid"
                            ? "bg-green-100 text-green-800"
                            : invoice.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between mb-4">
                      <div>
                        <p className="text-xs text-gray-500">Issued</p>
                        <p className="text-sm">{new Date(invoice.date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Due</p>
                        <p className="text-sm">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Amount</p>
                        <p className="text-sm font-medium">
                          $
                          {invoice.amount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button className="p-1 rounded-md hover:bg-gray-100" title="View">
                        <Eye className="h-4 w-4 text-gray-500" />
                      </button>
                      <button className="p-1 rounded-md hover:bg-gray-100" title="Download">
                        <Download className="h-4 w-4 text-gray-500" />
                      </button>
                      <button className="p-1 rounded-md hover:bg-gray-100" title="Delete">
                        <Trash className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false)
          setErrors({})
          setNewInvoice({ client: "", amount: "", dueDate: "" })
        }}
        title="Create Invoice"
        footer={
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                setIsCreateModalOpen(false)
                setErrors({})
                setNewInvoice({ client: "", amount: "", dueDate: "" })
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateInvoice}>Create Invoice</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="client" className="block text-sm font-medium text-gray-700 mb-1">
              Client <span className="text-red-500">*</span>
            </label>
            <select
              id="client"
              value={newInvoice.client}
              onChange={(e) => setNewInvoice({ ...newInvoice, client: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-black bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select a client</option>
              <option value="Acme Inc">Acme Inc</option>
              <option value="Globex Corp">Globex Corp</option>
              <option value="Initech">Initech</option>
              <option value="Umbrella Corp">Umbrella Corp</option>
            </select>
            {errors.client && <p className="mt-1 text-xs text-red-500">{errors.client}</p>}
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount ($) <span className="text-red-500">*</span>
            </label>
            <input
              id="amount"
              type="text"
              value={newInvoice.amount}
              onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-black bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount}</p>}
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
              Due Date <span className="text-red-500">*</span>
            </label>
            <input
              id="dueDate"
              type="date"
              value={newInvoice.dueDate}
              onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-black bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.dueDate && <p className="mt-1 text-xs text-red-500">{errors.dueDate}</p>}
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Invoice Items</h3>
            <div className="border border-gray-200 rounded-md p-3 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Service Description</p>
                <p className="text-sm font-medium">Amount</p>
              </div>
              <div className="flex items-center justify-between mb-2">
                <input
                  type="text"
                  placeholder="Description"
                  className="flex-1 mr-2 px-3 py-1 rounded-md border border-black bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="text"
                  placeholder="0.00"
                  className="w-24 px-3 py-1 rounded-md border border-black bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button className="text-sm text-primary hover:underline">+ Add Item</button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
