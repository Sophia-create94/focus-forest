"use client"

import { useState } from "react"
import { TodoRow } from "@/components/todo-row"
import { Input } from "@/components/ui/input"

// To-Do screen for the /plans/todo route. State is in-memory React useState
// seeded from INITIAL_TODOS — no localStorage, no Context provider yet
// (Phase 5d may introduce a TodoContext if multiple screens need access).
// Behavioral reference: _design-system-reference/ui_kits/mobile/Screens.jsx
// TodoScreen. Title "Grocery shopping" is hardcoded for the Phase 5a
// portfolio demo; data-driven titles arrive when a real persistence layer
// lands.
//
// Section tab strip (Calendar / To-do-list / Countdown) lives in the
// parent app/(app)/plans/layout.tsx via ScreenTabs — this page no
// longer renders its own copy. Removed during the tab strip
// consolidation that resolved the parallel-tab-strips visual bug.

type TodoItem = {
  id: string
  text: string
  done: boolean
  isGroup?: boolean
  children?: TodoItem[]
}

const INITIAL_TODOS: TodoItem[] = [
  { id: "bread", text: "Bread", done: false },
  { id: "oj", text: "Orange Juice", done: false },
  {
    id: "pancakes",
    text: "Needed for Pancakes",
    done: false,
    isGroup: true,
    children: [
      { id: "strawberries", text: "Strawberries", done: false },
      { id: "bananas", text: "Bananas", done: false },
      { id: "flour", text: "Flour", done: false },
    ],
  },
  { id: "rice", text: "Rice", done: false },
  { id: "mushrooms", text: "Mushrooms", done: false },
  { id: "onions", text: "Onions", done: false },
  { id: "croissants", text: "Croissants", done: false },
]

export default function TodoPage() {
  const [items, setItems] = useState<TodoItem[]>(INITIAL_TODOS)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    pancakes: true,
  })
  const [query, setQuery] = useState("")

  const toggleDone = (id: string) => {
    setItems(
      items.map((it) => {
        if (it.id === id) return { ...it, done: !it.done }
        if (it.children) {
          return {
            ...it,
            children: it.children.map((c) =>
              c.id === id ? { ...c, done: !c.done } : c
            ),
          }
        }
        return it
      })
    )
  }

  const remove = (id: string) => {
    setItems(
      items
        .filter((it) => it.id !== id)
        .map((it) =>
          it.children
            ? { ...it, children: it.children.filter((c) => c.id !== id) }
            : it
        )
    )
  }

  const toggleExpand = (id: string) => {
    setExpanded({ ...expanded, [id]: !expanded[id] })
  }

  const q = query.trim().toLowerCase()
  const match = (t: string) => !q || t.toLowerCase().includes(q)

  return (
    <>
      <h1 className="font-display text-h3 text-white text-center px-4 pt-8 pb-3">
        Grocery shopping
      </h1>
      <div className="px-4 pb-2">
        <div className="relative">
          <Input
            aria-label="Search todos"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pr-9"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-white/70 hover:text-white cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-yellow focus-visible:outline-offset-2 rounded-pill"
            >
              <svg
                aria-hidden="true"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <line x1="3.5" y1="3.5" x2="10.5" y2="10.5" />
                <line x1="10.5" y1="3.5" x2="3.5" y2="10.5" />
              </svg>
            </button>
          )}
        </div>
      </div>
      <div className="px-4 pb-8">
        {items.map((item) => {
          if (item.isGroup && item.children) {
            const isOpen = expanded[item.id]
            const childrenMatch = item.children.some((c) => match(c.text))
            if (!match(item.text) && !childrenMatch) return null
            const filteredChildren = item.children.filter((c) => match(c.text))
            const groupId = `todo-children-${item.id}`
            return (
              <div key={item.id}>
                <TodoRow
                  id={item.id}
                  text={item.text}
                  done={item.done}
                  isGroup
                  expanded={isOpen}
                  childrenGroupId={groupId}
                  onToggleDone={toggleDone}
                  onRemove={remove}
                  onToggleExpand={toggleExpand}
                />
                {isOpen && (
                  <div id={groupId}>
                    {filteredChildren.map((c) => (
                      <TodoRow
                        key={c.id}
                        id={c.id}
                        text={c.text}
                        done={c.done}
                        isSubRow
                        onToggleDone={toggleDone}
                        onRemove={remove}
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          }
          if (!match(item.text)) return null
          return (
            <TodoRow
              key={item.id}
              id={item.id}
              text={item.text}
              done={item.done}
              onToggleDone={toggleDone}
              onRemove={remove}
            />
          )
        })}
      </div>
    </>
  )
}
