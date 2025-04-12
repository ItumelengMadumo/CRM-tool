"use client"

import { useState, useRef, useEffect } from "react"
import { Search, Paperclip, Send, MoreVertical, Phone, Video, User, File, Smile } from "lucide-react"
import { Card } from "@/components/ui/card"

type Contact = {
  id: string
  name: string
  avatar?: string
  lastMessage?: string
  lastMessageTime?: string
  unreadCount?: number
  online?: boolean
  typing?: boolean
}

type Message = {
  id: string
  content: string
  timestamp: string
  sender: "me" | "them"
  status?: "sent" | "delivered" | "read"
  attachment?: {
    type: "image" | "file"
    url: string
    name?: string
  }
}

const mockContacts: Contact[] = [
  {
    id: "1",
    name: "John Doe",
    lastMessage: "Can you send me the proposal?",
    lastMessageTime: "10:30 AM",
    unreadCount: 2,
    online: true,
  },
  {
    id: "2",
    name: "Jane Smith",
    lastMessage: "Thanks for the update!",
    lastMessageTime: "Yesterday",
    online: false,
  },
  {
    id: "3",
    name: "Bob Johnson",
    lastMessage: "Let's schedule a call next week",
    lastMessageTime: "Yesterday",
    unreadCount: 1,
    online: true,
    typing: true,
  },
  {
    id: "4",
    name: "Alice Williams",
    lastMessage: "The invoice has been paid",
    lastMessageTime: "Monday",
    online: false,
  },
  {
    id: "5",
    name: "Charlie Brown",
    lastMessage: "I'll review the contract and get back to you",
    lastMessageTime: "Sunday",
    online: false,
  },
  {
    id: "6",
    name: "David Miller",
    lastMessage: "Can we reschedule our meeting?",
    lastMessageTime: "Last week",
    online: false,
  },
  {
    id: "7",
    name: "Eva Garcia",
    lastMessage: "I've sent you the files",
    lastMessageTime: "Last week",
    online: true,
  },
]

const mockMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "1",
      content: "Hi John, how are you?",
      timestamp: "10:15 AM",
      sender: "me",
      status: "read",
    },
    {
      id: "2",
      content: "I'm good, thanks! How about you?",
      timestamp: "10:17 AM",
      sender: "them",
    },
    {
      id: "3",
      content: "I'm doing well. I wanted to discuss the new project.",
      timestamp: "10:20 AM",
      sender: "me",
      status: "read",
    },
    {
      id: "4",
      content: "Sure, what do you need?",
      timestamp: "10:22 AM",
      sender: "them",
    },
    {
      id: "5",
      content: "Can you send me the proposal?",
      timestamp: "10:30 AM",
      sender: "them",
    },
  ],
  "3": [
    {
      id: "1",
      content: "Hi Bob, do you have time for a quick call?",
      timestamp: "Yesterday, 2:15 PM",
      sender: "me",
      status: "read",
    },
    {
      id: "2",
      content: "I'm in a meeting right now. Can we talk later?",
      timestamp: "Yesterday, 2:30 PM",
      sender: "them",
    },
    {
      id: "3",
      content: "Sure, no problem. When are you free?",
      timestamp: "Yesterday, 2:32 PM",
      sender: "me",
      status: "read",
    },
    {
      id: "4",
      content: "Let's schedule a call next week",
      timestamp: "Yesterday, 5:45 PM",
      sender: "them",
    },
  ],
}

