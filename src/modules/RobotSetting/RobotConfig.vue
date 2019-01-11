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
          <div class="row">
            <div class="row-title">{{ $t('general.enable') }}/{{ $t('general.disable') }}{{ $t(`robot_config.${config.key}.title`) }}:</div>
            <toggle v-model="config.on" @input="handleConfigChange(config, $event)"/>
          </div>
          <template v-if="config.on">
          <template v-if="config.children !== undefined">
          <div class="row">
            <div class="row-title">{{ $t('robot_config.rule') }}</div>
            <div class="row-content">
            <div v-for="child in config.children" :key="child.key" class="content-row">
              <toggle v-model="child.on" @input="handleConfigChange(child, $event)"/>
              <div class="content-row-desc" >
                <template v-if="editTarget !== child">
                  {{ $t(`robot_config.${config.key}.${child.key}-pre`) }} {{ child.threshold }} {{ $t(`robot_config.${config.key}.${child.key}-suf`) }}
                </template>
                <template v-else>
                  {{ $t(`robot_config.${config.key}.${child.key}-pre`) }}
                  <input v-model="editThreshold" ref="score-input" type="number" max="100" min="0"
                    @keyup.enter="finishEdit(child)" @input="checkThreshold(config)" @blur="cancelEditConfig" @keyup.esc="cancelEditConfig">
                  {{ $t(`robot_config.${config.key}.${child.key}-suf`) }}
                </template>
              </div>
              <template v-if="child.threshold !== undefined && editTarget === undefined && !robotNameEdit && child.on">
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
  return valStr.toLowerCase() === 'on';
}

function setConfigWithMap(config, configMap) {
  const configKey = config.key;
  const thresholdKey = `${configKey}-threshold`;

  if (configMap[configKey] !== undefined) {
    config.on = isOn(configMap[configKey].value);
    config.module = configMap[configKey].module;
  }
  if (configMap[thresholdKey] !== undefined) {
    config.threshold = parseInt(configMap[thresholdKey].value, 10);
  }
}

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
      editThreshold: 0,
      minThreshold: 0,
      maxThreshold: 100,
      configs: [
        {
          key: 'chat',
          on: false,
          module: '',
          children: [
            {
              key: 'chat-editorial',
              on: false,
              threshold: 0,
              module: '',
            },
            {
              key: 'chat-editorial-custom',
              on: false,
              threshold: 0,
              module: '',
            },
            {
              key: 'chat-editorial-domain',
              on: false,
              threshold: 0,
              module: '',
            },
            {
              key: 'chat-editorial-sport',
              on: false,
              threshold: 0,
              module: '',
            },
            {
              key: 'chat-robot',
              on: false,
              threshold: 0,
              module: '',
            },
            {
              key: 'chat-robot-custom',
              on: false,
              threshold: 0,
              module: '',
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
      that.editThreshold = child.threshold;
      that.editTarget = child;
      that.$nextTick(() => {
        that.$refs['score-input'][0].focus();
      });
    },
    checkThreshold() {
      this.editThreshold = this.editThreshold < this.minThreshold ?
        this.minThreshold : this.editThreshold;
      this.editThreshold = this.editThreshold > this.maxThreshold ?
        this.maxThreshold : this.editThreshold;
    },
    loadConfigs() {
      const that = this;

      that.$api.getConfigs().then((configs) => {
        configs.forEach((config) => {
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

        configs.forEach((config) => {
          if (config.code === 'language') {
            that.$refs.language.$emit('select', config.value);
            that.origLanguage = config.value;
          }
        });

        if (that.robotLanguage.length <= 0) {
          that.robotLanguage = ['zh-cn'];
          that.origLanguage = 'zh-cn';
        }
      });
    },
    finishEdit(config) {
      const that = this;
      that.editTarget = undefined;
      config.threshold = that.editThreshold;

      that.$api.setConfig(`${config.key}-threshold`, config.module, config.threshold).then(() => {
        that.$notify({ text: that.$t('error_msg.save_success') });
      });

      that.$forceUpdate();
    },
    cancelEditConfig() {
      this.editTarget = undefined;
    },
    handleConfigChange(config, value) {
      const that = this;
      const sendValue = value ? 'on' : 'off';
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
    this.loadConfigs();
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
      min-width: 120px;
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

        .content-row-desc {
          margin-left: 20px;
          margin-right: 10px;
          user-select: none;

          input {
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
