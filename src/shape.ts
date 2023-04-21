import mx from './package/factory'
import { mxAbstractCanvas2D, mxRectangle, mxSvgCanvas2D } from 'mxgraph'
const {
  mxRectangleShape,
  mxCellRenderer,
  mxCylinder,
  mxUtils,
  mxSwimlane,
  mxConstants
} = mx
class Folder extends mxSwimlane {
  tabWidth = 60
  tabHeight = 20
  arcSize = 0.1
  constructor(
    bounds: mxRectangle,
    fill: string,
    stroke: string,
    strokewidth?: number | undefined
  ) {
    super(bounds, fill, stroke, strokewidth)
  }
  paintVertexShape(
    c: mxSvgCanvas2D,
    x: number,
    y: number,
    w: number,
    h: number
  ) {
    const type = mxUtils.getValue(this.style, 'type', '')
    var start = this.getTitleSize()
    var fill = mxUtils.getValue(
      this.style,
      mxConstants.STYLE_SWIMLANE_FILLCOLOR,
      mxConstants.NONE
    )
    var swimlaneLine =
      mxUtils.getValue(this.style, mxConstants.STYLE_SWIMLANE_LINE, 1) == 1
    var r = 0

    if (this.isHorizontal()) {
      start = Math.min(start, h)
    } else {
      start = Math.min(start, w)
    }

    c.translate(x, y)

    if (!this.isRounded) {
      this.paintSwimlane(c, x, y, w, h, start, fill, swimlaneLine)
    } else {
      r = this.getArcSize(w, h, start)
      r = Math.min((this.isHorizontal() ? h : w) - start, Math.min(start, r))
      this.paintRoundedSwimlane(c, x, y, w, h, start, r, fill, swimlaneLine)
    }

    var sep = mxUtils.getValue(
      this.style,
      mxConstants.STYLE_SEPARATORCOLOR,
      mxConstants.NONE
    )
    this.paintSeparator(c, x, y, w, h, start, sep)
    c.setFontColor('#fff')
    c.setFontSize(18)
    c.text(w / 2, start / 4, w, start, `《 ${type} 》`, 'center', 'middle')
    c.setFontColor('#fff')
    c.text(
      w / 2,
      start / 1.5,
      w,
      h,
      this.state?.cell.info ? this.state?.cell.info.name : '',
      'center',
      'middle'
    )
    if (this.glass) {
      c.setShadow(false)
      this.paintGlassEffect(c, 0, 0, w, start, r)
    }
  }
}
mxCellRenderer.registerShape('folder', Folder)

export {}
