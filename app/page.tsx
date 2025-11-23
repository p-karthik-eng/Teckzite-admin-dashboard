import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-bold text-primary">TechZite</h1>
          <p className="text-xl text-muted-foreground">Enterprise Admin Dashboard</p>
        </div>
        <Link href="/admin">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Enter Dashboard
          </Button>
        </Link>
      </div>
    </main>
  )
}
