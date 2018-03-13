<template>
  <div class="icon" :class="{button: button}" @click="$emit('click', $event)">
    <div :class="`${iconType}_icon`"></div>
  </div>
</template>

<script>
export default {
  name: 'icon',
  props: {
    iconType: {
      type: String,
      required: true,
    },
    button: {
      type: Boolean,
      default: false,
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
  width: $default-line-height;
  height: $default-line-height;
  flex: 0 0 30px;

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

  // robot icon should a little bit larger than other icons
  .white_robot_icon {
    background-size: 25px 25px;
  }
}
</style>
