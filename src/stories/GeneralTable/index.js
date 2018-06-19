import { object, boolean, select } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import GeneralTable from '../../components/GeneralTable';

export default [{
  name: 'generalTable',
  func: (i18n) => {
    function clickToggle(rowdata, idx) {
      action('click toggle')(rowdata, idx);
    }

    const header = [{
      key: 'wordbank',
      text: '詞庫',
      width: '120px',
    }, {
      key: 'synonym',
      text: '同義詞',
      type: 'tag',
    }, {
      key: 'status',
      text: '狀態',
      type: 'toggle',
      width: '60px',
    }];
    const data = [{
      wordbank: '詞庫名稱',
      synonym: ['一個同義詞', '兩個同義詞'],
      status: {
        val: true,
        onclick: clickToggle,
      },
    }];

    function clickEdit(rowdata, idx) {
      action('click edit')(rowdata, idx);
    }
    function clickDelete(rowdata, idx) {
      action('click delete')(rowdata, idx);
    }
    const actionType = [{
      text: '編輯',
      type: 'primary',
      onclick: clickEdit,
    }, {
      text: '刪除',
      type: 'error',
      onclick: clickDelete,
    }];

    const fontTypes = {
      'font-12': '12號字',
      'font-14': '14號字',
      'font-16': '16號字',
    };
    const fontType = select('字體大小', fontTypes, 'font-14');
    const checkbox = boolean('checkbox', false);
    const autoHeight = boolean('autoHeight', false);
    const showEmpty = boolean('showEmpty', false);
    const tableHeader = object('table header', header);
    const tableData = object('table data', data);
    const click = object('action', actionType);

    const template = `
    <div width="100%">
      <general-table
        :fontClass="fontType"
        :autoHeight="autoHeight"
        :tableHeader="tableHeader" 
        :tableData="tableData"
        :checkbox="checkbox"
        :action="click"
        :showEmpty="showEmpty" />
    </div>`;

    return {
      components: {
        GeneralTable,
      },
      data() {
        return {
          tableHeader,
          tableData,
          checkbox,
          click,
          autoHeight,
          fontType,
          showEmpty,
        };
      },
      methods: {
      },
      template,
      i18n,
    };
  },
}];
