import { object, text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import DropdownMenu from '../../components/basic/DropdownMenu';

export default [{
  name: 'DropdownMenu',
  func: () => {
    const dropdown1 = {
      options: [{
        text: '選項1',
        onclick: action('click option 1'),
      }, {
        text: '選項2',
        onclick: action('click option 2'),
      }, {
        text: '選項3',
        onclick: action('click option 3'),
      }, {
        text: '選項4',
        onclick: action('click option 4'),
      }, {
        text: '選項5',
        onclick: action('click option 5'),
      }, {
        text: '選項6',
        onclick: action('click option 6'),
      }],
      width: '300px',
    };
    const dropdown2 = {
      options: [{
        text: '選項1',
        onclick: action('click option 1'),
      }, {
        text: '選項2',
        onclick: action('click option 2'),
      }],
      alignLeft: true,
    };
    const option1 = object('dropdown options', dropdown1);
    const option2 = object('alignLeft options', dropdown2);
    const width = text('width', '160px');
    const template = `
      <div style="height:300px">
        <p><pre>
使用 v-dropdown 可以讓元件出現 dropdown menu
！！！目前綁定dropdown的元件 position 要設成 <span style="color:red; fontWeight: bold">relative</span>

預設 Dropdown 出現在下方 並 切齊綁定 dropdown 的元件左邊(dropdown 往右長)
可以用 alignLeft: true ，將 dropdown 改為切齊右邊 (dropdown 往左長)
        </pre></p>
        <text-button v-dropdown="option1" style="position:relative; margin-left: 80px;">點我</text-button>
        <text-button v-dropdown="option2" style="position:relative; margin-left: 80px;">alignLeft:true</text-button>
      </div>`;
    return {
      components: {
        DropdownMenu,
      },
      data() {
        return {
          option1,
          option2,
          width,
        };
      },
      template,
    };
  },
}];
