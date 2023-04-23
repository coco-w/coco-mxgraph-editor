<template>
  <div>
    <drawVue :nodes="nodes" :toolbar="['undo', 'redo']" :outlineMap="true">
      <template #sidebar>asdasdasd</template>
    </drawVue>
  </div>
</template>

<script setup lang="ts">
import { mxCell } from 'mxgraph'
import { onMounted, ref } from 'vue'
import drawVue from './package/draw.vue'
import mx from './package/factory'
import { SidebarNode } from './package/type/type'
import './shape'
const nodes = ref<Record<string, SidebarNode[]>>({})
mx.mxConnectionHandler.prototype.connect = function (
  source: mxCell,
  target: mxCell,
  evt: MouseEvent,
  dropTarget: mxCell
) {
  console.log('1111')
  this.originConnect.apply(this, arguments as any)
}
onMounted(() => {
  nodes.value = {
    类型1: [
      {
        name: '能力域123',
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
    类型2: [
      {
        name: '撒大苏打',
        style: 'rounded=1;',
        type: 'vertex',
        width: 100,
        height: 100
      }
    ]
  }
})
</script>

<style scoped></style>
