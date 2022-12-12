import { NodePropertyStructure, NodeRefererStructure, NodeStructure, ITEM_TYPE } from "./type"

export interface NodeInfo {
  name: string
  description: string
  shapeType: string
  code: string
  referers?: NodeRefererStructure[]
  refererId?: string
  attributes: NodePropertyStructure[]
  type: ITEM_TYPE
  /**节点为引用数据时，引用id */
  sourceId?: string
  behaviors: NodeStructure[]
}

export interface NodeConfig {
  id: string
  width: number
  height: number
  x: number
  y: number
  style: string
  type: 'vertex'|'edge'
  parentId?: string,
  info: NodeInfo
}

export interface NodeDefaultConfig {
  type: 'node'|'edge'|'combo'
  shapeType: string
  width: number
  height: number
  code: string
  name: string
}