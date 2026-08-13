import * as React from "react"
import { IToDo, ToDoCard } from "./ToDoCard"
import { ToDoForm } from "./ToDoForm"
import { SearchBox } from "./SearchBox"

interface Props {
  todos: IToDo[]
  onSaveTodo: (todo: IToDo) => void
}

export function ProjectTasksList({ todos, onSaveTodo }: Props) {
  const [search, setSearch] = React.useState("")
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [todoToEdit, setTodoToEdit] = React.useState<IToDo | null>(null)

  const filteredTodos = todos.filter(todo => todo.name.toLowerCase().includes(search.toLowerCase()))

  const handleEdit = (todo: IToDo) => {
    setTodoToEdit(todo)
    setIsFormOpen(true)
  }

  const handleNew = () => {
    setTodoToEdit(null)
    setIsFormOpen(true)
  }

  return (
    <div className="dashboard-card" style={{ flexGrow: 1 }}>
      <div style={{ padding: "20px 30px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h4>Tarefas</h4>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "end", columnGap: "20px" }}>
          <SearchBox onChange={setSearch} />
          <span className="material-icons-round" style={{ cursor: "pointer" }} onClick={handleNew}>add</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", padding: "10px 30px", rowGap: "20px" }}>
        {filteredTodos.map(todo => (
          <ToDoCard key={todo.id} todo={todo} onEdit={handleEdit} />
        ))}
      </div>
      {isFormOpen && (
        <ToDoForm
          todoToEdit={todoToEdit}
          onClose={() => setIsFormOpen(false)}
          onSave={onSaveTodo}
        />
      )}
    </div>
  )
}
