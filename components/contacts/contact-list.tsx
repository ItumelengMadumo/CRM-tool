"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { Plus, Search, User } from "lucide-react"

type Contact = {
  id: string
  name: string
  email: string
  phone: string
  company?: string
  lastContact?: string
}

const mockContacts: Contact[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    company: "Acme Inc",
    lastContact: "2 days ago",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+1 (555) 987-6543",
    company: "Globex Corp",
    lastContact: "1 week ago",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    phone: "+1 (555) 456-7890",
    company: "Initech",
    lastContact: "3 hours ago",
  },
  {
    id: "4",
    name: "Alice Williams",
    email: "alice@example.com",
    phone: "+1 (555) 789-0123",
    company: "Umbrella Corp",
    lastContact: "Just now",
  },
  {
    id: "5",
    name: "Charlie Brown",
    email: "charlie@example.com",
    phone: "+1 (555) 321-6549",
    company: "Stark Industries",
    lastContact: "Yesterday",
  },
]

export function ContactList() {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery),
  )

  const handleAddContact = () => {
    // Validate form
    const newErrors: Record<string, string> = {}

    if (!newContact.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!newContact.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(newContact.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!newContact.phone.trim()) {
      newErrors.phone = "Phone is required"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Add new contact
    const newContactWithId = {
      ...newContact,
      id: Math.random().toString(36).substring(2, 9),
      lastContact: "Just now",
    }

    setContacts([newContactWithId, ...contacts])
    setNewContact({ name: "", email: "", phone: "", company: "" })
    setErrors({})
    setIsAddModalOpen(false)
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Contacts</CardTitle>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Contact
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-md border border-black bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-4">
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 border border-gray-200"
                >
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{contact.name}</p>
                    <p className="text-xs text-gray-500 truncate">{contact.email}</p>
                    <p className="text-xs text-gray-500 truncate">{contact.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Last contact</p>
                    <p className="text-xs font-medium">{contact.lastContact}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No contacts found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false)
          setErrors({})
          setNewContact({ name: "", email: "", phone: "", company: "" })
        }}
        title="Add New Contact"
        footer={
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                setIsAddModalOpen(false)
                setErrors({})
                setNewContact({ name: "", email: "", phone: "", company: "" })
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddContact}>Add Contact</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-black bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={newContact.email}
              onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-black bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              value={newContact.phone}
              onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-black bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </label>
            <input
              id="company"
              type="text"
              value={newContact.company}
              onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-black bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </Modal>
    </>
  )
}
