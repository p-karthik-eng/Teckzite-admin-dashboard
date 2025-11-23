"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Edit2, Trash2, CheckCircle, AlertCircle } from "lucide-react"
import { FormModal } from "@/components/modals/form-modal"
import { ConfirmModal } from "@/components/modals/confirm-modal"

interface User {
  id: string
  name: string
  email: string
  status: "active" | "inactive"
  joinDate: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [formModal, setFormModal] = useState({ isOpen: false, editingId: null as string | null })
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, deleteId: null as string | null })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
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
      setLoading(false)
    }, 500)
  }, [])

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddUser = (data: Record<string, string | number>) => {
    setIsSaving(true)
    setTimeout(() => {
      const newUser: User = {
        id: String(users.length + 1),
        name: String(data.name),
        email: String(data.email),
        status: (data.status as "active" | "inactive") || "active",
        joinDate: new Date().toISOString().split("T")[0],
      }
      setUsers([...users, newUser])
      setFormModal({ isOpen: false, editingId: null })
      setIsSaving(false)
    }, 500)
  }

  const handleEditUser = (data: Record<string, string | number>) => {
    setIsSaving(true)
    setTimeout(() => {
      if (formModal.editingId) {
        setUsers(
          users.map((u) =>
            u.id === formModal.editingId
              ? {
                  ...u,
                  name: String(data.name),
                  email: String(data.email),
                  status: (data.status as "active" | "inactive") || u.status,
                }
              : u,
          ),
        )
      }
      setFormModal({ isOpen: false, editingId: null })
      setIsSaving(false)
    }, 500)
  }

  const handleConfirmDelete = () => {
    setIsSaving(true)
    setTimeout(() => {
      if (confirmModal.deleteId) {
        setUsers(users.filter((u) => u.id !== confirmModal.deleteId))
      }
      setConfirmModal({ isOpen: false, deleteId: null })
      setIsSaving(false)
    }, 300)
  }

  const editingUser = formModal.editingId ? users.find((u) => u.id === formModal.editingId) : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-primary">Users</h2>
          <p className="text-muted-foreground mt-1">Manage system users and permissions</p>
        </div>
        <Button
          onClick={() => setFormModal({ isOpen: true, editingId: null })}
          className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Search */}
      <Card className="bg-card border-border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-10 bg-muted border-border text-foreground placeholder:text-muted-foreground"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>

      {/* Users Table - Mobile and Desktop */}
      <div className="space-y-4 md:space-y-0">
        {/* Desktop Table */}
        <Card className="bg-card border-border overflow-hidden hidden md:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="text-left px-6 py-4 font-semibold text-foreground">Name</th>
                  <th className="text-left px-6 py-4 font-semibold text-foreground">Email</th>
                  <th className="text-left px-6 py-4 font-semibold text-foreground">Status</th>
                  <th className="text-left px-6 py-4 font-semibold text-foreground">Join Date</th>
                  <th className="text-right px-6 py-4 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                      Loading...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-border hover:bg-muted/10 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-medium text-foreground">{user.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-muted-foreground text-sm">{user.email}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className={`flex items-center gap-2 w-fit px-3 py-1 rounded-full ${
                            user.status === "active" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {user.status === "active" ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <AlertCircle className="w-4 h-4" />
                          )}
                          <span className="text-xs font-medium capitalize">{user.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-muted-foreground text-sm">{user.joinDate}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setFormModal({ isOpen: true, editingId: user.id })}
                            className="p-2 hover:bg-muted rounded transition-colors"
                            title="Edit user"
                          >
                            <Edit2 className="w-4 h-4 text-muted-foreground hover:text-primary" />
                          </button>
                          <button
                            onClick={() => setConfirmModal({ isOpen: true, deleteId: user.id })}
                            className="p-2 hover:bg-muted rounded transition-colors"
                            title="Delete user"
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
        {!loading && filteredUsers.length > 0 && (
          <div className="md:hidden space-y-3">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="bg-card border-border p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        user.status === "active" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {user.status === "active" ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <AlertCircle className="w-3 h-3" />
                      )}
                      <span className="capitalize">{user.status}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Joined: {user.joinDate}</p>
                  <div className="flex gap-2 pt-2 border-t border-border">
                    <Button
                      onClick={() => setFormModal({ isOpen: true, editingId: user.id })}
                      variant="outline"
                      size="sm"
                      className="flex-1 border-border text-foreground hover:bg-muted bg-transparent"
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => setConfirmModal({ isOpen: true, deleteId: user.id })}
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

        {!loading && filteredUsers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground md:hidden">No users found</div>
        )}
        {loading && <div className="text-center py-8 text-muted-foreground md:hidden">Loading...</div>}
      </div>

      {/* Modals */}
      <FormModal
        isOpen={formModal.isOpen}
        title={editingUser ? "Edit User" : "Add New User"}
        fields={[
          {
            name: "name",
            label: "Full Name",
            type: "text",
            required: true,
            placeholder: "John Doe",
          },
          {
            name: "email",
            label: "Email",
            type: "email",
            required: true,
            placeholder: "john@example.com",
          },
          {
            name: "status",
            label: "Status",
            type: "select",
            required: true,
            options: [
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ],
          },
        ]}
        initialData={
          editingUser ? { name: editingUser.name, email: editingUser.email, status: editingUser.status } : {}
        }
        onClose={() => setFormModal({ isOpen: false, editingId: null })}
        onSubmit={editingUser ? handleEditUser : handleAddUser}
        submitLabel={editingUser ? "Update User" : "Add User"}
        isLoading={isSaving}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmModal({ isOpen: false, deleteId: null })}
        isLoading={isSaving}
        isDangerous
      />
    </div>
  )
}
