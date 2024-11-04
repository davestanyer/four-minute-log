import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ClipboardList, Users, Calendar, UserCircle } from "lucide-react"
import { CurrentUser } from "@/components/users/current-user"

export default function Home() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Four Minute Log</h1>
        <CurrentUser />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/log">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <ClipboardList className="h-8 w-8 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Daily Log</h2>
            <p className="text-muted-foreground">Track your daily activities and tasks</p>
          </Card>
        </Link>

        <Link href="/clients">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <Users className="h-8 w-8 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Clients</h2>
            <p className="text-muted-foreground">Manage your clients and projects</p>
          </Card>
        </Link>

        <Link href="/tasks">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <Calendar className="h-8 w-8 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Tasks</h2>
            <p className="text-muted-foreground">View and manage your tasks</p>
          </Card>
        </Link>

        <Link href="/users">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <UserCircle className="h-8 w-8 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Users</h2>
            <p className="text-muted-foreground">Manage users and profiles</p>
          </Card>
        </Link>
      </div>
    </div>
  )
}