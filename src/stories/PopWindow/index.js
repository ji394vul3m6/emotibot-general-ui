import action from '@storybook/addon-actions';
import { withMarkdownNotes } from '@storybook/addon-notes';
import TextButton from '../../components/basic/TextButton';
import README from './README.md';

export default [
  {
    name: 'PopWindow',
    func: withMarkdownNotes(README)(() => {
      const template = `
        <div>
          <pop-windows id="popwindow"></pop-windows>
          <div class="div-block">
            <div class="headline">確認彈窗：$popCheck</div>
            <div class="line"> 
              <text-button
                button-type='primary'
                @click="showCheckPop">
                點我出現 確認 POP
              </text-button>
            </div>
          </div>
          <div class="div-block">
            <div class="headline">自訂彈窗：$pop</div> 
            <div class="line"> 
              <text-button
                button-type='primary'
                @click="showPop">
                點我出現 自訂 POP
              </text-button>
            </div>
          </div>
          <div class="div-block">
            <div class="headline">警示彈窗：$popWarn</div>
            <div class="line">  
              <text-button
                button-type='error'
                @click="showWarnPop">
                點我出現 警示 POP
              </text-button>
            </div>
          </div>
          <div class="div-block">
            <div class="headline">錯誤彈窗：$popError</div> 
            <div class="line"> 
              <text-button
                button-type='error'
                @click="showErrorPop">
                點我出現 錯誤 POP
              </text-button>
            </div>
          </div>
          <div class="div-block">
            <div class="headline">說明彈窗：$popDescription</div> 
            <div class="line"> 
              <text-button
                button-type='error'
                @click="showDescriptionPop">
                點我出現 說明 POP
              </text-button>
            </div>
          </div>
        </div>`;

      return {
        components: { TextButton },
        methods: {
          showCheckPop() {
            const that = this;
            const option = {
              data: {
                msg: '我是一個確認彈窗',
              },
              callback: {
                ok: () => {
                  action('check pop callOK');
                },
              },
            };
            that.$popCheck(option);
          },
          showErrorPop() {
          },
          showPop() {
          },
          showDescriptionPop() {
          },
          showWarnPop() {
            const that = this;
            const option = {
              data: {
                msg: '我是一個警示彈窗內容！！！！！',
              },
              callback: {
                ok: () => {
                  action('warn pop CallOK');
                },
              },
            };
            that.$popWarn(option);
          },
        },
        template: `<div>
        ${template}
        </div>`,
      };
    }),
  },
];
