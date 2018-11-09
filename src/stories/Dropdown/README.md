# Dropdown Select
----------------

## Usage
系統內所有 **下拉式選單**，支援單選與多選，支援將選項分組

---
## Sample Code

### Simple Usage: Single Select without Checked Icon
```
  <dropdown-select
    v-model="checkedValue"
    :options="options"
    :showCheckedIcon="false"
  />
```

### MultiSelect with Checked Icon and self-defined width
```
  <dropdown-select
    v-model="checkedValue"
    :options="options"
    :width="300px"
    multi
  />
```

---
## Props

| Prop | required | Type | Accepted Values | Default | 說明 |
|---|---|---|---|---|---|
| value<br>(v-model) | false | Array | - | [checkedKey1, checkedKey2, ...] | 已選中的選項，若 value 為空則沒有預設選中選項
| options | false | Array | 見下方 option 格式說明 | - | 下拉選單內的選項
| multi | false | Boolean | true / false | false | 是否支援多選
| width | false | String | - | auto | 自訂下拉 Input 框寬度
| flex | false | Boolean | true / false | false | 是否讓 DropdownSelect 可使用 flex 排版<br>下拉 Input 框將依 props:width 設為 `flex: 0 0 width`
| fixedListWidth | false | Boolean | true / false | true | 選單寬度是否與下拉 Input 框等寬<br>若為 false，則選單寬度會依選項內容長度變化<br>建議在選項內容較長時使用
| showCheckedIcon | false | Boolean | true / false | true | 下拉選單是否顯示 checked Icon 

### props: option 格式說明

Type: Array of Objects
每個 Object 是一個 **分組名稱** 或 **選項**，將依序列在下拉選單中

| Object Keys | required | Type | Accepted Values | Default | 說明 |
|---|---|---|---|---|---|
| text | true | String | - | - | 顯示的選項文字 or 分組名文字
| value | false | String | - | - | 該選項的 value<br>如果是 **選項** ，必須要有 value 值
| isGroup | false | String | Boolean | true / false | false | 是否是分組名，當下拉選單需要分組時必填
| inGroup | false | String | Boolean | true / false | false | 是否是選項，當下拉選單需要分組時必填

* 如果下拉選單不需分組，不需給定 isGroup, inGroup 值，所有 Object 都會預設為 **選項**

```
  option: [
    {
      isGroup: true,
      text: '選項群組 1',
    },
    {
      inGroup: true,
      text: '選項 1-1',
      value: 'val 1'
    },
    {
      inGroup: true,
      text: '選項 1-2',
      value: 'val 2'
    },
    {
      isGroup: true,
      text: '選項群組 2',
    },
    {
      inGroup: true,
      text: '選項 2-1',
      value: 'val 3'
    },
  ]
```

---
## Events

| Event | Callback $event | 說明 |
|---|---|---|
| input | Array of checked values | 點選選項時，回傳目前選中的選項

---
## 可 emit 的 Event
| Event | params | 說明 |
|---|---|---|
| select | checked value | 選取一個選項，若為多選，不會清空已選取的選項
| reset | Array of checked values | 指定選取傳入的選項，會取代原本的選取