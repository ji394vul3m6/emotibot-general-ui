import { text, boolean } from '@storybook/addon-knobs';
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
      const inputText = text('input text (v-model)', 'I am Input Text');
      const placeholder = text('placeholder', 'I am placeholder');
      const fill = boolean('fill', false);
      const disabled = boolean('disabled', false);
      const error = boolean('error', false);
      const errorMsg = text('errorMsg', 'This is error msg');
      const msg = text('msg', 'This is info msg');
      const template = `
        <info-input
          v-model="inputText"
          :placeholder="placeholder"
          :msg="msg"
          :fill="fill"
          :disabled="disabled"
          :error="error"
          :errorMsg="errorMsg"
          @input="handleInput">
        </info-input>`;
      const templateStr = escape(template);

      return {
        components: {
          InfoInput,
        },
        data() {
          return {
            inputText,
            placeholder,
            msg,
            fill,
            disabled,
            error,
            errorMsg,
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
