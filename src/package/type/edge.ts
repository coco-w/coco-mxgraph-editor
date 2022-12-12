import { mxCell } from 'mxgraph'
export interface EdgeConfig {
  source?: mxCell
  target?: mxCell
  id?: string
  shapeType: string
  style: string
  value: string
}