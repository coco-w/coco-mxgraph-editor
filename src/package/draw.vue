<template>
  <div class="draw h-full w-full flex">
    <div class="sider-wrapper h-full" style="width: 200px" v-if="!hideSidebar">
      <SiderbarVue :nodes="props.nodes" :graph="graph">
        <template #sidebar>
          <slot name="sidebar"></slot>
        </template>
      </SiderbarVue>
    </div>
    <div class="flex-1">
      <!-- <div class="toolbar w-full border-b border-gray-100 shadow"></div> -->
      <Toolbar :graph="graph" />
      <div class="editor-container w-full">
        <div></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'Draw'
}
</script>
<script setup lang="ts">
import { mxCell as typeMxCell, mxPopupMenuHandler } from 'mxgraph'
import { onMounted, ref, shallowRef, unref } from 'vue'
import mx from './factory'
import MyGraph from './graph'
import SiderbarVue from './siderbar.vue'
import Toolbar from './toolbar.vue'
import '../index.css'
import { DrawInstance, SidebarNode } from './type/type'
const props = defineProps<{
  nodes: SidebarNode[]
  hideSidebar?: boolean
  handleAddVertex?: (
    cell: typeMxCell,
    x: number,
    y: number,
    target: typeMxCell
  ) => void
  handleDeleteCell?: (cell: typeMxCell) => void
  handleAddEdge?: (cell: typeMxCell) => void
  handleMoveCell?: (cell: typeMxCell) => void
  cellRightClick?: (cells: typeMxCell[], menu: mxPopupMenuHandler) => void
  beforeDeleteCell?: (cell: typeMxCell) => boolean
}>()
const graph = shallowRef<MyGraph>()
onMounted(() => {
  const editor = new mx.mxEditor()
  editor.graph = new MyGraph(
    document.querySelector('.editor-container') as HTMLElement
  )

  graph.value = editor.graph as MyGraph
  graph.value.handleAddVertex = props.handleAddVertex
  graph.value.handleDeleteCell = props.handleDeleteCell
  graph.value.handleAddEdge = props.handleAddEdge
  graph.value.handleMoveCell = props.handleMoveCell
  graph.value.cellRightClick = props.cellRightClick
  graph.value.beforeDeleteCell = props.beforeDeleteCell
  graph.value._init()
  window.graph = unref(graph.value)
})
defineExpose({
  graph: graph
})
</script>

<style scoped lang="scss">
.draw {
  .toolbar {
    @apply h-8;
  }
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
</style>
