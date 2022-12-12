<template>
  <div>

  </div>
</template>

<script setup lang="ts">import { mxCell, mxPopupMenuHandler } from 'mxgraph';
import { PropType } from 'vue';

const props = defineProps({
  a: {
    type: String,
    required: true,
  },
  menu: {
    type: Function,
    required: false,
    // validator: (cells: mxCell[], menu: mxPopupMenuHandler) => void
  }
})
</script>

<style scoped>

</style>