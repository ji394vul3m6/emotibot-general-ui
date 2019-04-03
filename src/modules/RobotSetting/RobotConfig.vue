<template>
  <div class="robot-special-words">
    <div class="card w-fill h-fill">
      <nav-bar class="nav" :options=pageMap />
      <div class="card-content">
        <div class="menu-list">
          <div class="menu-container">
            <div class="active-bar" :style="activeBarStyle"></div>
            <div class="menu" @click="scrollTo('robot')">{{ $t('robot_config.robot.title') }}{{ $t('general.setting') }}</div>
            <template v-for="config in configs">
            <div v-if="config.status" :key="config.key" class="menu"
              @click="scrollTo(config.key)">
              <div>{{ $t(`robot_config.${config.key}.title`) }}{{ $t('general.setting') }}</div>
            </div>
            </template>
          </div>
        </div>
        <div class="content" @wheel="handleScroll" ref="container">
          <div class="config-block" ref="robot-block" data-key="robot">
            <div class="block-title row">{{ $t('robot_config.robot.title') }}{{ $t('general.setting') }}</div>
            <div class="row">
              <div class="row-title">{{ $t('robot_config.robot.title') }}{{ $t('robot_config.robot.name') }}</div>
              <div v-if="robotNameEdit">
                <input v-model="robotEditName" :placeholder="$t('robot_config.robot.default')" ref="name-input"
                  @keyup.enter="finishEditName"
                  @keyup.esc="cancelEditName"
                  @blur="cancelEditName">
              </div>
              <div v-else class="row-value">
                <div>{{ robotName || $t('robot_config.robot.default') }}</div>
                <div class="row-value-edit" @click.stop="startEditRobotName" v-if="editTarget === undefined">
                  <icon :size=12 icon-type="edit_blue"></icon>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="row-title">{{ $t('robot_config.robot.title') }}{{ $t('robot_config.robot.language') }}</div>
              <dropdown-select :options="languageOption" width="150px" v-model="robotLanguage" ref="language" @input="changeLanguage"/>
            </div>
          </div>
          <template v-for="config in configs">
            <div v-if="config.status" :key="config.key" class="config-block" :data-key="config.key" ref="block">
              <div class="block-title row">{{ $t(`robot_config.${config.key}.title`) }}{{ $t('general.setting') }}</div>
              <div class="row" v-if="!config.alwaysOn">
                <div class="row-title">{{ $t('general.enable') }}/{{ $t('general.disable') }}{{ $t(`robot_config.${config.key}.title`) }}:</div>
                <toggle v-model="config.on" @input="handleConfigChange(config, $event)"/>
              </div>
              <template v-if="config.on || config.alwaysOn">
              <template v-if="config.hasValidChildren" >
              <div class="row">
                <div class="row-title">{{ $t('robot_config.rule') }}</div>
                <div class="row-content">
                <template v-for="child in config.children">
                  <div v-if="child.status" :key="child.key" class="content-row">
                    <template v-if="!child.alwaysOn">
                    <toggle class="content-row-toggle" v-model="child.on" @input="handleConfigChange(child, $event)"/>
                    </template>
                    <div class="content-row-desc" >
                      <!-- Show status -->
                      <template v-if="editTarget !== child">
                        <template v-if="['threshold','string','number','count'].indexOf(child.type) >= 0">
                        {{ $t(`robot_config.${config.key}.${child.key}-pre`) }} {{ child.value }} {{ $t(`robot_config.${config.key}.${child.key}-suf`) }}
                        </template>
                        <template v-if="child.type === 'time-range'">
                        {{ $t(`robot_config.${config.key}.${child.key}-pre`) }} {{ child.begin }} ~ {{ child.end }} {{ $t(`robot_config.${config.key}.${child.key}-suf`) }}
                        </template>
                        <template v-if="child.type === 'switch'">
                        {{ $t(`robot_config.${config.key}.${child.key}-info`) }}
                        </template>
                      </template>
                      <!-- Edit status -->
                      <template v-else>
                        <template v-if="child.type === 'threshold'">
                        {{ $t(`robot_config.${config.key}.${child.key}-pre`) }}
                        <input v-model="editNumber" ref="edit-input" type="number" max="101" min="0"
                          @keyup.enter="finishEdit(child)" @input="checkThreshold(config)" @blur="cancelEditConfig" @keyup.esc="cancelEditConfig">
                        {{ $t(`robot_config.${config.key}.${child.key}-suf`) }}
                        </template>
                        <template v-if="child.type === 'number' || child.type === 'count'">
                        {{ $t(`robot_config.${config.key}.${child.key}-pre`) }}
                        <input v-model="editNumber" ref="edit-input" type="number"
                          @keyup.enter="finishEdit(child)" @blur="cancelEditConfig" @keyup.esc="cancelEditConfig">
                        {{ $t(`robot_config.${config.key}.${child.key}-suf`) }}
                        </template>
                        <template v-if="child.type === 'time-range'">
                        {{ $t(`robot_config.${config.key}.${child.key}-pre`) }}
                        <time-range-picker ref="edit-range"
                          :start="child.begin" :end="child.end"
                          @finish="finishTimeRangeEdit(child, $event)" @cancel="cancelEditConfig"></time-range-picker>
                        {{ $t(`robot_config.${config.key}.${child.key}-suf`) }}
                        </template>
                        <template v-if="child.type === 'string'">
                        {{ $t(`robot_config.${config.key}.${child.key}-pre`) }}
                        <input v-model="editString" ref="edit-input"
                          @keyup.enter="finishEdit(child)" @input="checkInput(config)" @blur="cancelEditConfig" @keyup.esc="cancelEditConfig">
                        {{ $t(`robot_config.${config.key}.${child.key}-suf`) }}
                        </template>
                      </template>
                    </div>
                    <template v-if="child.type !== 'switch' && editTarget === undefined && !robotNameEdit && (child.on || child.alwaysOn)">
                      <div class="content-row-edit" @click.stop="startEdit(child)">
                        <icon :size=12 icon-type="edit_blue"></icon>
                      </div>
                    </template>
                  </div>
                </template>
                </div>
              </div>
              </template>
              </template>
              <template v-if="config.relatives">
              <div class="row">
                <div class="row-title">{{ $t('robot_config.relative') }}</div>
                <div>
                  <div v-for="relative in config.relatives" :key="relative.url">
                    <div class="relative-link" @click="$router.push(relative.url)">{{ relative.text }}</div>
                  </div>
                </div>
              </div>
              </template>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import NavBar from '@/components/NavigationBar';
