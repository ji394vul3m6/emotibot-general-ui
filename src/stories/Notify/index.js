import { withMarkdownNotes } from '@storybook/addon-notes';
import TextButton from '../../components/basic/TextButton';
import README from './README.md';

export default [
  {
    name: 'Notification',
    func: withMarkdownNotes(README)(() => {
      const template = `
        <div>
          <div :style="divBlockStyle">
            <div style="font-size: 18px">一般通知：$notifyInfo</div>
            <div :style="tipBlockStyle"> 
              <text-button
                button-type='primary'
                @click="showNotify">
                點我出現 一般通知
              </text-button>
            </div>
          </div>
          <div :style="divBlockStyle">
            <div style="font-size: 18px">成功通知：$notify</div> 
            <div :style="tipBlockStyle"> 
              <text-button
                button-type='primary'
                @click="showNotifySuccess">
                點我出現 成功通知
              </text-button>
            </div>
          </div>
          <div :style="divBlockStyle">
            <div style="font-size: 18px">警示通知：$notifyWarn</div>
            <div :style="tipBlockStyle">  
              <text-button
                button-type='error'
                @click="showNotifyWarning">
                點我出現 警告通知
              </text-button>
            </div>
          </div>
          <div :style="divBlockStyle">
            <div style="font-size: 18px">錯誤通知：$notifyError</div> 
            <div :style="tipBlockStyle"> 
              <text-button
                button-type='error'
                @click="showNotifyError">
                點我出現 錯誤通知
              </text-button>
            </div>
          </div>
          <notification></notification>
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
          showNotify() {
            this.$notifyInfo('注意系統維修');
          },
          showNotifyError() {
            this.$notifyFail('目前系統問題，請找 IT 人員');
          },
          showNotifySuccess() {
            this.$notify({ text: '新增帳號成功' });
          },
          showNotifyWarning() {
            this.$notifyWarn('警示訊息');
          },
        },
        template: `<div>
        ${template}
        </div>`,
      };
    }),
  },
];
