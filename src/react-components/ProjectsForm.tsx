import * as React from "react"
import * as Firestore from "firebase/firestore"
import { IProject, ProjectStatus, UserRole } from "../classes/Project"
import { ProjectsManager } from "../classes/ProjectsManager"
import { getCollection } from "../firebase"

interface Props {
  projectsManager: ProjectsManager
}

const projectsCollection = getCollection<IProject>("projects")

export function ProjectsForm(props: Props) {
  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const projectForm = e.target as HTMLFormElement
    const formData = new FormData(projectForm)
    const projectData: IProject = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      status: formData.get("status") as ProjectStatus,
      userRole: formData.get("userRole") as UserRole,
      finishDate: new Date(formData.get("finishDate") as string)
    }
    
    try {
      const project = props.projectsManager.newProject(projectData)
      projectForm.reset()
      onCloseModal()

      const docRef = Firestore.doc(projectsCollection, project.id)
      Firestore.setDoc(docRef, { ...projectData, iconColor: project.iconColor })
        .catch((err) => {
          console.warn("Firebase failed to save project, but it was created locally.", err)
        })
    } catch (err) {
      alert(err)
    }
  }

  const onCloseModal = () => {
    const modal = document.getElementById("new-project-modal")
    if (modal && modal instanceof HTMLDialogElement) {
      modal.close()
    }
  }

  return (
    <dialog id="new-project-modal">
      <form onSubmit={onFormSubmit} id="new-project-form">
        <h2>New Project</h2>
        <div className="input-list">
          <div className="form-field-container">
            <label>
              <span className="material-icons-round">apartment</span>Name
            </label>
            <input
              name="name"
              type="text"
              placeholder="What's the name of your project?"
              required
            />
            <p style={{ color: "gray", fontSize: "var(--font-sm)", marginTop: 5, fontStyle: "italic" }}>
              TIP: Give it a short name
            </p>
          </div>
          <div className="form-field-container">
            <label>
              <span className="material-icons-round">subject</span>Description
            </label>
            <textarea
              name="description"
              cols={30}
              rows={5}
              placeholder="Give your project a nice description! So people is jealous about it."
              defaultValue={""}
              required
            />
          </div>
          <div className="form-field-container">
            <label>
              <span className="material-icons-round">person</span>Role
            </label>
            <select name="userRole">
              <option value="architect">Architect</option>
              <option value="engineer">Engineer</option>
              <option value="developer">Developer</option>
            </select>
          </div>
          <div className="form-field-container">
            <label>
              <span className="material-icons-round">not_listed_location</span>
              Status
            </label>
            <select name="status">
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="finished">Finished</option>
            </select>
          </div>
          <div className="form-field-container">
            <label htmlFor="finishDate">
              <span className="material-icons-round">calendar_month</span>
              Finish Date
            </label>
            <input name="finishDate" type="date" required />
          </div>
          <div style={{ display: "flex", margin: "10px 0px 10px auto", columnGap: 10 }}>
            <button type="button" onClick={onCloseModal} style={{ backgroundColor: "transparent" }}>
              Cancel
            </button>
            <button type="submit" style={{ backgroundColor: "rgb(18, 145, 18)" }}>
              Accept
            </button>
          </div>
        </div>
      </form>
    </dialog>
  )
}
