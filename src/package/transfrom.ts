import { EdgeStructure, NodeStructure } from "./type/type";
import { NodeConfig, NodeDefaultConfig } from './type/node';
import {nodeConfig} from "./shape.config";
import { mxPoint } from 'mxgraph'
import MyGraph from "./graph";
import { EdgeConfig } from "./type/edge";

export const transfromNode = (node: NodeStructure): NodeConfig => {
  const config = nodeConfig.find(ele => ele.shapeType === node.shapeType) as NodeDefaultConfig
  if (!config) {
    console.log(node.shapeType)
  }
  return {
    id: node.id,
    width: Number(node.width) ? Number(node.width) : config.width,
    height:  Number(node.height) ? Number(node.height) : config.height,
    x: Number(node.x),
    y: Number(node.y),
    style: `shape=${node.shapeType}`,
    type: 'vertex',
    parentId: node.combo ? node.combo.id : undefined,
    info: {
      name: node.name,
      description: node.description,
      shapeType: node.shapeType,
      code: config.code,
      referers: node.referers,
      attributes: node.attributes,
      behaviors: node.behaviors,
      type: node.type,
      sourceId: node.referers && node.referers.length > 0 ? node.referers[0].fromId : undefined,
    }
  }
}

export const transfromEdge = (edge: EdgeStructure, graph: MyGraph): EdgeConfig|undefined => {
  const cells = graph.getAllCells()
  const source = cells.find(ele => ele.id === edge.fromId)
  const target = cells.find(ele => ele.id === edge.toId)
  if (source && target) {
    // const { fromAnchor, toAnchor} = edge
    const fromAnchor = Number(edge.fromAnchor)
    const toAnchor = Number(edge.toAnchor)
    const fromPoint = (graph.cellRenderer.getShape(source.info.shapeType) as any).prototype.constraints[fromAnchor].point as mxPoint
    const toPonit = (graph.cellRenderer.getShape(target.info.shapeType) as any).prototype.constraints[toAnchor].point as mxPoint
    const { style } = graph.getLineStyle(edge.lineShapeType)
    return {
      source,
      target,
      id: edge.id,
      shapeType: edge.lineShapeType,
      style: `${style}exitX=${fromPoint.x};exitY=${fromPoint.y};exitDx=0;exitDy=0;entryX=${toPonit.x};entryY=${toPonit.y};entryDx=0;entryDy=0;`,
      value: edge.lab,
    }
  }
}
