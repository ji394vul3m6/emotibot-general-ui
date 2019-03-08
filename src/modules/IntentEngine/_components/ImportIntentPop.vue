<template>
  <div class="import-block">
    <div class="note">
      {{$t('intent_engine.import.note')}}
    </div>
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
      <span @click="downloadTemplate">{{ $t('intent_engine.import.download_template')}}</span>      
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
      window.open('/Files/intent_template.xlsx', '_blank');
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
  border-top: 1px solid $color-borderline-disabled;
  border-bottom: 1px solid $color-borderline-disabled;
  padding: 10px 20px;
  .note{
    padding: 10px;
    background-color: $color-disabled;
  }
  .file-chooser {
    width: 100%;
    display: flex;
    align-items: center;
    margin-top: 10px;
    #fileChooser {
      display: none;
    }
    .file-button {
      flex: 0 0 auto;
      width: 96px;
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
    @include font-12px-line-height-28px();
    color: $color-primary;
    margin-bottom: 40px;
    span {
      @include clickable-text();
    }
  }
}
</style>