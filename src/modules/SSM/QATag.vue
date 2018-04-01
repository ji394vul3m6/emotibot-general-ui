<template>
  <div class='qa-tag'>
    <div class="actions row">
      <text-button main icon-type="white_add" @click="popAddTag">{{$t('general.add')}}{{$t('qa_tag.tag')}}</text-button>
      <search-input v-model="keyword"></search-input>
    </div>
    <div class="table-container">
      <flex-table :data="tableData" :columns="tableHeader"/>
    </div>
  </div>
</template>

<script>
import FlexTable from '@/components/FlexTable';
import api from './_api/qatag';
import EditTagPop from './_components/QATagEdit';

export default {
  path: 'qa-tag',
  privCode: 'qa_tag',
  displayNameKey: 'qa_tag',
  icon: 'white_chat',
  name: 'qa-tag',
  components: {
    'flex-table': FlexTable,
  },
  api,
  data() {
    return {
      keyword: '',
      tags: [],
      tableHeader: [
        {
          key: 'id',
          text: this.$t('qa_tag.tag_id'),
          type: 'text',
          fixed: true,
          width: '40px',
        },
        {
          key: 'tag_name',
          text: this.$t('qa_tag.tag_name'),
          type: 'text',
          width: 'auto',
        },
        {
          key: 'activity_count',
          text: this.$t('qa_tag.activity_count'),
          type: 'text',
          width: '150px',
          fixed: true,
        },
        {
          text: '',
          type: 'icon-button',
          fixed: true,
          width: '90px',
          icon: 'edit',
          iconCallback: this.popEditTag,
          btn_text: this.$t('general.edit'),
        },
        {
          text: '',
          type: 'icon-button',
          fixed: true,
          width: '90px',
          icon: 'delete',
          iconCallback: this.popDeleteTag,
          btn_text: this.$t('general.delete'),
        },
      ],
    };
  },
  computed: {
    tableData() {
      const that = this;
      return that.tags.filter(tag => that.keyword === '' || tag.tag_name.indexOf(that.keyword) >= 0);
    },
  },
  methods: {
    popEditTag(idx, tag) {
      const that = this;
      that.$pop({
        title: `${that.$t('general.add')}${that.$t('qa_tag.tag')}`,
        component: EditTagPop,
        data: {
          name: tag.tag_name,
          id: tag.id,
          addMode: false,
        },
        bindValue: false,
        validate: true,
        callback: {
          ok(retData) {
            that.$emit('startLoading');
            that.$api.updateTag(tag.id, retData).then(() => {
              that.loadTags();
            });
          },
        },
      });
    },
    popDeleteTag(idx, tag) {
      const that = this;
      that.$popCheck({
        title: `${that.$t('general.delete')}${that.$t('qa_tag.tag')}`,
        data: {
          msg: that.$t('qa_tag.delete_tag_name', { tag: tag.tag_name }),
        },
        callback: {
          ok() {
            that.$emit('startLoading');
            that.$api.deleteTag(tag.id).then(() => {
              that.loadTags();
            }, () => {
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
    popAddTag() {
      const that = this;
      that.$pop({
        title: `${that.$t('general.add')}${that.$t('qa_tag.tag')}`,
        component: EditTagPop,
        validate: true,
        data: {
          existTags: that.tags.map(tag => tag.tag_name),
        },
        bindValue: false,
        callback: {
          ok(name) {
            that.$emit('startLoading');
            that.$api.addTag(name).then(() => {
              that.loadTags();
            }, (err) => {
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
    loadTags() {
      const that = this;
      that.$emit('startLoading');
      that.$api.loadTags().then((tags) => {
        that.tags = tags;
      }, () => {
        // TODO: handle error if status code is not 500,
      })
      .then(() => {
        that.$emit('endLoading');
      });
    },
  },
  mounted() {
    this.loadTags();
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';
.qa-tag {
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
