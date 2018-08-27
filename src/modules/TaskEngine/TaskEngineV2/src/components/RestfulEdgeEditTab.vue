<template lang="html">
<div id="restful-edge-edit-page">
  <div class="block">
    <div class="label label-bold">
      {{$t("task_engine_v2.restful_edge_edit_tab.success")}}
    </div>
    <div class="row">
      <div class="label label-margin-left">
        {{$t("task_engine_v2.restful_edge_edit_tab.label_then_goto")}}
      </div>
      <dropdown-select
        class="select select-goto"
        ref="selectSucceedThenGoto"
        :value="[restfulSucceedThenGoto]"
        @input="restfulSucceedThenGoto=$event[0]"
        :options="toNodeOptions"
        :showCheckedIcon="false"
        :showSearchBar="true"
        width="200px"
        :inputBarStyle="selectStyle"
      />
    </div>
  </div>
  <div class="block">
    <div class="label label-bold">
      {{$t("task_engine_v2.restful_edge_edit_tab.fail")}}
    </div>
    <div class="row">
      <div class="label label-margin-left">
        {{$t("task_engine_v2.restful_edge_edit_tab.label_then_goto")}}
      </div>
      <dropdown-select
        class="select select-goto"
        ref="selectSucceedThenGoto"
        :value="[restfulFailedThenGoto]"
        @input="restfulFailedThenGoto=$event[0]"
        :options="toNodeOptions"
        :showCheckedIcon="false"
        :showSearchBar="true"
        width="200px"
        :inputBarStyle="selectStyle"
      />
    </div>
  </div>
</div>
</template>

<script>
import DropdownSelect from '@/components/DropdownSelect';

export default {
  name: 'restful-edge-edit-page',
  components: {
    'dropdown-select': DropdownSelect,
  },
  props: {
    nodeId: {
      type: String,
      required: true,
    },
    initialRestfulEdgeTab: {
      type: Object,
      required: true,
    },
    initialToNodeOptions: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      restfulFailedThenGoto: '',
      restfulSucceedThenGoto: '',
      toNodeOptions: [],
      selectStyle: {
        height: '36px',
        'border-radius': '5px',
        background: 'white',
      },
    };
  },
  computed: {
    restfulEdgeTab() {
      const result = {
        restfulSucceedThenGoto: this.restfulSucceedThenGoto,
        restfulFailedThenGoto: this.restfulFailedThenGoto,
      };
      console.log(result);
      return result;
    },
  },
  watch: {
    restfulEdgeTab: {
      handler() {
        this.$emit('update', this.restfulEdgeTab);
        // console.log(this.restfulEdgeTab);
      },
      deep: true,
    },
  },
  methods: {
    renderTabContent() {
      // render restfulSucceedThenGoto, restfulFailedThenGoto
      const restfulEdgeTab = JSON.parse(JSON.stringify(this.initialRestfulEdgeTab));
      this.restfulSucceedThenGoto = restfulEdgeTab.restfulSucceedThenGoto;
      this.restfulFailedThenGoto = restfulEdgeTab.restfulFailedThenGoto;

      // render toNodeOptions
      let options = JSON.parse(JSON.stringify(this.initialToNodeOptions));
      options = options.filter(option => option.value !== this.nodeId);
      this.toNodeOptions = [{ text: 'Exit (ID: 0)', value: '0' }].concat(options);
    },
  },
  beforeMount() {
    this.renderTabContent();
  },
  mounted() {
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';

#restful-edge-edit-page{
  display: flex;
  flex-direction: column;
  padding: 10px 30px 0px 20px;
  .block{
    background: #F3F7F9;
    padding: 16px 20px 16px 20px;
    border: 1px solid $color-borderline;
    border-radius: 5px;
    margin: 0px 0px 20px 0px;
  }
  .row{
    display: flex;
    flex-direction: row;
    align-items: center;
    .select-goto{
      margin-left: 20px;
    }
  }
  .label{
    height: 36px;
    line-height: 36px;
    font-size: 16px;
  }
  .label-bold{
    font-size: 18px;
    font-weight: 600;
  }
  .label-margin-left{
    margin-left: 10px;
  }
}
</style>
