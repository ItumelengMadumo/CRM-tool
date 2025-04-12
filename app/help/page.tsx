"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, HelpCircle, Mail, MessageSquare } from "lucide-react"

type FAQ = {
  question: string
  answer: string
}

const faqs: FAQ[] = [
  {
    question: "How do I add a new client?",
    answer:
      "To add a new client, navigate to the Clients page and click the 'Add Client' button in the top right corner. Fill out the required information in the form and click 'Add Client' to save.",
  },
  {
    question: "How do I create an invoice?",
    answer:
      "To create an invoice, go to the Invoices page and click the 'Create Invoice' button. Select a client, add line items, and set a due date. You can preview the invoice before sending it to the client.",
  },
  {
    question: "How do I connect my email account?",
    answer:
      "To connect your email account, go to the Communications page and select the Email tab. Click on 'Connect Email' and follow the instructions to authorize your email provider.",
  },
  {
    question: "Can I export my data?",
    answer:
      "Yes, you can export your data in various formats. Go to Settings > Data Management and select 'Export Data'. Choose the data you want to export and the format (CSV, Excel, PDF).",
  },
  {
    question: "How do I set up notifications?",
    answer:
      "To set up notifications, go to Settings > Notification Preferences. You can choose to receive notifications via email, SMS, or desktop notifications for various events like new messages, invoice payments, etc.",
  },
  {
    question: "How do I upload documents?",
    answer:
      "To upload documents, navigate to the Documents page and click the 'Upload Document' button. You can drag and drop files or click to browse your computer. Add metadata like description and related client before uploading.",
  },
  {
    question: "How do I change my password?",
    answer:
      "To change your password, go to Settings > Security and click on 'Change Password'. Enter your current password and your new password twice to confirm the change.",
  },
  {
    question: "How do I add team members?",
    answer:
      "To add team members, go to Settings > Team Management and click 'Invite Team Member'. Enter their email address and select their role and permissions. They will receive an invitation email to join your workspace.",
  },
]

export default function HelpPage() {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)

  const toggleFAQ = (question: string) => {
    setExpandedFAQ(expandedFAQ === question ? null : question)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
        <p className="text-gray-500">Find answers to common questions or contact support</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-gray-500" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div key={faq.question} className="border border-gray-200 rounded-md overflow-hidden">
                    <button
                      className="flex items-center justify-between w-full p-4 text-left bg-white hover:bg-gray-50 transition-colors"
                      onClick={() => toggleFAQ(faq.question)}
                    >
                      <h3 className="text-sm font-medium">{faq.question}</h3>
                      <ChevronDown
                        className={`h-5 w-5 text-gray-500 transition-transform ${
                          expandedFAQ === faq.question ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {expandedFAQ === faq.question && (
                      <div className="p-4 bg-gray-50 border-t border-gray-200">
                        <p className="text-sm text-gray-700">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-gray-500" />
                Contact Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-700">
                  Can't find what you're looking for? Our support team is here to help.
                </p>
                <Button className="w-full">
                  <Mail className="mr-2 h-4 w-4" /> Email Support
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-gray-500" />
                Live Chat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-700">Need immediate assistance? Chat with our support team.</p>
                <Button className="w-full">
                  <MessageSquare className="mr-2 h-4 w-4" /> Start Chat
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-gray-500" />
                Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <a href="#" className="block p-2 text-sm text-primary hover:bg-gray-50 rounded-md transition-colors">
                  User Guide
                </a>
                <a href="#" className="block p-2 text-sm text-primary hover:bg-gray-50 rounded-md transition-colors">
                  Video Tutorials
                </a>
                <a href="#" className="block p-2 text-sm text-primary hover:bg-gray-50 rounded-md transition-colors">
                  API Documentation
                </a>
                <a href="#" className="block p-2 text-sm text-primary hover:bg-gray-50 rounded-md transition-colors">
                  Release Notes
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
