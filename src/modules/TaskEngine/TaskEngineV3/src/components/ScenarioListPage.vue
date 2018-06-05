<template lang="html">
<div id="scenario-list-page" class="scenario-list-page page">
  <div class="header-row">
    <button class="btn-basic btn-border" @click="createNewScenario">{{$t("task_engine_v3.scenario_list_page.button_create_new_scenario")}}</button>
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
import ConfirmPop from './ConfirmPop';
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
      const options = {
        component: CreateScenarioPop,
        buttons: ['ok', 'cancel'],
        validate: true,
        data: {
          scenarioName: '',
        },
        ok_msg: this.$t('general.add'),
        cancel_msg: this.$t('general.cancel'),
        callback: {
          ok: (scenarioName) => {
            taskEngineApi.createScenario(this.appId, scenarioName).then((data) => {
              if ('template' in data && 'metadata' in data.template) {
                const metadata = data.template.metadata;
                const scenarioId = metadata.scenario_id;
                this.updateInitialScenario(metadata).then(() => {
                  const path = general.composePath(`scenario/${scenarioId}`);
                  this.$router.replace(path);
                });
              } else {
                general.popErrorWindow(this, this.i18n.error_msg.create_new_scenario_failed, '');
              }
            }, (err) => {
              general.popErrorWindow(this, 'createScenario error', err.message);
            });
          },
        },
        customPopContentStyle: {
          width: '40%',
          height: '30%',
          'min-width': '500px',
          'min-height': '275px',
        },
      };
      this.$root.$emit('showWindow', options);
    },
    updateInitialScenario(metadata) {
      const scenario = scenarioConvertor.initialScenario(metadata);
      const editingContent = scenario.editingContent;
      const editingLayout = scenario.editingLayout;
      return taskEngineApi.saveScenario(
        this.appId,
        metadata.scenario_id,
        JSON.stringify(editingContent),
        JSON.stringify(editingLayout),
      ).then(() => {
        console.log('场景已更新');
      }, (err) => {
        general.popErrorWindow(this, 'saveScenario error', err.message);
      });
    },
    editScenario(scenarioId) {
      const path = general.composePath(`scenario/${scenarioId}`);
      this.$router.replace(path);
    },
    deleteScenario(scenario) {
      const options = {
        component: ConfirmPop,
        buttons: ['ok', 'cancel'],
        validate: false,
        data: {
          msg: this.i18n.scenario_list_page.ask_delete_confirm,
          info: scenario.scenarioName,
        },
        ok_msg: this.$t('general.delete'),
        cancel_msg: this.$t('general.cancel'),
        callback: {
          ok: () => {
            taskEngineApi.deleteScenario(scenario.scenarioID).then((data) => {
              if ('msg' in data && data.msg === 'Update success') {
                this.listAllScenarios();
              } else {
                general.popErrorWindow(this, 'deleteScenario error', 'failed to delete scenario.');
              }
            });
          },
        },
        customPopContentStyle: {
          width: '30%',
          height: '20%',
          'min-width': '400px',
          'min-height': '200px',
        },
      };
      this.$root.$emit('showWindow', options);
    },
    switchScenario(scenario) {
      taskEngineApi.switchScenario(this.appId, scenario.scenarioID, scenario.enable).then(() => {
      }, (err) => {
        general.popErrorWindow(this, 'switchScenario error', err.message);
      });
    },
  },
  beforeMount() {},
  mounted() {
    this.i18n = i18nUtils.getLocaleMsgs(this.$i18n);
    this.appId = general.getAppId();
    this.listAllScenarios();
  },
};
</script>

<style lang="scss">
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
