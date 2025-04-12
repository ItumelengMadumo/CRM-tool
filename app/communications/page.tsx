import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ContactManager } from "@/components/contacts/contact-manager"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Mail, Phone, MessageCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CommunicationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Communications</h1>
        <p className="text-gray-500">Manage all your communication channels in one place</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <ContactManager />
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Communication Channels</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="whatsapp">
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="whatsapp" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </TabsTrigger>
                  <TabsTrigger value="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span className="hidden sm:inline">Email</span>
                  </TabsTrigger>
                  <TabsTrigger value="sms" className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    <span className="hidden sm:inline">SMS</span>
                  </TabsTrigger>
                  <TabsTrigger value="voip" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span className="hidden sm:inline">VoIP</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="whatsapp" className="border rounded-md p-6">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 mx-auto text-primary mb-4" />
                    <h3 className="text-lg font-medium mb-2">WhatsApp Messaging</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                      Send and receive WhatsApp messages, share files, and manage your business communications.
                    </p>
                    <Link href="/communications/whatsapp">
                      <Button>Open WhatsApp</Button>
                    </Link>
                  </div>
                </TabsContent>

                <TabsContent value="email" className="border rounded-md p-6">
                  <div className="text-center">
                    <Mail className="h-12 w-12 mx-auto text-primary mb-4" />
                    <h3 className="text-lg font-medium mb-2">Email Communications</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                      Manage your email communications, send newsletters, and track email engagement.
                    </p>
                    <Link href="/communications/email">
                      <Button>Open Email</Button>
                    </Link>
                  </div>
                </TabsContent>

                <TabsContent value="sms" className="border rounded-md p-6">
                  <div className="text-center">
                    <MessageCircle className="h-12 w-12 mx-auto text-primary mb-4" />
                    <h3 className="text-lg font-medium mb-2">SMS Messaging</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                      Send and receive SMS messages, set up automated responses, and track message delivery.
                    </p>
                    <Link href="/communications/sms">
                      <Button>Open SMS</Button>
                    </Link>
                  </div>
                </TabsContent>

                <TabsContent value="voip" className="border rounded-md p-6">
                  <div className="text-center">
                    <Phone className="h-12 w-12 mx-auto text-primary mb-4" />
                    <h3 className="text-lg font-medium mb-2">VoIP Calling</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                      Make and receive calls, record conversations, and manage your call history.
                    </p>
                    <Link href="/communications/voip">
                      <Button>Open VoIP</Button>
                    </Link>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Communications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <MessageSquare className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">WhatsApp message from John Doe</p>
                      <p className="text-xs text-gray-500">10 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200">
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <Mail className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Email from Jane Smith</p>
                      <p className="text-xs text-gray-500">1 hour ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <Phone className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Call with Bob Johnson</p>
                      <p className="text-xs text-gray-500">Yesterday</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Communication Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium">WhatsApp</span>
                    </div>
                    <span className="text-sm">42 messages</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-purple-600" />
                      <span className="text-sm font-medium">Email</span>
                    </div>
                    <span className="text-sm">18 emails</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-orange-600" />
                      <span className="text-sm font-medium">SMS</span>
                    </div>
                    <span className="text-sm">27 messages</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium">VoIP</span>
                    </div>
                    <span className="text-sm">12 calls</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
