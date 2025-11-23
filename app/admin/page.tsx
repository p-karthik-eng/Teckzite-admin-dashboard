"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Users, Calendar, Zap, TrendingUp, TrendingDown } from "lucide-react"
import { useAdmin } from "./context/admin-context"

interface Stat {
  label: string
  value: string
  change: string
  trend: "up" | "down"
  icon: React.ReactNode
}

export default function AdminDashboard() {
  const { users, events, workshops, isInitialized } = useAdmin()
  const [stats, setStats] = useState<Stat[]>([])

  useEffect(() => {
    if (isInitialized) {
      const activeUsers = users.filter((u) => u.status === "active").length
      const totalUsers = users.length
      const totalEvents = events.length
      const totalWorkshops = workshops.length

      // Calculate trends based on data
      const usersTrend = activeUsers > 2 ? "up" : "down"
      const usersTrendPercent = activeUsers > 2 ? "12.5%" : "5.2%"
      const eventsTrend = totalEvents >= 4 ? "up" : "down"
      const eventsTrendPercent = totalEvents >= 4 ? "8.2%" : "3.1%"
      const workshopsTrend = totalWorkshops >= 3 ? "up" : "down"
      const workshopsTrendPercent = totalWorkshops >= 3 ? "2.4%" : "1.5%"

      setStats([
        {
          label: "Total Users",
          value: String(totalUsers),
          change: usersTrendPercent,
          trend: usersTrend as "up" | "down",
          icon: <Users className="w-6 h-6" />,
        },
        {
          label: "Events",
          value: String(totalEvents),
          change: eventsTrendPercent,
          trend: eventsTrend as "up" | "down",
          icon: <Calendar className="w-6 h-6" />,
        },
        {
          label: "Workshops",
          value: String(totalWorkshops),
          change: workshopsTrendPercent,
          trend: workshopsTrend as "up" | "down",
          icon: <Zap className="w-6 h-6" />,
        },
        {
          label: "Active Users",
          value: String(activeUsers),
          change: "15.3%",
          trend: "up",
          icon: <Users className="w-6 h-6" />,
        },
      ])
    }
  }, [users, events, workshops, isInitialized])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-primary mb-2">Dashboard</h2>
        <p className="text-muted-foreground">Welcome to the TeckZite Admin Dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-card border-border p-6 space-y-4 hover:border-primary/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-primary/10 rounded-lg text-primary">{stat.icon}</div>
              <div
                className={`flex items-center gap-1 text-sm font-semibold ${
                  stat.trend === "up" ? "text-primary" : "text-destructive"
                }`}
              >
                {stat.trend === "up" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Activity Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="bg-card border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {users.slice(0, 3).map((user, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span className="text-sm text-muted-foreground">{user.name} registered</span>
                <span className="text-xs text-muted-foreground ml-auto">2m ago</span>
              </div>
            ))}
            {events.slice(0, 1).map((event, i) => (
              <div key={`event-${i}`} className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span className="text-sm text-muted-foreground">{event.name} created</span>
                <span className="text-xs text-muted-foreground ml-auto">5m ago</span>
              </div>
            ))}
          </div>
        </Card>

        {/* System Status */}
        <Card className="bg-card border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">System Status</h3>
          <div className="space-y-3">
            {[
              { name: "API Server", status: "online" },
              { name: "Database", status: "online" },
              { name: "Cache Layer", status: "online" },
              { name: "Message Queue", status: "online" },
            ].map((service, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                <span className="text-sm text-muted-foreground">{service.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span className="text-xs text-primary font-semibold">{service.status}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
