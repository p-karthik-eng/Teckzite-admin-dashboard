"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Edit2, Trash2, TrendingUp, Users, Award } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FormModal } from "@/components/modals/form-modal"
import { ConfirmModal } from "@/components/modals/confirm-modal"

interface GateAllocationUser {
  id: string
  name: string
  email: string
  role: string
  allocatedGates: number
  totalGates: number
  status: "active" | "inactive"
  lastModified: string
}

export default function GateAllocationPage() {
  const [users, setUsers] = useState<GateAllocationUser[]>([])
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
          name: "Alex Johnson",
          email: "alex.johnson@techzite.com",
          role: "Admin",
          allocatedGates: 15,
          totalGates: 18,
          status: "active",
          lastModified: "2024-03-20T14:32:00Z",
        },
        {
          id: "2",
          name: "Sarah Smith",
          email: "sarah.smith@techzite.com",
          role: "Manager",
          allocatedGates: 8,
          totalGates: 18,
          status: "active",
          lastModified: "2024-03-19T10:15:00Z",
        },
        {
          id: "3",
          name: "Michael Chen",
          email: "michael.chen@techzite.com",
          role: "User",
          allocatedGates: 3,
          totalGates: 18,
          status: "active",
          lastModified: "2024-03-18T16:45:00Z",
        },
        {
          id: "4",
          name: "Emily Rodriguez",
          email: "emily.rodriguez@techzite.com",
          role: "Manager",
          allocatedGates: 12,
          totalGates: 18,
          status: "active",
          lastModified: "2024-03-20T09:22:00Z",
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

  const handleSaveAllocation = (data: Record<string, string | number>) => {
    setIsSaving(true)
    setTimeout(() => {
      if (formModal.editingId) {
        setUsers(
          users.map((u) =>
            u.id === formModal.editingId
              ? {
                  ...u,
                  allocatedGates: Math.min(Number(data.allocatedGates), u.totalGates),
                  status: (data.status as "active" | "inactive") || u.status,
                  lastModified: new Date().toISOString(),
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

  const getStatusColor = (status: string) => {
    return status === "active" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
  }

  const getProgressPercentage = (allocated: number, total: number) => {
    return Math.round((allocated / total) * 100)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-primary">Gate Allocation</h2>
          <p className="text-muted-foreground mt-1">Manage user access and gate allocations</p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Search */}
      <Card className="bg-card border-border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
            className="pl-10 bg-muted border-border text-foreground placeholder:text-muted-foreground"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>

      {/* Desktop Table */}
      <Card className="bg-card border-border overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-border">
                <TableHead className="text-foreground font-semibold">Name</TableHead>
                <TableHead className="text-foreground font-semibold">Email</TableHead>
                <TableHead className="text-foreground font-semibold">Role</TableHead>
                <TableHead className="text-foreground font-semibold">Gates</TableHead>
                <TableHead className="text-foreground font-semibold">Progress</TableHead>
                <TableHead className="text-foreground font-semibold">Status</TableHead>
                <TableHead className="text-foreground font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => {
                  const progressPercent = getProgressPercentage(user.allocatedGates, user.totalGates)
                  return (
                    <TableRow key={user.id} className="border-border hover:bg-muted/20 transition-colors">
                      <TableCell className="text-foreground font-medium">{user.name}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{user.email}</TableCell>
                      <TableCell>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
                          {user.role}
                        </span>
                      </TableCell>
                      <TableCell className="text-foreground">
                        {user.allocatedGates} / {user.totalGates}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground min-w-fit">{progressPercent}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          className={`w-fit px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(user.status)}`}
                        >
                          <div className="w-2 h-2 rounded-full bg-current" />
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => setFormModal({ isOpen: true, editingId: user.id })}
                            variant="outline"
                            size="sm"
                            className="border-border text-foreground hover:bg-muted bg-transparent"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => setConfirmModal({ isOpen: true, deleteId: user.id })}
                            variant="outline"
                            size="sm"
                            className="border-border text-foreground hover:bg-destructive/10 hover:text-destructive bg-transparent"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Mobile Cards */}
      {!loading && filteredUsers.length > 0 && (
        <div className="md:hidden space-y-3">
          {filteredUsers.map((user) => {
            const progressPercent = getProgressPercentage(user.allocatedGates, user.totalGates)
            return (
              <Card key={user.id} className="bg-card border-border p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{user.name}</h3>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary whitespace-nowrap">
                      {user.role}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Gates:</span>
                      <span className="font-medium text-foreground">
                        {user.allocatedGates} / {user.totalGates}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all" style={{ width: `${progressPercent}%` }} />
                      </div>
                      <p className="text-xs text-muted-foreground text-right">{progressPercent}%</p>
                    </div>
                  </div>
                  <div
                    className={`w-fit px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(user.status)}`}
                  >
                    <div className="w-2 h-2 rounded-full bg-current" />
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </div>
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
            )
          })}
        </div>
      )}

      {!loading && filteredUsers.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">No users found</div>
      )}
      {loading && <div className="text-center py-12 text-muted-foreground">Loading...</div>}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Card className="bg-card border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-1">Total Users</p>
              <p className="text-3xl font-bold text-foreground">{filteredUsers.length}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg text-primary">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="bg-card border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-1">Active Users</p>
              <p className="text-3xl font-bold text-foreground">
                {filteredUsers.filter((u) => u.status === "active").length}
              </p>
            </div>
            <div className="p-3 bg-secondary/10 rounded-lg text-secondary">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="bg-card border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-1">Avg Gates</p>
              <p className="text-3xl font-bold text-foreground">
                {filteredUsers.length > 0
                  ? Math.round(filteredUsers.reduce((acc, u) => acc + u.allocatedGates, 0) / filteredUsers.length)
                  : 0}
              </p>
            </div>
            <div className="p-3 bg-accent/10 rounded-lg text-accent">
              <Award className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Modals */}
      <FormModal
        isOpen={formModal.isOpen}
        title={editingUser ? "Edit Gate Allocation" : "Allocate Gates"}
        fields={[
          {
            name: "allocatedGates",
            label: "Gates to Allocate",
            type: "number",
            required: true,
            placeholder: "15",
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
          editingUser
            ? {
                allocatedGates: editingUser.allocatedGates,
                status: editingUser.status,
              }
            : {}
        }
        onClose={() => setFormModal({ isOpen: false, editingId: null })}
        onSubmit={handleSaveAllocation}
        submitLabel={editingUser ? "Update Allocation" : "Allocate"}
        isLoading={isSaving}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Remove User"
        message="Are you sure you want to remove this user from gate allocation? This action cannot be undone."
        confirmLabel="Remove"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmModal({ isOpen: false, deleteId: null })}
        isLoading={isSaving}
        isDangerous
      />
    </div>
  )
}
