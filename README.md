# mxgraph editor

基于 mxgraph，vue3，typescript 的 editor 组件

```ts
<template>
  <MyDraw :nodes="[]" />
</template>
<script setup lang="ts">
  import { MyDraw } from "coco-mxgraph-editor"
  import "coco-mxgraph-editor/dist/style.css"
</script>
```

## props

### nodes

`SidebarNode[]`
出现在侧边栏的节点

```ts
interface SidebarNode {
  name: string
  nodes?: SidebarNodeConfig[]
  children?: SidebarNode[]
}


interface SidebarNodeConfig {
  name: string
  style: string
  type: ItemType
  width: number
  height: number
  value?: string
  info?: Record<string, any>
}
```

### hideSidebar

隐藏侧边栏

```ts
boolean
```

### toolbar

自定义 toolbar

```ts
string[]
//默认值
// ['undo', 'redo', 'zoomIn', 'zoomOut', 'delete']
```

### handleAddVertex?

添加 vertex 节点触发

```ts
(
  cell: mxCell,
  x: number,
  y: number,
  target: mxCell
) => void
```

### handleDeleteCell?

删除节点触发

```ts
(cell: mxCell) => void
```

### handleAddEdge?

添加 edge 节点触发

```ts
(cell: mxCell) => void
```

### handleMoveCell?

移动节点触发

```ts
(cell: mxCell) => void
```

### cellRightClick?

自定义侧边栏

```ts
(cells: mxCell[], menu: mxPopupMenuHandler) => void
```

### beforeDeleteCell?

删除节点前触发，返回`false`不会触发删除

```ts
(cell: mxCell) => boolean
```

## 连接规则
```ts
mx.mxConnectionHandler.prototype.connect = function (
  source: mxCell,
  target: mxCell,
  evt: MouseEvent,
  dropTarget: mxCell
) {
  this.originConnect.apply(this, arguments as any)
}
```

## outlineMap
鸟瞰图
```ts
boolean
```
