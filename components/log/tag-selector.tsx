"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"

interface TagSelectorProps {
  onSelect: (tag: string) => void
}

export function TagSelector({ onSelect }: TagSelectorProps) {
  const [newTag, setNewTag] = useState("")
  const commonTags = ["bug", "feature", "meeting", "research", "documentation"]

  return (
    <Card className="p-4 absolute z-10 bg-background shadow-lg">
      <div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          {commonTags.map((tag) => (
            <Button
              key={tag}
              variant="outline"
              size="sm"
              onClick={() => onSelect(tag)}
            >
              {tag}
            </Button>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Input
            placeholder="Add custom tag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && newTag.trim()) {
                onSelect(newTag.trim())
                setNewTag("")
              }
            }}
          />
          <Button
            size="icon"
            onClick={() => {
              if (newTag.trim()) {
                onSelect(newTag.trim())
                setNewTag("")
              }
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}