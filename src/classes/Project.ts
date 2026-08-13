import { v4 as uuidv4 } from 'uuid'

const iconColors = ["#ca8134", "#468C98", "#B76D68", "#6C8448", "#725AC1", "#CA3CFF"]

export type ProjectStatus = "pending" | "active" | "finished"
export type UserRole = "architect" | "engineer" | "developer"

export interface IToDo {
  id: string
  name: string
  date: Date
  status: "pending" | "in-progress" | "done"
  priority: "low" | "medium" | "high"
}

export interface IProject {
  name: string
  description: string
  status: ProjectStatus
  userRole: UserRole
  finishDate: Date
  iconColor?: string
  todos?: IToDo[]
  smartViews?: Record<string, any>
}

export class Project implements IProject {
	//To satisfy IProject
  name: string
	description: string
	status: "pending" | "active" | "finished"
	userRole: "architect" | "engineer" | "developer"
  finishDate: Date
  iconColor: string = iconColors[Math.floor(Math.random() * iconColors.length)]
  
  //Class internals
  cost: number = 0
  progress: number = 0
  id: string
  todos: IToDo[] = []
  smartViews: Record<string, any> = {}

  constructor(data: IProject, id = uuidv4()) {
    for (const key in data) {
      this[key] = data[key]
    }
    this.id = id
  }
}