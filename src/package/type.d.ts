import { Action } from './actions';
import MyGraph from './graph';
declare global {
  interface Window {
    graph: MyGraph;
  }
  
}
declare module "mxgraph" {
  export interface mxKeyHandler {
    bindAction: (
      downKey: number,
      isCtrl: boolean,
      key: string,
      isShift: boolean
    ) => void
    actions: Action
  }
  export interface mxConnectionHandler {
    originConnect: (
      source: mxCell,
      target: mxCell,
      evt: MouseEvent,
      dropTarget: mxCell
    ) => void
    waypoints: any[]
    originalPoint: any
    currentPoint: any
  }
  export interface mxSvgCanvas2D {
    text(
      x: number,
      y: number,
      w: number,
      h: number,
      str: string,
      align?: string,
      valign?: string,
      wrap?: string,
      format?: string,
      overflow?: string,
      clip?: string,
      rotation?: number,
      dir?: string
    ): void
    image(
      x: number,
      y: number,
      w: number,
      h: number,
      src: string,
      aspect?: boolean,
      flipH?: boolean,
      flipV?: boolean
    )
  }
}