export default {
  task_engine_v2: {
    err_empty: '不可為空',
    scenario_list_page: {
      button_create_new_scenario: '創建場景',
      button_import_scenario: '導入',
      button_export_all_scenarios: '導出全部場景',
      scenario_list: '場景列表',
      ask_delete_confirm: '確認要刪除場景：{scenario}',
      publish: '發佈',
      edit: '編輯',
      publish_succeed: '場景發佈成功',
      publish_failed: '場景發佈失敗',
      create_new_scenario_failed: '場景建立失敗',
      start_scenario: '開始創建您的第一個多倫場景吧',
      help_video: '教學視頻',
      upload_transfor_data: '上傳轉換數據',
      tips_edit_scenario_name: '點擊編輯場景名稱，回車確認修改',
    },
    node_type: {
      entry: '入口節點',
      dialogue: '對話節點',
      dialogue2: '對話節點2.0',
      restful: 'RESTful數據調用節點',
      nlu_pc: 'TDE參數收集節點',
      parameter_collecting: '參數收集節點',
      action: '動作節點',
      dialogue_description: '與使用者進行交互的節點',
      restful_description: '使用RESTful接口調用數據',
      nlu_pc_description: '利用TDE接口收集所需參數的節點',
      parameter_collecting_description: '收集所需參數的節點',
      action_description: '執行動作的節點',
    },
    parser: {
      none: '無',
      common_parser: '通用語句解析器',
      task_parser: '場景語句解析器',
      hotel_parser: '酒店預定語句解析器',
    },
    to_node_option: {
      exit: 'Exit',
      do_nothing: 'do nothing',
      parse_fail: '解析失敗處理',
      add_new_dialogue_node: '新增對話節點',
    },
    scenario_edit_page: {
      tabs: {
        node: '節點',
      },
      ask_delete_node_confirm: '確認要刪除節點：{node}',
      setting: '設置',
      global_var_template: '變量模版',
      global_edge: '通用連線',
      scenario_info: '場景信息',
      global_js_code: '腳本設置',
      export: '導出',
      publish: '發佈',
      add_node_instruction: '您可以將以下場景節點長按拖至左側任務板',
      new_edge_exceed_then_goto: '當出話超過上限',
      new_edge_else_into: '當所有規則都無法符合時',
      new_edge_normal: '自定義',
      new_edge_restful_success: '當調用成功',
      new_edge_restful_fail: '當調用失敗',
      new_edge_pc_success: '成功取得所有參數',
      new_edge_pc_fail: '連續解析失敗超過上限',
      back_to_scenario_list: '返回',
      advanced_config: '更多操作',
      switch: '開關',
      on: '開',
      off: '關',
      more: '更多',
    },
    node_edit_page: {
      tabs: {
        trigger: '觸發',
        setting: '基本設置',
        edge: '連線',
        params_collecting: '參數設置',
        action: '動作',
      },
      confirm_to_save_changes: '節點內容已被更動，請問是否需要保存？',
    },
    scenario_settings_edit_pop: {
      scenario_name: '場景名稱',
      err_empty_scenario_name: '場景名稱不可為空',
      scenario_dialogue_cnt_limit: '全場景對話數',
      err_empty_scenario_dialogue_cnt_limit: '全場景對話數不可為空',
      default_node_dialogue_cnt_limit: '預設節點對話數',
      err_empty_default_node_dialogue_cnt_limit: '預設節點對話數不可為空',
      confirm_to_save_changes: '場景基本設置已被更動，請問是否需要保存？',
    },
    scenario_info: {
      scenario_dialogue_cnt_limit: '全場景對話數',
      default_node_dialogue_cnt_limit: '預設節點對話數',
      robot_id: '機器人ID',
      scenario_id: '場景ID',
      scenario_last_update_time: '場景最後修改時間',
    },
    var_template_edit_pop: {
      instruction: '為每個變量設定顯示模版',
      label_key: '鍵',
      err_empty_label_key: '鍵不可為空',
      label_template: '模版',
      err_empty_label_template: '模版不可為空',
      button_add_template: '＋增加模版',
      confirm_to_save_changes: '變量模版設置已被更動，請問是否需要保存？',
    },
    global_edge_edit_pop: {
      instruction: '為每個節點增加通用的連線',
      add_new_dialogue_node: '新增對話節點',
      button_add_edge: '＋增加連線',
      confirm_to_save_changes: '通用連線設置已被更動，請問是否需要保存？',
    },
    js_code_edit_pop: {
      title: '腳本設置',
      script_type: '腳本類型',
      script_list: '腳本列表',
      script_content: '腳本文本',
      edit_func_alias: '點擊修改腳本函數名稱，回車確認修改',
      delete_func: '點擊刪除該腳本函數',
      err_empty_alias: '腳本別名不能為空',
      err_empty_name: '腳本名稱（函數名）不能為空',
      err_empty_code: '腳本不能為空',
      placeholder_func_alias: '請輸入腳本別名',
      placeholder_func_name: '請輸入腳本名稱（即：函數名）',
      placeholder_func_content: '請輸入JS腳本函數',
      add_private_script: '新增私有腳本',
      add_callable_script: '新增腳本模板',
      empty_private_script: '暫無私有腳本內容',
      empty_callable_script: '暫無任務腳本模板內容',
      confirm_to_save_changes: 'JS腳本設置已被修改，請問是否需要保存？',
    },
    trigger_edit_tab: {
      instruction: '設置觸發此場景的條件',
      button_add_rule: '＋增加規則',
    },
    setting_edit_tab: {
      node_type: '節點類型',
      node_name: '節點名稱',
      default_q: '預設文本',
      insert_var: '插入變量',
      insert_sys_var: '插入系統變量',
      all_sys_var: '所有系統變量',
      unconfirmed_sys_var: '尚未確認的系統變量',
      parse_text: '語句解析',
      parse_fail_q: '解析失敗文本',
      parser: '解析器：',
      target_data: '提取數據 (可多選)：',
      skip_if_exist: '若已提取以下任一數據則跳過出話和數據提取：',
      parse_from_this_node: '限定由此節點提取：',
    },
    setting_edit_tab2: {
      node_name: '節點名稱',
      response_setting: '話術設置',
      default_q: '預設話術',
      default_q_placeholder: '輸入預設話術，使用$符號可插入變量',
      parse_fail_q: '解析失敗',
      fail_q_placeholder: '輸入解析失敗後的話術表達',
      advanced_setting: '+高級話術設置',
      repeat_q: '重複話術',
      repeat_q_placeholder: '輸入重複話術',
      rewind_q: '兜回話術',
      rewind_q_placeholder: '輸入從節點跳出後再跳入至節點的話術表達',
      hide_advanced_setting: '收起高級話術設置',
      enable_response: '使用話術',
      skip_response: '如不使用話術，則在到達該節點時無對話反饋',
      default_q_hint: '場景中首次進入此節點時回覆給使用者的語句',
      fail_q_hint: '此節點的語句解析失敗時，回覆給使用者的語句',
      repeat_q_hint: '場景中再次進入此節點時回覆給使用者的語句（若不填寫則使用預設話術）',
      rewind_q_hint: '跳出場景後，再次返回場景此節點時回覆給使用者的語句（若不填寫則使用預設話術）',
    },
    params_collecting_tab: {
      button_add_params: '＋增加參數',
      parser: '解析器',
      required: '必要',
      button_add_parser: '＋增加解析器',
      msg: '參數詢問文本（詢問使用者參數的語句）',
      msg_description: '當收集框中所有被勾選為必要的參數『全部都還沒有』收集到時，才會使用此參數詢問文本做詢問。如果已經收集到其中一個必要參數，則會跳過此收集框。建議為每一個必要參數都另外設置一個單獨的收集框，以確保有任何一個必要參數時缺少時都有相對應的詢問話術。',
      parse_failed_msg: '解析失敗文本（參數解析失敗時，回覆給使用者的語句）',
      skip_if_key_exit: '參數檢查',
      skip_if_key_exit_info: '當收集到以下參數則跳過問句，請使用逗號分隔參數名稱',
      label_enable_confirm_msg: '收集完成確認文本：',
    },
    params_collecting_edge_tab: {
      succeed: '成功',
      succeed_description: '取得所有必要參數',
      failed: '失敗',
      failed_description: '參數連續解析失敗',
      virtual_global_edges: '通用連線',
      virtual_global_edges_description: '在這個位置插入通用連線',
    },
    edge_edit_tab: {
      instruction: '使用連線連接此節點與其他節點',
      button_add_edge: '＋增加連線',
      label_then_goto: '則前往',
      label_exceed_limit: '超過輪次',
      instruction_exeed_limit: '當此節點出話超過',
      label_time: '次',
      label_default_goto: '預設前往',
      instruction_default_goto: '當所有規則都無法符合時',
    },
    edge_edit_tab2: {
      instruction: '連線設定',
      instruction_hint: '（通過連線鏈接此節點與其他節點）',
      button_add_edge: '＋新增連線',
      exception_handle: '異常情況處理',
      label_exceed_limit: '超過輪次',
      instruction_exeed_limit: '當此節點出話超過',
      label_time: '次',
      label_default_goto: '預設前往',
      instruction_default_goto: '當所有規則都無法符合時',
      label_then_goto: '，則前往',
    },
    restful_setting_edit_tab: {
      restful_data_retrieve: 'RESTful數據調用',
      data_save_in_key: '數據存放變量（key）：',
      method: '調用方法：',
      url: '調用URL：',
    },
    restful_edge_edit_tab: {
      success: '調用成功',
      fail: '調用失敗',
      label_then_goto: '則前往',
    },
    action_edit_tab: {
      wait_for_response: '等待用戶回復：',
    },
    condition_block: {
      label_content: '內容',
      button_add: '＋增加',
      button_remove: '移除',
      label_pattern: '模式',
      label_nth_match: '第幾符合詞',
      label_mapping_table: '轉換數據',
      label_source_key: '來源鍵',
      label_target_key: '目的鍵',
      label_link: '連結',
      label_similarity_threshold: '相似度門檻',
      label_sentence: '句子',
      label_compare_operator: '比較方式',
      label_key: '鍵',
      label_value: '值',
      node_counter: '若超過節點對話輪數限制',
      scenario_counter: '若超過全場景對話輪數限制',
      source: {
        text: '用戶輸入文本',
        global_info: '場景已收集數據',
        cu: '語句解析數據',
      },
      func: {
        match: '完全相符',
        contains: '包含文本',
        regular_exp: '正則表示式',
        hotel_parser: '酒店預定語句解析器',
        common_parser: '通用語句解析器',
        task_parser: '場景語句解析器',
        user_custom_parser: '轉換數據解析器',
        polarity_parser: '是否判斷解析器',
        api_parser: 'Web API 調用',
        qq: '語句相似度',
        key_val_match: '鍵值匹配',
        key_key_match: '鍵鍵匹配',
        contain_key: '包含鍵',
        not_contain_key: '不包含鍵',
        list_length_match: '序列長度匹配',
        counter_check: '輪次檢查',
        user_custom_transform: '轉換數據',
        regular_exp_from_var: '正則表示式',
        assign_value: '賦值',
        remove_key: '刪除鍵',
        cu_parser: '語句解析數據提取',
        custom_cu_parser: '自定義語句解析數據提取',
        intent_parser: '意圖',
        js_code: 'JS腳本執行',
      },
      operator: {
        equal_to: '等於',
        not_equal_to: '不等於',
        greater_than: '大於',
        greater_or_equal_to: '大於等於',
        less_than: '小於',
        less_or_equal_to: '小於等於',
        ignore_case_compare: '忽略大小寫等於',
        reg_exp: '正則表示式',
        in: '包含於',
      },
      intent: 'Intent',
    },
    condition_action_block: {
      label_content: '內容',
      button_add: '＋增加',
      button_remove: '移除',
      label_pattern: '模式',
      label_nth_match: '第幾符合詞',
      label_mapping_table: '轉換數據',
      label_source_key: '來源鍵',
      label_target_key: '目的鍵',
      label_link: '連結',
      label_similarity_threshold: '相似度門檻',
      label_sentence: '句子',
      label_compare_operator: '比較方式',
      label_key: '鍵',
      label_value: '值',
      label_assign_value: '赋值',
      label_exec: '执行',
      label_equal: '等于',
      label_web_api: 'web api',
      label_parser: '解析器',
      label_source: '來源',
      label_match: '符合詞',
      label_text_response: '文字回覆',
      add_target_key: '+新增一組目的鍵',
      node_counter: '若超過節點對話輪數限制',
      scenario_counter: '若超過全場景對話輪數限制',
      source: {
        text: '用戶輸入文本',
        global_info: '場景已收集數據',
        cu: '語句解析數據',
      },
      action: {
        parser: '解析器',
        assign_value: '賦值',
        api_parser: 'web api',
        exec_script: '执行脚本',
        response_text: '文字回复',
      },
      func: {
        match: '完全相符',
        contains: '包含文本',
        regular_exp: '正則表達式匹配',
        hotel_parser: '酒店預定語句解析器',
        common_parser: '通用語句解析器',
        task_parser: '場景語句解析器',
        user_custom_parser: '數據轉換解析匹配',
        polarity_parser: '是否判斷解析器',
        api_parser: 'Web API 調用',
        qq: '語句相似度',
        key_val_match: '鍵值匹配',
        key_key_match: '鍵鍵匹配',
        contain_key: '包含鍵',
        not_contain_key: '不包含鍵',
        list_length_match: '序列長度匹配',
        counter_check: '輪次檢查',
        user_custom_transform: '轉換數據',
        regular_exp_from_var: '正則表達式匹配',
        assign_value: '賦值',
        remove_key: '刪除鍵',
        cu_parser: '語句解析數據提取',
        custom_cu_parser: '自定義語句解析數據提取',
        intent_parser: '意圖匹配',
        set_key_to_value: '鍵值賦值',
        set_key_to_key: '鍵鍵賦值',
        nlu_parser: 'NLU解析器',
        reg_parser: '正則解析器',
      },
      operator: {
        equal_to: '等於',
        not_equal_to: '不等於',
        greater_than: '大於',
        greater_or_equal_to: '大於等於',
        less_than: '小於',
        less_or_equal_to: '小於等於',
        ignore_case_compare: '忽略大小寫等於',
        reg_exp: '正則表示式',
        in: '包含於',
      },
      intent: 'Intent',
      add_condition: '新增條件',
      add_action: '新增動作',
      to: '跳轉',
      colon: '：',
      condition_action: '（條件{condition}，動作{action}）',
      delete: '刪除',
      condition_setup: '條件設置',
      action_setup: '執行動作',
      match: '符合',
      below_conditions: '以下條件',
      condition_options: {
        all: '全部',
        any: '任一',
      },
      if: '如果',
      and_if: '並且',
      input_placeholder: '輸入內容',
      key_placeholder: '輸入鍵',
      value_placeholder: '輸入值',
      http_placeholder: 'HTTP:\\\\',
      parser_placeholder: '請選擇解析器',
      reg_placeholder: '輸入正則表達式',
      multi_placeholder: '請選擇（支持多選）',
    },
    warnings: {
      has_exit_connection: '出口節點',
      missing_inbound_connection: '請新增至少一個指向此節點的連線',
      missing_outbound_connection: '請在此節點新增至少一個指向其他節點的連線',
      missing_entry_trigger: '缺少觸發條件',
      missing_response: '預設文本欄位不能為空白，請填入詢問語句。',
      missing_failure_response: '解析失敗文本欄位不能為空白，請填入解析失敗時的提示語句。',
      missing_pc_response: '參數詢問文本欄位不能為空白，請填入詢問語句。',
      missing_pc_failure_response: '解析失敗文本欄位不能為空白，請填入解析失敗時的提示語句。',
    },
  },
  task_engine_v3: {
    wizard_mode: {
      side_menu_tab: {
        scenario_list: '場景列表',
        entity_list: '自定義實體(TBA)',
      },
    },
    scenario_list_page: {
      button_create_new_scenario: '創建場景',
      button_import_scenario: '導入',
      scenario_list: 'TDE場景列表',
      ask_delete_confirm: '確認要刪除場景：{scenario}',
    },
    import_scenario_pop: {
      label_title: '導入場景',
      radio_json_format: '原文件(JSON格式)',
      radio_xlsx_format: 'Spreadsheet 格式',
      button_upload_file: '上傳檔案',
      label_choose_file: '請選擇檔案',
      button_download_template: '下載 Spreadsheet 範本',
      tooltip_json_import: '手動新增的場景，導出為JSON格式，可再導入使用',
      tooltip_xlsx_import: '導入Spreadsheet格式的場景 (支援擴展名.xlsx)',
      upload_file_undefined: '檔案無法辨識',
      upload_file_size_error: '檔案大小需介於 0 ~ 2M',
      upload_file_type_invalid: '檔案格式限 {format} 檔',
    },
    scenario_edit_page: {
      main_skill: '主任務',
      placeholder_name_the_scenario: '為場景取名',
      tab: {
        trigger: '觸發場景',
        entity_collecting: '收集信息',
        action: '執行動作',
      },
      toast_save_success: '儲存成功！',
      button_save_and_next_step: '儲存並下一步',
      switch_on: '啟動',
      switch_off: '停用',
      tooltip_skill_edit: '場景的任務管理',
    },
    condition_card: {
      if: '當',
      and: '而且',
      operators: {
        present: '存在',
        not_present: '不存在',
        contain: '包含',
        not_contain: '不包含',
        greater_than: '大於',
        smaller_than: '小於',
        equal_to: '等於',
        not_equal_to: '不等於',
        belong_to: '屬於',
        not_belong_to: '不屬於',
      },
      context_targets: {
        on_complete: '蒐集完所有參數',
        on_cancel: '用戶取消參數蒐集',
        on_transfer_to_manual: '觸發轉人工意圖',
        on_parse_fail: '用戶發話理解失敗',
      },
      target_type: {
        entity: '信息實體',
        context: '場景現況',
      },
    },
    action_group: {
      button_add_new_condition: '＋過濾條件',
      button_delete_action_group: '移除',
    },
    trigger_page: {
      label_add_trigger: '這個場景會被哪些意圖觸發？',
      button_add_trigger: '加入',
      description: '設定場景的進入條件，只有當使用者與機器人的對話滿足預設的觸發條件，會進入此場景，觸發相對應的多輪對話。',
      placeholder_import_intent_first: '請先導入意圖',
    },
    create_scenario_pop: {
      label_create_new_scenario: '創建場景',
      label_name_the_scenario: '場景名稱：',
      placeholder_enter_scenario_name: '輸入場景名稱',
      placeholder_enter_template: '請選擇場景模板',
      create_scenario: '場景創建',
      scenario_name: '場景名稱',
      scenario_temp: '場景模板',
      comfire_create: '確定創建',
    },
    create_skill_pop: {
      label_title: '創建新任務',
      label_skill_name: '任務名稱',
      placeholder_enter_skill_name: '輸入任務名稱...',
    },
    edit_skill_pop: {
      label_title: '場景任務管理',
      label_skill_name: '任務名稱',
      button_add_skill: '新增任務',
      button_delete_skill: '刪除',
      tooltip_empty_name: '不能為空白',
      warn_delete_skill: '您確認要刪除此任務嗎？',
    },
    intent_editor_pop: {
      label_edit_intent: '編輯意圖',
      label_add_new_intent: '新增意圖',
      label_intent_name: '意圖名稱：',
      placeholder_intent_name: '輸入意圖名稱...',
      label_training_phrase: '當使用者說出以下句子的時候，此意圖會被觸發：',
      placeholder_user_says: '使用者怎麼說...',
    },
    intent_tester_pop: {
      label_test_intent: '測試意圖(TBA)',
      label_intent_test_phrase: '意圖測試句：',
      placeholder_user_says: '使用者怎麼說...',
      button_start_to_predict: '開始預測(TBA)',
      label_intent_predict_result: '意圖預測結果：',
      button_upload_batch_phrases: '上傳批量測試資料(TBA)',
    },
    action_page: {
      description_2_0: '蒐集所有必要的訊息後，你需要執行什麼動作來完成任務？',
      label_add_action_2_0: '蒐集所有必要的訊息後，你需要執行什麼動作來完成任務？',
      description: '進入此節點後，你需要執行什麼動作來完成任務？',
      label_add_action: '進入此節點後，你需要執行什麼動作來完成任務？',
      button_add_new_msg: '新增文字回應',
      button_add_new_webhook: '新增外部服務連接',
      button_add_new_goto: '新增下一個任務連接',
      button_add_new_edge: '新增連線',
    },
    action_card: {
      label_msg_type: '文字迴應',
      label_webhook_type: '外部服務連接',
      label_goto_type_2_0: '下一個任務連接',
      label_goto_type: '連線至下一個節點',
      msg: {
        label_response: '回應',
      },
      webhook: {
        label_variable: 'API回傳值存放位置',
        label_method: '調用方法',
        label_url: '服務提供位址(URL)',
        label_content_type: 'Content-Type',
        label_body: 'Body',
        label_webhook_success: '成功時前往',
        label_webhook_fail: '失敗時前往',
        placeholder_input_variable: '請為變量取名',
        placeholder_input_url: 'http://api.server.com/webhook',
        placeholder_input_body: '{"parameter":"value"}',
      },
      goto: {
        label_goto: '前往',
        button_add_new_skill: '創建新任務',
        option_finish_scenario: '結束場景',
      },
    },
    entity_collecting_page: {
      title: '在此場景中，您需要收集使用者的哪些信息？',
      title_description: '設定此對話場景需要收集的信息，以及各信息的對應問句',
      advanced_config: '進階設定',
      add_new_entity_collector: '新增抽取信息',
      edit_entity_relation: '設置實體關聯性',
      edit_sentence_replacement: '設置語句替換',
      edit_tde_setting: '設置TDE屬性',
      edit_register_json: '編輯註冊JSON',
      order: '排序',
      order_description: '詢問用戶信息的順序，可透過拖曳方式改變信息詢問的順序',
      required: '必要',
      required_description: '若勾選代表設定為必要提取信息，則超過重試次數限制後會跳出場景。若沒勾選代表設定為非必要提取信息，則超過重試次數限制後會接續下個信息的詢問',
      entity_name: '信息名稱',
      entity_name_placeholder: '請填入信息名稱',
      entity_name_description: '用來識別信息的名稱，後續執行動作時可用來作為變量名稱使用',
      entity_category: '分類',
      entity_type: '信息實體型別',
      entity_type_description: '請先選擇欲使用的實體型別分類，再選擇對應的實體型別',
      prompt: '信息對應問句',
      prompt_placeholder: '請填入信息對應問句',
      prompt_description: '用來詢問使用者信息的語料，若留空將帶入預設語料',
      retry_times: '重試次數',
      retry_times_description: '若無法從用戶回答的語句中提取期望信息，將會反覆詢問，直到超過重試次數',
      delete: '刪除',
    },
    custom_entity_type_editor_pop: {
      title: '新增自定義實體型別',
      entity_type: '實體型別名稱',
      entity_type_description: '實體型別描述',
      entity_category: '實體型別所屬分類',
      upload_entity_table: '上傳實體列表',
      add_row: '+新增列',
      synonyms_table: {
        entity: '實體',
        entity_placeholder: '請輸入實體',
        synonyms: '同義詞',
        synonyms_placeholder: '請輸入同義詞(請使用,分隔)',
      },
    },
    entity_management: {
      title: '自定義實體',
      create_new_entity_type: '新增實體型別',
      search_placeholder: '搜尋...',
      entity_type: '實體型別',
      create_date: '創建日期',
      cagegory: '分類',
      description: '描述',
      operation: '操作',
    },
    prompt_editor_pop: {
      title: '設定信息提取機制',
      set_retry_num: '信息提取失敗重試，次數',
      set_as_required: '設定為必要題取信息',
    },
    error_msg: {
      request_failed: '請求失敗',
      please_enter_the_scenario_name: '請為場景取名',
      please_enter_the_skill_name: '請為任務取名',
      create_new_scenario_failed: '場景創建失敗',
      custom_entity_list_length_must_greater_than_two: '至少兩個以上的信息使用自定義實體型別，才可設置實體關聯',
    },
    entity_relation_editor_pop: {
      title: '實體關聯性設置',
      main_entity: '主要實體',
      related_entity: '關聯實體',
      add_row: '新增列',
      add_column: '新增欄',
      entity_type: '實體型別',
      entity: '實體',
    },
    sentence_replacement_editor_pop: {
      title: '語句替換設置',
      pattern: '語句比對模式',
      text: '替換語句',
      pattern_placeholder: '請輸入要比對的語句模式',
      text_placeholder: '請輸入要替換成的語句',
      add_replacement_rule: '新增',
      delete_replacement_rule: '刪除',
    },
    tde_setting_editor_pop: {
      title: 'TDE屬性設置',
      nlgTemplate: '模版：',
      service: '服務：',
      jumpOutTimes: '跳出場景重試次數上限值：',
    },
    register_json_editor_pop: {
      title: '編輯註冊JSON',
      title_description: '若自行編輯註冊JSON，將使用JSON的設定，即原有介面上的設定會失效',
    },
  },
};
