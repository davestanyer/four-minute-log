"use client"

import { useState } from "react"
import { CheckSquare, Square, Clock, Tag, RotateCcw, Pencil, Trash2, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { TimeSelector } from "@/components/log/time-selector"
import { TagSelector } from "@/components/log/tag-selector"

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

interface TodoTasksProps {
  todoTasks: TodoTask[]
  completedTasks: CompletedTask[]
  onComplete: (id: string) => void
  onReverse: (id: string) => void
  onAdd: (content: string) => void
  onEdit: (id: string, content: string) => void
  onDelete: (id: string) => void
  onUpdateTodoTask: (id: string, updates: Partial<TodoTask>) => void
  onUpdateCompletedTask: (id: string, updates: Partial<CompletedTask>) => void
  isCollapsed?: boolean
}

export function TodoTasks({
  todoTasks,
  completedTasks,
  onComplete,
  onReverse,
  onAdd,
  onEdit,
  onDelete,
  onUpdateTodoTask,
  onUpdateCompletedTask,
  isCollapsed = false
}: TodoTasksProps) {
  const [newTask, setNewTask] = useState("")
  const [newCompletedTask, setNewCompletedTask] = useState("")
  const [showTimeSelector, setShowTimeSelector] = useState(false)
  const [showTagSelector, setShowTagSelector] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editedContent, setEditedContent] = useState("")
  const [taskType, setTaskType] = useState<"todo" | "completed">("todo")

  const handleAddCompletedTask = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newCompletedTask.trim()) {
      const taskId = crypto.randomUUID()
      onUpdateCompletedTask(taskId, {
        id: taskId,
        content: newCompletedTask.trim(),
        completedAt: new Date().toISOString()
      })
      setNewCompletedTask("")
    }
  }

  const handleEditTask = (taskId: string, newContent: string) => {
    if (newContent.trim()) {
      onEdit(taskId, newContent.trim())
      setEditingTaskId(null)
      setEditedContent("")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Tasks To Do</h3>
        <div className="space-y-2">
          {todoTasks.map((task) => (
            <div key={task.id} className="flex items-center gap-2 group hover:bg-accent rounded-md p-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onComplete(task.id)}
              >
                <Square className="h-4 w-4" />
              </Button>
              
              {editingTaskId === task.id ? (
                <>
                  <Input
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="flex-1"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleEditTask(task.id, editedContent)
                      } else if (e.key === "Escape") {
                        setEditingTaskId(null)
                        setEditedContent("")
                      }
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleEditTask(task.id, editedContent)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => {
                      setEditingTaskId(null)
                      setEditedContent("")
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <span className="flex-1">{task.content}</span>
                  {task.time && (
                    <Badge variant="secondary">
                      <Clock className="h-3 w-3 mr-1" />
                      {task.time}
                    </Badge>
                  )}
                  {task.tags?.map((tag) => (
                    <Badge key={tag} variant="outline">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                  <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => {
                        setSelectedTaskId(task.id)
                        setTaskType("todo")
                        setShowTimeSelector(true)
                      }}
                    >
                      <Clock className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => {
                        setSelectedTaskId(task.id)
                        setTaskType("todo")
                        setShowTagSelector(true)
                      }}
                    >
                      <Tag className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => {
                        setEditingTaskId(task.id)
                        setEditedContent(task.content)
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => onDelete(task.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
          {!isCollapsed && (
            <div className="flex gap-2">
              <Input
                placeholder="Add a new task (press Enter to save)"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newTask.trim()) {
                    onAdd(newTask.trim())
                    setNewTask("")
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Completed Tasks</h3>
        <div className="space-y-2">
          {completedTasks.map((task) => (
            <div key={task.id} className="flex items-center gap-2 group hover:bg-accent rounded-md p-2">
              <CheckSquare className="h-4 w-4 text-primary" />
              <span>{task.content}</span>
              {task.time && (
                <Badge variant="secondary" className="ml-auto">
                  <Clock className="h-3 w-3 mr-1" />
                  {task.time}
                </Badge>
              )}
              {task.tags?.map((tag) => (
                <Badge key={tag} variant="outline">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
              {!isCollapsed && (
                <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 ml-auto">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => onReverse(task.id)}
                    title="Move back to Tasks To Do"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => {
                      setSelectedTaskId(task.id)
                      setTaskType("completed")
                      setShowTimeSelector(true)
                    }}
                  >
                    <Clock className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => {
                      setSelectedTaskId(task.id)
                      setTaskType("completed")
                      setShowTagSelector(true)
                    }}
                  >
                    <Tag className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ))}
          {!isCollapsed && (
            <div className="flex items-center gap-2 relative">
              <CheckSquare className="h-4 w-4 text-primary" />
              <Input
                placeholder="Add a completed task (press Enter to save)"
                value={newCompletedTask}
                onChange={(e) => setNewCompletedTask(e.target.value)}
                onKeyDown={handleAddCompletedTask}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  setSelectedTaskId(null)
                  setTaskType("completed")
                  setShowTimeSelector(true)
                }}
              >
                <Clock className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  setSelectedTaskId(null)
                  setTaskType("completed")
                  setShowTagSelector(true)
                }}
              >
                <Tag className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {showTimeSelector && (
        <div className="relative">
          <div className="absolute top-0 right-0 z-50">
            <TimeSelector
              onSelect={(time) => {
                if (selectedTaskId) {
                  if (taskType === "todo") {
                    onUpdateTodoTask(selectedTaskId, { time })
                  } else {
                    onUpdateCompletedTask(selectedTaskId, { time })
                  }
                }
                setShowTimeSelector(false)
              }}
            />
          </div>
        </div>
      )}

      {showTagSelector && (
        <div className="relative">
          <div className="absolute top-0 right-0 z-50">
            <TagSelector
              onSelect={(tag) => {
                if (selectedTaskId) {
                  if (taskType === "todo") {
                    const task = todoTasks.find(t => t.id === selectedTaskId)
                    const currentTags = task?.tags || []
                    if (!currentTags.includes(tag)) {
                      onUpdateTodoTask(selectedTaskId, { tags: [...currentTags, tag] })
                    }
                  } else {
                    const task = completedTasks.find(t => t.id === selectedTaskId)
                    const currentTags = task?.tags || []
                    if (!currentTags.includes(tag)) {
                      onUpdateCompletedTask(selectedTaskId, { tags: [...currentTags, tag] })
                    }
                  }
                }
                setShowTagSelector(false)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}