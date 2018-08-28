import optionConfig from './optionConfig';
import scenarioInitializer from './scenarioInitializer';
import api from '../../../_api/taskEngine';

export default {
  convertJsonToVersion(toVersion, jsonData) {
    let jsonVersion;
    if ('version' in jsonData.moduleData) {
      jsonVersion = jsonData.moduleData.version;
    } else {
      jsonVersion = '1.0';
    }
    if (toVersion === '1.1') {
      return this.convertJsonToVersion_1_1(jsonVersion, jsonData);
    }
    return {};
  },
  convertJsonToVersion_1_1(jsonVersion, jsonData) {
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
      if (tab === 'triggerTab') {
        tabData.triggerTab = this.parseTriggerTab(node);
      } else if (tab === 'settingTab') {
        tabData.settingTab = this.parseSettingTab(node);
      } else if (tab === 'edgeTab') {
        tabData.edgeTab = this.parseEdgeTab(node);
      } else if (tab === 'settingBasicTab') {
        tabData.settingBasicTab = this.parseSettingBasicTab(node);
      } else if (tab === 'entityCollectingTab') {
        tabData.entityCollectingTab = {
          relatedEntities: {
            relatedEntityCollectorList: [],
            relatedEntityMatrix: [],
          },
          tde_setting: {},
        };
      } else if (tab === 'restfulSettingTab') {
        tabData.restfulSettingTab = this.parseRestfulSettingTab(node);
      } else if (tab === 'restfulEdgeTab') {
        tabData.restfulEdgeTab = this.parseRestfulEdgeTab(node);
      } else if (tab === 'paramsCollectingTab') {
        tabData.paramsCollectingTab = this.parseParamsCollectingTab(node);
      }
    });
    return {
      nodeId: node.node_id,
      nodeName: node.description || '',
      nodeType,
      triggerTab: tabData.triggerTab,
      settingTab: tabData.settingTab,
      edgeTab: tabData.edgeTab,
      settingBasicTab: tabData.settingBasicTab,
      entityCollectingTab: tabData.entityCollectingTab,
      restfulSettingTab: tabData.restfulSettingTab,
      restfulEdgeTab: tabData.restfulEdgeTab,
      paramsCollectingTab: tabData.paramsCollectingTab,
    };
  },
  parseTriggerTab(node) {
    if (!node.entry_condition_rules) return undefined;
    const rules = node.entry_condition_rules;
    return {
      rules,
    };
  },
  parseSettingBasicTab(node) {
    const tab = {};
    // render nodeType, nodeName
    tab.nodeType = node.node_type || '';
    tab.nodeName = node.description || '';
    return tab;
  },
  parseSettingTab(node) {
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
    const edges = node.edges || [];
    tab.normalEdges = edges.filter(edge => edge.edge_type === 'normal' || edge.edge_type === 'qq');

    // render exceedThenGoto
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
    // render elseInto
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
  parseRestfulSettingTab(node) {
    let tab = {};
    if (node.content && node.content.requests &&
        node.content.requests.length > 0) {
      const request = node.content.requests[0];
      tab = {
        nodeType: node.node_type || '',
        nodeName: node.description || '',
        url: request.url,
        method: request.method,
        contentType: request.headers['Content-Type'],
        body: request.body.content,
        rtnVarName: request.rtn_var_name,
      };
    }
    return tab;
  },
  parseRestfulEdgeTab(node) {
    const edges = node.edges || [];
    const restfulFailedEdge = edges.find((edge) => {
      if (edge.condition_rules && edge.condition_rules.length > 0 &&
          edge.condition_rules[0].length > 0 &&
          edge.condition_rules[0][0].functions &&
          edge.condition_rules[0][0].functions.length > 0) {
        const funcName = edge.condition_rules[0][0].functions[0].function_name;
        if (funcName === 'restful_failed') {
          return true;
        }
      }
      return false;
    });
    const restfulSucceedEdge = edges.find((edge) => {
      if (edge.condition_rules && edge.condition_rules.length > 0 &&
          edge.condition_rules[0].length > 0 &&
          edge.condition_rules[0][0].functions &&
          edge.condition_rules[0][0].functions.length > 0) {
        const funcName = edge.condition_rules[0][0].functions[0].function_name;
        if (funcName === 'restful_succeed') {
          return true;
        }
      }
      return false;
    });
    const tab = {
      restfulFailedThenGoto: restfulFailedEdge.to_node_id,
      restfulSucceedThenGoto: restfulSucceedEdge.to_node_id,
    };
    return tab;
  },
  parseParamsCollectingTab(node) {
    const tab = {};
    tab.params = [];
    node.content.questions.forEach((q, index) => {
      const param = {};
      param.msg = q.msg;
      param.parse_failed_msg = q.parse_failed_msg;
      param.parsers = [];
      const conditionRules = node.content.parsers[index].condition_rules;
      conditionRules.forEach((conditionRule) => {
        const parser = {};
        parser.content = conditionRule[0].functions[0].content;
        parser.funcName = conditionRule[0].functions[0].function_name;
        parser.skipIfKeyExist = [];
        if (parser.funcName === 'regular_exp') {
          conditionRule[0].functions[0].content.operations.forEach((operation) => {
            parser.skipIfKeyExist.push(operation.key);
          });
        } else if (parser.funcName === 'hotel_parser' ||
                  parser.funcName === 'common_parser' ||
                  parser.funcName === 'task_parser') {
          parser.skipIfKeyExist.push(...conditionRule[0].functions[0].content_text_array);
        } else if (parser.funcName === 'user_custom_parser') {
          parser.skipIfKeyExist.push(conditionRule[0].functions[0].content.to_key);
        } else if (parser.funcName === 'polarity_parser') {
          parser.skipIfKeyExist.push(conditionRule[0].functions[0].content.key);
        } else if (parser.funcName === 'api_parser') {
          parser.skipIfKeyExist.push(...conditionRule[0].functions[0].content_text_array);
        }
        param.parsers.push(parser);
      });
      tab.params.push(param);
    });
    return tab;
  },
  convertUiNodesToNodes(uiNodes, setting) {
    const nodes = uiNodes.map(uiNode => this.convertUiNodeToNode(uiNode, setting));
    const exitNode = scenarioInitializer.initialExitNode();
    return [exitNode].concat(nodes);
  },
  // convert uiNode to node
  convertUiNodeToNode(uiNode, setting) {
    console.log(uiNode);
    const edges = this.convertUiNodeToEdges(uiNode, setting);
    const globalVars = this.getGlobalVars(edges);
    const node = {
      node_id: uiNode.nodeId,
      node_type: uiNode.nodeType,
      description: uiNode.nodeName,
      edges,
      global_vars: globalVars,
      warnings: [],
      content: {},
    };
    if (uiNode.nodeType === 'entry') {
      node.entry_condition_rules = uiNode.triggerTab.rules;
    } else if (uiNode.nodeType === 'dialogue') {
      node.content = this.componseDialogueContent(uiNode);
      node.default_parser_with_suffix = uiNode.settingTab.parseFromThisNode;
      node.node_dialogue_cnt_limit = uiNode.edgeTab.dialogueLimit;
    } else if (uiNode.nodeType === 'nlu_pc') {
      node.content = this.composeNLUPCContent(
        uiNode.entityCollectingTab.entityCollectorList,
        uiNode.entityCollectingTab.re_parsers,
        uiNode.entityCollectingTab.register_json,
      );
    } else if (uiNode.nodeType === 'restful') {
      node.content = this.composeRestfulContent(uiNode);
      node.global_vars.push(uiNode.restfulSettingTab.rtnVarName);
    }
    if (uiNode.nodeType === 'parameter_collecting') {
      node.content = this.composePCContent(
        uiNode.paramsCollectingTab.params,
      );
    }
    // TODO
    // node.global_vars.push(...parametersInParsers)
    return node;
  },
  composePCContent(params) {
    const content = {};
    content.parsers = [];
    content.questions = [];
    params.forEach((param) => {
      const conditionRules = [];
      param.parsers.forEach((parser) => {
        conditionRules.push([{
          source: 'text',
          functions: [{
            content: parser.content,
            function_name: parser.funcName,
          }],
        }]);
      });
      content.parsers.push({ condition_rules: conditionRules });
      content.questions.push({
        msg: param.msg,
        parse_failed_msg: param.parse_failed_msg,
        condition_rules: [[{
          source: 'global_info',
          functions: [{
            content: [param.skipIfKeyExist.map(key => ({ key }))],
            function_name: 'not_contain_key',
          }],
        }]],
      });
    });
    return content;
  },
  composeNLUPCContent(entityCollectorList, reParsers, registerJson) {
    let entities;
    console.log(entityCollectorList);
    if (registerJson && registerJson.slotDefs) {
      entities = registerJson.slotDefs.map(slot => ({ entityName: slot.slotName, prompt: null }));
    } else {
      entities = entityCollectorList;
    }
    return {
      entities,
      reParsers,
    };
  },
  componseDialogueContent(uiNode) {
    const questions = [];
    if (uiNode.settingTab.parser !== 'none' &&
        uiNode.settingTab.skipIfKeyExist.length > 0) {
        // a default parser had been selected
        // insert skip_response
      let skipIfKeyExist = uiNode.settingTab.skipIfKeyExist;
      const parseFromThisNode = uiNode.settingTab.parseFromThisNode;
      if (parseFromThisNode) {
        const nodeId = uiNode.nodeId;
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
    failureQ.msg = uiNode.settingTab.failureResponse;
    failureQ.condition_rules = [[this.conditionParsingFailedIs(true)]];
    questions.push(failureQ);

    // insert initial_response
    const initialQ = this.questionTemplste('initial_response');
    initialQ.msg = uiNode.settingTab.initialResponse;
    questions.push(initialQ);
    return {
      questions,
    };
  },
  composeRestfulContent(uiNode) {
    if (!uiNode.restfulSettingTab) return {};
    const tab = uiNode.restfulSettingTab;
    const content = {
      requests: [
        {
          body: {
            content: tab.body,
          },
          headers: {
            'Content-Type': tab.contentType,
          },
          method: tab.method,
          rtn_var_name: tab.rtnVarName,
          url: tab.url,
        },
      ],
    };
    return content;
  },
  questionTemplste(type) {
    return {
      question_type: type,
      msg: null,
      condition_rules: [],
    };
  },
  // convert tab data to edges
  convertUiNodeToEdges(uiNode, setting) {
    let edges = [];
    if (uiNode.nodeType === 'entry') {
      const hiddenEdges = this.composeEntryNodeHiddenEdges(uiNode, setting);
      const elseInto = this.edgeElseInto(uiNode.nodeId, uiNode.edgeTab.elseInto);
      edges = [
        ...hiddenEdges,
        ...uiNode.edgeTab.normalEdges,
        elseInto,
      ];
    } else if (uiNode.nodeType === 'dialogue') {
      const hiddenEdges = this.composeDialogueNodeHiddenEdges(uiNode);
      const hiddenSetCntLimit = this.edgeHiddenSetNodeDialogueCntLimit(
        uiNode.edgeTab.dialogueLimit,
      );
      const exceedThenGoto = this.edgeExceedThenGoTo(uiNode.edgeTab.exceedThenGoto);
      const elseInto = this.edgeElseInto(uiNode.nodeId, uiNode.edgeTab.elseInto);
      edges = [
        ...hiddenEdges,
        ...uiNode.edgeTab.normalEdges,
        hiddenSetCntLimit,
        exceedThenGoto,
        elseInto,
      ];
    } else if (uiNode.nodeType === 'restful') {
      const tab = uiNode.restfulEdgeTab;
      const succeedEdge = this.edgeRestfulSucceed(tab.restfulSucceedThenGoto);
      const failedEdge = this.edgeRestfulFailed(tab.restfulFailedThenGoto);
      edges = [failedEdge, succeedEdge];
    }
    return edges;
  },
  composeEntryNodeHiddenEdges(uiNode, setting) {
    const hidden1 = this.hiddenEdgeTemplate();
    hidden1.actions = [
      this.actionSetNodeDialogueCnt(0),
      this.actionSetScenarioDialogueCnt(0),
      this.actionSetScenarioDialogueCntLimit(setting.scenarioDialogueCntLimit),
      this.actionSetNodeDialogueCntLimit(setting.nodeDialogueCntLimit),
    ];
    return [
      hidden1,
      this.hiddenEdgeTemplate(),
      this.hiddenEdgeTemplate(),
    ];
  },
  composeDialogueNodeHiddenEdges(uiNode) {
    const parser = uiNode.settingTab.parser;
    if (parser === 'none') {
      return this.composeNoParserHiddenEdges(uiNode);
    }
    return this.composeWithParserHiddenEdges(uiNode);
  },
  composeNoParserHiddenEdges(uiNode) {
    const dialogueLimit = uiNode.edgeTab.dialogueLimit;
    const hidden1 = this.hiddenEdgeTemplate();
    hidden1.actions = [
      this.actionUpdateConfirmStatus(),
      this.actionSetNodeDialogueCntLimit(dialogueLimit),
    ];
    return [
      hidden1,
      this.hiddenEdgeTemplate(),
      this.hiddenEdgeTemplate(),
    ];
  },
  composeWithParserHiddenEdges(uiNode) {
    const nodeId = uiNode.nodeId;
    const parser = uiNode.settingTab.parser;
    const dialogueLimit = uiNode.edgeTab.dialogueLimit;
    const targetEntities = uiNode.settingTab.targetEntities;
    let skipIfKeyExist = uiNode.settingTab.skipIfKeyExist;
    const parseFromThisNode = uiNode.settingTab.parseFromThisNode;

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
      this.conditionParser(parser, targetEntities, nodeId),
    ]];
    hidden2.actions = [
      this.actionSetParseFailed(false),
    ];

    const hidden3 = this.hiddenEdgeTemplate();
    if (skipIfKeyExist.length > 0) {
      hidden3.to_node_id = nodeId;
      hidden3.condition_rules = [[
        this.conditionDialogueCntLessThan(dialogueLimit),
        this.conditionCounterCheck('scenario_counter_rev'),
        this.conditionNotContainKey(skipIfKeyExist),
      ]];
    }
    const hiddenEdges = [hidden1, hidden2, hidden3];
    return hiddenEdges;
  },
  getGlobalVars(edges) {
    const globalVars = [];
    edges.forEach((edge) => {
      let andRules = [];
      if (edge.condition_rules &&
          edge.condition_rules instanceof Array &&
          edge.condition_rules.length > 0) {
        andRules = edge.condition_rules[0];
      }
      andRules.forEach((rule) => {
        let functions = [];
        if (rule.functions && rule.functions instanceof Array) {
          functions = rule.functions;
        }
        functions.forEach((func) => {
          const vars = this.getGlobalVarsFromFunction(func);
          globalVars.push(...vars);
        });
      });
    });
    return globalVars;
  },
  getGlobalVarsFromFunction(func) {
    const funcName = func.function_name;
    let vars = [];
    if (funcName === 'regular_exp') {
      if (func.content && func.content.operations && func.content.operations instanceof Array) {
        vars = func.content.operations.map(o => o.key);
      }
    } else if (funcName === 'hotel_parser') {
      if (func.content && func.content.tags && func.content.key_suffix) {
        vars = func.content.tags.split(',').filter(
          tag => tag !== 'multiselect-all',
        ).map(
          tag => tag + func.content.key_suffix,
        );
      }
    } else if (funcName === 'common_parser') {
      if (func.content && func.content.tags && func.content.key_suffix) {
        vars = func.content.tags.split(',').filter(
          tag => tag !== 'multiselect-all',
        ).map((tag) => {
          // remove '_module'
          const key = tag.replace('_module', '');
          return key + func.content.key_suffix;
        });
      }
    } else if (funcName === 'task_parser') {
      if (func.content && func.content.tags && func.content.key_suffix) {
        vars = func.content.tags.split(',').filter(
          tag => tag !== 'multiselect-all',
        ).map((tag) => {
          // snake_case to CamelCase
          const key = tag.replace(/_([\w])/g, m => m[1].toUpperCase());
          return key + func.content.key_suffix;
        });
      }
    } else if (funcName === 'user_custom_parser') {
      if (func.content && func.content.to_key) {
        vars = [func.content.to_key];
      }
    } else if (funcName === 'polarity_parser') {
      if (func.content && func.content.key && func.content.key_suffix) {
        // vars = [func.content.key + func.content.key_suffix];
        vars = [func.content.key];
      }
    } else if (funcName === 'user_custom_transform') {
      if (func.content && func.content.to_key) {
        vars = [func.content.to_key];
      }
    } else if (funcName === 'regular_exp_from_var') {
      if (func.content && func.content.operations && func.content.operations instanceof Array) {
        vars = func.content.operations.map(o => o.key);
      }
    } else if (funcName === 'assign_value') {
      if (func.content && func.content.key) {
        vars = [func.content.key];
      }
    }
    return vars;
  },
  edgeRestfulSucceed(toNode) {
    return {
      actions: [this.actionSetNodeDialogueCnt(0)],
      condition_rules: [[
        this.conditionRestfulSucceed(),
      ]],
      edge_type: 'normal',
      to_node_id: toNode,
    };
  },
  edgeRestfulFailed(toNode) {
    return {
      actions: [this.actionSetNodeDialogueCnt(0)],
      condition_rules: [[
        this.conditionRestfulFailed(),
      ]],
      edge_type: 'normal',
      to_node_id: toNode,
    };
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
      actions: [],
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
  conditionParser(parser, tags, nodeId) {
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
          function_name: parser,
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
  conditionRestfulSucceed() {
    return {
      functions: [
        {
          content: '',
          function_name: 'restful_succeed',
        },
      ],
      source: 'global_info',
    };
  },
  conditionRestfulFailed() {
    return {
      functions: [
        {
          content: '',
          function_name: 'restful_failed',
        },
      ],
      source: 'global_info',
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
  actionSetScenarioDialogueCnt(cnt) {
    return this.actionSetToGlobalInfo('sys_scenario_dialogue_cnt', cnt);
  },
  actionSetScenarioDialogueCntLimit(cnt) {
    return this.actionSetToGlobalInfo('sys_scenario_dialogue_cnt_limit', cnt);
  },
  actionSetToGlobalInfo(key, val) {
    return {
      operation: 'set_to_global_info',
      key,
      val,
    };
  },
  convertToTDERegistryData(scenarioId, entityCollectingTab, nodeId) {
    if (entityCollectingTab.register_json) { // manually give register JSON
      const registerJson = JSON.parse(JSON.stringify(entityCollectingTab.register_json));
      registerJson.taskId = `${nodeId}_${scenarioId}`;
      return registerJson;
    }
    const entityList = entityCollectingTab.entityCollectorList.map((item) => {
      if (item.ner.sourceType === 'custom') {
        return {
          slotName: item.entityName,
          slotType: item.ner.slotType,
          slotBizType: 'OrderProperty',
          slotValueOptions: item.ner.entitySynonymsList.map(elt => elt.entity),
        };
      }
      return {
        slotName: item.entityName,
        slotType: item.ner.slotType,
        slotBizType: 'OrderProperty',
        hidden: item.ner.hidden,
        needRecogize: item.ner.needRecogize,
        slotFinder: item.ner.slotFinder,
      };
    });
    const indices = [];
    entityCollectingTab.relatedEntities.relatedEntityMatrix.forEach((row) => {
      for (let i = 1; i < row.length; i += 1) {
        indices.push({
          product: row[0].entity,
          slotName: entityCollectingTab.relatedEntities.relatedEntityCollectorList[i].entityName,
          slotValue: row[i].entity,
        });
      }
    });
    let products = [];
    if (entityCollectingTab.relatedEntities.relatedEntityCollectorList.length > 0) {
      products = entityCollectingTab.relatedEntities
      .relatedEntityCollectorList[0].ner.entitySynonymsList.map((item) => {
        const tmpObj = {};
        tmpObj[entityCollectingTab.relatedEntities.relatedEntityCollectorList[0].entityName]
            = item.entity;
        return tmpObj;
      });
    }
    if (entityList.length > 0) {
      if (entityCollectingTab.relatedEntities.relatedEntityCollectorList.length > 0) {
        const productIndex = this.getEntityListIndex(entityList,
            entityCollectingTab.relatedEntities.relatedEntityCollectorList[0].entityName);
        entityList[productIndex].slotBizType = 'Product';
        for (let i = 1;
          i < entityCollectingTab.relatedEntities.relatedEntityCollectorList.length; i += 1) {
          const tmpIndex = this.getEntityListIndex(entityList,
              entityCollectingTab.relatedEntities.relatedEntityCollectorList[i].entityName);
          entityList[tmpIndex].slotBizType = 'ProductPropertySearchable';
        }
      }
    }
    const data = {
      taskId: `${nodeId}_${scenarioId}`,
      nlgTemplate: entityCollectingTab.tde_setting.nlgTemplate,
      service: entityCollectingTab.tde_setting.service,
      jumpOutTimes: isNaN(parseInt(entityCollectingTab.tde_setting.jumpOutTimes, 10)) ?
          undefined : parseInt(entityCollectingTab.tde_setting.jumpOutTimes, 10),
      slotDefs: entityList,
      intent: {
        operate: '订',
        target: '餐厅',
      },
      products,
      indices,
    };
    return data;
  },
  registerNluTdeScenario(scenarioId, nodes) {
    const that = this;
    nodes.filter(node => node.nodeType === 'nlu_pc').forEach((node) => {
      const entityCollectingTab = node.entityCollectingTab;
      if ((entityCollectingTab.entityCollectorList &&
           entityCollectingTab.entityCollectorList.length > 0)
          || entityCollectingTab.register_json) {
        const data = that.convertToTDERegistryData(
          scenarioId, entityCollectingTab, entityCollectingTab.nodeId);
        api.registerNluTdeScenario(data);
      }
    });
  },
};
