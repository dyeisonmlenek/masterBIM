import { IProject, ProjectStatus, UserRole } from "./classes/Project"
import { ProjectsManager } from "./classes/ProjectsManager"

function showModal(id: string) {
  const modal = document.getElementById(id)
  if (modal && modal instanceof HTMLDialogElement) {
    modal.showModal()
  } else {
    console.warn("The provided modal wasn't found. ID: ", id)
  }
}

function closeModal(id: string) {
  const modal = document.getElementById(id)
  if (modal && modal instanceof HTMLDialogElement) {
    modal.close()
  } else {
    console.warn("The provided modal wasn't found. ID: ", id)
  }
}

const projectsListUI = document.getElementById("projects-list") as HTMLElement
const projectsManager = new ProjectsManager(projectsListUI)

// This document object is provided by the browser, and its main purpose is to help us interact with the DOM.
const newProjectBtn = document.getElementById("new-project-btn")
if (newProjectBtn) {
  newProjectBtn.addEventListener("click", () => {showModal("new-project-modal")})
} else {
  console.warn("New projects button was not found")
}

const projectForm = document.getElementById("new-project-form")
if (projectForm && projectForm instanceof HTMLFormElement) {
  projectForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const formData = new FormData(projectForm)
    const projectData: IProject = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      status: formData.get("status") as ProjectStatus,
      userRole: formData.get("userRole") as UserRole,
      finishDate: new Date(formData.get("finishDate") as string)
    }
    try {
      const project = projectsManager.newProject(projectData)
      console.log(project)
      projectForm.reset()
      closeModal("new-project-modal")
    } catch (err) {
      alert(err)
    }
  })
} else {
	console.warn("The project form was not found. Check the ID!")
}

const exportProjectsBtn= document.getElementById("export-projects-btn")
if (exportProjectsBtn) {
  exportProjectsBtn.addEventListener("click", () => {
    projectsManager.exportToJSON()
  })
}

const importProjectsBtn = document.getElementById("import-projects-btn")
if (importProjectsBtn) {
  importProjectsBtn.addEventListener("click", () => {
    projectsManager.importFromJSON()
  })
}

// --- Navigation ---
const projectsPage = document.getElementById("projects-page")
const usersPage = document.getElementById("users-page")
const projectDetails = document.getElementById("project-details")

document.getElementById("nav-projects-btn")?.addEventListener("click", () => {
  if (projectsPage && usersPage && projectDetails) {
    projectsPage.style.display = "flex"
    usersPage.style.display = "none"
    projectDetails.style.display = "none"
  }
})

document.getElementById("nav-users-btn")?.addEventListener("click", () => {
  if (projectsPage && usersPage && projectDetails) {
    projectsPage.style.display = "none"
    usersPage.style.display = "flex"
    projectDetails.style.display = "none"
  }
})

// --- Edit Project ---
document.getElementById("edit-project-btn")?.addEventListener("click", () => {
  const activeProj = projectsManager.activeProject
  if (!activeProj) return
  const form = document.getElementById("edit-project-form") as HTMLFormElement
  if (form) {
    (form.elements.namedItem("description") as HTMLInputElement).value = activeProj.description;
    (form.elements.namedItem("userRole") as HTMLInputElement).value = activeProj.userRole;
    (form.elements.namedItem("status") as HTMLInputElement).value = activeProj.status;
    (form.elements.namedItem("finishDate") as HTMLInputElement).value = new Date(activeProj.finishDate).toISOString().split('T')[0];
  }
  showModal("edit-project-modal")
})

document.getElementById("cancel-edit-project-btn")?.addEventListener("click", () => closeModal("edit-project-modal"))

document.getElementById("edit-project-form")?.addEventListener("submit", (e) => {
  e.preventDefault()
  const activeProj = projectsManager.activeProject
  if (!activeProj) return
  const formData = new FormData(e.target as HTMLFormElement)
  
  activeProj.description = formData.get("description") as string
  activeProj.status = formData.get("status") as ProjectStatus
  activeProj.userRole = formData.get("userRole") as UserRole
  activeProj.finishDate = new Date(formData.get("finishDate") as string)
  
  // Refresh UI
  projectsManager.setDetailsPage(activeProj) // TypeScript might complain about private setDetailsPage if I don't expose it or just let it be if I exposed it. Wait, setDetailsPage is private!
  
  closeModal("edit-project-modal")
})

// --- To-Do ---
import { v4 as uuidv4 } from 'uuid'
import { ToDoStatus } from './classes/Project'

document.getElementById("add-todo-btn")?.addEventListener("click", () => showModal("new-todo-modal"))
document.getElementById("cancel-todo-btn")?.addEventListener("click", () => closeModal("new-todo-modal"))

document.getElementById("new-todo-form")?.addEventListener("submit", (e) => {
  e.preventDefault()
  const activeProj = projectsManager.activeProject
  if (!activeProj) return
  const formData = new FormData(e.target as HTMLFormElement)
  
  const todo = {
    id: uuidv4(),
    name: formData.get("name") as string,
    date: new Date(formData.get("date") as string),
    status: formData.get("status") as ToDoStatus
  }
  
  if (!activeProj.todos) activeProj.todos = []
  activeProj.todos.push(todo)
  projectsManager.renderToDos()
  ;(e.target as HTMLFormElement).reset()
  closeModal("new-todo-modal")
})