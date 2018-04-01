<template>
  <div class='qa-activity-edit'>
    <div class="row" v-if="!addMode">
      <span class='row-name'>{{ $t('qa_activity.activity_id') }}</span>
      <div>{{ id }}</div>
    </div>
    <div class="row">
      <span class='row-name'>{{ $t('qa_activity.activity_name') }}</span>
      <input v-model="name"
        :class="{error: isNameError}"
        @keyup="checkName">
    </div>
    <div class="err-msg" v-if="isNameError">
      <template v-if="nameErrorType === 'empty'">{{ $t('error_msg.input_empty') }}</template>
      <template v-else-if="nameErrorType === 'existed'">{{ $t('qa_activity.err_existed_activity') }}</template>
    </div>
    <div class="row">
      <span class='row-name'>{{ $t('qa_activity.tag_name') }}</span>
      <select v-model="tag">
        <option v-for="tag in existTags" :key="tag.id" :value="tag.id">{{ tag.name }}</option>
      </select>
    </div>
    <div class="row">
      <span class='row-name'>{{ $t('qa_activity.activity_content') }}</span>
      <textarea v-model="content"
        :class="{error: isContentError}"
        @keyup="checkContent"></textarea>
    </div>
    <div class="err-msg" v-if="isContentError">
      <template v-if="contentErrorType === 'empty'">{{ $t('error_msg.input_empty') }}</template>
      <template v-else-if="contentErrorType === 'length'">{{ $t('qa_activity.err_content_too_long') }}</template>
    </div>
    <div class="block">
      <div class="row">
        <span class='row-name'>{{ $t('qa_activity.activity_time') }}</span>
        <label-switch :options="dateOptions" v-model="dateType"/>
      </div>
      <div class="row" v-if="dateType === 'custom'">
        <input type="date" v-model="startDate" @blur="checkDate"/>
        <input type="date" v-model="endDate" @blur="checkDate"/>
      </div>
      <div class="err-msg" v-if="isDateError">
        <template v-if="dateErrorType === 'start_empty'">{{ $t('error_msg.input_empty') }}</template>
        <template v-else-if="dateErrorType === 'end_empty'">{{ $t('error_msg.input_empty') }}</template>
        <template v-else-if="dateErrorType === 'invalid'">{{ $t('qa_activity.err_time_range') }}</template>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import LabelSwitch from '@/components/basic/LabelSwitch';

const maxContentLength = 200;
export default {
  name: 'qa-activity-edit',
  props: {
    origData: {
      type: Object,
      default: undefined,
    },
  },
  components: {
    LabelSwitch,
  },
  data() {
    return {
      name: '',
      id: '',
      content: '',
      tag: '',
      startDate: moment(new Date()).format('YYYY-MM-DD'),
      endDate: moment(new Date()).format('YYYY-MM-DD'),

      addMode: true,
      existActivities: [],
      existTags: [],
      nameErrorType: '',
      contentErrorType: '',
      dateErrorType: '',

      dateType: 'forever',
      dateOptions: [
        {
          val: 'forever',
          text: this.$t('qa_activity.status_forever'),
        },
        {
          val: 'custom',
          text: this.$t('qa_activity.custom_date'),
        },
      ],
    };
  },
  computed: {
    isNameError() {
      return this.nameErrorType !== '';
    },
    isContentError() {
      return this.contentErrorType !== '';
    },
    isDateError() {
      if (this.dateType === 'forever') {
        return false;
      }
      return this.dateErrorType !== '';
    },
  },
  methods: {
    validate() {
      const that = this;
      if (that.checkName() && that.checkContent() && that.checkDate()) {
        const ret = {
          name: that.name,
          tag: that.tag,
          content: that.content,
          start_time: new Date(that.startDate),
          end_time: new Date(that.endDate),
        };
        if (that.dateType === 'forever') {
          ret.start_time = null;
          ret.end_time = null;
        }
        that.$emit('validateSuccess', ret);
      }
    },
    checkName() {
      const that = this;

      if (that.name === '') {
        that.nameErrorType = 'empty';
      } else if (that.existActivities.indexOf(that.name) >= 0) {
        that.nameErrorType = 'existed';
      } else {
        that.nameErrorType = '';
      }
      that.$emit(that.isNameError ? 'disableOK' : 'enableOK');
      return !that.isNameError;
    },
    checkContent() {
      const that = this;

      if (that.content === '') {
        that.contentErrorType = 'empty';
      } else if (that.content.length > maxContentLength) {
        that.contentErrorType = 'length';
      } else {
        that.contentErrorType = '';
      }
      that.$emit(that.isContentError ? 'disableOK' : 'enableOK');
      return !that.isContentError;
    },
    checkDate() {
      const that = this;
      if (that.dateType === 'forever') {
        return true;
      }

      if (that.startDate === '') {
        that.dateErrorType = 'start_empty';
      } else if (that.endDate === '') {
        that.dateErrorType = 'end_empty';
      } else if (new Date(that.startDate) > new Date(that.endDate)) {
        that.dateErrorType = 'invalid';
      }
      return that.dateErrorType === '';
    },
    loadActivityFromProp() {
      const origActivity = this.origData.activity;
      this.name = origActivity.name;
      this.content = origActivity.content;
      this.tag = origActivity.tag;
      if (origActivity.start_time !== null && origActivity.end_time !== null) {
        this.startDate = moment(origActivity.start_time).format('YYYY-MM-DD');
        this.endDate = moment(origActivity.end_time).format('YYYY-MM-DD');
        this.dateType = 'custom';
      } else {
        this.dateType = 'forever';
      }
    },
  },
  mounted() {
    const that = this;
    that.$on('validate', that.validate);
    if (!that.origData.addMode) {
      that.loadActivityFromProp();
      that.addMode = that.origData.addMode || true;
    }
    that.existActivities = that.origData.existActivities || [];
    that.existTags = [];
    Object.keys(that.origData.existTags).forEach((id) => {
      that.existTags.push({
        id,
        name: that.origData.existTags[id],
      });
    });
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';

.qa-activity-edit {
  @include popForm(80px);
  .block {
    .err-msg {
      @include err-msg();
      margin-top: 10px;
      margin-left: 10px;
    }
  }
}
</style>
