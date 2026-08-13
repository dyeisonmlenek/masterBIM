import * as React from "react"

import { IToDo } from "../classes/Project"

interface Props {
  todo: IToDo
  onEdit: (todo: IToDo) => void
}

export function ToDoCard({ todo, onEdit }: Props) {
  let bgColor = "#686868"
  if (todo.status === "done") bgColor = "rgb(18, 145, 18)"
  if (todo.status === "in-progress") bgColor = "#ca8134"

  let priorityColor = "gray"
  if (todo.priority === "high") priorityColor = "red"
  if (todo.priority === "medium") priorityColor = "orange"
  if (todo.priority === "low") priorityColor = "green"

  return (
    <div className="todo-item" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", backgroundColor: "var(--background-100)", borderRadius: "8px", marginBottom: "10px" }}>
      <div style={{ display: "flex", columnGap: "15px", alignItems: "center" }}>
        <span className="material-icons-round" style={{ padding: "10px", backgroundColor: bgColor, borderRadius: "10px", color: "white" }}>
          {todo.status === "done" ? "check_circle" : "construction"}
        </span>
        <p>{todo.name}</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", columnGap: "15px" }}>
        <span style={{ backgroundColor: priorityColor, padding: "2px 8px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold", color: "white" }}>
          {todo.priority.toUpperCase()}
        </span>
        <p style={{ textWrap: "nowrap" }}>{new Date(todo.date).toLocaleDateString()}</p>
        <button onClick={() => onEdit(todo)} style={{ backgroundColor: "transparent", border: "none", cursor: "pointer", padding: "5px" }}>
          <span className="material-icons-round">edit</span>
        </button>
      </div>
    </div>
  )
}