import TimeRangePicker from '@/components/TimeRangePicker';
import configAPI from './_api/config';

function isOn(valStr) {
  return valStr.toLowerCase() === 'on' || valStr.toLowerCase() === 'true';
}

function setConfigWithMap(config, configMap) {
  const configKey = config.key;
  if (config.key === 'ssm_ml_threshold' || config.key === 'ssm_qq_threshold') {
    try {
      const ssmConfig = JSON.parse(configMap.ssm_config.value);
      if (ssmConfig === undefined) {
        return;
      }
      const rank = ssmConfig.items.find(x => x.name === 'rank');
      if (rank === undefined) {
        return;
      }
      let targetSource = 'ml';
      if (config.key === 'ssm_qq_threshold') {
        targetSource = 'qq';
      }
      const target = rank.value.find(x => x.source === targetSource);
      if (target === undefined) {
        return;
      }
      config.value = target.threadholds;
      config.status = configMap.ssm_config.status;
    } catch (err) {
      console.log(err);
    }
  }
  if (configMap[configKey] === undefined) {
    return;
  }

  config.status = configMap[configKey].status;
  config.on = isOn(configMap[configKey].value);
  config.module = configMap[configKey].module;
  if (config.type === 'threshold') {
    const thresholdKey = `${configKey}-threshold`;
    if (configMap[thresholdKey] !== undefined) {
      config.value = parseInt(configMap[thresholdKey].value, 10);
    }
  } else if (config.type === 'count') {
    const thresholdKey = `${configKey}-cnt`;
    if (configMap[thresholdKey] !== undefined) {
      config.value = parseInt(configMap[thresholdKey].value, 10);
    }
  } else if (config.type === 'time-range') {
    if (configMap[config.begin_key]) {
      config.begin = configMap[config.begin_key].value;
    }
    if (configMap[config.end_key]) {
      config.end = configMap[config.end_key].value;
    }
  } else {
    config.value = configMap[configKey].value;
  }
}

