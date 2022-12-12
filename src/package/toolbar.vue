<template>
  
    <div class="toolbar w-full border-b border-gray-100 shadow flex justify-start" :style="{'--img': img}">
      <div v-for="(item) in initToolbar"  :class="getToolbarItemClassName(item)" @click="handleToolbarItemClick(item)">
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
import { nextTick, onMounted } from 'vue'
import MyGraph from './graph';

const props = defineProps<{
  graph?: MyGraph
}>()
const initToolbar = ['undo', 'redo', 'zoomIn', 'zoomOut', 'delete']
const img = (import.meta as any).env.DEV ? "url('./toolbar.png')" : `url(${new URL('./toolbar.png', import.meta.url).href})`

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
      action?.addListener('stateChanged', () => {
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
  return `toolbar_sprite ${key}`
}
const handleToolbarItemClick = (key: string) => {
  const action = props.graph?.actions.get(key)
  if (action?.enabled) {
    action.func(props.graph as MyGraph)
  }
}

</script>

<style scoped lang="scss">
  .toolbar {
  width: 100%;
  height: 24px;
  border-bottom: 1px solid #dadce0;
  user-select: none;
}
.toolbar_item  .toolbar_sprite {
  background-repeat: no-repeat;
  background-image: var(--img);
  // background: var(--img);
  height: 20px;
  display: inline-block;
  width: 20px;
  vertical-align: sub;
}
.toolbar_sprite.undo {
  background-position: 0 -920px;
}
.toolbar_sprite.redo {
  background-position: 0 -644px;
}
.toolbar_sprite.delete {
  background-position: 0 -184px;
}

.toolbar_sprite.zoomIn {
  background-position: 0 -966px;
}
.toolbar_sprite.zoomOut {
  background-position: 0 -1012px;
}
</style>