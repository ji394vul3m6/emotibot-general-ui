<template>
<div id="page-header">
  <div class="robot-list column" @click="showRobotList">
    {{ $t('general.robot_list') }}
  </div>
  <div class="empty column"></div>
  <div class="enterprise column">
    <div class="icon-container">
      <icon :size=22 icon-type="header_enterprise"/>
    </div>
    <div>{{ enterpriseName }}</div>
  </div>
  <template v-if="robotID !== ''">
  <div class="robot column">
    <div class="icon-container">
      <icon :size=22 icon-type="robot"/>
    </div>
    <div>{{ robotName }}</div>
  </div>
  <div class="chat-test column" @click="showChatTest">
    <div class="icon-container">
      <icon :size=22 icon-type="header_dialog"/>
    </div>
    {{$t('general.chat_test')}}
  </div>
  </template>
  <div class="user">
    <div class="user-column" @click.stop="showMenu">
      <div class="icon-container">
        <icon :size=22 icon-type="header_user"/>
      </div>
      <div>{{ userInfo.display_name }}</div>
      <div class="icon-container icon-right">
        <icon :size=7 icon-type="header_dropdown"/>
      </div>
    </div>

    <div class="user-menu-container" :class="[ showUserMenu ? 'show': '']" ref="list">
      <div class="user-menu">
        <div class="menu-item">{{ $t('header.user_info') }}</div>
        <div class="menu-item" v-if="userInfo.type === 1" @click="goEnterprisePrivilege">{{ $t('header.enterprise_privilege_list') }}</div>
        <div class="menu-item" @click="logout">{{ $t('header.logout') }}</div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  data: () => ({
    selectedIdx: 0,
    showUserMenu: false,
    clickHandler: undefined,
  }),
  computed: mapGetters([
    'robotName',
    'robotID',
    'enterpriseName',
    'enterpriseID',
    'robotList',
    'enterpriseList',
    'userInfo',
  ]),
  methods: {
    ...mapMutations([
      'setRobot',
      'setEnterprise',
    ]),
    goEnterprisePrivilege() {
      const that = this;
      that.setRobot('');
      that.$router.push('/manage/enterprise-user-list');

      that.showUserMenu = false;
      window.removeEventListener('click', that.clickHandler);
      that.clickHandler = undefined;
    },
    showRobotList() {
      this.setRobot('');
      this.$router.push('/manage/robot-manage');
    },
    showMenu() {
      const that = this;
      that.showUserMenu = true;

      that.clickHandler = (e) => {
        const clickDom = e.target;
        const listDom = that.$refs.list;
        if (listDom && !listDom.contains(clickDom)) {
          that.showUserMenu = false;
          window.removeEventListener('click', that.clickHandler);
          that.clickHandler = undefined;
        }
      };
      window.addEventListener('click', that.clickHandler);
    },
    logout() {
      this.$logout();
    },
    showChatTest() {
      this.$root.$emit('open-chat-test');
    },
  },
};
</script>

<style lang="scss" scoped>
@import "styles/variable";

#page-header {
  position: absolute;
  left: $page-menu-width;
  top: 0;
  width: calc(100vw - #{$page-menu-width});
  height: $page-header-height;
  background: $page-header-color;
  box-shadow: inset -1px 0 0 0 #222222;
  color: white;
  font-weight: bold;

  display: flex;
  justify-content: flex-end;
  align-items: stretch;

  .column {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    .icon-container {
      margin-right: 10px;
    }
    box-shadow: inset -1px 0 0 0 #333333;
    padding: 0 20px;
    &.empty {
      flex: 1;
      padding: 0;
    }
    &:hover:not(.empty) {
      background-color: #505050;
    }
  }

  .chat-test {
    @include click-button();
  }

  .robot-list {
    @include click-button();
  }

  .user {
    flex: 0 0 auto;

    display: flex;
    flex-direction: column;
    .user-column {
      flex: 0 0 $page-header-height;
      @include click-button();

      display: flex;
      align-items: center;
      .icon-container {
        margin-right: 10px;
        &.icon-right {
          margin-left: 10px;
          margin-right: 0px;
        }
      }
      box-shadow: inset -1px 0 0 0 #333333;
      padding: 0 20px;
      &:hover {
        background-color: #505050;
      }
    }
    .user-menu-container {
      z-index: 1;
      flex: 0 0 auto;
      color: #666666;
      padding: 10px;
      visibility: hidden;
      &.show {
        visibility: visible;
      }

      display: flex;
      flex-direction: column;
      .user-menu {
        flex: 0 0 auto;
        background: white;
        box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
        border-radius: 2px;
        display: flex;
        flex-direction: column;
        .menu-item {
          flex: 0 0 32px;
          padding: 6px 20px;

          display: flex;
          align-items: center;
          @include click-button();

          &:hover {
            background-color: #9393a2;
            color: white;
          }
        }
      }
    }
  }
}
</style>
