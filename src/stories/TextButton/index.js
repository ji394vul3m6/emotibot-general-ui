import { text, select } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import TextButton from '../../components/basic/TextButton';

export default [
  {
    name: '參數使用',
    func: () => {
      const width = text('寬度', '200px');
      const height = text('高度', '40px');
      const buttonTxt = text('文字', 'TextButton');
      const buttonTypes = {
        default: '預設',
        fill: '一般按鈕',
        primary: '主要按鈕',
        disable: '失效按鈕',
        error: '錯誤按鈕',
      };
      const buttonType = select('按鈕類型', buttonTypes, 'default');
      const template = `
        <text-button width='${width}' height='${height}' button-type='${buttonType}' @click="test">
          ${buttonTxt}
        </text-button>`;
      const escape = () => {
        const div = document.createElement('div');
        div.innerText = template;
        return div.innerHTML;
      };
      const templateStr = escape(template);
      return {
        components: { TextButton },
        methods: {
          test: action('click'),
        },
        template: `<div>
        ${template}
        <br>
        ${templateStr}
        </div>`,
      };
    },
  },
];
