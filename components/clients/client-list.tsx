"use client"

import { useState } from "react"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ClientCard } from "@/components/clients/client-card"
import { CreateClientDialog } from "@/components/clients/create-client-dialog"

interface Project {
  id: string
  name: string
  description?: string
}

interface Client {
  id: string
  name: string
  emoji: string
  color: string
  tags: string[]
  projects: Project[]
}

export function ClientList() {
  const [clients, setClients] = useState<Client[]>([])
  const [open, setOpen] = useState(false)

  const addClient = (client: { name: string; emoji: string; color: string; tags: string[] }) => {
    setClients([
      ...clients,
      {
        id: crypto.randomUUID(),
        ...client,
        projects: [{
          id: crypto.randomUUID(),
          name: "General",
          description: "Default project for general tasks"
        }]
      },
    ])
    setOpen(false)
  }

  const addProject = (clientId: string, project: Omit<Project, "id">) => {
    setClients(clients.map(client => {
      if (client.id === clientId) {
        return {
          ...client,
          projects: [...client.projects, { id: crypto.randomUUID(), ...project }]
        }
      }
      return client
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {clients.map((client) => (
          <ClientCard 
            key={client.id} 
            client={client}
            onAddProject={addProject}
          />
        ))}
        {clients.length === 0 && (
          <div className="col-span-full">
            <p className="text-center text-muted-foreground py-8">
              No clients yet. Click &quot;Add Client&quot; to get started.
            </p>
          </div>
        )}
      </div>

      <CreateClientDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={addClient}
      />
    </div>
  )
}