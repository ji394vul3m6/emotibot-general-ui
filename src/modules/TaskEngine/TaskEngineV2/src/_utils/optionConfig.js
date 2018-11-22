export default {
  nodeType2Tabs() {
    return {
      entry: ['settingBasicTab', 'triggerTab', 'edgeTab'],
      dialogue: ['settingTab', 'edgeTab'],
      nlu_pc: ['settingBasicTab', 'entityCollectingTab', 'edgeTab'],
      restful: ['restfulSettingTab', 'restfulEdgeTab'],
      parameter_collecting: ['settingBasicTab', 'paramsCollectingTab', 'paramsCollectingEdgeTab'],
      action: ['settingBasicTab', 'actionTab', 'edgeTab'],
    };
  },
  getEntityListMap() {
    const commonEntityOptions = [
      'time', 'city', 'landmark', 'money', 'time_period',
      'phone_call', 'adjust_light', 'adjust_volume', 'movie_name', 'song_name',
      'star_name', 'teleplay_name', 'album_name', 'number',
    ];
    const taskEntityOptions = [
      'fromPlace', 'toPlace', 'departDate', 'arriveDate', 'returnDate',
    ];
    const hotelEntityOptions = [
      'City', 'CheckinDate', 'CheckoutDate', 'LandMark', 'HotelName',
      'Star', 'Price',
    ];
    return {
      common_parser: commonEntityOptions,
      task_parser: taskEntityOptions,
      hotel_parser: hotelEntityOptions,
    };
  },
  getEntityModuleOptionsMap() {
    const entityListMap = this.getEntityListMap();
    return {
      none: [],
      common_parser: entityListMap.common_parser.map(option => ({
        // 'time_module', 'city_module', 'landmark_module', 'money_module', 'time_period_module',
        text: option,
        value: `${option}_module`,
      })),
      task_parser: entityListMap.task_parser.map((option) => {
        // from_place,to_place,depart_date,arrive_date,return_date
        // CamelCase to snake_case
        const snakeCase = option.replace(/[\w]([A-Z])/g, m => `${m[0]}_${m[1]}`).toLowerCase();
        return {
          text: option,
          value: snakeCase,
        };
      }),
      hotel_parser: entityListMap.hotel_parser.map(option => ({
        // City,CheckinDate,CheckoutDate,LandMark,HotelName,Star,Price
        text: option,
        value: option,
      })),
    };
  },
  getNodeTypes(context) {
    const nodeTypes = [
      {
        type: 'entry',
        name: context.$t('task_engine_v2.node_type.entry'),
        image: 'te_dialoague.png',
        description: '',
      },
      {
        type: 'dialogue',
        name: context.$t('task_engine_v2.node_type.dialogue'),
        image: 'te_dialoague.png',
        description: context.$t('task_engine_v2.node_type.dialogue_description'),
      },
      {
        type: 'parameter_collecting',
        name: context.$t('task_engine_v2.node_type.parameter_collecting'),
        image: 'te_dialoague.png',
        description: context.$t('task_engine_v2.node_type.parameter_collecting_description'),
      },
      {
        type: 'restful',
        name: context.$t('task_engine_v2.node_type.restful'),
        image: 'te_dialoague.png',
        description: context.$t('task_engine_v2.node_type.restful_description'),
      },
      {
        type: 'nlu_pc',
        name: context.$t('task_engine_v2.node_type.nlu_pc'),
        image: 'te_dialoague.png',
        description: context.$t('task_engine_v2.node_type.nlu_pc_description'),
      },
      {
        type: 'action',
        name: context.$t('task_engine_v2.node_type.action'),
        image: 'te_dialoague.png',
        description: context.$t('task_engine_v2.node_type.action_description'),
      },
    ];
    return nodeTypes;
  },
  getWarningMsgMap(context) {
    return {
      has_exit_connection: context.$t('task_engine_v2.warnings.has_exit_connection'),
      missing_inbound_connection: context.$t('task_engine_v2.warnings.missing_inbound_connection'),
      missing_outbound_connection: context.$t('task_engine_v2.warnings.missing_outbound_connection'),
      missing_entry_trigger: context.$t('task_engine_v2.warnings.missing_entry_trigger'),
      missing_response: context.$t('task_engine_v2.warnings.missing_response'),
      missing_failure_response: context.$t('task_engine_v2.warnings.missing_failure_response'),
      missing_pc_response: context.$t('task_engine_v2.warnings.missing_pc_response'),
      missing_pc_failure_response: context.$t('task_engine_v2.warnings.missing_pc_failure_response'),
    };
  },
  getSourceOptions(context) {
    return [
      {
        text: context.$t('task_engine_v2.condition_block.source.text'),
        value: 'text',
      },
      {
        text: context.$t('task_engine_v2.condition_block.source.global_info'),
        value: 'global_info',
      },
      // {
      //   text: context.$t('task_engine_v2.condition_block.source.cu'),
      //   value: 'cu',
      // },
    ];
  },
  getFuncOptionMap(context) {
    const textFuncs = [
      'match', 'contains', 'regular_exp', 'common_parser', 'task_parser',
      'hotel_parser', 'user_custom_parser', 'polarity_parser', 'api_parser', 'qq', 'intent_parser',
    ];
    const globalIngoFuncs = [
      'key_val_match', 'key_key_match', 'contain_key', 'not_contain_key', 'list_length_match',
      'counter_check', 'user_custom_transform', 'regular_exp_from_var', 'assign_value', 'remove_key',
    ];
    const cuFuncs = ['cu_parser', 'custom_cu_parser'];
    return {
      text: textFuncs.map((func) => {
        const key = `task_engine_v2.condition_block.func.${func}`;
        return {
          text: context.$t(key),
          value: func,
        };
      }),
      global_info: globalIngoFuncs.map((func) => {
        const key = `task_engine_v2.condition_block.func.${func}`;
        return {
          text: context.$t(key),
          value: func,
        };
      }),
      cu: cuFuncs.map((func) => {
        const key = `task_engine_v2.condition_block.func.${func}`;
        return {
          text: context.$t(key),
          value: func,
        };
      }),
    };
  },
  getRainbowColors() {
    return [
      '#db6b6c', '#4F68F7', '#44895F', '#f8c954', '#7e47ae',
      '#dc7598', '#5a99d2', '#89B458', '#eaa355', '#8a7168',
    ];
  },
  getBasicCompareOptions(context) {
    return [
      {
        text: context.$t('task_engine_v2.condition_block.operator.equal_to'),
        value: '==',
      },
      {
        text: context.$t('task_engine_v2.condition_block.operator.not_equal_to'),
        value: '!=',
      },
      {
        text: context.$t('task_engine_v2.condition_block.operator.greater_than'),
        value: '>',
      },
      {
        text: context.$t('task_engine_v2.condition_block.operator.greater_or_equal_to'),
        value: '>=',
      },
      {
        text: context.$t('task_engine_v2.condition_block.operator.less_than'),
        value: '<',
      },
      {
        text: context.$t('task_engine_v2.condition_block.operator.less_or_equal_to'),
        value: '<=',
      },
    ];
  },
  getKeyValMatchCompareOptions(context) {
    const options = this.getBasicCompareOptions(context);
    return [
      ...options,
      {
        text: context.$t('task_engine_v2.condition_block.operator.ignore_case_compare'),
        value: 'ignore_case_compare',
      },
      {
        text: context.$t('task_engine_v2.condition_block.operator.reg_exp'),
        value: 'reg_exp',
      },
    ];
  },
  getKeyKeyMatchCompareOptions(context) {
    const options = this.getBasicCompareOptions(context);
    return [
      ...options,
      {
        text: context.$t('task_engine_v2.condition_block.operator.ignore_case_compare'),
        value: 'ignore_case_compare',
      },
      {
        text: context.$t('task_engine_v2.condition_block.operator.in'),
        value: 'in',
      },
    ];
  },
  getListLengthMatchCompareOptions(context) {
    return this.getBasicCompareOptions(context);
  },
  getCounterCheckOptions(context) {
    return [
      {
        text: context.$t('task_engine_v2.condition_block.node_counter'),
        value: 'node_counter',
      },
      {
        text: context.$t('task_engine_v2.condition_block.scenario_counter'),
        value: 'scenario_counter',
      },
    ];
  },
  getCuParserOptions() {
    return [
      {
        text: 'Intent',
        value: 'Intent',
      },
    ];
  },
};
