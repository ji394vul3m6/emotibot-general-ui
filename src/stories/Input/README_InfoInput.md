# Info Input
----------------

## Usage
系統內所有 **帶Info Icon的文字輸入框** ，Hover 到 Info Icon 時會出現提示 Tooltip，文字輸入框需要 **提示輸入格式** 時使用

---
## Sample Code

### Simple Usage
```
  <info-input
    v-model="inputValue"
    :msg="infoMsg"
    :placeholder="inputPlaceholder"
    :maxlength="inputMaxlength"
  >
  </info-input>
```
### InfoInput with Error Style
* 若 error 和 errorMsg 必須同時給定，error=true 時會觸發顯示 error tooltip
* tooltip 位置：當 error=false 時，info tooltip 顯示在 input 上方; 反之顯示在下方

```
  <info-input
    v-model="inputValue"
    :msg="infoMsg"
    :error="true"
    :errorMsg="errorMsg"
    :placeholder="inputPlaceholder"
    :maxlength="inputMaxlength"
  >
  </info-input>
```

### InfoInput with Password Type
* 若 type=password，建議必須要有錯誤驗證，並依驗證結果給予 error 和 errorMsg prop

```
  <info-input
    v-model="inputValue"
    :msg="infoMsg"
    :error="true"
    :errorMsg="errorMsg"
    :placeholder="inputPlaceholder"
    :maxlength="inputMaxlength"
    type="password"
    autocomplete="new-password"
  >
  </info-input>
```

---
## Props

| Prop | required | Type | Accepted Values | Default | 說明 |
|---|---|---|---|---|---|
| value<br>(v-model) | true | String | - | - | Input 文字內容
| msg | true | String | - | - | Hover 到 info Icon 時要顯示的提示內容
| fill | false | Boolean | true / false | false | input 寬度 100% 
| error | false | Boolean | true / false | false | Input 是否使用 error 樣式，<br>設為true 時必須給予 errorMsg 提示錯誤資訊
| errorMsg | false | String | - | - | 當 Input 是 error 樣式時，<br>提示錯誤資訊的 Tooltip 內容
| type | false | String | 'text' / 'password' | 'text' | 同原 input type 屬性
| placeholder | false | String | - | - | 同原 input placeholder 屬性
| disabled | false | Boolean | - | - | 同原 input disabled 屬性
| maxlength | false | Number | - | - | 同原 input maxlength 屬性
| autocomplete | false | String | - | - | 同原 input autocomplete 屬性，<br>和 type="password" 搭配使用

---
## Events

| Event | Callback $event | 說明 |
|---|---|---|
| input | inputText | 文字框輸入時，回傳文字框內輸入的文字內容

---
## NOTE
可以對 InfoInput 綁定 `ref="refName"` ，使用 `$refs.[refName].focus()` 來觸發 input focus 樣式