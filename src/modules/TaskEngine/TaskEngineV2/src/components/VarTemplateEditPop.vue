<template lang="html">
<div id="var-template-edit-pop">
  <div class="instruction block">
    {{$t("task_engine_v2.var_template_edit_pop.instruction")}}
  </div>
  <div class="block-list-container">
    <draggable v-model="varTemplates" :options="{ghostClass:'ghost'}" @start="drag=true" @end="drag=false">
      <template v-for="(template, index) in varTemplates">
        <div class="block block-template" :key="template.id">
          <div class="button-delete-template">
            <icon icon-type="delete" :enableHover="true" :size=24 @click="deleteTemplate(index)"/>
          </div>
          <div class="row">
            <div class="label">
              {{$t("task_engine_v2.var_template_edit_pop.label_key")}}
            </div>
            <div class="input-template-container" v-dropdown="insertVarDropdown(index)">
              <input class="input-key" v-model="template.key"></input>
            </div>
          </div>
          <div class="row">
            <div class="label">
              {{$t("task_engine_v2.var_template_edit_pop.label_template")}}
            </div>
            <input class="input-template" v-model="template.msg"></input>
          </div>
        </div>
      </template>
    </draggable>
    <button
      class="button-add-template"
      @click="addTemplate()">
      {{$t("task_engine_v2.var_template_edit_pop.button_add_template")}}
    </button>
  </div>
</div>
</template>

<script>
import draggable from 'vuedraggable';
import scenarioInitializer from '../_utils/scenarioInitializer';

export default {
  name: 'scenario-edit-page',
  components: {
    draggable,
  },
  props: {
    extData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      varTemplates: [],
      globalVarOptions: [],
    };
  },
  computed: {},
  watch: {},
  methods: {
    renderData() {
      // render globalEdges
      const templates = JSON.parse(JSON.stringify(this.extData.varTemplates));
      this.varTemplates = templates.map((template) => {
        template.id = this.$uuid.v1();
        return template;
      });

      // render globalVarOptions
      const globalVarOptionsMap = JSON.parse(JSON.stringify(this.extData.globalVarOptionsMap));
      Object.values(globalVarOptionsMap).forEach((globalVarOption) => {
        this.globalVarOptions.push(...globalVarOption);
      });
    },
    addTemplate() {
      const template = scenarioInitializer.initialVarTemplate();
      template.id = this.$uuid.v1();
      this.varTemplates.push(template);
    },
    deleteTemplate(index) {
      this.varTemplates.splice(index, 1);
    },
    insertVarDropdown(index) {
      const options = this.globalVarOptions.map(option => ({
        text: `${option.text}：${option.value}`,
        onclick: this.insertVarSelect.bind(this, index, option.value),
      }));
      return {
        options,
        width: '450px',
      };
    },
    insertVarSelect(index, key) {
      const toInsert = `$global{${key}}`;
      this.varTemplates[index].key = key;
      this.varTemplates[index].msg = toInsert;
    },
    validate() {
      const varTemplates = this.varTemplates.map(varTemplate => ({
        key: varTemplate.key,
        msg: varTemplate.msg,
        type: varTemplate.type,
      }));
      this.$emit(
        'validateSuccess',
        varTemplates,
      );
    },
  },
  beforeMount() {
    this.renderData();
  },
  mounted() {
    this.$on('validate', this.validate);
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';

#var-template-edit-pop{
  width: 600px;
  height: 70vh;
  display: flex;
  flex-direction: column;
  padding: 25px 25px 0px 25px;
  .block{
    position: relative;
    background: #F3F7F9;
    padding: 20px 20px 20px 20px;
    border: 1px solid $color-borderline;
    border-radius: 5px;
    &:not(:last-child){
      margin: 0px 0px 20px 0px;
    }
  }
  .block-template{
    cursor: move;
  }
  .instruction{
    height: 60px;
    flex: 0 0 60px;
    line-height: 20px;
    color: $color-font-normal;
    font-size: 14px;
  }
  .block-list-container{
    display: flex;
    flex-direction: column;
    @include auto-overflow();
    @include customScrollbar();
    .button-delete-template{
      position: absolute;
      top: 10px;
      right: 10px;
    }
    .row{
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 36px;
      &:not(:last-child){
        margin: 0px 0px 10px 0px;
      }
      .label{
        height: 36px;
        line-height: 36px;
        font-size: 16px;
        width: 84px;
      }
      input{
        height: 36px;
        width: 400px;
      }
      .input-template-container{
        position: relative;
      }
    }
  }
  .button-add-template{
    height: 40px;
    flex: 0 0 40px;
    background: #46BE8A;
    border-radius: 5px;
    color: white;
    font-size: 18px;
    font-weight: 600;
    margin: 20px 0px 10px 0px;
    cursor: pointer;
    &:hover{
      transition: background-color 0.5s ease;
      background: lighten(#46BE8A, 10%);
    }
  }
}
</style>