const BFSystemModule = 'bf-env';

function getFixTop(ele) {
  return ele.getBoundingClientRect().top;
}

export default {
  path: 'robot_config',
  privCode: 'robot_config',
  displayNameKey: 'robot_config',
  icon: 'white_chat',
  name: 'robot_config',
  components: {
    NavBar,
    TimeRangePicker,
  },
  api: configAPI,
  computed: {
    ...mapGetters([
      'enterpriseID',
      'robotID',
    ]),
    activeBarStyle() {
      let index = 0;
      const that = this;
      this.configs.forEach((config, idx) => {
        if (config.key === that.currentActive) {
          index = idx + 1;
        }
      });
      return {
        top: `${38 * index}px`,
      };
    },
  },
  data() {
    return {
      pageMap: {
        basic: this.$t('robot_config.robot_config'),
      },
      wordsList: [],
      secret: '',
      editTarget: undefined,
      editNumber: 0,
      editString: '',
      minThreshold: 0,
      maxThreshold: 101,
      configs: [
        {
          key: 'ssm',
          on: true,
          alwaysOn: true,
          children: [
            {
              key: 'uploadimg_server',
              value: '',
              module: '',
              alwaysOn: true,
              type: 'string',
            },
            {
              key: 'ssm_context_support',
              on: false,
              value: 0,
              module: '',
              type: 'switch',
            },
            {
              key: 'ssm_ml_threshold',
              on: false,
              alwaysOn: true,
              value: 0,
              module: '',
              type: 'threshold',
            },
            {
              key: 'ssm_qq_threshold',
              on: false,
              alwaysOn: true,
              value: 0,
              module: '',
              type: 'threshold',
            },
          ],
        },
        {
          key: 'chat',
          on: false,
          alwaysOn: true,
          module: '',
          children: [
            {
              key: 'chat-robot-custom',
              on: false,
              value: 0,
              module: '',
              type: 'threshold',
            },
            {
              key: 'chat-editorial-custom',
              on: false,
              value: 0,
              module: '',
              type: 'threshold',
            },
            {
              key: 'chat-domain-greeting',
              on: false,
              value: 0,
              module: '',
              type: 'switch',
            },
            {
              key: 'chat-editorial-domain',
              on: false,
              value: 0,
              module: '',
              type: 'threshold',
            },
            // {
            //   key: 'chat-editorial-sport',
            //   on: false,
            //   value: 0,
            //   module: '',
            //   type: 'threshold',
            // },
            {
              key: 'chat-editorial',
              on: false,
              value: 0,
              module: '',
              type: 'threshold',
            },
            {
              key: 'chat-robot',
              on: false,
              value: 0,
              module: '',
              type: 'threshold',
            },
          ],
        },
        {
          key: 'context',
          on: false,
        },
        {
          key: 'to-human',
          on: false,
          module: '',
          children: [
            {
              key: 'to-human-backfill',
              on: false,
              value: 0,
              module: '',
              type: 'count',
            },
            {
              key: 'to-human-faq-repeat-q',
              on: false,
              value: 0,
              module: '',
              type: 'count',
            },
            {
              key: 'to-human-emotion',
              on: false,
              value: 0,
              module: '',
              type: 'switch',
            },
            {
              key: 'to-human-faq-label',
              on: false,
              value: 0,
              module: '',
              type: 'switch',
            },
            {
              key: 'to-human-intent',
              on: false,
              value: 0,
              module: '',
              type: 'switch',
            },
            {
              key: 'human-intent',
              on: false,
              value: 0,
              module: '',
              type: 'switch',
            },
            {
              key: 'to-human-keyword',
              on: false,
              value: 0,
              module: '',
              type: 'switch',
            },
            {
              key: 'to-human-work',
              on: false,
              value: 0,
              module: '',
              type: 'time-range',
              begin_key: 'to-human-begin-time',
              end_key: 'to-human-end-time',
              begin: '',
              end: '',
            },
          ],
          relatives: [
            {
              text: this.$t('robot_config.to-human.words-link'),
              url: '/robot-chat-skill?page=human',
            },
          ],
        },
        {
          key: 'faq',
          on: false,
          children: [
            {
              key: 'faq-similar-question-range',
              value: 0,
              module: '',
              alwaysOn: true,
              type: 'number',
            },
            {
              key: 'faq-recommand-question-range',
              value: 0,
              module: '',
              alwaysOn: true,
              type: 'number',
            },
          ],
        },
        {
          key: 'task-engine',
          on: false,
          children: [
            {
              key: 'task-engine-total-timeout',
              value: 0,
              module: '',
              alwaysOn: true,
              type: 'number',
            },
            {
              key: 'task-engine-web-api-timeout',
              value: 0,
              module: '',
              alwaysOn: true,
              type: 'number',
            },
          ],
        },
        {
          key: 'knowledge',
          on: false,
          children: [
            {
              key: 'knowledge-threshold',
              value: 0,
              module: '',
              alwaysOn: true,
              type: 'number',
            },
          ],
        },
        {
          key: 'command',
          on: false,
        },
        {
          key: 'intent',
          on: true,
          alwaysOn: true,
          children: [
            {
              key: 'intent-threshold',
              value: 0,
              module: '',
              alwaysOn: true,
              type: 'number',
            },
          ],
        },
      ],
      flatConfigMap: {},
      languageOption: [
        {
          value: 'zh-cn',
          text: this.$t('general.zh_cn'),
        },
        {
          value: 'zh-tw',
          text: this.$t('general.zh_tw'),
        },
      ],
      robotName: '',
      robotEditName: '',
      robotNameEdit: false,
      robotLanguage: [],
      origLanguage: '',
      currentActive: 'robot',
      targetOffset: 0,
      scrollTimer: undefined,
    };
  },
  methods: {
    handleScroll() {
      const that = this;
      const container = this.$refs.container;
      const shift = -40;
      if (getFixTop(this.$refs['robot-block']) - getFixTop(container) > shift) {
        that.currentActive = 'robot';
        return;
      }

      that.currentActive = '';
      that.$refs.block.forEach((block) => {
        if (that.currentActive !== '') {
          return;
        }
        if (getFixTop(block) - getFixTop(container) > shift) {
          that.currentActive = block.dataset.key;
        }
      });
      if (that.currentActive === '') {
        that.currentActive = 'robot';
      }
    },
    scrollTo(target) {
      if (this.scrollTimer !== undefined) {
        return;
      }
      this.currentActive = target;
      const blocks = this.$refs.block;
      let targetDiv = this.$refs['robot-block'];
      blocks.forEach((block) => {
        if (block.dataset.key === target) {
          targetDiv = block;
        }
      });
      const parent = targetDiv.parentElement;
      const targetOffset = targetDiv.offsetTop - parent.offsetTop - 20;
      this.animateScroll(parent, targetOffset);
    },
    animateScroll(element, target) {
      const that = this;
      const speed = 5;
      let interval = 10;
      const scrollToTarget = () => {
        const orig = element.scrollTop;
        if (target > element.scrollTop) {
          element.scrollTop += speed;
          if (element.scrollTop > target) {
            element.scrollTop = target;
          }
        } else if (target < element.scrollTop) {
          element.scrollTop -= speed;
          if (element.scrollTop < target) {
            element.scrollTop = target;
          }
        }
        if (that.scrollTimer !== undefined) {
          clearTimeout(that.scrollTimer);
          that.scrollTimer = undefined;
        }
        if (orig === element.scrollTop) {
          return;
        }
        if (element.scrollTop !== target) {
          that.scrollTimer = setTimeout(scrollToTarget, interval);
        }
      };

      interval = (1000 * speed) / (target - element.scrollTop);
      that.scrollTimer = setTimeout(scrollToTarget, interval);
    },
    startEdit(child) {
      const that = this;
      that.editNumber = child.value;
      that.editString = child.value;
      that.editTarget = child;
      that.$nextTick(() => {
        if (that.$refs['edit-input'] !== undefined && that.$refs['edit-input'].length > 0) {
          that.$refs['edit-input'][0].focus();
        }
        if (that.$refs['edit-range'] !== undefined && that.$refs['edit-range'].length > 0) {
          that.$refs['edit-range'][0].focus();
        }
      });
    },
    checkInput(config) {
      if (config.validator instanceof Function) {
        return config.validator.bind(this)();
      }
      return true;
    },
    checkThreshold() {
      this.editNumber = this.editNumber < this.minThreshold ?
        this.minThreshold : this.editNumber;
      this.editNumber = this.editNumber > this.maxThreshold ?
        this.maxThreshold : this.editNumber;
    },
    loadAllConfigs() {
      const that = this;

      that.$startPageLoading();
      that.$api.getConfigs().then((datas) => {
        datas.forEach((config) => {
          that.flatConfigMap[config.code] = config;
        });

        that.configs.forEach((mainConfig) => {
          setConfigWithMap(mainConfig, that.flatConfigMap);
          if (mainConfig.children === undefined) {
            mainConfig.hasValidChildren = false;
            return;
          }
          mainConfig.children.forEach((child) => {
            setConfigWithMap(child, that.flatConfigMap);
          });
          mainConfig.hasValidChildren = mainConfig.children.reduce(
            (val, child) => val || child.status, false);
          mainConfig.status = mainConfig.status || mainConfig.hasValidChildren;
        });

        datas.forEach((config) => {
          if (config.code === 'language') {
            that.$refs.language.$emit('select', config.value);
            that.origLanguage = config.value;
          }
        });

        if (that.robotLanguage.length <= 0) {
          that.robotLanguage = ['zh-cn'];
          that.origLanguage = 'zh-cn';
        }
        that.$emit('endLoading');
      });
    },
    finishTimeRangeEdit(config, e) {
      const that = this;
      config.begin = e.start;
      config.end = e.end;
      that.editTarget = undefined;
      that.$api.setConfig(config.begin_key, config.module, config.begin)
        .then(() => that.$api.setConfig(config.end_key, config.module, config.end))
        .then(() => {
          that.$notify({ text: that.$t('error_msg.save_success') });
        });
      that.$forceUpdate();
    },
    finishEdit(config) {
      const that = this;
      that.editTarget = undefined;
      let configKey = config.key;

      // handle special key in json structure
      if (config.key === 'ssm_ml_threshold' || config.key === 'ssm_qq_threshold') {
        const ssmConfig = JSON.parse(this.flatConfigMap.ssm_config.value);
        const rank = ssmConfig.items.find(x => x.name === 'rank');
        if (rank === undefined) {
          that.$notifyFail(that.$t('robot_config.config_content_error'));
          return;
        }
        let targetSource = 'ml';
        if (config.key === 'ssm_qq_threshold') {
          targetSource = 'qq';
        }
        const target = rank.value.find(x => x.source === targetSource);
        if (target === undefined) {
          that.$notifyFail(that.$t('robot_config.config_content_error'));
          return;
        }
        target.threadholds = parseInt(that.editNumber, 10);
        config.value = target.threadholds;
        that.$api.setConfig('ssm_config', BFSystemModule, JSON.stringify(ssmConfig)).then(() => {
          that.$notify({ text: that.$t('error_msg.save_success') });
        });
        that.$forceUpdate();
        return;
      } else if (config.type === 'threshold') {
        config.value = that.editNumber;
        configKey = `${config.key}-threshold`;
      } else if (config.type === 'count') {
        config.value = that.editNumber;
        configKey = `${config.key}-cnt`;
      } else if (config.type === 'number') {
        config.value = that.editNumber;
      } else if (config.type === 'string') {
        config.value = that.editString;
      } else {
        return;
      }
      that.$api.setConfig(configKey, config.module, config.value).then(() => {
        that.$notify({ text: that.$t('error_msg.save_success') });
      });

      that.$forceUpdate();
    },
    cancelEditConfig() {
      this.editTarget = undefined;
    },
    handleConfigChange(config, value) {
      const that = this;
      let sendValue = value ? 'on' : 'off';

      if (config.module === BFSystemModule) {
        sendValue = value ? 'true' : 'false';
      }

      that.$api.setConfig(config.key, config.module, sendValue).then(() => {
        that.$notify({ text: that.$t('error_msg.save_success') });
      });
    },
    changeLanguage(v) {
      const that = this;
      const sendValue = v[0];
      if (sendValue !== that.origLanguage && that.origLanguage !== '') {
        that.origLanguage = sendValue;
        that.$api.setConfig('language', 'controller', sendValue).then(() => {
          that.$notify({ text: that.$t('error_msg.save_success') });
        });
      }
    },
    startEditRobotName() {
      const that = this;
      that.robotNameEdit = true;
      that.robotEditName = that.robotName;
      that.$nextTick(() => {
        that.$refs['name-input'].focus();
      });
    },
    finishEditName() {
      const that = this;
      that.robotNameEdit = false;
      if (that.robotName !== that.robotEditName) {
        that.robotName = that.robotEditName;
        that.$api.setConfig('robot-name', 'controller', that.robotName).then(() => {
          that.$notify({ text: that.$t('error_msg.save_success') });
        });
      }
    },
    cancelEditName() {
      this.robotNameEdit = false;
    },
  },
  mounted() {
    this.loadAllConfigs();
  },
};
</script>

