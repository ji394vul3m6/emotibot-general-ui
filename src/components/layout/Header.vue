<template>
<div id="page-header">
  <!-- <div class="spliter"></div>
  <div v-if="enterpriseList && enterpriseList.length > 0">
    <label-select
      :options="enterpriseList"
      :value="enterpriseID" valueKey="enterpriseID" color="white"
      @change="setEnterprise">
      <div class="enterprise_icon header"></div>  
    </label-select>
  </div>
  <div class="spliter"></div>
  <div v-if="robotList && robotList.length > 0">
    <label-select
      :options="robotList"
      :value="robotID" valueKey="appid" color="white"
      @change="setRobot">
      <div class="white_robot_icon header"></div>
    </label-select>
  </div>
  <div class="spliter"></div> -->
  <div class="logout" @click="logout">
    <icon icon-type="white_logout"/>
  </div>
</div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import LabelSelect from '@/components/basic/LabelSelect';
import Icon from '@/components/basic/Icon';

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
    logout() {
      this.$logout();
    },
  },
  components: {
    LabelSelect,
    icon: Icon,
  },
};
</script>

<style lang="scss" scoped>
@import "styles/variable";

#page-header {
  position: absolute;
  left: $page-menu-width;
  top: 0;
  width: calc(100vw - #{$page-menu-width});
  height: $page-header-height;
  background: $page-header-color;
  box-shadow: inset -1px 0 0 0 #222222;
  color: white;
  font-weight: bold;
  display: flex;
  justify-content: flex-end;

  & > div:not(.spliter) {
    display: flex;
    align-items: center;
    vertical-align: middle;
    padding: 0 10px;
  }

  & > .spliter {
    height: $page-header-height;
    border-left: 1px solid black;
  }
  .logout {
    width: $page-header-height;
    justify-content: center;
    cursor: pointer;
  }
}
</style>
