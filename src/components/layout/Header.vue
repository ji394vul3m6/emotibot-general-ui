<template>
<div id="page-header">
  <div class="spliter"></div>
  <div v-if="enterpriseList && enterpriseList.length > 1" style="width: 200px;">
    <label-select
      :options="enterpriseList"
      :value="enterpriseID" valueKey="enterpriseID" color="white"
      @change="setEnterprise">
      <div class="enterpriseIcon"></div>  
    </label-select>
  </div>
  <div class="spliter"></div>
  <div v-if="robotList && robotList.length > 1" style="width: 200px;">
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
// import robotPNG from '@/assets/images/robot.svg';

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

<style lang="scss" scoped>
.robotIcon {
  background: url("../../assets/images/robot.svg") no-repeat center center;
  background-size: 20px 20px;
  width: 100%;
  height: 100%;
}
.enterpriseIcon {
  background: url("../../assets/images/enterprise.png") no-repeat center center;
  background-size: 40px 40px;
  width: 100%;
  height: 100%;
}
</style>
