import mx from "./factory"
// import XMLParser from "react-xml-parser"
// import myStyle from "./defaultStyle"
import { NodeConfig, NodeInfo } from "./type/node"
import {
  mxCell as typeMxCell,
  mxConnectionConstraint as typeMxConnectionConstraint,
  mxEventObject as typeMxEventObject,
  mxPopupMenuHandler,
} from "mxgraph"
import { EdgeConfig } from "./type/edge"
import { Action } from "./actions"
import { nanoid } from "nanoid"
import { message } from "ant-design-vue"

const {
  mxGraph,
  mxRubberband,
  mxEventObject,
  mxGeometry,
  mxKeyHandler,
  mxGraphHandler,
  mxEvent,
  mxConstants,
  mxEdgeHandler,
  mxCell,
  mxCellState,
  mxShape,
  mxPoint,
  mxConnectionConstraint,
} = mx
class MyGraph extends mxGraph {
  gridColor: string = "#d0d0d0"
  showGrid: boolean = true
  // rubberband = new mxRubberband(this)
  keyHandler = new mxKeyHandler(this)
  currentEdge?: {
    style: string
    panelId: string
  }
  actions: Action
  createVertexStatus: boolean = false
  createEdgeStatus: boolean = false
  nodeProps: any
  edgeProps: any
  lineStyle?: Record<string, string>[]
  cellRightClick?: (cells: typeMxCell[], menu: mxPopupMenuHandler) => void
  handleAddVertex?: (
    cell: typeMxCell,
    x: number,
    y: number,
    target: typeMxCell
  ) => void
  handleDeleteCell?: (cell: typeMxCell) => void
  handleAddEdge?: (cell: typeMxCell) => void
  handleDropIn?: (target: typeMxCell, cells: typeMxCell[]) => void
  handleDropOut?: (target: typeMxCell, cells: typeMxCell[]) => void
  handleSizeChange?: (props: {
    x: string
    y: string
    width: string
    height: string
    id: string
  }) => void
  beforeDeleteCell?: (cell: typeMxCell) => boolean
  // menuClick?:()
  constructor(container: HTMLElement) {
    super(container)
    this.actions = new Action(this)
    this.actions.init()
  }
  _init() {
    //右键平移
    this.setPanning(true)
    this._setAnchors()
    this._initKeyHandler()
    this._setDefaultConfig()
    this._setDefaultEdgeStyle()
    this._rightClickMenu()
    this._initEvent()
    this._setDrop()
    this.setGrid()
  }
  _setDefaultConfig() {
    this.setConnectable(true)
    mxEvent.disableContextMenu(this.container)
    // // 固定节点大小
    // this.setCellsResizable(false)
    // // 编辑时按回车键不换行，而是完成输入
    // this.setEnterStopsCellEditing(true)
    // // 编辑时按 escape 后完成输入
    // mxCellEditor.prototype.escapeCancelsEditing = false
    // // 失焦时完成输入
    // mxCellEditor.prototype.blurEnabled = true
    // // 禁止节点折叠
    // this.foldingEnabled = false
    // // 文本包裹效果必须开启此配置
    this.setHtmlLabels(true)

    // // 拖拽过程对齐线
    mxGraphHandler.prototype.guidesEnabled = true

    // // 禁止游离线条
    this.setDisconnectOnMove(false)
    // this.setAllowDanglingEdges(false)
    // mxGraph.prototype.isCellMovable=function = cell => !cell.edge

    // // 禁止调整线条弯曲度
    this.setCellsBendable(false)

    // // 禁止从将label从线条上拖离
    mxGraph.prototype.edgeLabelsMovable = false
    // 样式
    // const style = new XMLParser().parseFromString(myStyle)
    // style.children.forEach((ele: any) => {
    //   const node: { [k: string]: string } = {}
    //   ele.children.forEach((element: any) => {
    //     node[element.attributes.as] = element.attributes.value
    //   })
    //   this.getStylesheet().putCellStyle(ele.attributes.as, node)
    // })
  }
  _setDefaultEdgeStyle() {
    const style = this.getStylesheet().getDefaultEdgeStyle()
    Object.assign(style, {
      // [mxConstants.STYLE_ROUNDED]: true, // 设置线条拐弯处为圆角
      [mxConstants.STYLE_STROKEWIDTH]: "2",
      [mxConstants.STYLE_STROKECOLOR]: "#333333",
      // [mxConstants.STYLE_EDGE]: mxConstants.EDGESTYLE_ORTHOGONAL,
      [mxConstants.STYLE_FONTCOLOR]: "#33333",
      [mxConstants.STYLE_EDITABLE]: "0",
      // [mxConstants.STYLE_LABEL_BACKGROUNDCOLOR]: '#ffa94d',
    })
    style[mxConstants.STYLE_EDGE] = "orthogonalEdgeStyle"
    // 设置拖拽线的过程出现折线，默认为直线
    this.connectionHandler.createEdgeState = () => {
      const edge = this.createEdge(
        this.defaultParent,
        null,
        "",
        new mxCell(),
        new mxCell()
      )
      edge.connectable = true
      return new mxCellState(this.view, edge, this.getCellStyle(edge))
    }
  }
  _initKeyHandler() {
    // for (const key in this.actions.action) {
    //   if (Object.hasOwnProperty.call(this.actions.action, key)) {
    //     const action = this.actions.action[key]
    //     const shortcutKey = action.shortcutKey
    //     if (shortcutKey) {
    //       const keyArray = shortcutKey.split('+')
    //       const isCtrl = keyArray.includes(ctrlKey)
    //       const isShift = keyArray.includes('Shift')
    //       const isDownKey = keyArray[keyArray.length - 1] === '加' ? '+' : keyArray[keyArray.length - 1]
    //       const downKey = keyCode[isDownKey]
    //       this.keyHandler.bindAction(downKey, isCtrl, key, isShift)
    //     }
    //   }
    // }
  }
  _setDrop() {
    this.setDropEnabled(true)
    this.isValidDropTarget = function (target, cells, evt) {
      if (target.info && target.info.type === "combo") {
        return true
      }
      return false
    }
  }
  _initEvent() {
    console.log("event")
    this.addListener(
      mxEvent.CELLS_RESIZED,
      (graph: MyGraph, eventObject: typeMxEventObject) => {
        const cells: typeMxCell[] = eventObject.getProperty("cells")
        if (this.handleSizeChange) {
          const props = {
            x: String(cells[0].geometry.x),
            y: String(cells[0].geometry.y),
            width: String(cells[0].geometry.width),
            height: String(cells[0].geometry.height),
            id: cells[0].id,
          }
        }
      }
    )
  }
  _setAnchors() {
    // 禁止从节点中心拖拽出线条
    this.connectionHandler.isConnectableCell = () => false
    mxEdgeHandler.prototype.isConnectableCell = () => false

    // hover时显示连接节点
    mxGraph.prototype.getAllConnectionConstraints = (terminal) => {
      if (terminal != null && terminal.shape != null) {
        if (terminal.shape.stencil != null) {
          if (terminal.shape.stencil != null) {
            return terminal.shape.stencil.constraints
          }
        } else if (terminal.shape.constraints != null) {
          return terminal.shape.constraints
        }
      }

      return []
    }

    //设计连接节点
    mxShape.prototype.constraints = [
      new mxConnectionConstraint(new mxPoint(0, 0), true),
      new mxConnectionConstraint(new mxPoint(0, 1), true),
      new mxConnectionConstraint(new mxPoint(1, 0), true),
      new mxConnectionConstraint(new mxPoint(1, 1), true),
      new mxConnectionConstraint(new mxPoint(0.25, 0), true),
      new mxConnectionConstraint(new mxPoint(0.5, 0), true),
      new mxConnectionConstraint(new mxPoint(0.75, 0), true),
      new mxConnectionConstraint(new mxPoint(0, 0.25), true),
      new mxConnectionConstraint(new mxPoint(0, 0.5), true),
      new mxConnectionConstraint(new mxPoint(0, 0.75), true),
      new mxConnectionConstraint(new mxPoint(1, 0.25), true),
      new mxConnectionConstraint(new mxPoint(1, 0.5), true),
      new mxConnectionConstraint(new mxPoint(1, 0.75), true),
      new mxConnectionConstraint(new mxPoint(0.25, 1), true),
      new mxConnectionConstraint(new mxPoint(0.5, 1), true),
      new mxConnectionConstraint(new mxPoint(0.75, 1), true),
    ]
  }
  _rightClickMenu() {
    this.popupMenuHandler.autoExpand = true
    this.popupMenuHandler.factoryMethod = (menu, cell, evt) => {
      const cells = this.getSelectionCells()
      if (cells.length > 0) {
        if (cells.length === 1) {
          const cell = cells[0]
          if (!cell.edge) {
            menu.addItem(
              "特性",
              undefined,
              this.nodeProps.open.bind(this, cells[0])
            )
          } else {
            menu.addItem(
              "特性",
              undefined,
              this.edgeProps.open.bind(this, cells[0])
            )
          }
        }
        if (this.cellRightClick) {
          this.cellRightClick(cells, menu)
        }
        menu.addItem(
          "删除",
          undefined,
          this.actions.get("delete").func.bind(this, this)
        )
      }
    }
  }
  /**
   * 创建背景grid svg
   * @param {string}} color grid的颜色
   */
  createSvgGrid() {
    var tmp = this.gridSize * this.getView().scale
    const color = this.gridColor
    while (tmp < 4) {
      tmp *= 2
    }

    var tmp2 = 4 * tmp

    // Small grid lines
    var d = []

    for (var i = 1; i < 4; i++) {
      var tmp3 = i * tmp
      d.push(
        "M 0 " +
          tmp3 +
          " L " +
          tmp2 +
          " " +
          tmp3 +
          " M " +
          tmp3 +
          " 0 L " +
          tmp3 +
          " " +
          tmp2
      )
    }

    // KNOWN: Rounding errors for certain scales (eg. 144%, 121% in Chrome, FF and Safari). Workaround
    // in Chrome is to use 100% for the svg size, but this results in blurred grid for large diagrams.
    var size = tmp2
    var svg =
      '<svg width="' +
      size +
      '" height="' +
      size +
      '" xmlns="' +
      mxConstants.NS_SVG +
      '">' +
      '<defs><pattern id="grid" width="' +
      tmp2 +
      '" height="' +
      tmp2 +
      '" patternUnits="userSpaceOnUse">' +
      '<path d="' +
      d.join(" ") +
      '" fill="none" stroke="' +
      color +
      '" opacity="0.2" stroke-width="1"/>' +
      '<path d="M ' +
      tmp2 +
      " 0 L 0 0 0 " +
      tmp2 +
      '" fill="none" stroke="' +
      color +
      '" stroke-width="1"/>' +
      '</pattern></defs><rect width="100%" height="100%" fill="url(#grid)"/></svg>'

    return svg
  }
  /**设置Grid */
  setGrid() {
    const svg = this.createSvgGrid()
    let image = ""
    image = unescape(encodeURIComponent(svg))
    image = btoa(image)
    image = "url(" + "data:image/svg+xml;base64," + image + ")"
    this.container.style.backgroundImage = `${image}`
  }
  insertEdgeByConfig(cfg: EdgeConfig) {
    const cell = this.insertEdge(
      this.defaultParent,
      cfg.id ? cfg.id : null,
      cfg.value,
      cfg.source as typeMxCell,
      cfg.target as typeMxCell,
      cfg.style
    )
    return cell
  }
  insertVertetByConfig(cfg: NodeConfig) {
    let parent = this.getDefaultParent()
    if (cfg.parentId) {
      parent = this.findById(cfg.parentId) as typeMxCell
    }
    const cell = this.insertVertex(
      parent,
      cfg.id,
      "",
      cfg.x,
      cfg.y,
      cfg.width,
      cfg.height,
      cfg.style,
      undefined,
      cfg.info
    )
    return cell
  }
  insertVertex(
    parent: typeMxCell,
    id: string | null,
    value: any,
    x: number,
    y: number,
    width: number,
    height: number,
    style?: string | undefined,
    relative?: boolean | undefined,
    info?: NodeInfo
  ) {
    var vertex = this.createVertex(
      parent,
      id,
      value,
      x,
      y,
      width,
      height,
      style,
      relative
    )
    if (info) vertex.info = info
    return this.addCell(vertex, parent)
  }
  getAllCells(): typeMxCell[] {
    const cells: typeMxCell[] = []
    for (const key in this.model.cells) {
      if (Object.prototype.hasOwnProperty.call(this.model.cells, key)) {
        const element = this.model.cells[key]
        if (key !== "0" && key !== "1") {
          cells.push(element)
        }
      }
    }
    return cells
  }
  sidebarToGraph(
    dragCell: typeMxCell,
    x: number,
    y: number,
    target: typeMxCell
  ) {
    try {
      const hasSource = dragCell.info.sourceId
        ? this.findSourceCell(dragCell.info.sourceId)
        : false
      if (hasSource) {
        message.error("重复使用引用数据")
        return
      }
      dragCell.id = nanoid()
      this.createVertexStatus = true
      const cell = this.importCells([dragCell], x, y, target)
      this.setSelectionCells(cell)
      this.createVertexStatus = false
      console.log(cell[0])
      this.handleAddVertex && this.handleAddVertex(cell[0], x, y, target)
    } finally {
      this.getModel().endUpdate()
    }
  }
  findSourceCell(id: string) {
    const cells = this.getAllCells()
    const cell = cells.find((ele) => ele.info && ele.info.sourceId === id)
    return cell
  }
  deleteCells(cells: typeMxCell[]) {
    if (cells.length > 0) {
      for (let i = 0; i < cells.length; i++) {
        const ele = cells[i]
        let flag = true
        if (this.beforeDeleteCell) {
          flag = this.beforeDeleteCell(ele)
        }
        if (flag) {
          this.removeCells([ele])
          this.handleDeleteCell && this.handleDeleteCell(ele)
        }
      }
    }
  }
  findById(id: string) {
    const cells = this.getAllCells()
    const cell = cells.find((ele) => ele.id === id)
    return cell
  }
  moveCells(
    cells: typeMxCell[],
    dx: number,
    dy: number,
    clone: boolean,
    target?: typeMxCell | undefined,
    evt?: Event | undefined,
    mapping?: any
  ) {
    cells = mxGraph.prototype.moveCells.call(
      this,
      cells,
      dx,
      dy,
      clone,
      target,
      evt,
      mapping
    )
    if (target) {
      if (target.id === "1") {
        this.handleDropOut && this.handleDropOut(target, cells)
      } else {
        this.handleDropIn && this.handleDropIn(target, cells)
      }
    }
    if (!this.createVertexStatus) {
      cells.forEach((ele) => {
        if (ele.vertex && this.handleSizeChange) {
          const props = {
            id: ele.id,
            x: String(ele.geometry.x),
            y: String(ele.geometry.y),
            width: String(ele.geometry.width),
            height: String(ele.geometry.height),
          }
          this.handleSizeChange(props)
          // editNode({
          //   id: ele.id,
          //   x: String(ele.geometry.x),
          //   y: String(ele.geometry.y),
          // })
        }
      })
    }
    return cells
  }
  insertEdge(
    parent: typeMxCell,
    id: string | null,
    value: any,
    source: typeMxCell,
    target: typeMxCell,
    style?: string | undefined
  ): typeMxCell {
    let edge = this.createEdge(parent, id, value, source, target, style)
    edge = this.addEdge(edge, parent, source, target)
    if (!this.createEdgeStatus) {
      this.handleAddEdge && this.handleAddEdge(edge)
    }
    return edge
  }
  getShapeConstraints(cell: typeMxCell) {
    const style = this.getCellStyle(cell)
    if (style) {
      const shape = this.cellRenderer.getShape(style.shape)
      const constraints: typeMxConnectionConstraint[] = (shape as any).prototype
        .constraints
      return constraints
    }
  }
  findConstranintIndex(x: number, y: number, cell: typeMxCell) {
    const constraints = this.getShapeConstraints(cell)
    if (constraints) {
      for (let i = 0; i < constraints.length; i++) {
        const constraint = constraints[i]
        if (constraint.point.x === x && constraint.point.y === y) {
          return i
        }
      }
    }
    return -1
  }
  /**
   * 节点是否可以拖动大小
   * @param cell 节点
   * @returns boolean
   */
  isCellResizable(cell: typeMxCell) {
    console.log(cell.info.type)
    if (cell.info.type === "combo") return true
    return false
  }
  getLineStyle(type: string) {
    const styleConfig = this.lineStyle?.find(
      (ele) => ele.shapeType === type
    ) as Record<string, string>
    let style = ""
    if (styleConfig) {
      const keys = Object.keys(styleConfig)
      const values = Object.values(styleConfig)
      keys.forEach((key, index) => {
        if (key === "code") return
        style += `${key}=${values[index]};`
      })
    }
    return {
      style,
      code: styleConfig.code,
    }
  }
}

export default MyGraph
