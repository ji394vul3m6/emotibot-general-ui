<template>
  <div class='qa-label'>
    <div class="card w-fill h-fill">
      <div class="actions row">
        <h3>{{$t('qa_label.label')}}</h3>
        <span class="grey9 label-count">{{$t('qalist.total')}} {{labelsCount}} {{$t('qa_label.label_row')}}{{$t('qa_label.label')}}</span>
        <search-input v-model="keyword"></search-input>
      </div>
      <div class="table-container table-box f12 grey6">
        <div class="row row-title">
          <div class="col tagname">{{$t('qa_label.label_name')}}</div>
          <div class="col opts"></div>
        </div>
        <div class="row row-tbody" v-for="(item, index) in tableData" :key="index">
          <div class="col tagname">
              <input class="tag-input" v-if="item.editing" v-model.trim="item.name" v-focus="true" maxlength="10" :placeholder="$t('qa_label.length')" key="tag-input" />
              <span v-else class="tagname grey3" key="tagname">{{item.name}}</span>
          </div>
          <div class="col opts" v-if="canEdit && item.type !== 'system'">
            <div class="tag-opts bluecolor" v-if='item.editing'>
              <a class="save-sqtag" @click="saveLabel(item)" href="javascript:void(0);" key="save-sqtag">{{$t('general.save')}}</a>
              <a class="cancel-sqtag" @click="cancelLabel(item)" href="javascript:void(0);" key="cancel-sqtag">{{$t('general.cancel')}}</a>
            </div>
            <div class="tag-opts bluecolor" v-if='!item.editing'>
              <a class="edit-sqtag" @click="editLabel(item)" href="javascript:void(0);" key="edit-sqtag">{{$t('general.edit')}}</a>
              <a class="remove-sqtag" @click="removeLabel(item,index)" href="javascript:void(0);" key="remove-sqtag">{{$t('general.delete')}}</a>
            </div>
          </div>
        </div>
        <div class="row row-tbody add-newtag" v-if="canEdit">
          <span @click="addLabel">+{{$t('general.add')}}{{$t('qa_label.label')}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import FlexTable from '@/components/FlexTable';
import apiBF from '@/api/BF';
import api from './_api/qalabel';

export default {
  path: 'qa-label',
  privCode: 'qa_label',
  displayNameKey: 'qa_label',
  icon: 'white_chat',
  name: 'qa-label',
  components: {
    'flex-table': FlexTable,
  },
  api: [api, apiBF],
  data() {
    return {
      keyword: '',
      labels: [],
      labelsbak: [],
      labelsCount: 0,
      tagblank: {
        name: '',
        editing: true,
        isadd: true,
      },
    };
  },
  computed: {
    ...mapGetters([
      'robotID',
      'userID',
    ]),
    canEdit() {
      return this.$hasRight('edit');
    },
    tableData() {
      const that = this;
      return that.labels.filter(tag => that.keyword === '' || tag.name.indexOf(that.keyword) >= 0);
    },
  },
  directives: {
    focus: {
      inserted(el) {
        el.focus();
      },
      update(el, value) {
        if (value.value) {
          el.focus();
        }
      },
    },
  },
  methods: {
    isEditing() {
      return this.labels.reduce((val, label) => val || label.editing, false);
    },
    resetEditing() {
      this.labels.forEach((label) => {
        if (label.editing) {
          this.cancelLabel(label);
        }
      });
    },
    editLabel(item) {
      if (this.isEditing()) {
        this.resetEditing();
      }
      item.editing = true;
      item.namebak = item.name;
      this.$forceUpdate();
    },
    removeLabel(item) {
      const that = this;
      that.$popCheck({
        title: `${that.$t('general.delete')}${that.$t('qa_label.label')}`,
        data: {
          msg: that.$t('qa_label.delete_label_name', { tag: item.name }),
        },
        callback: {
          ok() {
            that.$emit('startLoading');
            const params = {
              appid: that.robotID,
              tagid: item.id,
            };
            that.$api.deleteLabel(params).then((res) => {
              if (res.error_code === 0) {
                that.loadLabels();
              } else {
                that.$popError(res.error_message);
              }
            }, () => {
              // TODO: handle delete error
              that.$notifyFail(that.$t('qa_label.err_detele_label_has_rule'));
            })
              .then(() => {
                that.$emit('endLoading');
              });
          },
        },
      });
    },
    addLabel() {
      if (this.isEditing()) {
        this.resetEditing();
      }
      if (this.labels.indexOf(this.tagblank) < 0) {
        this.tagblank.name = '';
        this.tagblank.editing = true;
        this.labels.push(this.tagblank);
      }
    },
    saveLabel(item) {
      const that = this;
      if (item.name.length <= 0) {
        that.$popError(that.$t('error_msg.input_empty'));
        return;
      }

      const existedIdx = that.labels.findIndex(l => l.name === item.name && !item.editing);
      if (existedIdx >= 0) {
        that.$popError(that.$t('qa_label.err_existed_label'));
        return;
      }
      const params = {
        appid: that.robotID,
        name: item.name,
        type: 'userdefine',
        category: 'sq',
      };
      if (item.name === item.namebak) {
        this.$set(this, 'editing', false);
        this.$set(item, 'editing', false);
        return;
      }
      let promise;
      if (item.isadd) {
        promise = that.$api.addLabel(params);
      } else {
        params.id = item.id;
        promise = that.$api.updateLabel(params);
        that.$api.updateLabel(params);
      }
      promise.then((res) => {
        if (res.error_code === 0) {
          that.$set(this.tagblank, 'name', '');
          that.loadLabels();
        } else {
          that.$popError(res.error_message);
        }
      })
      .catch((err) => {
        // TODO: handle add error
        that.$set(this.tagblank, 'name', '');
        console.log(err);
      })
      .finally(() => {
        that.$emit('endLoading');
      });
    },
    cancelLabel(item) {
      const that = this;
      item.name = item.namebak;
      item.editing = false;
      that.$forceUpdate();

      if (item === that.tagblank) {
        that.tagblank.name = '';
        if (that.labels.indexOf(that.tagblank) >= 0) {
          that.labels.pop();
        }
      }
    },
    loadLabels() {
      const that = this;
      that.$emit('startLoading');
      that.$api.loadLabels(that.robotID).then((rsp) => {
        if (rsp.error_code === 0) {
          const labels = rsp.data.tag;
          that.labelsbak = JSON.parse(JSON.stringify(labels));
          that.labelsCount = labels.length;
          labels.forEach((label) => {
            label.editing = false;
          });
          labels.reverse();
          that.labels = labels;
        } else {
          that.$popError(rsp.error_message);
        }
      }, () => {
        // TODO: handle error if status code is not 500,
      })
      .then(() => {
        that.$emit('endLoading');
      });
    },
  },
  mounted() {
    this.$api.focusRobot(this.userID, this.robotID)
    .then(() => {
      this.loadLabels();
    });
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';
.regy6{
  color: #666;
}
.grey9{
  color: #999;
}
.f12{
  font-size: 12px;
}
a {
  text-decoration: none;
  color: #108EE9;
}
.bluecolor{
  color: #108EE9;
}
.qa-label {
  display: flex;
  overflow: auto;
  flex-direction: column;
  .row {
    padding: 20px;
    h3{
      color: #666;
      font-size: 18px;
    }
    .label-count{
      margin-left: 10px;
    }
    .search-input{
      margin-left: 86px;
    }
    @include flex-row();
  }
  .table-container {
    flex: 1;
  }
}
.table-box {
  width: 100%;
  .row {
    display: flex;
    width: 100%;
    .col {
      flex-wrap: wrap;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      overflow-wrap: break-word;
    }
  }
}
.table-container{
  .row{
    border-bottom: 1px solid #eee;
    line-height: 30px;
    padding: 5px;
    min-height: initial;
    &.row-title{
      border-top: 1px solid #eee;
      background-color: #efefef;
    }
    .col.tagname{
      padding-left: 20px;
      width: 210px;
      .tag-input{
        padding: 0 5px;
        width: calc(100% - 15px);
        height: 28px;
        line-height: 28px;
        border: 1px solid #d9d9d9;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        outline: none;
        &:hover,
        &:focus{
          border-color: #4B4B64;
        }
        &:focus{
          -webkit-box-shadow: 0 0 0 2px rgba(75, 75, 75, 0.2);
          -moz-box-shadow: 0 0 0 2px rgba(75, 75, 75, 0.2);
          box-shadow: 0 0 0 2px rgba(75, 75, 75, 0.2);
        }
      }
    }
    .col.opts{
      a{
        margin-right: 20px;
      }
    }
    &.add-newtag{
      cursor: pointer;
      padding-left: 25px;
    }
  }
}
</style>
