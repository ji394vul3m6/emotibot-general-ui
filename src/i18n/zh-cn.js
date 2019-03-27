export default {
  robot_config: {
    robot_config: '系统功能配置',
    config_content_error: '设定内容错误',
    ssm: {
      title: '问答',
      'ssm_context_support-info': '在常用问答中使用上下文',
      'uploadimg_server-pre': '答案中图片伺服器将使用 http://',
      'uploadimg_server-suf': '',
      'ssm_ml_threshold-pre': '当 ML 相似度信心分数为',
      'ssm_ml_threshold-suf': '时视为相同问题',
      'ssm_qq_threshold-pre': '当 QQ 相似度信心分数为',
      'ssm_qq_threshold-suf': '时视为相同问题',
    },
    chat: {
      title: '闲聊',
      'chat-editorial-pre': '信心分数高于',
      'chat-editorial-suf': '时使用竹间闲聊 I',
      'chat-editorial-custom-pre': '信心分数高于',
      'chat-editorial-custom-suf': '时使用客制闲聊',
      'chat-editorial-domain-pre': '信心分数高于',
      'chat-editorial-domain-suf': '时使用行业闲聊',
      'chat-editorial-sport-pre': '信心分数高于',
      'chat-editorial-sport-suf': '时使用竹间闲聊 II',
      'chat-robot-pre': '信心分数高于',
      'chat-robot-suf': '时使用竹间机器人形象',
      'chat-robot-custom-pre': '信心分数高于',
      'chat-robot-custom-suf': '时使用客制机器人形象',
    },
    robot: {
      title: '机器人',
      name: '自称',
      language: '出话语系',
      default: '我',
    },
    context: {
      title: '技能上下文',
    },
    'human-intent': {
      title: '转人工',
    },
    rule: '规则设置',
    faq: {
      title: 'FAQ',
      'faq-similar-question-range-pre': '匹配分数与阈值差距小于',
      'faq-similar-question-range-suf': '时，将其视为相似问',
      'faq-recommand-question-range-pre': '匹配分数与阈值差距小于',
      'faq-recommand-question-range-suf': '时，将其视为推荐问',
    },
    'task-engine': {
      title: '任务引擎',
      'task-engine-total-timeout-pre': '当任务引擎超过',
      'task-engine-total-timeout-suf': '毫秒无反应则视为超时',
      'task-engine-web-api-timeout-pre': '当任务引擎呼叫外部 API 超过',
      'task-engine-web-api-timeout-suf': '毫秒无反应则视为超时',
    },
    knowledge: {
      title: '知识图谱',
      'knowledge-threshold-pre': '匹配分数超过',
      'knowledge-threshold-suf': '时，使用知识图谱为答案',
    },
    command: {
      title: '指令',
    },
    intent: {
      title: '意图引擎',
      'intent-threshold-pre': '当意图信心分数超过',
      'intent-threshold-suf': '时，使用该意图',
    },
  },
  integration: {
    integration: '接入部署',
    enterpriseID: '企业 ID',
    robotID: '机器人 ID / AppID',
  },
  privileges: {
    role: '角色',
    user: '用户',
    password: '密码',
    role_name: '角色名',
    user_name: '用户名',
    privileges: '权限',
    user_count: '用户数',
    function_priv: '功能权限',

    placeholder_user_name: '请输入用户名',
    placeholder_password: '请输入密码',
    placeholder_modify_password: '若要变更则输入密码',
    placeholder_input_role_name: '请输入角色名',

    enterprise_admin: '企业管理员',

    no_roles: '无角色存在',
    no_users: '无用户存在',
    all_active: '开启全部',
    all_deactive: '关闭全部',

    check_delete: '确认要删除角色：{role}',
    check_delete_user: '确认要删除用户：{user}',
    delete_success: '删除成功',
    err_need_create_role: '请先新增角色',
    err_role_empty: '角色不可为空',

    actions: {
      edit: '编辑',
      view: '查看',
      create: '新增',
      delete: '删除',
      export: '导出',
      import: '导入',
      login: '登入',
      logout: '登出',
      publish: '发布',
      active: '启动',
      deactive: '关闭',
      mark: '标注',
      ignore: '忽略',
      cluster: '辅助分类',
    },

    modules: {
      statistic_dash: '统计概览',
      statistic_analysis: '统计分析',
      statistic_daily: '日志管理',
      statistic_audit: '操作记录',

      ssm: '常用标准问题',
      qa_label: '标签管理',

      qalist: '问答库',
      qatest: '对话测试',
      qa_chat_skill: '话术设置',
      qa_rule: '规则管理',

      robot_profile: '机器人形象',
      robot_chat_skill: '话术设置',
      robot_function: '技能设置',
      robot_command: '指令设置',
      robot_config: '机器人设定',
      wordbank: '词库',
      task_engine: '任务引擎',

      management: '权限管理',
      intent_manage: '意图引擎',
      integration: '接入部署',
    },
    tools: {
      encrypt: {
        title: '加密工具',
        button: '加密',
        copy_button: '复制',
        placeholder: {
          encrypt_from: '输入欲加密的文字',
          encrypt_to: '加密结果会显示在这里',
        },
        fail: '加密失败',
        copied: '已复制加密文字',
      },
    },
  },
  category: {
    title: '分类',
    setting: '设置',
    leave_setting: '离开设置',
    placeholder_category_name: '输入分类名称',
    add_root: '新增第一层分类',
    add_subcategory: '新增子分类',
    delete_category: '删除分类',
    empty_search_result: '无符合分类',
    all: '全部',
    no_category: '未分类',
    delete_category_msg: '确定要删除分类 {name} 及其子分类吗？',
  },
  statistics: {
    std_question_exists: '标准问题已存在',
    add_new_std_question: '新增标准问题',
    sessions_time: '会话时间',
    session_id: '会话 ID',
    feedback_score: '满意度分数',
    feedback_reason: '满意度反馈',

    search_more: '显示上限为1万条，显示更多资料？',
    search_more_hint: '以最后一条访问时间为启始点重新查询',

    tooltip: '系统记录与用户的所有对话数据，支持多条件查询和导出',
    cluster: {
      title: '辅助分类',
      condition: '筛选条件',
      type: {
        by_search: '筛选结果',
        by_check: '列表勾选',
      },
      result_count: '根据 {type} 共 {total} 条用户问题，排除已忽略句子 {ignore} 条、已标注句子 {marked} 条、标准问题 {std} 条',
      cluster_count: '为您生成 {num} 组分类',
      cluster_info: '「{title}」分类，已勾选 {num} 条',
      cluster_tag: '分类名称',
      cluster_q_count: '用户问题条数',
      others: '其他',
    },
    answer: '回答',
    score: '匹配分数',
    chat_num: '聊天数',
    total_asks_num: '提问数',
    session_num: '会话数',
    unique_user: '独立用户',
    time: '时间',
    brand: '渠道',
    age: '年龄段',
    hobbies: '购买爱好',
    day: '天',
    selection: '统计项',
    visit_record: '访问数据统计',
    dimension: '维度',
    qa_record: '问答类别统计',
    user_question: '用户问题',
    count: '提问次数',
    hot_question: '热点问题',
    failed_question: '未匹配问题',
    unresolve_question: '未解决问题',
    standard_question: '标准问题',
    standard_question_path: '所属目录',
    question_first_time: '首次提问时间',
    question_last_time: '末次提问时间',
    audit_record_filename: '操作日志',
    label: '标准问题标签',
    category: '标准问题分类',
    min_score: '最低分',
    max_score: '最高分',

    keyword_search: '关键词',
    time_range: '访问时间',
    user_id: '用户ID',
    user_nick: '用户昵称',
    module: '模组',
    action: '操作',

    filter: '筛选条件',
    export_mode: '高级筛选',
    total_records: '共 {num} 条',
    total_select_records: '共有 {num} 条日志，已勾选 {count} 条',

    recommend_question: '推荐标准问题',
    recommend_empty_msg_1: '目前无推荐标准问题',
    recommend_empty_msg_2: '可在右上角查询标准问题',
    search_empty_msg: '无查询结果',
    cluster_info: '通过特有的算法将相似问的句子进行聚类方便统一标注，建议勾选100条以上的用户问题，数量越大分类越准确',
    action_info: '「忽略功能」：可以将已正确回复的用户问句忽略，方便对其它问句标注。「标注功能」：可以将用户问句标注到正确的标准问上，训练完成后增强机器人理解能力',
    clustering_msg: '{num} 条用户问题进行辅助分类中，请勿离开此页面',
    clustering_checking: '准备进行辅助分类...，请勿离开此页面',
    cluster_dropdown: {
      by_search: '依据筛选结果 (共 {num} 条)',
      by_search_more: '依据筛选结果 (共 {num} 条，少于 {size} 条))',
      by_checked: '依据列表勾选 (共 {num} 条)',
      by_checked_more: '依据列表勾选 (共 {num} 条，少于 {size} 条)',
    },
    success: {
      ignore_ok: '更新忽略状态成功',
      mark_ok: '标注问题成功',
      cluster_ok: '辅助分类完成，请继续其他操作',
    },
    error: {
      ignore_fail: '更新忽略状态失败',
      mark_fail: '标注问题失败',
      mark_conflict: '用户问题{text}已为标准问题，不能标注为其他标准问题',
      system_error_reload: '系统发生错误，请重新整理',
      not_marked_anymore: '标注资料已移除，请重新标注',
      try_cluster_later: '辅助分类工具正在占用，请稍后操作',
      got_it: '知道了',
      cluster_fail: '辅助分类失败',
      multi_origin_mark_fail: '尚未为多条用户问题选择标注问题',
      search_fail: '无法取得对话日志',
      too_few_valid_sentence: '有效的用户问句不足',
    },
    warning: {
      mark_skip: '{num}个问答已为标准问题，忽略标注',
    },
    categories: {
      title: '维度',
      platform: '平台',
      brand: {
        title: '渠道',
        special_app: '特卖会APP',
        baby_app: '母婴APP',
        pc: 'PC端',
        wap: 'WAP端',
        wechat_public: '微信公众号',
        vshhc: '花海仓',
        spiceal_app_new: '特卖会app准新客',
        qq_public: 'QQ公众号',
        lefeng_app: '乐蜂APP',
      },
      sex: {
        title: '性别',
        0: '男',
        1: '女',
      },
      age: '年龄段',
      hobbies: {
        title: '购买爱好',
        0: '非准新客',
        1: '准新客',
      },
    },
    emotions: {
      title: '情感',
      angry: '愤怒',
      not_satisfied: '不满',
      satisfied: '满意',
      neutral: '中性',
    },
    qtypes: {
      title: '问答类别',
      business: '业务',
      chat: '聊天',
      other: '其他',
      all: '全部',
    },
    modules: {
      title: '出话模块',
      backfill: '未知回复',
      chat: '闲聊',
      keyword: '其他',
      function: '机器人技能',
      faq: '常用标准问题',
      task_engine: '多轮对话引擎',
      to_human: '转人工',
      knowledge: '知识图谱',
      command: '机器人话术',
      emotion: '情绪话术',
    },
    platform: {
      title: '平台',
      wechat: '微信',
      app: 'android',
      web: 'web',
      ios: 'ios',
    },
    sex: {
      title: '性别',
      all: '全部',
      male: '男',
      female: '女',
    },
    ignore: {
      title: '忽略状态',
      all: '全部',
      ignore: '忽略',
      not_ignore: '未忽略',
      batch_ignore: '批量忽略',
      cancel_ignore: '取消忽略',
    },
    mark: {
      title: '标注状态',
      all: '全部',
      marked: '已标注',
      not_marked: '未标注',
      mark: '标注',
      batch_mark: '批量标注',
      as: '标注为',
      multi: '多条标注纪录',
      re_marked: '重新标注',
    },
    audit: {
      op_module: '操作模块',
      op_type: '操作类型',
      user_id: '用户ID',
      nickname: '用户昵称',
      module: '功能名称',
      operation: '动作名称',
      content: '动作描述',
      result: '动作结果',
      create_time: '发生时间',
      ip_source: 'IP地址',
    },

    confidence_score: {
      title: '信心分数',
      low: '低信心问题',
      range: '分数区间',
    },

    user_say: '用户提问',
    robot_say: '机器人回答',
  },
  robot_setting: {
    tooltip: '机器人拥有的技能包括计算、时间查询、笑话、汇率、股票、讲故事和查天气等，用户可根据业务需要自行设定',
    model_rebuild: '重新建模',
    rebuild_msg: '点击“重新建模”，您的所有配置将于10分钟左右生效，在此期间将不能再次点击按钮，建议将所有修改都完成后再点“重新建模”，避免您的等待时间。如果忘记点击也没关系，自动重新建模是一小时一次。',
    chat_info_desc: '我的名字叫 {name}，你可以在下面设置我的形象喔',
    modify_qas: '修改语料',
    input_qa_placeholder: '请输入答案',
    input_qa_ext_placeholder: '新增扩展答案',
    input_q_ext_placeholder: '新增相似问题',
    answer_empty: '无',
    similar_question: '相似问题',
    extend_answer: '扩展答案',

    weather: '天气模块',
    computation: '数学计算模块',
    joke: '笑话模块',
    story: '讲故事模块',
    riddle: '猜谜语模块',
    chengyu: '成语模块',
    all_active: '全部开启',
    all_deactive: '全部关闭',
    general_function: '通用技能',
  },
  robot_command: {
    view: '查看',
    delete: '删除',
    moveto: '移至',
    edit: '编辑',
    add_command: '创建指令',
    edit_command: '编辑指令',
    view_command: '查看指令',
    command_name: '指令名称',
    command_keyword: '关键字',
    command_tag: '关联标签',
    command_status: '状态',
    delete_command_msg: '确定要删除指令 {name} 吗？',
    delete_multi_command_msg: '确定要删除所选指令吗？',
    movetopop: {
      tooltip: '请选择分类',
      title: '移动项目至...',
      move_command_success: '指令已移动',
    },
    editpop: {
      command: {
        title: '指令名称',
      },
      rule: {
        title: '规则适用对象',
        to_question: '用户问题',
        to_answer: '出话内容',
      },
      tag: {
        title: '关联标签',
      },
      keyword: {
        title: '触发关键字',
        advanced: '进阶设定',
        regex: '正则式',
        keyword_placeholder: '关键字以 "/" 隔开, 关键字必须全符合才可触发指令',
      },
      datetime: {
        title: '生效时间',
        forever: '永远',
        custom: '更多',
      },
      reply: {
        title: '回复内容',
        intext: '文字格式',
        injson: 'JSON格式',
        intext_placeholder: '纯文字',
        injson_placeholder: '输入JSON',
      },
      reply_place: {
        title: '回复位置',
        replace: '取代问答',
        before: '在回答之前使用',
        after: '在回答之后使用',
      },
    },
    error: {
      add_category_fail: '新增分类失败',
      edit_category_name_fail: '编辑分类失败',
      delete_category_fail: '删除分类失败',
      load_commands_fail: '载入指令失败',
      add_new_tag_fail: '新增标签失败',
      tag_invalid: '仅限10字长内的中文、半形英文与数字',
      add_command_fail: '创建指令失败',
      edit_command_fail: '编辑指令失败',
      delete_command_fail: '删除指令失败',
      move_fail: '移动指令失败',
      move_command_fail: '移动指令:{name} 失败',
      name_input_empty: '指令名称不得为空',
      name_input_duplicate: '已存在指令名称',
      date_format_error: '开始时间不得晚于结束时间',
      reply_format_json_error: 'JSON格式错误',
    },
  },
  wordbank: {
    wordbank: '词库',
    synonym: '同义词',
    categories: '分类',
    setting: '设置',
    leave_setting: '离开设置',
    view: '查看',
    edit: '编辑',
    delete: '删除',
    moveto: '移至',
    view_wordbank: '查看词库',
    add_wordbank: '新增词库',
    edit_wordbank: '编辑词库',
    moveto_wordbank: '移动项目至...',
    category_card_tooltip: '词库包含专用词库、敏感词库和任务引擎词库，词库的创建与维护帮助提升自然语言理解的覆盖率和准确率',
    add_rootcategory: '新增第一层分类',
    add_subcategory: '新增子分类',
    delete_category: '删除分类',
    delete_category_msg: '确定要删除分类 {name} 及其子分类吗？',
    delete_wordbank_msg: '确定要删除词库 {name} 吗？',
    delete_multi_wordbank_msg: '确定要删除所选词库吗？',
    placeholder_category_name: '输入分类名称',
    placeholder_synonym: '输入同义词， Enter加入下方列表',
    empty_category_search_result: '无符合分类',
    all: '全部',
    no_category: '未分类',
    default: '默认',
    define: '自定义',
    sensitive_wordbank: '敏感词库',
    sensitive_word: '敏感词答案',
    batch_import: '批量导入',
    export_all: '全部导出',
    success: {
      moved: '词库已移动',
    },
    error: {
      load_wordbanks_fail: '载入词库失败',
      edit_category_name_fail: '编辑分类名失败',
      add_category_fail: '新增分类失败',
      delete_category_fail: '删除分类失败',
      edit_wordbank_fail: '编辑词库失败',
      add_wordbank_fail: '新增词库失败',
      delete_wordbank_fail: '删除词库失败',
      import_format_invalid: '词库格式错误',
      move_wordbank_fail: '移动词库失败',
      synonym_duplicate: '已有重复同义词',
      wordbank_name_duplicate: '已有重复词库名',
      wordbank_name_empty: '词库名不得为空',
      root_name_duplicate: '已有重复分类',
      item_name_duplicate: '已有重复子分类',
    },

    upload_file_undefined: '档案无法辨识',
    upload_file_size_error: '档案大小需介于 0 ~ 2M',
    upload_file_type_invalid: '档案格式限 .xlsx 档',
    download_template: '下载批量导入模板',
    upload_title: {
      wordbank_upload: '批量导入',
      batch_import: '批量导入词库',
      last_import_result: '上次上传结果',
      download_imported_wordbank: '下载已导入词库',
      batch_import_hint: '批量导入词库提示',
    },
    import_button_hint: '支持扩展名：.xlsx',
    result: {
      success: '导入成功',
      fail: '导入失败',
      loading: '导入中',
      empty: '尚未导入',
    },
  },
  qatest: {
    submit: '送出',
    dimension: '维度',
    unknown: '未知',
    unselect: '未选择',
    user_dimension: '用户维度',
    clear_all: '取消全部',
    qatest: '对话测试',
    analysis: '句子分析',
    match_result: '匹配结果',
    similar_question: '相似问题',
    similar_score: '相似分数',
    filter_dimension: '筛选维度',

    sentence_analysis: '句子分析',
    intent: '意图',
    emotion: '情绪',
    module: '来源',
    token: '分词',

    cmd: '指令',
    cmdlist: {
      human: '转人工',
    },
  },
  qalist: {
    import_desc: '导入时将会覆盖所有问答库资料',
    total_row: '共 {num} 条',
    empty_label: '无标签',
    answer_label: '标签',
    sentence: '句子',
    add_answer_sentence: '新增答案句子',
    multi_answer_explain: '答案最多可包含五句',
    no_limit: '无期限',
    forever_valid: '永久有效',
    no_question: '无标准问题',
    header_related_question: '关联问题',
    validated_duration: '生效时间',
    to: '至',
    more: '更多操作',
    filter: '筛选条件',
    keywords: '关键字',
    keywords_enter: '请输入关键字',
    keyword_search: '查询',
    query: '查询',
    batch_import: '备份还原',
    batch_export: '资料备份',
    add_qa: '新增问答',
    delete: '删除',
    tags: '维度',
    all_dimensions: '所有维度',
    command: '指令',
    no_command: '无筛选条件',
    set_command: '指令设置',
    current_command: '当前指令',
    category_search: '分类搜索',
    all_categories: '全部分类',
    un_category: '暂无分类',
    standard_q: '标准问题',
    standard_a: '标准答案',
    dynamic_menu: '动态菜单',
    related_question: '相关问',
    valid_time: '有效时间',
    start_time: '开始时间',
    end_time: '结束时间',
    detail: '详情',
    goto: '前往',
    page: '页',
    all: '全部',
    question: '问题',
    answer: '答案',

    check_export_status: '导出进行中请稍候，完成将提示下载页面',
    check_exrpot_time: '最终确认时间',

    select_related_questions: '指定相关问',
    select_dynamic_menu: '指定动态菜单',
    select_not_in_recommendation: '不在推荐问内显示',
    not_in_recommendation: '推荐问显示',
    indicate_type: '指定类型',
    indicate_question: '指定问题',
    existed_dynamic_menu: '已存在动态菜单',
    existed_related_questions: '已存在相关问',
    warn_auto_deduplicate_input_questions: '标准问题含重复值，是否确定自动删除所有重复值并更新？',
    warn_duplicate_input_questions: '标准问题含重复值，是否删除所有重复值？',
    warn_submit_duplicate: '标准问题具重复值',
    clear_all_rows: '清除全部',
    warn_clear_all_rows: '您确定要清除全部指定问题吗',
    total: '共',
    rows: '条',
    clear_all_dimensions: '清除已选条件',
    export_msg: '正在准备数据, 请稍候刷新本页面',
    add_child_category: '添加子分组',
    rename: '重命名',
    delete_category: '删除分类',
    confirm_delete: '您确定要删除此分类及其子分类？',
    rename_msg: '请输入新的分组名称',
    edit_standard_q: '编辑标准问题',
    delete_standard_q: '删除标准问题',
    delete_selected_standard_q: '确认删除所选问题',
    confirm_delete_standard_q_msg: '您确定要删除该标准问题吗？',
    delete_standard_a: '删除答案',
    confirm_delete_standard_a_msg: '您确定要删除该答案吗？',
    confirm_delete_similar_question: '您确认要删除此相似问？',
    similar_question: '相似问',
    select_import_file: '选择批量导入文件',
    preview: '预览',
    file_not_select: '未选择文件',
    all_update: '全量',
    alpha_update: '增量',
    download_template: '下载批量导入问答库模板',
    download_last_success: '下载上一次成功全量导入版本',
    upload_success: '文件已上传，后台正在处理中，请稍候',
    in_uploading: '文件上传中，请勿关闭分页',
    import_success: '文件处理中，请稍后刷新本页面查看结果',
    set_similar_questoin: '相似问设置',
    please_input: '请输入相似问/关键词搜索',
    sn: '序号',
    no_similar_questions: '暂无相似问',
    add_similar_question: '请输入添加相似问',
    batch_add: '批量输入',
    duplicate_question: '已有重复相似问',
    duplicate_batch_question: '已过滤重复相似问后新增',
    image: '图片',
    remain_content_length: '剩余答案长度',
    belong_categories: '所属分类',
    prepare_export_msg: '正在准备数据,请稍候刷新本页面',
    cancel_export: '取消并重新导出',
    refresh: '刷新',
    export: '重新导出',
    export_download_msg: '数据导出成功，请您下载 数据版本',
    not_in_suggestion: '不在推荐内显示',
    add: '添加',
    permanent: '永久',
    self_defined: '自定义',
    relatedQ_dynamic_alarm_msg: "'指定动态菜单'和'指定相关问'不可同时存在一个标准答案里",
    edit_box_empty_alarm_msg: '文本长度不能超过10000或为空',
    not_indicate: '无指定',
    preparing_data: '正在准备数据，请稍后刷新本页面',
    question_empty_warning_msg: '问题不可为空',
    answer_empty_warning_msg: '默认标准答案不可为空',
    hide: '收起',
    qa_loading_failed_msg: '问答库读取失败,请稍候重试',
    page_selected: '全选当页',
    word_over_limit: '字数超过上限，请修正',
    not_select_any_question: '没有选择任何问题',
    starttime_later_than_endtime_warning: '开始时间不能晚于结束时间',
    operation_failed: '执行失败，请在重试一次',
    related_question_overwrite_warning: '已存在相关问将会被取代',
    dynamic_menu_overwrite_warning: '已存在动态菜单将会被取代',
    current_categories: '当前分类',
    modify_current_categories: '修改当前分类',
    import_fail_msg: '数据有误，请导出文档修改',
    export_file: '导出文档',
    question_exist: '已存在相同标准问题',
    answer_command: {
      no_order: '无指令',
      order_track: '物流信息查询',
      order_info: '订单信息查询',
      scene_id: '场景标识',
      cash: '提现',
      order_cancel: '取消订单',
      apply_for_return: '退货申请',
      exchange_goods: '换货申请',
      vip_finance: '唯品金融',
      query_refund: '查询退款',
      shopping: '购物',
    },
  },
  qa_label: {
    title: '标签管理',
    label: '标签',
    label_id: 'ID',
    label_row: '个',
    label_name: '标签名称',
    rule_count: '规则连结数',
    length: '请输入标签, 长度不超过10个字',
    actions: '操作',
    delete_label_name: '确定要删除标签：{tag}',
    err_detele_label_has_rule: '无法删除有规则的标签',
    err_existed_label: '标签名已存在',
    err_label_format: '不合法的标签格式',
    add_label: '新增标签',
    edit_label: '编辑标签',
    label_placeholder: '输入标签名称',
    label_format: '仅限10字长内的中文、半形英文与数字',
  },
  qa_rule: {
    rule: '规则',
    rule_id: 'ID',
    rule_name: '名称',
    label_name: '标签',
    rule_content: '内容',
    rule_time: '有效时间',
    rule_status: '规则状态',
    label_count: '连结标签数',
    link: '连结',
    link_label: '连结标签',

    rule_answer: '文本',
    answer_type_text: '文字',
    answer_type_cmd: '指令',
    answer_cmd_content: '指令内容',
    answer_text_content: '文本内容',

    rule_statue: '状态',
    rule_target: '检查对象',
    rule_target_std: '标准问题',
    rule_target_answer: '出话内容',
    rule_type: '文本使用',
    rule_type_replace: '取代',
    rule_type_front: '附加至前',
    rule_type_behind: '附加至后',

    rule_type_keyword: '关键字',
    rule_type_regex: '正则',

    status_forever: '永久',
    status_timeout: '已过期',
    status_valid: '有效中',
    custom_date: '自定义日期',

    delete_rule_name: '确定要删除规则：{rule}',
    update_status_success: '更新规则 {rule} 成功',
    err_rule_invalid: '规则已失效',

    err_existed_rule: '规则名称已存在',
    err_need_label_to_publish: '请先设定活动对应的标签',
    err_time_range: '结束时间不可早于开始时间',

    add_label: '新增标签',
  },
  qa_greeting: {
    question: '问题',
    answer: '答案',
    load_fail: '载入失败',
  },
  chat_skill: {
    chat_skill: '话术',
    group_basic: '基本话术',
    group_timeout: '答案失效话术',
    group_emotion: '情绪相关话术',
    save_success_msg: '保存{item}成功',
    add_new_msg: '新增个{item}吧',
    errorDuplicate: '内容已存在',
    delete_check_msg: '是否要删除话术：{item}',
  },
  task_engine: {
    download_template: '下载转换数据模版',
    task_engine_upload: '上传转换数据',
    import_button_hint: '支持扩展名：.csv',
  },

  learning: {
    week_collections: '周报列表',
    clusters: '负反馈对话',
    record_clusters: '对话分组',
    feedback_wording: '优化学习',
    collection_count_info: '发现相似对话{collection_cnt}组, 共{record_cnt}条',
    cluster_index: '第{idx}组',
    label: '对话标签',
    unmatched: '未匹配问题',
    unresolved: '未解决问题',
    collection: {
      weekly_report: '周报',
      timeline: '时间线',
      record: '负反馈对话',
      operation: '操作',
      view: '查看',
      title_info: '我们会在每周一凌晨给您提供过去一周的优化周报，帮助您发现机器人回答中有哪些可以优化的内容，并提供相应的改进工具，建议您每周安排时间处理。',
    },
    cluster: {
      group: '对话分组',
      records: '对话数',
      status: '状态',
      resolve: '处理',
      clusters_tooltip: '负反馈对话包括未匹配/未解决问题明细的内容。',
      group_tooltip: '我使用聚类算法，可以将非业务对话中语义相似的内容聚集成一组，每个聚类中的对话可能属于一个或多个标准问题，便于批量标注。',
      label_tooltip: '在每组相似对话中，出现次数最多的词，可以帮助快速了解这组对话的大致内容。',
      title_template: '第%NUM组',
    },
    feedback: {
      description: '选择对话, 并标注到匹配的标准问题',
      select_quesetion: '选择推荐标准问题',
      add_standardq: '新增标准问题',
      view: '查看语料',
      standardq: '标准问题',
      current_similar_questions: '最近%NUM条语料',
      start: '为我推荐',
      start_reminder: '先选择一些您认为应该属于一个标准问题的对话，并点击为我推荐，会在这里显示系统推荐的标准问题',
      revoke: '撤销',
      should_select: '请至少选择一个未匹配对话',
      should_select_less: '最多可勾选20个问题！',
      revoke_success: '撤销成功',
      no_recommend_q: '没有找到合适的推荐，你可以搜索所有标准问题，或者新增一个标准问题',
      unmatched_standard_q: '没有查询到标准问题，您可以尝试更换关键词，或新增标准问题',
      keyword_emtpy: '查询关键字不可为空',
      not_select_question: '没有选择标准问',
    },
  },
  intent_engine: {
    delete_multi_intent_msg: '确定要删除所选意图吗？',
    train: '意图训练',
    is_training: '意图训练中',
    is_testing: '意图测试中',
    is_restoring: '还原意图模型与测试集',
    training_success: '意图训练成功',
    training_fail: '意图训练失败',
    version_not_exist: '意图版本不存在',
    manage: {
      delete_intents: '批量删除',
      add_intent: '新增意图',
      intent_num: '共有 {inum} 组意图 / {cnum} 条语料',
      corpus_num: ' ({pos}条正例/{neg}条反例)',
      corpus_search_num: '(查询结果: {pos}条正例/{neg}条反例)',
      cancel_edit_msg: '尚未保存编辑，确定要取消编辑吗？',
      cancel_add_msg: '尚未保存意图，确定要取消新增吗？',
      delete_intent_msg: '删除意图会同时移除测试语料，删除后将不能复原，确定要删除意图 {name} 吗？',
      addin: '加入',
      positive: '正例',
      negative: '反例',
      tooltip: {
        page_info: '意图是指用户与机器人对话的目的，定义、训练和测试这些意图有助于机器人完成复杂的多轮对话',
        name_empty: '意图名称不可为空',
        name_duplicate: '意图名称已存在',
        corpus_duplicate_positive: '已存在相同正例语料',
        corpus_duplicate_negative: '已存在相同反例语料',
        hit_enter_to_save: '按 Enter 保存编辑',
      },
      placeholder: {
        intent_title: '输入意图名称',
        edit_corpus: '编辑语料，Enter完成编辑',
        add_corpus: '新增语料，Enter 加入下方列表',
      },
      no_data: {
        title: '暂无数据',
        hint_left: '左上角可手动新增，导入意图',
        hint_right: '右上角可下载意图范本',
      },
      notify: {
        add_intent_success: '新增意图成功',
        add_intent_fail: '新增意图失败',
        delete_intent_success: '删除意图成功',
        delete_intent_fail: '删除意图失败',
        update_intent_success: '编辑意图成功',
        update_intent_fail: '编辑意图失败',
        get_corpus_fail: '读取语料失败',
      },
      train_status_msg: {
        never_train: '从未进行意图训练',
        last_train: '最后意图训练成功时间：{timestr}',
        is_training: '意图训练中，进度{percentage}%',
      },
      train_button_tooltip: '机器人是依据语料来学习，每次新增语料后，必须进行意图训练以提高机器人识别正确率',
    },
    import: {
      title: '导入意图',
      note: '将会全量替换意图，删除之前所有数据，测试集也只会留下相同的意图测试题，删除不同的意图测试题。',
      choose_file: '请选择档案',
      success: '意图导入成功',
      fail: '意图导入失败',
      download_template: '下载意图范本',
      support_format: '支援格式 .xlsx, 档案大小需介于 0 ~ 2M',
      upload_file: '上传档案',
      upload_file_undefined: '档案无法辨识',
      upload_file_size_error: '档案大小需介于 0 ~ 2M',
      upload_file_type_invalid: '档案格式限 .xlsx 档',
      by_update: '新增数据',
      by_replace: '全量替换',
      tooltip: '选择全量替换将删除之前所有数据',
      test_data: {
        title: '导入意图测试集',
        note: '将会全量替换测试集，删除之前所有数据，导入后测试集只会留下和意图管理相同的意图测试题，删除不同的意图测试题。',
        success: '意图测试集导入成功',
        fail: '意图测试集导入失败',
        download_template: '下载意图测试集范本',
      },
    },
    test_data: {
      intent_num: '共有 {inum} 组测试意图 / {cnum} 条测试语料',
      test_corpus_without_intent: '未标注任何意图的测试语料',
      intent_and_test_corpus: '意图及测试语料',
      test_corpus_without_intent_tooltip: '用来测试的反例语料，测试时不应该命中任何意图',
      intent_and_test_corpus_tooltip: '新增意图时，需要完成训练后才会出现在意图测试的列表中。',
      show_button: '检视',
      show_intent_with_corpus_less_than_3: '显示少于3条测试语料',
      show_test_result: '显示测试结果',
      test_corpus: '测试语料',
      result_correct: '正确',
      result_wrong: '错误',
      result_none: '无记录',
      num_test_corpus: '{cnum}条测试语料',
      add_new_test_corpus: '加入测试语料',
      robot_predict: '机器预测',
      result_score: '信心分数',
      show_small_test_corpus_only: '显示少于{num}条测试语料',
      show_result: '显示测试结果',
    },
    test_records: {
      intent_test_record: '意图测试记录',
      intent_test_data: '意图测试集',
      latest_records: '近五条测试记录',
      saved_records: '保存测试记录',
      test_record_name: '名称',
      test_record: '测试记录',
      intent_model: '意图模型版本',
      accuracy: '正确率',
      tester: '测试人 ID',
      see_record_detail: '查看详细',
      restore_record: '还原意图模型与测试集',
      store_record: '保存记录',
      unstore_record: '取消保存',
      edit_record_name: '编辑名称',
      intent_statistics: '{cnum}条语料',
      save_record_pop: {
        save_record: '保存测试记录',
        edit_saved_record: '编辑保存测试记录',
        enter_record_name: '输入保存测试记录名称',
      },
      unsave_warning: '取消保存，将会从保存测试记录中移除，并且回到测试记录页面，确定要移除吗？',
      restore_warning: '会删除当前的意图模型与测试集，不能复原，确定继续动作吗？',
    },
    test_record: {
      test_data: '测试集',
      intent_model_version: '意图模型版本',
      intent_statistics: '{inum}组意图 {cnum}条语料',
      accuracy: '准确率 Accuracy',
      recall: '召回率 Recall',
      precision: '精确率 Precision',
      export_intent_test_corpus: '导出意图测试集',
      export_intent_train_corpus: '导出意图模型训练语料',
    },
    side_panel: {
      intent_train: '意图训练',
      intent_test: '意图测试',
      intent_train_info: '新增意图或语料后，必须进行意图训练以提高机器人识别正确率。',
      intent_test_info: '编辑测试集的正确答案，用来比对测试结果，来验证意图的准确度，可以选择过去的意图训练记录，来进行测试。',
      do_intent_test_info: '透过测试集来验证意图的准确度，可以选择过去的意图训练记录，来进行测试',
      do_train: '训练意图模型',
      do_test: '进行意图测试',
      testing_success: '意图测试成功',
      testing_fail: '意图测试失败',
      go_to_intent_test: '前往意图测试集',
      go_to_intent_test_records: '查看意图测试记录',
      tooltip: {
        intent_and_corpus_unchanged: '无新增任何意图或语料',
        intent_test_is_empty: '意图测试集为空请先编辑',
      },
      last_success_train: '最后训练成功',
      success_train_record: '训练成功记录',
      show_train_records: '更多记录',
      hide_train_records: '缩合',
      edit_intent_test_corpus_hint: '新模型有新意图，建议编辑测试语料',
      do_intent_test: {
        title: '进行意图测试',
        current_test_corpus_info: '当前测试题 {inum} 组意图 / {cnum} 条语料，透过与测试题比对差异数量选择适合的模型进行测试。',
        select_label: '选择欲测试的意图模型',
        intent_model_header: '意图模型',
        test_corpus_header: '与测试题比对',
        model_statistics: '{inum} 组意图 / {cnum} 条语料',
        check_diffs: '查看 {inum} 组差异',
        no_diff: '0 组差异',
        diff_info: '测试题共有 {t_inum} 组意图 / {t_cnum} 条语料，比对 {model} 模型共有 {m_inum} 组意图 / {m_cnum} 条语料',
        diff_label: '模型与测试题比对，只显示不同名称的意图。',
        model_diff_header: '{model} 模型 ({inum}组)',
        test_diff_header: '测试题 ({inum}组)',
      },
      start_train_warning: '注意进行意图训练后，将会产生新模型及对应的意图测试集。',
    },
  },
  pages: {
    null: '',
    manage_admin: {
      module_name: '系统管理人员',
    },
    manage_enterprise: {
      module_name: '企业列表',
    },
    manage_user: {
      module_name: '企业用户管理',
    },
    manage_robot: {
      module_name: '机器人列表',
    },
    status: {
      module_name: '数据总览',
      statistic_dash: '统计概览',
    },
    ssm: {
      module_name: '问答管理',
      ssm: '常用标准问题',
      qa_label: '标签管理',
    },
    privileges: {
      module_name: '权限管理',
      role_manage: '角色管理',
      user_manage: '用户管理',
      other_tools: '其他工具',
    },
    robot_setting: {
      module_name: '机器人设置',
      robot_profile: '机器人形象',
      robot_function: '技能设置',
      robot_chat_skill: '话术设置',
      robot_command: '指令设置',
      integration: '接入部署',
      robot_config: '系统功能配置',
    },
    wordbank: {
      module_name: '词库',
      wordbank_list: '词库关系',
      wordbank_upload: '词库导入',
    },
    faq: {
      module_name: '问答管理',
      qalist: '问答库',
      qa_greeting: '寒暄库',
      qatest: '对话测试',
      qa_chat_skill: '话术设置',
      qa_label: '标签管理',
      qa_rule: '规则管理',
      qa_learning: '自学习',
    },
    statistics: {
      module_name: '数据优化',
      statistic_analysis: '统计分析',
      statistic_daily: '日志管理',
      statistic_audit: '操作记录',
      statistic_learning: '负反馈',
      statistic_session: '会话日志',
    },
    task_engine: {
      module_name: '任务引擎',
      task_engine_scenario: '场景列表',
      task_engine_scenario_v2: '场景列表',
      task_engine_scenario_v3: 'TDE场景列表',
      task_engine_upload: '上传转换数据',
    },
    intent_engine: {
      module_name: '意图引擎',
      intent_manage: '意图管理',
      intent_manage_old: '旧意图管理',
      intent_test: '意图测试',
    },
    error: '',
  },
  general: {
    range: '区间',
    system_name_default: '对话管理后台',
    name: '名称',
    image: '图片',
    icon: '图标',
    clear_all: '清除全部',
    reset_to_default: '还原预设',
    view: '查看',
    custom_column: '自定义栏位',
    default_column: '预设栏位',
    enable: '启用',
    disable: '停用',
    setting: '设置',
    language: '语言',
    zh_tw: '繁体中文',
    zh_cn: '简体中文',
    delete_success: '删除成功',
    robot_list: '机器人列表',
    im: 'IM',
    no_data: '暂无数据',
    no_search_data: '暂无查询结果',
    no_option: '无选项',
    no_filterable_option: '无筛选结果',
    reset: '重置',
    chat_test: '对话测试',
    custom: '更多',
    yes: '是',
    no: '否',
    empty: '无',
    operation: '操作',
    search: '查询',
    all: '全部',
    add: '新增',
    actions: '操作',
    status: '状态',
    edit: '编辑',
    delete: '删除',
    remove: '移除',
    question: '问题',
    answer: '答案',
    ext_answer: '答案扩展',
    ok: '确认',
    cancel: '取消',
    loading: '页面载入中',
    error_code: '错误代码',
    error: '错误',
    upload: '上传',
    browse: '浏览',
    copy: '复制',
    save: '保存',
    saving: '保存中',
    default: '默认',
    indicate: '指定',
    force_cancel: '强制取消',
    import: '导入',
    export: '导出',
    success: '成功',
    fail: '失败',
    description: '提示',
    file: '档案',
    finish: '完成',
    folder: '目录',
    search_placeholder: '请输入搜索内容',
    close: '关闭',
    test: '测试',
    modify: '修改',
    save_change: '储存变更',
    go_back: '返回',
    please_choose: '请选择',
    intent: '意图',
    select_all: '全选',
    download: '下载',
  },
  dimension: {
    categories: {
      title: '维度',
      platform: '平台',
      brand: {
        title: '渠道',

        phone: '手机银行',
        bejing: '北京分行',
        guangzhou: '广州分行',

        sms: '短信',
        wechat: '微信',
        phone_app: '手机APP',
        e_line: 'E线通',
        fortune_group: '财富圈',
      },
      sex: {
        title: '性别',
        0: '男',
        1: '女',
      },
      age: '年龄段',
      hobbies: {
        title: '购买爱好',
        0: '非准新客',
        1: '准新客',
      },
    },
    emotions: {
      title: '情感',
      angry: '愤怒',
      not_satisfied: '不满',
      satisfied: '满意',
      neutral: '中性',
    },
    qtypes: {
      title: '问答类别',
      business: '业务',
      chat: '聊天',
      other: '其他',
    },
  },
  error_msg: {
    upload_file_undefined: '档案无法辨识',
    upload_file_size_error: '档案大小需介于 0 ~ 2M',

    delete_success: '删除成功',
    delete_fail: '删除失败',
    client_error: '呼叫端口错误',
    server_error: '伺服器错误',
    request_fail: '请求失败',

    success: '设定成功',
    save_success: '保存成功',
    save_fail: '保存失败',
    time_format_error: '时间格式错误',
    empty_data: '无资料',
    data_format_err: '资料格式错误',
    update_qa_error: '问答更新失败',
    input_empty: '输入不可为空',
    auth_expire: '授权已失效，请重新登入',
    no_page_priv: '无法浏览此页面',
    invalid_id: '无效的ID',

    import_success: '导入成功',
  },
  http_status: {
    default: '伺服器错误',
    400: '请求内容错误',
    401: '授权已失效，请重新登录',
    404: '伺服器错误，API未实作',
    413: '上传文档大小超过要求',
  },

  management: {
    enterprise_setting: '企业设置',
    enterprise_icon_setting: '企业图标设置',
    enterprise_lu_icon: '企业左上图标',
    enterprise_lu_icon_info: '支援格式 svg, png，档案大小限制为 1mb，建议宽高比例 3:1',
    browser_page_icon: '浏览器页签',
    browser_page_icon_info: '支援格式 png ，档案大小限制为1mb，建议宽高比例1:1',

    system_setting: '系统设置',
    system_icon_setting: '系统图标设置',
    system_lu_icon: '系统左上图标',
    login_icon: '登入画面图标',
    login_icon_info: '支援格式 svg,png ，档案大小限制为1mb，建议宽高比例为5:3',

    enterprise_list: '企业列表',
    admin_list: '系统管理人员',
    enterprise: '企业',
    create_enterprise: '创建企业',
    delete_enterprise: '删除企业',
    edit_enterprise: '编辑企业',
    create_time: '创建时间',

    enterprise_name: '企业名称',
    enterprise_description: '企业描述',
    module_list: '功能列表',

    system_admin_list: '系统管理人员',
    system_admin_desc: '创建企业时，必须指定一位企业管理人员',

    robot_group: '机器人群组',
    robots: '机器人',
    robot_list: '机器人列表',

    create_robot: '创建机器人',
    delete_robot: '删除机器人',
    edit_robot: '编辑机器人',
    group_manage: '机器人群组管理',

    group_name: '群组名称',
    robot_name: '机器人名字',
    description: '描述',

    input_placeholder: '输入文字',
    length_50_placeholder: '字数限制50内',

    create_group: '创建群组',
    edit_group: '修改群组',
    delete_group: '删除群组',
    add_robot: '加入机器人',
    input_personal_pass: '输入个人密码',
    reason_description: '原因描述',

    user_preference: '个人资料',
    edit_data: '修改资料',
    edit_user_preference: '修改个人资料',

    enterprise_privilege_manage: '企业权限管理',
    add_account: '新增帐号',
    edit_account: '编辑人员',
    add_role: '新增权限',
    privilege_setting: '权限设定',
    role_name_placeholder: '输入角色名称',
    normal_user: '一般用户',
    enterprise_admin: '企业管理员',
    system_admin: '系统管理员',
    unknown: '未知',

    user_name: 'ID',
    user_type: '帐号类型',
    user_display_name: '姓名',
    phone: '联络电话',
    email: 'Email',
    next_step: '下一步',
    last_step: '上一步',
    password: '密码',
    set_password: '设置密码',
    check_password: '确认密码',
    modify_password: '修改密码',
    set_passowrd_placeholder: '请输入密码',
    check_password_placeholder: '再输入一次密码',
    assign_robot: '指定机器人',
    privilege_is: '权限为',

    manager_password: '管理员密码',
    orig_password: '原密码',
    new_password: '新密码',
    check_new_password: '确认新密码',
    password_format: '介于6~16字的英文字母、数字或符号，须包含大小写英文字母与数字',
    username_format: '介于4~64字的英文字母、数字或 @._-',
    err_empty_username: 'ID 不可为空',
    err_existed_username: 'ID 已存在',
    err_username_length: 'ID 长度需介于4~64字之间',
    err_invalid_username: '不合法的 ID 格式',
    err_empty_email: 'Email 不可为空',
    err_invalid_email: '不合法的 Email 格式',
    err_invalid_phone: '不合法的电话格式',
    err_empty_display_name: '姓名不可为空',
    err_display_name_length: '姓名长度需介于2~50字之间',
    err_password_length: '密码长度需介于6~16字之间',
    err_password_invalid: '不合法的密码格式',
    err_password: '密码错误',
    err_origin_password: '原密码错误',
    err_manager_password: '管理员密码错误',
    err_manager_empty_password: '管理员密码不可为空',
    err_origin_empty_password: '原密码不可为空',
    err_invalid_check_password: '两次密码输入不同',
    update_password_success: '更新密码成功',
    add_user_success: '新增使用者成功',
    err_update_password_fail: '更新密码失败',
    err_role_duplicate: '角色名称已存在',
    err_robot_name_empty: '机器人名称不可为空',
    err_robot_duplicate: '机器人名称已存在',
    err_enterprise_name_empty: '企业名称长度需介于1~50字之间',
    err_enterprise_duplicate: '企业名称已存在',
    err_group_name_empty: '群组名称不可为空',
    err_group_duplicate: '群组名称已存在',
    err_pick_no_modules: '功能列表至少需勾选一个',
    err_reason_empty: '删除原因不可为空',
    err_enterprise_admin_duplicate: '企业管理员帐号名已存在',
    err_enterprise_email_duplicate: '企业管理员信箱已存在',
    err_unkown: '发生未知错误',

    go_back: '返回',

    audit: {
      system: '系统操作记录',
      enterprise: '企业操作记录',
      robot: '机器人操作记录',
      filter_time: '发生时间',
      filter_robot: '机器人',
      filter_module: '操作模块和类型',
      filter_userid: '用户ID',
      filter_enterprise: '企业',
      total: '共 {num} 条',
    },
    privilege: {
      statistic_dash: {
        view: '统计概览',
      },
      ssm: {
        view: '常用标准问答查看',
        edit: '常用标准问答编辑',
        export: '常用标准问答导出',
        import: '常用标准问答导入',
      },
      qa_label: {
        view: '标签管理查看',
        edit: '标签管理编辑',
      },
      task_engine: {
        edit: '任务引擎编辑',
      },
      wordbank: {
        view: '查看',
        edit: '编辑',
        create: '新增',
        delete: '删除',
        import: '导入',
        export: '导出',
      },
      statistic_analysis: {
        view: '统计分析查看',
        export: '统计分析导出',
      },
      statistic_daily: {
        view: '日志管理查看',
        export: '日志管理导出',
      },
      statistic_audit: {
        view: '操作记录查看',
        export: '操作记录导出',
      },
      robot_profile: {
        view: '机器人形象查看',
        edit: '机器人形象编辑',
      },
      robot_chat_skill: {
        view: '话术设置查看',
        edit: '话术设置编辑',
      },
      robot_function: {
        view: '技能设置查看',
        edit: '技能设置编辑',
      },
      robot_command: {
        view: '指令设置查看',
        edit: '指令设置编辑',
      },
      intent_manage: {
        view: '意图管理查看',
        edit: '意图管理编辑',
        export: '意图管理导出',
        import: '意图管理导入',
      },
      integration: {
        view: '接入部署查看',
        edit: '接入部署编辑',
      },
      robot_config: {
        view: '机器人设定查看',
        edit: '机器人设定变更',
      },
    },
  },
  header: {
    user_info: '个人资料',
    enterprise_privilege_list: '企业权限管理',
    back_to_system_manage: '返回系统管理',
    audit_log: '操作记录',
    logout: '登出',
  },
  format: {
    tag_format: '仅限10字长内的中文、半形英文与数字',
  },
  components: {
    pagination: {
      size: '条/页',
      goto: '前往',
      page: '页',
    },
  },
};
