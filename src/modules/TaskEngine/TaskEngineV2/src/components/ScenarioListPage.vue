<template lang="html">
<div id="scenario-list-page">
  <div class="content card h-fill w-fill">
    <div class="row title">
      {{$t("task_engine_v2.scenario_list_page.scenario_list")}}
    </div>
    <div class="row">
      <div id="toolbar">
        <div id="left-buttons">
          <text-button button-type='primary' width='68px' height='28px' @click="createNewScenario">
            {{$t("task_engine_v2.scenario_list_page.button_create_new_scenario")}}
          </text-button>
          <text-button button-type='default' iconType="upload" :iconSize=15 width='68px' height='28px' @click="importScenarioJSON">
            {{$t("task_engine_v2.scenario_list_page.button_import_scenario")}}
          </text-button>
          <text-button button-type='default' width='100px' height='28px' @click="exportAllScenarios">
            {{$t("task_engine_v2.scenario_list_page.button_export_all_scenarios")}}
          </text-button>
          <input type="file" ref="uploadScenarioJSONInput" @change="changeScenarioJSONFile()" accept=".json">
        </div>
        <div id="right-buttons">
          <search-input v-model="filteredKeyWord" ></search-input>
        </div>
      </div>
    </div>
    <template v-for="(scenario, index) in filteredScenarioList">
      <div class="row" @mouseover="scenario.show = true" @mouseleave="scenario.show = false">
        <div id="scenario-grid">
          <div id="scenario-toggle-container">
            <toggle v-model="scenario.enable" @change="switchScenario(scenario)" :big="false"></toggle>
          </div>
          <div id="scenario-content-container">
            <div class="name-label"  @click="editScenario(scenario.scenarioID)">
              {{scenario.scenarioName}}
            </div>
            <div class="delete-button">
              <div class="icon_container" v-show="scenario.show" v-dropdown="moreOptions(scenario)">
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
import taskEngineApi from '@/modules/TaskEngine/_api/taskEngine';
import general from '@/modules/TaskEngine/_utils/general';
import CreateScenarioPop from './CreateScenarioPop';
import scenarioInitializer from '../_utils/scenarioInitializer';
import scenarioConvertor from '../_utils/scenarioConvertor';

