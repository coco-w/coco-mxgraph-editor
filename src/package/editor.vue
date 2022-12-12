<template>
  <Sidebar
    :graph="graph"
    @change-edge="handleChangeEdge"
    :importDataType="props.importDataType"
  >
    <template #sidebar>
      <slot name="sidebar"></slot>
    </template>
  </Sidebar>
  <div class="container"></div>
  <div id="outlineContainer" />
</template>
<script lang="ts">
// 使用 defineComponent 来进行类型推断
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Editor'
})
</script>
<script setup lang="ts">
import { mxCell, mxPopupMenuHandler } from "mxgraph"
import { inject, onMounted, ref, Ref, shallowRef, watch } from "vue"
import MyGraph from "./graph"
import "./defaultConfig"
import { transfromEdge, transfromNode } from "./transfrom"
import { NodeConfig } from "./type/node"
import mx from "./factory"
import Sidebar from "./siderbar.vue"
import { message } from "ant-design-vue"
import { ImportData } from "./type/sidebar"
import { EdgeStructure, EditorProps, ListImpl, NodeStructure } from "./type/type"

const props = defineProps<{
  menu?: (cells: mxCell[], menu: mxPopupMenuHandler) => void
  nodeProps: any
  edgeProps: any
  importDataType?: ImportData[]
  handles?: {
    handlecellRightClick?: (cells: mxCell[], menu: mxPopupMenuHandler) => void
    handleAddVertex?: (
      cell: mxCell,
      x: number,
      y: number,
      target: mxCell
    ) => void
    handleDeleteCell?: (cell: mxCell) => void
    handleAddEdge?: (cell: mxCell) => void
    handleDropIn?: (target: mxCell, cells: mxCell[]) => void
    handleDropOut?: (target: mxCell, cells: mxCell[]) => void
    handleSizeChange?: (props: {
      x: string
      y: string
      width: string
      height: string
      id: string
    }) => void
    beforeDeleteCell?: (cell: mxCell) => boolean
  }
  getData: (id: string) => Promise<{
    nodes: ListImpl<NodeStructure>
    edges: ListImpl<EdgeStructure>
    combos: ListImpl<NodeStructure>
  }>
}>()
const emits = defineEmits<{
  (e: "load"): void
}>()
const categoryId = inject<Readonly<Ref<string>>>("categoryId", ref(""))
const wrapperId = inject<Readonly<Ref<string>>>("wrapperId", ref(""))
const viewId = inject<Readonly<Ref<string>>>("viewId", ref(""))
const graph = shallowRef<MyGraph>()
// mx.mxEditor.prototype.graph = new MyGraph()
onMounted(() => {
  const editor = new mx.mxEditor()
  editor.graph = new MyGraph(
    document.querySelector(".container") as HTMLElement
  )
  graph.value = editor.graph as MyGraph
  graph.value.cellRightClick = props.menu
  graph.value.nodeProps = props.nodeProps
  graph.value.edgeProps = props.edgeProps
  graph.value.handleDeleteCell = props.handles?.handleDeleteCell
  graph.value.handleAddEdge = props.handles?.handleAddEdge
  graph.value.handleDropIn = props.handles?.handleDropIn
  graph.value.handleAddVertex = props.handles?.handleAddVertex
  graph.value.handleDropOut = props.handles?.handleDropOut
  graph.value.handleSizeChange = props.handles?.handleSizeChange
  graph.value.beforeDeleteCell = props.handles?.beforeDeleteCell
  graph.value._init()
  window.graph = graph.value
  getData(wrapperId.value)
  new mx.mxOutline(
    graph.value,
    document.querySelector("#outlineContainer") as HTMLElement
  )
})

watch(props, () => {
  if (!graph.value) return
  graph.value.nodeProps = props.nodeProps
  graph.value.edgeProps = props.edgeProps
})

watch(wrapperId, () => {
  if (graph.value) {
    graph.value.model.clear()
    graph.value.cellRightClick = props.menu
    graph.value.nodeProps = props.nodeProps
    graph.value.edgeProps = props.edgeProps
    getData(wrapperId.value)
  }
})

const getData = async (id: string) => {
  graph.value?.model.clear()
  const { combos, edges, nodes } = await props.getData(id)

  if (graph.value) {
    graph.value.createEdgeStatus = true
    combos.records.forEach((ele) => {
      const cfg = transfromNode(ele)
      graph.value?.insertVertetByConfig(cfg)
    })
    nodes.records.forEach((ele) => {
      const cfg = transfromNode(ele)
      graph.value?.insertVertetByConfig(cfg)
    })
    edges.records.forEach((ele) => {
      const cfg = transfromEdge(ele, graph.value as MyGraph)
      if (cfg) graph.value?.insertEdgeByConfig(cfg)
    })
    graph.value?.center()
    graph.value.createEdgeStatus = false
    emits("load")
  }
}

const handleChangeEdge = (edge: mxCell, id: string) => {
  if (graph.value) {
    console.log(id)
    graph.value.currentEdge = {
      style: edge.style,
      panelId: id,
    }
    message.success(`正在使用${edge.info.code}`)
  }
}
defineExpose({
  graph: graph,
})
</script>

<style scoped lang="less">
.container {
  width: calc(100% - 150px);
  height: 100%;
}

#outlineContainer {
  z-index: 1;
  position: absolute;
  overflow: hidden;
  top: 0px;
  right: 0px;
  width: 160px;
  height: 120px;
  background: #fff;
  border-style: solid;
  border-color: lightgray;
}
</style>

<style>
div.mxPopupMenu {
  -webkit-box-shadow: 3px 3px 6px #c0c0c0;
  -moz-box-shadow: 3px 3px 6px #c0c0c0;
  box-shadow: 3px 3px 6px #c0c0c0;
  background: white;
  position: absolute;
  border: 3px solid #e7e7e7;
  padding: 3px;
}

table.mxPopupMenu {
  border-collapse: collapse;
  margin: 0px;
}

tr.mxPopupMenuItem {
  color: black;
  cursor: pointer;
}

td.mxPopupMenuItem {
  padding: 6px 60px 6px 30px;
  font-family: Arial;
  font-size: 10pt;
  user-select: none;
}

td.mxPopupMenuIcon {
  background-color: white;
  padding: 0px;
}

tr.mxPopupMenuItemHover {
  background-color: #eeeeee;
  color: black;
}

table.mxPopupMenu hr {
  border-top: solid 1px #cccccc;
}

table.mxPopupMenu tr {
  font-size: 4pt;
}

div.mxRubberband {
  position: absolute;
  overflow: hidden;
  border-style: solid;
  border-width: 1px;
  border-color: #0000ff;
  background: #0077ff;
}
</style>
