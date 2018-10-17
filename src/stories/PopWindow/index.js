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
          <div :style="divBlockStyle">
            <div style="font-size: 18px">確認彈窗：$popCheck</div>
            <div :style="tipBlockStyle"> 
              <text-button
                button-type='primary'
                @click="showCheckPop">
                點我出現 確認 POP
              </text-button>
            </div>
          </div>
          <div :style="divBlockStyle">
            <div style="font-size: 18px">自訂彈窗：$pop</div> 
            <div :style="tipBlockStyle"> 
              <text-button
                button-type='primary'
                @click="showPop">
                點我出現 自訂 POP
              </text-button>
            </div>
          </div>
          <div :style="divBlockStyle">
            <div style="font-size: 18px">警示彈窗：$popWarn</div>
            <div :style="tipBlockStyle">  
              <text-button
                button-type='error'
                @click="showWarnPop">
                點我出現 警示 POP
              </text-button>
            </div>
          </div>
          <div :style="divBlockStyle">
            <div style="font-size: 18px">錯誤彈窗：$popError</div> 
            <div :style="tipBlockStyle"> 
              <text-button
                button-type='error'
                @click="showErrorPop">
                點我出現 錯誤 POP
              </text-button>
            </div>
          </div>
          <div :style="divBlockStyle">
            <div style="font-size: 18px">說明彈窗：$popDescription</div> 
            <div :style="tipBlockStyle"> 
              <text-button
                button-type='error'
                @click="showDescriptionPop">
                點我出現 說明 POP
              </text-button>
            </div>
          </div>
          <pop-windows></pop-windows>
        </div>`;

      return {
        components: { TextButton },
        data() {
          return {
            tipBlockStyle: {
              margin: '20px 0px 0px 50px',
            },
            divBlockStyle: {
              backgroundColor: '#eeeeee',
              borderRadius: '4px',
              padding: '10px',
              margin: '20px 0px',
            },
          };
        },
        methods: {
          showCheckPop() {
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
                ok() {
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
