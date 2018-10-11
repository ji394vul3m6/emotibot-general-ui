import { object } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { withMarkdownNotes } from '@storybook/addon-notes';
import DropdownMenu from '../../components/basic/DropdownMenu';
import README from './README.md';

export default [{
  name: 'DropdownMenu',
  func: withMarkdownNotes(README)(() => {
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
        disabled: true,
      }, {
        text: '選項4',
        onclick: action('click option 4'),
      }, {
        text: '選項5',
        onclick: action('click option 5'),
        disabled: true,
      }, {
        text: '選項6',
        onclick: action('click option 6'),
        disabled: true,
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

    const template = `
      <div style="height: 500px">
        <div :style="divBlockStyle">
          <div style="font-size: 18px">Dropdown Menu 自訂寬度</div> 
          <div :style="menuBlockStyle">
            <text-button v-dropdown="option1" style="position:relative;">點我</text-button>
          </div>
        </div>
        <div :style="divBlockStyle">
          <div style="font-size: 18px">Dropdown Menu 往左延伸</div> 
          <div :style="menuBlockStyle">
            <text-button v-dropdown="option2" style="position:relative;">點我</text-button>
          </div>
        </div>
      </div>`;
    return {
      components: {
        DropdownMenu,
      },
      data() {
        return {
          option1,
          option2,
          menuBlockStyle: {
            margin: '20px 0px 0px 80px',
          },
          divBlockStyle: {
            backgroundColor: '#eeeeee',
            borderRadius: '4px',
            padding: '10px',
            margin: '20px 0px',
          },
        };
      },
      template,
    };
  }),
}];
