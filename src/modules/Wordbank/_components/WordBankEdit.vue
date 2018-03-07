<template>
  <div>
    <div class="row">
      <span>{{ $t('wordbank.word') }}：</span>
      <input :value="origData.name || ''">
    </div>
    <div class="row">
      <span>{{ $t('wordbank.synonym') }}：</span>
      <span class="info">{{ $t('wordbank.synonym_note') }}</span>
    </div>
    <div class="row">
      <tag-input
        :maxlength=maxTagLength
        :allowTagErrorTooltip=false
        :origTags=origData.text
        @selectedTagsChanged=updateSynonyms
      ></tag-input>
      <div class="err-msg" v-if="!isSynonymsTooLong">{{ $t('wordbank.err_synonym_length', {length: maxTagLength}) }}</div>
      <div class="err-msg" v-if="!isSynonymsTooMany">{{ $t('wordbank.err_synonym_total_length', {length: maxTotalLength}) }}</div>
    </div>
  </div>
</template>

<script>
import TagInput from '@/components/basic/TagInput';

export default {
  props: {
    origData: {
      type: Object,
      default() {
        return { name: '', text: [] };
      },
    },
  },
  data() {
    return {
      text: [],
      maxTagLength: 35,
      maxTotalLength: 5000,
      errMsg: '',
    };
  },
  components: {
    'tag-input': TagInput,
  },
  methods: {
    validate() {
      const that = this;
      if (that.isSynonymsValid) {
        const retObj = Object.assign({}, that.origData);
        retObj.text = that.text;
        that.$emit('validateSuccess', retObj);
      }
    },
    updateSynonyms(synonyms) {
      const that = this;
      that.text = synonyms;
      if (!that.isSynonymsValid) {
        that.$emit('disableOK');
      }
    },
  },
  computed: {
    isSynonymsValid() {
      return this.isSynonymsTooLong && this.isSynonymsTooMany;
    },
    isSynonymsTooLong() {
      const that = this;
      return that.text.reduce((ret, t) => ret && t.length <= that.maxTagLength, true);
    },
    isSynonymsTooMany() {
      const that = this;
      return that.text.join(',').length <= that.maxTotalLength;
    },
  },
  mounted() {
    const that = this;
    that.$on('validate', that.validate);
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable';

.row {
  margin-bottom: 10px;
  input {
    border: 1px solid black;
    padding: 10px;
  }
  .info {
    color: gray;
    font-size: 0.9em;
  }
  .err-msg {
    color: $error-color;
    font-weight: bold;
  }
}
</style>
