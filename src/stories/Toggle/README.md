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

| Prop | required | Type | Default | 說明 |
|---|---|---|---|---|
| value<br>(v-model) | - | Boolean | false | 開關按鈕預設狀態
| big | - | Boolean | false | 開關按鈕是否放大
| disabled | - | Boolean | false | 開關按鈕樣式是否為 disabled， disabled 樣式禁止操作開關

---
## Events

| Event | Callback $event | 說明 |
|---|---|---|
| change | toggleStatus | 點擊開關按鈕，回傳 toggle 後設定的開關狀態 |