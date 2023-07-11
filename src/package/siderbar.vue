<template>
  <div class="relative overflow-auto shadow-sm sidebar">
    <ElMenu ref="elMenu" class="overflow-auto">
      <sidebarDetails
        :htmls="htmls"
        :get-sidebar-ref="getSidebarRef"
        :handle-item-mouse-down="handleItemMouseDown"
      />
    </ElMenu>
    <div id="sidebar_graph_container" class="overflow-auto"></div>
    <!-- <el-menu> -->

    <!-- </el-menu> -->
    <slot name="sidebar"> </slot>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Sidebar'
}
</script>
<script setup lang="ts">
import { ref, onMounted, nextTick, Ref, inject, shallowRef, watch } from 'vue'
// import { mxGraph, mxCell } from 'mxgraph'
import mx from './factory'
// import { NodeObj } from './type'
import _ from 'lodash'
import MyGraph from './graph'
import { mxCell as TypeMxCell, mxDragSource } from 'mxgraph'
import {
  SidebarNodeConfig,
  NodeConfig,
  SidebarHTMLItem,
  SidebarProps,
  SidebarNode,
  SidebarHTML
} from './type/type'
import clone from 'lodash.clonedeep'
import sidebarDetails from './sidebarDetails.vue'
// import { ElMenu, ElSubMenu, ElMenuItem, ElMenuItemGroup } from 'element-plus'
// import 'element-plus/dist/index.css'

const { mxCell, mxGeometry, mxGraph, mxUtils, mxPoint } = mx

const graph = ref<MyGraph>()
const htmls = ref<SidebarHTML[]>([])
const sidebarDoms = ref<HTMLElement[]>([])
const importDataHTMls = ref<SidebarHTMLItem[]>([])
const thumbBorder = 2
const itemWidth = 32
const itemHeight = 30
//判断是否初始化过
const makeDragPanels: string[] = ['1']
const props = defineProps<SidebarProps>()
const emits = defineEmits<{
  (e: 'changeEdge', node: TypeMxCell, id: string): void
}>()
const selectCell = shallowRef<TypeMxCell>()
onMounted(() => {
  graph.value = new MyGraph(
    document.querySelector('#sidebar_graph_container') as HTMLElement
  )
  graph.value?._setDefaultConfig()
  if (props.nodes.length === 0) return
  loadNodes()
})

watch(
  () => props.nodes,
  () => {
    loadNodes()
  }
)

const opens = ref<string[]>([])
const elMenu = ref()
const loadNodes = async () => {
  await nextTick()
  // htmls.value = []
  htmls.value = transitionNodes(props.nodes)
  // if (Array.isArray(props.nodes)) {
  //   props.nodes.forEach((ele) => {})
  // } else {
  //   for (const key in props.nodes) {
  //     if (Object.prototype.hasOwnProperty.call(props.nodes, key)) {
  //       const element = props.nodes[key]
  //       htmls.value[key] = []
  //       element.forEach((ele) => {
  //         const htmlItem =
  //           ele.type === 'edge' ? getEdgeHtml(ele) : getVertexHtml(ele)
  //         if (htmlItem && !Array.isArray(htmls.value)) {
  //           htmls.value[key].push(htmlItem)
  //         }
  //       })
  //     }
  //   }
  // }
  await nextTick()
  htmls.value.forEach((ele) => {
    elMenu.value.open(ele.name)
  })

  nextTick(() => {
    makeDraggableAndHover()
  })
}

const transitionNodes = (nodes: SidebarNode[]) => {
  const res: SidebarHTML[] = []
  nodes.forEach((ele) => {
    const item: SidebarHTML = {
      name: ele.name
    }
    if (ele.nodes) {
      item.nodes = []
      ele.nodes.forEach((n) => {
        const html =
          n.type === 'vertex'
            ? (getVertexHtml(n) as SidebarHTMLItem)
            : (getEdgeHtml(n) as SidebarHTMLItem)
        item.nodes?.push(html)
      })
    }
    if (ele.children) {
      item.children = transitionNodes(ele.children)
    }
    res.push(item)
  })
  return res
}

