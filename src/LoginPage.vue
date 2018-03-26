<template>
  <div class='login-page'>
    <div class='header'>
      <div id="app-logo"></div>
    </div>
    <div class='container'>
      <div class='form'>
        <div class="title">
          <span>{{ $t('login.title') }}</span>
        </div>
        <div class="input-row">
          <icon icon-type="user"/>
          <div class="spliter"/>
          <input ref="user" type="text" v-model="input.account" :placeholder="$t('login.account_place')" @keydown="passwordKey">
        </div>
        <div class="input-row">
          <icon icon-type="privilege"/>
          <div class="spliter"/>
          <input ref="password" type="password" v-model="input.password" :placeholder="$t('login.password_place')" @keydown="passwordKey">
        </div>
        <div class="input-button-row">
          <loading-button main fill @click="submit" height="50px" ref="btn">
            <template slot="init">{{ $t('login.login') }}</template>
            <template slot="loading">{{ $t('login.login') }}ing</template>
          </loading-button>
        </div>
      </div>
    </div>
    <notification></notification>
  </div>
</template>

<script>
// import auth from '@/auth';
// import Error from '@/components/ErrorAlert';
import Icon from './components/basic/Icon';
import LoadingButton from './components/basic/LoadingButton';

export default {
  name: 'login',
  components: {
    icon: Icon,
    LoadingButton,
  },
  data() {
    return {
      input: {
        account: '',
        password: '',
      },
      hasError: false,
      i18n: {},
      redirect: '',
    };
  },
  methods: {
    submit() {
      const that = this;
      that.$refs.user.blur();
      that.$refs.password.blur();
      if (!that.input.account || !that.input.password) {
        that.$notify({ text: '请输入帐密', type: 'fail' });
        if (!that.input.account) {
          that.$refs.user.focus();
        } else {
          that.$refs.password.focus();
        }
        return;
      }
      that.$refs.btn.$emit('loading');
      that.$login(that.input).then(() => {
        window.location = '/#/statistic-dash';
      }, () => {
        that.$notify({ text: '登录失败', type: 'fail' });
        that.$refs.user.focus();
        that.$refs.btn.$emit('reset');
      });
    },
    passwordKey(e) {
      if (e.keyCode === 13) {
        this.submit();
      }
    },
  },
  mounted() {
    // if (auth.checkAuth(this)) {
    //   this.$router.push({ path: this.redirect });
    // }
    this.$refs.user.focus();
  },
};
</script>

<style lang="scss">
@import "styles/reset.scss";
@import "styles/variable.scss";

div {
  box-sizing: border-box;
}
.login-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  .header {
    flex: 0 0 $page-header-height;
    background: $page-header-color;
    #app-logo {
      position: absolute;
      top: 0;
      left: 0;
      width: $page-menu-width;
      height: $page-header-height;
      background: $page-header-color url("./assets/images/logo.png") no-repeat center center;
      background-size: 60px 32px;
    }
  }
  .container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    background: #EEE;
    .form {
      .title {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5em;
      }
      .input-button-row {
        flex: 0 0 50px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .input-row {
        flex: 0 0 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        input {
          padding: 10px;
          width: 100%;
          outline: none;
          border: none;
        }
        border: 1px solid gray;
        padding-left: 10px;
        .spliter {
          margin-left: 10px;
          border-left: 1px solid gray;
          height: 100%;
        }
      }
      padding: 30px 40px;
      height: 300px;
      width: 350px;
      background: white;
      text-align: center;
      box-shadow: 2px 2px 5px rgba(0.2, 0.2, 0.2, 0.5);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  }
  div.loading {
    @media screen and (max-width: $break-small) {
      left: 0;
      top: $page-header-height;
      width: 100vw
    }
    position: fixed;
    height: 100vh;
    width: 100vw;
    background: rgba(0%, 0%, 0%, 0.6);
    color: white;
    font-size: 1.5em;
    display: flex;
    align-items: center;
    justify-content: center;
    @keyframes spin {
      0% { transform: rotate(0deg); }
      25% { transform: rotate(192deg); }
      50% { transform: rotate(278deg); }
      75% { transform: rotate(336deg); }
      100% { transform: rotate(360deg); }
    }
    .loader {
      margin-right: 10px;
      border: 8px solid #f3f3f3; /* Light grey */
      border-top: 8px solid #3498db; /* Blue */
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 2s linear infinite;
    }
  }
}
</style>
