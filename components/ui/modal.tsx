"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { Button } from "./button"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
  maxWidth?: "sm" | "md" | "lg" | "xl"
}

export function Modal({ isOpen, onClose, title, children, footer, maxWidth = "lg" }: ModalProps) {
  const [isMounted, setIsMounted] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)

    if (isOpen) {
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) {
      onClose()
    }
  }

  if (!isMounted) return null

  const modalContent = (
    <div
      ref={overlayRef}
      className={cn(
        "fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 transition-opacity",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
      )}
      onClick={handleOverlayClick}
    >
      <div
        className={cn(
          "w-full bg-white rounded-xl border border-black p-6 shadow-lg max-h-[90vh] flex flex-col transition-all",
          {
            "max-w-sm": maxWidth === "sm",
            "max-w-md": maxWidth === "md",
            "max-w-lg": maxWidth === "lg",
            "max-w-xl": maxWidth === "xl",
          },
          isOpen ? "scale-100" : "scale-95",
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            className="p-1 h-8 w-8 rounded-full"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="overflow-y-auto flex-1">{children}</div>

        {footer && <div className="mt-6">{footer}</div>}
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
