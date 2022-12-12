import { message } from 'ant-design-vue'
import mx from './factory'
import MyGraph from './graph'
const { mxGraphModel, mxCell, mxConnectionHandler, mxConstants, mxClient, mxImage, mxConstraintHandler, mxVertexHandler, mxCellHighlight, mxEdgeHandler } = mx
const connect = mxConnectionHandler.prototype.connect
mxConnectionHandler.prototype.connect = function (source, target) {
  if (!target || !source) return
  if (!(this.graph as MyGraph).currentEdge) {
    message.error('请选择连线类型')
    return
  } else {
    this.edgeState.cell.style = (this.graph as MyGraph).currentEdge?.style as string
  }
  connect.apply(this, arguments as any)
}
//默认的cells[key]中key !== cell.id
// mxGraphModel.prototype.getCell = function (id) {
//   if (this.cells) {
//     const cells: typeMxCell[] = Object.values(this.cells)
//     const cell = cells.find(ele => ele.id === id)
//     return cell
//   }
// }

mxConstants.HANDLE_FILLCOLOR = '#29b6f2'
mxConstants.HANDLE_STROKECOLOR = '#0088cf'
mxConstants.VERTEX_SELECTION_COLOR = '#00a8ff'
mxConstants.OUTLINE_COLOR = '#00a8ff'
mxConstants.OUTLINE_HANDLE_FILLCOLOR = '#99ccff'
mxConstants.OUTLINE_HANDLE_STROKECOLOR = '#00a8ff'
mxConstants.CONNECT_HANDLE_FILLCOLOR = '#cee7ff'
mxConstants.EDGE_SELECTION_COLOR = '#00a8ff'
mxConstants.DEFAULT_VALID_COLOR = '#00a8ff'
mxConstants.LABEL_HANDLE_FILLCOLOR = '#cee7ff'
mxConstants.GUIDE_COLOR = '#0088cf'
mxConstants.HIGHLIGHT_OPACITY = 30
mxConstants.HIGHLIGHT_SIZE = 5


mxConstraintHandler.prototype.pointImage = new mxImage('data:image/svg+xml;base64,PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj48c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI1cHgiIGhlaWdodD0iNXB4IiB2ZXJzaW9uPSIxLjEiPjxwYXRoIGQ9Im0gMCAwIEwgNSA1IE0gMCA1IEwgNSAwIiBzdHJva2U9IiMyOWI2ZjIiLz48L3N2Zz4=', 5, 5)

mxEdgeHandler.prototype.snapToTerminals = true

mxConnectionHandler.prototype.outlineConnect = true
mxCellHighlight.prototype.keepOnTop = true
mxVertexHandler.prototype.parentHighlightEnabled = true

mxEdgeHandler.prototype.parentHighlightEnabled = true
mxEdgeHandler.prototype.dblClickRemoveEnabled = true
mxEdgeHandler.prototype.straightRemoveEnabled = true
mxEdgeHandler.prototype.virtualBendsEnabled = true
mxEdgeHandler.prototype.mergeRemoveEnabled = true
mxEdgeHandler.prototype.manageLabelHandle = true
mxEdgeHandler.prototype.outlineConnect = true

export const ctrlKey = (mxClient.IS_MAC) ? 'Cmd' : 'Ctrl'


export const keyCode: { [k: string]: number } = {
  'A': 65,
  'J': 74,
  'S': 83,
  '1': 49,
  'B': 66,
  'K': 75,
  'T': 84,
  '2': 50,
  'C': 67,
  'L': 76,
  'U': 85,
  '3': 51,
  'D': 68,
  'M': 77,
  'V': 86,
  '4': 52,
  'E': 69,
  'N': 78,
  'W': 87,
  '5': 53,
  'F': 70,
  'O': 79,
  'X': 88,
  '6': 54,
  'G': 71,
  'P': 80,
  'Y': 89,
  '7': 55,
  'H': 72,
  'Q': 81,
  'Z': 90,
  '8': 56,
  'I': 73,
  'R': 82,
  '0': 48,
  '9': 57,
  'Delete': 46,
  '-': 189,
  '+': 187,
}