const getVertexHtml = (
  item: SidebarNodeConfig
): SidebarHTMLItem | undefined => {
  const { height, width } = item
  const node: NodeConfig = {
    id: '',
    width: width,
    height: height,
    x: 0,
    y: 0,
    style: item.style,
    type: 'vertex',
    info: item.info,
    value: item.value
  }
  const cell = graph.value?.insertVertetByConfig(node)
  if (cell) {
    const html = createItem([cell], item.name, width, height)
    return {
      html: html as string,
      width,
      height,
      cell: cell,
      code: item.name
    }
  }
}

const getEdgeHtml = (item: SidebarNodeConfig): SidebarHTMLItem | undefined => {
  const edge: NodeConfig = {
    id: '',
    width: item.width,
    height: item.height,
    x: 0,
    y: 0,
    style: item.style,
    type: 'edge',
    info: {},
    value: ''
  }
  const cell = graph.value?.insertEdgeByConfig(edge)
  if (cell) {
    cell.geometry.sourcePoint = new mxPoint(0, 0)
    cell.geometry.targetPoint = new mxPoint(100, 0)
    const html = createItem([cell], item.name, 200, 100)
    return {
      html: html as string,
      width: 200,
      height: 100,
      cell: cell,
      code: item.name
    }
  }
}
const getSidebarRef = (ele: any) => {
  sidebarDoms.value.push(ele)
}

const getTextWidth = (text: string, font: string) => {
  var canvas = document.createElement('canvas')
  var context = canvas.getContext('2d') as CanvasRenderingContext2D
  context.font = font
  var metrics = context.measureText(text)
  return metrics.width
}
const previewNodeData = new Map<string, Node>()
const previewWidth = new Map<string, number>()
const previewHeight = new Map<string, number>()
const createItem = (
  cells: TypeMxCell[],
  title: string,
  realWidth: number,
  realHeight: number
) => {
  if (!graph.value) return
  graph.value.view.scaleAndTranslate(1, 0, 0)
  const parent = graph.value.getDefaultParent()
  graph.value.addCells(cells, parent)
  const bounds = graph.value.getGraphBounds()
  const s =
    Math.floor(
      Math.min(
        (itemWidth - 2 * thumbBorder) / bounds.width,
        (itemHeight - 2 * thumbBorder) / bounds.height
      ) * 100
    ) / 100
  //调整为合理的缩放比例
  graph.value.view.scaleAndTranslate(
    s,
    Math.floor((itemWidth - bounds.width * s) / 2 / s - bounds.x),
    Math.floor((itemHeight - bounds.height * s) / 2 / s - bounds.y)
  )
  // 复制svg node
  const node = (
    graph.value.view.getCanvas().ownerSVGElement as SVGSVGElement
  ).cloneNode(true)
  //计算合理的preview的大小
  const w = getTextWidth(title, '16px 宋体') + 20
  const previewWrapperWidth = w > realWidth ? w + 20 : realWidth + 20
  const previewWrapperHeight = realHeight > 90 ? realHeight + 20 : 90
  previewHeight.set(title, previewWrapperHeight)
  previewWidth.set(title, previewWrapperWidth)
  //获取预览的svg element
  const t =
    Math.floor(
      Math.min(
        (previewWrapperWidth - 2 * thumbBorder) / bounds.width,
        (previewWrapperHeight - 2 * thumbBorder) / bounds.height
      ) * 100
    ) / 100
  graph.value.view.scaleAndTranslate(
    t,
    Math.floor((previewWrapperWidth - bounds.width * t) / 2 / t - bounds.x),
    Math.floor((previewWrapperHeight - bounds.height * t) / 2 / t - bounds.y)
  )

  previewNodeData.set(
    title,
    (graph.value.view.getCanvas().ownerSVGElement as SVGSVGElement).cloneNode(
      true
    )
  )
  // 清空graph容器
  graph.value.getModel().clear()
  return (node as HTMLElement).outerHTML
}
const dropSuccessCb = function (
  _graph: MyGraph,
  evt: any,
  target: TypeMxCell,
  x: number,
  y: number
) {
  if (selectCell.value) {
    props.graph?.sidebarToGraph(selectCell.value, x, y, target)
  }
}
const drags = shallowRef<mxDragSource[]>([])
const makeDraggableAndHover = () => {
  drags.value.forEach((ele) => ele.setEnabled(false))
  const doms = document.querySelectorAll('.sidebar_item')
  doms.forEach((ele) => {
    const dragElt = document.createElement('div')
    const width = ele.getAttribute('data-realwidth')
    const height = ele.getAttribute('data-realheight')
    dragElt.style.width = `${width}px`
    dragElt.style.height = `${height}px`
    dragElt.style.border = '1px dashed #000'
    const d = mxUtils.makeDraggable(
      ele as HTMLElement,
      props.graph as MyGraph,
      dropSuccessCb,
      dragElt,
      undefined,
      undefined,
      undefined,
      true
    )
    drags.value.push(d)
  })
}

