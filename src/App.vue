<template>
  <div>
    <button @click="handleClick">111</button>
    <drawVue
      :nodes="nodes"
      :toolbar="['undo', 'redo']"
      :outlineMap="true"
      ref="draw"
      :beforeAddVertex="beforeAddVertex"
      :handleRotate="handleRotate"
      :handleGeomertyChange="handleGeomertyChange"
      :handleStyleChange="handleStyleChange"
      :handleAddVertex="handleAddVertex"
    >
      <!-- <template #sidebar>asdasdasd</template> -->
    </drawVue>
  </div>
</template>

<script setup lang="ts">
import { mxCell, mxRectangle, mxSvgCanvas2D } from 'mxgraph'
import { onMounted, ref } from 'vue'
import drawVue from './package/draw.vue'
import mx from './package/factory'
import { SidebarNode, SidebarNodeConfig } from './package/type/type'
import './shape'
const nodes = ref<SidebarNode[]>([])
const draw = ref()
const { mxUtils, mxRectangleShape, mxEvent } = mx

onMounted(() => {
  nodes.value = [
    {
      name: '类型1',
      nodes: [
        {
          name: '能力域1233123123123123',
          style:
            'text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;',
          value: '',
          type: 'vertex',
          width: 100,
          height: 200,
          info: {
            name: '能力域',
            nodeType: 'ability_field'
          }
        },
        {
          name: '能力域123123123123',
          style:
            'shape=image;html=1;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;imageAspect=0;image=https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png',
          value: '',
          type: 'vertex',
          width: 180,
          height: 180,
          info: {
            name: '能力域',
            nodeType: 'ability_field'
          }
        }
      ],
      children: [
        {
          name: '类型3',
          nodes: [
            {
              name: '撒大苏打',
              style: 'rounded=1;',
              value: '111777777',
              type: 'vertex',
              width: 100,
              height: 100
            }
          ]
        }
      ]
    },
    {
      name: '类型2',
      nodes: [
        {
          name: '撒大苏打',
          style: 'rounded=1;',
          type: 'vertex',
          width: 100,
          height: 100
        }
      ]
    }
  ]
  const graph = draw.value.graph
  graph._initRotate()
  graph.insertVertex(
    graph.defaultParent,
    null,
    'hell',
    60,
    60,
    60,
    60,
    'shape=image;verticalLabelPosition=top;labelBackgroundColor=#ffffff;verticalAlign=top;imageAspect=0;image=https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png;'
  )
})
const beforeAddVertex = (cell: mxCell) => {
  return true
}
const handleClick = () => {
  console.log(draw.value.graph.container.style.backgroundImage)

  // document.querySelector('.editor-container').style.backgroundImage =
  //   'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png'
}
const handleRotate = () => {
  console.log(123123)
}

const handleGeomertyChange = (
  cell: mxCell[],
  key: string,
  value: number | string
) => {
  console.log(cell, key, value)
}
const handleStyleChange = (
  cell: mxCell[],
  key: string,
  value: number | string
) => {
  console.log(cell, key, value)
}

const handleAddVertex = () => {
  console.log('handleAddVertex')
}
</script>

<style scoped></style>
