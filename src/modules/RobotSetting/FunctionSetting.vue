<template>
<div id="robot-skill" class="page">
  <div class="content">
    <text-button main v-if="canEdit" v-on:click="setAll(true)" :disabled=allActive>{{ $t("robot_setting.all_active") }}</text-button>
    <text-button main v-if="canEdit" v-on:click="setAll(false)" :disabled=allDeactive>{{ $t("robot_setting.all_deactive") }}</text-button>
    <div>
      <div v-for="skill in moduleList" :key="skill.id" class="skill-container" :class="{checked: skill.checked}">
        <div class="skill-name">{{ skill.text }}</div>
        <div class="skill-icon-container">
          <img :src="skill.img" class="skill-icon">
        </div>
        <div class="skill-info">{{ skill.info }}</div>
        <div class="skill-switch" v-if="canEdit" v-on:click.stop.prevent="toggleSkill(skill)">
          <span class="skill-switch-base">
            <input type="checkbox" :id="`skill_${skill.id}`" v-model="skill.checked">
            <label :for="`skill_${skill.id}`"></label>
          </span>
        </div>
        <div class="skill-switch" v-else style="cursor: default;"></div>
      </div>
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
  .skill-container {
    width: 200px;
    text-align: center;
    float: left;
    margin-right: 20px;
    margin-top: 20px;
    background: white;
    border: 1px solid $page-header-color;

    &:not(.checked) {
      opacity: 0.2;
      border: 1px solid $page-header-color;
    }

    .skill-icon-container {
      box-sizing: border-box;
      height: 120px;
      padding: 20px;

      img {
        display: inline-block;
        width: 80px;
        height: 80px;
      }
    }
    .skill-name {
      font-size: 1.5em;
      line-height: $default-line-height;
      color: white;
      background: $page-header-color;
    }

    .skill-info {
      color: lighten($page-header-color, 15%);
    }
  }


  .skill-switch {
    vertical-align: middle;
    padding: 10px;
    cursor: pointer;

    .skill-switch-base {
      display: inline-block;
      background: $page-header-color;
      width: 60px;
      height: 26px;
      border-radius: 20px;
      position: relative;
      padding: 3px;
      input {
        visibility: hidden;
        &:checked + label {
          left: 36px;
        }
        &::before {
          content: 'ON';
          color: white;
        }
        &::after {
          content: 'OFF';
          color: white;
        }
      }
      label {
        display: block;
        position: absolute;
        width: 20px;
        height: 20px;
        background: white;
        top: 3px;
        left: 3px;
        border-radius: 20px;
        user-select: none;
        cursor: pointer;
        transition: all 0.4s ease;
      }
    }
  }
}
</style>
