"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Users,
  MessageSquare,
  FileText,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Home,
  Mail,
  Phone,
  MessageCircle,
  BarChart2,
  Target,
  Bell,
  UserCog,
  Rocket,
  ChevronDown,
  Receipt,
  FileCheck,
  ShoppingCart,
  FileSpreadsheet,
  Truck,
  FileIcon,
  FileSignature,
  FileSearch,
  Clock,
  DollarSign,
  FileOutput,
} from "lucide-react"
import { cn } from "@/lib/utils"

type NavItem = {
  title: string
  href: string
  icon: React.ElementType
  subItems?: NavItem[]
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    title: "Communications",
    href: "/communications",
    icon: MessageSquare,
    subItems: [
      { title: "WhatsApp", href: "/communications/whatsapp", icon: MessageSquare },
      { title: "Email", href: "/communications/email", icon: Mail },
      { title: "SMS", href: "/communications/sms", icon: MessageCircle },
      { title: "VoIP", href: "/communications/voip", icon: Phone },
    ],
  },
  {
    title: "Clients",
    href: "/clients",
    icon: Users,
  },
  {
    title: "Finance",
    href: "/finance",
    icon: CreditCard,
    subItems: [
      {
        title: "Core Finance Docs",
        href: "/finance/core",
        icon: FileText,
        subItems: [
          { title: "Invoices", href: "/finance/core/invoices", icon: FileText },
          { title: "Receipts", href: "/finance/core/receipts", icon: Receipt },
          { title: "Quotes/Estimates", href: "/finance/core/quotes", icon: FileCheck },
          { title: "Purchase Orders", href: "/finance/core/purchase-orders", icon: ShoppingCart },
          { title: "Credit Notes", href: "/finance/core/credit-notes", icon: CreditCard },
          { title: "Account Statements", href: "/finance/core/statements", icon: FileSpreadsheet },
          { title: "Delivery Notes", href: "/finance/core/delivery-notes", icon: Truck },
          { title: "Pro Forma Invoices", href: "/finance/core/pro-forma", icon: FileIcon },
        ],
      },
      {
        title: "Supporting Docs",
        href: "/finance/supporting",
        icon: FileSignature,
        subItems: [
          { title: "Contracts/Agreements", href: "/finance/supporting/contracts", icon: FileSignature },
          { title: "Proof of Payment", href: "/finance/supporting/proof-of-payment", icon: FileSearch },
          { title: "Tax Documents", href: "/finance/supporting/tax-documents", icon: FileOutput },
          { title: "Timesheets", href: "/finance/supporting/timesheets", icon: Clock },
        ],
      },
      {
        title: "Expense & Payment",
        href: "/finance/expense",
        icon: DollarSign,
        subItems: [
          { title: "Expense Claims", href: "/finance/expense/claims", icon: DollarSign },
          { title: "Bills/Payables", href: "/finance/expense/bills", icon: FileText },
          { title: "Payment Vouchers", href: "/finance/expense/payment-vouchers", icon: Receipt },
        ],
      },
    ],
  },
  {
    title: "Documents",
    href: "/documents",
    icon: FileText,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    title: "Help & Support",
    href: "/help",
    icon: HelpCircle,
  },
]

const comingSoonItems: NavItem[] = [
  {
    title: "Marketing Automation",
    href: "#",
    icon: Target,
  },
  {
    title: "Lead Management",
    href: "#",
    icon: Users,
  },
  {
    title: "Analytics & Forecasting",
    href: "#",
    icon: BarChart2,
  },
  {
    title: "Team/Role Permissions",
    href: "#",
    icon: UserCog,
  },
  {
    title: "Notifications System",
    href: "#",
    icon: Bell,
  },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({})
  const [comingSoonOpen, setComingSoonOpen] = useState(false)
  const pathname = usePathname()

  // Check if current path is in a submenu and open it
  useEffect(() => {
    const newOpenSubMenus: Record<string, boolean> = {}

    const checkSubItems = (items: NavItem[], parentTitle?: string) => {
      items.forEach((item) => {
        if (pathname === item.href) {
          if (parentTitle) {
            newOpenSubMenus[parentTitle] = true
          }
        }

        if (item.subItems) {
          const isInSubItems = item.subItems.some(
            (subItem) => pathname === subItem.href || pathname.startsWith(subItem.href + "/"),
          )

          if (isInSubItems) {
            newOpenSubMenus[item.title] = true
            if (parentTitle) {
              newOpenSubMenus[parentTitle] = true
            }
          }

          checkSubItems(item.subItems, item.title)
        }
      })
    }

    checkSubItems(navItems)
    setOpenSubMenus(newOpenSubMenus)
  }, [pathname])

  const toggleSubMenu = (title: string) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  const renderNavItems = (items: NavItem[], level = 0) => {
    return items.map((item) => (
      <li key={item.title}>
        <Link
          href={item.href}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
            pathname === item.href ? "bg-white/20 text-white" : "hover:bg-white/10",
            level > 0 && "ml-4 text-sm",
          )}
          onClick={(e) => {
            if (item.subItems) {
              e.preventDefault()
              toggleSubMenu(item.title)
            }
          }}
        >
          <item.icon className="h-5 w-5 flex-shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1">{item.title}</span>
              {item.subItems && (
                <ChevronRight className={cn("h-4 w-4 transition-transform", openSubMenus[item.title] && "rotate-90")} />
              )}
            </>
          )}
        </Link>

        {!collapsed && item.subItems && openSubMenus[item.title] && (
          <ul className={cn("mt-1 space-y-1 border-l border-white/10 pl-3", level === 0 ? "ml-6" : "ml-4")}>
            {renderNavItems(item.subItems, level + 1)}
          </ul>
        )}
      </li>
    ))
  }

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-[#3396ff] text-white transition-all duration-300 ease-in-out relative",
        collapsed ? "w-20" : "w-64",
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h1 className={cn("font-bold text-xl", collapsed && "hidden")}>CRM</h1>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-md hover:bg-white/10 transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {renderNavItems(navItems)}

          {/* Coming Soon Section */}
          <li className="mt-4 pt-4 border-t border-white/10">
            <button
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors w-full text-left",
                "hover:bg-white/10",
              )}
              onClick={() => !collapsed && setComingSoonOpen(!comingSoonOpen)}
            >
              <Rocket className="h-5 w-5 flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1">Coming Soon</span>
                  <ChevronDown className={cn("h-4 w-4 transition-transform", comingSoonOpen && "rotate-180")} />
                </>
              )}
            </button>

            {!collapsed && comingSoonOpen && (
              <ul className="mt-1 ml-6 space-y-1 border-l border-white/10 pl-3">
                {comingSoonItems.map((item) => (
                  <li key={item.title}>
                    <div
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-white/60 cursor-not-allowed"
                      title="In Development"
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      <span>{item.title}</span>
                      <span className="ml-auto text-xs bg-white/20 px-1.5 py-0.5 rounded">Soon</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
      </nav>
    </div>
  )
}
