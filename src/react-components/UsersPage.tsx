import * as React from "react"

interface IUser {
  name: string
  email: string
  role: string
  avatar: string
}

export function UsersPage() {
  const [users, setUsers] = React.useState<IUser[]>([
    {
      name: "Dyeison Mlenek",
      email: "dyeison@example.com",
      role: "Developer",
      avatar: "./assets/avatar_1.png"
    },
    {
      name: "Ana Beatriz",
      email: "ana.beatriz@example.com",
      role: "Architect",
      avatar: "./assets/avatar_2.png"
    }
  ])

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    
    const newUser: IUser = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      role: (formData.get("role") as string).charAt(0).toUpperCase() + (formData.get("role") as string).slice(1),
      avatar: `./assets/avatar_${Math.floor(Math.random() * 2) + 1}.png`
    }

    setUsers([...users, newUser])
    form.reset()
    onCloseModal()
  }

  const onOpenModal = () => {
    const modal = document.getElementById("new-user-modal")
    if (modal && modal instanceof HTMLDialogElement) {
      modal.showModal()
    }
  }

  const onCloseModal = () => {
    const modal = document.getElementById("new-user-modal")
    if (modal && modal instanceof HTMLDialogElement) {
      modal.close()
    }
  }

  return (
    <div className="page" id="users-page">
      <dialog id="new-user-modal">
        <form id="new-user-form" onSubmit={handleAddUser}>
          <h2>New User</h2>
          <div className="input-list">
            <div className="form-field-container">
              <label><span className="material-icons-round">person</span>Name</label>
              <input type="text" name="name" placeholder="Jane Doe" required />
            </div>
            <div className="form-field-container">
              <label><span className="material-icons-round">email</span>Email</label>
              <input type="email" name="email" placeholder="jane@example.com" required />
            </div>
            <div className="form-field-container">
              <label><span className="material-icons-round">work</span>Role</label>
              <select name="role">
                <option value="architect">Architect</option>
                <option value="engineer">Engineer</option>
                <option value="developer">Developer</option>
              </select>
            </div>
            <div style={{ display: "flex", margin: "10px 0px 10px auto", columnGap: "10px" }}>
              <button type="button" onClick={onCloseModal} style={{ backgroundColor: "transparent" }}>Cancel</button>
              <button type="submit" style={{ backgroundColor: "rgb(18, 145, 18)" }}>Add User</button>
            </div>
          </div>
        </form>
      </dialog>
      <header>
        <h2>Users</h2>
        <div>
          <button onClick={onOpenModal}><span className="material-icons-round">add</span>New User</button>
        </div>
      </header>
      <div id="users-list" style={{ display: "flex", flexWrap: "wrap", gap: "20px", padding: "30px" }}>
        {users.map((user, index) => (
          <div className="user-card" key={index}>
            <div className="user-avatar">
              <img src={user.avatar} alt="User avatar" />
            </div>
            <div className="user-details">
              <h3>{user.name}</h3>
              <p className="user-role">{user.role}</p>
              <p className="user-email"><span className="material-icons-round">email</span> {user.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
