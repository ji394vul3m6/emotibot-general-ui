<template>
  <div class="robot-special-words">
    <div class="card w-fill h-fill">
      <nav-bar :options=pageMap />
      <div class="content">
        <div class="config-block">
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
        <div v-for="config in configs" :key="config.key" class="config-block">
          <div class="block-title row">{{ $t(`robot_config.${config.key}.title`) }}{{ $t('general.setting') }}</div>
          <div class="row" v-if="!config.alwaysOn">
            <div class="row-title">{{ $t('general.enable') }}/{{ $t('general.disable') }}{{ $t(`robot_config.${config.key}.title`) }}:</div>
            <toggle v-model="config.on" @input="handleConfigChange(config, $event)"/>
          </div>
          <template v-if="config.on || config.alwaysOn">
          <template v-if="config.children !== undefined">
          <div class="row">
            <div class="row-title">{{ $t('robot_config.rule') }}</div>
            <div class="row-content">
            <div v-for="child in config.children" :key="child.key" class="content-row">
              <template v-if="!child.alwaysOn">
              <toggle class="content-row-toggle" v-model="child.on" @input="handleConfigChange(child, $event)"/>
              </template>
              <div class="content-row-desc" >
                <!-- Show status -->
                <template v-if="editTarget !== child">
                  <template v-if="child.type === 'threshold' || child.type === 'string' || child.type === 'number'">
                  {{ $t(`robot_config.${config.key}.${child.key}-pre`) }} {{ child.value }} {{ $t(`robot_config.${config.key}.${child.key}-suf`) }}
                  </template>
                  <template v-if="child.type === 'switch'">
                  {{ $t(`robot_config.${config.key}.${child.key}-info`) }}
                  </template>
                </template>
                <!-- Edit status -->
                <template v-else>
                  <template v-if="child.type === 'threshold'">
                  {{ $t(`robot_config.${config.key}.${child.key}-pre`) }}
                  <input v-model="editNumber" ref="edit-input" type="number" max="100" min="0"
                    @keyup.enter="finishEdit(child)" @input="checkThreshold(config)" @blur="cancelEditConfig" @keyup.esc="cancelEditConfig">
                  {{ $t(`robot_config.${config.key}.${child.key}-suf`) }}
                  </template>
                  <template v-if="child.type === 'number'">
                  {{ $t(`robot_config.${config.key}.${child.key}-pre`) }}
                  <input v-model="editNumber" ref="edit-input" type="number"
                    @keyup.enter="finishEdit(child)" @blur="cancelEditConfig" @keyup.esc="cancelEditConfig">
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
            </div>
          </div>
          </template>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import NavBar from '@/components/NavigationBar';
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
    } catch (err) {
      console.log(err);
    }
  }
  if (configMap[configKey] === undefined) {
    return;
  }

  config.on = isOn(configMap[configKey].value);
  config.module = configMap[configKey].module;
  if (config.type === 'threshold') {
    const thresholdKey = `${configKey}-threshold`;
    if (configMap[thresholdKey] !== undefined) {
      config.value = parseInt(configMap[thresholdKey].value, 10);
    }
  } else {
    config.value = configMap[configKey].value;
  }
}

const BFSystemModule = 'bf-env';

export default {
  path: 'robot_config',
  privCode: 'integration',
  displayNameKey: 'robot_config',
  icon: 'white_chat',
  name: 'robot_config',
  components: {
    NavBar,
  },
  api: configAPI,
  computed: {
    ...mapGetters([
      'enterpriseID',
      'robotID',
    ]),
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
      maxThreshold: 100,
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
          module: '',
          children: [
            {
              key: 'chat-editorial',
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
              key: 'chat-editorial-domain',
              on: false,
              value: 0,
              module: '',
              type: 'threshold',
            },
            {
              key: 'chat-editorial-sport',
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
            {
              key: 'chat-robot-custom',
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
          key: 'human-intent',
          on: false,
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
    };
  },
  methods: {
    startEdit(child) {
      const that = this;
      that.editNumber = child.value;
      that.editString = child.value;
      that.editTarget = child;
      that.$nextTick(() => {
        that.$refs['edit-input'][0].focus();
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
            return;
          }
          mainConfig.children.forEach((child) => {
            setConfigWithMap(child, that.flatConfigMap);
          });
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
        config.value = JSON.stringify(ssmConfig);
      } else if (config.type === 'threshold') {
        config.value = that.editNumber;
        configKey = `${config.key}-threshold`;
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
.content {
  padding: 20px;
  padding-bottom: 0;
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
  }
}
</style>
