<template>
  <div class="icon" :class="{button: button || enableHover}" @click="$emit('click', $event)" :style="containerStyle">
    <div v-if="enableHover" :class="`${iconType}_icon_hover`" :style="styleObj"></div>
    <div v-else :class="`${iconType}_icon`" :style="styleObj"></div>
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
    enableHover: {
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
        flex: `0 0 ${this.iconSize}`,
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
  @mixin iconTypeHover($name) {
    .#{$name}_icon_hover {
      background: url("../../assets/icons/#{$name}_icon.svg") no-repeat center center;
      // background: url("./icons/#{$name}_icon.svg") no-repeat center center;
      background-size: 20px 20px;
      width: 100%;
      height: 100%;
      &:hover {
        background: url("../../assets/icons/#{$name}_hover_icon.svg") no-repeat center center;
      }
    }
  }

  @include iconType("menu_expand");
  @include iconType("menu_statistics");
  @include iconType("menu_ssm");
  @include iconType("menu_robot");
  @include iconType("menu_wordbank");
  @include iconType("menu_te");
  @include iconType("menu_privilege");
  @include iconType("menu_dashboard");
  @include iconType("menu_intent");

  @include iconType("add");
  @include iconType("check");
  @include iconType("checked");
  @include iconType("close");
  @include iconType("delete");
  @include iconType("delete_hover");
  @include iconTypeHover("delete");
  @include iconType("drop_down");
  @include iconType("edit");
  @include iconType("edit_blue");
  @include iconType("edit_white");
  @include iconType("enterprise_admin");
  @include iconType("expand");
  @include iconType("help");
  @include iconType("menu_expand");
  @include iconType("normal_acc");
  @include iconType("robot");
  @include iconType("search");
  @include iconType("white_add");
  @include iconType("daggle");
  @include iconType("more");
  @include iconType("setting");
  @include iconType("setting_hover");
  @include iconTypeHover("setting");

  /** used on TaskEngineV2 top panel*/
  @include iconType("save");
  @include iconType("canlendar");
  @include iconType("knowledge_base");

  /** used on robot profile icon */
  @include iconType("profile_question");
  @include iconType("profile_answer");
  
  /** used on notifications */
  @include iconType("info_success");
  @include iconType("info_warning");
  @include iconType("info_error");
  // info_close will be use in all close button if background is white
  @include iconType("info_close");

  /** used on input info */
  @include iconType("info");
  @include iconType("info_hover");
  @include iconTypeHover("info");

  /** used on category memu */
  @include iconType("category_add");
  @include iconType("category_close");
  @include iconType("category_dropdown");
  @include iconType("category_open");

  /** used on page nav header */
  @include iconType("header_enterprise");
  @include iconType("header_user");
  @include iconType("header_dialog");
  @include iconType("header_dropdown");
  @include iconType("header_dropdown_gray");

  @include iconType("intent");
  @include iconType("info_warning_gray");
  @include iconType("close_expand");
  @include iconType("upload");
  /** used on calendar */
  @include iconType("year_left");
  @include iconType("year_right");
  @include iconType("month_left");
  @include iconType("month_right");

  // robot icon should a little bit larger than other icons
  .white_robot_icon {
    background-size: 25px 25px;
  }
}
</style>
