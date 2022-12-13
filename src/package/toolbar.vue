<template>
  <div
    class="mx-toolbar w-full border-b border-gray-100 shadow flex justify-start"
  >
    <div
      v-for="item in initToolbar"
      :class="getToolbarItemClassName(item)"
      @click="handleToolbarItemClick(item)"
    >
      <div :class="getToolbarClassName(item)"></div>
      <!-- <span>{{ graph?.actions.action[item].name }}</span> -->
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: "Toolbar",
}
</script>
<script setup lang="ts">
import { nextTick, onMounted } from "vue"
import MyGraph from "./graph"
import "../assets/icons/iconfont.css"

const props = defineProps<{
  graph?: MyGraph
}>()
const initToolbar = ["undo", "redo", "zoomIn", "zoomOut", "delete"]

const disabled = (key: string) => {
  return `toolbar_item w-6 cursor-pointer text-center leading-8 cursor-not-allowed opacity-50 ${key}`
}
const normal = (key: string) => {
  return `toolbar_item w-6 cursor-pointer text-center leading-8 hover:bg-slate-200 opacity-100 ${key}`
}
onMounted(() => {
  nextTick(() => {
    initToolbar.forEach((key, index) => {
      const action = props.graph?.actions.get(key)
      action?.addListener("stateChanged", () => {
        const enabled = action.isEnabled()
        const dom = document.querySelector(`.toolbar>.${key}`)
        if (dom) {
          if (enabled) {
            dom.className = normal(key)
          } else {
            dom.className = disabled(key)
          }
        }
      })
    })
  })
})

const getToolbarItemClassName = (key: string) => {
  const action = props.graph?.actions.get(key)
  return action?.enabled ? normal(key) : disabled(key)
}
const getToolbarClassName = (key: string) => {
  return `toolbar_sprite iconfont icon-${key}`
}
const handleToolbarItemClick = (key: string) => {
  const action = props.graph?.actions.get(key)
  if (action?.enabled) {
    action.func(props.graph as MyGraph)
  }
}
</script>

<style lang="scss">
.mx-toolbar {
  .toolbar {
    width: 100%;
    height: 24px;
    border-bottom: 1px solid #dadce0;
    user-select: none;
  }
  .toolbar_item .toolbar_sprite {
    height: 20px;
    display: inline-block;
    width: 20px;
  }
}
</style>
