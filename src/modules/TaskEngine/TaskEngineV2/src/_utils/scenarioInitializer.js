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
  initialExitNode() {
    return {
      node_id: '0',
      description: 'Exit',
      node_type: 'exit',
    };
  },
  initialFunctionContent(funcName, nodeId) {
    const map = {
      match: '',
      contains: '',
      regular_exp: {
        pattern: '',
        operations: [
          {
            operation: 'set_to_global_info',
            index: 0,
            key: '',
          },
        ],
      },
      common_parser: {
        tags: '',
        key_suffix: `_${nodeId}`,
      },
      task_parser: {
        tags: '',
        key_suffix: `_${nodeId}`,
      },
      hotel_parser: {
        tags: '',
        key_suffix: `_${nodeId}`,
      },
      user_custom_parser: {
        trans: '',
        to_key: '',
      },
      polarity_parser: {
        key: '',
        key_suffix: `_${nodeId}`,
      },
      api_parser: '',
      // qq: 'qq',
    };
    return map[funcName];
  },
  initialEdge() {
    return {
      edge_type: 'normal',
      to_node_id: null,
      actions: [],
      condition_rules: [
        [
          {
            source: 'text',
            functions: [
              {
                function_name: 'match',
                content: '',
              },
            ],
          },
        ],
      ],
    };
  },
  initialRule() {
    return {
      source: 'text',
      functions: [
        {
          function_name: 'match',
          content: '',
        },
      ],
    };
  },
  initialRegularOperation() {
    return {
      operation: 'set_to_global_info',
      index: 0,
      key: '',
    };
  },
  initialCandidateEdge() {
    return {
      to_node_id: null,
      tar_text: '',
    };
  },
};
