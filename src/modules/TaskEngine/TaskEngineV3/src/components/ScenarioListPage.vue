<template lang="html">
<div id="scenario-list-page" class="scenario-list-page page">
  <div class="header-row">
    <button class="btn-basic btn-border" @click="createNewScenario">{{$t("task_engine_v3.scenario_list_page.button_create_new_scenario")}}</button>
    <button class="btn-basic btn-border" @click="createFromSpreadSheet">SpreadSheet</button>
    <input type="file" ref="uploadInput" v-on:change="changeFile()" accept=".xlsx">
    <input class="search_input border_bottom" type="text" name="key_word" 
      :placeholder="$t('task_engine_v3.scenario_list_page.placeholder_search')"
    >
  </div>
  <div class="table">
    <div class="table-row table-row-title">
      {{$t("task_engine_v3.scenario_list_page.scenario_list")}}
    </div>
    <template v-for="(scenario, index) in scenarioList">
      <div class="table-row table-row-content clickable">
        <div class="name-label" @click="editScenario(scenario.scenarioID)">{{scenario.scenarioName}}</div>
        <button class="delete-button"
          @click="deleteScenario(scenario)">
          {{$t("general.delete")}}
        </button>
        <toggle-button class="toggle-button"
          v-model="scenario.enable"
          :labels="true"
          :width="60"
          :height="30"
          :color="{checked: '#337ab7', unchecked: '#CCCCCC'}"
          @change="switchScenario(scenario)"
        />
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
  components: {
  },
  data() {
    return {
      i18n: {},
      appId: '',
      scenarioList: [],
    };
  },
  computed: {},
  watch: {},
  methods: {
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
        title: '',
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
@import "../scss/teVariable.scss";
.scenario-list-page{
  flex: 1 1 0;
  // display: flex;
  // flex-direction: column;
  .btn-basic{
    font-size: 20px;
  }

  .clickable{
    cursor: pointer; 
  }
  .header-row{
    display:flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 20px;
    button{
      width: 150px;
    }
    .search_input{
      width: 200px;
      height: 40px;
      font-size: 20px;
    }
    .border_bottom{
      border: 0;
      outline: 0;
      border-bottom: 1px solid black;
    }
    input[type=file] {
      visibility: hidden;
    }
  }
  .table{
    display:flex;
    flex-direction: column;
    margin-top: 20px;
    .table-row{
      display:flex;
      flex-direction: row;
      align-items:center;
      padding: 10px;
      border: 1px solid #e4eaec;
      height: 50px;
      line-height: 50px;
      font-size: 20px;
      &.table-row-title{
        background-color:#e4eaec;
      }
      &.table-row-content{
        &:hover{
          background: rgba(118,131,143,.1);
        }
      }
      .name-label{
        flex: 1 1 auto;
      }
      .delete-button{
        flex: 0 0 auto;
        font-size: 16px;
        width: 60px;
        height: 30px;
        cursor: pointer; 
        &:hover{
          background: rgba(118,131,143,.1);
        }
      }
      .toggle-button{
        flex: 0 0 auto;
        font-size: 16px;
        margin-left: 10px;
      }
    }
  }
}
</style>
