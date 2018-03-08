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
  wordbank: {
    add_folder: '新增目录',
    add_dictionary: '新增词库',

    edit_dictionary: '编辑词库',
    word: '词语',
    synonym: '同义词',
    synonym_note: '单个词长度最多35，总长度不可超过5000',

    err_synonym_length: '单个词长度超過{length}',
    err_synonym_total_length: '总长度超过{length}',

    import_history: '导入纪录',

    batch_status: '导入结果',
    batch_import: '批量导入词库',
    batch_export: '批量导出词库',
    download_batch_import_template: '下载批量导入词库模板',
    description: '提示：',
    version: '词库版本',
    last_version: '上一个版本',
    current_version: '当前版本',
    last_import_result: '上次上传结果',
    result: {
      success: '导入成功',
      fail: '导入失败',
      loading: '导入中',
      empty: '尚未导入',
    },
    wait_for_result: '导入处理中，请五分钟后查看结果',
    download_import_result: '下载已导入词库',
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
    wordbank: {
      module_name: '词库',
      wordbank_list: '词库关系',
      wordbank_upload: '词库导入',
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
    upload: '上传',
    browse: '浏览',
  },
  error_msg: {
    client_error: '呼叫端口错误',
    server_error: '伺服器错误',
    request_fail: '请求失败',
  },
  http_status: {
    default: '伺服器错误',
    401: '授权已失效，请重新登录',
    404: '伺服器错误，API未实作',
    413: '上传文档大小超过要求',
  },
};
