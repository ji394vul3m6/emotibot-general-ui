<template>
  <div class="form">
    <div class="row">
      <div class="row-title">{{ $t('management.robot_name') }}</div>
      <input class="row-input" v-model="name"
        :placeholder="$t('management.input_placeholder')">
    </div>
    <div class="row">
      <div class="row-title">{{ $t('management.add_robot') }}</div>
    </div>
    <div class="block">
      <div v-for="robot in robots" :key="robot.id" class="check-item">
        <input type="checkbox" v-model="robot.check" :id="robot.id">
        <label :for="robot.id" class="check-text" @mouseover.stop="showTooltip($event, robot)" @mouseout.stop="hideTooltip">
          {{ robot.name }}
        </label>
      </div>
    </div>
    <div ref="tooltip" class="tooltip">
      {{ showTooltipMsg }}
    </div>
  </div>  
</template>

<script>
export default {
  name: 'group-add-form',
  props: {
    extData: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      name: '',
      existNames: [],
      description: '',
      robots: [],
      showTooltipMsg: '',
    };
  },
  methods: {
    showTooltip(e, robot) {
      const that = this;
      if (!robot.description) {
        return;
      }
      that.showTooltipMsg = robot.description;
      that.$nextTick(() => {
        const target = e.currentTarget || e.target;

        const boundedBox = target.getBoundingClientRect();

        const tooltip = that.$refs.tooltip;
        if (tooltip) {
          tooltip.style.position = 'fixed';
          tooltip.style.visibility = 'visible';
          tooltip.style.top = `${boundedBox.top - tooltip.clientHeight}px`;
          tooltip.style.left = `${boundedBox.left}px`;
        }
      });
    },
    hideTooltip() {
      const tooltip = this.$refs.tooltip;
      tooltip.style.visibility = 'hidden';
    },
    validate() {
      const that = this;

      if (that.name === '') {
        console.log('name empty');
        return;
      }
      if (that.extData.groups && that.extData.groups.indexOf(that.name) >= 0) {
        if (!that.extData.group || that.name !== that.extData.group.name) {
          console.log('name existed');
          return;
        }
      }
      that.$emit('validateSuccess', {
        name: that.name,
        apps: JSON.stringify(this.robots.filter(robot => robot.check).map(robot => robot.id)),
      });
    },
  },
  mounted() {
    const that = this;

    that.name = that.extData.name || '';
    that.description = that.extData.description || '';
    if (that.extData.robots) {
      that.robots = [];
      that.extData.robots.forEach((robot) => {
        that.robots.push({
          ...robot,
          check: false,
        });
      });
    }
    if (that.extData.group) {
      that.name = that.extData.group.name || '';
      const checkedApp = that.extData.group.apps.map(app => app.id);
      that.robots.forEach((robot) => {
        robot.check = checkedApp.indexOf(robot.id) >= 0;
      });
    }
    that.$on('validate', that.validate);
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';

.tooltip {
  visibility: hidden;
  word-break: break-all;

  max-width: 172px;
  border-radius: 4px;
  background-color: #ffffff;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  padding: 8px 16px;
  &::before{
    border-top: 6px solid white;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    content: "";
    position: absolute;
    left: 25px;
    top: 100%;
  }
}

.form {
  width: 500px;
  padding: 0 30px;

  display: flex;
  flex-direction: column;
  .row {
    flex: 0 0 auto;
    margin-bottom: 10px;

    display: flex;
    align-items: center;
    .row-title {
      flex: 0 0 auto;
      &:after {
        content: '：'
      }
      margin-right: 5px;
      @include font-14px;
    }
    .row-input {
      flex: 1;
      display: flex;
      padding: 5px 8px;
    }
  }
  .block {
    flex: 0 0 200px;
    border: solid 1px #d9d9d9;
    @include auto-overflow();
    @include customScrollbar();
    padding: 10px 0;

    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    .check-item {
      display: flex;
      align-items: center;
      flex: 0 0 140px;
      padding: 5px 10px;
      .check-text {
        padding: 5px 3px;
        @include font-14px;
      }
    }
  }
}
</style>