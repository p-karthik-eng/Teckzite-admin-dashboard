"use client"

import { Button } from "@/components/ui/button"
import { AlertCircle, X } from "lucide-react"

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
  isDangerous?: boolean
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isLoading = false,
  isDangerous = false,
}: ConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg max-w-sm w-full space-y-4 p-6">
        <div className="flex items-center gap-3">
          {isDangerous && <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0" />}
          <h2 className="text-lg font-bold text-foreground">{title}</h2>
          <button onClick={onCancel} className="ml-auto text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground">{message}</p>

        <div className="flex gap-2 pt-4">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1 border-border text-foreground hover:bg-muted bg-transparent"
          >
            {cancelLabel}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 ${isDangerous ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"} text-white`}
          >
            {isLoading ? "Processing..." : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
