export default {
  privileges: {
    role: '角色',
    user: '用戶',
    password: '密碼',
    role_name: '角色名',
    user_name: '用戶名',
    privileges: '權限',
    user_count: '用戶數',
    function_priv: '功能權限',

    placeholder_user_name: '請輸入用戶名',
    placeholder_password: '請輸入密碼',
    placeholder_modify_password: '若要變更則輸入密碼',
    placeholder_input_role_name: '請輸入角色名',

    enterprise_admin: '企業管理員',

    no_roles: '無角色存在',
    no_users: '無用戶存在',
    all_active: '開啓全部',
    all_deactive: '關閉全部',

    check_delete: '確認要刪除角色：{role}',
    check_delete_user: '確認要刪除用戶：{user}',
    delete_success: '刪除成功',
    err_need_create_role: '請先新增角色',
    err_role_empty: '角色不可爲空',

    actions: {
      edit: '編輯',
      view: '查看',
      create: '新增',
      delete: '刪除',
      export: '導出',
      import: '導入',
    },

    modules: {
      statistic_dash: '統計概覽',
      statistic_analysis: '統計分析',
      statistic_daily: '日誌管理',
      statistic_audit: '操作記錄',

      ssm: '常用標準問題',
      qa_label: '標籤管理',

      qalist: '問答庫',
      qatest: '對話測試',
      qa_chat_skill: '話術設置',
      qa_rule: '規則管理',

      robot_profile: '機器人形象',
      robot_chat_skill: '話術設置',
      robot_function: '技能設置',
      robot_command: '指令設置',
      wordbank: '詞庫',
      task_engine: '任務引擎',

      management: '權限管理',
    },
    tools: {
      encrypt: {
        title: '加密工具',
        button: '加密',
        copy_button: '複製',
        placeholder: {
          encrypt_from: '輸入欲加密的文字',
          encrypt_to: '加密結果會顯示在這裏',
        },
        fail: '加密失敗',
        copied: '已複製加密文字',
      },
    },
  },
  login: {
    title: '用戶登陸',
    login: '登入',
    account_place: '輸入帳號',
    password_place: '輸入密碼',
    contact_sm: '無法登入？請聯絡管理人員',
  },
  category: {
    title: '分類',
    setting: '設置',
    leave_setting: '離開設置',
    placeholder_category_name: '輸入分類名稱',
    add_root: '新增第一層分類',
    add_subcategory: '新增子分類',
    delete_category: '刪除分類',
    empty_search_result: '無符合分類',
    all: '全部',
    no_category: '未分類',
    delete_category_msg: '確定要刪除分類 {name} 及其子分類嗎？',
  },
  statistics: {
    answer: '回答',
    score: '匹配分數',
    chat_num: '聊天數',
    total_asks_num: '提問數',
    session_num: '會話數',
    unique_user: '獨立用戶',
    time: '時間',
    platform: '平臺',
    brand: '渠道',
    sex: '性別',
    age: '年齡段',
    hobbies: '購買愛好',
    day: '天',
    selection: '統計項',
    visit_record: '訪問數據統計',
    dimension: '維度',
    qa_record: '問答類別統計',
    user_question: '用戶問句',
    count: '提問次數',
    hot_question: '熱點問題',
    failed_question: '未匹配問題',
    unresolve_question: '未解決問題',
    standard_question: '標準問題',
    standard_question_path: '所屬目錄',
    question_first_time: '首次提問時間',
    question_last_time: '末次提問時間',
    audit_record_filename: '操作日誌',

    keyword_search: '關鍵詞查詢',
    time_range: '時間段',
    user_id: '用戶ID',
    user_nick: '用戶暱稱',
    module: '模組',
    action: '動作',

    filter: '篩選條件',
    export_mode: '高級篩選',
    total_records: '共有 {num} 條日誌',

    categories: {
      title: '維度',
      platform: '平臺',
      brand: {
        title: '渠道',
        special_app: '特賣會APP',
        baby_app: '母嬰APP',
        pc: 'PC端',
        wap: 'WAP端',
        wechat_public: '微信公衆號',
        vshhc: '花海倉',
        spiceal_app_new: '特賣會app準新客',
        qq_public: 'QQ公衆號',
        lefeng_app: '樂蜂APP',
      },
      sex: {
        title: '性別',
        0: '男',
        1: '女',
      },
      age: '年齡段',
      hobbies: {
        title: '購買愛好',
        0: '非準新客',
        1: '準新客',
      },
    },

    emotions: {
      title: '情感',
      angry: '憤怒',
      not_satisfied: '不滿',
      satisfied: '滿意',
      neutral: '中性',
    },

    qtypes: {
      title: '問答類別',
      business: '業務',
      chat: '聊天',
      other: '其他',
      all: '全部',
    },

    audit: {
      op_module: '操作模塊',
      op_type: '操作類型',
      user_id: '用戶ID',
      nickname: '用戶暱稱',
      module: '功能名稱',
      operation: '動作名稱',
      content: '動作描述',
      result: '動作結果',
      create_time: '發生時間',
      ip_source: 'IP地址',
    },

    user_say: '用戶提問',
    robot_say: '機器人回答',
  },
  robot_setting: {
    model_rebuild: '重新建模',
    rebuild_msg: '點擊“重新建模”，您的所有配置將於10分鐘左右生效，在此期間將不能再次點擊按鈕，建議將所有修改都完成後再點“重新建模”，避免您的等待時間。如果忘記點擊也沒關係，自動重新建模是一小時一次。',
    chat_info_desc: '我的名字叫 {name}，你可以在下面設置我的形象喔',
    modify_qas: '修改語料',
    input_qa_placeholder: '請輸入答案',
    input_qa_ext_placeholder: '新增擴展答案',
    input_q_ext_placeholder: '新增相似問題',
    answer_empty: '無',
    similar_question: '相似問題',
    extend_answer: '擴展答案',

    weather: '天氣模塊',
    computation: '數學計算模塊',
    joke: '笑話模塊',
    story: '講故事模塊',
    riddle: '猜謎語模塊',
    chengyu: '成語模塊',
    all_active: '全部開啓',
    all_deactive: '全部關閉',
    general_function: '通用技能',
  },
  robot_command: {
    view: '查看',
    delete: '刪除',
    moveto: '移至',
    edit: '編輯',
    add_command: '創建指令',
    edit_command: '編輯指令',
    view_command: '查看指令',
    command_name: '指令名稱',
    command_keyword: '關鍵字',
    command_tag: '關聯標籤',
    command_status: '狀態',
    delete_command_msg: '確定要刪除指令 {name} 嗎？',
    delete_multi_command_msg: '確定要刪除所選指令嗎？',
    movetopop: {
      tooltip: '請選擇分類',
      title: '移動項目至...',
      move_command_success: '指令已移動',
    },
    editpop: {
      command: {
        title: '指令名稱',
      },
      rule: {
        title: '規則適用對象',
        to_question: '用戶問題',
        to_answer: '出話內容',
      },
      tag: {
        title: '關聯標籤',
      },
      keyword: {
        title: '觸發關鍵字',
        advanced: '進階設定',
        regex: '正則式',
        keyword_placeholder: '關鍵字以 "/" 隔開',
      },
      datetime: {
        title: '生效時間',
        forever: '永遠',
        custom: '自訂',
      },
      reply: {
        title: '回覆內容',
        intext: '文字格式',
        injson: 'JSON格式',
        intext_placeholder: '純文字',
        injson_placeholder: '輸入JSON',
      },
      reply_place: {
        title: '回覆位置',
        replace: '取代問答',
        before: '在回答之前使用',
        after: '在回答之後使用',
      },
    },
    error: {
      add_category_fail: '新增分類失敗',
      edit_category_name_fail: '編輯分類失敗',
      delete_category_fail: '刪除分類失敗',
      load_commands_fail: '載入指令失敗',
      add_new_tag_fail: '新增標籤失敗',
      add_command_fail: '創建指令失敗',
      edit_command_fail: '編輯指令失敗',
      delete_command_fail: '刪除指令失敗',
      move_fail: '移動指令失敗',
      move_command_fail: '移動指令:{name} 失敗',
      name_input_empty: '指令名稱不得爲空',
      name_input_duplicate: '已存在指令名稱',
      date_format_error: '開始時間不得晚於結束時間',
      reply_format_json_error: 'JSON格式錯誤',
    },
  },
  wordbank: {
    wordbank: '詞庫',
    synonym: '同義詞',
    categories: '分類',
    setting: '設置',
    leave_setting: '離開設置',
    view: '查看',
    edit: '編輯',
    delete: '刪除',
    moveto: '移至',
    view_wordbank: '查看詞庫',
    add_wordbank: '新增詞庫',
    edit_wordbank: '編輯詞庫',
    moveto_wordbank: '移動項目至...',
    add_rootcategory: '新增第一層分類',
    add_subcategory: '新增子分類',
    delete_category: '刪除分類',
    delete_category_msg: '確定要刪除分類 {name} 及其子分類嗎？',
    delete_wordbank_msg: '確定要刪除詞庫 {name} 嗎？',
    delete_multi_wordbank_msg: '確定要刪除所選詞庫嗎？',
    placeholder_category_name: '輸入分類名稱',
    placeholder_synonym: '輸入同義詞， Enter加入下方列表',
    empty_category_search_result: '無符合分類',
    all: '全部',
    no_category: '未分類',
    default: '預設',
    define: '自訂',
    sensitive_wordbank: '敏感詞庫',
    sensitive_word: '敏感詞迴應',
    batch_import: '批量導入',
    export_all: '全部導出',
    success: {
      moved: '詞庫已移動',
    },
    error: {
      load_wordbanks_fail: '載入詞庫失敗',
      edit_category_name_fail: '編輯分類名失敗',
      add_category_fail: '新增分類失敗',
      delete_category_fail: '刪除分類失敗',
      edit_wordbank_fail: '編輯詞庫失敗',
      add_wordbank_fail: '新增詞庫失敗',
      delete_wordbank_fail: '刪除詞庫失敗',
      import_format_invalid: '詞庫格式錯誤',
      move_wordbank_fail: '移動詞庫失敗',
      synonym_duplicate: '已有重複同義詞',
      wordbank_name_duplicate: '已有重複詞庫名',
      wordbank_name_empty: '詞庫名不得爲空',
      root_name_duplicate: '已有重複分類',
      item_name_duplicate: '已有重複子分類',
    },

    upload_file_undefined: '檔案無法辨識',
    upload_file_size_error: '檔案大小需介於 0 ~ 2M',
    upload_file_type_invalid: '檔案格式限 .xlsx 檔',
    download_template: '下載批量導入模板',
    upload_title: {
      wordbank_upload: '批量導入',
      batch_import: '批量導入詞庫',
      last_import_result: '上次上傳結果',
      download_imported_wordbank: '下載已導入詞庫',
      batch_import_hint: '批量導入詞庫提示',
    },
    import_button_hint: '支援副檔名：.xlsx',
    result: {
      success: '導入成功',
      fail: '導入失敗',
      loading: '導入中',
      empty: '尚未導入',
    },
  },
  qatest: {
    submit: '送出',
    dimension: '維度',
    unknown: '未知',
    unselect: '未選擇',
    user_dimension: '用戶維度',
    clear_all: '取消全部',
    qatest: '對話測試',
    analysis: '句子分析',
    match_result: '匹配結果',
    similar_question: '相似問題',
    similar_score: '相似分數',
    filter_dimension: '篩選維度',

    sentence_analysis: '句子分析',
    intent: '意圖',
    emotion: '情緒',
    module: '來源',
    token: '分詞',

    cmd: '指令',
    cmdlist: {
      human: '轉人工',
    },
  },
  qalist: {
    import_desc: '導入時將會覆蓋所有問答庫資料',
    total_row: '共 {num} 條',
    empty_label: '無標籤',
    answer_label: '標籤',
    sentence: '句子',
    add_answer_sentence: '新增答案句子',
    multi_answer_explain: '答案最多可包含五句',
    no_limit: '無期限',
    forever_valid: '永久有效',
    no_question: '無標準問題',
    header_related_question: '關聯問題',
    validated_duration: '生效時間',
    to: '至',
    more: '更多操作',
    filter: '篩選條件',
    keywords: '關鍵字',
    keywords_enter: '請輸入關鍵字',
    keyword_search: '查詢',
    query: '查詢',
    batch_import: '備份還原',
    batch_export: '資料備份',
    add_qa: '新增問答',
    delete: '刪除',
    tags: '維度',
    all_dimensions: '所有維度',
    command: '指令',
    no_command: '無篩選條件',
    set_command: '指令設置',
    current_command: '當前指令',
    category_search: '分類搜索',
    all_categories: '全部分類',
    un_category: '暫無分類',
    standard_q: '標準問題',
    standard_a: '標準答案',
    dynamic_menu: '動態菜單',
    related_question: '相關問',
    valid_time: '有效時間',
    start_time: '開始時間',
    end_time: '結束時間',
    detail: '詳情',
    goto: '前往',
    page: '頁',
    all: '全部',
    question: '問題',
    answer: '答案',

    check_export_status: '導出進行中請稍候，完成將提示下載頁面',
    check_exrpot_time: '最終確認時間',

    select_related_questions: '指定相關問',
    select_dynamic_menu: '指定動態菜單',
    select_not_in_recommendation: '不在推薦問內顯示',
    not_in_recommendation: '推薦問顯示',
    indicate_type: '指定類型',
    indicate_question: '指定問題',
    existed_dynamic_menu: '已存在動態菜單',
    existed_related_questions: '已存在相關問',
    warn_auto_deduplicate_input_questions: '標準問題含重複值，是否確定自動刪除所有重複值並更新？',
    warn_duplicate_input_questions: '標準問題含重複值，是否刪除所有重複值？',
    warn_submit_duplicate: '標準問題具重複值',
    clear_all_rows: '清除全部',
    warn_clear_all_rows: '您確定要清除全部指定問題嗎',
    total: '共',
    rows: '條',
    clear_all_dimensions: '清除已選條件',
    export_msg: '正在準備數據, 請稍候刷新本頁面',
    add_child_category: '添加子分組',
    rename: '重命名',
    delete_category: '刪除分類',
    confirm_delete: '您確定要刪除此分類及其子分類？',
    rename_msg: '請輸入新的分組名稱',
    edit_standard_q: '編輯標準問題',
    delete_standard_q: '刪除標準問題',
    delete_selected_standard_q: '確認刪除所選問題',
    confirm_delete_standard_q_msg: '您確定要刪除該標準問題嗎？',
    delete_standard_a: '刪除答案',
    confirm_delete_standard_a_msg: '您確定要刪除該答案嗎？',
    confirm_delete_similar_question: '您確認要刪除此相似問？',
    similar_question: '相似問',
    select_import_file: '選擇批量導入文件',
    preview: '預覽',
    file_not_select: '未選擇文件',
    all_update: '全量',
    alpha_update: '增量',
    download_template: '下載批量導入問答庫模板',
    download_last_success: '下載上一次成功全量導入版本',
    upload_success: '文件已上傳，後臺正在處理中，請稍候',
    in_uploading: '文件上傳中，請勿關閉分頁',
    import_success: '文件處理中，請稍後刷新本頁面查看結果',
    set_similar_questoin: '相似問設置',
    please_input: '請輸入相似問/關鍵詞搜索',
    sn: '序號',
    no_similar_questions: '暫無相似問',
    add_similar_question: '請輸入添加相似問',
    batch_add: '批量輸入',
    duplicate_question: '已有重複相似問',
    duplicate_batch_question: '已過濾重複相似問後新增',
    image: '圖片',
    remain_content_length: '剩餘答案長度',
    belong_categories: '所屬分類',
    prepare_export_msg: '正在準備數據,請稍候刷新本頁面',
    cancel_export: '取消並重新導出',
    refresh: '刷新',
    export: '重新導出',
    export_download_msg: '數據導出成功，請您下載 數據版本',
    not_in_suggestion: '不在推薦內顯示',
    add: '添加',
    permanent: '永久',
    self_defined: '自定義',
    relatedQ_dynamic_alarm_msg: "'指定動態菜單'和'指定相關問'不可同時存在一個標準答案裏",
    edit_box_empty_alarm_msg: '文本長度不能超過10000或爲空',
    not_indicate: '無指定',
    preparing_data: '正在準備數據，請稍後刷新本頁面',
    question_empty_warning_msg: '問題不可爲空',
    answer_empty_warning_msg: '默認標準答案不可爲空',
    hide: '收起',
    qa_loading_failed_msg: '問答庫讀取失敗,請稍候重試',
    page_selected: '全選當頁',
    word_over_limit: '字數超過上限，請修正',
    not_select_any_question: '沒有選擇任何問題',
    starttime_later_than_endtime_warning: '開始時間不能晚於結束時間',
    operation_failed: '執行失敗，請在重試一次',
    related_question_overwrite_warning: '已存在相關問將會被取代',
    dynamic_menu_overwrite_warning: '已存在動態菜單將會被取代',
    current_categories: '當前分類',
    modify_current_categories: '修改當前分類',
    import_fail_msg: '數據有誤，請導出文檔修改',
    export_file: '導出文檔',
    question_exist: '已存在相同標準問題',
    answer_command: {
      no_order: '無指令',
      order_track: '物流信息查詢',
      order_info: '訂單信息查詢',
      scene_id: '場景標識',
      cash: '提現',
      order_cancel: '取消訂單',
      apply_for_return: '退貨申請',
      exchange_goods: '換貨申請',
      vip_finance: '唯品金融',
      query_refund: '查詢退款',
      shopping: '購物',
    },
  },
  qa_label: {
    label: '標籤',
    label_id: 'ID',
    label_row: '個',
    label_name: '標籤名稱',
    rule_count: '規則連結數',
    length: '請輸入標籤, 長度不超過10個字',
    actions: '操作',
    delete_label_name: '確定要刪除標籤：{tag}',
    err_detele_label_has_rule: '無法刪除有規則的標籤',
    err_existed_label: '標籤名已存在',
  },
  qa_rule: {
    rule: '規則',
    rule_id: 'ID',
    rule_name: '名稱',
    label_name: '標籤',
    rule_content: '內容',
    rule_time: '有效時間',
    rule_status: '規則狀態',
    label_count: '連結標籤數',
    link: '連結',
    link_label: '連結標籤',

    rule_answer: '文本',
    answer_type_text: '文字',
    answer_type_cmd: '指令',
    answer_cmd_content: '指令內容',
    answer_text_content: '文本內容',

    rule_statue: '狀態',
    rule_target: '檢查對象',
    rule_target_std: '標準問題',
    rule_target_answer: '出話內容',
    rule_type: '文本使用',
    rule_type_replace: '取代',
    rule_type_front: '附加至前',
    rule_type_behind: '附加至後',

    rule_type_keyword: '關鍵字',
    rule_type_regex: '正則',

    status_forever: '永久',
    status_timeout: '已過期',
    status_valid: '有效中',
    custom_date: '自訂日期',

    delete_rule_name: '確定要刪除規則：{rule}',
    update_status_success: '更新規則 {rule} 成功',
    err_rule_invalid: '規則已失效',

    err_existed_rule: '規則名稱已存在',
    err_need_label_to_publish: '請先設定活動對應的標籤',
    err_time_range: '結束時間不可早於開始時間',

    add_label: '新增標籤',
  },
  qa_greeting: {
    question: '問題',
    answer: '答案',
    load_fail: '載入失敗',
  },
  chat_skill: {
    chat_skill: '話術',
    group_basic: '基本話術',
    group_timeout: '答案失效話術',
    group_emotion: '情緒相關話術',
    save_success_msg: '保存{item}成功',
    add_new_msg: '新增個{item}吧',
    errorDuplicate: '內容已存在',
    delete_check_msg: '是否要刪除話術：{item}',
  },
  task_engine: {
    download_template: '下載轉換數據模版',
    task_engine_upload: '上傳轉換數據',
    import_button_hint: '支援副檔名：.csv',
  },

  learning: {
    week_collections: '週報列表',
    clusters: '負反饋對話',
    record_clusters: '對話分組',
    feedback_wording: '優化學習',
    collection_count_info: '發現相似對話{collection_cnt}組, 共{record_cnt}條',
    cluster_index: '第{idx}組',
    label: '對話標籤',
    unmatched: '未匹配問題',
    unresolved: '未解決問題',
    collection: {
      weekly_report: '週報',
      timeline: '時間線',
      record: '負反饋對話',
      operation: '操作',
      view: '查看',
      title_info: '我們會在每週一凌晨給您提供過去一週的優化週報，幫助您發現機器人回答中有哪些可以優化的內容，並提供相應的改進工具，建議您每週安排時間處理。',
    },
    cluster: {
      group: '對話分組',
      records: '對話數',
      status: '狀態',
      resolve: '處理',
      clusters_tooltip: '負反饋對話包括未匹配/未解決問題明細的內容。',
      group_tooltip: '我使用聚類算法，可以將非業務對話中語義相似的內容聚集成一組，每個聚類中的對話可能屬於一個或多個標準問題，便於批量標註。',
      label_tooltip: '在每組相似對話中，出現次數最多的詞，可以幫助快速瞭解這組對話的大致內容。',
      title_template: '第%NUM組',
    },
    feedback: {
      description: '選擇對話, 並標註到匹配的標準問題',
      select_quesetion: '選擇推薦標準問題',
      add_standardq: '新增標準問題',
      view: '查看語料',
      standardq: '標準問題',
      current_similar_questions: '最近%NUM筆語料',
      start: '爲我推薦',
      start_reminder: '先選擇一些您認爲應該屬於一個標準問題的對話，並點擊爲我推薦，會在這裏顯示系統推薦的標準問題',
      revoke: '撤銷',
      should_select: '請至少選擇一個未匹配對話',
      should_select_less: '最多可勾選20個問題！',
      revoke_success: '撤銷成功',
      no_recommend_q: '沒有找到合適的推薦，你可以搜索所有標準問題，或者新增一個標準問題',
      unmatched_standard_q: '沒有搜尋到標準問題，您可以嘗試更換關鍵詞，或新增標準問題',
      keyword_emtpy: '搜尋關鍵字不可爲空',
      not_select_question: '沒有選擇標準問',
    },
  },
  pages: {
    null: '',
    status: {
      module_name: '數據總覽',
      statistic_dash: '統計概覽',
    },
    ssm: {
      module_name: '問答管理',
      ssm: '常用標準問題',
      qa_label: '標籤管理',
    },
    privileges: {
      module_name: '權限管理',
      role_manage: '角色管理',
      user_manage: '用戶管理',
      other_tools: '其他工具',
    },
    robot_setting: {
      module_name: '機器人設置',
      robot_profile: '機器人形象',
      robot_function: '技能設置',
      robot_chat_skill: '話術設置',
      robot_command: '指令設置',
    },
    wordbank: {
      module_name: '詞庫',
      wordbank_list: '詞庫關係',
      wordbank_upload: '詞庫導入',
    },
    faq: {
      module_name: '問答管理',
      qalist: '問答庫',
      qa_greeting: '寒暄庫',
      qatest: '對話測試',
      qa_chat_skill: '話術設置',
      qa_label: '標籤管理',
      qa_rule: '規則管理',
      qa_learning: '自學習',
    },
    statistics: {
      module_name: '數據優化',
      statistic_analysis: '統計分析',
      statistic_daily: '日誌管理',
      statistic_audit: '操作記錄',
      statistic_learning: '負反饋',
    },
    task_engine: {
      module_name: '任務引擎',
      task_engine_scenario: '場景編輯',
      task_engine_scenario_v3: '新場景編輯',
      task_engine_upload: '上傳轉換數據',
    },
    error: '',
  },
  general: {
    language: '語言',
    zh_tw: '繁體中文',
    zh_cn: '簡體中文',
    delete_success: '刪除成功',
    robot_list: '機器人列表',
    no_data: '暫無數據',
    reset: '重置',
    chat_test: '對話測試',
    custom: '自訂',
    yes: '是',
    no: '否',
    operation: '操作',
    search: '搜尋',
    all: '全部',
    add: '新增',
    actions: '操作',
    status: '狀態',
    edit: '編輯',
    delete: '刪除',
    question: '問題',
    answer: '答案',
    ext_answer: '答案擴展',
    ok: '確認',
    cancel: '取消',
    loading: '讀取中',
    error_code: '錯誤代碼',
    error: '錯誤',
    upload: '上傳',
    browse: '瀏覽',
    save: '保存',
    saving: '保存中',
    default: '默認',
    indicate: '指定',
    force_cancel: '強制取消',
    export: '導出',
    success: '成功',
    fail: '失敗',
    description: '提示',
    file: '檔案',
    finish: '完成',
    folder: '目錄',
    search_placeholder: '請輸入搜索內容',
    close: '關閉',
    test: '測試',
    modify: '修改',
    save_change: '儲存變更',
  },
  dimension: {
    categories: {
      title: '維度',
      platform: '平臺',
      brand: {
        title: '渠道',

        phone: '手機銀行',
        bejing: '北京分行',
        guangzhou: '廣州分行',

        sms: '短信',
        wechat: '微信',
        phone_app: '手機APP',
        e_line: 'E線通',
        fortune_group: '財富圈',
      },
      sex: {
        title: '性別',
        0: '男',
        1: '女',
      },
      age: '年齡段',
      hobbies: {
        title: '購買愛好',
        0: '非準新客',
        1: '準新客',
      },
    },
    emotions: {
      title: '情感',
      angry: '憤怒',
      not_satisfied: '不滿',
      satisfied: '滿意',
      neutral: '中性',
    },
    qtypes: {
      title: '問答類別',
      business: '業務',
      chat: '聊天',
      other: '其他',
    },
  },
  error_msg: {
    upload_file_undefined: '檔案無法辨識',
    upload_file_size_error: '檔案大小需介於 0 ~ 2M',

    delete_success: '刪除成功',
    delete_fail: '刪除失敗',
    client_error: '呼叫端口錯誤',
    server_error: '伺服器錯誤',
    request_fail: '請求失敗',

    success: '設定成功',
    save_success: '保存成功',
    save_fail: '保存失敗',
    time_format_error: '輸入不符合規範，請重新輸入',
    empty_data: '無資料',
    data_format_err: '資料格式錯誤',
    update_qa_error: '問答更新失敗',
    input_empty: '輸入不可爲空',
    auth_expire: '授權已失效，請重新登入',
    no_page_priv: '無法瀏覽此頁面',
    invalid_id: '無效的ID',

    import_success: '導入成功',
  },
  http_status: {
    default: '伺服器錯誤',
    400: '請求內容錯誤',
    401: '授權已失效，請重新登錄',
    404: '伺服器錯誤，API未實作',
    413: '上傳文檔大小超過要求',
  },

  management: {
    robot_group: '機器人羣組',
    robots: '機器人',
    robot_list: '機器人列表',

    create_robot: '創建機器人',
    delete_robot: '刪除機器人',
    edit_robot: '編輯機器人',
    group_manage: '機器人羣組管理',

    group_name: '羣組名稱',
    robot_name: '機器人名字',
    description: '描述',

    input_placeholder: '輸入文字',
    length_45_placeholder: '字數限制45內',

    create_group: '創建羣組',
    add_robot: '加入機器人',
    input_personal_pass: '輸入個人密碼',
    reason_description: '原因描述',

    user_preference: '個人資料',
    edit_data: '修改資料',
    edit_user_preference: '修改個人資料',

    enterprise_privilege_manage: '企業權限管理',
    add_account: '新增帳號',
    edit_account: '編輯人員',
    add_role: '新增權限',
    privilege_setting: '權限設定',
    role_name_placeholder: '輸入角色名稱',
    normal_user: '一般用戶',
    enterprise_admin: '企業管理員',
    system_admin: '系統管理員',
    unknown: '未知',

    user_name: 'ID',
    user_type: '帳號類型',
    user_display_name: '姓名',
    phone: '聯絡電話',
    email: 'Email',
    next_step: '下一步',
    last_step: '上一步',
    password: '密碼',
    set_password: '設置密碼',
    check_password: '確認密碼',
    modify_password: '修改密碼',
    set_passowrd_placeholder: '請輸入密碼',
    check_password_placeholder: '再輸入一次密碼',
    assign_robot: '指定機器人',
    privilege_is: '權限爲',

    manager_password: '管理員密碼',
    orig_password: '原密碼',
    new_password: '新密碼',
    check_new_password: '確認新密碼',
    password_format: '介於4~16字的英文字母、數字或常見符號',
    err_empty_username: 'ID 不可爲空',
    err_existed_username: 'ID 已存在',
    err_empty_email: 'Email 不可爲空',
    err_empty_display_name: '姓名不可爲空',
    err_password_length: '密碼長度需介於4~16字之間',
    err_password_invalid: '密碼含不合法字元',
    err_password: '密碼錯誤',
    err_origin_password: '原密碼錯誤',
    err_manager_password: '管理員密碼錯誤',
    err_manager_empty_password: '管理員密碼不可爲空',
    err_origin_empty_password: '原密碼不可爲空',
    err_invalid_check_password: '兩次密碼輸入不同',
    update_password_success: '更新密碼成功',
    err_update_password_fail: '更新密碼失敗',
    err_role_duplicate: '角色名稱已存在',
    err_robot_name_empty: '機器人名稱不可爲空',
    err_robot_duplicate: '機器人名稱已存在',
    err_group_name_empty: '羣組名稱不可爲空',
    err_group_duplicate: '羣組名稱已存在',

    go_back: '返回',

    privilege: {
      statistic_dash: {
        view: '統計概覽',
      },
      ssm: {
        view: '常用標準問答查看',
        edit: '常用標準問答編輯',
        export: '常用標準問答導出',
        import: '常用標準問答導入',
      },
      qa_label: {
        view: '標籤管理查看',
        edit: '標籤管理編輯',
      },
      task_engine: {
        edit: '任務引擎編輯',
      },
      wordbank: {
        view: '查看',
        edit: '編輯',
        create: '新增',
        delete: '刪除',
        import: '導入',
        export: '導出',
      },
      statistic_analysis: {
        view: '統計分析查看',
        export: '統計分析導出',
      },
      statistic_daily: {
        view: '日誌管理查看',
        export: '日誌管理導出',
      },
      statistic_audit: {
        view: '操作記錄查看',
        export: '操作記錄導出',
      },
      robot_profile: {
        view: '機器人形象查看',
        edit: '機器人形象編輯',
      },
      robot_chat_skill: {
        view: '話術設置查看',
        edit: '話術設置編輯',
      },
      robot_function: {
        view: '技能設置查看',
        edit: '技能設置編輯',
      },
      robot_command: {
        view: '指令設置查看',
        edit: '指令設置編輯',
      },
    },
  },
  header: {
    user_info: '個人資料',
    enterprise_privilege_list: '企業權限管理',
    logout: '登出',
  },
};
