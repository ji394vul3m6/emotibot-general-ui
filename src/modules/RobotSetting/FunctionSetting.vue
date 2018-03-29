<template>
<div id="robot-skill">
  <text-button main v-if="canEdit" v-on:click="setAll(true)" :disabled=allActive>{{ $t("robot_setting.all_active") }}</text-button>
  <text-button main v-if="canEdit" v-on:click="setAll(false)" :disabled=allDeactive>{{ $t("robot_setting.all_deactive") }}</text-button>
  <div class="skill-card-container">
    <div v-for="skill in moduleList" :key="skill.id" class="skill-card" :class="{checked: skill.checked}">
      <div class="skill-icon-container">
        <img :src="skill.img" class="skill-icon">
      </div>
      <div class="skill-text">{{ skill.text }}</div>
      <div class="skill-switch" v-if="canEdit">
        <toggle v-model="skill.checked" @change="updateSkill(skill)"/>
      </div>
      <div class="skill-switch" v-else style="cursor: default;"></div>
    </div>
  </div>
</div>
</template>

<script>
import weatherImg from '@/assets/images/function_weathermodule.png';
import computationImg from '@/assets/images/function_computationmodule.png';
import jokeImg from '@/assets/images/function_jokemodule.png';
import storyImg from '@/assets/images/function_storymodule.png';
import riddleImg from '@/assets/images/function_riddlemodule.png';
import idiomImg from '@/assets/images/function_chengyumodule.png';
import api from './_api/robot';

export default {
  path: 'robot-function',
  privCode: 'robot_function',
  displayNameKey: 'robot_function',
  icon: 'white_setting2',
  methods: {
    ...api,
    toggleSkill(skill) {
      skill.checked = !skill.checked;
      this.updateSkill(skill);
    },
    updateSkill(skill) {
      const functionKey = `function_${skill.id}module`;
      const status = skill.checked;
      const that = this;

      that.$emit('startLoading');
      this.setFunctionStatus(functionKey, status).then((data) => {
        const res = data.data;
        if (res.status === 0) {
          this.$notify({ text: that.$t('error_msg.success') });
          // pop.popErrorWindow(that, that.$t('error_msg.success'));
        } else {
          this.$notify({ text: res.message });
          // pop.popErrorWindow(that, that.$t('error_msg.save_fail'), res.message);
          skill.checked = !skill.checked;
        }
        that.$emit('endLoading');
      }, () => {
        // util.handleAPIError(that, err).catch((value) => {
        // pop.popErrorWindow(that, that.$t('error_msg.save_fail'), err);
        // });
        skill.checked = !skill.checked;
        that.$emit('endLoading');
      });
    },
    setAll(val) {
      const that = this;
      const oldModuleList = JSON.parse(JSON.stringify(that.moduleList));
      that.moduleList.forEach((skill) => {
        skill.checked = val;
      });

      that.$emit('startLoading');
      this.setFunctionInfos(that.moduleList).then((data) => {
        const res = data.data;
        if (res.status === 0) {
          // util.popErrorWindow(that, that.$t('error_msg.success'));
        } else {
          // util.popErrorWindow(that, that.$t('error_msg.save_fail'), res.message);
          that.moduleList = oldModuleList;
        }
        that.$emit('endLoading');
      }, () => {
        // util.handleAPIError(that, err).catch((value) => {
          // util.popErrorWindow(that, that.$t('error_msg.save_fail'), value.errMsg);
        // });
        that.moduleList = oldModuleList;
        that.$emit('endLoading');
      });
    },
    setUpModuleList() {
      this.moduleList = [
        {
          id: 'weather',
          text: this.$t('robot_setting.weather'),
          info: this.$t('robot_setting.weather'),
          img: weatherImg,
          checked: false,
        },
        {
          id: 'computation',
          text: this.$t('robot_setting.computation'),
          info: this.$t('robot_setting.computation'),
          img: computationImg,
          checked: false,
        },
        {
          id: 'joke',
          text: this.$t('robot_setting.joke'),
          info: this.$t('robot_setting.joke'),
          img: jokeImg,
          checked: false,
        },
        {
          id: 'story',
          text: this.$t('robot_setting.story'),
          info: this.$t('robot_setting.story'),
          img: storyImg,
          checked: false,
        },
        {
          id: 'riddle',
          text: this.$t('robot_setting.riddle'),
          info: this.$t('robot_setting.riddle'),
          img: riddleImg,
          checked: false,
        },
        {
          id: 'chengyu',
          text: this.$t('robot_setting.chengyu'),
          info: this.$t('robot_setting.chengyu'),
          img: idiomImg,
          checked: false,
        },
      ];
    },
    initPage() {
      const that = this;

      that.$emit('startLoading');
      that.getFunctionsStatus().then((data) => {
        const res = data.data;
        if (res.status === 0) {
          const info = res.result;
          that.moduleList.forEach((mod) => {
            const key = `function_${mod.id}module`;
            if (key in info) {
              mod.checked = info[key].status;
            } else {
              mod.checked = false;
            }
          });
        }
        that.$emit('endLoading');
      }, () => {
        // util.handleAPIError(that, err).catch((value) => {
        //   util.popErrorWindow(that, that.$t('get_stats_error, value').errMsg);
        // });
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
      return this.moduleList.reduce((ret, mod) => ret && mod.checked, true);
    },
    allDeactive() {
      return this.moduleList.reduce((ret, mod) => ret && !mod.checked, true);
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
