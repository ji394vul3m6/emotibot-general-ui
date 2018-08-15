import { text, select, number } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { withMarkdownNotes } from '@storybook/addon-notes';
import TextButton from '../../components/basic/TextButton';
import README from './README.md';

export default [
  {
    name: 'TextButton',
    func: withMarkdownNotes(README)(() => {
      const width = text('寬度', '200px');
      const height = text('高度', '40px');
      const buttonTxt = text('文字', 'TextButton');
      const buttonTypes = {
        default: 'default 預設',
        fill: 'fill 一般按鈕',
        primary: 'primary 主要按鈕',
        disable: 'disable 失效按鈕',
        error: 'error 錯誤按鈕',
      };
      const iconAlignTypes = {
        left: 'left 靠左',
        right: 'right 靠右',
      };
      const buttonType = select('按鈕類型', buttonTypes, 'default');
      const iconType = text('iconType', 'search');
      const iconSize = number('iconSize', 16);
      const iconAlign = select('iconAlign', iconAlignTypes, 'left');
      const template = `
        <text-button
          width='${width}'
          height='${height}'
          button-type='${buttonType}'
          iconType="${iconType}"
          :iconSize="${iconSize}"
          iconAlign="${iconAlign}"
          @click="test">
          ${buttonTxt}
        </text-button>`;

      return {
        components: { TextButton },
        methods: {
          test: action('click'),
        },
        template: `<div>
        ${template}
        </div>`,
      };
    }),
  },
];
