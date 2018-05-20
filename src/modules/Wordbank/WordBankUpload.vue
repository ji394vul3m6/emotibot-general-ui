<template>
  <div id="dictionary">
    <fieldset class="tab-page">
      <legend>{{ $t("wordbank.import_history") }}</legend>
      <div class="last-result">
        {{ $t('wordbank.last_import_result') }}：
        <span class="last-result-text" :class="{success: isLastResultSuccess}">{{ lastResult }}</span>
        <div v-if="!isEmptyUploadRecord && !isLastResultSuccess" class="last-result-info">
          <span>{{ lastResultErr }}</span>
        </div>
      </div>
      <div class="latest-upload" v-if="!isEmptyUploadRecord">
        <span>{{ $t("wordbank.download_import_result")}}：</span>
        <ol v-if="lastFile || currentFile">
          <li v-if="currentFile != undefined">
            <a :href="currentFile.path" @click.prevent.stop="logExport(currentFile.path)">{{ $t("wordbank.current_version") }}</a> ({{currentFile.timeStr}})
          </li>
          <li v-if="lastFile != undefined">
            <a :href="lastFile.path" @click.prevent.stop="logExport(lastFile.path)">{{ $t("wordbank.last_version") }}</a> ({{lastFile.timeStr}})
          </li>
        </ol>
        <span v-else> {{ $t("wordbank.result.empty") }}</span>
      </div>
    </fieldset>
    <fieldset class="tab-page">
      <legend>{{ $t("wordbank.batch_import") }}</legend>
      <div class="button-container" v-on:click="downloadTemplate()">
        <text-button>{{ $t("wordbank.download_batch_import_template") }}</text-button>
      </div>
      <div class="button-container" v-if="canImport">
        <text-button v-on:click="triggerUpload" id="file-selector">{{ $t("general.browse") }}</text-button>
        <span>{{ fileName }}</span>
        <input type="file" ref="uploadInput" v-on:change="changeFile()" accept=".xlsx">
        <text-button @click="upload()" v-if="fileName !== ''">{{ $t("general.upload") }}</text-button>
      </div>
      <div class="button-container">
        
      </div>
      {{ $t("wordbank.description") }}
      <div>
        <ol>
          <li v-for="part in desc" :key="part.info">
            {{ part.info }}
            <p v-for="line in part.content" :key="line">
              {{ line }}
            </p>
          </li>
        </ol>
      </div>
    </fieldset>
  </div>
</template>

<script>
import auditAPI from '@/api/audit';
import TextButton from '@/components/basic/TextButton';
// import auth from '@/auth';
import format from '@/utils/js/format';
import desc from './_data/wordbankImportDesc';
import api from './_api/wordbank';

function getPadedNum(num) {
  return num >= 10 ? num.toString() : `0${num}`;
}

