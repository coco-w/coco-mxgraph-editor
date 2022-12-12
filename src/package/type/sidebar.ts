import { mxCell } from 'mxgraph';
import { ITEM_TYPE } from "./type"


export interface SidebarItem {
  id: string
  name: string
  categoryId: string
  code: string
  fillColor: string|null
  idx: number
  isContainer: string
  shapeId: string
  shapeType: string
  strokeColor: string|null
  viewId: string
  type: ITEM_TYPE
  // nodeId?: string
}

export interface ImportData {
  source: string
  target: string
  name?: string
}

export interface SidebarHTMLItem {
  html: string
  width: number
  height: number
  cell: mxCell
  id: string
  code: string
}