<style lang="scss" scoped>
.card {
  display: flex;
  flex-direction: column;
  align-items: stretch;

  .nav {
    flex: 0 0 60px;
  }
  .card-content {
    flex: 1;
    overflow: hidden;
  }
}
.card-content {
  display: flex;
  align-items: stretch;
  .menu-list {
    flex: 0 0 150px;
  }
  .content {
    flex: 1;
    padding: 20px;
    padding-bottom: 0;
    overflow: auto;
    @include customScrollbar();
  }
}
.menu-list {
  padding: 20px;

  .menu-container {
    border-left: 2px solid #cccccc;
    padding-left: 10px;
    position: relative;
    .menu {
      @include font-14px();
      @include click-button();
      line-height: 28px;
      height: 28px;
      margin-bottom: 10px;
    }
    .active-bar {
      position: absolute;
      height: 28px;
      width: 2px;
      background-color: #1875f0;
      top: 0;
      left: -2px;
      transition: top .5s;
    }
  }
}
.config-block {
  @include font-14px();

  padding-bottom: 20px;
  margin-bottom: 20px;
  box-shadow: inset 0 -1px 0 0 #e9e9e9;


  display: flex;
  flex-direction: column;
  align-content: stretch;

  .block-title {
    @include font-16px();
    color: #333333;
  }

  .row {
    flex: 0 0 auto;
    align-items: center;
    min-height: 28px;

    display: flex;
    &:not(:first-child) {
      margin-top: 10px;
    }

    .row-title {
      flex: 0 0 auto;
      min-width: 110px;
      margin-right: 10px;
    }
    .row-value {
      flex: 1;

      display: flex;
      align-items: center;
      .row-value-edit {
        flex: 0 0 24px;
        height: 24px;
        @include click-button();

        display: flex;
        align-items: center;
        justify-content: center;
        &:hover {
          background-color: #f8f8f8;
        }
        border-radius: 12px;
      }
    }
    .row-content {
      flex: 1;
      border-radius: 4px;
      background-color: #f8f8f8;
      padding: 10px;
      
      display: flex;
      flex-direction: column;
      .content-row {
        display: flex;
        align-items: center;
        flex: 0 0 28px;

        .content-row-toggle {
          margin-right: 20px;
        }

        .content-row-desc {
          margin-right: 10px;
          user-select: none;

          input[type=number] {
            border: white;
            display: inline-block;
            height: 28px;
            width: 60px;
            text-align: center;
            margin: 0 10px;
          }
        }
        .content-row-edit {
          flex: 0 0 24px;
          height: 24px;
          @include click-button();

          display: flex;
          align-items: center;
          justify-content: center;
          &:hover {
            background-color: white;
          }
          border-radius: 12px;
        }
      }
    }
    .relative-link {
      @include click-button();
      color: $color-primary;
    }
  }
}
</style>
