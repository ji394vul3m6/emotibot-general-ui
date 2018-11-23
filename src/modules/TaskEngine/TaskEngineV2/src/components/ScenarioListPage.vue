<template lang="html">
<div id="scenario-list-page-v2">
  <input type="file" ref="uploadScenarioJSONInput" style="visibility: hidden; display: none;" @change="changeScenarioJSONFile()" accept=".json">
  <div class="content card h-fill w-fill no-scenario" v-if="filteredScenarioList.length === 0">
    <div class="center-msg">
      <div class="title">{{ $t('task_engine_v2.scenario_list_page.start_scenario') }}</div>
      <div class="model-help" v-if="false">
        <div class="help-video">
          <icon :size=14 icon-type="te_help_video"></icon>
          {{ $t('task_engine_v2.scenario_list_page.help_video') }}
        </div>
        <div class="upload-data">
          <icon :size=14 icon-type="scenario_upload"></icon>
          {{ $t('task_engine_v2.scenario_list_page.upload_transfor_data') }}
        </div>
      </div>
      <div class="start-scenario">
        <text-button button-type='primary' width='140px' height='46px' @click="createNewScenario">
          {{$t("task_engine_v2.scenario_list_page.button_create_new_scenario")}}
        </text-button>
        <text-button button-type='default' :iconSize=15 width='140px' height='46px' @click="importScenarioJSON">
          {{$t("task_engine_v2.scenario_list_page.button_import_scenario")}}
        </text-button>
      </div>
    </div>
  </div>
  <div class="content card h-fill w-fill" v-else>
    <div class="row title">
      {{$t("task_engine_v2.scenario_list_page.scenario_list")}}
      <search-input v-model="filteredKeyWord" ></search-input>
    </div>
    <div class="page">
      <div class="row">
        <div id="toolbar">
          <div id="left-buttons">
            <text-button button-type='primary' width='100px' height='32px' @click="createNewScenario">
              {{$t("task_engine_v2.scenario_list_page.button_create_new_scenario")}}
            </text-button>
            <text-button button-type='default' :iconSize=15 width='100px' height='32px' @click="importScenarioJSON">
              {{$t("task_engine_v2.scenario_list_page.button_import_scenario")}}
            </text-button>
            <text-button button-type='default' width='120px' height='32px' @click="exportAllScenarios">
              {{$t("task_engine_v2.scenario_list_page.button_export_all_scenarios")}}
            </text-button>
          </div>
          <div class="model-help top" v-if="true">
            <div class="help-video">
              <icon :size=14 icon-type="te_help_video"></icon>
              {{ $t('task_engine_v2.scenario_list_page.help_video') }}
            </div>
            <div class="upload-data">
              <icon :size=14 icon-type="scenario_upload"></icon>
              {{ $t('task_engine_v2.scenario_list_page.upload_transfor_data') }}
            </div>
          </div>
        </div>
      </div>
      <div class="scenario-list">
        <div
          v-for="(scenario, index) in filteredScenarioList" 
          :key="scenario.scenarioID"
          class="scenario-grid"
          @mouseover="scenario.show = true" 
          @mouseleave="scenario.show = false"
        >
          <div class="scenario-title">
            <div class="name-label" @click="editScenario(scenario.scenarioID)">
              {{scenario.scenarioName}}
            </div>
            <toggle v-model="scenario.enable" @change="switchScenario(scenario)" :big="false"></toggle>
          </div>
          <div class="scenario-content" v-if="scenario.show  === true">
            <text-button button-type='default' iconType="edit_thin" width='72px' height='28px' @click="editScenario(scenario.scenarioID)">
              {{$t("task_engine_v2.scenario_list_page.edit")}}
            </text-button>
            <text-button button-type='default' iconType="export" width='72px' height='28px' @click="exportScenario(scenario.scenarioID)">
              {{$t("general.export")}}
            </text-button>
            <text-button button-type='default' iconType="trash_can" width='72px' height='28px' @click="deleteScenario(scenario)">
              {{$t("general.delete")}}
            </text-button>
          </div>
        </div>
      </div>
    </div>
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
  name: 'scenario-list-page-v2',
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
      return this.scenarioList
        .filter(scenario => scenario.scenarioName.indexOf(this.filteredKeyWord) !== -1)
        .sort((a, b) => a.scenarioName.localeCompare(b.scenarioName));
    },
  },
  watch: {},
  methods: {
    exportScenario(scenarioID) {
      taskEngineApi.exportScenario(scenarioID);
    },
    publishScenario(scenario) {
      const that = this;
      taskEngineApi.publishScenario(that.appId, scenario.scenarioID).then(() => {
        // that.$notify({ text: that.$t('task_engine_v2.scenario_list_page.publish_succeed') });
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
        title: that.$t('task_engine_v3.create_scenario_pop.create_scenario'),
        component: CreateScenarioPop,
        validate: true,
        ok_msg: that.$t('task_engine_v3.create_scenario_pop.comfire_create'),
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
      if (scenario.enable) {
        this.publishScenario(scenario);
      }
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
#scenario-list-page-v2{
  height: 100%;
  padding: 0 20px;
  .content {
    display: flex;
    flex-direction: column;
    &.no-scenario {
      justify-content: center;
      background: {
        image: url('../../../../../assets/images/scenario_bg.svg');
        position: center right;
        repeat: no-repeat;
        size: 665px 501px;
      }
    }
    .page{
      flex: 1;
      @include auto-overflow();
      @include customScrollbar();
    }
    .row {
      flex: 0 0 auto;
      padding: 0px 20px 0px 20px;
      &.title {
        @include font-16px();
        font-size: 18px;
        color: $color-font-active;
        flex: 0 0 60px;
        // border-bottom: 1px solid $color-borderline;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      &:not(.title) {
        // margin-top: 20px;
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
        // margin-right: 20px;
        #left-buttons{
          display: flex;
          align-items: center;
        }
      }
    }
    .scenario-list{
      flex: 1;
      padding: 20px;
      padding-bottom: 0px;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-content: flex-start;
      .scenario-grid {
        display: flex;
        flex-direction: column;
        flex: 0 0 360px;
        max-width: 360px;
        height: 112px;
        border-radius: 4px;
        border: 1px solid $color-borderline;
        margin-right: 30px;
        margin-bottom: 20px;
        padding: 20px;
        transition: all .2s ease-in-out;
        
        &:hover {
          box-shadow: 0 4px 9px 0 rgba(115, 115, 115, 0.2), 0 5px 8px 0 rgba(228, 228, 228, 0.5);
          .card-title {
            .card-title-edit {
              visibility: visible;
            }
          }
        }

        .scenario-title {
          flex: 1 1 auto;
          display: flex;
          justify-content: space-between;
          .name-label {
            max-width: 270px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-size: 16px;
            @include click-button();
          }
        }
        .scenario-content {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          .text-button{
            margin-right: 10px;
          }
        }
      }
    }
  }
}
$marginLeft: 80px;
$textWidth: 378px;
$titleFontSize: 38px;
$helpFontSize: 16px;
$btnMarginTop: 43px;
.center-msg {
  margin-left: $marginLeft;
  width: $textWidth;
  
  .title {
    color: $color-font-active;
    width: $textWidth;
    font-size: $titleFontSize;
  }
  .start-scenario {
    margin-top: $btnMarginTop;
    & > * {
      margin-right: 20px;
    }
  }
}
.model-help {
  display: flex;
  width: 100%;
  color: $color-primary;
  font-size: $helpFontSize;
  margin-top: 20px;
  line-height: 24px;

  .upload-data {
    padding-left: 32px;
  }

  &.top {
    width: auto;
    margin: 0;
    font-size: 14px;
  }
}
</style>
