import * as React from "react";
import * as Router from "react-router-dom";
import { ProjectsManager } from "../classes/ProjectsManager";
import { ProjectTasksList } from "./ProjectTasksList";
import { deleteDocument, updateDocument } from "../firebase";
import { IProject, IToDo, ProjectStatus, UserRole } from "../classes/Project";
import * as BUI from "@thatopen/ui";
import * as TEMPLATES from "../ui-templates";
import { setupComponents } from "../bim-components";
import { SmartViews } from "../bim-components/SmartViews";
import * as OBC from "@thatopen/components";
import { ComponentsGrid } from "../ui-templates/grids/components/src";

interface Props {
  projectsManager: ProjectsManager
}

export function ProjectDetailsPage(props: Props) {
  const routeParams = Router.useParams<{id: string}>()
  if (!routeParams.id) {return (<p>Project ID is needed to see this page</p>)}
  const project = props.projectsManager.getProject(routeParams.id)
  if (!project) {return (<p>The project with ID {routeParams.id} wasn't found.</p>)}

  const navigateTo = Router.useNavigate()
  props.projectsManager.OnProjectDeleted = async (id) => {
    await deleteDocument("/projects", id)
    navigateTo("/")
  }

  const [todos, setTodos] = React.useState<IToDo[]>(project.todos || [])
  const [isEditing, setIsEditing] = React.useState(false)
  const [editName, setEditName] = React.useState(project.name)
  const [editDescription, setEditDescription] = React.useState(project.description)
  const [editStatus, setEditStatus] = React.useState<ProjectStatus>(project.status)
  const [editRole, setEditRole] = React.useState<UserRole>(project.userRole)
  const [editCost, setEditCost] = React.useState(project.cost)

  const handleEditSave = async () => {
    project.name = editName
    project.description = editDescription
    project.status = editStatus
    project.userRole = editRole
    project.cost = editCost
    setIsEditing(false)
    try {
      await updateDocument("/projects", project.id, {
        name: editName,
        description: editDescription,
        status: editStatus,
        userRole: editRole,
        cost: editCost
      })
    } catch (err) {
      console.warn("Firebase failed to update project.", err)
    }
  }

  const handleSaveTodo = async (todo: IToDo) => {
    const newTodos = [...todos]
    const existingIndex = newTodos.findIndex(t => t.id === todo.id)
    if (existingIndex >= 0) {
      newTodos[existingIndex] = todo
    } else {
      newTodos.push(todo)
    }
    setTodos(newTodos)
    project.todos = newTodos
    try {
      await updateDocument("/projects", project.id, { todos: newTodos })
    } catch (err) {
      console.warn("Firebase failed to save ToDo, but it is saved locally.", err)
    }
  }

  const viewerGrid = React.useRef<BUI.Grid<["Main"]>>(null)
  let engineManager: OBC.Components | null = null

  const setupGrid = async () => {
    const { current: grid } = viewerGrid
    if (!grid) return

    const { components, viewport } = await setupComponents()
    engineManager = components
    
    const smartViews = components.get(SmartViews)
    if (project.smartViews) {
      smartViews.importList(project.smartViews)
    }

    const saveSmartViews = () => {
      project.smartViews = smartViews.exportList()
      updateDocument("/projects", project.id, { smartViews: project.smartViews }).catch(console.warn)
    }

    smartViews.list.onItemSet.add(saveSmartViews)
    smartViews.list.onItemUpdated.add(saveSmartViews)
    smartViews.list.onItemDeleted.add(saveSmartViews)

    grid.elements = {
      sidebar: {
        template: TEMPLATES.gridSidebarTemplate,
        initialState: {}
      },
      componentsGrid: {
        template: TEMPLATES.componentsGridTemplate,
        initialState: { components, viewport }
      }
    };

    grid.layouts = {
      Main: {
        template: `
          "sidebar" auto
          "componentsGrid" 1fr
          /1fr
        `,
      },
    }

    grid.addEventListener("elementcreated", (e: CustomEvent<BUI.ElementCreatedEventDetail<ComponentsGrid>>) => {
      const { name, element: componentsGrid } = e.detail
      if (name !== "componentsGrid") return
      grid.updateComponent.sidebar({ grid: componentsGrid })
    })

    grid.layout = "Main";
  }

  React.useEffect(() => {
    setupGrid()
    return () => {
      engineManager?.dispose()
      engineManager = null
    }
  }, [])

  return (
    <div className="page" id="project-details">
      <header>
        <div>
          <h2 data-project-info="name">{project.name}</h2>
          <p style={{ color: "#969696" }}>{project.description}</p>
        </div>
        <button onClick={() => props.projectsManager.deleteProject(project.id)} style={{backgroundColor: "red"}}>Delete Project</button>
      </header>
      <div className="main-page-content">
        <div style={{ display: "flex", flexDirection: "column", rowGap: 30 }}>
          <div className="dashboard-card" style={{ padding: "30px 0" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0px 30px",
                marginBottom: 30
              }}
            >
              <p
                style={{
                  fontSize: 20,
                  backgroundColor: project.iconColor,
                  aspectRatio: 1,
                  borderRadius: "100%",
                  padding: 12,
                  textTransform: "uppercase"
                }}
              >
                {project.name.slice(0, 2)}
              </p>
              <button className="btn-secondary" onClick={() => setIsEditing(true)}>
                <p style={{ width: "100%" }}>Edit</p>
              </button>
            </div>
            <div style={{ padding: "0 30px" }}>
              <div>
                <h5>{project.name}</h5>
                <p>{project.description}</p>
              </div>
              <div
                style={{
                  display: "flex",
                  columnGap: 30,
                  padding: "30px 0px",
                  justifyContent: "space-between"
                }}
              >
                <div>
                  <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>
                    Status
                  </p>
                  <p>{project.status}</p>
                </div>
                <div>
                  <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>
                    Cost
                  </p>
                  <p>$ {project.cost}</p>
                </div>
                <div>
                  <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>
                    Role
                  </p>
                  <p>{project.userRole}</p>
                </div>
                <div>
                  <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>
                    Finish Date
                  </p>
                  <p>{project.finishDate.toDateString()}</p>
                </div>
              </div>
              <div
                style={{
                  backgroundColor: "#404040",
                  borderRadius: 9999,
                  overflow: "auto"
                }}
              >
                <div
                  style={{
                    width: `${project.progress * 100}%`,
                    backgroundColor: "green",
                    padding: "4px 0",
                    textAlign: "center"
                  }}
                >
                  {project.progress * 100}%
                </div>
              </div>
            </div>
          </div>
          <ProjectTasksList todos={todos} onSaveTodo={handleSaveTodo} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", rowGap: 30, height: "100%", minHeight: "500px" }}>
          <bim-grid ref={viewerGrid} className="viewer-grid" style={{ flexGrow: 1 }}></bim-grid>
        </div>
      </div>
      {isEditing && (
        <dialog id="edit-project-modal" open style={{ zIndex: 100, position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
          <form onSubmit={(e) => { e.preventDefault(); handleEditSave(); }}>
            <h2>Edit Project</h2>
            <div className="input-list">
              <div className="form-field-container">
                <label><span className="material-icons-round">apartment</span>Name</label>
                <input type="text" value={editName} onChange={e => setEditName(e.target.value)} required />
              </div>
              <div className="form-field-container">
                <label><span className="material-icons-round">subject</span>Description</label>
                <textarea value={editDescription} onChange={e => setEditDescription(e.target.value)} cols={30} rows={3} required />
              </div>
              <div className="form-field-container">
                <label><span className="material-icons-round">not_listed_location</span>Status</label>
                <select value={editStatus} onChange={e => setEditStatus(e.target.value as ProjectStatus)}>
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="finished">Finished</option>
                </select>
              </div>
              <div className="form-field-container">
                <label><span className="material-icons-round">person</span>Role</label>
                <select value={editRole} onChange={e => setEditRole(e.target.value as UserRole)}>
                  <option value="architect">Architect</option>
                  <option value="engineer">Engineer</option>
                  <option value="developer">Developer</option>
                </select>
              </div>
              <div className="form-field-container">
                <label><span className="material-icons-round">attach_money</span>Cost</label>
                <input type="number" value={editCost} onChange={e => setEditCost(Number(e.target.value))} />
              </div>
              <div style={{ display: "flex", margin: "10px 0px 10px auto", columnGap: "10px" }}>
                <button type="button" onClick={() => setIsEditing(false)} style={{ backgroundColor: "transparent" }}>Cancel</button>
                <button type="submit" style={{ backgroundColor: "rgb(18, 145, 18)" }}>Save</button>
              </div>
            </div>
          </form>
        </dialog>
      )}
    </div>
  );
}