export default function WhatsAppPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const filteredContacts = mockContacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  useEffect(() => {
    if (selectedContact && mockMessages[selectedContact.id]) {
      setMessages(mockMessages[selectedContact.id])
    } else {
      setMessages([])
    }
  }, [selectedContact])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!message.trim() || !selectedContact) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      sender: "me",
      status: "sent",
    }

    setMessages([...messages, newMessage])
    setMessage("")

    // Simulate reply after 1-3 seconds
    if (Math.random() > 0.5) {
      const replyDelay = 1000 + Math.random() * 2000
      setTimeout(() => {
        const reply: Message = {
          id: (Date.now() + 1).toString(),
          content: "Thanks for your message. I'll get back to you soon.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          sender: "them",
        }
        setMessages((prev) => [...prev, reply])
      }, replyDelay)
    }
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">WhatsApp</h1>
        <p className="text-gray-500">Manage your WhatsApp conversations</p>
      </div>

      <Card className="flex-1 flex overflow-hidden">
        {/* Contacts List */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className={`flex items-center p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  selectedContact?.id === contact.id ? "bg-gray-100" : ""
                }`}
                onClick={() => setSelectedContact(contact)}
              >
                <div className="relative">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {contact.avatar ? (
                      <img
                        src={contact.avatar || "/placeholder.svg"}
                        alt={contact.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-6 w-6" />
                    )}
                  </div>
                  {contact.online && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
                  )}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-medium truncate">{contact.name}</h3>
                    <span className="text-xs text-gray-500">{contact.lastMessageTime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500 truncate max-w-[180px]">
                      {contact.typing ? (
                        <span className="text-primary">typing...</span>
                      ) : (
                        contact.lastMessage || "No messages yet"
                      )}
                    </p>
                    {contact.unreadCount && contact.unreadCount > 0 ? (
                      <span className="bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {contact.unreadCount}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <div className="p-3 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                <div className="flex items-center">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {selectedContact.avatar ? (
                        <img
                          src={selectedContact.avatar || "/placeholder.svg"}
                          alt={selectedContact.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                    </div>
                    {selectedContact.online && (
                      <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white"></div>
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium">{selectedContact.name}</h3>
                    <p className="text-xs text-gray-500">
                      {selectedContact.online
                        ? selectedContact.typing
                          ? "typing..."
                          : "online"
                        : "last seen recently"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 rounded-full hover:bg-gray-200">
                    <Phone className="h-5 w-5 text-gray-600" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-200">
                    <Video className="h-5 w-5 text-gray-600" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-200">
                    <MoreVertical className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50 bg-opacity-50">
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          msg.sender === "me"
                            ? "bg-primary text-white rounded-tr-none"
                            : "bg-white border border-gray-200 rounded-tl-none"
                        }`}
                      >
                        {msg.attachment && (
                          <div className="mb-2">
                            {msg.attachment.type === "image" ? (
                              <img
                                src={msg.attachment.url || "/placeholder.svg"}
                                alt="attachment"
                                className="rounded-md max-h-40 w-auto"
                              />
                            ) : (
                              <div className="flex items-center p-2 bg-gray-100 rounded-md">
                                <File className="h-4 w-4 mr-2 text-gray-500" />
                                <span className="text-xs truncate">{msg.attachment.name}</span>
                              </div>
                            )}
                          </div>
                        )}
                        <p className={`text-sm ${msg.sender === "me" ? "text-white" : "text-gray-800"}`}>
                          {msg.content}
                        </p>
                        <div className="flex items-center justify-end mt-1 space-x-1">
                          <span className={`text-xs ${msg.sender === "me" ? "text-white/70" : "text-gray-500"}`}>
                            {msg.timestamp}
                          </span>
                          {msg.sender === "me" && msg.status && (
                            <span className="text-xs text-white/70">
                              {msg.status === "sent" && "✓"}
                              {msg.status === "delivered" && "✓✓"}
                              {msg.status === "read" && <span className="text-blue-300">✓✓</span>}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Message Input */}
              <div className="p-3 border-t border-gray-200 flex items-center space-x-2">
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Smile className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Paperclip className="h-5 w-5 text-gray-600" />
                </button>
                <input
                  type="text"
                  placeholder="Type a message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  className="flex-1 py-2 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  className="p-2 rounded-full bg-primary text-white hover:bg-primary/90"
                  onClick={handleSendMessage}
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-6">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <MessageSquare className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-sm text-gray-500 text-center max-w-md">
                Choose a contact from the list to start chatting or search for a specific person.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

import { MessageSquare } from "lucide-react"
