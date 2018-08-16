export default {
  s4_sort() { return Math.floor((1 + Math.random()) * 0x10000).toString(10).substring(1); },
  guid_sort() { return this.s4_sort() + this.s4_sort() + this.s4_sort(); },
  convertTabDataToEdges(nodeType, tabData) {
    console.log(JSON.stringify(tabData));
    let hiddenEdges = [];
    if (nodeType === 'dialogue') {
      hiddenEdges = this.composeDialogueNodeHiddenEdges(tabData);
    }
    const node = {
      edges: hiddenEdges,
    };
    return node;
  },
  composeDialogueNodeHiddenEdges(tabData) {
    console.log(tabData);
    const hidden1 = this.getHiddenEdgeTemplate();
    hidden1.actions = [
      this.getActionSetParseFailed(true),
      this.getActionUpdateConfirmStatus(),
      this.getActionSetNodeCntLimit(3),
    ];
    const hiddenEdges = [hidden1];
    return hiddenEdges;
  },
  getHiddenEdgeTemplate() {
    return {
      to_node_id: null,
      edge_type: 'hidden',
      condition_rules: [],
      actions: [],
    };
  },
  getActionSetParseFailed(parseFailed) {
    return {
      operation: 'set_to_global_info',
      key: 'parsing_failed',
      val: parseFailed,
    };
  },
  getActionUpdateConfirmStatus() {
    return {
      operation: 'update_confirm_status',
    };
  },
  getActionSetNodeCntLimit(cnt) {
    return {
      operation: 'set_to_global_info',
      key: 'sys_node_dialogue_cnt_limit',
      val: cnt,
    };
  },

  // {
  //   "to_node_id": null,
  //   "edge_type": "hidden",
  //   "condition_rules": [
  //     [
  //       {
  //         "source": "global_info",
  //         "functions": [
  //           {
  //             "content": [
  //               {
  //                 "key": "time_0904278079939"
  //               },
  //               {
  //                 "key": "city_0904278079939"
  //               }
  //             ],
  //             "function_name": "not_contain_key"
  //           }
  //         ]
  //       }
  //     ]
  //   ],
  //   "actions": [
  //     {
  //       "operation": "set_to_global_info",
  //       "key": "parsing_failed",
  //       "val": true
  //     },
  //     {
  //       "operation": "update_confirm_status"
  //     },
  //     {
  //       "operation": "set_to_global_info",
  //       "key": "sys_node_dialogue_cnt_limit",
  //       "val": 3
  //     }
  //   ]
  // },
  // {
  //   "to_node_id": null,
  //   "edge_type": "hidden",
  //   "condition_rules": [
  //     [
  //       {
  //         "source": "global_info",
  //         "functions": [
  //           {
  //             "content": [
  //               {
  //                 "key": "time_0904278079939"
  //               },
  //               {
  //                 "key": "city_0904278079939"
  //               }
  //             ],
  //             "function_name": "not_contain_key"
  //           }
  //         ]
  //       },
  //       {
  //         "source": "text",
  //         "functions": [
  //           {
  //             "content": {
  //               "key_suffix": "_0904278079939",
  //               "tags": "time_module,city_module"
  //             },
  //             "function_name": "common_parser"
  //           }
  //         ]
  //       }
  //     ]
  //   ],
  //   "actions": [
  //     {
  //       "operation": "set_to_global_info",
  //       "key": "parsing_failed",
  //       "val": false
  //     }
  //   ]
  // },
  // {
  //   "to_node_id": "0904278079939",
  //   "edge_type": "hidden",
  //   "condition_rules": [
  //     [
  //       {
  //         "source": "global_info",
  //         "functions": [
  //           {
  //             "content": [
  //               {
  //                 "compare": "<",
  //                 "key": "sys_node_dialogue_cnt",
  //                 "val": 3
  //               }
  //             ],
  //             "function_name": "key_val_match"
  //           },
  //           {
  //             "content": "scenario_counter_rev",
  //             "function_name": "counter_check"
  //           },
  //           {
  //             "content": [
  //               {
  //                 "key": "time_0904278079939"
  //               },
  //               {
  //                 "key": "city_0904278079939"
  //               }
  //             ],
  //             "function_name": "not_contain_key"
  //           }
  //         ]
  //       }
  //     ]
  //   ]
  // }
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
};
