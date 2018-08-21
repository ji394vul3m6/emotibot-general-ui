import optionConfig from './optionConfig';

export default {
  convertJsonToVersion(toVersion, jsonData) {
    let jsonVersion;
    if ('version' in jsonData.moduleData) {
      jsonVersion = jsonData.moduleData.version;
    } else {
      jsonVersion = '1.0';
    }

    let newJsonData = {};
    if (jsonVersion === '1.0') {
      newJsonData = this.convertJson_1_0_to_1_1(jsonData);
    } else {
      newJsonData = jsonData;
    }
    return newJsonData;
  },
  convertJson_1_0_to_1_1(initialJsonData) {
    const jsonData = JSON.parse(JSON.stringify(initialJsonData));
    const nodes = jsonData.moduleData.nodes.filter(
      node => node.node_id !== '0',
    ).map(
      node => this.convertNode(node),
    );
    jsonData.moduleData.ui_data = {
      nodes,
    };
    return jsonData;
  },
  convertNode(initialNode) {
    const node = JSON.parse(JSON.stringify(initialNode));
    const nodeType = node.node_type;
    // render tab data
    let tabs = [];
    const nodeType2TabsMap = optionConfig.nodeType2Tabs();
    if (nodeType in nodeType2TabsMap) {
      tabs = nodeType2TabsMap[nodeType];
    }
    const tabData = {};
    tabs.forEach((tab) => {
      if (tab === 'settingTab') {
        tabData.settingTab = this.parserSettingTab(node);
      } else if (tab === 'edgeTab') {
        tabData.edgeTab = this.parseEdgeTab(node);
      }
    });
    return {
      nodeId: node.node_id,
      nodeName: node.description || '',
      nodeType,
      settingTab: tabData.settingTab,
      edgeTab: tabData.edgeTab,
    };
  },
  parserSettingTab(node) {
    const tab = {};
    // parse nodeName
    tab.nodeName = node.description || '';

    // parse parser, targetEntities, skipIfKeyExist
    const c = node.edges[1].condition_rules;
    if (c.length > 0 && c[0].length > 1) {
      tab.parser = c[0][1].functions[0].function_name;
      tab.targetEntities = c[0][1].functions[0].content.tags.split(',');
      tab.skipIfKeyExist = c[0][0].functions[0].content.map(obj => obj.key.split('_')[0]);
    } else {
      tab.parser = 'none';
      tab.targetEntities = [];
      tab.skipIfKeyExist = [];
    }

    // parse responses
    tab.initialResponse = node.content.questions.find(
      q => q.question_type === 'initial_response',
    ).msg;
    tab.failureResponse = node.content.questions.find(
      q => q.question_type === 'failure_response',
    ).msg;

    // parse parseFromThisNode
    tab.parseFromThisNode = node.default_parser_with_suffix;
    return tab;
  },
  parseEdgeTab(node) {
    const tab = {};
    const nodeType = node.node_type || '';

    // render edges, normalEdges
    const edges = node.edges;
    tab.normalEdges = edges.filter(edge => edge.edge_type === 'normal' || edge.edge_type === 'qq');

    // render exceedThenGoto, elseInto
    if (nodeType !== 'entry') {
      let exceedGotoEdge = edges.find(edge => edge.edge_type === 'exceedThenGoTo');
      if (!exceedGotoEdge) {
        exceedGotoEdge = edges.find((edge) => {
          if (edge.condition_rules &&
             edge.condition_rules.length > 0 &&
             edge.condition_rules[0].length > 0 &&
             edge.condition_rules[0][0].functions &&
             edge.condition_rules[0][0].functions.length > 0 &&
             edge.condition_rules[0][0].functions[0].content_text_array &&
             edge.condition_rules[0][0].functions[0].content_text_array.length > 0 &&
             edge.condition_rules[0][0].functions[0].content_text_array[0] === '若超过节点对话轮数限制'
            ) {
            edge.edge_type = 'exceedThenGoTo';
            return true;
          }
          return false;
        });
      }
      if (exceedGotoEdge) {
        tab.exceedThenGoto = exceedGotoEdge.to_node_id;
      } else {
        tab.exceedThenGoto = null;
      }
    }
    const elseIntoEdge = edges.find(edge => edge.edge_type === 'else_into');
    tab.elseInto = elseIntoEdge.to_node_id;

    // render dialogueLimit
    if (node.node_dialogue_cnt_limit) {
      tab.dialogueLimit = node.node_dialogue_cnt_limit;
    } else {
      const dialogueLimitEdge = edges.find(edge =>
        edge.edge_type === 'hidden' &&
        edge.actions &&
        edge.actions.length >= 1 &&
        edge.actions[0].key === 'sys_node_dialogue_cnt_limit',
      );
      if (dialogueLimitEdge) {
        tab.dialogueLimit = dialogueLimitEdge.actions[0].val;
      } else {
        tab.dialogueLimit = 3;
      }
    }
    return tab;
  },
  // convert tab data to node
  convertTabDataToNode(tabData) {
    const node = {
      node_id: tabData.nodeId,
      node_type: tabData.nodeType,
      description: tabData.nodeName,
      edges: this.convertTabDataToEdges(tabData),
      global_vars: [],
      warnings: [],
      content: {},
    };
    if (tabData.nodeType === 'dialogue') {
      node.content = this.componseDialogueContent(tabData);
      node.default_parser_with_suffix = tabData.settingTab.parseFromThisNode;
      node.node_dialogue_cnt_limit = tabData.edgeTab.dialogueLimit;
    }
    return node;
  },
  // convert tab data to content
  convertTabDataToContent(tabData) {
    let content = {};
    if (tabData.nodeType === 'dialogue') {
      content = {};
    }
    return content;
  },
  componseDialogueContent(tabData) {
    const questions = [];
    if (tabData.settingTab.parser !== 'none' &&
        tabData.settingTab.targetEntities.length > 0) {
        // a default parser had been selected
        // insert skip_response
      let skipIfKeyExist = tabData.settingTab.skipIfKeyExist;
      const parseFromThisNode = tabData.settingTab.parseFromThisNode;
      if (parseFromThisNode) {
        const nodeId = tabData.nodeId;
        skipIfKeyExist = skipIfKeyExist.map(key => `${key}_${nodeId}`);
      }
      const skipQ = this.questionTemplste('skip_response');
      skipQ.condition_rules = skipIfKeyExist.map(key => [
        this.conditionContainKey([key]),
      ]);
      questions.push(skipQ);
    }
    // insert failure_response
    const failureQ = this.questionTemplste('failure_response');
    failureQ.msg = tabData.settingTab.failureResponse;
    failureQ.condition_rules = this.conditionParsingFailedIs(true);
    questions.push(failureQ);

    // insert initial_response
    const initialQ = this.questionTemplste('initial_response');
    initialQ.msg = tabData.settingTab.initialResponse;
    questions.push(initialQ);
    return {
      questions,
    };
  },
  questionTemplste(type) {
    return {
      question_type: type,
      msg: null,
      condition_rules: [],
    };
  },
  // convert tab data to edges
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
  conditionParsingFailedIs(val) {
    return this.conditionKeyValMatch('==', 'parsing_failed', val);
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
  conditionContainKey(keys) {
    const content = keys.map(key => ({ key }));
    return {
      source: 'global_info',
      functions: [
        {
          content,
          function_name: 'contain_key',
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
