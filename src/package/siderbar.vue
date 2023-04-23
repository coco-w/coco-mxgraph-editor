<template>
  <div class="relative overflow-auto shadow-sm sidebar">
    <div id="sidebar_graph_container" class="overflow-auto"></div>
    <template v-if="!Array.isArray(htmls)">
      <details
        class="group [&_summary::-webkit-details-marker]:hidden"
        open
        v-for="(item, key) in htmls"
      >
        <summary
          class="flex items-center justify-between px-4 py-2 text-gray-500 cursor-pointer hover:bg-gray-100 hover:text-gray-700"
        >
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium"> {{ key }} </span>
          </div>

          <span class="transition duration-300 shrink-0 group-open:-rotate-180">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </span>
        </summary>
        <nav aria-label="Teams Nav" class="flex flex-col mt-2">
          <div
            v-for="(ele, index) in item"
            :key="index"
            class="flex justify-start p-2 align-middle transition duration-300 cursor-pointer sidebar_item hover:bg-gray-300 shrink-0"
            :ref="getSidebarRef"
            :data-realWidth="ele.width"
            :data-realHeight="ele.height"
            :data-type="ele.cell.isVertex()"
            @mousedown="handleItemMouseDown(ele)"
          >
            <div class="w-12 h-8" v-html="ele.html"></div>
            <span class="leading-8 truncate" :title="ele.code">{{
              ele.code
            }}</span>
          </div>
        </nav>
      </details>
    </template>

    <template v-else>
      <div
        v-for="(item, index) in htmls"
        :key="index"
        class="flex justify-start p-2 align-middle transition duration-300 cursor-pointer sidebar_item hover:bg-gray-300 shrink-0"
        :ref="getSidebarRef"
        :data-realWidth="item.width"
        :data-realHeight="item.height"
        :data-type="item.cell.isVertex()"
        @mousedown="handleItemMouseDown(item)"
      >
        <div class="w-12 h-8" v-html="item.html"></div>
        <span class="leading-8 truncate" :title="item.code">{{
          item.code
        }}</span>
      </div>
    </template>
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
import { mxCell as TypeMxCell } from 'mxgraph'
import {
  SidebarNode,
  NodeConfig,
  SidebarHTMLItem,
  SidebarProps
} from './type/type'
import clone from 'lodash.clonedeep'

const { mxCell, mxGeometry, mxGraph, mxUtils, mxPoint } = mx

const graph = ref<MyGraph>()
const htmls = ref<SidebarHTMLItem[] | Record<string, SidebarHTMLItem[]>>([])
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

const loadNodes = async () => {
  await nextTick()
  if (Array.isArray(props.nodes)) {
    htmls.value = []
    props.nodes.forEach((ele) => {
      if (!Array.isArray(htmls.value)) return
      const htmlItem =
        ele.type === 'edge' ? getEdgeHtml(ele) : getVertexHtml(ele)
      if (htmlItem) {
        htmls.value.push(htmlItem)
      }
    })
  } else {
    htmls.value = {}
    for (const key in props.nodes) {
      if (Object.prototype.hasOwnProperty.call(props.nodes, key)) {
        const element = props.nodes[key]
        htmls.value[key] = []
        element.forEach((ele) => {
          const htmlItem =
            ele.type === 'edge' ? getEdgeHtml(ele) : getVertexHtml(ele)
          if (htmlItem && !Array.isArray(htmls.value)) {
            htmls.value[key].push(htmlItem)
          }
        })
      }
    }
  }

  nextTick(() => {
    makeDraggableAndHover()
  })
}

const getVertexHtml = (item: SidebarNode): SidebarHTMLItem | undefined => {
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

const getEdgeHtml = (item: SidebarNode): SidebarHTMLItem | undefined => {
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

const makeDraggableAndHover = () => {
  const doms = document.querySelectorAll('.sidebar_item')
  doms.forEach((ele) => {
    const dragElt = document.createElement('div')
    const width = ele.getAttribute('data-realwidth')
    const height = ele.getAttribute('data-realheight')
    dragElt.style.width = `${width}px`
    dragElt.style.height = `${height}px`
    dragElt.style.border = '1px dashed #000'
    mxUtils.makeDraggable(
      ele as HTMLElement,
      props.graph as MyGraph,
      dropSuccessCb,
      dragElt,
      undefined,
      undefined,
      undefined,
      true
    )
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
