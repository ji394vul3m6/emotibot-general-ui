<template>
  <div>
    <fieldset id="encrypt-tool">
      <legend>{{ $t('privileges.tools.encrypt.title')}}</legend>
      <div id="before-encrypt" class="encrypt-toolbar">
        <input type="text" v-model="encryptFrom"
          :placeholder="$t('privileges.tools.encrypt.placeholder.encrypt_from')" >
        <text-button @click="encryptText" main> {{ $t('privileges.tools.encrypt.button')}}</text-button>
      </div>
      <div id="after-encrypt" class="encrypt-toolbar">
        <input type="text" :value="encryptedText" ref="encryptedText"
          :placeholder="$t('privileges.tools.encrypt.placeholder.encrypt_to')">
        <text-button @click="copyEncryptedText" main> {{ $t('privileges.tools.encrypt.copy_button') }}</text-button>
      </div>
    </fieldset>
  </div>
</template>
<script>
import api from './_api/tools';

export default {
  path: 'other-tools',
  privCode: 'management',
  displayNameKey: 'other_tools',
  api,
  data() {
    return {
      encryptFrom: '',
      encryptedText: '',
    };
  },
  methods: {
    encryptText() {
      this.$api.encryptText(this.encryptFrom)
        .then((text) => {
          console.log(text);
          this.encryptedText = text;
        })
        .catch((err) => {
          console.log(err);
          this.$notifyFail(this.$t('priviledges.tools.encrypt.fail'));
        });
    },
    copyEncryptedText() {
      const textInput = this.$refs.encryptedText;
      console.log(textInput);
      textInput.select();
      document.execCommand('copy');
      this.$notify({ text: this.$t('privileges.tools.encrypt.copied') });
    },
  },
};
</script>
<style lang="scss" scoped>
@import 'styles/variable.scss';
#encrypt-tool {
  display: flex;
  flex-direction: column;
  .encrypt-toolbar {
    margin: 20px 10px;
    line-height: $default-line-height;     
    input[type=text] {
      margin-right: 10px;
      padding: 5px;
      width: 400px;
    }
  }
}
fieldset {
  border: 1px solid $area-border-color;
  padding: 5px 20px;
  margin-top: 10px;
  margin-bottom: 40px;
  legend {
    padding: 0 10px;
  }
}
</style>
