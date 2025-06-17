"use client"

import React, { useState, useRef } from "react"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const TagInput = ({
  value,
  onChange,
  tagTextClassName,
  inputClassName
}: {
  value: string[],
  onChange: (tags: string[]) => void,
  placeholder?: string,
  tagTextClassName?: string,
  inputClassName?: string
}) => {
  const [input, setInput] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const addTag = (tag: string) => {
    const newTag = tag.trim()
    if (newTag !== "" && !value.includes(newTag)) {
      onChange([...value, newTag])
      setInput("")
    }
  }

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && input) {
      e.preventDefault()
      addTag(input)
    }

    if (e.key === "Backspace" && input === "" && value.length > 0) {
      removeTag(value.length - 1)
    }
  }

  return (
    <div
      className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-md focus-within:ring-1 ring-black"
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((tag, index) => (
        <div
          key={index}
          className="flex items-center gap-1 px-2 py-1 text-sm bg-black text-white rounded-full hover:opacity-75 transition-all duration-300"
        >
          <span className={cn("cursor-default", tagTextClassName)}>{tag}</span>
          <button onClick={() => removeTag(index)} className="text-gray-400 hover:text-red-400 cursor-pointer">
            <X size={14} />
          </button>
        </div>
      ))}

      <input
        ref={inputRef}
        type="text"
        className={cn("flex-grow min-w-[120px] outline-none bg-transparent", inputClassName)}
        placeholder="Tags..."
        value={input}
        onChange={(e) => {
          const sanitized = e.target.value.replace(/\s/g, "")
          setInput(sanitized)
        }}
        onKeyDown={handleKeyDown}
      />
    </div>
  )
}

export default TagInput