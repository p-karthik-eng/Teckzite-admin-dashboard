"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Edit2, Trash2, User, Clock } from "lucide-react"
import { FormModal } from "@/components/modals/form-modal"
import { ConfirmModal } from "@/components/modals/confirm-modal"

interface Workshop {
  id: string
  title: string
  instructor: string
  duration: string
  capacity: number
  enrolled: number
  status: "scheduled" | "in-progress" | "completed"
}

export default function WorkshopsPage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [formModal, setFormModal] = useState({ isOpen: false, editingId: null as string | null })
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, deleteId: null as string | null })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setWorkshops([
        {
          id: "1",
          title: "Advanced Neural Networks",
          instructor: "Dr. Sarah Chen",
          duration: "4 weeks",
          capacity: 30,
          enrolled: 28,
          status: "scheduled",
        },
        {
          id: "2",
          title: "Deep Learning Fundamentals",
          instructor: "Prof. James Wilson",
          duration: "6 weeks",
          capacity: 50,
          enrolled: 47,
          status: "in-progress",
        },
        {
          id: "3",
          title: "Computer Vision Mastery",
          instructor: "Dr. Emily Rodriguez",
          duration: "5 weeks",
          capacity: 40,
          enrolled: 40,
          status: "in-progress",
        },
      ])
      setLoading(false)
    }, 500)
  }, [])

  const filteredWorkshops = workshops.filter(
    (workshop) =>
      workshop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workshop.instructor.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSaveWorkshop = (data: Record<string, string | number>) => {
    setIsSaving(true)
    setTimeout(() => {
      if (formModal.editingId) {
        setWorkshops(
          workshops.map((w) =>
            w.id === formModal.editingId
              ? {
                  ...w,
                  title: String(data.title),
                  instructor: String(data.instructor),
                  duration: String(data.duration),
                  capacity: Number(data.capacity),
                  enrolled: Math.min(Number(data.enrolled), Number(data.capacity)),
                  status: (data.status as "scheduled" | "in-progress" | "completed") || w.status,
                }
              : w,
          ),
        )
      } else {
        const newWorkshop: Workshop = {
          id: String(workshops.length + 1),
          title: String(data.title),
          instructor: String(data.instructor),
          duration: String(data.duration),
          capacity: Number(data.capacity),
          enrolled: Number(data.enrolled),
          status: (data.status as "scheduled" | "in-progress" | "completed") || "scheduled",
        }
        setWorkshops([...workshops, newWorkshop])
      }
      setFormModal({ isOpen: false, editingId: null })
      setIsSaving(false)
    }, 500)
  }

  const handleConfirmDelete = () => {
    setIsSaving(true)
    setTimeout(() => {
      if (confirmModal.deleteId) {
        setWorkshops(workshops.filter((w) => w.id !== confirmModal.deleteId))
      }
      setConfirmModal({ isOpen: false, deleteId: null })
      setIsSaving(false)
    }, 300)
  }

  const editingWorkshop = formModal.editingId ? workshops.find((w) => w.id === formModal.editingId) : null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-secondary/10 text-secondary"
      case "in-progress":
        return "bg-primary/10 text-primary"
      case "completed":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-primary">Workshops</h2>
          <p className="text-muted-foreground mt-1">Manage training workshops and courses</p>
        </div>
        <Button
          onClick={() => setFormModal({ isOpen: true, editingId: null })}
          className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Workshop
        </Button>
      </div>

      {/* Search */}
      <Card className="bg-card border-border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search workshops..."
            className="pl-10 bg-muted border-border text-foreground placeholder:text-muted-foreground"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>

      {/* Desktop Table */}
      <Card className="bg-card border-border overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="text-left px-6 py-4 font-semibold text-foreground">Title</th>
                <th className="text-left px-6 py-4 font-semibold text-foreground">Instructor</th>
                <th className="text-left px-6 py-4 font-semibold text-foreground">Duration</th>
                <th className="text-left px-6 py-4 font-semibold text-foreground">Enrollment</th>
                <th className="text-left px-6 py-4 font-semibold text-foreground">Status</th>
                <th className="text-right px-6 py-4 font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    Loading...
                  </td>
                </tr>
              ) : filteredWorkshops.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    No workshops found
                  </td>
                </tr>
              ) : (
                filteredWorkshops.map((workshop) => (
                  <tr key={workshop.id} className="border-b border-border hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-medium text-foreground">{workshop.title}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="w-4 h-4 flex-shrink-0" />
                        {workshop.instructor}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        {workshop.duration}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <span className="font-medium text-primary">
                          {workshop.enrolled}/{workshop.capacity}
                        </span>
                        <div className="w-24 h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${(workshop.enrolled / workshop.capacity) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className={`w-fit px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(workshop.status)}`}
                      >
                        {workshop.status.replace("-", " ")}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setFormModal({ isOpen: true, editingId: workshop.id })}
                          className="p-2 hover:bg-muted rounded transition-colors"
                        >
                          <Edit2 className="w-4 h-4 text-muted-foreground hover:text-primary" />
                        </button>
                        <button
                          onClick={() => setConfirmModal({ isOpen: true, deleteId: workshop.id })}
                          className="p-2 hover:bg-muted rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Mobile Cards */}
      {!loading && filteredWorkshops.length > 0 && (
        <div className="md:hidden space-y-3">
          {filteredWorkshops.map((workshop) => (
            <Card key={workshop.id} className="bg-card border-border p-4">
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">{workshop.title}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="w-4 h-4" />
                    {workshop.instructor}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {workshop.duration}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Enrolled: {workshop.enrolled}/{workshop.capacity}
                    </p>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${(workshop.enrolled / workshop.capacity) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className={`w-fit px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(workshop.status)}`}>
                  {workshop.status.replace("-", " ")}
                </div>
                <div className="flex gap-2 pt-2 border-t border-border">
                  <Button
                    onClick={() => setFormModal({ isOpen: true, editingId: workshop.id })}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-border text-foreground hover:bg-muted bg-transparent"
                  >
                    <Edit2 className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => setConfirmModal({ isOpen: true, deleteId: workshop.id })}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-border text-foreground hover:bg-destructive/10 hover:text-destructive bg-transparent"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!loading && filteredWorkshops.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="mb-4">No workshops found</p>
          <Button onClick={() => setFormModal({ isOpen: true, editingId: null })} className="bg-primary">
            <Plus className="w-4 h-4 mr-2" />
            Create First Workshop
          </Button>
        </div>
      )}

      {loading && <div className="text-center py-12 text-muted-foreground">Loading...</div>}

      {/* Modals */}
      <FormModal
        isOpen={formModal.isOpen}
        title={editingWorkshop ? "Edit Workshop" : "Create Workshop"}
        fields={[
          {
            name: "title",
            label: "Workshop Title",
            type: "text",
            required: true,
            placeholder: "Advanced Neural Networks",
          },
          {
            name: "instructor",
            label: "Instructor Name",
            type: "text",
            required: true,
            placeholder: "Dr. Sarah Chen",
          },
          {
            name: "duration",
            label: "Duration",
            type: "text",
            required: true,
            placeholder: "e.g., 4 weeks",
          },
          {
            name: "capacity",
            label: "Capacity",
            type: "number",
            required: true,
            placeholder: "30",
          },
          {
            name: "enrolled",
            label: "Enrolled",
            type: "number",
            required: true,
            placeholder: "28",
          },
          {
            name: "status",
            label: "Status",
            type: "select",
            required: true,
            options: [
              { value: "scheduled", label: "Scheduled" },
              { value: "in-progress", label: "In Progress" },
              { value: "completed", label: "Completed" },
            ],
          },
        ]}
        initialData={
          editingWorkshop
            ? {
                title: editingWorkshop.title,
                instructor: editingWorkshop.instructor,
                duration: editingWorkshop.duration,
                capacity: editingWorkshop.capacity,
                enrolled: editingWorkshop.enrolled,
                status: editingWorkshop.status,
              }
            : {}
        }
        onClose={() => setFormModal({ isOpen: false, editingId: null })}
        onSubmit={handleSaveWorkshop}
        submitLabel={editingWorkshop ? "Update Workshop" : "Create Workshop"}
        isLoading={isSaving}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Delete Workshop"
        message="Are you sure you want to delete this workshop? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmModal({ isOpen: false, deleteId: null })}
        isLoading={isSaving}
        isDangerous
      />
    </div>
  )
}
