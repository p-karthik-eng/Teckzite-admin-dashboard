"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface User {
  id: string
  name: string
  email: string
  status: "active" | "inactive"
  joinDate: string
}

export interface Event {
  id: string
  name: string
  date: string
  location: string
  attendees: number
  status: "upcoming" | "ongoing" | "completed"
}

export interface Workshop {
  id: string
  title: string
  instructor: string
  duration: string
  capacity: number
  enrolled: number
  status: "scheduled" | "in-progress" | "completed"
}

interface AdminContextType {
  users: User[]
  events: Event[]
  workshops: Workshop[]
  setUsers: (users: User[]) => void
  setEvents: (events: Event[]) => void
  setWorkshops: (workshops: Workshop[]) => void
  addUser: (user: User) => void
  updateUser: (user: User) => void
  deleteUser: (id: string) => void
  addEvent: (event: Event) => void
  updateEvent: (event: Event) => void
  deleteEvent: (id: string) => void
  addWorkshop: (workshop: Workshop) => void
  updateWorkshop: (workshop: Workshop) => void
  deleteWorkshop: (id: string) => void
  isInitialized: boolean
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (!isInitialized) {
      setUsers([
        {
          id: "1",
          name: "Alice Johnson",
          email: "alice@example.com",
          status: "active",
          joinDate: "2024-01-15",
        },
        {
          id: "2",
          name: "Bob Smith",
          email: "bob@example.com",
          status: "active",
          joinDate: "2024-02-20",
        },
        {
          id: "3",
          name: "Carol Williams",
          email: "carol@example.com",
          status: "inactive",
          joinDate: "2024-01-10",
        },
        {
          id: "4",
          name: "David Brown",
          email: "david@example.com",
          status: "active",
          joinDate: "2024-03-05",
        },
        {
          id: "5",
          name: "Emma Davis",
          email: "emma@example.com",
          status: "active",
          joinDate: "2024-03-12",
        },
      ])

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

      setIsInitialized(true)
    }
  }, [isInitialized])

  const addUser = (user: User) => {
    setUsers([...users, user])
  }

  const updateUser = (user: User) => {
    setUsers(users.map((u) => (u.id === user.id ? user : u)))
  }

  const deleteUser = (id: string) => {
    setUsers(users.filter((u) => u.id !== id))
  }

  const addEvent = (event: Event) => {
    setEvents([...events, event])
  }

  const updateEvent = (event: Event) => {
    setEvents(events.map((e) => (e.id === event.id ? event : e)))
  }

  const deleteEvent = (id: string) => {
    setEvents(events.filter((e) => e.id !== id))
  }

  const addWorkshop = (workshop: Workshop) => {
    setWorkshops([...workshops, workshop])
  }

  const updateWorkshop = (workshop: Workshop) => {
    setWorkshops(workshops.map((w) => (w.id === workshop.id ? workshop : w)))
  }

  const deleteWorkshop = (id: string) => {
    setWorkshops(workshops.filter((w) => w.id !== id))
  }

  return (
    <AdminContext.Provider
      value={{
        users,
        events,
        workshops,
        setUsers,
        setEvents,
        setWorkshops,
        addUser,
        updateUser,
        deleteUser,
        addEvent,
        updateEvent,
        deleteEvent,
        addWorkshop,
        updateWorkshop,
        deleteWorkshop,
        isInitialized,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdmin must be used within AdminProvider")
  }
  return context
}
