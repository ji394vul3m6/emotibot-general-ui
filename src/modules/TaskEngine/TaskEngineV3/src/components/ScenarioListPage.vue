<template lang="html">
<div id="scenario-list-page">
  <div class="content card h-fill w-fill">
    <div class="row title">
      {{$t("task_engine_v3.scenario_list_page.scenario_list")}}
    </div>
    <div class="row">
      <div id="toolbar">
        <div id="left-buttons">
          <text-button button-type='primary' width='100px' height='28px' @click="createNewScenario">
            {{$t("task_engine_v3.scenario_list_page.button_create_new_scenario")}}
          </text-button>
          <text-button button-type='primary' width='100px' height='28px' @click="createFromSpreadSheet">
            SpreadSheet
          </text-button>
          <input type="file" ref="uploadInput" v-on:change="changeFile()" accept=".xlsx">
        </div>
        <div id="right-buttons">
          <search-input v-model="searchKeyWord"></search-input>
        </div>
      </div>
    </div>
    <template v-for="(scenario, index) in scenarioList">
      <div class="row" @mouseover="moreIcon = true" @mouseleave="moreIcon = false">
        <div id="scenario-grid">
          <div id="scenario-toggle-container">
            <toggle v-model="scenario.enable" @change="switchScenario(scenario)" :big="false"></toggle>
          </div>
          <div id="scenario-content-container">
            <div class="name-label"  @click="editScenario(scenario.scenarioID)">
              {{scenario.scenarioName}}
            </div>
            <div class="delete-button">
              <div class="icon_container" v-show="moreIcon" v-dropdown="moreOptions(scenario)">
                <icon :size=25 icon-type="more"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</div>
</template>

<script>
import i18nUtils from '../utils/i18nUtil';
import scenarioConvertor from '../utils/scenarioConvertor';
import general from '../utils/general';
import CreateScenarioPop from './CreateScenarioPop';
import taskEngineApi from './_api/taskEngine';

