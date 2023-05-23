<template>
  <div>
    <drawVue
      :nodes="nodes"
      :toolbar="['undo', 'redo']"
      :outlineMap="true"
      ref="draw"
      :beforeAddVertex="beforeAddVertex"
    >
      <!-- <template #sidebar>asdasdasd</template> -->
    </drawVue>
  </div>
</template>

<script setup lang="ts">
import { mxCell, mxRectangle, mxSvgCanvas2D } from 'mxgraph'
import { onMounted, ref } from 'vue'
import drawVue from './package/draw.vue'
import mx from './package/factory'
import { SidebarNode, SidebarNodeConfig } from './package/type/type'
import './shape'
const nodes = ref<SidebarNode[]>([])
const draw = ref()
const { mxUtils, mxRectangleShape, mxEvent } = mx
mx.mxConnectionHandler.prototype.connect = function (
  source: mxCell,
  target: mxCell,
  evt: MouseEvent,
  dropTarget: mxCell
) {
  console.log('1111')
  this.originConnect.apply(this, arguments as any)
}

class TimeLine extends mxRectangleShape {
  size: number
  constructor(
    bounds: mxRectangle,
    fill: string,
    stroke: string,
    strokewidth?: number | undefined
  ) {
    super(bounds, fill, stroke, strokewidth)
    this.size = 60
  }
  paintBackground(
    c: mxSvgCanvas2D,
    x: number,
    y: number,
    w: number,
    h: number
  ) {
    const titleHeight = 40
    const codeHeight = 20
    const cell = this.state?.cell as mxCell
    const strokeColor = mxUtils.getValue(this.style, 'strokeColor', '#000000')
    const fillColor = mxUtils.getValue(this.style, 'fillColor', '#000000')
    const tag = mxUtils.getValue(this.style, 'tag', '#000000')
    const swimlaneFillColor = mxUtils.getValue(
      this.style,
      'swimlaneFillColor',
      '#cccccc'
    )
    //背景
    c.setFillColor('transparent')
    c.setStrokeColor('transparent')
    c.rect(x, y, w, h)
    c.fillAndStroke()
    //头部
    c.setFillColor(fillColor)
    c.setStrokeColor(strokeColor)
    c.rect(x, y, w, this.size)
    c.fillAndStroke()
    c.setFillColor(swimlaneFillColor)
    c.rect(x, y + codeHeight, w, titleHeight)
    c.fillAndStroke()
    c.setFontColor('#333')
    c.setFontSize(12)
    c.text(x + w / 2, y + 10, w, h, `《${tag}》`, 'center', 'middle')
    c.setFontColor('#fff')
    c.setFontSize(14)
    c.text(
      x + w / 2,
      y + 38,
      w,
      h,
      `${cell.info?.name ? cell.info?.name : cell.value}`,
      'center',
      'middle'
    )
    const size = Math.max(
      0,
      Math.min(h, parseFloat(mxUtils.getValue(this.style, 'size', this.size)))
    )

    if (size < h) {
      c.setDashed(true, true)
      c.begin()
      c.moveTo(x + w / 2, y + size)
      c.lineTo(x + w / 2, y + h)
      c.end()
      c.stroke()
    }
  }
  paintForeground(
    c: mxSvgCanvas2D,
    x: number,
    y: number,
    w: number,
    h: number
  ) {
    const size = Math.max(
      0,
      Math.min(h, parseFloat(mxUtils.getValue(this.style, 'size', this.size)))
    )
    mxRectangleShape.prototype.paintForeground.call(
      this,
      c,
      x,
      y,
      w,
      Math.min(h, size)
    )
  }
}

TimeLine.prototype.constraints = []

mx.mxCellRenderer.registerShape('ov6c_time_line', TimeLine)

onMounted(() => {
  nodes.value = [
    {
      name: '类型1',
      nodes: [
        {
          name: '能力域1233123123123123',
          style:
            'shape=ov6c_time_line;showLabel=0;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;outlineConnect=0;',
          value: '',
          type: 'vertex',
          width: 100,
          height: 200,
          info: {
            name: '能力域',
            nodeType: 'ability_field'
          }
        },
        {
          name: '能力域123123123123',
          style: 'shape=rectangle;',
          value: '111',
          type: 'vertex',
          width: 180,
          height: 180,
          info: {
            name: '能力域',
            nodeType: 'ability_field'
          }
        }
      ],
      children: [
        {
          name: '类型3',
          nodes: [
            {
              name: '撒大苏打',
              style: 'rounded=1;',
              value: '111777777',
              type: 'vertex',
              width: 100,
              height: 100
            }
          ]
        }
      ]
    },
    {
      name: '类型2',
      nodes: [
        {
          name: '撒大苏打',
          style: 'rounded=1;',
          type: 'vertex',
          width: 100,
          height: 100
        }
      ]
    }
  ]
  const graph = draw.value.graph

  var v1 = graph.insertVertex(
    graph.defaultParent,
    null,
    'Hello,',
    20,
    20,
    80,
    30
  )
  // var v2 = graph.insertVertex(
  //   graph.defaultParent,
  //   null,
  //   'World!',
  //   200,
  //   150,
  //   80,
  //   30
  // )
  // var e1 = graph.insertEdge(graph.defaultParent, null, '', v1, v2)
})
const beforeAddVertex = (cell: mxCell) => {
  return true
}

// 类型1: [
//       {
//         name: '能力域123',
//         style: 'shape=rectangle;',
//         value: '111',
//         type: 'vertex',
//         width: 180,
//         height: 180,
//         info: {
//           name: '能力域',
//           nodeType: 'ability_field'
//         }
//       }
//     ],
//     类型2: [
//       {
//         name: '撒大苏打',
//         style: 'rounded=1;',
//         type: 'vertex',
//         width: 100,
//         height: 100
//       }
//     ]
</script>

<style scoped></style>
