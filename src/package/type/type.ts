import { mxCell, mxPopupMenuHandler } from 'mxgraph'
import MyGraph from '../graph'

export type ItemType = 'vertex' | 'edge'
export interface NodeConfig extends Record<string, any> {
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
  value?: string
}

export interface SidebarNodeConfig {
  name: string
  style: string
  type: ItemType
  width: number
  height: number
  value?: string
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

export interface SidebarHTML {
  name: string
  nodes?: SidebarHTMLItem[]
  children?: SidebarHTML[]
}

export interface DrawInstance {
  graph: MyGraph
}

export interface ToolbarProps {
  graph?: MyGraph
  toolbar?: string[]
}

export interface SidebarProps {
  graph?: MyGraph
  nodes: SidebarNode[]
}

export interface SidebarNode {
  name: string
  nodes?: SidebarNodeConfig[]
  children?: SidebarNode[]
}

export interface DrawProps extends ToolbarProps, SidebarProps {
  hideSidebar?: boolean
  handleAddVertex?: (cell: mxCell, x: number, y: number, target: mxCell) => void
  handleDeleteCell?: (cell: mxCell) => void
  handleAddEdge?: (cell: mxCell) => void
  handleMoveCell?: (cell: mxCell) => void
  cellRightClick?: (cells: mxCell[], menu: mxPopupMenuHandler) => void
  beforeDeleteCell?: (cell: mxCell) => boolean
  beforeAddVertex?: (cell: mxCell) => boolean
  outlineMap?: boolean
}
