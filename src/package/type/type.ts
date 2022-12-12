import { mxCell } from "mxgraph"
import MyGraph from "../graph"

export type ItemType = 'vertex'|'edge'
export interface NodeConfig extends Record<string, any>{
  id: string
  width: number
  height: number
  x: number
  y: number
  style: string
  type: ItemType
  parentId?: string
  source?: mxCell
  target?: mxCell
}

export interface SidebarNode {
  name: string
  style: string
  type: ItemType
  width: number
  height: number
  info?: Record<string, any>
  // nodeId?: string
}


export interface SidebarHTMLItem {
  html: string
  width: number
  height: number
  cell: mxCell
  code: string
}

export interface DrawInstance {
  graph: MyGraph
}