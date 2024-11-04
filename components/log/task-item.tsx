"use client"

import { useState } from "react"
import { Clock, Tag, Trash2, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { TimeSelector } from "@/components/log/time-selector"
import { TagSelector } from "@/components/log/tag-selector"

interface TaskItemProps {
  task: {
    id: string
    content: string
    time?: string
    tags?: string[]
  }
  onUpdate: (id: string, updates: Partial<{ content: string; time: string; tags: string[] }>) => void
  onDelete: (id: string) => void
  isCollapsed?: boolean
}

export function TaskItem({ task, onUpdate, onDelete, isCollapsed = false }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(task.content)
  const [showTimeSelector, setShowTimeSelector] = useState(false)
  const [showTagSelector, setShowTagSelector] = useState(false)

  if (isCollapsed) {
    return (
      <div className="flex items-center gap-2 py-1">
        <span className="text-muted-foreground">•</span>
        <div className="flex-1">{task.content}</div>
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
    )
  }

  return (
    <div className="group flex items-center gap-2 p-2 rounded-md hover:bg-accent">
      {isEditing ? (
        <>
          <Input
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="flex-1"
            autoFocus
          />
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              onUpdate(task.id, { content: editedContent })
              setIsEditing(false)
            }}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              setEditedContent(task.content)
              setIsEditing(false)
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <>
          <div
            className="flex-1 cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            {task.content}
          </div>
          
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

          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setShowTimeSelector(!showTimeSelector)}
            >
              <Clock className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setShowTagSelector(!showTagSelector)}
            >
              <Tag className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onDelete(task.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}

      {showTimeSelector && (
        <TimeSelector
          onSelect={(time) => {
            onUpdate(task.id, { time })
            setShowTimeSelector(false)
          }}
        />
      )}

      {showTagSelector && (
        <TagSelector
          onSelect={(tag) => {
            const currentTags = task.tags || []
            if (!currentTags.includes(tag)) {
              onUpdate(task.id, { tags: [...currentTags, tag] })
            }
            setShowTagSelector(false)
          }}
        />
      )}
    </div>
  )
}