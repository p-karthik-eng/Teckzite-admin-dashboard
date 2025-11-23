"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Edit2, Trash2, Clock, Users, MapPin } from "lucide-react"
import { FormModal } from "@/components/modals/form-modal"
import { ConfirmModal } from "@/components/modals/confirm-modal"

interface Event {
  id: string
  name: string
  date: string
  location: string
  attendees: number
  status: "upcoming" | "ongoing" | "completed"
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [formModal, setFormModal] = useState({ isOpen: false, editingId: null as string | null })
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, deleteId: null as string | null })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setEvents([
        {
          id: "1",
          name: "AI Summit 2024",
          date: "2024-04-15",
          location: "San Francisco, CA",
          attendees: 542,
          status: "upcoming",
        },
        {
          id: "2",
          name: "Neural Tech Conference",
          date: "2024-03-28",
          location: "New York, NY",
          attendees: 328,
          status: "upcoming",
        },
        {
          id: "3",
          name: "Machine Learning Meetup",
          date: "2024-03-10",
          location: "Austin, TX",
          attendees: 156,
          status: "ongoing",
        },
        {
          id: "4",
          name: "Data Science Workshop",
          date: "2024-02-20",
          location: "Boston, MA",
          attendees: 89,
          status: "completed",
        },
      ])
      setLoading(false)
    }, 500)
  }, [])

  const filteredEvents = events.filter(
    (event) =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSaveEvent = (data: Record<string, string | number>) => {
    setIsSaving(true)
    setTimeout(() => {
      if (formModal.editingId) {
        setEvents(
          events.map((e) =>
            e.id === formModal.editingId
              ? {
                  ...e,
                  name: String(data.name),
                  date: String(data.date),
                  location: String(data.location),
                  attendees: Number(data.attendees),
                  status: (data.status as "upcoming" | "ongoing" | "completed") || e.status,
                }
              : e,
          ),
        )
      } else {
        const newEvent: Event = {
          id: String(events.length + 1),
          name: String(data.name),
          date: String(data.date),
          location: String(data.location),
          attendees: Number(data.attendees),
          status: (data.status as "upcoming" | "ongoing" | "completed") || "upcoming",
        }
        setEvents([...events, newEvent])
      }
      setFormModal({ isOpen: false, editingId: null })
      setIsSaving(false)
    }, 500)
  }

  const handleConfirmDelete = () => {
    setIsSaving(true)
    setTimeout(() => {
      if (confirmModal.deleteId) {
        setEvents(events.filter((e) => e.id !== confirmModal.deleteId))
      }
      setConfirmModal({ isOpen: false, deleteId: null })
      setIsSaving(false)
    }, 300)
  }

  const editingEvent = formModal.editingId ? events.find((e) => e.id === formModal.editingId) : null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-secondary/10 text-secondary"
      case "ongoing":
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
          <h2 className="text-3xl font-bold text-primary">Events</h2>
          <p className="text-muted-foreground mt-1">Manage all system events and gatherings</p>
        </div>
        <Button
          onClick={() => setFormModal({ isOpen: true, editingId: null })}
          className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Search */}
      <Card className="bg-card border-border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            className="pl-10 bg-muted border-border text-foreground placeholder:text-muted-foreground"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>

      {/* Events Grid - Responsive */}
      {!loading && filteredEvents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredEvents.map((event) => (
            <Card
              key={event.id}
              className="bg-card border-border p-6 space-y-4 hover:border-primary/50 transition-colors flex flex-col"
            >
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">{event.name}</h3>
                <div className={`w-fit px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </div>
              </div>

              <div className="space-y-2 text-sm flex-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{event.date}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-4 h-4 flex-shrink-0" />
                  <span>{event.attendees} attendees</span>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-border">
                <Button
                  onClick={() => setFormModal({ isOpen: true, editingId: event.id })}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-border text-foreground hover:bg-muted bg-transparent"
                >
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  onClick={() => setConfirmModal({ isOpen: true, deleteId: event.id })}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-border text-foreground hover:bg-destructive/10 hover:text-destructive bg-transparent"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!loading && filteredEvents.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="mb-4">No events found</p>
          <Button onClick={() => setFormModal({ isOpen: true, editingId: null })} className="bg-primary">
            <Plus className="w-4 h-4 mr-2" />
            Create First Event
          </Button>
        </div>
      )}

      {loading && <div className="text-center py-12 text-muted-foreground">Loading...</div>}

      {/* Modals */}
      <FormModal
        isOpen={formModal.isOpen}
        title={editingEvent ? "Edit Event" : "Create New Event"}
        fields={[
          {
            name: "name",
            label: "Event Name",
            type: "text",
            required: true,
            placeholder: "e.g., AI Summit 2024",
          },
          {
            name: "date",
            label: "Date",
            type: "text",
            required: true,
            placeholder: "YYYY-MM-DD",
          },
          {
            name: "location",
            label: "Location",
            type: "text",
            required: true,
            placeholder: "e.g., San Francisco, CA",
          },
          {
            name: "attendees",
            label: "Expected Attendees",
            type: "number",
            required: true,
            placeholder: "500",
          },
          {
            name: "status",
            label: "Status",
            type: "select",
            required: true,
            options: [
              { value: "upcoming", label: "Upcoming" },
              { value: "ongoing", label: "Ongoing" },
              { value: "completed", label: "Completed" },
            ],
          },
        ]}
        initialData={
          editingEvent
            ? {
                name: editingEvent.name,
                date: editingEvent.date,
                location: editingEvent.location,
                attendees: editingEvent.attendees,
                status: editingEvent.status,
              }
            : {}
        }
        onClose={() => setFormModal({ isOpen: false, editingId: null })}
        onSubmit={handleSaveEvent}
        submitLabel={editingEvent ? "Update Event" : "Create Event"}
        isLoading={isSaving}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmModal({ isOpen: false, deleteId: null })}
        isLoading={isSaving}
        isDangerous
      />
    </div>
  )
}
