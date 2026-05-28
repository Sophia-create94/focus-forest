import { Checkbox } from "@/components/ui/checkbox"
import { TrashIcon } from "@/components/ui/icons"
import { cn } from "@/lib/utils"

// Single todo row composite. Renders one line item with:
// - Drag handle (decorative, aria-hidden; DnD not wired in Phase 5a)
// - Checkbox primitive (Radix-backed, full a11y)
// - Text (line-through + 45% opacity when done)
// - Expand arrow (only if isGroup; collapsed state rotates -90deg static —
//   smooth transition is a Phase 6 follow-up)
// - Trash icon button (aria-labeled with the item text)
// isSubRow indents 38px to align children content with the parent's text
// column. Reference: _design-system-reference/preview/components-todo-rows.html

export type TodoRowProps = {
  id: string
  text: string
  done: boolean
  isSubRow?: boolean
  isGroup?: boolean
  expanded?: boolean
  childrenGroupId?: string
  onToggleDone: (id: string) => void
  onRemove: (id: string) => void
  onToggleExpand?: (id: string) => void
}

export function TodoRow({
  id,
  text,
  done,
  isSubRow = false,
  isGroup = false,
  expanded = false,
  childrenGroupId,
  onToggleDone,
  onRemove,
  onToggleExpand,
}: TodoRowProps) {
  return (
    <div
      className={cn(
        "flex items-center px-1.5 py-2.5 gap-2",
        "border-b border-white/10",
        isSubRow && "pl-[38px]"
      )}
    >
      <span
        aria-hidden="true"
        className="text-white/35 font-body text-body tracking-[-1px] leading-none select-none flex-shrink-0"
      >
        ⠿
      </span>
      <Checkbox checked={done} onCheckedChange={() => onToggleDone(id)} />
      <span
        className={cn(
          "flex-1 font-body text-body text-white leading-[1.3]",
          done && "line-through opacity-45"
        )}
      >
        {text}
      </span>
      <div className="flex items-center gap-2 flex-shrink-0">
        {isGroup && onToggleExpand && (
          <button
            type="button"
            onClick={() => onToggleExpand(id)}
            aria-expanded={expanded}
            aria-controls={childrenGroupId}
            className={cn(
              "text-white/65 text-[15px] leading-none select-none",
              "bg-transparent border-0 p-0 cursor-pointer",
              "outline-none focus-visible:outline-2 focus-visible:outline-yellow focus-visible:outline-offset-2",
              !expanded && "-rotate-90"
            )}
          >
            ∨
          </button>
        )}
        <button
          type="button"
          onClick={() => onRemove(id)}
          aria-label={`Delete ${text}`}
          className={cn(
            "text-white/45 leading-none",
            "bg-transparent border-0 p-0.5 cursor-pointer",
            "outline-none focus-visible:outline-2 focus-visible:outline-yellow focus-visible:outline-offset-2",
            "[&_svg]:pointer-events-none"
          )}
        >
          <TrashIcon width={14} height={16} />
        </button>
      </div>
    </div>
  )
}
