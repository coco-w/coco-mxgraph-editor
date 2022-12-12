import { mxCell, mxPopupMenuHandler } from "mxgraph"
import { ImportData } from "./sidebar"

export type ITEM_TYPE = "combo" | "node" | "edge" | "vedge"
export interface NodeStructure {
  id: string
  content: string
  panelId: string
  wrapperId: string
  x: string
  y: string
  name: string
  description: string
  style: string
  width: string
  height: string
  shapeType: string
  type: ITEM_TYPE
  attributes: NodePropertyStructure[]
  referers: NodeRefererStructure[]
  behaviors: NodeStructure[]
  combo: NodeStructure | null
}

export interface ListImpl<T> {
  current: number
  pages: number
  records: Array<T>
  size: number
  total: number
}

export interface EdgeStructure {
  id: string
  fromAnchor: string
  fromId: string
  toId: string
  toAnchor: string
  panelId: string
  wrapperId: string
  lineShapeType: string
  lab: string
}


export interface NodePropertyStructure {
  code: string
  data: string
  id: string
  name: string
  nodeId: string
  nodeType: string
  util: string
  valueType: string
  editable: boolean
}


export interface WrapperStructure {
  /**1级文件夹id */
  categoryId: string,
  /**默认 */
  folderId: "1",
  id: string,
  name: string,
  /**默认 */
  type: "diagram",
  /**2级文件夹id */
  viewId: string
}

export interface RefererStructure {
  categroyId: string
  folderId: string
  viewId: string
  wrapperName: string
  source: string
  target: string
  opertion: 'link' | 'referer'
}

export interface RefererSQLStructure {
  description: string
  folderId: string
  fromId: string
  fromType: string
  fromWrapperId: string
  id: string
  lab: string
  toId: string
  toType: string
  toWrapperId: string
}

export interface NodeRefererStructure {
  description: null
  folderId: string
  fromId: string
  fromType: string
  fromWrapperId: string
  id: string
  lab: null
  toId: string
  toType: string
  toWrapperId: string
}

export interface DeriveStructure {
  accordId: string
  accordType: string
  fromId: string
  fromType: string
  id: string
  proofId: string
  proofType: string
  toId: string
  toType: string
}

export interface NodeStateStructure {
  id: string
  inId: string
  originalId: string
  outId: string
  paperId: string
  wrapperId: string
}

export interface EdgeEventStructure {
  // conditionPropertyId: string
  id: string
  items: {
    computer: string,
    conditionPropertyId: string,
    eventId: string,
    id: string,
    logical: string,
    ruleId: string
  }[]
  implement: string
  linePaperId: string
  tiggerPaperId: string
  wrapperId: string
}

export interface RuleStructure {
  id: string
  wrapperId: string
  folderId: string
  name: string
  conditionType: string
  expressionType: string
  description: string
  expression: any
}

interface api {
  add?<T>(data: T): T 
}

export interface EditorProps {
  menu?: (cells: mxCell[], menu: mxPopupMenuHandler) => void
  nodeProps: any
  edgeProps: any
  importDataType?: ImportData[]
  handles?: {
    handlecellRightClick?: (cells: mxCell[], menu: mxPopupMenuHandler) => void
    handleAddVertex?: (
      cell: mxCell,
      x: number,
      y: number,
      target: mxCell
    ) => void
    handleDeleteCell?: (cell: mxCell) => void
    handleAddEdge?: (cell: mxCell) => void
    handleDropIn?: (target: mxCell, cells: mxCell[]) => void
    handleDropOut?: (target: mxCell, cells: mxCell[]) => void
    handleSizeChange?: (props: {
      x: string
      y: string
      width: string
      height: string
      id: string
    }) => void
    beforeDeleteCell?: (cell: mxCell) => boolean
  }
  getData: (id: string) => Promise<{
    nodes: ListImpl<NodeStructure>
    edges: ListImpl<EdgeStructure>
    combos: ListImpl<NodeStructure>
  }>
}