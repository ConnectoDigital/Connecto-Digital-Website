"use client";

import { useState } from "react";
import {
  Plus,
  Check,
  Trash2,
  GripVertical,
  Calendar,
  Flag,
} from "lucide-react";

interface TodoItem {
  id: string;
  title: string;
  description?: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  dueDate?: string;
  completed: boolean;
  assignee: string;
  project?: string;
}

const mockTodos: TodoItem[] = [
  {
    id: "1",
    title: "Review Boat Tours booking flow",
    description: "Client requested changes to the date picker component",
    priority: "HIGH",
    dueDate: "2026-03-25",
    completed: false,
    assignee: "Mitchell",
    project: "Private Boat Tours",
  },
  {
    id: "2",
    title: "Deploy Egaroshi staging environment",
    priority: "HIGH",
    dueDate: "2026-03-24",
    completed: false,
    assignee: "Diego",
    project: "Egaroshi Logistics",
  },
  {
    id: "3",
    title: "Send invoice for March — Caribbean Solar",
    priority: "MEDIUM",
    dueDate: "2026-03-28",
    completed: false,
    assignee: "Mitchell",
  },
  {
    id: "4",
    title: "Update SSL certificates for client domains",
    description: "3 domains expiring in April",
    priority: "MEDIUM",
    dueDate: "2026-04-01",
    completed: false,
    assignee: "Diego",
  },
  {
    id: "5",
    title: "Design social media templates for Q2",
    priority: "LOW",
    completed: false,
    assignee: "Sofia",
    project: "Caribbean Solar Marketing",
  },
  {
    id: "6",
    title: "Setup Stripe webhook for new subscription plans",
    priority: "HIGH",
    dueDate: "2026-03-23",
    completed: true,
    assignee: "Diego",
  },
  {
    id: "7",
    title: "Client onboarding call — Island Tech",
    priority: "MEDIUM",
    dueDate: "2026-03-22",
    completed: true,
    assignee: "Mitchell",
    project: "Island Tech Website",
  },
];

const priorityStyles: Record<string, { bg: string; text: string; dot: string }> = {
  HIGH: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400" },
  MEDIUM: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400" },
  LOW: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400" },
};

const TEAM = ["ALL", "Mitchell", "Diego", "Sofia"];

