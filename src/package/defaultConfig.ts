import mx from './factory'
import MyGraph from './graph'
const {
  mxGraphModel,
  mxCell,
  mxConnectionHandler,
  mxConstants,
  mxClient,
  mxImage,
  mxConstraintHandler,
  mxVertexHandler,
  mxCellHighlight,
  mxEdgeHandler,
  mxPerimeter,
  mxStyleRegistry
} = mx
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

mxConstraintHandler.prototype.pointImage = new mxImage(
  'data:image/svg+xml;base64,PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj48c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI1cHgiIGhlaWdodD0iNXB4IiB2ZXJzaW9uPSIxLjEiPjxwYXRoIGQ9Im0gMCAwIEwgNSA1IE0gMCA1IEwgNSAwIiBzdHJva2U9IiMyOWI2ZjIiLz48L3N2Zz4=',
  5,
  5
)

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

export const ctrlKey = mxClient.IS_MAC ? 'Cmd' : 'Ctrl'

export const keyCode: { [k: string]: number } = {
  A: 65,
  J: 74,
  S: 83,
  '1': 49,
  B: 66,
  K: 75,
  T: 84,
  '2': 50,
  C: 67,
  L: 76,
  U: 85,
  '3': 51,
  D: 68,
  M: 77,
  V: 86,
  '4': 52,
  E: 69,
  N: 78,
  W: 87,
  '5': 53,
  F: 70,
  O: 79,
  X: 88,
  '6': 54,
  G: 71,
  P: 80,
  Y: 89,
  '7': 55,
  H: 72,
  Q: 81,
  Z: 90,
  '8': 56,
  I: 73,
  R: 82,
  '0': 48,
  '9': 57,
  Delete: 46,
  '-': 189,
  '+': 187
}

export function clone(item: any) {
  if (!item) {
    return item
  } // null, undefined values check

  const types = [Number, String, Boolean]
  let result: any = undefined

  // normalizing primitives if someone did new String('aaa'), or new Number('444');
  types.forEach(function (type) {
    if (item instanceof type) {
      result = type(item)
    }
  })

  if (typeof result == 'undefined') {
    if (Object.prototype.toString.call(item) === '[object Array]') {
      result = []
      item.forEach(function (child: any, index: number) {
        result[index] = clone(child)
      })
    } else if (typeof item == 'object') {
      // testing that this is DOM
      if (item.nodeType && typeof item.cloneNode == 'function') {
        result = item.cloneNode(true)
      } else if (!item.prototype) {
        // check that this is a literal
        if (item instanceof Date) {
          result = new Date(item)
        } else {
          // it is an object literal
          result = {}
          for (var i in item) {
            result[i] = clone(item[i])
          }
        }
      } else {
        // depending what you would like here,
        // just keep the reference, or create new object
        if (false && item.constructor) {
          // would not advice to do that, reason? Read below
          result = new item.constructor()
        } else {
          result = item
        }
      }
    } else {
      result = item
    }
  }

  return result
}
mxPerimeter
//lifeline 线上链接点自动吸附
//style设置perimeter=lifelinePerimeter;
mxPerimeter.LifelinePerimeter = function (bounds, vertex, next, orthogonal) {
  var size = 60

  if (vertex != null) {
    size = mx.mxUtils.getValue(vertex.style, 'size', size) * vertex.view.scale
  }

  var sw =
    (parseFloat(vertex.style[mx.mxConstants.STYLE_STROKEWIDTH] || 1) *
      vertex.view.scale) /
      2 -
    1

  if (next.x < bounds.getCenterX()) {
    sw += 1
    sw *= -1
  }
  return new mx.mxPoint(
    bounds.getCenterX() + sw,
    Math.min(bounds.y + bounds.height, Math.max(bounds.y + size, next.y))
  )
}
mxStyleRegistry.putValue('lifelinePerimeter', mxPerimeter.LifelinePerimeter)