const handleItemMouseDown = (item: SidebarHTMLItem) => {
  selectCell.value = clone(item.cell)
}
const previewSvg = ref<Node>()
const previewTitle = ref<string>('')
const handleItemHover = (item: SidebarHTMLItem, e: MouseEvent) => {
  const name = item.code
  const node = previewNodeData.get(name) as Node
  const width = previewWidth.get(name)
  const height = previewHeight.get(name)
  const svgWrapper = document.querySelector('.svg_wrapper') as HTMLElement
  const previewWrapper = document.querySelector(
    '.sidebar_preview_svg'
  ) as HTMLElement
  previewWrapper.style.display = 'block'
  previewWrapper.style.width = `${width}px`
  previewWrapper.style.height = `${height}px`
  svgWrapper.innerHTML = ''
  svgWrapper.append(node)
  previewTitle.value = name
}
const clearPreviewSvg = () => {
  previewTitle.value = ''
  const previewWrapper = document.querySelector(
    '.sidebar_preview_svg'
  ) as HTMLElement
  previewWrapper.style.display = 'none'
}
const hadnleItemMouseLeave = () => {
  // clearPreviewSvg()
}
const hadnleCollaspeChange = (key: string) => {
  if (!makeDragPanels.includes(key)) {
    makeDragPanels.push(key)
  }
}
const activeKey = ref<string>('1')
</script>

<style lang="scss">
.sidebar {
  width: 100%;
  height: 100%;
  background: #fbfbfb;
  border-top: 1px solid #eee;
  border-right: 1px solid #eee;
  z-index: 10;
  user-select: none;
  overflow: auto;
}

// .sidebar_item {
//   width: 100%;
//   height: 30px;
//   display: block;
//   cursor: pointer;
//   display: flex;
//   align-items: center;

//   .svg_logo {
//     width: 40px;
//     height: 30px;
//     display: inline-block;
//   }

//   span {
//     white-space: nowrap;
//     text-overflow: ellipsis;
//     overflow: hidden;
//   }
// }

// .sidebar_item:hover {
//   background-color: #e0e0e0;
// }

.palette_item {
  position: relative;
}

.sidebar .palette_item_title {
  display: block;
  font-size: 13px;
  border-bottom: 1px solid #e5e5e5;
  font-weight: 500;
  padding: 8px 0px 8px 14px;
  margin: 0px;
  cursor: default;
  /* white-space: nowrap; */
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4em;
  user-select: none;
  background-repeat: no-repeat;
  background-position: left;
}

.sidebar .palette_item_title:hover {
  background-color: #e0e0e0;
}

.sidebar .palette_item_conten {
  border-bottom: 1px solid #e5e5e5;
}

.sidebar .palette_item_title .icon {
  position: relative;
  top: -2px;
  left: -12px;
}

.sidebar .palette_item_title .pswp__preloader__icn {
  position: absolute;
  top: 6px;
  right: 6px;
}

.sidebar_preview {
  position: absolute;
  top: 0;
  left: 150px;
  box-shadow: 0 7px 15px -5px rgb(0 0 0 / 50%);
  border-radius: 5px;
  background-color: #fff;
  z-index: 99999;
}

.sidebar_preview_svg {
  height: 80px;
  border-bottom: 1px solid #444;
}

.sidebar_preview_title {
  height: 30px;
  text-align: center;
  line-height: 30px;
}

#sidebar_graph_container {
  position: absolute;
  top: -1000px;
  width: 500px;
  height: 500px;
}
</style>
<style lang="scss">
.sidebar {
  .ant-collapse {
    .ant-collapse-header {
      padding: 5px;
      border-bottom: 1px solid #ccc;
    }

    .ant-collapse-content {
      .ant-collapse-content-box {
        padding: 5px;
        background-color: #fff;
      }
    }
  }
}
</style>
