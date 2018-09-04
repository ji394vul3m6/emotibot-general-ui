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
  initialNode(nodeType, nodeName, nodeDialogueCntLimit) {
    if (nodeType === 'dialogue') {
      return this.initialDialogueNode(nodeName, nodeDialogueCntLimit);
    } else if (nodeType === 'nlu_pc') {
      return this.initialNLUPCNode(nodeName, nodeDialogueCntLimit);
    } else if (nodeType === 'restful') {
      return this.initialRestfulNode(nodeName);
    } else if (nodeType === 'parameter_collecting') {
      return this.initialPCNode(nodeName, nodeDialogueCntLimit);
    }
    return {};
  },
  initialPCNode(nodeName, nodeDialogueCntLimit) {
    return {
      nodeId: this.guid_sort(),
      nodeName,
      nodeType: 'parameter_collecting',
      settingBasicTab: {
        nodeName,
        nodeType: 'nlu_pc',
      },
      paramsCollectingTab: {
        params: [],
      },
      paramsCollectingEdgeTab: {
        dialogueLimit: nodeDialogueCntLimit,
        normalEdges: [{
          edge_type: 'pc_succeed',
          to_node_id: '0',
          actions: [{
            operation: 'set_to_global_info',
            key: 'sys_node_dialogue_cnt',
            val: 0,
          }],
          condition_rules: [[{
            source: 'global_info',
            functions: [{
              content: [],
              function_name: 'all_parameters_are_collected',
            }],
          }]],
        }, {
          edge_type: 'pc_failed',
          to_node_id: '0',
          actions: [{
            operation: 'set_to_global_info',
            key: 'sys_node_dialogue_cnt',
            val: 0,
          }],
          condition_rules: [[{
            source: 'global_info',
            functions: [{
              content: 'node_counter',
              function_name: 'counter_check',
            }],
          }]],
        }],
      },
    };
  },
  initialNLUPCNode(nodeName, nodeDialogueCntLimit) {
    return {
      nodeId: this.guid_sort(),
      nodeName,
      nodeType: 'nlu_pc',
      settingBasicTab: {
        nodeName,
        nodeType: 'nlu_pc',
      },
      entityCollectingTab: {
        entityCollectorList: [],
        relatedEntities: {
          relatedEntityCollectorList: [],
          relatedEntityMatrix: [],
        },
        re_parsers: [],
        tde_setting: {
          jumpOutTimes: nodeDialogueCntLimit,
        },
        register_json: {},
      },
      edgeTab: {
        normalEdges: [],
        exceedThenGoto: '0',
        elseInto: '0',
        dialogueLimit: nodeDialogueCntLimit,
      },
    };
  },
  initialDialogueNode(nodeName, nodeDialogueCntLimit) {
    return {
      nodeId: this.guid_sort(),
      nodeName,
      nodeType: 'dialogue',
      settingTab: {
        nodeName,
        parser: 'none',
        targetEntities: [],
        skipIfKeyExist: [],
        initialResponse: '',
        failureResponse: '',
        parseFromThisNode: false,
      },
      edgeTab: {
        normalEdges: [],
        exceedThenGoto: '0',
        elseInto: '0',
        dialogueLimit: nodeDialogueCntLimit,
      },
    };
  },
  initialRestfulNode(nodeName) {
    return {
      nodeId: this.guid_sort(),
      nodeName,
      nodeType: 'restful',
      restfulSettingTab: {
        nodeType: 'restful',
        nodeName,
        url: '',
        method: 'GET',
        contentType: 'application/json',
        body: '',
        rtnVarName: '',
      },
      restfulEdgeTab: {
        restfulFailedThenGoto: '0',
        restfulSucceedThenGoto: '0',
      },
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
      key_val_match: [
        {
          compare: '==',
          key: '',
          val: '',
        },
      ],
      key_key_match: [
        {
          key2: '',
          key1: '',
          compare: '==',
        },
      ],
      contain_key: [
        {
          key: '',
        },
      ],
      not_contain_key: [
        {
          key: '',
        },
      ],
      list_length_match: [
        {
          compare: '==',
          key: '',
          val: '',
        },
      ],
      counter_check: 'node_counter',
      user_custom_transform: {
        trans: '',
        from_key: '',
        to_key: '',
      },
      regular_exp_from_var: {
        operations: [
          {
            index: 0,
            operation: 'set_to_global_info',
            key: '',
          },
        ],
        pattern: '',
        from_key: '',
      },
      assign_value: [
        {
          operation: 'set_to_global_info',
          key: '',
          val: '',
        },
      ],
      cu_parser: 'Intent',
      custom_cu_parser: '',
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
  initialTriggerRule() {
    return {
      edge_type: 'trigger',
      to_node_id: null,
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
  initialParser() {
    return {
      funcName: 'regular_exp',
      content: {
        operations: [
          {
            index: 0,
            operation: 'set_to_global_info',
            key: '',
          },
        ],
        pattern: '',
      },
    };
  },
  initialVarTemplate() {
    return {
      key: '',
      msg: '$global{}',
      type: 'string',
    };
  },
};
