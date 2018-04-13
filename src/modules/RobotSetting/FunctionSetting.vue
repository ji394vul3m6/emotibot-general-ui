<template>
<div id="robot-skill">
  <text-button main v-if="canEdit" v-on:click="setAll(true)" :disabled=allActive>{{ $t("robot_setting.all_active") }}</text-button>
  <text-button main v-if="canEdit" v-on:click="setAll(false)" :disabled=allDeactive>{{ $t("robot_setting.all_deactive") }}</text-button>
  <div class="skill-card-container">
    <div v-for="skill in moduleList" :key="skill.id" class="skill-card" :class="{checked: skill.active}">
      <div class="skill-icon-container">
        <img :src="skill.image" class="skill-icon">
      </div>
      <div class="skill-text">{{ skill.name }}</div>
      <div class="skill-switch" v-if="canEdit">
        <toggle v-model="skill.active" @change="updateSkill(skill)"/>
      </div>
      <div class="skill-switch" v-else style="cursor: default;"></div>
    </div>
  </div>
</div>
</template>

<script>
import api from './_api/robot';

export default {
  path: 'robot-function',
  privCode: 'robot_function',
  displayNameKey: 'robot_function',
  icon: 'white_setting2',
  api,
  methods: {
    reloadSkill() {
      const that = this;
      return that.$api.getFunctionsStatus()
      .then((data) => {
        that.moduleList = data;
        that.moduleList.forEach((mod) => {
          mod.image = `/static/function_${mod.code.toLowerCase()}.png`;
        });
      }, () => {});
    },
    toggleSkill(skill) {
      skill.checked = !skill.checked;
      this.updateSkill(skill);
    },
    updateSkill(skill) {
      const active = skill.active;
      const that = this;

      that.$emit('startLoading');
      this.$api.setFunctionStatus(skill.code, active).then((data) => {
        const res = data.data;
        if (res.status === 0) {
          this.$notify({ text: that.$t('error_msg.success') });
        } else {
          this.$notify({ text: res.message });
        }
      }, () => {
        // util.handleAPIError(that, err).catch((value) => {
        // pop.popErrorWindow(that, that.$t('error_msg.save_fail'), err);
        // });
      })
      .then(() => that.reloadSkill())
      .then(() => {
        that.$emit('endLoading');
      });
    },
    setAll(val) {
      const that = this;
      that.moduleList.forEach((skill) => {
        skill.checked = val;
      });

      that.$emit('startLoading');
      this.$api.setFunctionInfos(that.moduleList, val)
      .then((rsp) => {
        if (rsp.data.status !== 0) {
          that.$notifyFail('error_msg.request_fail');
        }
      }, () => {
        that.$notifyFail('error_msg.request_fail');
      })
      .then(() => that.reloadSkill())
      .then(() => {
        that.$emit('endLoading');
      });
    },
    setUpModuleList() {
      this.moduleList = [
      ];
    },
    initPage() {
      const that = this;

      that.$emit('startLoading');
      that.reloadSkill().then(() => {
        that.$emit('endLoading');
      });
    },
  },
  data() {
    return {
      showLoading: false,
      moduleList: [],
      i18n: undefined,
    };
  },
  activated() {
    this.initPage();
  },
  mounted() {
    this.setUpModuleList();
    this.initPage();
  },
  computed: {
    canEdit() {
      // return auth.checkPrivilege('robot-skill', 'edit');
      return true;
    },
    allActive() {
      return this.moduleList.reduce((ret, mod) => ret && mod.active, true);
    },
    allDeactive() {
      return this.moduleList.reduce((ret, mod) => ret && !mod.active, true);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "styles/variable";
#robot-skill {
  @include auto-overflow();
  .skill-card-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-content: flex-start;
    margin-top: 20px;

    .skill-card {
      flex: 300px;

      background: white;
      border: 1px solid $page-header-color;
      margin-right: 20px;
      margin-bottom: 20px;
      padding: 5px 0;
      border-radius: $input-border-radius;

      display: flex;
      align-items: center;

      $icon-height: 80px;
      .skill-icon-container {
        flex: 0 0 $icon-height/2;
        margin: 0 10px;
        box-sizing: border-box;
        height: $icon-height;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          display: inline-block;
          width: $icon-height / 4 * 3;
          height: $icon-height / 4 * 3;
        }
      }
      .skill-text {
        flex: auto;
        word-break: break-all;
      }
      .skill-switch {
        flex: 0 0 70px;
        padding: 0 5px;
      }

      &:not(.checked) {
        opacity: 0.2;
        border: 1px solid $page-header-color;
      }
    }
  }
}
</style>
