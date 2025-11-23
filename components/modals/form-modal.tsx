"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import { useCallback } from "react"

interface FormField {
  name: string
  label: string
  type: "text" | "email" | "number" | "select"
  required?: boolean
  options?: { value: string; label: string }[]
  placeholder?: string
}

interface FormModalProps {
  isOpen: boolean
  title: string
  fields: FormField[]
  onClose: () => void
  onSubmit: (data: Record<string, string | number>) => void
  submitLabel?: string
  isLoading?: boolean
  initialData?: Record<string, string | number>
}

export function FormModal({
  isOpen,
  title,
  fields,
  onClose,
  onSubmit,
  submitLabel = "Save",
  isLoading = false,
  initialData = {},
}: FormModalProps) {
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const formData = new FormData(e.currentTarget)
      const data: Record<string, string | number> = {}
      formData.forEach((value, key) => {
        data[key] = isNaN(Number(value)) ? String(value) : Number(value)
      })
      onSubmit(data)
    },
    [onSubmit],
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg max-w-md w-full space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name} className="space-y-1">
              <label className="text-sm font-medium text-foreground">{field.label}</label>
              {field.type === "select" ? (
                <select
                  name={field.name}
                  required={field.required}
                  defaultValue={initialData[field.name] || ""}
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground text-sm"
                >
                  <option value="">Select {field.label.toLowerCase()}</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  name={field.name}
                  type={field.type}
                  required={field.required}
                  placeholder={field.placeholder}
                  defaultValue={initialData[field.name] || ""}
                  className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
                />
              )}
            </div>
          ))}

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-border text-foreground hover:bg-muted bg-transparent"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1 bg-primary text-primary-foreground">
              {isLoading ? "Saving..." : submitLabel}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