export default {
  name: 'scenario-list-page',
  components: {},
  data() {
    return {
      i18n: {},
      appId: '',
      scenarioList: [],
      searchKeyWord: '',
      moreIcon: false,
    };
  },
  computed: {},
  watch: {},
  methods: {
    moreOptions(scenario) {
      const that = this;
      return {
        options: [{
          text: this.i18n.general.delete,
          onclick() {
            that.deleteScenario(scenario);
          },
        }],
        alignLeft: true,
      };
    },
    listAllScenarios() {
      taskEngineApi.listScenarios(this.appId).then((data) => {
        if (typeof (data) === 'object' && 'msg' in data) {
          this.scenarioList = data.msg.filter(scenario => scenario.version === '2.0');
        } else {
          general.popErrorWindow(this, 'listAllScenarios error',
            `unexpected return value from listScenarios API: ${data}`);
        }
      }, (err) => {
        general.popErrorWindow(this, 'listAllScenarios error', err.message);
      });
    },
    createNewScenario() {
      const that = this;
      that.$pop({
        title: this.i18n.task_engine_v3.create_scenario_pop.label_create_new_scenario,
        component: CreateScenarioPop,
        validate: true,
        ok_msg: that.$t('general.add'),
        data: {
          scenarioName: '',
        },
        callback: {
          ok: (scenarioName) => {
            taskEngineApi.createScenario(that.appId, scenarioName).then((data) => {
              if ('template' in data && 'metadata' in data.template) {
                const metadata = data.template.metadata;
                const scenarioId = metadata.scenario_id;
                const scenario = scenarioConvertor.initialScenario(metadata);
                that.saveScenario(scenarioId, scenario).then(() => {
                  const path = general.composePath(`scenario/${scenarioId}`);
                  that.$router.replace(path);
                });
              } else {
                general.popErrorWindow(that, that.i18n.task_engine_v3.error_msg.create_new_scenario_failed, '');
              }
            }, (err) => {
              general.popErrorWindow(that, 'createScenario error', err.message);
            });
          },
        },
      });
    },
    saveScenario(scenarioId, scenario) {
      return taskEngineApi.saveScenario(
        this.appId,
        scenarioId,
        JSON.stringify(scenario.editingContent),
        JSON.stringify(scenario.editingLayout),
      ).then(() => {
        this.$notify({ text: this.$t('error_msg.save_success') });
      }, (err) => {
        this.$notifyFail(`${this.$t('error_msg.save_fail')}:${err.message}`);
      });
    },
    editScenario(scenarioId) {
      const path = general.composePath(`scenario/${scenarioId}`);
      this.$router.replace(path);
    },
    deleteScenario(scenario) {
      const that = this;
      that.$popCheck({
        data: {
          msg: that.$t(
            'task_engine_v3.scenario_list_page.ask_delete_confirm',
            { scenario: scenario.scenarioName },
          ),
        },
        callback: {
          ok() {
            taskEngineApi.deleteScenario(scenario.scenarioID).then((data) => {
              if ('msg' in data && data.msg === 'Update success') {
                that.listAllScenarios();
              } else {
                general.popErrorWindow(that, 'deleteScenario error', 'failed to delete scenario.');
              }
            });
          },
        },
      });
    },
    switchScenario(scenario) {
      taskEngineApi.switchScenario(this.appId, scenario.scenarioID, scenario.enable).then(() => {
      }, (err) => {
        general.popErrorWindow(this, 'switchScenario error', err.message);
      });
    },
    createFromSpreadSheet() {
      this.$refs.uploadInput.click();
    },
    changeFile() {
      const files = this.$refs.uploadInput.files;
      const file = files[0] || undefined;
      const fileName = file.name;
      const scenarioName = fileName.substring(0, fileName.lastIndexOf('.xlsx'));
      const that = this;
      if (file.size <= 0 || file.size > 2 * 1024 * 1024) {
        // maximum size: 2MB
        that.$notifyFail(that.$t('error_msg.upload_file_size_error'));
      } else {
        taskEngineApi.createScenario(this.appId, scenarioName).then((data) => {
          if ('template' in data && 'metadata' in data.template) {
            const metadata = data.template.metadata;
            const scenarioId = metadata.scenario_id;
            const initialScenario = scenarioConvertor.initialScenario(metadata);
            that.uploadSpreadSheet(this.appId, scenarioId, initialScenario, file).then(() => {
              const path = general.composePath(`scenario/${scenarioId}`);
              this.$router.replace(path);
            });
          } else {
            general.popErrorWindow(this, this.i18n.task_engine_v3.error_msg.create_new_scenario_failed, '');
          }
        }, (err) => {
          general.popErrorWindow(this, 'createScenario error', err.message);
        });
      }
    },
    uploadSpreadSheet(appId, scenarioId, scenario, file) {
      const that = this;
      return taskEngineApi.uploadSpreadsheet(
        appId,
        scenarioId,
        JSON.stringify(scenario),
        file,
      ).then((resp) => {
        if (resp.return === 0) {
          that.$notify({ text: that.$t('error_msg.success') });
          that.$refs.uploadInput.value = '';
        } else {
          that.$notifyFail(`${that.$t('error_msg.save_fail')}:${resp.error}`);
        }
      }, (err) => {
        that.$refs.uploadInput.value = '';
        that.$notifyFail(`${that.$t('error_msg.save_fail')}:${err.message}`);
      });
    },
  },
  beforeMount() {},
  mounted() {
    this.i18n = i18nUtils.getLocaleMsgs(this.$i18n);
    this.appId = this.$cookie.get('appid');
    this.listAllScenarios();
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';
$row-height: $default-line-height;
@import "../scss/teVariable.scss";

#scenario-list-page{
  height: 100%;
  .content {
    display: flex;
    flex-direction: column;
    .row {
      flex: 0 0 auto;
      padding-left: 20px;

      &.title {
        @include font-16px();
        color: $color-font-active;
        flex: 0 0 60px;
        border-bottom: 1px solid $color-borderline;
        display: flex;
        align-items: center;
      }
      &:not(.title) {
        margin-top: 20px;
      }

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

      #toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-right: 20px;
      }

      #scenario-grid {
        display: flex;
        margin-right: 20px;
        height: 82px;
        border-radius: 4px;
        border: solid 1px $color-borderline;
        color: $color-font-active;

        &:hover {
          box-shadow: 0 4px 9px 0 rgba(115, 115, 115, 0.2), 0 5px 8px 0 rgba(228, 228, 228, 0.5);
        }

        #scenario-toggle-container {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 68px;
          border-right: solid 1px $color-borderline;
        }
        #scenario-content-container {
          flex: 1 1 auto;
          display: flex;
          align-items: center;
          @include font-14px();
          .name-label {
            display: flex;
            align-items: center;
            flex: 1 1 auto;
            height: 100%;
            padding-left: 20px;
            cursor: pointer;
          }
          .delete-button {
            flex: 0 0 68px;
            .icon_container{
              position: relative;
              width: 25px;
              height: 25px;
              border-radius: 25px;
              cursor: pointer;
              &:hover{
                background-color: #f7f7f7;
              }
            }
          }
        }
      }
    }
  }
}
</style>
