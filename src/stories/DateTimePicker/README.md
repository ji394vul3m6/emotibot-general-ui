# DatePicker & Datetime Picker
---
系統內所有 **日期時間選擇組件** ，可以單獨使用日期 DatePicker 或使用包含時間的 DatetimePicker

## Usage
---

### DatePicker

使用 vuejs-datepicker，參考文件 [vuejs-datepicker](https://github.com/charliekassel/vuejs-datepicker#available-props)

```
  // template
  <date-picker
    v-model="someDate"    // 選取的日期，type: Date or String
    language="zh"         // 系統統一設成 zh
    format="yyyy/MM/dd"   // 日期顯示格式，系統統一設成 yyyy/MM/dd
    :readonly="false"     // 是否唯讀
    :disabled="{to: earliestDate}"    // 設置禁止選取的日期 type: Object
    @selected="handleSelectDate"      // 選取日期改變回傳 event
  ></date-picker>

  // script
  import DatePicker from '@/components/DateTimePicker/DatePicker';
```

disabled 格式參考 [disabled 格式](https://github.com/charliekassel/vuejs-datepicker#disabled-dates)

### DateTimePicker

```
  // template
  <datetime-picker
    :value="someDateObj"        // 預設的日期時間 type: DateObj，見下方 DatePickerUtils 說明
    :disableDate="disableDate"  // 設置禁止選取的日期，同 DatePicker 格式
    @dateChanged="handleDateChanged"    // 選取日期改變回傳 event
    @validityChange="handleDateValidityChange" // 日期驗證回傳 event
  ></datetime-picker>

  // script
  import DatetimePicker from '@/components/DateTimePicker';
```

### 使用 DatePickerUtils 幫助開發

使用已經定義好的函式，幫助快速產生 DatetimePicker 需要的 DateObj 格式

#### 引入 DatePickerUtil
```
  import pickerUtil from '@/utils/vue/DatePickerUtil';
```

#### 產生符合 datetime-picker value 格式的 dateObj

```
  const picker = pickerUtil.createDateObj();
```

#### 產生已定義好的永久時間

```
  let startPicker = pickerUtil.createForeverStartPickerObj(); // 1970-01-01 00:00:00
  let endPicker = pickerUtil.createForeverEndPicker(); // 2999-12-31 23:59:00
```
