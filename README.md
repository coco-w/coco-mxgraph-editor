# mxgraph editor
基于mxgraph，vue3，typescript的editor组件

## props

### sidebarNodes
`SidebarItem[]`
出现在侧边栏的节点
```ts
interface SidebarItem {
  name: string
  style: string
  type: 'edge'|'vertex'
  width: number
  height: number
  info?: Record<string, any>
}
```

### handleAddVertex?
添加vertex节点触发
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
###   handleAddEdge?
添加edge节点触发
```ts
(cell: mxCell) => void
```
###  handleMoveCell?
移动节点触发
```ts
(cell: mxCell) => void
```
###  cellRightClick?
自定义侧边栏
``` ts
(cells: mxCell[], menu: mxPopupMenuHandler) => void
```
### beforeDeleteCell?
删除节点前触发，返回`false`不会触发删除
```ts
(cell: mxCell) => boolean
```
