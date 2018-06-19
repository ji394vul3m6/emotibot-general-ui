import { object } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

export default [
  {
    name: 'hover 顯示',
    func: () => {
      const option = object('setting', {
        msg: 'test',
      });
      const template = `
      <div>
        <div :style="divStyle">只需要寫 option 到 v-tooltip 即可使用的 tooltip</div>
        <span v-tooltip="option"> 移入顯示 </span>
      </div>`;
      return {
        data() {
          return {
            option,
            divStyle: {
              margin: '20px 0px',
            },
          };
        },
        template,
      };
    },
  },
  {
    name: 'click 顯示',
    func: () => {
      const option = object('setting', {
        msg: 'test',
        clickShow: true,
      });
      const template = `
      <div>
        <div :style="divStyle">只需要寫 option 到 v-tooltip 即可使用的 tooltip</div>
        <span v-tooltip="option">點擊</span>
      </div>`;
      return {
        data() {
          return {
            option,
            divStyle: {
              margin: '20px 0px',
            },
          };
        },
        template,
      };
    },
  },
  {
    name: 'click 顯示並附有按鈕關閉',
    func: () => {
      const retData = { test: 1 };
      const doSomething = (data) => {
        action('ok callback')(data);
      };
      const option = object(';setting', {
        msg: 'test',
        clickShow: true,
        data: retData,
        buttons: [
          {
            msg: 'cancel',
            closeAfterClick: true,
          },
          {
            msg: 'ok',
            callback: doSomething,
            closeAfterClick: true,
            buttonType: 'fill',
          },
        ],
      });
      const template = `
      <div>
        <div :style="divStyle">
          當使用的屬性中包含 buttons 的時候即可顯示按鈕</br>
          每個按鈕各自可設定點擊後，是否關閉 tooltip</br>
          設定 callback，也可以設置按鈕的類型
        </div>
        <span v-tooltip="option">點擊</span>
      </div>`;
      return {
        data() {
          return {
            option,
            divStyle: {
              margin: '20px 0px',
            },
          };
        },
        template,
      };
    },
  },
  {
    name: '觸發後自動消失',
    func: () => {
      const option = object('setting', {
        msg: 'test',
        animateShow: true,
        animateTime: 1000,
      });
      const template = `
      <div>
        <div :style="divStyle">
          也可透過對 DOM 觸發一個 'tooltip-show' 的事件 <br>
          便可使 tooltip 顯示，並於一定時間後自動消失 <br>
          animateTime 可以設定消失的時間長短 (ms) 預設為 3000 ms
        </div>
        <input v-tooltip="option" ref='input'>
        <button @click='show'>顯示</button>
      </div>`;
      return {
        data() {
          return {
            option,
            divStyle: {
              margin: '20px 0px',
            },
          };
        },
        methods: {
          show() {
            console.log(this.$refs);
            this.$refs.input.dispatchEvent(new Event('tooltip-show'));
          },
        },
        template,
      };
    },
  },
];
