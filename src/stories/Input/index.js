import { text, boolean, number } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { withMarkdownNotes } from '@storybook/addon-notes';
import InfoInput from '../../components/basic/InfoInput';
import SearchInput from '../../components/basic/SearchInput';
import READMEInput from './README_Input.md';
import READMEInfoInput from './README_InfoInput.md';
import READMESearchInput from './README_SearchInput.md';

export default [
  {
    name: 'Input',
    func: withMarkdownNotes(READMEInput)(() => {
      const basicInput = '<input></input>';
      const errorInput = '<input class="error"></input>';
      return {
        template: `
          <div>
            <div style="margin-bottom: 10px;">Input<br><br>${basicInput}</div>
            <div>Error Input<br><br>${errorInput}</div>
          </div>
        `,
      };
    }),
  },
  {
    name: 'Info Input',
    func: withMarkdownNotes(READMEInfoInput)((i18n) => {
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
        </div>`,
        i18n,
      };
    }),
  },
  {
    name: 'Search Input',
    func: withMarkdownNotes(READMESearchInput)((i18n) => {
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
    }),
  },
];
