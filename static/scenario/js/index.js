(function(document, window, $){
    var node_type_map = {
        "entry" : "入口节点",
        "dialogue" : "对话节点",
        "parameter_collecting" : "参数收集节点",
        "show_vars" : "显示参数节点",
        "polarity" : "是否判断节点",
        "time" : "时间节点",
        "time_period" : "时间段节点",
        "CheckinDate" : "入住时间节点",
        "CheckoutDate" : "离店时间节点",
        "depart_date" : "出发日期节点",
        "arrive_date" : "到达日期节点",
        "return_date" : "回程日期节点",
        "city" : "城市节点",
        "landmark" : "地标节点",
        "from_place" : "出发地节点",
        "to_place" : "到达地点节点",
        "number" : "数字节点",
        "money" : "金钱节点",
        "HotelName" : "酒店名称节点",
        "Star" : "星级节点",
        "router" : "转发节点",
        "restful" : "RESTful 数据调用节点",
        "nlu_pc" : "nlu参数收集节点",
    }
    
    var robotData = G.getCookie('robotDataJson')
    if (!robotData) {
        window.top.location.reload()
        return;
    }
    var robotDataJson = JSON.parse(robotData);
    var appid = robotDataJson.appid;

    var BASE_URL = "/php/api/ApiKey/";

    function s4_sort() { return Math.floor((1 + Math.random()) * 0x10000).toString(10).substring(1);};
    function guid_sort() { return s4_sort() + s4_sort() + s4_sort();}

    window.onscroll = function(ev) {
        var s = $(window).scrollTop(),
                d = $(document).height(),
                c = $(window).height();
        var s2 = $(window).scrollLeft(),
                d2 = $(document).width(),
                c2 = $(window).width();
        var scrollPercentY = (s / (d-c)) * 100;
        var scrollPercentX = (s2 / (d2-c2)) * 100;
        if (scrollPercentY >= 95) {
            $("#sortable").height(function (index, height) {
                console.log("Expanding canvas height");
                return (height * 1.1);
            });
        }
        if (scrollPercentX >= 95) {
            $("#sortable").width(function (index, width) {
                console.log("Expanding canvas width");
                return (width * 1.1);
            });
        }
    };

    $(window).on('resize', function(){

        $(".step1").height( $(window).height() - 200 );
        $("#topNavBar").width( $(this).width() - 675 );

        var win = $(this); //this = window
        if (win.height() >= 820) { /* ... */ }
        if (win.width() >= 1280) { /* ... */ }
    });

    var mouseX = 300;
    var mouseY = 200;
    $(document).mousemove( function(e) {
        mouseX = e.pageX;
        mouseY = e.pageY;
    });

    var zoomLevel = 1.0;
    function zoomOut() {
        if (zoomLevel > 0.60) zoomLevel -= 0.10;
        $('.sortablediv').css("transform","scale("+zoomLevel+")");
        $('.sortablediv').connections('update');
        createCookie("zoomLevel_26439",zoomLevel);
    }
    function zoomIn() {
        if (zoomLevel < 1) zoomLevel += 0.10;
        $('.sortablediv').css("transform","scale("+zoomLevel+")");
        $('.sortablediv').connections('update');
        createCookie("zoomLevel_26439",zoomLevel);
    }
    function createCookie(name,value,days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            var expires = "; expires="+date.toGMTString();
        }
        else var expires = "";
        document.cookie = name+"="+value+expires+"; path=/";
    }
    function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    window.sidepanelHidden = false;
    function toggleSidepanel() {
        if (sidepanelHidden) {
            $('#sidepanel').css('height','1500px');
            $('#sidepanel .tab-content').show();
            $('#sidepanelMinimize').html('-');
            sidepanelHidden = false;
        } else {
            $('#sidepanel').css('height','75px');
            $('#sidepanel .tab-content').hide();
            $('#sidepanelMinimize').html('+');
            sidepanelHidden = true;
        }
    }

    function exportScenarioToJSONfile() {
        var taskScenario = window.moduleData;
        var taskLayouts = window.moduleDataLayouts;
        var task = {};
        task['taskScenario'] = taskScenario;
        task['taskLayouts'] = taskLayouts;
        var scenario_name = taskScenario.metadata.scenario_name;
        var scenario_id = taskScenario.metadata.scenario_id;
        var jsonString = JSON.stringify(task, null, 4);
        var blobdata = new Blob([jsonString],{type : 'text/json'});
        if (navigator.appVersion.toString().indexOf('.NET') > 0) { // for IE browser
            window.navigator.msSaveBlob(blobdata, scenario_name + "_" + scenario_id + ".json");
        } else {
            var link = document.createElement("a");
            link.setAttribute("href", window.URL.createObjectURL(blobdata));
            link.setAttribute("download", scenario_name+"_"+scenario_id+".json");
            document.body.appendChild(link);
            link.click();
        }
    }

    function addMoreConfirmMessages() {
        var CONFIRM_TEMPLATE = '\
            <div class="well font-size-16">\
                <a style="float:right" onclick="$(this).parent().remove();">\
                    <i class="icon wb-close" aria-hidden="true"></i>\
                </a>\
                <span style="width:70px; display:inline-block">键</span>\
                <input type="text" style="width:200px; display:inline-block !important" class="key0 form-control">\
                <span class="margin-left-10" style="width:50px; display:inline-block">类别</span>\
                <select style="width:100px; display:inline-block !important" class="type0 margin-bottom-10 form-control">\
                    <option value="string">字串</option>\
                </select>\
                <div>\
                    <span style="width:70px; display:inline-block">信息</span>\
                    <input type="text" style="width:370px; display:inline-block !important" class="message0 form-control" value="$global{}">\
                </div>\
            </div>';
        $("#more_confirm_messages").append(CONFIRM_TEMPLATE);
        $("#more_confirm_messages").find(".key0").each(function(index, element){
            insertGlobalVarsTypeahead($(this));
        });
        $("#more_confirm_messages").sortable();
    }

    function updateConnectionLines() {
        // make connections
        $('#sortable .sortablediv').connections('remove');
        $("#sortable .sortablediv").each(function(i,obj) {
            // check if there are connections
            if ($(obj).attr("connectsTo") != '') {
                var connectionsArr = $(obj).attr("connectsTo").split(",");
                for(var i = 0; i < connectionsArr.length; i++) {
                    $(obj).connections({ to: $('#'+connectionsArr[i]) });
                }
            }
        });
        $( ".sortablediv" ).find('[data-toggle="tooltip"]').tooltip();
        $('.sortablediv').on('drag', function() {
            var node = $(this);
            setTimeout(function() { node.connections('update') }, 0);
        });
    }

    function editModule(id) {
        for(var index in window.moduleData.nodes){
            var node = window.moduleData.nodes[index];
            if (node.node_id == id){
                window.currentNode = node;
            }
        }
    }

    function saveModulePosition(id, position) {
        // initialize layout components
        var taskLayouts = window.moduleDataLayouts;
        if (typeof taskLayouts === 'undefined') {
            taskLayout = {};
            window.moduleDataLayouts = taskLayout;
        }

        // get the node layout if not exists create one
        var layout = taskLayouts[id];
        if (typeof layout === 'undefined') {
            layout = {};
            taskLayouts[id] = layout;
        }
        layout.position = position;
        uploadScenarioJson();
    }

    function removeModule(id, e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (confirm("移除此节点?")) {
            // they want to remove the module
            $("#module"+id).parent().connections('remove');
            $("#module"+id).parent().remove();
            removeModuleData(id);
            uploadScenarioJson();
        } else {
            // they clicked cancel
        }
        return false;
    }

    function removeModuleData(id) {
        if (window.moduleData == null)
            return false;

        for(var index in window.moduleData.nodes){
            var node = window.moduleData.nodes[index];
            if (node.node_id == id){
                if(typeof node.ui_node_type !== 'undefined' && node.edges[1].condition_rules.length > 0){
                    var skipKeyList = node.edges[1].condition_rules[0][0].functions[0].content;
                    for (var idx in skipKeyList){
                        for(var msg_id in window.moduleData.msg_confirm){
                            if(window.moduleData.msg_confirm[msg_id].key == skipKeyList[idx]['key'] ||
                               window.moduleData.msg_confirm[msg_id].key == skipKeyList[idx]['key']+'_'+id){
                                window.moduleData.msg_confirm.splice(msg_id,1);
                            }
                        }
                    }
                }
                window.moduleData.nodes.splice(index, 1);
                return true;
            }
        }

        return false;
    }

    function newModuleData(moduleID, moduleType, uiModuleType, nodeId) {
        if(moduleType == "entry"){
            var node = {
                "node_id": moduleID,
                "description": "入口节点",
                "node_type": moduleType,
                "entry_condition_rules": [],
                "warnings": [],
                "edges": []
            }
            window.moduleData.nodes.push(node);
        }else if(moduleType == "parameter_collecting"){
            var node = {
                "node_id": moduleID,
                "description": "参数收集节点",
                "node_type": moduleType,
                "warnings": [],
                "content": {
                    "parsers":[],
                    "questions":[]
                },
                "edges": []
            }
            window.moduleData.nodes.push(node);
        }else if(moduleType == "nlu_pc"){
            var node = {
                "node_id": moduleID,
                "description": "nlu参数收集节点",
                "node_type": moduleType,
                "warnings": [],
                "content": {
                    "entities":{}
                },
                "edges": []
            }
            window.moduleData.nodes.push(node);
        }else if(moduleType == "restful"){
            var node = {
                "node_id": moduleID,
                "description": "RESTful 数据调用节点",
                "node_type": moduleType,
                "warnings": [],
                "content": {
                    "requests": [{
                        "rtn_var_name": "",
                        "method": "POST",
                        "url": "",
                        "headers": {
                            "Content-Type": "application/json"
                        },
                        "body": {
                            "content": ""
                        }
                    }]
                },
                "edges": [
                    {
                        "edge_type": "normal",
                        "to_node_id": "0",
                        "condition_rules": [
                            [
                                {
                                    "source": "global_info",
                                    "functions": [
                                        {
                                            "function_name": "restful_failed",
                                            "content": ""
                                        }
                                    ]
                                }
                            ]
                        ],
                        "actions": [
                            {
                                "operation": "set_to_global_info",
                                "key": "sys_node_dialogue_cnt",
                                "val": 0
                            }
                        ]
                    },
                    {
                        "edge_type": "normal",
                        "to_node_id": "0",
                        "condition_rules": [
                            [
                                {
                                    "source": "global_info",
                                    "functions": [
                                        {
                                            "function_name": "restful_succeed",
                                            "content": ""
                                        }
                                    ]
                                }
                            ]
                        ],
                        "actions": [
                            {
                                "operation": "set_to_global_info",
                                "key": "sys_node_dialogue_cnt",
                                "val": 0
                            }
                        ]
                    }
                ]
            }
            window.moduleData.nodes.push(node);
        }else if(moduleType == "dialogue"){
            var roundLimit = window.moduleData.setting.sys_node_dialogue_cnt_limit || 3;
            if(typeof uiModuleType === 'undefined'){
                var node = {
                    "node_id": moduleID,
                    "description": "对话节点",
                    "node_type": moduleType,
                    "node_dialogue_cnt_limit": roundLimit,
                    "warnings": [],
                    "content": {
                        "questions": [{
                            "msg": ""
                        },{
                            "msg": ""
                        }]
                    },
                    "edges": [{
                        "to_node_id": null,
                        "condition_rules": []
                    },{
                        "to_node_id": null,
                        "condition_rules": []
                    },{
                        "to_node_id": null,
                        "condition_rules": []
                    },{
                        "to_node_id": 0, //default go to exit node
                        "condition_rules": []
                    }]
                }
                window.moduleData.nodes.push(node);
            }else if(uiModuleType == 'router'){
                var node = {
                    "node_id": moduleID,
                    "description": "转发节点",
                    "node_type": moduleType,
                    "ui_node_type": uiModuleType,
                    "warnings": [],
                    "content": {
                        "questions": [{
                            "msg": "$skip_dialogue",
                            "condition_rules": []
                        }]
                    },
                    "edges": [{
                        "to_node_id": null,
                        "condition_rules": []
                    },{
                        "to_node_id": null,
                        "condition_rules": []
                    },{
                        "to_node_id": null,
                        "condition_rules": []
                    },{
                        "to_node_id": 0, //default go to exit node
                        "condition_rules": []
                    }]
                }
                window.moduleData.nodes.push(node);
            }else if(uiModuleType == "polarity"){
                var node = {
                    "node_id": moduleID,
                    "description": "是否判断",
                    "node_type": moduleType,
                    "ui_node_type": uiModuleType,
                    "warnings": [],
                    "content": {
                        "questions": [
                          {
                            "type": "failure_response",
                            "msg": "不好意思，不明白您的意思，您可以回答 是、否",
                            "condition_rules": [
                              [
                                {
                                  "source": "global_info",
                                  "functions": [
                                    {
                                      "function_name": "key_val_match",
                                      "content": [
                                        {
                                          "key": "parsing_failed",
                                          "val": true,
                                          "compare": "=="
                                        }
                                      ]
                                    }
                                  ]
                                }
                              ]
                            ]
                          },
                          {
                            "type": "initial_response",
                            "msg": "请问是否要...",
                            "condition_rules": []
                          }
                        ]
                    },
                    "edges": [
                        {
                          "to_node_id": null,
                          "edge_type": "hidden",
                          "condition_rules": [],
                          "actions": [
                            {
                              "operation": "update_confirm_status"
                            },
                            {
                              "operation": "set_to_global_info",
                              "val": window.moduleData.setting.sys_node_dialogue_cnt_limit,
                              "key": "sys_node_dialogue_cnt_limit"
                            }
                          ]
                        },
                        {
                          "to_node_id": null,
                          "edge_type": "hidden",
                          "condition_rules": []
                        },
                        {
                          "to_node_id": null,
                          "edge_type": "hidden",
                          "condition_rules": []
                        },
                        {
                          "to_node_id": null,
                          "edge_type": "normal",
                          "condition_rules": [
                            [
                              {
                                "source": "text",
                                "functions": [
                                  {
                                    "content": {
                                      "key_suffix": "_"+moduleID,
                                      "key": "polarity"
                                    },
                                    "function_name": "polarity_parser"
                                  }
                                ]
                              }
                            ]
                          ],
                          "actions": []
                        },
                        {
                          "to_node_id": 0,
                          "edge_type": "normal",
                          "condition_rules": [
                            [
                              {
                                "source": "global_info",
                                "functions": [
                                  {
                                    "content": [
                                      {
                                        "compare": "==",
                                        "val": "yes",
                                        "key": "polarity_"+moduleID
                                      }
                                    ],
                                    "function_name": "key_val_match"
                                  }
                                ]
                              }
                            ]
                          ],
                          "actions": [
                            {
                              "operation": "set_to_global_info",
                              "val": false,
                              "key": "parsing_failed"
                            },
                            {
                              "operation": "set_to_global_info",
                              "val": 0,
                              "key": "sys_node_dialogue_cnt"
                            }
                          ]
                        },
                        {
                          "to_node_id": 0,
                          "edge_type": "normal",
                          "condition_rules": [
                            [
                              {
                                "source": "global_info",
                                "functions": [
                                  {
                                    "content": [
                                      {
                                        "compare": "==",
                                        "val": "no",
                                        "key": "polarity_"+moduleID
                                      }
                                    ],
                                    "function_name": "key_val_match"
                                  }
                                ]
                              }
                            ]
                          ],
                          "actions": [
                            {
                              "operation": "set_to_global_info",
                              "val": false,
                              "key": "parsing_failed"
                            },
                            {
                              "operation": "set_to_global_info",
                              "val": 0,
                              "key": "sys_node_dialogue_cnt"
                            }
                          ]
                        },
                        {
                          "edge_type": "normal",
                          "to_node_id": 0,
                          "condition_rules": [
                            [
                              {
                                "source": "global_info",
                                "functions": [
                                  {
                                    "function_name": "counter_check",
                                    "content": "node_counter"
                                  }
                                ]
                              }
                            ]
                          ],
                          "actions": [
                            {
                                "operation": "set_to_global_info",
                                "val": false,
                                "key": "parsing_failed"
                            },
                            {
                              "operation": "set_to_global_info",
                              "key": "sys_node_dialogue_cnt",
                              "val": 0
                            }
                          ]
                        },
                        {
                          "to_node_id": moduleID,
                          "edge_type": "else_into",
                          "condition_rules": [],
                          "actions": [
                            {
                              "operation": "set_to_global_info",
                              "val": true,
                              "key": "parsing_failed"
                            }
                          ]
                        }
                    ]
                }
                window.moduleData.nodes.push(node);
            }else if(uiModuleType == "show_vars"){
                var roundLimit = window.moduleData.setting.sys_node_dialogue_cnt_limit || 3;
                var node = {
                    "node_id": moduleID,
                    "description": "参数展示",
                    "node_type": moduleType,
                    "node_dialogue_cnt_limit": roundLimit,
                    "ui_node_type": uiModuleType,
                    "warnings": [],
                    "content": {
                        "questions": [
                            {
                                "msg": "不好意思我不明白，请重新输入",
                                "condition_rules": [
                                    [
                                        {
                                            "source": "global_info",
                                            "functions": [
                                                {
                                                    "function_name": "key_val_match",
                                                    "content": [
                                                        {
                                                            "key": "parsing_failed",
                                                            "val": true,
                                                            "compare": "=="
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                ]
                            },
                            {
                                "msg": "[您搜集到的参数如下：],[$item_list]",
                                "condition_rules": []
                            }
                        ]
                    },
                    "edges": [
                        {
                            "to_node_id": null,
                            "condition_rules": [],
                            "actions": [
                                {
                                    "operation": "update_confirm_status"
                                },
                                {
                                    "operation": "set_to_global_info",
                                    "key": "sys_node_dialogue_cnt_limit",
                                    "val": window.moduleData.setting.sys_node_dialogue_cnt_limit
                                }
                            ]
                        },
                        {
                            "to_node_id": null,
                            "condition_rules": []
                        },
                        {
                            "to_node_id": null,
                            "condition_rules": [
                                [
                                    {
                                        "source": "global_info",
                                        "functions": [
                                            {
                                                "function_name": "key_val_match",
                                                "content": [
                                                    {
                                                        "key": "sys_node_dialogue_cnt",
                                                        "val": window.moduleData.setting.sys_node_dialogue_cnt_limit,
                                                        "compare": "<"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            ]
                        },
                        {
                            "to_node_id": "0",
                            "condition_rules": [],
                            "actions": [
                                {
                                    "operation": "set_to_global_info",
                                    "key": "parsing_failed",
                                    "val": false
                                }
                            ]
                        }
                    ]
                }
                window.moduleData.nodes.push(node);
            }else if(uiModuleType == "time"){
                var node = genNodeFromTemplate(
                    moduleID, 
                    "时间", 
                    moduleType,
                    uiModuleType,
                    "请输入时间", 
                    "不好意思我不明白，您可以输入「今天」", 
                    "time_"+nodeId, 
                    "common_parser", 
                    "time_module");
                var msg = {
                    "key": "time_"+nodeId,
                    "msg": "时间为：$global{time_"+nodeId+"}。",
                    "type": "string"
                };
                window.moduleData.msg_confirm.push(msg);
                window.moduleData.nodes.push(node);
            }else if(uiModuleType == "city"){
                var node = genNodeFromTemplate(
                    moduleID, 
                    "城市", 
                    moduleType,
                    uiModuleType,
                    "请输入城市", 
                    "不好意思我不明白，您可以输入「北京」", 
                    "city_"+nodeId, 
                    "common_parser", 
                    "city_module");
                var msg = {
                    "key": "city_"+nodeId,
                    "msg": "城市为：$global{city_"+nodeId+"}。",
                    "type": "string"
                };
                window.moduleData.msg_confirm.push(msg);
                window.moduleData.nodes.push(node);
            }else if(uiModuleType == "number"){
                var node = genNodeFromTemplate(
                    moduleID, 
                    "数字", 
                    moduleType,
                    uiModuleType,
                    "请输入数字", 
                    "不好意思我不明白，您可以输入「三百」", 
                    "number_"+nodeId, 
                    "common_parser", 
                    "number_module");
                var msg = {
                    "key": "number_"+nodeId,
                    "msg": "数字为：$global{number_"+nodeId+"}。",
                    "type": "string"
                };
                window.moduleData.msg_confirm.push(msg);
                window.moduleData.nodes.push(node);
            }else if(uiModuleType == "landmark"){
                var node = genNodeFromTemplate(
                    moduleID, 
                    "地标", 
                    moduleType,
                    uiModuleType,
                    "请输入地标", 
                    "不好意思我不明白，您可以输入「外滩」", 
                    "landmark_"+nodeId, 
                    "common_parser", 
                    "landmark_module");
                var msg = {
                    "key": "landmark_"+nodeId,
                    "msg": "地标为：$global{landmark_"+nodeId+"}。",
                    "type": "string"
                };
                window.moduleData.msg_confirm.push(msg);
                window.moduleData.nodes.push(node);
            }else if(uiModuleType == "money"){
                var node = genNodeFromTemplate(
                    moduleID, 
                    "金钱", 
                    moduleType,
                    uiModuleType,
                    "请输入金额", 
                    "不好意思我不明白，您可以输入「三百元」", 
                    "money_"+nodeId, 
                    "common_parser", 
                    "money_module");
                var msg = {
                    "key": "money_"+nodeId,
                    "msg": "金额为：$global{money_"+nodeId+"}。",
                    "type": "string"
                };
                window.moduleData.msg_confirm.push(msg);
                window.moduleData.nodes.push(node);
            }else if(uiModuleType == "time_period"){
                var node = genNodeFromTemplate(
                    moduleID, 
                    "时间段", 
                    moduleType,
                    uiModuleType,
                    "请输入时间段", 
                    "不好意思我不明白，您可以输入「三天」", 
                    "time_period_"+nodeId, 
                    "common_parser", 
                    "time_period_module");
                var msg = {
                    "key": "time_period_"+nodeId,
                    "msg": "时间段为：$global{time_period_"+nodeId+"}。",
                    "type": "string"
                };
                window.moduleData.msg_confirm.push(msg);
                window.moduleData.nodes.push(node);
            }else if(uiModuleType == "CheckinDate"){
                var node = genNodeFromTemplate(
                    moduleID, 
                    "入住时间", 
                    moduleType,
                    uiModuleType,
                    "请输入入住时间", 
                    "不好意思我不明白，您可以输入「明天」", 
                    "CheckinDate_"+nodeId, 
                    "hotel_parser", 
                    "CheckinDate");
                var msg = {
                    "key": "CheckinDate_"+nodeId,
                    "msg": "入住时间为：$global{CheckinDate_"+nodeId+"}。",
                    "type": "string"
                };
                window.moduleData.msg_confirm.push(msg);
                window.moduleData.nodes.push(node);
            }else if(uiModuleType == "CheckoutDate"){
                var node = genNodeFromTemplate(
                    moduleID, 
                    "离店时间", 
                    moduleType,
                    uiModuleType,
                    "请输入离店时间", 
                    "不好意思我不明白，您可以输入「后天」", 
                    "CheckoutDate_"+nodeId, 
                    "hotel_parser", 
                    "CheckoutDate");
                var msg = {
                    "key": "CheckoutDate_"+nodeId,
                    "msg": "离店时间为：$global{CheckoutDate_"+nodeId+"}。",
                    "type": "string"
                };
                window.moduleData.msg_confirm.push(msg);
                window.moduleData.nodes.push(node);
            }else if(uiModuleType == "HotelName"){
                var node = genNodeFromTemplate(
                    moduleID, 
                    "酒店名称", 
                    moduleType,
                    uiModuleType,
                    "请输入酒店名称", 
                    "不好意思我不明白，您可以输入「香格里拉」", 
                    "HotelName_"+nodeId, 
                    "hotel_parser", 
                    "HotelName");
                var msg = {
                    "key": "HotelName_"+nodeId,
                    "msg": "酒店名称为：$global{HotelName_"+nodeId+"}。",
                    "type": "string"
                };
                window.moduleData.msg_confirm.push(msg);
                window.moduleData.nodes.push(node);
            }else if(uiModuleType == "Star"){
                var node = genNodeFromTemplate(
                    moduleID, 
                    "星级", 
                    moduleType,
                    uiModuleType,
                    "请输入星级", 
                    "不好意思我不明白，您可以输入「五星级」", 
                    "Star_"+nodeId, 
                    "hotel_parser", 
                    "Star");
                var msg = {
                    "key": "Star_"+nodeId,
                    "msg": "星级为：$global{Star_"+nodeId+"}。",
                    "type": "string"
                };
                window.moduleData.msg_confirm.push(msg);
                window.moduleData.nodes.push(node);
            }else if(uiModuleType == "from_place"){
                var node = genNodeFromTemplate(
                    moduleID, 
                    "出发地", 
                    moduleType,
                    uiModuleType,
                    "请输入出发地", 
                    "不好意思我不明白，您可以输入「从上海出发」", 
                    "fromPlace_"+nodeId, 
                    "task_parser", 
                    "from_place");
                var msg = {
                    "key": "fromPlace_"+nodeId,
                    "msg": "出发地为：$global{fromPlace_"+nodeId+"}。",
                    "type": "string"
                };
                window.moduleData.msg_confirm.push(msg);
                window.moduleData.nodes.push(node);
            }else if(uiModuleType == "to_place"){
                var node = genNodeFromTemplate(
                    moduleID, 
                    "到达地点", 
                    moduleType,
                    uiModuleType,
                    "请输入到达地点", 
                    "不好意思我不明白，您可以输入「到北京」", 
                    "toPlace_"+nodeId, 
                    "task_parser", 
                    "to_place");
                var msg = {
                    "key": "toPlace_"+nodeId,
                    "msg": "到达地点为：$global{toPlace_"+nodeId+"}。",
                    "type": "string"
                };
                window.moduleData.msg_confirm.push(msg);
                window.moduleData.nodes.push(node);
            }else if(uiModuleType == "depart_date"){
                var node = genNodeFromTemplate(
                    moduleID, 
                    "出发日期", 
                    moduleType,
                    uiModuleType,
                    "请输入出发日期", 
                    "不好意思我不明白，您可以输入「明天出发」", 
                    "departDate_"+nodeId, 
                    "task_parser", 
                    "depart_date");
                var msg = {
                    "key": "departDate_"+nodeId,
                    "msg": "出发日期为：$global{departDate_"+nodeId+"}。",
                    "type": "string"
                };
                window.moduleData.msg_confirm.push(msg);
                window.moduleData.nodes.push(node);
            }else if(uiModuleType == "arrive_date"){
                var node = genNodeFromTemplate(
                    moduleID, 
                    "到达日期", 
                    moduleType,
                    uiModuleType,
                    "请输入到达日期", 
                    "不好意思我不明白，您可以输入「后天到达」", 
                    "arriveDate_"+nodeId, 
                    "task_parser", 
                    "arrive_date");
                var msg = {
                    "key": "arriveDate_"+nodeId,
                    "msg": "到达日期为：$global{arriveDate_"+nodeId+"}。",
                    "type": "string"
                };
                window.moduleData.msg_confirm.push(msg);
                window.moduleData.nodes.push(node);
            }else if(uiModuleType == "return_date"){
                var node = genNodeFromTemplate(
                    moduleID, 
                    "回程日期", 
                    moduleType,
                    uiModuleType,
                    "请输入回程日期", 
                    "不好意思我不明白，您可以输入「下周三回来」", 
                    "returnDate_"+nodeId, 
                    "task_parser", 
                    "return_date");
                var msg = {
                    "key": "returnDate_"+nodeId,
                    "msg": "回程日期为：$global{returnDate_"+nodeId+"}。",
                    "type": "string"
                };
                window.moduleData.msg_confirm.push(msg);
                window.moduleData.nodes.push(node);
            }
        }else{
            return false;
        }
        return true;
    }

    function genNodeFromTemplate(moduleID, description, moduleType, uiModuleType, initQ, errorQ, key, parser, parser_content){
        var roundLimit = window.moduleData.setting.sys_node_dialogue_cnt_limit;
        return {
            "node_id": moduleID,
            "description": description,
            "node_type": moduleType,
            "node_dialogue_cnt_limit": roundLimit,
            "ui_node_type": uiModuleType,
            "warnings": [],
            "default_parser_with_suffix": true,
            "content": {
                "questions": [
                    {
                        "msg": null,
                        "condition_rules": [
                            [
                                {
                                    "source": "global_info",
                                    "functions": [
                                        {
                                            "function_name": "contain_key",
                                            "content": [
                                                {
                                                    "key": key
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        ]
                    },
                    {
                        "msg": errorQ,
                        "condition_rules": [
                            [
                                {
                                    "source": "global_info",
                                    "functions": [
                                        {
                                            "function_name": "key_val_match",
                                            "content": [
                                                {
                                                    "key": "parsing_failed",
                                                    "val": true,
                                                    "compare": "=="
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        ]
                    },
                    {
                        "msg": initQ,
                        "condition_rules": []
                    }
                ]
            },
            "edges": [
                {
                    "to_node_id": null,
                    "condition_rules": [
                        [
                            {
                                "source": "global_info",
                                "functions": [
                                    {
                                        "function_name": "not_contain_key",
                                        "content": [
                                            {
                                                "key": key
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    ],
                    "actions": [
                        {
                            "operation": "set_to_global_info",
                            "key": "parsing_failed",
                            "val": true
                        },
                        {
                            "operation": "update_confirm_status"
                        },
                        {
                            "operation": "set_to_global_info",
                            "key": "sys_node_dialogue_cnt_limit",
                            "val": window.moduleData.setting.sys_node_dialogue_cnt_limit
                        }
                    ]
                },
                {
                    "to_node_id": null,
                    "condition_rules": [
                        [
                            {
                                "source": "global_info",
                                "functions": [
                                    {
                                        "function_name": "not_contain_key",
                                        "content": [
                                            {
                                                "key": key
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "source": "text",
                                "functions": [
                                    {
                                        "function_name": parser,
                                        "content": {
                                            "key_suffix": "_"+moduleID,
                                            "tags": parser_content
                                        }
                                    }
                                ]
                            }
                        ]
                    ],
                    "actions": [
                        {
                            "operation": "set_to_global_info",
                            "key": "parsing_failed",
                            "val": false
                        }
                    ]
                },
                {
                    "to_node_id": moduleID,
                    "condition_rules": [
                        [
                            {
                                "source": "global_info",
                                "functions": [
                                    {
                                        "function_name": "key_val_match",
                                        "content": [
                                            {
                                                "key": "sys_node_dialogue_cnt",
                                                "val": window.moduleData.setting.sys_node_dialogue_cnt_limit,
                                                "compare": "<"
                                            }
                                        ]
                                    },
                                    {
                                        "function_name": "counter_check",
                                        "content": "scenario_counter_rev"
                                    },
                                    {
                                        "function_name": "not_contain_key",
                                        "content": [
                                            {
                                                "key": key
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    ]
                },
                {
                    "to_node_id": "0",
                    "condition_rules": [],
                    "actions": [
                        {
                            "operation": "set_to_global_info",
                            "key": "parsing_failed",
                            "val": false
                        }
                    ]
                }
            ]
        }
    }

    function addNodeHTML(data) {
        var html = ' \
            <div id="'+data.newModuleID+'" class="sortablediv" \
                style="position:absolute; z-index:99; \
                top:'+(data.top)+'px; left:'+(data.left)+'px"> \
            <div id="module'+data.newModuleID+'" class="panel" style="padding:15px; margin:0;"> \
            <div style="clear:both; min-height:75px">';
    
        if (data.moduleType != 'entry'){
            html += '\
            <button type="button" style="position:absolute" class="close" \
                onclick="return removeModule(\''+data.newModuleID+'\', event)" \
                aria-label="Close"> \
                <i class="icon wb-close"></i> \
            </button>';
        }

        var displayType = '';
        if (typeof data.uiModuleType === 'undefined'){
            displayType = data.moduleType;
        }else{
            displayType = data.uiModuleType;
        }
        
        html += '\
            <div id="node_content" class="text-center" style="min-width:200px"> \
                <span class="label label-lg label-outline label-default" style="padding: 4px 8px; background: rgb(243, 247, 249); font-size: 12px; font-weight: 300;">'
                    +node_type_map[displayType]+
                '</span>\
                <h4 class="margin-top-5 font-size-16">'+he.encode(data.newModuleName)+'</h4> \
                <a class="btn btn-sm btn-primary" id="configureModuleBtn" data-target="#configureModule"\
                    data-toggle="modal" onClick="editModule(\''+ data.newModuleID +'\')" type="button"> \
                    <i class="icon wb-settings" aria-hidden="true"></i>编辑\
                </a>';
        if (data.moduleType != 'entry'){
            html +=  '\
            <a class="btn btn-sm btn-primary" type="button" onClick="copyNode(\''+ data.newModuleID +'\')">\
                <i class="icon wb-copy" aria-hidden="true"></i>复制\
            </a>';
        }

        // add warning icon
        html += generateWarningIcon(data.warnings);

        html += '\
            </div> \
            </div> \
            </div> \
            </div>';
        return html;
    }

    function generateWarningIcon(warnings){
        var html = ''
        if (warnings !== undefined && warnings.length > 0){
            var warning_msg = ''
            var info_msg = ''
            for (var index in warnings){
                if (warnings[index].type == 'has_exit_connection'){
                    info_msg += warnings[index].warning_msg + '\n';
                }else{
                    warning_msg += warnings[index].warning_msg + '\n';
                }
            }

            if (info_msg !== ''){
                html += '\
                <img class="info" src="./images/modules/te_exit.png" width="32px" data-toggle="tooltip"\
                title="'+ info_msg.trim() +'" />'
            }
            if (warning_msg !== ''){
                html += '\
                <img class="warning" src="./images/modules/te_warning.png" width="16px" data-toggle="tooltip"\
                title="'+ warning_msg.trim() +'" />'
            }
        }
        return html
    }

    function initScenario(task) {
        var layouts = window.moduleDataLayouts;
        for (var index in task.nodes){
            var node = task.nodes[index];

            if(node.node_type == "exit")
                continue;

            var layout = layouts[node.node_id];
            if (typeof layout === 'undefined') {
              layout = {left: mouseX, right: mouseY};
            }
            mouseY += 150;

            var newModuleID = node.node_id;
            var newModuleName = node.description;
            var moduleType = node.node_type;
            var uiModuleType = node.ui_node_type;
            var warnings = node.warnings;

            $("#sortable").append(addNodeHTML(
              {
                newModuleID: newModuleID,
                newModuleName: newModuleName,
                moduleType:moduleType, 
                uiModuleType:uiModuleType,
                warnings:warnings,
                left: layout.position.left,
                top: layout.position.top
              }
            ));

            $( ".sortablediv" ).find('[data-toggle="tooltip"]').tooltip();
            $( ".sortablediv" ).draggable({
                addClasses: false,
                stop:function(e, ui) {
                  saveModulePosition($(this).attr("id"), ui.position);
                }
            });

            var connectsTo = [];

            for (var idx in node.edges){
                var edge = node.edges[idx];
                if('edge_type' in edge && edge.edge_type == 'qq'){
                    for(var i=0; i<edge.candidate_edges.length; i++){
                        if (edge.candidate_edges[i].to_node_id == null){
                            connectsTo.push("null");
                        }
                        else{
                            connectsTo.push(edge.candidate_edges[i].to_node_id);
                        }
                    }
                }else{
                    if (edge.to_node_id == null){
                        connectsTo.push("null");
                    }
                    else{
                        connectsTo.push(edge.to_node_id);
                    }
                }
            }
            var connectsToString = connectsTo.join();
            $("#"+newModuleID).attr("connectsTo", connectsToString);
        }
        updateConnectionLines();
    }

    function loadScenario(id) {
        $.ajax(BASE_URL+'task_engine_scenario.php', {
            type: 'POST',
            data: {
                method: 'GET',
                scenarioid: id
            },
            success: function(response) {
                try{
                    var json_object = JSON.parse(response);
                    window.moduleData = JSON.parse(json_object.result.editingContent);
                    window.moduleDataLayouts = JSON.parse(json_object.result.editingLayout);

                    if (typeof window.moduleData.setting === 'undefined') {
                        window.moduleData.setting = {
                            "sys_scenario_dialogue_cnt_limit": 30,
                            "sys_node_dialogue_cnt_limit": 3
                        };
                    }
                    if (typeof window.moduleData.nodes === 'undefined') {
                        var entryNodeId = guid_sort();
                        window.moduleData.nodes = [{
                            "node_id": "0",
                            "description": "Exit",
                            "node_type": "exit"
                        }];
                        window.moduleData.msg_confirm = [];
                        //add entry node
                        newModuleData(entryNodeId, "entry");
                        saveModulePosition(entryNodeId, {left:mouseX, top:mouseY});
                    }

                    initScenario(window.moduleData);
                    toastr.options = {"positionClass": "toast-bottom-right"};
                    toastr.success('Get Task JSON.');
                }catch(e){
                    console.log(e)
                    toastr.warning('Get Task JSON failed.');
                }
            },
            error: function(err) {
                console.log('Get Task JSON error: ' + err);
            }
        });
    }

    function checkIfSettingChanged(){
        if( window.moduleData.metadata.scenario_name === $('#setting-scenario-name').val().trim() &&
            window.moduleData.setting.sys_scenario_dialogue_cnt_limit === parseInt($('#error_enabled input[name="globalDialoguesCnt"]').val()) &&
            window.moduleData.setting.sys_node_dialogue_cnt_limit === parseInt($('#error_enabled input[name="nodeDialoguesCnt"]').val())
           ){
            return false;
        }else{
            return true;
        }
    }
  
    function checkIfGlobalConfirmationChanged(){
        if( jsonEqual(window.moduleData.msg_confirm, getConfirmMessages())){
            return false;
        }else{
            return true;
        }
    }

    function saveSetting(){
        var botName = $('#setting-scenario-name').val().trim();
        if (botName.length === 0) {
            toastr.warning('场景名称不得为空或空白');
        } else {
            $.when($.ajax(BASE_URL + 'task_engine_app.php?appid=' + appid, { type: 'GET' })).done(function (scenario_str) {
                var scenario_object = JSON.parse(scenario_str);
                var tasks = scenario_object.msg;
                var exist = false;
                for (var i in tasks) {
                    if (tasks[i].scenarioID !== window.moduleData.metadata.scenario_id && 
                        tasks[i].scenarioName === botName) {
                        exist = true;
                        break;
                    }
                }
                if (exist) {
                    toastr.warning('已有相同名称场景，请修改场景名称');
                } else {
                    window.moduleData.metadata.scenario_name = botName;
                    if (typeof window.moduleData.setting === 'undefined') {
                        window.moduleData.setting = {
                            "sys_scenario_dialogue_cnt_limit": parseInt($('#error_enabled input[name="globalDialoguesCnt"]').val() || 30),
                            "sys_node_dialogue_cnt_limit": parseInt($('#error_enabled input[name="nodeDialoguesCnt"]').val() || 3)
                        };
                    } else {
                        window.moduleData.setting.sys_scenario_dialogue_cnt_limit = parseInt($('#error_enabled input[name="globalDialoguesCnt"]').val() || 30);
                        window.moduleData.setting.sys_node_dialogue_cnt_limit = parseInt($('#error_enabled input[name="nodeDialoguesCnt"]').val() || 3);
                    }
                    //insert global value (the insert process must put here since user may update the value anytime)
                    //sys_scenario_dialogue_cnt limit
                    //sys_node_dialogue_cnt limit
                    var entryNode = null;
                    var dialogues_limit_edge = {
                        "to_node_id": null,
                        "condition_rules": [],
                        "actions": [
                            {
                                "operation": "set_to_global_info",
                                "key": "sys_scenario_dialogue_cnt_limit",
                                "val": parseInt($('#error_enabled input[name="globalDialoguesCnt"]').val() || 30)
                            },
                            {
                                "operation": "set_to_global_info",
                                "key": "sys_node_dialogue_cnt_limit",
                                "val": parseInt($('#error_enabled input[name="nodeDialoguesCnt"]').val() || 3)
                            }
                        ]
                    }
                    for (var i = 0; i < window.moduleData.nodes.length; i++) {
                        if (window.moduleData.nodes[i].node_type == "entry") {
                            entryNode = window.moduleData.nodes[i];
                        }
                    }
                    if (entryNode != null) {
                        entryNode.edges[0] = dialogues_limit_edge;
                    }
                    window.uploadScenarioJson();
                }
            });
        }
    }

    function getConfirmMessages(){
        var msgs = [];
        var elems = $('#more_confirm_messages > div');
        for (var idx=0; idx<elems.length; idx++) {
            var element = $(elems[idx]);
            if(element.find(".key0").val() == ''){
                continue;
            }

            msgs.push({
                "key": element.find(".key0").val(),
                "msg": element.find(".message0").val(),
                "type": element.find(".type0").val()
            })
        }
        return msgs;
    }

    function saveConfirmMessages(){
        window.moduleData.msg_confirm = getConfirmMessages();
        uploadScenarioJson();
    }

    function resetSetting(){
        if(window.moduleData == null) {
            return;
        }
        if (!window.moduleData.hasOwnProperty('nodes') ||
            !Array.isArray(window.moduleData.nodes) ||
            window.moduleData.nodes.length === 0 ||
            window.moduleData.nodes[0] == null ||
            !window.moduleData.nodes[0].hasOwnProperty('actions')
        ){
            return;
        }
        $('#error_enabled input[name="globalDialoguesCnt"]').val(window.moduleData.nodes[0].edges[0].actions[0]['val']);
    }

    function resetConfirmMessages(){
        $('#global_confirmation_loading').remove();
        if(window.moduleData == null){
            return;
        }

        var container = $('#more_confirm_messages');
        container.html("");

        for (var index in window.moduleData.msg_confirm){
            addMoreConfirmMessages();
            var msg = window.moduleData.msg_confirm[index];
            var element = container.children('div:last');
            element.find(".key0").val(msg.key);
            element.find(".message0").val(msg.msg);
            if (msg.type == null){
                element.find(".type0").val('string');
            }else{
                element.find(".type0").val(msg.type);
            }
        }
    }

    function resetGlobalConnections(){
        $('#global_connection_loading').remove();
        if(window.moduleData == null){
            return;
        }
        $('#moreconditions_module_gc').html("");
        const gConn = window.moduleData.global_connections || [];
        for (var index = 0; index < gConn.length; index++){
            var edge = gConn[index];
            addMoreConditions('_gc');
            var eltEdge = $('#moreconditions_module_gc > div:last');
            if ('edge_type' in edge && edge.edge_type == 'qq'){
                //qq edges
                insertQQEdgesIntoUIFromJSON(eltEdge, edge);
            }else{
                //normal edges
                if(edge.to_node_id == null){
                    eltEdge.find("div.thenGoto > select").val("null");
                }else{
                    eltEdge.find("div.thenGoto > select").val(edge.to_node_id);
                }
                var rules = edge.condition_rules[0];
                insertConditionsIntoUIFromJSON(rules, eltEdge, '.if-content');
            }
        }
    }

    function uploadScenarioJson() {
        var taskScenario = window.moduleData
        var taskLayouts = window.moduleDataLayouts;
        var jsonString = JSON.stringify(taskScenario);
        var layoutString = JSON.stringify(taskLayouts);

        $.ajax(BASE_URL+'task_engine_scenario.php', {
            type: 'POST',
            data: {
              method: 'PUT',
              scenarioid: taskScenario.metadata.scenario_id,
              layout: layoutString,
              content:jsonString,
              appid: appid
            },
            success: function(response) {
                toastr.options = {"positionClass": "toast-bottom-right"};
                toastr.success('场景已更新');
            },
            error: function(err) {
                console.log('场景更新失败: ' + JSON.stringify(err));
            }
        });
        return false;
    }

    function publishScenario() {
        $.when(
            $.ajax(BASE_URL+'task_engine_scenario.php', {
                type: 'POST',
                data: {
                    method: 'PUT',
                    scenarioid: window.moduleData.metadata.scenario_id,
                    publish: 1,
                    appid: appid
                }
            }),
            $.ajax({
                type: "POST",
                url: BASE_URL+"task_engine_app.php",
                cache: false,
                dataType: 'json',
                data: {
                    'method':'POST',
                    'appid':appid,
                    'scenarioid': window.moduleData.metadata.scenario_id,
                    'enable':true
                }
            })
        ).done(function(response1,response2){
            toastr.options = {"positionClass": "toast-bottom-right"};
            toastr.success('场景已发布');
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log('场景发布失败: ' + errorThrown);
        });
    }    

    //获取url中的参数
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r != null) return decodeURIComponent(r[2]); return null; //返回参数值
    }

    function copyNode(sourceNodeID){
        var sourceNode = null;
        for(var index in window.moduleData.nodes){
            var node = window.moduleData.nodes[index];
            if (node.node_id == sourceNodeID){
                sourceNode = node;
            }
        }
        var oldNodeId = sourceNode.node_id;
        var newNodeId = guid_sort();
        var sourceNodeStr = JSON.stringify(sourceNode);
        var newNodeStr = sourceNodeStr.replace(new RegExp(oldNodeId, 'g'), newNodeId);
        var newNode = JSON.parse(newNodeStr);
        newNode.description = newNode.description+'_copy';
        var newModuleLink = createNode(newNode.node_type, newNode.ui_node_type, newNodeId, newNode.description);
        //remove data added by createNode method
        window.moduleData.nodes.splice(window.moduleData.nodes.length-1, 1);
        window.moduleData.nodes.push(newNode);
        newModuleLink.click();
        $('#configureModule').modal('show');
        uploadScenarioJson();
    }

    function createNode(moduleType, uiModuleType, nodeId, description){
        var newModuleID = guid_sort();
        //for copy node
        if(typeof nodeId !== 'undefined'){
            newModuleID = nodeId;
        }
        var position = {left: mouseX-100, top: mouseY-50};
        saveModulePosition(newModuleID, position);
        if (!newModuleData(newModuleID, moduleType, uiModuleType, newModuleID))
            return;
        var newModuleName = window.moduleData.nodes[window.moduleData.nodes.length-1].description;
        //for copy node
        if(typeof description !== 'undefined'){
            newModuleName = description;
        }
        var sortable = $("#sortable").append(addNodeHTML(
          {
            newModuleID: newModuleID,
            newModuleName: newModuleName,
            moduleType:moduleType, 
            uiModuleType:uiModuleType,
            left: position.left,
            top: position.top
          }
        ));
        // set new module to current zoom level
        $('.sortablediv').css("transform","scale("+zoomLevel+")");
        $("#"+newModuleID).attr("connectsTo", []);
        $('.sortablediv').connections('update');
        $( ".sortablediv" ).find('[data-toggle="tooltip"]').tooltip();
        $( ".sortablediv" ).draggable({
            addClasses: false,
            stop:function(e, ui) {
                saveModulePosition($(this).attr("id"), ui.position);
            }
        });
        return sortable[0].childNodes[sortable[0].childNodes.length - 1].getElementsByTagName('a')[0];
    }

    function insertGlobalVarsTypeahead(input_ui) {
        var data = [];
        for (var index in window.moduleData.nodes) {
            var node = window.moduleData.nodes[index];
            if (typeof node.global_vars !== 'undefined') {
                for (var id in node.global_vars) {
                    data.push({
                        name: node.description + '节点： ' + node.global_vars[id],
                        id: node.global_vars[id]
                    });
                }
            }
        }
        input_ui.typeahead({
            source: data,
            showHintOnFocus: 'all',
            items: 'all'
        });
        input_ui.change(function () {
            var current = input_ui.typeahead("getActive");
            if (current) {
                if (current.name == input_ui.val()) {
                    input_ui.val(current.id);
                    input_ui.parent().find(".message0").val('$global{'+current.id+'}');
                }
            }
        });
    }

    function jsonEqual(obj1, obj2) {
        if (typeof obj1 !== typeof obj2) {
            return false;
        }
    
        if (obj1 === null && obj2 === null) {
            return true;
        } else if (obj1 === null || obj2 === null) {
            return false;
        }
    
        if (typeof obj1 === 'object') {
            const key1 = Object.keys(obj1).sort();
            const key2 = Object.keys(obj2).sort();
    
            if (key1.length !== key2.length) {
                return false;
            }
    
            return key1.reduce((ret, key) => {
                const val2 = obj2[key];
                if (val2 === undefined) {
                    return false;
                }
                const temp = jsonEqual(obj1[key], obj2[key]);
                return ret && temp;
            }, true);
        }
        return obj1 === obj2;
    }

    $(document).ready(function() {
        $("#globalConfirmMessage").on('shown.bs.modal', function() {
            resetConfirmMessages();
        });
        $("#globalConnections").on('shown.bs.modal', function() {
            getTemplateMappingTableList().then(getMappingTableList).then(function(){
                resetGlobalConnections();
            }, function(){
                window.templateUserMappingTableList = [];
                window.mappingTableList = [];
                resetGlobalConnections();
            });
        });
        $('#configureModule').on('show.bs.modal', function (e) {
            $("#configureModule .modal-content").html('<div style="padding-top:30px; text-align:center; position:absolute; width:100%; height:100%; background:white; z-index:99"><img style="height:150px;" src="images/loading_icon.gif" /></div>');
            loadNodeEditPage();
        });

        //对话窗关闭时检查数据是否已保存
        $('#configureModule').on('hide.bs.modal', function() {
            if(checkIfNodeChanged()){
                $('#checkNodeSave').modal('show');
            }
        });
        $("#globalConfirmMessage").on('hide.bs.modal', function() {
            if(checkIfGlobalConfirmationChanged()){
                $('#checkGlobalConfirmationSave').modal('show');
            }
        });
        $("#scenario_setting").on('hidden.bs.modal', function() {
            if(checkIfSettingChanged()){
                $('#checkSettingSave').modal('show');
            }
        });

        var taskId = getUrlParam('id');
        loadScenario(taskId);

        if (readCookie("zoomLevel_26439")) {
            zoomLevel = parseFloat(readCookie("zoomLevel_26439"));
            $('.sortablediv').css("transform","scale("+zoomLevel+")");
            $('.sortablediv').connections('update');
        }

        $("#topNavBar").width( $(window).width() - 675 );
        $(".step1").height( $(window).height() - 200 );

        $(".draggable").draggable({
            revert: true,
            helper: "clone",
            revertDuration: 0,
            start  : function(event, ui){
                $(ui.helper).addClass("ui-helper");
            },
            stop: function( event, ui ) {
                var newModuleLink = createNode($(this).attr("moduleid"), $(this).attr("uimoduleid"));
                newModuleLink.click();
                $('#configureModule').modal('show');
                uploadScenarioJson();
            }
        });
    });

    window.zoomIn = zoomIn;
    window.zoomOut = zoomOut;
    window.toggleSidepanel = toggleSidepanel;
    window.exportScenarioToJSONfile = exportScenarioToJSONfile;
    window.addMoreConfirmMessages = addMoreConfirmMessages;
    window.editModule = editModule;
    window.removeModule = removeModule;
    window.saveConfirmMessages = saveConfirmMessages;
    window.saveSetting = saveSetting;
    window.resetSetting = resetSetting;
    window.publishScenario = publishScenario;
    window.updateConnectionLines = updateConnectionLines;
    window.uploadScenarioJson = uploadScenarioJson;
    window.copyNode = copyNode;
    window.generateWarningIcon = generateWarningIcon;
    window.node_type_map = node_type_map;
    window.checkIfSettingChanged = checkIfSettingChanged;
    window.checkIfGlobalConfirmationChanged = checkIfGlobalConfirmationChanged;
    window.jsonEqual = jsonEqual;

})(document, window, jQuery)
