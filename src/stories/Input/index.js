import { text, boolean, number } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import InfoInput from '../../components/basic/InfoInput';
import SearchInput from '../../components/basic/SearchInput';

const escape = (template) => {
  const div = document.createElement('div');
  div.innerText = template;
  return div.innerHTML;
};

export default [
  {
    name: 'Info Input',
    func: (i18n) => {
      const type = text('type', 'password');
      const inputText = text('input text (v-model)', 'I am Input Text');
      const placeholder = text('placeholder', 'I am placeholder');
      const fill = boolean('fill', false);
      const disabled = boolean('disabled', false);
      const maxlength = number('maxlength', 20);
      const error = boolean('error', false);
      const errorMsg = text('errorMsg', 'This is error msg');
      const msg = text('msg', 'This is info msg');
      const autocomplete = text('autocomplete', 'new-password');
      const template = `
        <info-input
          :type="type"
          v-model="inputText"
          :placeholder="placeholder"
          :msg="msg"
          :fill="fill"
          :disabled="disabled"
          :maxlength="maxlength"
          :error="error"
          :errorMsg="errorMsg"
          :autocomplete="autocomplete"
          @input="handleInput">
        </info-input>`;
      const templateStr = escape(template);

      return {
        components: {
          InfoInput,
        },
        data() {
          return {
            type,
            inputText,
            placeholder,
            msg,
            fill,
            disabled,
            maxlength,
            error,
            errorMsg,
            autocomplete,
          };
        },
        methods: {
          handleInput(val) {
            action('input', val);
          },
        },
        template: `
        <div>
          ${template}
          <br>
          <p><pre>

          NOTE:
          1. prop: error 和 errorMsg 需要同時存在，error = true 時會觸發顯示error tooltip
          2. error = false 時，hover tooltip 顯示在 input 上方; 反之顯示在下方
          3. type: 'text', 'password'
          4. 可以對 info-input 綁 ref，"$refs.[refName].focus()" 觸發input focus style.
          5. 'autocomplete' option 用來和 'password' type 搭配
          </pre></p>
          <pre>${templateStr}</pre>
        </div>`,
        i18n,
      };
    },
  },
  {
    name: 'Search Input',
    func: (i18n) => {
      const inputText = text('keyword (v-model)', 'keyword');
      const fill = boolean('fill', false);
      const template = `
        <search-input
          v-model="inputText"
          :fill="fill"
          @input="handleInput"
        >
        </search-input>`;

      return {
        components: {
          SearchInput,
        },
        data() {
          return {
            inputText,
            fill,
          };
        },
        methods: {
          handleInput(val) {
            action('input')(val);
          },
        },
        template,
        i18n,
      };
    },
  },
];
