<template>
  <div>
    <drawVue :nodes="nodes"/>
  </div>
</template>

<script setup lang="ts">
import drawVue from './package/draw.vue';
import { SidebarNode } from './package/type/type';
const nodes: SidebarNode[] = [
  {
    name: "能力域",
    style:
      "shape=folder;rounded=0;tabPosition=left;editable=0;type=能力域;tagColor=#0077b6;",
    type: "vertex",
    width: 120,
    height: 80,
    info: {
      name: "能力域",
      nodeType: "ability_field",
    },
  }
]
</script>

<style scoped>

</style>