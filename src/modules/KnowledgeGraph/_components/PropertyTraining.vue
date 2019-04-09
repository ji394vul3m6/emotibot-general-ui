<!--suppress ALL -->
<template>
  <div>
    <div id="wordbank-upload-block" class="card h-fill">
      <div id="wordbank-upload-header">
        {{ $t('knowledge_graph.training.title') }}
      </div>
      <div id="wordbank-upload-content">
        <template v-if="canImport">
          <div class="upload-item-block">
            <div id="import_content" class="upload-item-content">
              <div id="import_tool">
                <text-button
                  width="96px"
                  @click="startTraining">
                  {{ $t('knowledge_graph.training.title') }}
                </text-button>
                <!--<span id="filename">{{ newFileName }}</span>-->
              </div>
              <!--<div id="import_button_hint"> {{ $t('wordbank.import_button_hint') }}</div>-->
            </div>
          </div>
        </template>

        <div class="upload-item-block">
          <div class="upload-item-title">{{ $t('knowledge_graph.training.result') }}</div>
          <div id="last_import_content" class="upload-item-content"
               :class="{'error': !isLastResultSuccess}">
            {{ lastImportResult }}
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import { mapGetters } from 'vuex';
  import api from '../_api/knowledgeGraph';

  export default {
    name: 'ClusterTool',
    path: 'cluster-tool',
    privCode: 'wordbank',
    displayNameKey: 'cluster_tool',
    icon: 'white_folder',
    api,

    data() {
      return {
        message: 0,
        interval: {},
        listenFlag: false,
        lastImportResult: '未知',
        isLastResultSuccess: false,
        lastFile: {},
        currentFile: {},
        isDeduplicated: false,
        taskId: '',
      };
    },

    computed: {
      ...mapGetters([
        'robotID',
      ]),

      canImport() {
        return this.$hasRight('import');
      },
      canExport() {
        return this.$hasRight('export');
      },
    },

    watch: {
      listenFlag() {
        if (this.listenFlag === true) {
          this.getStatus();
        }
      },
    },

    methods: {

      logExport(taskId) {
        const path = this.$api.exportFile(taskId);
        window.open(path, '_blank');
      },

      getStatus() {
        let timesRun = 0;
        this.initCall(this.taskId)
          .then((data) => {
            this.lastImportResult = data.data.errno;
            if (this.lastImportResult !== 'Done') {
              const interval = setInterval(() => {
                this.getLatestStatus(this.taskId);
                timesRun += 1;
                console.log(this.lastImportResult);
                if (this.lastImportResult === 'Done' || timesRun === 1000) {
                  clearInterval(interval);
                  this.isLastResultSuccess = true;
                  this.listenFlag = false;
                }
              }, 2000);
            }
          });
      },

      startTraining() {
        // const timesRun = 0;
        let taskId = '';
        this.$api.triggerTraining(this.robotID)
          .then((data) => {
            console.log(data);
            if (data.data.errno === 'success') {
              taskId = data.data.taslId;
              return this.$api.checkTrainingStatus(taskId);
            }
            return new Promise((resolve) => {
              resolve();
            });
          })
          .then((result) => {
            if (result.data.errno === 'Done') {
              this.lastImportResult = 'Done';
            } else {
              this.listenFlag = true;
              this.taskId = taskId;
            }
          });
      },

      initCall(taskId) {
        return this.$api.checkTrainingStatus(taskId);
      },

      getLatestStatus(taskId) {
        this.$api.checkTrainingStatus(taskId)
          .then((data) => {
            this.lastImportResult = data.data.errno;
          });
      },

    },
    mounted() {
      this.lastImportResult = 'initial';
    },

  };
</script>

<style lang="scss" scoped>

  @import 'styles/variable.scss';

  #wordbank-upload-block {
    @include font-14px();
    width: 100%;
    height: 100%;

    #wordbank-upload-header {
      @include font-16px();
      color: $color-font-active;
      height: 60px;
      border-bottom: 1px solid $color-borderline;
      display: flex;
      align-items: center;
      padding: 20px;
    }
    #wordbank-upload-content {
      padding: 20px;
    }

    .upload-item-block {
      &:not(:last-child) {
        margin-bottom: 20px;
      }
      .upload-item-title {
        @include font-16px();
        font-weight: 500;
        color: $color-font-active;
        margin-bottom: 10px;
      }
    }
  }

  #import_content {
    #import_tool {
      display: flex;
      align-items: center;
      margin-bottom: 5px;
      #fileChooser {
        display: none;
      }
      #filename {
        color: $color-success;
      }
    }
    #import_button_hint {
      @include font-12px();
      color: $color-font-mark;
    }
  }

  #last_import_content {
    color: $color-success;
    &.error {
      color: $color-error;
    }
  }

  #imported_content {
    :not(:last-child) {
      margin-bottom: 10px;
    }
  }

  ;

  #batch_import_hint_content {
    color: $color-font-normal;
    ol {
      margin-left: 20px;
      list-style-type: decimal;
      li {
        &:not(:last-child) {
          margin-bottom: 15px;
        }
      }
    }

  }

  .clickable-link {
    color: $color-primary;
    text-decoration: underline;
    @include click-button();
  }

</style>
