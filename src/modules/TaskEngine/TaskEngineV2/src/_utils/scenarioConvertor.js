export default {
  s4_sort() { return Math.floor((1 + Math.random()) * 0x10000).toString(10).substring(1); },
  guid_sort() { return this.s4_sort() + this.s4_sort() + this.s4_sort(); },
  initialScenario(metadata) {
    const entryNodeId = this.guid_sort();
    const scenario = {
      editingContent: {
        metadata: JSON.parse(JSON.stringify(metadata)),
        setting: {
          sys_scenario_dialogue_cnt_limit: 30,
          sys_node_dialogue_cnt_limit: 3,
        },
        nodes: [
          {
            node_id: '0',
            description: 'Exit',
            node_type: 'exit',
          },
          {
            node_id: entryNodeId,
            description: '入口节点',
            node_type: 'entry',
            entry_condition_rules: [],
            warnings: [],
            edges: [],
          },
        ],
        msg_confirm: [],
        global_edges: [],
      },
      editingLayout: { [entryNodeId]: { position: { left: 300, top: 200 } } },
    };
    return scenario;
  },
};
