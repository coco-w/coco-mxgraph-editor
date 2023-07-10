<template>
  <div class="flex w-full h-full draw">
    <div class="h-full sider-wrapper" style="width: 200px" v-if="!hideSidebar">
      <SiderbarVue :nodes="props.nodes" :graph="graph">
        <template #sidebar>
          <slot name="sidebar"></slot>
        </template>
      </SiderbarVue>
    </div>
    <div class="flex flex-col flex-1">
      <!-- <div class="w-full border-b border-gray-100 shadow toolbar"></div> -->
      <Toolbar :graph="graph" :toolbar="toolbar" v-if="showToolbar" />
      <div class="flex-1 w-full editor-container">
        <div class="editor-outline"></div>
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
import { DrawInstance, DrawProps, SidebarNodeConfig } from './type/type'
const props = defineProps<DrawProps>()
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
  graph.value.beforeAddVertex = props.beforeAddVertex
  graph.value.handleRotate = props.handleRotate
  graph.value._init()
  window.graph = unref(graph.value)

  //鸟瞰图
  if (props.outlineMap) {
    new mx.mxOutline(
      graph.value,
      document.querySelector('.editor-outline') as HTMLElement
    )
  }
})
const showToolbar = ref<boolean>(true)
const reloadToolbar = () => {
  showToolbar.value = false
  setTimeout(() => {
    showToolbar.value = true
  }, 0)
}
defineExpose({
  graph: graph,
  reloadToolbar
})
</script>

<style lang="scss">
.draw {
  @apply relative;
  .toolbar {
    @apply h-8;
  }
  .editor-outline {
    @apply absolute top-0 right-2 w-48 h-32 bg-white shadow border;
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
