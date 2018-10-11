<template>
  <div class="import-block">
    <!-- <div class="method-chooser-block">
      <span class="method-option">
        <input type="radio" id="byUpdate" name="method" checked/>
        <label for="byUpdate">{{ $t('intent_engine.import.by_update') }}</label>
      </span>
      <span class="method-option">
        <input type="radio" id="byReplace" name="method"/>
        <label for="byReplace">{{ $t('intent_engine.import.by_replace') }}</label>
        <div class="icon-container"
          @mouseover="toggleIconHover(true)"
          @mouseout="toggleIconHover(false)"
          v-tooltip="infoTooltip"
          >
          <icon v-if="iconHover" iconType="info_hover" :size=16></icon>
          <icon v-else iconType="info" :size=16></icon>
        </div>
      </span>
    </div> -->
    
    <div class="file-chooser">
      <input type="file" ref="fileChooser" id="fileChooser" accept=".xlsx" @change="validateFile"/>
      <text-button
        class="file-button"
        @click="openFileChooser"
        iconType="upload"
        :iconSize=14>
        {{ $t('intent_engine.import.upload_file') }}
      </text-button>
      <span class="file-name"
        :class="{'error': !fileValid && filename !== defaultFilenameText, 'success': fileValid}">
        {{ filename }}
      </span>
    </div>
    <div class="support-format">
      {{ $t('intent_engine.import.support_format')}}      
    </div>
    <div class="download-template">
      <span @click="downloadTemplate">{{ $t('intent_engine.import.download_test_template')}}</span>      
    </div>
  </div>
</template>
<script>

export default {
  data() {
    return {
      defaultFilenameText: this.$t('intent_engine.import.choose_file'),
      filename: '',
      file: undefined,
      fileValid: false,

      iconHover: false,
      infoTooltip: {
        msg: this.$t('intent_engine.import.tooltip'),
      },
    };
  },
  watch: {
    fileValid() {
      if (this.fileValid) {
        this.$emit('enableOK');
      } else {
        this.$emit('disableOK');
      }
    },
  },
  methods: {
    downloadTemplate() {
      // window.open(, '_blank');
    },
    toggleIconHover(bool) {
      this.iconHover = bool;
    },
    openFileChooser() {
      this.$refs.fileChooser.click();
    },
    validateFile() {
      const that = this;
      const fileSizeLimit = 2 * 1024 * 1024;
      const theFile = that.$refs.fileChooser.files[0];
      if (!theFile) {
        that.fileValid = false;
        that.updateFilename(that.$t('intent_engine.import.upload_file_undefined'));
      } else if (theFile.size <= 0 || theFile.size > fileSizeLimit) {
        that.fileValid = false;
        that.updateFilename(that.$t('intent_engine.import.upload_file_size_error'));
      } else if (that.fileTypeInvalid(theFile)) {
        that.fileValid = false;
        that.updateFilename(that.$t('intent_engine.import.upload_file_type_invalid'));
      } else {
        that.fileValid = true;
        that.file = theFile;
        that.updateFilename();
      }
    },
    fileTypeInvalid(file) {
      const validType = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      return validType.indexOf(file.type) === -1;
    },
    updateFilename(msg) {
      const that = this;
      that.filename = msg || that.file.name;
    },
    validate() {
      const that = this;
      if (that.fileValid) {
        that.$emit('validateSuccess', that.file);
      }
    },
  },
  mounted() {
    const that = this;
    that.filename = that.defaultFilenameText;
    that.$on('validate', that.validate);
  },
};
</script>
<style lang="scss" scoped>

.import-block {
  @include font-14px();
  width: 480px;
  padding: 0 24px;
  .file-chooser {
    width: 100%;
    display: flex;
    align-items: center;
    #fileChooser {
      display: none;
    }
    .file-button {
      flex: 0 0 auto;
    }
    .file-name {
      @include font-12px();
      flex: 1 1 200px;
      margin-left: 10px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      &.error {
        color: $color-error;
      }
      &.success {
        color: $color-success;
      }
    }
  }
  .support-format {
    margin-top: 5px;
    margin-bottom: 20px;
    @include font-12px();
    color: $color-font-mark;
  }
  .download-template {
    @include font-12px();
    color: $color-primary;
    span {
      cursor: pointer;
    }
  }
  .method-chooser-block {
    margin-bottom: 32px;
    display: flex;
    .method-option {
      margin: 0 5px;
      display: flex;
      align-items: center;
      input[type=radio] {
        cursor: pointer;
      }
      label{
        cursor: pointer;
        margin-left: 6px;
      }
      .icon-container{
        margin-left: 8px;
        display: flex;
        align-items: center;
        cursor: pointer;
      }
    }
  }
  .devider {
    display: inline-block;
    height: 2px;
    width: 100%;
    margin: 24px 0;
    background-color: $color-primary;
    opacity: 0.25;
  }
  .note {
    li {
      list-style-type: disc;
      list-style-position: inside;
    }
  }
}
</style>