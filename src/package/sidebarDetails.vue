<template>
  <details
    class="group [&_summary::-webkit-details-marker]:hidden"
    open
    v-for="item in htmls"
  >
    <summary
      class="flex items-center justify-between px-4 py-2 text-gray-500 cursor-pointer hover:bg-gray-100 hover:text-gray-700"
    >
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium"> {{ item.name }} </span>
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
    <nav class="flex flex-col mt-2">
      <div
        v-for="(ele, index) in item.nodes"
        :key="index"
        class="flex justify-start p-2 align-middle transition duration-300 cursor-pointer sidebar_item hover:bg-gray-300 shrink-0"
        :ref="getSidebarRef"
        :data-realWidth="ele.width"
        :data-realHeight="ele.height"
        :data-type="ele.cell.isVertex()"
        @mousedown="handleItemMouseDown(ele)"
      >
        <div class="w-12 h-8" v-html="ele.html"></div>
        <span class="leading-8 truncate" :title="ele.code">{{ ele.code }}</span>
      </div>
    </nav>
    <sidebar-details
      v-if="item.children"
      :htmls="item.children"
      :get-sidebar-ref="props.getSidebarRef"
      :handle-item-mouse-down="props.handleItemMouseDown"
      :open="false"
    />
  </details>
</template>

<script lang="ts">
export default {
  name: 'sidebar-details'
}
</script>
<script setup lang="ts">
import { SidebarHTML, SidebarHTMLItem } from './type/type'

const props = defineProps<{
  htmls: SidebarHTML[]
  getSidebarRef: (ele: any) => void
  handleItemMouseDown: (item: SidebarHTMLItem) => void
  open: boolean
}>()
</script>

<style scoped></style>
