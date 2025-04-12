"use client"

import { useState, useEffect } from "react"
import { Search, Phone, User, Clock, Mic, MicOff, PhoneOff, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Contact = {
  id: string
  name: string
  phone: string
  avatar?: string
  status?: "available" | "busy" | "away" | "offline"
  favorite?: boolean
}

type CallLog = {
  id: string
  contactId: string
  contactName: string
  contactAvatar?: string
  phone: string
  type: "incoming" | "outgoing" | "missed"
  duration?: string
  timestamp: string
  notes?: string
}

const mockContacts: Contact[] = [
  {
    id: "1",
    name: "John Doe",
    phone: "+1 (555) 123-4567",
    status: "available",
    favorite: true,
  },
  {
    id: "2",
    name: "Jane Smith",
    phone: "+1 (555) 987-6543",
    status: "busy",
  },
  {
    id: "3",
    name: "Bob Johnson",
    phone: "+1 (555) 456-7890",
    status: "available",
    favorite: true,
  },
  {
    id: "4",
    name: "Alice Williams",
    phone: "+1 (555) 789-0123",
    status: "away",
  },
  {
    id: "5",
    name: "Charlie Brown",
    phone: "+1 (555) 321-6549",
    status: "offline",
  },
  {
    id: "6",
    name: "David Miller",
    phone: "+1 (555) 654-9870",
    status: "available",
  },
  {
    id: "7",
    name: "Eva Garcia",
    phone: "+1 (555) 987-1234",
    status: "busy",
  },
]

const mockCallLogs: CallLog[] = [
  {
    id: "1",
    contactId: "1",
    contactName: "John Doe",
    phone: "+1 (555) 123-4567",
    type: "outgoing",
    duration: "5:23",
    timestamp: "Today, 10:30 AM",
    notes: "Discussed project timeline and deliverables",
  },
  {
    id: "2",
    contactId: "3",
    contactName: "Bob Johnson",
    phone: "+1 (555) 456-7890",
    type: "incoming",
    duration: "2:45",
    timestamp: "Today, 9:15 AM",
  },
  {
    id: "3",
    contactId: "2",
    contactName: "Jane Smith",
    phone: "+1 (555) 987-6543",
    type: "missed",
    timestamp: "Yesterday, 4:30 PM",
  },
  {
    id: "4",
    contactId: "4",
    contactName: "Alice Williams",
    phone: "+1 (555) 789-0123",
    type: "incoming",
    duration: "8:12",
    timestamp: "Yesterday, 2:00 PM",
    notes: "Quarterly review call",
  },
  {
    id: "5",
    contactId: "5",
    contactName: "Charlie Brown",
    phone: "+1 (555) 321-6549",
    type: "outgoing",
    duration: "1:05",
    timestamp: "Yesterday, 11:20 AM",
  },
]

export default function VoIPPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("contacts")
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>(mockContacts)
  const [callLogs, setCallLogs] = useState<CallLog[]>(mockCallLogs)
  const [isDialpadOpen, setIsDialpadOpen] = useState(false)
  const [dialNumber, setDialNumber] = useState("")
  const [isCallActive, setIsCallActive] = useState(false)
  const [activeCall, setActiveCall] = useState<{
    name: string
    phone: string
    duration: number
    isMuted: boolean
  } | null>(null)
  const [callTimer, setCallTimer] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (activeTab === "contacts") {
      setFilteredContacts(
        mockContacts.filter(
          (contact) =>
            contact.name.toLowerCase().includes(searchQuery.toLowerCase()) || contact.phone.includes(searchQuery),
        ),
      )
    } else if (activeTab === "logs") {
      setCallLogs(
        mockCallLogs.filter(
          (log) => log.contactName.toLowerCase().includes(searchQuery.toLowerCase()) || log.phone.includes(searchQuery),
        ),
      )
    }
  }, [searchQuery, activeTab])

  const handleCall = (contact: Contact) => {
    if (isCallActive) return

    setIsCallActive(true)
    setActiveCall({
      name: contact.name,
      phone: contact.phone,
      duration: 0,
      isMuted: false,
    })

    const timer = setInterval(() => {
      setActiveCall((prev) => {
        if (!prev) return null
        return { ...prev, duration: prev.duration + 1 }
      })
    }, 1000)

    setCallTimer(timer)

    // Add to call logs
    const newCallLog: CallLog = {
      id: Date.now().toString(),
      contactId: contact.id,
      contactName: contact.name,
      contactAvatar: contact.avatar,
      phone: contact.phone,
      type: "outgoing",
      timestamp: new Date().toLocaleString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    }

    setCallLogs([newCallLog, ...callLogs])
  }

  const handleEndCall = () => {
    if (!isCallActive || !activeCall) return

    if (callTimer) {
      clearInterval(callTimer)
    }

    // Update call log with duration
    if (activeCall.duration > 0) {
      setCallLogs((prev) =>
        prev.map((log, index) => {
          if (index === 0) {
            return {
              ...log,
              duration: `${Math.floor(activeCall.duration / 60)}:${(activeCall.duration % 60)
                .toString()
                .padStart(2, "0")}`,
            }
          }
          return log
        }),
      )
    }

    setIsCallActive(false)
    setActiveCall(null)
    setCallTimer(null)
  }

  const handleToggleMute = () => {
    if (!activeCall) return
    setActiveCall({ ...activeCall, isMuted: !activeCall.isMuted })
  }

  const formatCallDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleDialpadPress = (digit: string) => {
    setDialNumber((prev) => prev + digit)
  }

  const handleDialpadCall = () => {
    if (!dialNumber.trim()) return

    setIsCallActive(true)
    setActiveCall({
      name: "Unknown",
      phone: dialNumber,
      duration: 0,
      isMuted: false,
    })

    const timer = setInterval(() => {
      setActiveCall((prev) => {
        if (!prev) return null
        return { ...prev, duration: prev.duration + 1 }
      })
    }, 1000)

    setCallTimer(timer)

    // Add to call logs
    const newCallLog: CallLog = {
      id: Date.now().toString(),
      contactId: "",
      contactName: "Unknown",
      phone: dialNumber,
      type: "outgoing",
      timestamp: new Date().toLocaleString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    }

    setCallLogs([newCallLog, ...callLogs])
    setDialNumber("")
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">VoIP</h1>
        <p className="text-gray-500">Manage your calls and voice communications</p>
      </div>

      {isCallActive && activeCall ? (
        <Card className="flex-1 flex flex-col">
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
              <User className="h-12 w-12" />
            </div>
            <h2 className="text-2xl font-bold mb-1">{activeCall.name}</h2>
            <p className="text-gray-500 mb-4">{activeCall.phone}</p>
            <p className="text-xl font-medium mb-8">{formatCallDuration(activeCall.duration)}</p>

            <div className="flex items-center space-x-6">
              <button
                className={`p-4 rounded-full ${
                  activeCall.isMuted ? "bg-gray-200" : "bg-gray-100"
                } hover:bg-gray-200 transition-colors`}
                onClick={handleToggleMute}
              >
                {activeCall.isMuted ? (
                  <MicOff className="h-6 w-6 text-gray-600" />
                ) : (
                  <Mic className="h-6 w-6 text-gray-600" />
                )}
              </button>
              <button
                className="p-4 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
                onClick={handleEndCall}
              >
                <PhoneOff className="h-6 w-6 text-white" />
              </button>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="flex-1 flex flex-col">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Tabs defaultValue="contacts" className="w-full" onValueChange={setActiveTab}>
                  <div className="flex items-center justify-between mb-4">
                    <TabsList className="grid grid-cols-2 w-64">
                      <TabsTrigger value="contacts">Contacts</TabsTrigger>
                      <TabsTrigger value="logs">Call Logs</TabsTrigger>
                    </TabsList>
                    <Button
                      variant={isDialpadOpen ? "secondary" : "primary"}
                      onClick={() => setIsDialpadOpen(!isDialpadOpen)}
                    >
                      {isDialpadOpen ? <X className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />} Dialpad
                    </Button>
                  </div>
                </Tabs>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex pt-4">
            <div className={`${isDialpadOpen ? "w-2/3" : "w-full"} flex flex-col`}>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder={`Search ${activeTab === "contacts" ? "contacts" : "call logs"}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                <Tabs defaultValue={activeTab} value={activeTab} className="w-full">
                  <TabsContent value="contacts" className="mt-0">
                    {filteredContacts.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredContacts.map((contact) => (
                          <div
                            key={contact.id}
                            className="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:bg-gray-50"
                          >
                            <div className="flex items-center">
                              <div className="relative">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                  {contact.avatar ? (
                                    <img
                                      src={contact.avatar || "/placeholder.svg"}
                                      alt={contact.name}
                                      className="h-10 w-10 rounded-full object-cover"
                                    />
                                  ) : (
                                    <User className="h-5 w-5" />
                                  )}
                                </div>
                                {contact.status && (
                                  <div
                                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                                      contact.status === "available"
                                        ? "bg-green-500"
                                        : contact.status === "busy"
                                          ? "bg-red-500"
                                          : contact.status === "away"
                                            ? "bg-yellow-500"
                                            : "bg-gray-500"
                                    }`}
                                  ></div>
                                )}
                              </div>
                              <div className="ml-3">
                                <h3 className="text-sm font-medium">{contact.name}</h3>
                                <p className="text-xs text-gray-500">{contact.phone}</p>
                              </div>
                            </div>
                            <button
                              className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
                              onClick={() => handleCall(contact)}
                            >
                              <Phone className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-64">
                        <User className="h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
                        <p className="text-sm text-gray-500 text-center">
                          {searchQuery ? `No contacts matching "${searchQuery}"` : "Add contacts to get started"}
                        </p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="logs" className="mt-0">
                    {callLogs.length > 0 ? (
                      <div className="space-y-4">
                        {callLogs.map((log) => (
                          <div key={log.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div
                                  className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                    log.type === "incoming"
                                      ? "bg-green-100 text-green-600"
                                      : log.type === "outgoing"
                                        ? "bg-blue-100 text-blue-600"
                                        : "bg-red-100 text-red-600"
                                  }`}
                                >
                                  <Phone
                                    className={`h-5 w-5 ${
                                      log.type === "incoming"
                                        ? "rotate-90"
                                        : log.type === "outgoing"
                                          ? "-rotate-90"
                                          : "rotate-90"
                                    }`}
                                  />
                                </div>
                                <div className="ml-3">
                                  <h3 className="text-sm font-medium">{log.contactName}</h3>
                                  <p className="text-xs text-gray-500">{log.phone}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-gray-500">{log.timestamp}</p>
                                {log.duration && <p className="text-xs font-medium">{log.duration}</p>}
                              </div>
                            </div>
                            {log.notes && (
                              <div className="mt-2 pt-2 border-t border-gray-100">
                                <p className="text-xs text-gray-600">{log.notes}</p>
                              </div>
                            )}
                            <div className="mt-2 flex justify-end">
                              <button
                                className="p-1.5 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
                                onClick={() =>
                                  handleCall({
                                    id: log.contactId,
                                    name: log.contactName,
                                    phone: log.phone,
                                    avatar: log.contactAvatar,
                                  })
                                }
                              >
                                <Phone className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-64">
                        <Clock className="h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No call logs found</h3>
                        <p className="text-sm text-gray-500 text-center">
                          {searchQuery
                            ? `No call logs matching "${searchQuery}"`
                            : "Your call history will appear here"}
                        </p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {isDialpadOpen && (
              <div className="w-1/3 border-l border-gray-200 p-4">
                <div className="mb-4">
                  <input
                    type="text"
                    value={dialNumber}
                    onChange={(e) => setDialNumber(e.target.value)}
                    className="w-full px-4 py-2 text-center text-xl font-medium rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter number"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#"].map((digit) => (
                    <button
                      key={digit}
                      className="p-4 rounded-md bg-gray-100 hover:bg-gray-200 text-xl font-medium"
                      onClick={() => handleDialpadPress(digit.toString())}
                    >
                      {digit}
                    </button>
                  ))}
                </div>

                <div className="mt-4">
                  <Button className="w-full" onClick={handleDialpadCall} disabled={!dialNumber.trim()}>
                    <Phone className="mr-2 h-4 w-4" /> Call
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