export default function TodosPage() {
  const [todos, setTodos] = useState(mockTodos);
  const [showAdd, setShowAdd] = useState(false);
  const [filterAssignee, setFilterAssignee] = useState("ALL");
  const [showCompleted, setShowCompleted] = useState(false);

  const activeTodos = todos.filter((t) => !t.completed);
  const completedTodos = todos.filter((t) => t.completed);

  const filteredActive =
    filterAssignee === "ALL"
      ? activeTodos
      : activeTodos.filter((t) => t.assignee === filterAssignee);

  const filteredCompleted =
    filterAssignee === "ALL"
      ? completedTodos
      : completedTodos.filter((t) => t.assignee === filterAssignee);

  function toggleComplete(id: string) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  function deleteTodo(id: string) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  function isOverdue(date?: string) {
    if (!date) return false;
    return new Date(date) < new Date("2026-03-24");
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-semibold tracking-tight text-white">
            To-Do
          </h2>
          <p className="mt-0.5 font-mono-accent text-[11px] tracking-wider text-white/30">
            {activeTodos.length} PENDING · {completedTodos.length} DONE
          </p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="inline-flex items-center gap-0"
        >
          <span className="font-mono-accent text-[12px] bg-[#FF541F] text-white px-5 py-2.5 hover:bg-[#FF541F]/90 transition-colors flex items-center gap-2 tracking-wider">
            <Plus size={14} />
            ADD TASK
          </span>
          <span className="w-10 h-[42px] bg-[#FF541F] text-white flex items-center justify-center text-lg border-l border-white/10 hover:bg-[#FF541F]/90 transition-colors">
            +
          </span>
        </button>
      </div>

      {/* Assignee filter */}
      <div className="flex gap-0">
        {TEAM.map((t) => (
          <button
            key={t}
            onClick={() => setFilterAssignee(t)}
            className={`whitespace-nowrap px-4 py-2 font-mono-accent text-[10px] tracking-wider border border-white/[0.06] transition-colors ${
              t !== "ALL" ? "border-l-0" : ""
            } ${
              filterAssignee === t
                ? "bg-white/5 text-white"
                : "text-white/30 hover:text-white/50"
            }`}
          >
            {t === "ALL" ? "ALL TEAM" : t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Add form */}
      {showAdd && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const data = new FormData(form);
            setTodos((prev) => [
              {
                id: String(Date.now()),
                title: data.get("title") as string,
                description: (data.get("description") as string) || undefined,
                priority: (data.get("priority") as TodoItem["priority"]) || "MEDIUM",
                dueDate: (data.get("dueDate") as string) || undefined,
                completed: false,
                assignee: (data.get("assignee") as string) || "Mitchell",
                project: (data.get("project") as string) || undefined,
              },
              ...prev,
            ]);
            setShowAdd(false);
            form.reset();
          }}
          className="border border-white/[0.06] bg-white/[0.02] p-6 space-y-4"
        >
          <h3 className="font-mono-accent text-[11px] tracking-wider text-white/40">
            NEW TASK
          </h3>
          <input name="title" placeholder="Task title" required className="w-full border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-[#FF541F]/30 focus:outline-none" />
          <input name="description" placeholder="Description (optional)" className="w-full border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-[#FF541F]/30 focus:outline-none" />
          <div className="grid grid-cols-4 gap-4">
            <select name="priority" className="border border-white/[0.06] bg-[#0a0a0a] px-4 py-2.5 text-sm text-white focus:outline-none">
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM" selected>MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
            <select name="assignee" className="border border-white/[0.06] bg-[#0a0a0a] px-4 py-2.5 text-sm text-white focus:outline-none">
              {TEAM.filter((t) => t !== "ALL").map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <input name="dueDate" type="date" className="border border-white/[0.06] bg-[#0a0a0a] px-4 py-2.5 text-sm text-white focus:outline-none" />
            <input name="project" placeholder="Project (optional)" className="border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none" />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="font-mono-accent text-[12px] bg-[#FF541F] text-white px-5 py-2.5 tracking-wider">CREATE</button>
            <button type="button" onClick={() => setShowAdd(false)} className="font-mono-accent text-[12px] border border-white/[0.06] px-5 py-2.5 tracking-wider text-white/40 hover:text-white transition-colors">CANCEL</button>
          </div>
        </form>
      )}

      {/* Active tasks */}
      <div className="space-y-1">
        {filteredActive.map((todo) => {
          const ps = priorityStyles[todo.priority];
          const overdue = isOverdue(todo.dueDate) && !todo.completed;
          return (
            <div
              key={todo.id}
              className="flex items-start gap-3 border border-white/[0.06] bg-white/[0.02] p-4 hover:bg-white/[0.03] transition-colors group"
            >
              <GripVertical size={14} className="mt-1 text-white/10 shrink-0 cursor-grab" />

              <button
                onClick={() => toggleComplete(todo.id)}
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border border-white/[0.15] hover:border-[#FF541F] transition-colors"
              >
                {todo.completed && <Check size={12} className="text-[#FF541F]" />}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[14px] font-medium text-white">
                    {todo.title}
                  </span>
                  <span className={`font-mono-accent text-[9px] tracking-wider px-1.5 py-0.5 ${ps.bg} ${ps.text}`}>
                    {todo.priority}
                  </span>
                </div>
                {todo.description && (
                  <p className="text-[12px] text-white/30 mb-1">{todo.description}</p>
                )}
                <div className="flex items-center gap-4 font-mono-accent text-[10px] tracking-wider text-white/20">
                  <span>{todo.assignee}</span>
                  {todo.project && <span>· {todo.project}</span>}
                  {todo.dueDate && (
                    <span className={`flex items-center gap-1 ${overdue ? "text-red-400" : ""}`}>
                      <Calendar size={10} />
                      {new Date(todo.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      {overdue && " OVERDUE"}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => deleteTodo(todo.id)}
                className="p-1.5 text-white/10 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={13} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Completed toggle */}
      {filteredCompleted.length > 0 && (
        <button
          onClick={() => setShowCompleted(!showCompleted)}
          className="font-mono-accent text-[11px] tracking-wider text-white/20 hover:text-white/40 transition-colors"
        >
          {showCompleted ? "HIDE" : "SHOW"} COMPLETED ({filteredCompleted.length})
        </button>
      )}

      {/* Completed tasks */}
      {showCompleted && (
        <div className="space-y-1 opacity-60">
          {filteredCompleted.map((todo) => (
            <div
              key={todo.id}
              className="flex items-start gap-3 border border-white/[0.04] bg-white/[0.01] p-4 group"
            >
              <GripVertical size={14} className="mt-1 text-white/5 shrink-0" />
              <button
                onClick={() => toggleComplete(todo.id)}
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border border-[#FF541F]/30 bg-[#FF541F]/10"
              >
                <Check size={12} className="text-[#FF541F]" />
              </button>
              <div className="flex-1 min-w-0">
                <span className="text-[14px] text-white/40 line-through">{todo.title}</span>
                <div className="flex items-center gap-3 mt-0.5 font-mono-accent text-[10px] tracking-wider text-white/15">
                  <span>{todo.assignee}</span>
                  {todo.project && <span>· {todo.project}</span>}
                </div>
              </div>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="p-1.5 text-white/10 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
