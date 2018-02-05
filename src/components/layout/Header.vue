<template>
<div id="page-header">
  <div class="spliter"></div>
  <div v-if="enterpriseList && enterpriseList.length > 0" style="width: 200px;">
    <label-select
      :options="enterpriseList"
      :value="enterpriseID" valueKey="enterpriseID" color="white"
      @change="setEnterprise">
      <div class="enterpriseIcon"></div>  
    </label-select>
  </div>
  <div class="spliter"></div>
  <div v-if="robotList && robotList.length > 0" style="width: 200px;">
    <label-select
      :options="robotList"
      :value="robotID" valueKey="appid" color="white"
      @change="setRobot">
      <div class="robotIcon"></div>
    </label-select>
  </div>
  <div class="spliter"></div>
</div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import LabelSelect from '@/components/basic/LabelSelect';

export default {
  data: () => ({
    selectedIdx: 0,
  }),
  computed: mapGetters([
    'robotName',
    'robotID',
    'enterpriseName',
    'enterpriseID',
    'robotList',
    'enterpriseList',
  ]),
  methods: {
    ...mapMutations([
      'setRobot',
      'setEnterprise',
    ]),
  },
  components: {
    LabelSelect,
  },
};
</script>