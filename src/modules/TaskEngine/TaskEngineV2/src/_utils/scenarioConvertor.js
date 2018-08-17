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
  convertTabDataToNode(tabResult) {
    const node = {
      node_id: tabResult.nodeId,
      node_type: tabResult.nodeType,
      description: tabResult.description,
      edges: this.convertTabDataToEdges(tabResult),
    };
    return node;
  },
  // convert to edges
  convertTabDataToEdges(tabData) {
    // console.log(JSON.stringify(tabData));
    let edges = [];
    if (tabData.nodeType === 'dialogue') {
      const hiddenEdges = this.composeDialogueNodeHiddenEdges(tabData);
      const hiddenSetCntLimit = this.edgeHiddenSetNodeDialogueCntLimit(
        tabData.edgeTab.dialogueLimit,
      );
      const exceedThenGoto = this.edgeExceedThenGoTo(tabData.edgeTab.exceedThenGoto);
      const elseInto = this.edgeElseInto(tabData.nodeId, tabData.edgeTab.elseInto);
      edges = [
        ...hiddenEdges,
        ...tabData.edgeTab.normalEdges,
        hiddenSetCntLimit,
        exceedThenGoto,
        elseInto,
      ];
    }
    return edges;
  },
  composeDialogueNodeHiddenEdges(tabData) {
    console.log(tabData);
    const nodeId = tabData.nodeId;
    const dialogueLimit = tabData.edgeTab.dialogueLimit;
    const targetEntities = tabData.settingTab.targetEntities;
    let skipIfKeyExist = tabData.settingTab.skipIfKeyExist;
    const parseFromThisNode = tabData.settingTab.parseFromThisNode;

    const hidden1 = this.hiddenEdgeTemplate();
    if (parseFromThisNode) {
      skipIfKeyExist = skipIfKeyExist.map(key => `${key}_${nodeId}`);
    }
    hidden1.condition_rules = [[
      this.conditionNotContainKey(skipIfKeyExist),
    ]];
    hidden1.actions = [
      this.actionSetParseFailed(true),
      this.actionUpdateConfirmStatus(),
      this.actionSetNodeDialogueCntLimit(dialogueLimit),
    ];

    const hidden2 = this.hiddenEdgeTemplate();
    hidden2.condition_rules = [[
      this.conditionNotContainKey(skipIfKeyExist),
      this.conditionCommonParser(targetEntities, nodeId),
    ]];
    hidden2.actions = [
      this.actionSetParseFailed(false),
    ];

    const hidden3 = this.hiddenEdgeTemplate();
    hidden3.to_node_id = nodeId;
    hidden3.condition_rules = [[
      this.conditionDialogueCntLessThan(dialogueLimit),
      this.conditionCounterCheck('scenario_counter_rev'),
      this.conditionNotContainKey(skipIfKeyExist),
    ]];
    const hiddenEdges = [hidden1, hidden2, hidden3];
    return hiddenEdges;
  },
  edgeHiddenSetNodeDialogueCntLimit(cnt) {
    const edge = this.hiddenEdgeTemplate();
    edge.actions = [
      this.actionSetNodeDialogueCntLimit(cnt),
    ];
    return edge;
  },
  edgeExceedThenGoTo(toNode) {
    return {
      to_node_id: toNode,
      edge_type: 'exceedThenGoTo',
      condition_rules: [
        [
          this.conditionCounterCheck('node_counter'),
        ],
      ],
      actions: [
        this.actionSetParseFailed(false),
        this.actionSetNodeDialogueCnt(0),
      ],
    };
  },
  edgeElseInto(nodeId, toNode) {
    const edge = {
      to_node_id: toNode,
      edge_type: 'else_into',
      condition_rules: [],
      actions: [
        this.actionSetParseFailed(true),
      ],
    };
    if (nodeId === toNode) {
      // 解析失败处理
      edge.actions = [
        this.actionSetParseFailed(true),
      ];
    } else {
      edge.actions = [
        this.actionSetParseFailed(false),
        this.actionSetNodeDialogueCnt(0),
      ];
    }
    return edge;
  },
  conditionDialogueCntLessThan(val) {
    return this.conditionKeyValMatch('<', 'sys_node_dialogue_cnt', val);
  },
  conditionKeyValMatch(compare, key, val) {
    return {
      source: 'global_info',
      functions: [
        {
          content: [
            {
              compare,
              key,
              val,
            },
          ],
          function_name: 'key_val_match',
        },
      ],
    };
  },
  conditionCounterCheck(content) {
    return {
      source: 'global_info',
      functions: [
        {
          content,
          function_name: 'counter_check',
        },
      ],
    };
  },
  conditionCommonParser(tags, nodeId) {
    const tagsString = tags.join(',');
    const keySuffix = `_${nodeId}`;
    return {
      source: 'text',
      functions: [
        {
          content: {
            key_suffix: keySuffix,
            tags: tagsString,
          },
          function_name: 'common_parser',
        },
      ],
    };
  },
  conditionNotContainKey(keys) {
    const content = keys.map(key => ({ key }));
    return {
      source: 'global_info',
      functions: [
        {
          content,
          function_name: 'not_contain_key',
        },
      ],
    };
  },
  hiddenEdgeTemplate() {
    return {
      to_node_id: null,
      edge_type: 'hidden',
      condition_rules: [],
      actions: [],
    };
  },
  actionSetParseFailed(parseFailed) {
    return this.actionSetToGlobalInfo('parsing_failed', parseFailed);
  },
  actionUpdateConfirmStatus() {
    return {
      operation: 'update_confirm_status',
    };
  },
  actionSetNodeDialogueCnt(cnt) {
    return this.actionSetToGlobalInfo('sys_node_dialogue_cnt', cnt);
  },
  actionSetNodeDialogueCntLimit(cnt) {
    return this.actionSetToGlobalInfo('sys_node_dialogue_cnt_limit', cnt);
  },
  actionSetToGlobalInfo(key, val) {
    return {
      operation: 'set_to_global_info',
      key,
      val,
    };
  },
};
