<template>
  <div id="task-engine-upload">
    <div class="content">
      <div class="row">
        <text-button main @click="downloadTemplate()">{{ $t('task_engine.download_template') }}</text-button>
      </div>
      <div class="row">
        <text-button main @click="triggerUpload" class="file-selector">{{ $t("general.browse") }}</text-button>
        <span>{{ fileName }}</span>
        <input type="file" ref="uploadInput" v-on:change="changeFile()" accept=".csv">
        <text-button main @click="upload()" v-if="fileName !== ''">{{ $t("general.upload") }}</text-button>
      </div>
      {{ $t("general.description") }}：
      <div>
        <ol>
          <li v-for="(line, idx) in desc" :key="idx">{{ line }}</li>
        </ol>
      </div>
      <div style="width:40%;">
        <general-table :contents="tableData" :headerInfo="tableHeader"></general-table>
      </div>
    </div>
  </div>
</template>

<script>
import misc from '@/utils/js/misc';
import generalTable from '@/components/GeneralTable';
import api from './_api/taskEngine';
import importDesc from './_data/taskEngineImportDesc';

export default {
  path: 'task-engine-upload',
  privCode: 'task_engine',
  displayNameKey: 'task_engine_upload',
  icon: 'white_task_engine_upload',
  name: 'task-engine-upload',
  api,
  components: {
    generalTable,
  },
  data() {
    return {
      desc: '',
      fileName: '',
      i18n: {},
      tableHeader: [],
      tableData: [],
    };
  },
  methods: {
    downloadTemplate() {
      const csvData = '中国国际航空,CA\r\nairchina,CA\r\nair china,CA\r\n中国东方航空,MU\r\nchina eastern airlines,MU\r\n';
      const blobData = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvData], { type: 'text/csv' });
      misc.downloadRawFile(blobData, 'task_engine_template.csv');
    },
    setUpDescription(locale) {
      this.desc = importDesc[locale];
    },
    triggerUpload() {
      this.$refs.uploadInput.click();
    },
    changeFile() {
      const files = this.$refs.uploadInput.files;
      const file = files[0] || undefined;
      if (file) {
        this.fileName = file.name;
      } else {
        this.fileName = '';
      }
    },
    upload() {
      const files = this.$refs.uploadInput.files;
      const file = files[0] || undefined;
      const that = this;
      const appid = that.$cookie.get('appid');

      if (!file) {
        that.$popError(that.$t('error_msg.upload_file_undefined'));
      } else if (file.size <= 0 || file.size > 2 * 1024 * 1024) {
        that.$popError(that.$t('error_msg.upload_file_size_error'));
      } else {
        that.$emit('startLoading');
        that.$api.uploadMapping(appid, file).then((data) => {
          const res = data.data;
          if (res.return === 0) {
            that.$popError(that.$t('error_msg.success'));
            that.$refs.uploadInput.value = '';
            that.changeFile();
            that.loadList();
          } else {
            that.$popError(that.$t('error_msg.save_fail'), res.error);
          }
          that.$emit('endLoading');
        }, (err) => {
          that.$popError(that.$t('error_msg.save_fail'), err.message);
          that.$emit('endLoading');
        });
      }
    },
    deleteMapping(idx) {
      const that = this;
      const fileName = that.tableData[idx].file_name;

      that.$emit('startLoading');
      that.$api.deleteMappingList(fileName).then(() => {
        that.$emit('endLoading');
        that.$popError(that.$t('error_msg.delete_success'));
        that.loadList();
      }, (err) => {
        that.$popError(that.$t('error_msg.delete_fail'), err.message);
        that.$emit('endLoading');
      });
    },
    downloadMapping(idx) {
      const that = this;
      const fileName = that.tableData[idx].file_name;
      const user = that.tableData[idx].user;

      that.$emit('startLoading');
      that.$api.downloadMappingList(fileName, user).then((data) => {
        that.$emit('endLoading');
        const mappingTable = JSON.parse(data.data);
        const mappingDataArray = mappingTable.mapping_table;
        const tableName = mappingTable.metadata.mapping_table_name;
        let csvData = '';
        mappingDataArray.forEach((mappingData) => {
          csvData += `${mappingData.key},${mappingData.value}\r\n`;
        });
        const blobData = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvData], { type: 'text/csv' });
        misc.downloadRawFile(blobData, `${tableName}.csv`);
      }, (err) => {
        that.$popError(that.$t('error_msg.save_fail'), err.message);
        that.$emit('endLoading');
      });
    },
    setUpMsg() {
      const that = this;
      that.tableHeader = [
        {
          key: 'file_name',
          text: that.$t('general.file'),
          type: 'text',
        },
        {
          key: 'delete_buttons',
          text: that.$t('general.delete'),
          type: 'buttons',
        },
        {
          key: 'download_buttons',
          text: that.$t('general.export'),
          type: 'buttons',
        },
      ];
      that.deleteButtonList = {
        button: [
          {
            text: that.$t('general.delete'),
            primary: true,
            callback: that.deleteMapping,
          },
        ],
      };
      that.downloadButtonList = {
        button: [
          {
            text: that.$t('general.export'),
            primary: true,
            callback: that.downloadMapping,
          },
        ],
      };
    },
    loadList() {
      const that = this;

      that.$emit('startLoading');
      that.tableData = [];
      const userid = that.$cookie.get('userid');
      if (userid !== '4c8cad6375894d487327cd1e7c5d5ef4') { // add template data for none template user
        that.$api.getTemplateMappingList().then((data) => {
          const files = data.data;
          files.forEach((file) => {
            that.tableData.push({
              file_name: file,
              delete_buttons: [], // can't delete template user's data
              download_buttons: that.downloadButtonList,
              user: 'templateadmin',
            });
          });
          that.$emit('endLoading');
        }, (err) => {
          that.$popError(that.$t('error_msg.data_format_err'), err.message);
          that.$emit('endLoading');
        });
      }
      that.$api.getMappingList().then((data) => {
        const files = data.data;
        if (files) {
          files.forEach((file) => {
            that.tableData.push({
              file_name: file,
              delete_buttons: that.deleteButtonList,
              download_buttons: that.downloadButtonList,
              user: userid,
            });
          });
        } else {
          that.$popError(that.$t('error_msg.data_format_err'));
        }
        that.$emit('endLoading');
      }, (err) => {
        that.$popError(that.$t('error_msg.data_format_err'), err.message);
        that.$emit('endLoading');
      });
    },
  },
  activated() {
    this.loadList();
  },
  mounted() {
    this.setUpDescription(this.$i18n.locale);
    this.setUpMsg();
    this.loadList();
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';
$row-height: $default-line-height;

#task-engine-upload {
  .row {
    margin: 5px 0;
    .text-button {
      margin-right: 10px;
    }
    input[type=file] {
      visibility: hidden;
    }
    .file-selector {
      & ~ input {
        display: none;
      }
    }
  }
  ol {
    list-style: decimal inside none;
    line-height: $row-height;
  }
}

</style>
