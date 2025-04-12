"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { Plus, Search, User, Phone, Mail, MapPin, FileText, Trash, Edit, Upload, X, Loader2 } from "lucide-react"

type Client = {
  id: number
  name: string
  company: string
  email: string
  phone: string
  location: string
  services: string[]
  budget: number | null
  notes: string
  created_at: string
}

type Document = {
  id: number
  client_id: number
  name: string
  description: string
  type: string
  file_url: string
  size: string
  uploaded_by: string
  created_at: string
}

const availableServices = [
  "Web Development",
  "Mobile App Development",
  "UI/UX Design",
  "Digital Marketing",
  "SEO",
  "Content Creation",
  "Consulting",
  "Maintenance",
  "Cloud Services",
  "IT Support",
]

const documentTypes = ["Contract", "Invoice", "Proposal", "Statement of Work", "NDA", "Proof of Payment", "Other"]

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [clientDocuments, setClientDocuments] = useState<Document[]>([])
  const [newClient, setNewClient] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    location: "",
    services: [] as string[],
    budget: "",
    notes: "",
  })
  const [newDocument, setNewDocument] = useState({
    type: documentTypes[0],
    description: "",
    file: null as File | null,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null)

  // Fetch clients on component mount
  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/clients")
      if (!response.ok) {
        throw new Error("Failed to fetch clients")
      }
      const data = await response.json()
      setClients(data.clients || [])
    } catch (error) {
      console.error("Error fetching clients:", error)
      setFeedback({
        type: "error",
        message: "Failed to load clients. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchClientDetails = async (clientId: number) => {
    try {
      const response = await fetch(`/api/clients/${clientId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch client details")
      }
      const data = await response.json()
      setSelectedClient(data.client)
      setClientDocuments(data.documents || [])
    } catch (error) {
      console.error("Error fetching client details:", error)
      setFeedback({
        type: "error",
        message: "Failed to load client details. Please try again.",
      })
    }
  }

  const handleViewClient = async (client: Client) => {
    setSelectedClient(client)
    await fetchClientDetails(client.id)
    setIsViewModalOpen(true)
  }

  const handleEditClient = (client: Client) => {
    setSelectedClient(client)
    setNewClient({
      name: client.name,
      company: client.company || "",
      email: client.email || "",
      phone: client.phone || "",
      location: client.location || "",
      services: client.services || [],
      budget: client.budget ? client.budget.toString() : "",
      notes: client.notes || "",
    })
    setIsEditing(true)
    setIsAddModalOpen(true)
  }

  const handleDeleteClient = async (clientId: number) => {
    if (!confirm("Are you sure you want to delete this client? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/clients/${clientId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete client")
      }

      setClients(clients.filter((client) => client.id !== clientId))
      setFeedback({
        type: "success",
        message: "Client deleted successfully.",
      })

      // Clear feedback after 3 seconds
      setTimeout(() => {
        setFeedback(null)
      }, 3000)
    } catch (error) {
      console.error("Error deleting client:", error)
      setFeedback({
        type: "error",
        message: "Failed to delete client. Please try again.",
      })
    }
  }

  const handleAddClient = async () => {
    // Validate form
    const newErrors: Record<string, string> = {}

    if (!newClient.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (newClient.email && !/\S+@\S+\.\S+/.test(newClient.email)) {
      newErrors.email = "Email is invalid"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    setFeedback(null)

    try {
      const method = isEditing ? "PUT" : "POST"
      const url = isEditing ? `/api/clients/${selectedClient?.id}` : "/api/clients"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newClient.name,
          company: newClient.company,
          email: newClient.email,
          phone: newClient.phone,
          location: newClient.location,
          services: newClient.services,
          budget: newClient.budget ? Number.parseFloat(newClient.budget) : null,
          notes: newClient.notes,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save client")
      }

      const data = await response.json()

      setFeedback({
        type: "success",
        message: isEditing ? "Client updated successfully!" : "Client added successfully!",
      })

      // Update client list
      if (isEditing) {
        setClients(clients.map((client) => (client.id === data.client.id ? data.client : client)))
      } else {
        setClients([data.client, ...clients])
      }

      // Close modal after a short delay to show success message
      setTimeout(() => {
        resetClientForm()
      }, 1500)
    } catch (error) {
      console.error("Error saving client:", error)
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to save client",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUploadDocument = async () => {
    if (!selectedClient) return

    // Validate form
    const newErrors: Record<string, string> = {}

    if (!newDocument.type) {
      newErrors.type = "Document type is required"
    }

    if (!newDocument.file) {
      newErrors.file = "File is required"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    setFeedback(null)

    try {
      // In a real implementation, you would upload the file to a storage service
      // For now, we'll just simulate it
      const fileUrl = `https://storage.example.com/${Date.now()}-${newDocument.file?.name}`
      const fileSize = newDocument.file ? `${(newDocument.file.size / (1024 * 1024)).toFixed(1)} MB` : "0 KB"

      const response = await fetch("/api/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: selectedClient.id,
          name: newDocument.file?.name,
          description: newDocument.description,
          type: newDocument.type,
          file_url: fileUrl,
          size: fileSize,
          uploaded_by: "Current User", // In a real app, this would be the logged-in user
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to upload document")
      }

      const data = await response.json()

      setFeedback({
        type: "success",
        message: "Document uploaded successfully!",
      })

      // Add the new document to the list
      setClientDocuments([data.document, ...clientDocuments])

      // Close modal after a short delay to show success message
      setTimeout(() => {
        setIsUploadModalOpen(false)
        setNewDocument({
          type: documentTypes[0],
          description: "",
          file: null,
        })
        setErrors({})
        setFeedback(null)
      }, 1500)
    } catch (error) {
      console.error("Error uploading document:", error)
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to upload document",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteDocument = async (documentId: number) => {
    if (!confirm("Are you sure you want to delete this document? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete document")
      }

      setClientDocuments(clientDocuments.filter((doc) => doc.id !== documentId))
      setFeedback({
        type: "success",
        message: "Document deleted successfully.",
      })

      // Clear feedback after 3 seconds
      setTimeout(() => {
        setFeedback(null)
      }, 3000)
    } catch (error) {
      console.error("Error deleting document:", error)
      setFeedback({
        type: "error",
        message: "Failed to delete document. Please try again.",
      })
    }
  }

  const resetClientForm = () => {
    setIsAddModalOpen(false)
    setIsEditing(false)
    setSelectedClient(null)
    setNewClient({
      name: "",
      company: "",
      email: "",
      phone: "",
      location: "",
      services: [],
      budget: "",
      notes: "",
    })
    setErrors({})
    setFeedback(null)
  }

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.company && client.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (client.email && client.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (client.phone && client.phone.includes(searchQuery)),
  )

  const handleServiceToggle = (service: string) => {
    if (newClient.services.includes(service)) {
      setNewClient({
        ...newClient,
        services: newClient.services.filter((s) => s !== service),
      })
    } else {
      setNewClient({
        ...newClient,
        services: [...newClient.services, service],
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-500">Manage your client relationships</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-[#3396ff] hover:bg-[#3396ff]/90">
          <Plus className="mr-2 h-4 w-4" /> Add Client
        </Button>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-md ${
            feedback.type === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {feedback.message}
        </div>
      )}

      <Card className="border border-black">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Client List</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-md border border-black bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#3396ff]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-[#3396ff]" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Client</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Contact</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Location</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Services</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Budget</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.length > 0 ? (
                    filteredClients.map((client) => (
                      <tr
                        key={client.id}
                        className="border-b hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleViewClient(client)}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-[#3396ff]/10 flex items-center justify-center">
                              <User className="h-5 w-5 text-[#3396ff]" />
                            </div>

                            <div>
                              <p className="font-medium">{client.name}</p>
                              {client.company && <p className="text-sm text-gray-500">{client.company}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            {client.email && (
                              <p className="text-sm flex items-center gap-2">
                                <Mail className="h-4 w-4 text-gray-400" /> {client.email}
                              </p>
                            )}
                            {client.phone && (
                              <p className="text-sm flex items-center gap-2">
                                <Phone className="h-4 w-4 text-gray-400" /> {client.phone}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {client.location ? (
                            <p className="text-sm flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-400" /> {client.location}
                            </p>
                          ) : (
                            <span className="text-gray-400 text-sm">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {client.services && client.services.length > 0 ? (
                              client.services.map((service, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#3396ff]/10 text-[#3396ff]"
                                >
                                  {service}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-400 text-sm">—</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right font-medium">
                          {client.budget ? `$${client.budget.toLocaleString()}` : "—"}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                            <button
                              className="p-1 rounded-md hover:bg-gray-200"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEditClient(client)
                              }}
                              aria-label="Edit client"
                            >
                              <Edit className="h-4 w-4 text-gray-500" />
                            </button>
                            <button
                              className="p-1 rounded-md hover:bg-gray-200"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteClient(client.id)
                              }}
                              aria-label="Delete client"
                            >
                              <Trash className="h-4 w-4 text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-500">
                        {searchQuery
                          ? "No clients found matching your search."
                          : "No clients found. Add your first client!"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Client Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={resetClientForm}
        title={isEditing ? "Edit Client" : "Add New Client"}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={resetClientForm} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleAddClient} disabled={isSubmitting} className="bg-[#3396ff] hover:bg-[#3396ff]/90">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Saving..." : "Adding..."}
                </>
              ) : isEditing ? (
                "Save Changes"
              ) : (
                "Add Client"
              )}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          {feedback && (
            <div
              className={`p-3 rounded-md ${
                feedback.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-700"
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}
            >
              {feedback.message}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={newClient.name}
              onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-black bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#3396ff]"
              disabled={isSubmitting}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </label>
            <input
              id="company"
              type="text"
              value={newClient.company}
              onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-black bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#3396ff]"
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={newClient.email}
                onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-black bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#3396ff]"
                disabled={isSubmitting}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                value={newClient.phone}
                onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-black bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#3396ff]"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              id="location"
              type="text"
              value={newClient.location}
              onChange={(e) => setNewClient({ ...newClient, location: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-black bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#3396ff]"
              disabled={isSubmitting}
              placeholder="City, Country"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Services</label>
            <div className="flex flex-wrap gap-2">
              {availableServices.map((service) => (
                <button
                  key={service}
                  type="button"
                  onClick={() => handleServiceToggle(service)}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    newClient.services.includes(service)
                      ? "bg-[#3396ff] text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                  disabled={isSubmitting}
                >
                  {service}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
              Budget
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                id="budget"
                type="number"
                value={newClient.budget}
                onChange={(e) => setNewClient({ ...newClient, budget: e.target.value })}
                className="w-full pl-8 pr-4 py-2 rounded-md border border-black bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#3396ff]"
                min="0"
                step="100"
                disabled={isSubmitting}
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              id="notes"
              value={newClient.notes}
              onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-black bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#3396ff]"
              rows={4}
              disabled={isSubmitting}
              placeholder="Additional information about this client..."
            />
          </div>
        </div>
      </Modal>

      {/* View Client Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false)
          setSelectedClient(null)
          setClientDocuments([])
          setFeedback(null)
        }}
        title={selectedClient?.name || "Client Details"}
        maxWidth="xl"
      >
        {selectedClient && (
          <div className="space-y-6">
            {feedback && (
              <div
                className={`p-3 rounded-md ${
                  feedback.type === "success"
                    ? "bg-green-50 border border-green-200 text-green-700"
                    : "bg-red-50 border border-red-200 text-red-700"
                }`}
              >
                {feedback.message}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Contact Information</h3>
                <div className="space-y-2">
                  {selectedClient.company && (
                    <div className="flex items-start gap-2">
                      <User className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-medium">Company</p>
                        <p className="text-gray-600">{selectedClient.company}</p>
                      </div>
                    </div>
                  )}
                  {selectedClient.email && (
                    <div className="flex items-start gap-2">
                      <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-gray-600">{selectedClient.email}</p>
                      </div>
                    </div>
                  )}
                  {selectedClient.phone && (
                    <div className="flex items-start gap-2">
                      <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-medium">Phone</p>
                        <p className="text-gray-600">{selectedClient.phone}</p>
                      </div>
                    </div>
                  )}
                  {selectedClient.location && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-gray-600">{selectedClient.location}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Business Details</h3>
                <div className="space-y-2">
                  {selectedClient.services && selectedClient.services.length > 0 && (
                    <div>
                      <p className="font-medium">Services</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedClient.services.map((service, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#3396ff]/10 text-[#3396ff]"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedClient.budget && (
                    <div>
                      <p className="font-medium">Budget</p>
                      <p className="text-gray-600">${selectedClient.budget.toLocaleString()}</p>
                    </div>
                  )}
                  <div>
                    <p className="font-medium">Client Since</p>
                    <p className="text-gray-600">
                      {new Date(selectedClient.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {selectedClient.notes && (
              <div>
                <h3 className="text-lg font-medium mb-2">Notes</h3>
                <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                  <p className="text-gray-600 whitespace-pre-line">{selectedClient.notes}</p>
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium">Documents</h3>
                <Button
                  size="sm"
                  onClick={() => {
                    setNewDocument({
                      type: documentTypes[0],
                      description: "",
                      file: null,
                    })
                    setIsUploadModalOpen(true)
                  }}
                  className="bg-[#3396ff] hover:bg-[#3396ff]/90"
                >
                  <Upload className="mr-2 h-4 w-4" /> Upload Document
                </Button>
              </div>

              {clientDocuments.length > 0 ? (
                <div className="space-y-2">
                  {clientDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 rounded-md border border-gray-200 hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md bg-[#3396ff]/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-[#3396ff]" />
                        </div>
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="bg-gray-100 px-1.5 py-0.5 rounded">{doc.type}</span>
                            <span>•</span>
                            <span>{doc.size}</span>
                            <span>•</span>
                            <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                          </div>
                          {doc.description && <p className="text-xs text-gray-500 mt-1">{doc.description}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded-md hover:bg-gray-200"
                          aria-label="View document"
                        >
                          <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </a>
                        <button
                          className="p-1 rounded-md hover:bg-gray-200"
                          onClick={() => handleDeleteDocument(doc.id)}
                          aria-label="Delete document"
                        >
                          <Trash className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-md border border-dashed border-gray-300">
                  <FileText className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No documents found for this client.</p>
                  <p className="text-gray-500 text-sm">Upload documents to keep track of important files.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Upload Document Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false)
          setNewDocument({
            type: documentTypes[0],
            description: "",
            file: null,
          })
          setErrors({})
          setFeedback(null)
        }}
        title="Upload Document"
        footer={
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                setIsUploadModalOpen(false)
                setNewDocument({
                  type: documentTypes[0],
                  description: "",
                  file: null,
                })
                setErrors({})
                setFeedback(null)
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUploadDocument}
              disabled={isSubmitting}
              className="bg-[#3396ff] hover:bg-[#3396ff]/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload"
              )}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          {feedback && (
            <div
              className={`p-3 rounded-md ${
                feedback.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-700"
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}
            >
              {feedback.message}
            </div>
          )}

          <div>
            <label htmlFor="docType" className="block text-sm font-medium text-gray-700 mb-1">
              Document Type <span className="text-red-500">*</span>
            </label>
            <select
              id="docType"
              value={newDocument.type}
              onChange={(e) => setNewDocument({ ...newDocument, type: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-black bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#3396ff]"
              disabled={isSubmitting}
            >
              {documentTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.type && <p className="mt-1 text-xs text-red-500">{errors.type}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={newDocument.description}
              onChange={(e) => setNewDocument({ ...newDocument, description: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-black bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#3396ff]"
              rows={3}
              placeholder="Add a brief description of this document..."
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              File <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-[#3396ff] hover:text-[#3396ff]/90 focus-within:outline-none"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setNewDocument({
                            ...newDocument,
                            file: e.target.files[0],
                          })
                        }
                      }}
                      disabled={isSubmitting}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PDF, DOC, DOCX, XLS, XLSX, JPG, PNG up to 10MB</p>
              </div>
            </div>
            {newDocument.file && (
              <div className="mt-2 flex items-center justify-between p-2 bg-gray-50 rounded-md">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm truncate max-w-[200px]">{newDocument.file.name}</span>
                </div>
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setNewDocument({ ...newDocument, file: null })}
                  disabled={isSubmitting}
                  aria-label="Remove file"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            {errors.file && <p className="mt-1 text-xs text-red-500">{errors.file}</p>}
          </div>
        </div>
      </Modal>
    </div>
  )
}
