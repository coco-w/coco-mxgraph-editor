import { NodeDefaultConfig } from "./type/node"

export const nodeConfig: NodeDefaultConfig[] = [
  {
    type: 'node',
    shapeType: 'ov2_fight_node',
    code: '作战资源',
    width: 200,
    height: 150,
    name: '作战资源节点'
  },
  {
    type: 'node',
    shapeType: 'ov5a_fight_node',
    code: '作战任务',
    width: 200,
    height: 150,
    name: '作战任务节点'
  },
  {
    type: 'node',
    shapeType: 'ov5b_process_node',
    code: '作战任务流程',
    width: 200,
    height: 150,
    name: '作战任务流程节点'
  },
  {
    type: 'combo',
    shapeType: 'ov5b_container',
    code: '容器',
    width: 400,
    height: 800,
    name: '容器节点'
  },
  {
    type: 'node',
    shapeType: 'ov5b_start_node',
    code: '作战任务流程开始',
    width: 30,
    height: 30,
    name: ''
  },
  {
    type: 'node',
    shapeType: 'ov5b_final_node',
    code: '作战任务流程结束',
    width: 30,
    height: 30,
    name: ''
  },
  {
    type: 'node',
    shapeType: 'ov6b_process_node',
    code: '作战任务流程',
    width: 200,
    height: 150,
    name: '作战任务流程节点'
  },
  {
    type: 'node',
    shapeType: 'ov6b_start_node',
    code: '作战任务流程开始',
    width: 30,
    height: 30,
    name: ''
  },
  {
    type: 'node',
    shapeType: 'ov6b_final_node',
    code: '作战任务流程结束',
    width: 30,
    height: 30,
    name: ''
  },
  {
    type: 'combo',
    shapeType: 'ov6c_time_line',
    code: '生命线',
    width: 80,
    height: 250,
    name: '作战时序节点'
  },
  {
    type: 'combo',
    shapeType: 'ov6c_outside',
    code: '外部环境',
    width: 80,
    height: 250,
    name: '外部环境'
  },
  {
    type: 'node',
    shapeType: 'ov6c_block',
    code: '块',
    width: 20,
    height: 80,
    name: ''
  },
  {
    type: 'node',
    shapeType: 'ov6c_sequential_operation',
    code: '时序运算符',
    width: 150,
    height: 100,
    name: '运算'
  },
  {
    type: 'node',
    shapeType: 'ov6c_sequential_quote',
    code: '时序引入符',
    width: 150,
    height: 100,
    name: 'Ref'
  },
  {
    type: 'node',
    shapeType: 'ov6c_sequential_split',
    code: '时序分割符',
    width: 150,
    height: 100,
    name: '分割'
  },
  // 
  {
    type: 'combo',
    shapeType: 'ov6c_condition',
    code: '条件标识',
    width: 250,
    height: 150,
    name: '条件标识'
  }
  // Condition
]
// export default arr