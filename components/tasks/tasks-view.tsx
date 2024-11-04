"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RecurringTasks } from "@/components/tasks/recurring-tasks"
import { OneOffTasks } from "@/components/tasks/one-off-tasks"
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog"

export interface Task {
  id: string
  title: string
  time?: string
  tags?: string[]
  type: "recurring" | "one-off"
  schedule?: {
    frequency: "daily" | "weekly" | "monthly"
    weekDay?: number // 0-6 for Sunday-Saturday
    monthDay?: number // 1-31
  }
  startDate?: string
  createdAt: Date
}

export function TasksView() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [activeTab, setActiveTab] = useState<"recurring" | "one-off">("recurring")

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks')
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks))
    }
  }, [])

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    const recurringTasks = tasks.filter(task => task.type === "recurring")
    const oneOffTasks = tasks.filter(task => task.type === "one-off")
    
    localStorage.setItem('recurringTasks', JSON.stringify(recurringTasks))
    localStorage.setItem('oneOffTasks', JSON.stringify(oneOffTasks))
  }, [tasks])

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
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Tasks</h1>
      </div>

      <Card className="p-6">
        <Tabs 
          defaultValue="recurring" 
          className="space-y-4"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "recurring" | "one-off")}
        >
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="recurring">Recurring Tasks</TabsTrigger>
              <TabsTrigger value="one-off">One-off Tasks</TabsTrigger>
            </TabsList>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>

          <TabsContent value="recurring" className="space-y-4">
            <RecurringTasks
              tasks={tasks.filter(task => task.type === "recurring")}
              onDelete={deleteTask}
              onUpdate={updateTask}
            />
          </TabsContent>

          <TabsContent value="one-off" className="space-y-4">
            <OneOffTasks
              tasks={tasks.filter(task => task.type === "one-off")}
              onDelete={deleteTask}
              onUpdate={updateTask}
            />
          </TabsContent>
        </Tabs>
      </Card>

      <CreateTaskDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={addTask}
        type={activeTab}
      />
    </div>
  )
}