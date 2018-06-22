<template>
  <transition-group tag="div" name="fade" class="notifications">
    <div v-for="(notification, idx) in notifications" class="notification" :key="`${notification.id}-${idx}`" :class="notification.type">
      <!-- <div class="icon"><div :class="`white_${notification.type}_icon`"></div></div> -->
      <icon :icon-type="`white_${notification.type}`"></icon>
      <label>{{ notification.msg }}</label>
    </div>
  </transition-group>
</template>

<script>
import Icon from '../basic/Icon';

export default {
  name: 'notification',
  components: {
    icon: Icon,
  },
  data() {
    return {
      msg: '',
      notifications: [],
      defaultDelay: 4000,
      notificationTypes: ['success', 'fail'],
      defaultType: 'success',
    };
  },
  methods: {
    receiveNotification(option) {
      const that = this;
      that.showNotification(option);
      setTimeout(() => {
        that.notifications.shift();
      }, option.delay || that.defaultDelay);
    },
    showNotification(option) {
      this.notifications.push({
        msg: option.text,
        type: this.getType(option),
        id: (new Date()).getTime(),
      });
    },
    getType(option) {
      if (this.notificationTypes.indexOf(option.type) !== -1) {
        return option.type;
      }
      return this.defaultType;
    },
  },
  mounted() {
    this.$root.$on('notification', this.receiveNotification);
  },
};

</script>

<style lang="scss" scoped>
@import "styles/variable";

.notifications {
  position: fixed;
  right: 10px;
  bottom: 10px;

  display: flex;
  flex-direction: column-reverse;
  align-items: flex-end;
}

.notification {
  height: 50px;
  padding: 10px;
  margin-top: 5px;
  color: white;
  font-weight: bold;
  opacity: 1;
  border-radius: $notification-border-radius;
  width: $notification-width;
  overflow: hidden;

  display: flex;
  label {
    margin-top: 1px;
    line-height: $default-line-height;
  }

  &.success {
    background: $notification-background;
  }
  &.fail {
    background: $notification-fail-background;
  }

  &.fade-enter-active {
    transition: opacity 0.25s;
  }
  &.fade-leave-active {
    transition:
      height 1.5s cubic-bezier(0, 1, 0, 1) 0.5s,
      padding 1.5s cubic-bezier(0, 1, 0, 1) 0.5s,
      margin-top 1.5s linear 0.5s;
  }
  &.fade-enter {
    opacity: 0;
  }
  &.fade-leave-to {
    height: 0;
    padding: 0 10px;
    margin-top: 0;
  }
}
</style>
