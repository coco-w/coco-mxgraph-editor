<template>
  <div>
    <drawVue :nodes="nodes" :toolbar="['undo', 'redo']">
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
const nodes = ref<SidebarNode[]>([])
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
  nodes.value = [
    {
      name: '能力域',
      style:
        'shape=folder;rounded=0;tabPosition=left;editable=0;type=能力域;tagColor=#0077b6;',
      type: 'vertex',
      width: 120,
      height: 80,
      info: {
        name: '能力域',
        nodeType: 'ability_field'
      }
    },
    {
      name: '撒大苏打',
      style: 'rounded=1;',
      type: 'vertex',
      width: 100,
      height: 100
    }
  ]
})
</script>

<style scoped></style>