export default {
  path: 'wordbank-upload',
  privCode: 'wordbank',
  displayNameKey: 'wordbank_upload',
  icon: 'white_wordbank_upload',
  components: {
    TextButton,
  },
  api: [api, auditAPI],
  methods: {
    logExport(path) {
      window.open(path, '_blank');

      // download audit will be add in v2 API
      // const paths = path.split('/');
      // const filename = paths[paths.length - 1];
      // const that = this;
      // const module = 'dictionary';

      // that.$api.auditExportLog({
      //   module,
      //   filename,
      // }).then(() => {
      //   window.open(path, '_blank');
      // }, (err) => {
      //   that.$popError(that.$t('error_msg.export_fail'), err.errMsg);
      // });
    },
    downloadTemplate() {
      window.open('/Files/wordbank_template.xlsx', '_blank');
    },
    clearSelectedFile() {
      this.fileName = '';
    },
    triggerUpload() {
      this.$refs.uploadInput.click();
    },
    setUpDescription(locale) {
      this.desc = desc[locale];
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
      if (!file) {
        that.popErrorWindow(that.$t('error_msg.upload_file_undefined'));
      } else if (file.size <= 0 || file.size > 2 * 1024 * 1024) {
        that.popErrorWindow(that.$t('error_msg.upload_file_size_error'));
      } else {
        that.$api.uploadFileV2(file).then((data) => {
          const res = data.data;
          if (res.status === 0) {
            that.popErrorWindow(that.$t('wordbank.wait_for_result'));
            that.$refs.uploadInput.value = '';
            that.changeFile();
          } else {
            that.popErrorWindow(that.$t('error_msg.save_fail'), res.result);
          }
        }, (err) => {
          that.$popError(that.i18n.error_msg.save_fail, err.errMsg);
        });
      }
    },
    updateFileInfo(fileInfos) {
      const current = fileInfos.currentFile;
      const last = fileInfos.lastFile;
      const that = this;

      if (current) {
        that.currentFile = that.convertFileInfo(current);
      } else {
        that.currentFile = undefined;
      }

      if (last) {
        that.lastFile = that.convertFileInfo(last);
      } else {
        that.lastFile = undefined;
      }
    },
    convertFileInfo(fileInfo) {
      const time = new Date(fileInfo.time);
      const month = time.getMonth() + 1;
      const day = time.getDate();
      const hour = time.getHours();
      const min = time.getMinutes();
      const seconds = time.getSeconds();

      return {
        timeStr: `${time.getFullYear()}-${getPadedNum(month)}-${getPadedNum(day)} ${getPadedNum(hour)}:${getPadedNum(min)}:${getPadedNum(seconds)}`,
        path: `${api.DOWNLOAD_PATH}/${fileInfo.filename}`,
      };
    },
    popErrorWindow(msg, err) {
      this.$popError(msg, err);
    },
    loadAllAjaxStatus(background) {
      const that = this;
      if (!background) {
        that.$emit('startLoading');
      }
      that.$api.getLastResult().then((data) => {
        const res = data.data;
        if (res.status === 0) {
          const handleResult = res.result;
          if (handleResult && handleResult.length !== 0) {
            const resultStatus = that.$t(`wordbank.result.${handleResult.status}`);
            that.lastResult = `${resultStatus} ( ${format.datetimeToString(res.result.start_time)} )`;
            that.lastResultErr = res.result.message;
            that.isLastResultSuccess = handleResult.status === 'success';
            setTimeout(() => {
              that.loadAllAjaxStatus(true);
            }, 10000);
          } else {
            that.lastResult = that.$t('wordbank.result.empty');
          }
        }
      })
      .then(() => that.$api.getDownloadMeta())
      .then((data) => {
        const res = data.data;
        if (res.status === 0) {
          that.updateFileInfo(res.result);
        }
        that.$emit('endLoading');
      })
      .catch((err) => {
        that.lastResult = that.$t('error_msg.request_fail');
        that.lastResultErr = err.message;
        that.isLastResultSuccess = false;
        that.$emit('endLoading');
      });
    },
    initPage() {
      this.loadAllAjaxStatus();
    },
  },
  data() {
    return {
      showPage: 'all',
      desc: '',
      fileName: '',
      i18n: {},
      lastFile: undefined,
      currentFile: undefined,
      lastResult: '',
      lastResultErr: '',
      code: 'dictionary',
      isLastResultSuccess: true,
    };
  },
  activated() {
    this.initPage();
  },
  computed: {
    canImport() {
      return this.$checkPrivilege(this.code, 'import');
    },
    canExport() {
      return this.$checkPrivilege(this.code, 'export');
    },
    isEmptyUploadRecord() {
      return this.currentFile === undefined && this.lastFile === undefined;
    },
  },
  mounted() {
    this.setUpDescription(this.$i18n.locale);
    this.initPage();
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';

$row-height: 30px;

#dictionary {
  .button-container {
    margin-bottom: 10px;

    .text-button {
      margin-right: 10px;
      
      &.auto-size {
        width: auto;
      }
    }

    #file-selector {
      & ~ input {
        display: none;
      }
    }
  }
  .tab-page {
    border: 1px solid black;
    padding: 5px 20px;
    margin-bottom: 20px;
    ol {
      list-style: decimal inside none;
      line-height: $row-height;
      p {
        margin-left: 20px;
      }
    }
    span {
      line-height: $row-height;
    }
    .last-result {
      margin-bottom: 20px;
    }
    .last-result-text {
      color: $error-color;
      font-weight: bold;
      &.success {
        color: $success-color;
        font-weight: bold;
      }
    }
    .last-result-info {
      color: gray;
      margin-left: 20px;
    }
    .latest-upload {
      ol {
        margin-left: 20px;
      }
    }
  }
}
</style>
