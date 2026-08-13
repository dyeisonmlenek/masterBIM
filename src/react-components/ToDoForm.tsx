import * as React from "react"
import { IToDo } from "./ToDoCard"
import { v4 as uuidv4 } from "uuid"

interface Props {
  todoToEdit: IToDo | null
  onClose: () => void
  onSave: (todo: IToDo) => void
}

export function ToDoForm({ todoToEdit, onClose, onSave }: Props) {
  const [name, setName] = React.useState(todoToEdit?.name || "")
  const [date, setDate] = React.useState(
    todoToEdit?.date ? new Date(todoToEdit.date).toISOString().split('T')[0] : ""
  )
  const [status, setStatus] = React.useState<IToDo["status"]>(todoToEdit?.status || "pending")
  const [priority, setPriority] = React.useState<IToDo["priority"]>(todoToEdit?.priority || "medium")

  React.useEffect(() => {
    if (todoToEdit) {
      setName(todoToEdit.name)
      setDate(new Date(todoToEdit.date).toISOString().split('T')[0])
      setStatus(todoToEdit.status)
      setPriority(todoToEdit.priority)
    } else {
      setName("")
      setDate("")
      setStatus("pending")
      setPriority("medium")
    }
  }, [todoToEdit])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      id: todoToEdit?.id || uuidv4(),
      name,
      date: new Date(date),
      status,
      priority
    })
    onClose()
  }

  return (
    <dialog id="todo-modal" open style={{ zIndex: 100, position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
      <form onSubmit={handleSubmit}>
        <h2>{todoToEdit ? "Edit To-Do" : "New To-Do"}</h2>
        <div className="input-list">
          <div className="form-field-container">
            <label><span className="material-icons-round">task</span>Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="form-field-container">
            <label><span className="material-icons-round">calendar_month</span>Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
          </div>
          <div className="form-field-container">
            <label><span className="material-icons-round">list</span>Status</label>
            <select value={status} onChange={e => setStatus(e.target.value as any)}>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div className="form-field-container">
            <label><span className="material-icons-round">priority_high</span>Priority</label>
            <select value={priority} onChange={e => setPriority(e.target.value as any)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div style={{ display: "flex", margin: "10px 0px 10px auto", columnGap: "10px" }}>
            <button type="button" onClick={onClose} style={{ backgroundColor: "transparent" }}>Cancel</button>
            <button type="submit" style={{ backgroundColor: "rgb(18, 145, 18)" }}>Save</button>
          </div>
        </div>
      </form>
    </dialog>
  )
}
