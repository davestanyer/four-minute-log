"use client"

import { useState, useEffect } from "react"
import { format, isSameDay, isAfter, isBefore, getDay } from "date-fns"
import { Card } from "@/components/ui/card"
import { TodoTasks } from "@/components/log/todo-tasks"
import { DatePicker } from "@/components/ui/date-picker"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { Task } from "@/components/tasks/tasks-view"

interface TodoTask {
  id: string
  content: string
  completed: boolean
  time?: string
  tags?: string[]
}

interface CompletedTask {
  id: string
  content: string
  time?: string
  tags?: string[]
  completedAt: string
}

interface DayLog {
  todoTasks: TodoTask[]
  completedTasks: CompletedTask[]
  createdAt: string
}

export function DailyLogView() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [logs, setLogs] = useState<Map<string, DayLog>>(new Map())
  const [recurringTasks, setRecurringTasks] = useState<Task[]>([])
  const [oneOffTasks, setOneOffTasks] = useState<Task[]>([])

  const dateKey = format(selectedDate, 'yyyy-MM-dd')

  // Load tasks from localStorage
  useEffect(() => {
    const storedRecurringTasks = localStorage.getItem('recurringTasks')
    const storedOneOffTasks = localStorage.getItem('oneOffTasks')
    
    if (storedRecurringTasks) {
      setRecurringTasks(JSON.parse(storedRecurringTasks))
    }
    if (storedOneOffTasks) {
      setOneOffTasks(JSON.parse(storedOneOffTasks))
    }
  }, [])

  const getApplicableTasks = (date: Date) => {
    const applicableTasks: TodoTask[] = []

    // Check recurring tasks
    recurringTasks.forEach(task => {
      if (task.schedule) {
        const isApplicable = 
          (task.schedule.frequency === 'daily') ||
          (task.schedule.frequency === 'weekly' && task.schedule.weekDay === getDay(date)) ||
          (task.schedule.frequency === 'monthly' && task.schedule.monthDay === date.getDate())

        if (isApplicable) {
          applicableTasks.push({
            id: crypto.randomUUID(),
            content: task.title,
            completed: false,
            time: task.time,
            tags: task.tags
          })
        }
      }
    })

    // Check one-off tasks
    oneOffTasks.forEach(task => {
      if (task.startDate && isSameDay(new Date(task.startDate), date)) {
        applicableTasks.push({
          id: crypto.randomUUID(),
          content: task.title,
          completed: false,
          time: task.time,
          tags: task.tags
        })
      }
    })

    return applicableTasks
  }

  const getCurrentLog = () => {
    if (!logs.has(dateKey)) {
      const yesterday = new Date(selectedDate)
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayKey = format(yesterday, 'yyyy-MM-dd')
      const yesterdayLog = logs.get(yesterdayKey)
      
      // Get applicable tasks for the current date
      const applicableTasks = getApplicableTasks(selectedDate)
      
      // Combine uncompleted tasks from yesterday with new applicable tasks
      const todoTasks = [
        ...(yesterdayLog?.todoTasks.filter(t => !t.completed) || []),
        ...applicableTasks
      ]

      const newLog = {
        todoTasks,
        completedTasks: [],
        createdAt: new Date().toISOString()
      }
      setLogs(new Map(logs.set(dateKey, newLog)))
      return newLog
    }
    return logs.get(dateKey)!
  }

  // Rest of the component remains the same...
  const updateLog = (updates: Partial<DayLog>) => {
    const currentLog = getCurrentLog()
    const updatedLog = { ...currentLog, ...updates }
    setLogs(new Map(logs.set(dateKey, updatedLog)))
  }

  const handleAddTodoTask = (content: string) => {
    if (!content) return
    const currentLog = getCurrentLog()
    updateLog({
      todoTasks: [
        ...currentLog.todoTasks,
        { id: crypto.randomUUID(), content, completed: false }
      ]
    })
  }

  const handleEditTodoTask = (taskId: string, newContent: string) => {
    const currentLog = getCurrentLog()
    updateLog({
      todoTasks: currentLog.todoTasks.map(task =>
        task.id === taskId ? { ...task, content: newContent } : task
      )
    })
  }

  const handleDeleteTodoTask = (taskId: string) => {
    const currentLog = getCurrentLog()
    updateLog({
      todoTasks: currentLog.todoTasks.filter(task => task.id !== taskId)
    })
  }

  const handleUpdateTodoTask = (taskId: string, updates: Partial<TodoTask>) => {
    const currentLog = getCurrentLog()
    updateLog({
      todoTasks: currentLog.todoTasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    })
  }

  const handleCompleteTodoTask = (taskId: string) => {
    const currentLog = getCurrentLog()
    const task = currentLog.todoTasks.find(t => t.id === taskId)
    if (task) {
      updateLog({
        todoTasks: currentLog.todoTasks.filter(t => t.id !== taskId),
        completedTasks: [
          ...currentLog.completedTasks,
          {
            id: crypto.randomUUID(),
            content: task.content,
            time: task.time,
            tags: task.tags,
            completedAt: new Date().toISOString()
          }
        ]
      })
    }
  }

  const handleReverseCompletedTask = (taskId: string) => {
    const currentLog = getCurrentLog()
    const task = currentLog.completedTasks.find(t => t.id === taskId)
    if (task) {
      updateLog({
        completedTasks: currentLog.completedTasks.filter(t => t.id !== taskId),
        todoTasks: [
          ...currentLog.todoTasks,
          {
            id: crypto.randomUUID(),
            content: task.content,
            completed: false,
            time: task.time,
            tags: task.tags
          }
        ]
      })
    }
  }

  const handleUpdateCompletedTask = (taskId: string, updates: Partial<CompletedTask>) => {
    const currentLog = getCurrentLog()
    const existingTask = currentLog.completedTasks.find(t => t.id === taskId)
    
    if (existingTask) {
      updateLog({
        completedTasks: currentLog.completedTasks.map(task =>
          task.id === taskId ? { ...task, ...updates } : task
        )
      })
    } else {
      updateLog({
        completedTasks: [
          ...currentLog.completedTasks,
          {
            id: taskId,
            content: updates.content || '',
            completedAt: updates.completedAt || new Date().toISOString(),
            time: updates.time,
            tags: updates.tags
          }
        ]
      })
    }
  }

  const currentLog = getCurrentLog()
  const previousLogs = Array.from(logs.entries())
    .filter(([key]) => key < dateKey)
    .sort(([keyA], [keyB]) => keyB.localeCompare(keyA))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <DatePicker
          date={selectedDate}
          onDateChange={setSelectedDate}
        />
      </div>

      <Card className="p-6">
        <div className="space-y-2 mb-6">
          <h2 className="text-2xl font-bold">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </h2>
          <p className="text-sm text-muted-foreground">
            Created {format(new Date(currentLog.createdAt), 'MMMM d, yyyy h:mm a')}
          </p>
        </div>
        <Separator className="mb-6" />
        <TodoTasks
          todoTasks={currentLog.todoTasks}
          completedTasks={currentLog.completedTasks}
          onComplete={handleCompleteTodoTask}
          onReverse={handleReverseCompletedTask}
          onAdd={handleAddTodoTask}
          onEdit={handleEditTodoTask}
          onDelete={handleDeleteTodoTask}
          onUpdateTodoTask={handleUpdateTodoTask}
          onUpdateCompletedTask={handleUpdateCompletedTask}
        />
      </Card>

      {previousLogs.length > 0 && (
        <div className="relative pl-8 mt-12">
          <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />
          <h3 className="text-lg font-semibold mb-6 -ml-8">History</h3>
          
          <div className="space-y-8">
            {previousLogs.map(([date, log]) => (
              <div key={date} className="relative">
                <div className="absolute -left-[1.69rem] w-4 h-4 rounded-full bg-background border-2 border-primary" />
                
                <Card className={cn(
                  "p-6",
                  "transition-all duration-200",
                  "hover:shadow-md hover:-translate-y-0.5"
                )}>
                  <div className="space-y-2 mb-6">
                    <h2 className="text-2xl font-bold">
                      {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Created {format(new Date(log.createdAt), 'MMMM d, yyyy h:mm a')}
                    </p>
                  </div>
                  <Separator className="mb-6" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Completed Tasks</h3>
                    <div className="space-y-2">
                      {log.completedTasks.map((task) => (
                        <div key={task.id} className="flex items-center gap-2 p-2">
                          <span>•</span>
                          <span className="flex-1">{task.content}</span>
                          {task.time && (
                            <Badge variant="secondary" className="ml-2">
                              {task.time}
                            </Badge>
                          )}
                          {task.tags?.map((tag) => (
                            <Badge key={tag} variant="outline" className="ml-2">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      ))}
                      {log.completedTasks.length === 0 && (
                        <p className="text-muted-foreground text-sm">No completed tasks for this day</p>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}