# Toggle
----------------

## Usage
系統內所有 **開關按鈕** ，點擊會 toggle 開啟和關閉狀態

---
## Sample Code

### Simple Usage
```
  <toggle 
    v-model="value"
    :big="big"
    :disabled="disabled"
    @change="handleChange">
  </toggle>
```

---
## Props

| Prop | required | Type | Accepted Values | Default | 說明 |
|---|---|---|---|---|---|
| value<br>(v-model) | false | Boolean | true / false | false | 開關按鈕預設開關狀態
| big | false | Boolean | true / false | false | 開關按鈕是否放大
| disabled | false | Boolean | true / false | false | 開關按鈕樣式是否為 disabled， disabled 樣式禁止操作開關

---
## Events

| Event | Callback $event | 說明 |
|---|---|---|
| change | toggleStatus | 點擊開關按鈕，回傳 toggle 後設定的開關狀態 |