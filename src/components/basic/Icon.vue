<template>
  <div class="icon" :class="{button: button}" @click="$emit('click', $event)" :style="containerStyle">
    <div :class="`${iconType}_icon`" :style="styleObj"></div>
  </div>
</template>

<script>
export default {
  name: 'icon',
  props: {
    size: {
      type: Number,
      required: false,
      default: 0,
    },
    iconType: {
      type: String,
      required: true,
    },
    button: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    iconSize() {
      if (this.size !== 0) {
        return `${this.size}px`;
      }
      return '';
    },
    styleObj() {
      return {
        'background-size': `${this.iconSize} ${this.iconSize}`,
      };
    },
    containerStyle() {
      return {
        height: `${this.iconSize}`,
        width: `${this.iconSize}`,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@import "styles/variable";
.icon {
  display: inline-block;
  position: relative;
  text-align: center;

  &.button {
    cursor: pointer;
  }

  .triangle {
    display: block;
    border-color: white transparent transparent transparent;
    border-style: solid;
    border-width: 0.5em 0.5em 0px 0.5em;
    height: 0px;
    width: 0px;
    position: relative;
    top: calc(50% - 0.25em);
    left: calc(50% - 0.25em);
  }
  .enterprise_icon {
    background: url("../../assets/images/enterprise.png") no-repeat center center;
    background-size: 40px 40px;
    width: 100%;
    height: 100%;
  }
  &:hover {
    .tooltip {
      visibility: visible;
    }
  }
  .tooltip {
    visibility: hidden;
    position: absolute;
    background: $tool-tip-background;
    color: $tool-tip-text;
    padding: 5px;
    border-radius: $input-border-radius;
    top: calc(-100% + 5px);
    left: -5px;
    user-select: none;
    white-space: nowrap;
    &::after {
      content: "";
      position: absolute;
      top: 100%;
      left: 50%;
      margin-left: -5px;
      border-width: 5px;
      border-style: solid;
      border-color: $tool-tip-background transparent transparent transparent;
    }
  }
  @mixin iconType($name) {
    .#{$name}_icon {
      background: url("../../assets/icons/#{$name}_icon.svg") no-repeat center center;
      // background: url("./icons/#{$name}_icon.svg") no-repeat center center;
      background-size: 20px 20px;
      width: 100%;
      height: 100%;
    }
    &.button {
      .#{$name}Icon:active {
        margin-left: 1px;
        margin-top: 1px;
      }
    }
  }
  @include iconType("add");
  @include iconType("search");
  @include iconType("delete");
  @include iconType("edit");
  @include iconType("privilege");
  @include iconType("role");
  @include iconType("user");
  @include iconType("white_robot");
  @include iconType("white_privilege");
  @include iconType("white_role");
  @include iconType("white_user");
  @include iconType("white_add");
  @include iconType("white_setting");
  @include iconType("white_setting2");
  @include iconType("white_refresh");
  @include iconType("white_success");
  @include iconType("white_fail");
  @include iconType("white_wordbank");
  @include iconType("white_folder");
  @include iconType("home");
  @include iconType("folder");
  @include iconType("dictionary");
  @include iconType("folder_add");
  @include iconType("dictionary_add");
  @include iconType("white_logout");
  @include iconType("white_ssm");
  @include iconType("white_chat");
  @include iconType("white_SQ");
  @include iconType("white_wordbank_upload");
  @include iconType("white_dashboard");
  @include iconType("white_statistics");
  @include iconType("white_audit");
  @include iconType("download");
  @include iconType("white_task_engine");

  @include iconType("menu_expand");
  @include iconType("menu_statistics");
  @include iconType("menu_ssm");
  @include iconType("menu_robot");
  @include iconType("menu_wordbank");
  @include iconType("menu_te");
  @include iconType("menu_privilege");

  // robot icon should a little bit larger than other icons
  .white_robot_icon {
    background-size: 25px 25px;
  }
}
</style>
