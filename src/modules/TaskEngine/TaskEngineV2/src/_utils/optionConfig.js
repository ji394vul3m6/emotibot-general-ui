export default {
  nodeType2Tabs() {
    return {
      entry: ['triggerTab', 'edgeTab'],
      dialogue: ['settingTab', 'edgeTab'],
      nlu_pc: ['nluPCSettingTab', 'entityCollectingTab', 'edgeTab'],
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
      {
        text: 'Intent_Rewrite',
        value: 'Intent_Rewrite',
      },
      {
        text: 'SentenceType',
        value: 'SentenceType',
      },
      {
        text: 'UserID',
        value: 'UserID',
      },
      {
        text: 'SpeechAct',
        value: 'SpeechAct',
      },
      {
        text: 'personStandard',
        value: 'personStandard',
      },
      {
        text: 'polarity',
        value: 'polarity',
      },
      {
        text: 'NE',
        value: 'NE',
      },
      {
        text: 'NE_MT',
        value: 'NE_MT',
      },
      {
        text: 'memory',
        value: 'memory',
      },
    ];
  },
};
