export default {
  privileges: {
    role: '角色',
    role_name: '角色名',
    privileges: '权限',

    actions: {
      edit: '编辑',
      view: '查看',
      add: '新增',
    },
  },
  robot_setting: {
    model_rebuild: '重新建模',
    rebuild_msg: '点击“重新建模”，您的所有配置将于10分钟左右生效，在此期间将不能再次点击按钮，建议将所有修改都完成后再点“重新建模”，避免您的等待时间。如果忘记点击也没关系，自动重新建模是一小时一次。',
    modify_qas: '修改语料',

    weather: '天气模块',
    computation: '数学计算模块',
    joke: '笑话模块',
    story: '讲故事模块',
    riddle: '猜谜语模块',
    chengyu: '成语模块',
    all_active: '全部开启',
    all_deactive: '全部关闭',
  },
  pages: {
    privileges: {
      module_name: '权限管理',
      role_manage: '角色管理',
      user_manage: '用户管理',
    },
    robot_setting: {
      module_name: '机器人设置',
      robot_profile: '机器人形象',
      robot_function: '机器人功能',
    },
  },
  general: {
    add: '新增',
    actions: '操作',
    edit: '编辑',
    delete: '删除',
    question: '问题',
    answer: '答案',
    ext_answer: '答案扩展',
    ok: '确认',
    cancel: '取消',
    loading: '读取中',
    error_code: '错误代码',
    error: '错误',
  },
  error_msg: {
    client_error: '呼叫端口错误',
    server_error: '伺服器错误',
  },
  http_status: {
    default: '伺服器错误',
    401: '授权已失效，请重新登录',
    404: '伺服器错误，API未实作',
    413: '上传文档大小超过要求',
  },
};
