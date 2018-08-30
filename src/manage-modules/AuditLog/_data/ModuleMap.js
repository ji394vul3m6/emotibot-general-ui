const robotActionType = {
  all: {
    id: '-1',
    text_path: 'general.all',
  },
  create: {
    id: 0,
    text_path: 'privileges.actions.create',
  },
  edit: {
    id: 1,
    text_path: 'privileges.actions.edit',
  },
  delete: {
    id: 2,
    text_path: 'privileges.actions.delete',
  },
  import: {
    id: 3,
    text_path: 'privileges.actions.import',
  },
  export: {
    id: 4,
    text_path: 'privileges.actions.export',
  },
  login: {
    id: 6,
    text_path: 'privileges.actions.login',
  },
  publish: {
    id: 7,
    text_path: 'privileges.actions.publish',
  },
  active: {
    id: 8,
    text_path: 'privileges.actions.active',
  },
  deactive: {
    id: 9,
    text_path: 'privileges.actions.deactive',
  },
};

const robotModuleList = {
  all: {
    id: '-1',
    text_path: 'general.all',
  },
  statistic_dash: {
    id: 0,
    text_path: 'pages.robot_setting.robot_chat_skill',
  },
  ssm: {
    id: 1,
    text_path: 'pages.robot_setting.robot_function',
  },
  qa_label: {
    id: 2,
    text_path: 'pages.ssm.module_name',
  },
  robot_profile: {
    id: 3,
    text_path: 'pages.robot_setting.robot_profile',
  },
  wordbank: {
    id: 5,
    text_path: 'pages.wordbank.module_name',
  },
  statistics: {
    id: 6,
    text_path: 'pages.statistics.module_name',
  },
  user_manage: {
    id: 7,
    text_path: 'pages.privileges.user_manage',
  },
  role_manage: {
    id: 8,
    text_path: 'pages.privileges.role_manage',
  },
  task_engine: {
    id: 9,
    text_path: 'pages.task_engine.module_name',
  },
  intent_engine: {
    id: 10,
    text_path: 'pages.intent_engine.module_name',
  },
};
// 4: '开关管理',

export default {
  robotActionType,
  robotModuleList,
};
