"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const ALLOWED_USERS = [
  {
    id: "1",
    email: "karthikputcha123@gmail.com",
    password: "Teckzite@2k25",
    name: "Karthik",
  },
  {
    id: "2",
    email: "yasvanthhanumantu1@gmail.com",
    password: "Teckzite@2k25",
    name: "Yasvanth",
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("techzite_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("[v0] Failed to parse stored user:", error)
        localStorage.removeItem("techzite_user")
      }
    }
    setIsLoading(false)
  }, [])

  // Redirect logic based on auth state
  useEffect(() => {
    if (isLoading) return

    const isAuthPage = pathname === "/login"
    const isAdminPage = pathname.startsWith("/admin")

    if (!user && isAdminPage) {
      router.replace("/login")
    } else if (user && isAuthPage) {
      router.replace("/admin")
    }
  }, [user, isLoading, pathname, router])

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    const allowedUser = ALLOWED_USERS.find((user) => user.email === email && user.password === password)

    if (allowedUser) {
      const newUser: User = {
        id: allowedUser.id,
        email: allowedUser.email,
        name: allowedUser.name,
      }
      setUser(newUser)
      localStorage.setItem("techzite_user", JSON.stringify(newUser))
      router.push("/admin")
    } else {
      throw new Error("Invalid email or password. Only authorized users can login.")
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("techzite_user")
    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
