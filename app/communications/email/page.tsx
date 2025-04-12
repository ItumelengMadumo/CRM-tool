"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Search,
  Star,
  Trash,
  Archive,
  Mail,
  Send,
  File,
  Inbox,
  AlertCircle,
  Clock,
  ChevronLeft,
  MoreVertical,
  Reply,
  Forward,
  Paperclip,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Modal } from "@/components/ui/modal"

type Folder = {
  id: string
  name: string
  icon: React.ElementType
  count?: number
  color?: string
}

type Email = {
  id: string
  subject: string
  sender: {
    name: string
    email: string
  }
  preview: string
  body: string
  date: string
  read: boolean
  starred: boolean
  labels?: string[]
  attachments?: {
    name: string
    size: string
    type: string
  }[]
  folder: string
}

const folders: Folder[] = [
  { id: "inbox", name: "Inbox", icon: Inbox, count: 12 },
  { id: "sent", name: "Sent", icon: Send },
  { id: "drafts", name: "Drafts", icon: File, count: 2 },
  { id: "starred", name: "Starred", icon: Star },
  { id: "important", name: "Important", icon: AlertCircle, color: "text-yellow-500" },
  { id: "scheduled", name: "Scheduled", icon: Clock },
  { id: "archive", name: "Archive", icon: Archive },
  { id: "trash", name: "Trash", icon: Trash },
]

const mockEmails: Email[] = [
  {
    id: "1",
    subject: "Project Update - Q2 Goals",
    sender: {
      name: "John Doe",
      email: "john@example.com",
    },
    preview: "I wanted to share the latest updates on our Q2 goals and progress...",
    body: `<p>Hi Team,</p>
           <p>I wanted to share the latest updates on our Q2 goals and progress. We've made significant strides in the following areas:</p>
           <ul>
             <li>Completed the new client onboarding process</li>
             <li>Launched the redesigned dashboard</li>
             <li>Improved response time by 15%</li>
           </ul>
           <p>Please review the attached report for more details.</p>
           <p>Best regards,<br>John</p>`,
    date: "10:30 AM",
    read: false,
    starred: true,
    labels: ["work", "important"],
    attachments: [
      {
        name: "Q2_Report.pdf",
        size: "2.4 MB",
        type: "pdf",
      },
    ],
    folder: "inbox",
  },
  {
    id: "2",
    subject: "Invoice #1234 - Payment Confirmation",
    sender: {
      name: "Billing Department",
      email: "billing@example.com",
    },
    preview: "Thank you for your payment. This email confirms that we have received...",
    body: `<p>Dear Customer,</p>
           <p>Thank you for your payment. This email confirms that we have received your payment for Invoice #1234.</p>
           <p>Payment details:</p>
           <ul>
             <li>Invoice: #1234</li>
             <li>Amount: $1,250.00</li>
             <li>Date: May 15, 2023</li>
           </ul>
           <p>If you have any questions, please don't hesitate to contact us.</p>
           <p>Regards,<br>Billing Department</p>`,
    date: "Yesterday",
    read: true,
    starred: false,
    labels: ["finance"],
    folder: "inbox",
  },
  {
    id: "3",
    subject: "Meeting Agenda - Product Review",
    sender: {
      name: "Jane Smith",
      email: "jane@example.com",
    },
    preview: "Here's the agenda for our upcoming product review meeting scheduled for...",
    body: `<p>Hello everyone,</p>
           <p>Here's the agenda for our upcoming product review meeting scheduled for Thursday at 2 PM:</p>
           <ol>
             <li>Review of current product metrics</li>
             <li>Discussion of user feedback</li>
             <li>Prioritization of feature requests</li>
             <li>Next steps and action items</li>
           </ol>
           <p>Please come prepared with your updates.</p>
           <p>Thanks,<br>Jane</p>`,
    date: "May 15",
    read: true,
    starred: true,
    labels: ["work", "meeting"],
    folder: "inbox",
  },
  {
    id: "4",
    subject: "Your Flight Confirmation",
    sender: {
      name: "Travel Bookings",
      email: "bookings@travel.com",
    },
    preview: "Your flight has been confirmed. Here are your travel details...",
    body: `<p>Dear Traveler,</p>
           <p>Your flight has been confirmed. Here are your travel details:</p>
           <p><strong>Flight:</strong> TL123<br>
           <strong>Date:</strong> June 15, 2023<br>
           <strong>Departure:</strong> New York (JFK) - 10:00 AM<br>
           <strong>Arrival:</strong> San Francisco (SFO) - 1:30 PM</p>
           <p>Please check in online 24 hours before your flight.</p>
           <p>Safe travels!</p>`,
    date: "May 10",
    read: true,
    starred: false,
    attachments: [
      {
        name: "Boarding_Pass.pdf",
        size: "1.2 MB",
        type: "pdf",
      },
    ],
    folder: "inbox",
  },
  {
    id: "5",
    subject: "Website Redesign Proposal",
    sender: {
      name: "Design Team",
      email: "design@example.com",
    },
    preview: "We've prepared a proposal for the website redesign project as discussed...",
    body: `<p>Hi Team,</p>
           <p>We've prepared a proposal for the website redesign project as discussed in our last meeting.</p>
           <p>The proposal includes:</p>
           <ul>
             <li>Project scope and timeline</li>
             <li>Design concepts</li>
             <li>Budget breakdown</li>
           </ul>
           <p>Please review the attached documents and let us know your thoughts.</p>
           <p>Regards,<br>Design Team</p>`,
    date: "May 5",
    read: false,
    starred: false,
    labels: ["work", "design"],
    attachments: [
      {
        name: "Redesign_Proposal.pdf",
        size: "3.5 MB",
        type: "pdf",
      },
      {
        name: "Design_Mockups.zip",
        size: "15.2 MB",
        type: "zip",
      },
    ],
    folder: "inbox",
  },
]

