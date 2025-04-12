import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Sidebar from "@/components/layouts/sidebar"
import Header from "@/components/layouts/header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Modern CRM",
  description: "A modern, scalable CRM system",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen bg-secondary">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto px-8 py-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  )
}


import './globals.css'