export default {
  name: 'scenario-list-page',
  components: {},
  data() {
    return {
      appId: '',
      scenarioList: [],
      filteredKeyWord: '',
    };
  },
  computed: {
    filteredScenarioList() {
      return this.scenarioList.filter(
        scenario => scenario.scenarioName.indexOf(this.filteredKeyWord) !== -1);
    },
  },
  watch: {},
  methods: {
    moreOptions(scenario) {
      const that = this;
      return {
        options: [{
          text: that.$t('task_engine_v2.scenario_list_page.publish'),
          onclick() {
            taskEngineApi.publishScenario(that.appId, scenario.scenarioID).then(() => {
              that.$notify({ text: that.$t('task_engine_v2.scenario_list_page.publish_succeed') });
            }, (err) => {
              that.$notifyFail(`${that.$t('task_engine_v2.scenario_list_page.publish_failed')}:${err.message}`);
            });
            taskEngineApi.loadScenario(scenario.scenarioID).then((data) => {
              const jsonData = {
                moduleData: JSON.parse(data.result.editingContent),
                moduleDataLayouts: JSON.parse(data.result.editingLayout),
              };
              const newJsonData = scenarioConvertor.convertJsonToVersion('1.1', jsonData);
              scenarioConvertor.registerNluTdeScenario(
                scenario.scenarioID, newJsonData.moduleData.ui_data.nodes);
            }, (err) => {
              general.popErrorWindow(this, 'loadScenario error', err.message);
            });
            scenario.enable = true;
            that.switchScenario(scenario);
          },
        },
        {
          text: that.$t('general.export'),
          onclick() {
            taskEngineApi.exportScenario(scenario.scenarioID);
          },
        }, {
          text: that.$t('general.delete'),
          onclick() {
            that.deleteScenario(scenario);
          },
        }],
        alignLeft: true,
      };
    },
    exportAllScenarios() {
      taskEngineApi.exportAllScenarios(this.appId);
    },
    listAllScenarios() {
      taskEngineApi.listScenarios(this.appId).then((data) => {
        if (typeof (data) === 'object' && 'msg' in data) {
          this.scenarioList = data.msg.filter(scenario => scenario.version !== '2.0')
                                      .map((scenario) => {
                                        scenario.show = false;
                                        return scenario;
                                      });
        } else {
          this.$notifyFail(`listAllScenarios error: unexpected return value from listScenarios API: ${data}`);
        }
      }, (err) => {
        this.$notifyFail(`listAllScenarios error:${err.message}`);
      });
    },
    createNewScenario() {
      const that = this;
      that.$pop({
        title: that.$t('task_engine_v3.create_scenario_pop.label_create_new_scenario'),
        component: CreateScenarioPop,
        validate: true,
        ok_msg: that.$t('general.add'),
        data: {
          scenarioName: '',
        },
        callback: {
          ok: (obj) => {
            taskEngineApi.createScenarioWithTemplate(that.appId, obj.scenarioName, obj.templateID)
            .then((data) => {
              if ('template' in data && 'metadata' in data.template) {
                const metadata = data.template.metadata;
                const scenarioId = metadata.scenario_id;
                if (obj.templateID === '') {
                  const scenario = scenarioInitializer.initialScenario(metadata);
                  that.saveScenario(scenarioId, scenario).then(() => {
                    const path = general.composeV2Path(`scenario/${scenarioId}`);
                    that.$router.replace(path);
                  });
                } else {
                  const path = general.composeV2Path(`scenario/${scenarioId}`);
                  that.$router.replace(path);
                }
              } else {
                that.$notifyFail(`${that.$t('task_engine_v2.scenario_list_page.create_new_scenario_failed')}`);
              }
            }, (err) => {
              that.$notifyFail(`${that.$t('task_engine_v2.scenario_list_page.create_new_scenario_failed')}:${err.message}`);
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
      const path = general.composeV2Path(`scenario/${scenarioId}`);
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
                that.$notifyFail('deleteScenario error: failed to delete scenario.');
              }
            });
          },
        },
      });
    },
    switchScenario(scenario) {
      taskEngineApi.switchScenario(this.appId, scenario.scenarioID, scenario.enable).then(() => {
      }, (err) => {
        this.$notifyFail(`switchScenario error:${err.message}`);
      });
    },
    importScenarioJSON() {
      this.$refs.uploadScenarioJSONInput.click();
    },
    changeScenarioJSONFile() {
      const files = this.$refs.uploadScenarioJSONInput.files;
      const file = files[0] || undefined;
      const that = this;
      if (file.size <= 0 || file.size > 2 * 1024 * 1024) {
        // maximum size: 2MB
        that.$notifyFail(that.$t('error_msg.upload_file_size_error'));
      } else {
        that.uploadScenarioJSON(this.appId, file).then(() => {
          this.listAllScenarios();
        });
      }
    },
    uploadScenarioJSON(appId, file) {
      const that = this;
      return taskEngineApi.uploadScenarioJSON(
        appId,
        file,
      ).then((resp) => {
        if (resp.return === 0) {
          that.$notify({ text: that.$t('error_msg.success') });
          that.$refs.uploadScenarioJSONInput.value = '';
        } else {
          that.$notifyFail(`${that.$t('error_msg.save_fail')}:${resp.error}`);
        }
      }, (err) => {
        that.$refs.uploadScenarioJSONInput.value = '';
        that.$notifyFail(`${that.$t('error_msg.save_fail')}:${err.message}`);
      });
    },
  },
  beforeMount() {
    this.appId = this.$cookie.get('appid');
  },
  mounted() {
    this.listAllScenarios();
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';
$row-height: $default-line-height;
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
        #left-buttons{
          display: flex;
          align-items: center;
        }
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
