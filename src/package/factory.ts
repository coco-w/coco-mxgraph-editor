import factory, { mxCell } from 'mxgraph'
import MyGraph from './graph'

// const mx = 
declare global {
  interface Window {
    mxBasePath: string
    mxLoadResources: boolean
    mxForceIncludes: boolean
    mxLoadStylesheets: boolean
    mxResourceExtension: string
  }
}

window.mxBasePath = ''
window.mxLoadResources = true
window.mxForceIncludes = false
window.mxLoadStylesheets = true
window.mxResourceExtension = '.txt'

const mx = factory({
  // mxBasePath: ''
})
mx.mxKeyHandler.prototype.bindAction = function (code, control, key, shift) {
  if (!code) return
  var action = this.actions.get(key)
  const that = this
  if (action != null) {
    var f = function () {
      // if (action.isEnabled())
      // {
      action.func(that.graph as MyGraph)
      // }
    }

    if (control) {
      if (shift) {
        this.bindControlShiftKey(code, f)
      } else {
        this.bindControlKey(code, f)
      }
    } else {
      if (shift) {
        this.bindShiftKey(code, f)
      } else {
        this.bindKey(code, f)
      }
    }
  }
}
mx.mxConnectionHandler.prototype.originConnect = function (
  source,
  target,
  evt,
  dropTarget
) {
  if (
    target != null ||
    this.isCreateTarget(evt) ||
    this.graph.allowDanglingEdges
  ) {
    // Uses the common parent of source and target or
    // the default parent to insert the edge
    var model = this.graph.getModel()
    var terminalInserted = false
    var edge: mxCell = new mxCell()

    model.beginUpdate()
    try {
      if (
        source != null &&
        target == null &&
        !this.graph.isIgnoreTerminalEvent(evt) &&
        this.isCreateTarget(evt)
      ) {
        target = this.createTargetVertex(evt, source)

        if (target != null) {
          dropTarget = this.graph.getDropTarget([target], evt, dropTarget)
          terminalInserted = true

          // Disables edges as drop targets if the target cell was created
          // FIXME: Should not shift if vertex was aligned (same in Java)
          if (dropTarget == null || !this.graph.getModel().isEdge(dropTarget)) {
            var pstate = this.graph.getView().getState(dropTarget)

            if (pstate != null) {
              const tmp = model.getGeometry(target)
              tmp.x -= pstate.origin.x
              tmp.y -= pstate.origin.y
            }
          } else {
            dropTarget = this.graph.getDefaultParent()
          }

          this.graph.addCell(target, dropTarget)
        }
      }

      var parent = this.graph.getDefaultParent()

      if (
        source != null &&
        target != null &&
        model.getParent(source) == model.getParent(target) &&
        model.getParent(model.getParent(source)) != model.getRoot()
      ) {
        parent = model.getParent(source)

        if (
          source.geometry != null &&
          source.geometry.relative &&
          target.geometry != null &&
          target.geometry.relative
        ) {
          parent = model.getParent(parent)
        }
      }

      // Uses the value of the preview edge state for inserting
      // the new edge into the graph
      var value = null
      var style = ""

      if (this.edgeState != null) {
        value = this.edgeState.cell.value
        style = this.edgeState.cell.style
      }

      edge = this.insertEdge(parent, "", value, source, target, style as string)

      if (edge != null) {
        // Updates the connection constraints
        this.graph.setConnectionConstraint(
          edge,
          source,
          true,
          this.sourceConstraint
        )
        this.graph.setConnectionConstraint(
          edge,
          target,
          false,
          this.constraintHandler.currentConstraint
        )

        // Uses geometry of the preview edge state
        if (this.edgeState != null) {
          model.setGeometry(edge, this.edgeState.cell.geometry)
        }

        var parent = model.getParent(source)

        // Inserts edge before source
        if (this.isInsertBefore(edge, source, target, evt, dropTarget)) {
          var index = null
          var tmp = source

          while (
            tmp.parent != null &&
            tmp.geometry != null &&
            tmp.geometry.relative &&
            tmp.parent != edge.parent
          ) {
            tmp = this.graph.model.getParent(tmp)
          }

          if (tmp != null && tmp.parent != null && tmp.parent == edge.parent) {
            model.add(parent, edge, tmp.parent.getIndex(tmp))
          }
        }

        // Makes sure the edge has a non-null, relative geometry
        var geo = model.getGeometry(edge)

        if (geo == null) {
          geo = new mx.mxGeometry()
          geo.relative = true

          model.setGeometry(edge, geo)
        }

        // Uses scaled waypoints in geometry
        if (this.waypoints != null && this.waypoints.length > 0) {
          var s = this.graph.view.scale
          var tr = this.graph.view.translate
          geo.points = []

          for (var i = 0; i < this.waypoints.length; i++) {
            var pt = this.waypoints[i]
            geo.points.push(new mx.mxPoint(pt.x / s - tr.x, pt.y / s - tr.y))
          }
        }

        if (target == null) {
          var t = this.graph.view.translate
          var s = this.graph.view.scale
          const pt =
            this.originalPoint != null
              ? new mx.mxPoint(
                  this.originalPoint.x / s - t.x,
                  this.originalPoint.y / s - t.y
                )
              : new mx.mxPoint(
                  this.currentPoint.x / s - t.x,
                  this.currentPoint.y / s - t.y
                )
          pt.x -= this.graph.panDx / this.graph.view.scale
          pt.y -= this.graph.panDy / this.graph.view.scale
          geo.setTerminalPoint(pt, false)
        }

        this.fireEvent(
          new mx.mxEventObject(
            mx.mxEvent.CONNECT,
            "cell",
            edge,
            "terminal",
            target,
            "event",
            evt,
            "target",
            dropTarget,
            "terminalInserted",
            terminalInserted
          ),
          ""
        )
      }
    } catch (e) {
      mx.mxLog.show()
      mx.mxLog.debug((e as any).message)
    } finally {
      model.endUpdate()
    }

    if (this.select) {
      this.selectCells(edge as mxCell, terminalInserted ? target : null as unknown as mxCell)
    }
  }
}

export default mx