<template>
  <div class='qa-activity'>
    <div class="actions row">
      <text-button main icon-type="white_add" @click="popAddActivity">{{$t('general.add')}}{{$t('qa_activity.activity')}}</text-button>
      <search-input v-model="keyword"></search-input>
    </div>
    <div class="table-container">
      <flex-table :data="activities" :columns="tableHeader"/>
    </div>
  </div>
</template>

<script>
import FlexTable from '@/components/FlexTable';
import ActivityEditPop from './_components/QAActivityEdit';
import tagAPI from './_api/qatag';
import activityAPI from './_api/qaactivity';

export default {
  path: 'qa-activity',
  privCode: 'qa_activity',
  displayNameKey: 'qa_activity',
  icon: 'white_chat',
  name: 'qa-activity',
  components: {
    'flex-table': FlexTable,
  },
  api: [tagAPI, activityAPI],
  data() {
    return {
      keyword: '',
      activities: [],
      tagMap: {},
      tableHeader: [
        {
          key: 'id',
          text: this.$t('qa_activity.activity_id'),
          type: 'text',
          fixed: true,
          width: '40px',
        },
        {
          key: 'tag_name',
          text: this.$t('qa_activity.tag_name'),
          type: 'text',
          width: 1,
        },
        {
          key: 'name',
          text: this.$t('qa_activity.activity_name'),
          type: 'text',
          width: 1,
        },
        {
          key: 'content',
          text: this.$t('qa_activity.activity_content'),
          type: 'text',
          width: 4,
        },
        {
          key: 'status_text',
          text: this.$t('qa_activity.activity_status'),
          type: 'text',
          width: 1,
        },
        {
          text: '',
          type: 'icon-button',
          fixed: true,
          width: '90px',
          icon: 'edit',
          iconCallback: this.popEditActivity,
          btn_text: this.$t('general.edit'),
        },
        {
          text: '',
          type: 'icon-button',
          fixed: true,
          width: '90px',
          icon: 'delete',
          iconCallback: this.popDeleteActivity,
          btn_text: this.$t('general.delete'),
        },
        {
          key: 'publish_status',
          text: this.$t('qa_activity.publish'),
          type: 'toggle',
          fixed: true,
          width: '70px',
          toggleCallback: this.toggleActivityPublish,
        },
      ],
    };
  },
  methods: {
    toggleActivityPublish(idx, activity) {
      const that = this;
      if (activity.publish_status && !activity.tag) {
        that.$notifyFail(that.$t('qa_activity.err_need_tag_to_publish'));
        activity.publish_status = false;
        that.loadActivities();
      } else if (!activity.status_valid) {
        that.$notifyFail(that.$t('qa_activity.err_activity_invalid'));
        activity.publish_status = false;
        that.loadActivities();
      } else {
        that.$api.setActivityStatus(activity.id, activity.publish_status).then(() => {
          that.$notify({
            text: that.$t('qa_activity.update_status_success', { activity: activity.name }),
          });
        });
      }
    },
    popAddActivity() {
      const that = this;
      that.$pop({
        title: `${that.$t('general.add')}${that.$t('qa_activity.activity')}`,
        component: ActivityEditPop,
        validate: true,
        data: {
          existActivities: that.activities.map(act => act.name),
          existTags: that.tagMap,
          addMode: true,
        },
        bindValue: false,
        callback: {
          ok(retData) {
            that.$emit('startLoading');
            that.$api.addActivity(retData)
            .then(() => that.loadActivities(), (err) => {
              // TODO: handle add error
              console.log(err);
            })
            .then(() => {
              that.$emit('endLoading');
            });
          },
        },
      });
    },
    popEditActivity(idx, activity) {
      const that = this;
      that.$pop({
        title: `${that.$t('general.edit')}${that.$t('qa_activity.activity')}`,
        component: ActivityEditPop,
        validate: true,
        data: {
          existActivities: that.activities
            .filter(act => act.id !== activity.id)
            .map(act => act.name),
          existTags: that.tagMap,
          activity,
          addMode: false,
        },
        bindValue: false,
        callback: {
          ok(retData) {
            that.$emit('startLoading');
            that.$api.updateActivity(activity.id, retData)
            .then(() => that.loadActivities(), (err) => {
              // TODO: handle add error
              console.log(err);
              that.$emit('endLoading');
            });
          },
        },
      });
    },
    popDeleteActivity(idx, activity) {
      const that = this;
      that.$popCheck({
        title: `${that.$t('general.delete')}${that.$t('qa_activity.activity')}`,
        data: {
          msg: that.$t('qa_activity.delete_activity_name', { activity: activity.name }),
        },
        callback: {
          ok() {
            that.$emit('startLoading');
            that.$api.deleteActivity(activity.id)
            .then(() => that.loadActivities(), () => {
              // TODO: handle delete error
              that.$notifyFail(that.$t('qa_tag.err_detele_tag_has_activity'));
            })
            .then(() => {
              that.$emit('endLoading');
            });
          },
        },
      });
    },
    loadActivities() {
      const that = this;
      that.activities = [];
      that.$emit('startLoading');
      return that.$api.loadTags().then((tags) => {
        that.tagMap = {};
        tags.forEach((tag) => {
          that.tagMap[tag.id] = tag.tag_name;
        });
        return that.$api.loadActivities();
      })
      .then((activities) => {
        const now = new Date();
        activities.forEach((activity) => {
          activity.tag_name = that.tagMap[activity.tag] || '';
          if (activity.start_time === null && activity.end_time === null) {
            activity.status_valid = true;
            activity.status_text = that.$t('qa_activity.status_forever');
          } else if (activity.end_time < now) {
            activity.status_valid = false;
            activity.status_text = that.$t('qa_activity.status_timeout');
          } else {
            activity.status_valid = true;
            activity.status_text = that.$t('qa_activity.status_valid');
          }
        });
        that.activities = activities;
      }, () => {
        // TODO handle load error
      })
      .then(() => {
        that.$emit('endLoading');
      });
    },
  },
  mounted() {
    this.loadActivities();
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';
.qa-activity {
  display: flex;
  flex-direction: column;
  .row {
    @include flex-row();
  }
  .table-container {
    flex: 1;
  }
}
</style>
