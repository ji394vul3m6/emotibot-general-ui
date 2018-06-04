import { object, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import GeneralTable from '../../components/GeneralTable';

export default [{
  name: 'generalTable',
  func: () => {
    const header = [{
      key: 'wordbank',
      text: '詞庫',
      width: '120px',
    }, {
      key: 'synonym',
      text: '同義詞',
      type: 'tag',
    }];
    const data = [{
      wordbank: '詞庫名稱',
      synonym: ['一個同義詞', '兩個同義詞'],
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

    const tableHeader = object('table header', header);
    const tableData = object('table data', data);
    const checkbox = boolean('checkbox', false);
    const click = object('action', actionType);

    const template = '<general-table :tableHeader="tableHeader"  :tableData="tableData" :checkbox="checkbox" :action="click"></general-table>';

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
        };
      },
      methods: {
      },
      template,
    };
  },
}];
