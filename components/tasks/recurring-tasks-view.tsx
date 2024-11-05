"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog"
import { RecurringTasks } from "@/components/tasks/recurring-tasks"
import { Task } from "@/components/tasks/tasks-view"

export function RecurringTasksView() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const addTask = (task: Omit<Task, "id" | "createdAt">) => {
    setTasks([
      ...tasks,
      {
        ...task,
        id: crypto.randomUUID(),
        createdAt: new Date(),
      },
    ])
    setShowCreateDialog(false)
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Recurring Tasks</h2>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <RecurringTasks
        tasks={tasks}
        onDelete={deleteTask}
        onUpdate={updateTask}
      />

      <CreateTaskDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={addTask}
        type="recurring"
      />
    </Card>
  )
}