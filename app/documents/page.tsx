"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { Search, FileText, Download, Trash, Eye, Upload } from "lucide-react"

type Document = {
  id: string
  name: string
  description: string
  type: string
  size: string
  uploadedBy: string
  uploadDate: string
  client?: string
}

const mockDocuments: Document[] = [
  {
    id: "1",
    name: "Contract_Acme_2023.pdf",
    description: "Service contract for Acme Inc",
    type: "pdf",
    size: "2.4 MB",
    uploadedBy: "John Doe",
    uploadDate: "2023-05-15",
    client: "Acme Inc",
  },
  {
    id: "2",
    name: "Invoice_Globex_May.pdf",
    description: "May invoice for Globex Corp",
    type: "pdf",
    size: "1.2 MB",
    uploadedBy: "Jane Smith",
    uploadDate: "2023-06-01",
    client: "Globex Corp",
  },
  {
    id: "3",
    name: "Meeting_Notes_Initech.docx",
    description: "Meeting notes from client discussion",
    type: "docx",
    size: "568 KB",
    uploadedBy: "Bob Johnson",
    uploadDate: "2023-05-20",
    client: "Initech",
  },
  {
    id: "4",
    name: "Project_Proposal.pptx",
    description: "New project proposal presentation",
    type: "pptx",
    size: "4.7 MB",
    uploadedBy: "Alice Williams",
    uploadDate: "2023-05-25",
    client: "Umbrella Corp",
  },
  {
    id: "5",
    name: "Financial_Report_Q2.xlsx",
    description: "Q2 financial report",
    type: "xlsx",
    size: "1.8 MB",
    uploadedBy: "John Doe",
    uploadDate: "2023-06-15",
  },
  {
    id: "6",
    name: "Employee_Handbook.pdf",
    description: "Company employee handbook",
    type: "pdf",
    size: "3.5 MB",
    uploadedBy: "Jane Smith",
    uploadDate: "2023-04-10",
  },
]

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [newDocument, setNewDocument] = useState({
    name: "",
    description: "",
    client: "",
    file: null as File | null,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const filteredDocuments = documents.filter(
    (document) =>
      document.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      document.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (document.client && document.client.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setNewDocument({
        ...newDocument,
        name: file.name,
        file,
      })
    }
  }

  const handleUploadDocument = () => {
    // Validate form
    const newErrors: Record<string, string> = {}

    if (!newDocument.file) {
      newErrors.file = "File is required"
    }

    if (!newDocument.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Add new document
    const fileSize = newDocument.file ? `${(newDocument.file.size / (1024 * 1024)).toFixed(1)} MB` : "0 KB"
    const fileType = newDocument.file ? newDocument.file.name.split(".").pop() || "" : ""

    const newDocumentWithId = {
      id: Math.random().toString(36).substring(2, 9),
      name: newDocument.name,
      description: newDocument.description,
      type: fileType,
      size: fileSize,
      uploadedBy: "John Doe",
      uploadDate: new Date().toISOString().split("T")[0],
      client: newDocument.client || undefined,
    }

    setDocuments([newDocumentWithId, ...documents])
    setNewDocument({ name: "", description: "", client: "", file: null })
    setErrors({})
    setIsUploadModalOpen(false)
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return "bg-red-100 text-red-600"
      case "docx":
        return "bg-blue-100 text-blue-600"
      case "xlsx":
        return "bg-green-100 text-green-600"
      case "pptx":
        return "bg-orange-100 text-orange-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-500">Manage your files and documents</p>
        </div>
        <Button onClick={() => setIsUploadModalOpen(true)}>
          <Upload className="mr-2 h-4 w-4" /> Upload Document
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Document Library</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-md border border-black bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((document) => (
              <Card key={document.id} className="border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className={`h-10 w-10 rounded-md flex items-center justify-center ${getFileIcon(document.type)}`}
                    >
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate" title={document.name}>
                        {document.name}
                      </h3>
                      <p className="text-sm text-gray-500 truncate" title={document.description}>
                        {document.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-500">Size</p>
                      <p>{document.size}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Type</p>
                      <p className="uppercase">{document.type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Uploaded</p>
                      <p>{new Date(document.uploadDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Client</p>
                      <p>{document.client || "—"}</p>
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
        </CardContent>
      </Card>

      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false)
          setErrors({})
          setNewDocument({ name: "", description: "", client: "", file: null })
        }}
        title="Upload Document"
        footer={
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                setIsUploadModalOpen(false)
                setErrors({})
                setNewDocument({ name: "", description: "", client: "", file: null })
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUploadDocument}>Upload</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
            <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center">
              <Upload className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-sm font-medium mb-1">
                {newDocument.file ? newDocument.file.name : "Click to upload or drag and drop"}
              </p>
              <p className="text-xs text-gray-500">PDF, DOCX, XLSX, PPTX up to 10MB</p>
            </label>
            {errors.file && <p className="mt-2 text-xs text-red-500">{errors.file}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              value={newDocument.description}
              onChange={(e) => setNewDocument({ ...newDocument, description: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-black bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
            />
            {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
          </div>

          <div>
            <label htmlFor="client" className="block text-sm font-medium text-gray-700 mb-1">
              Related Client
            </label>
            <select
              id="client"
              value={newDocument.client}
              onChange={(e) => setNewDocument({ ...newDocument, client: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-black bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">None</option>
              <option value="Acme Inc">Acme Inc</option>
              <option value="Globex Corp">Globex Corp</option>
              <option value="Initech">Initech</option>
              <option value="Umbrella Corp">Umbrella Corp</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  )
}
