<template>
  <div class='login-page'>
    <div class='container'>
      <div class='logo'>
        <div id="app-logo"></div>
      </div>
      <div class="input-row">
        <input ref="user" type="text" v-model="input.account" :placeholder="$t('login.account_place')" @keydown="passwordKey">
      </div>
      <div class="input-row">
        <input ref="password" type="password" v-model="input.password"
        :placeholder="$t('login.password_place')" @keydown="passwordKey"
        autocomplete="off">
      </div>
      <div class="input-button-row">
        <loading-button main fill @click="submit" ref="btn">
          <template slot="init">{{ $t('login.login') }}</template>
          <template slot="loading">{{ $t('login.login') }}ing</template>
        </loading-button>
      </div>
      <div class="message">
        {{ $t('login.contact_sm') }}
      </div>
    </div>
    <notification></notification>
  </div>
</template>

<script>
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
        // if (that.redirect && that.redirect !== '') {
        //   window.location = `/#${that.redirect}`;
        // } else {
        window.location = '/#/manage/robot-manage';
        // }
      }, (err) => {
        that.$notify({ text: '登录失败', type: 'fail' });
        that.$refs.user.focus();
        that.$refs.btn.$emit('reset');
        console.log(err);
      });
    },
    passwordKey(e) {
      if (e.keyCode === 13) {
        this.submit();
      }
    },
  },
  mounted() {
    const that = this;
    that.$refs.user.focus();
    const querys = document.location.search.substr(1).split('&');
    const queryMap = {};
    querys.forEach((query) => {
      const idx = query.indexOf('=');
      queryMap[query.substr(0, idx)] = query.substr(idx + 1);
    });
    if (Object.keys(queryMap).indexOf('invalid') >= 0) {
      that.$notifyFail(that.$t('error_msg.auth_expire'));
    }
    if (Object.keys(queryMap).indexOf('redirect') >= 0) {
      that.redirect = decodeURIComponent(queryMap.redirect);
    }
  },
};
</script>

<style lang="scss">
@import "styles/reset.scss";
@import "styles/variable.scss";
input:-webkit-autofill {
  -webkit-box-shadow:0 0 0 50px white inset;
  -webkit-text-fill-color: #333;
}
::-webkit-input-placeholder {
  text-align: center;
}

:-moz-placeholder { /* Firefox 18- */
  text-align: center;  
}

::-moz-placeholder {  /* Firefox 19+ */
  text-align: center;  
}

:-ms-input-placeholder {  
  text-align: center; 
}
div {
  box-sizing: border-box;
}
.login-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;

  height: 100vh;
  width: 100vw;
  .container {
    flex:  0 0 auto;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: 240px;

    .logo {
      flex: 0 0 auto;
      margin-bottom: 40px;

      display: flex;
      justify-content: center;
      #app-logo {
        width: 185px;
        height: 103px;
        background: transparent url("./assets/images/emotibot_logo_chs.svg") no-repeat center center;
        background-size: 185px 103px;
      }
    }
    .input-row {
      flex: 0 0 28px;
      border: solid 1px #666666;

      display: flex;
      align-items: stretch;
      justify-content: stretch;
      margin-bottom: 26px;
      input {
        padding: 10px;
        width: 100%;
        outline: none;
        border: none;
        background: none;
        border: solid 1px #e9e9e9;
        &::placeholder {
          color: #999999;
        }
      }
    }
    .input-button-row {
      flex: 0 0 auto;
      margin-bottom: 15px;

      display: flex;
      align-items: center;
      justify-content: center;
    }
    .message {
      font-size: 12px;
      text-align: center;
      color: #666666;
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
