"use client"

import React, { useState, useRef } from "react"
import { X } from "lucide-react"

const TagInput = () => {
  const [tags, setTags] = useState<string[]>([])
  const [input, setInput] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const addTag = (value: string) => {
    const newTag = value.trim()
    if (newTag !== "" && !tags.includes(newTag)) {
      setTags([...tags, newTag])
      setInput("")
    }
  }

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && input !== "") {
      e.preventDefault()
      addTag(input)
    }

    if (e.key === "Backspace" && input === "" && tags.length > 0) {
      removeTag(tags.length - 1)
    }
  }

  return (
    <div
      className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-md focus-within:ring-2 ring-blue-500"
      onClick={() => inputRef.current?.focus()}
    >
      {tags.map((tag, index) => (
        <div
          key={index}
          className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-100 rounded-full hover:opacity-75 transition-all duration-300"
        >
          <span className="text-xs cursor-default">{tag}</span>
          <button onClick={() => removeTag(index)} className="text-blue-500 hover:text-red-400 cursor-pointer">
            <X size={14} />
          </button>
        </div>
      ))}

      <input
        ref={inputRef}
        type="text"
        className="flex-grow min-w-[120px] outline-none bg-transparent text-xs"
        placeholder="Tags..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  )
}

export default TagInput