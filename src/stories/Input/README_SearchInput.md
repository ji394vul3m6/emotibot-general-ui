# Info Input
----------------

## Usage
系統內所有 **帶Search Icon的文字搜尋框**

---
## Sample Code

### Simple Usage
```
  <search-input
    v-model="keyword">
  </search-input>
```

---
## Props

| Prop | required | Type | Accepted Values | Default | 說明 |
|---|---|---|---|---|---|
| value<br>(v-model) | true | String | - | - | Input 文字內容
| fill | false | Boolean | true / false | false | input 寬度 100% 

---
## Events

| Event | Callback $event | 說明 |
|---|---|---|
| input | inputText | 文字框輸入時，回傳文字框內輸入的文字內容
| search | inputText | 文字框 focus 時按 enter，回傳文字框內輸入的文字內容