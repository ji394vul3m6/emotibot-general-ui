# Icon
----------------

## Usage
系統內所有 **Icon**

---
## Sample Code

### Simple Usage
```
  <icon
    iconType="iconType"
    :size="iconSize"
    >
  </icon>
```

### Icon with Hover style
```
  <icon
    iconType="iconType"
    :size="iconSize"
    enableHover
    >
  </icon>
```
---
## Props

| Prop | required | Type | Accepted Values | Default | 說明 |
|---|---|---|---|---|---|
| iconType | true | String | 見下方可用 Icons | - | Icon 樣式
| size | false | Number | - | 0 | icon 大小，單位為 px
| enableHover | false | Boolean | true / false | false | Icon 是否允許 Hover 樣式，對名稱為 'info' 的 Icon 使用enableHover，hover 時 icon 會替換成 'info_hover' 名稱的 Icon
| button | false | Boolean | true / false | false | Hover Icon 時 cursor 是否使用 pointer

---
## Events

| Event | Callback $event | 說明 |
|---|---|---|
| click | onclick event | 點擊Icon事件 |

---
## 可用 Icons

| iconType | Icon |
| --- | --- |
| menu_expand | <div style="background:black"><img src="../../assets/icons/menu_expand_icon.svg"/></div> |
| menu_statistics | <img src="../../assets/icons/menu_statistics_icon.svg"/>
| menu_ssm | <img src="../../assets/icons/menu_ssm_icon.svg"/>
| menu_robot | <img src="../../assets/icons/menu_robot_icon.svg"/>
| menu_wordbank | <img src="../../assets/icons/menu_wordbank_icon.svg"/>
| menu_te | <img src="../../assets/icons/menu_te_icon.svg"/>
| menu_privilege | <img src="../../assets/icons/menu_privilege_icon.svg"/>
| menu_dashboard | <img src="../../assets/icons/menu_dashboard_icon.svg"/>
| menu_intent | <img src="../../assets/icons/menu_intent_icon.svg"/>
| add | <img src="../../assets/icons/add_icon.svg"/>
| check | <img src="../../assets/icons/check_icon.svg"/>
| checked | <div style="background:black"><img src="../../assets/icons/checked_icon.svg"/></div>
| close | <img src="../../assets/icons/close_icon.svg"/>
| delete | <img src="../../assets/icons/delete_icon.svg"/>
| delete_hover | <img src="../../assets/icons/delete_hover_icon.svg"/>
| delete | <img src="../../assets/icons/delete_icon.svg"/>
| drop_down | <img src="../../assets/icons/drop_down_icon.svg"/>
| edit | <img src="../../assets/icons/edit_icon.svg"/>
| edit_blue | <img src="../../assets/icons/edit_blue_icon.svg"/>
| edit_white | <div style="background:black"><img src="../../assets/icons/edit_white_icon.svg"/></div>
| enterprise_admin | <img src="../../assets/icons/enterprise_admin_icon.svg"/>
| expand | <img src="../../assets/icons/expand_icon.svg"/>
| help | <img src="../../assets/icons/help_icon.svg"/>
| normal_acc | <img src="../../assets/icons/normal_acc_icon.svg"/>
| robot | <div style="background:black"><img src="../../assets/icons/robot_icon.svg"/></div>
| search | <img src="../../assets/icons/search_icon.svg"/>
| white_add | <div style="background:black"><img src="../../assets/icons/white_add_icon.svg"/></div>
| daggle | <img src="../../assets/icons/daggle_icon.svg"/>
| more | <img src="../../assets/icons/more_icon.svg"/>
| setting | <img src="../../assets/icons/setting_icon.svg"/>
| setting_hover | <img src="../../assets/icons/setting_hover_icon.svg"/>
| profile_question | <img src="../../assets/icons/profile_question_icon.svg"/>
| profile_answer | <img src="../../assets/icons/profile_answer_icon.svg"/>
| info_success | <img src="../../assets/icons/info_success_icon.svg"/>
| info_warning | <img src="../../assets/icons/info_warning_icon.svg"/>
| info_error | <img src="../../assets/icons/info_error_icon.svg"/>
| info_close | <img src="../../assets/icons/info_close_icon.svg"/>
| info | <img src="../../assets/icons/info_icon.svg"/>
| info_hover | <img src="../../assets/icons/info_hover_icon.svg"/>
| category_add | <img src="../../assets/icons/category_add_icon.svg"/>
| category_close | <img src="../../assets/icons/category_close_icon.svg"/>
| category_dropdown | <img src="../../assets/icons/category_dropdown_icon.svg"/>
| category_open | <img src="../../assets/icons/category_open_icon.svg"/>
| header_enterprise | <div style="background:black"><img src="../../assets/icons/header_enterprise_icon.svg"/></div>
| header_user | <div style="background:black"><img src="../../assets/icons/header_user_icon.svg"/></div>
| header_dialog | <div style="background:black"><img src="../../assets/icons/header_dialog_icon.svg"/></div>
| header_dropdown | <div style="background:black"><img src="../../assets/icons/header_dropdown_icon.svg"/></div>
| header_dropdown_gray | <img src="../../assets/icons/header_dropdown_gray_icon.svg"/>
| intent | <img src="../../assets/icons/intent_icon.svg"/>
| info_warning_gray | <img src="../../assets/icons/info_warning_gray_icon.svg"/>
| close_expand | <img src="../../assets/icons/close_expand_icon.svg"/>
| upload | <img src="../../assets/icons/upload_icon.svg"/>
| year_left | <img src="../../assets/icons/year_left_icon.svg"/>
| year_right | <img src="../../assets/icons/year_right_icon.svg"/>
| month_left | <img src="../../assets/icons/month_left_icon.svg"/>
| month_right | <img src="../../assets/icons/month_right_icon.svg"/>