export default function EmailPage() {
  const [selectedFolder, setSelectedFolder] = useState<string>("inbox")
  const [emails, setEmails] = useState<Email[]>(mockEmails)
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isComposeOpen, setIsComposeOpen] = useState(false)
  const [composeEmail, setComposeEmail] = useState({
    to: "",
    subject: "",
    body: "",
  })

  const filteredEmails = emails.filter(
    (email) =>
      email.folder === selectedFolder &&
      (email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.sender.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.sender.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.preview.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  useEffect(() => {
    if (selectedEmail && !selectedEmail.read) {
      // Mark as read
      const updatedEmails = emails.map((email) => (email.id === selectedEmail.id ? { ...email, read: true } : email))
      setEmails(updatedEmails)
    }
  }, [selectedEmail])

  const handleStarEmail = (emailId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    const updatedEmails = emails.map((email) => (email.id === emailId ? { ...email, starred: !email.starred } : email))
    setEmails(updatedEmails)
  }

  const handleDeleteEmail = (emailId: string) => {
    const updatedEmails = emails.map((email) => (email.id === emailId ? { ...email, folder: "trash" } : email))
    setEmails(updatedEmails)
    if (selectedEmail?.id === emailId) {
      setSelectedEmail(null)
    }
  }

  const handleSendEmail = () => {
    if (!composeEmail.to || !composeEmail.subject) return

    const newEmail: Email = {
      id: Date.now().toString(),
      subject: composeEmail.subject,
      sender: {
        name: "Me",
        email: "me@example.com",
      },
      preview: composeEmail.body.substring(0, 100) + "...",
      body: composeEmail.body,
      date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: true,
      starred: false,
      folder: "sent",
    }

    setEmails([newEmail, ...emails])
    setComposeEmail({ to: "", subject: "", body: "" })
    setIsComposeOpen(false)
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Email</h1>
        <p className="text-gray-500">Manage your email communications</p>
      </div>

      <Card className="flex-1 flex overflow-hidden">
        {/* Folders Sidebar */}
        <div className="w-56 border-r border-gray-200 flex flex-col bg-gray-50">
          <div className="p-3">
            <Button className="w-full" onClick={() => setIsComposeOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Compose
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <nav className="space-y-1 px-2">
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${
                    selectedFolder === folder.id
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                  onClick={() => {
                    setSelectedFolder(folder.id)
                    setSelectedEmail(null)
                  }}
                >
                  <folder.icon
                    className={`mr-3 h-4 w-4 ${folder.color ? folder.color : ""} ${
                      selectedFolder === folder.id ? "text-white" : ""
                    }`}
                  />
                  <span className="flex-1 truncate">{folder.name}</span>
                  {folder.count && folder.count > 0 && (
                    <span
                      className={`ml-2 rounded-full text-xs px-1.5 py-0.5 ${
                        selectedFolder === folder.id ? "bg-white text-primary" : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {folder.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Email List */}
        <div
          className={`${selectedEmail ? "hidden md:block" : ""} w-full md:w-1/3 border-r border-gray-200 flex flex-col`}
        >
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search emails..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredEmails.length > 0 ? (
              filteredEmails.map((email) => (
                <div
                  key={email.id}
                  className={`flex border-b border-gray-100 cursor-pointer ${
                    selectedEmail?.id === email.id ? "bg-gray-100" : email.read ? "" : "bg-blue-50"
                  } hover:bg-gray-50`}
                  onClick={() => setSelectedEmail(email)}
                >
                  <div className="flex items-center p-3 w-full">
                    <div className="flex-shrink-0 mr-3">
                      <button
                        className="text-gray-400 hover:text-yellow-400"
                        onClick={(e) => handleStarEmail(email.id, e)}
                      >
                        <Star className={`h-5 w-5 ${email.starred ? "text-yellow-400 fill-yellow-400" : ""}`} />
                      </button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <h3 className={`text-sm ${email.read ? "font-normal" : "font-bold"}`}>{email.sender.name}</h3>
                        <span className="text-xs text-gray-500">{email.date}</span>
                      </div>
                      <p className={`text-sm truncate ${email.read ? "font-normal" : "font-semibold"}`}>
                        {email.subject}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{email.preview}</p>
                      {(email.labels && email.labels.length > 0) ||
                      (email.attachments && email.attachments.length > 0) ? (
                        <div className="flex items-center mt-1 space-x-2">
                          {email.labels?.map((label) => (
                            <span
                              key={label}
                              className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {label}
                            </span>
                          ))}
                          {email.attachments && email.attachments.length > 0 && (
                            <span className="inline-flex items-center text-xs text-gray-500">
                              <Paperclip className="h-3 w-3 mr-1" />
                              {email.attachments.length}
                            </span>
                          )}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-6">
                <Mail className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No emails found</h3>
                <p className="text-sm text-gray-500 text-center">
                  {searchQuery ? `No emails matching "${searchQuery}"` : `No emails in ${selectedFolder}`}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Email View */}
        <div className={`${selectedEmail ? "block" : "hidden md:block"} flex-1 flex flex-col`}>
          {selectedEmail ? (
            <>
              <div className="p-3 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                <div className="flex items-center">
                  <button
                    className="md:hidden mr-2 p-1 rounded-full hover:bg-gray-200"
                    onClick={() => setSelectedEmail(null)}
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-600" />
                  </button>
                  <h2 className="text-lg font-medium truncate">{selectedEmail.subject}</h2>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="p-1 rounded-full hover:bg-gray-200"
                    onClick={() => handleStarEmail(selectedEmail.id, { stopPropagation: () => {} } as any)}
                  >
                    <Star
                      className={`h-5 w-5 ${selectedEmail.starred ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`}
                    />
                  </button>
                  <button
                    className="p-1 rounded-full hover:bg-gray-200"
                    onClick={() => handleDeleteEmail(selectedEmail.id)}
                  >
                    <Trash className="h-5 w-5 text-gray-600" />
                  </button>
                  <button className="p-1 rounded-full hover:bg-gray-200">
                    <MoreVertical className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                        <span className="text-sm font-medium">{selectedEmail.sender.name.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">
                          {selectedEmail.sender.name}{" "}
                          <span className="text-gray-500">&lt;{selectedEmail.sender.email}&gt;</span>
                        </h3>
                        <p className="text-xs text-gray-500">To: me@example.com • {selectedEmail.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-1 rounded-full hover:bg-gray-200">
                        <Reply className="h-5 w-5 text-gray-600" />
                      </button>
                      <button className="p-1 rounded-full hover:bg-gray-200">
                        <Forward className="h-5 w-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: selectedEmail.body }} />

                {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <h3 className="text-sm font-medium mb-2">Attachments ({selectedEmail.attachments.length})</h3>
                    <div className="flex flex-wrap gap-3">
                      {selectedEmail.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center p-2 border border-gray-200 rounded-md bg-gray-50">
                          <File className="h-5 w-5 text-gray-500 mr-2" />
                          <div>
                            <p className="text-sm font-medium">{attachment.name}</p>
                            <p className="text-xs text-gray-500">{attachment.size}</p>
                          </div>
                          <button className="ml-3 p-1 rounded-full hover:bg-gray-200">
                            <Download className="h-4 w-4 text-gray-600" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <div className="flex space-x-2">
                  <Button>
                    <Reply className="mr-2 h-4 w-4" /> Reply
                  </Button>
                  <Button variant="secondary">
                    <Forward className="mr-2 h-4 w-4" /> Forward
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-6">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <Mail className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select an email</h3>
              <p className="text-sm text-gray-500 text-center max-w-md">
                Choose an email from the list to view its contents or use the search to find a specific message.
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Compose Email Modal */}
      <Modal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        title="Compose Email"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setIsComposeOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendEmail}>Send</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">
              To
            </label>
            <input
              id="to"
              type="email"
              value={composeEmail.to}
              onChange={(e) => setComposeEmail({ ...composeEmail, to: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-black bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <input
              id="subject"
              type="text"
              value={composeEmail.subject}
              onChange={(e) => setComposeEmail({ ...composeEmail, subject: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-black bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              id="body"
              value={composeEmail.body}
              onChange={(e) => setComposeEmail({ ...composeEmail, body: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-black bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              rows={10}
            />
          </div>

          <div className="flex items-center">
            <button className="flex items-center text-sm text-primary hover:underline">
              <Paperclip className="mr-1 h-4 w-4" /> Attach files
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

import { Download } from "lucide-react"
