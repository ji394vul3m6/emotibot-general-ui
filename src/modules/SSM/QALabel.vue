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
        <div class="row row-tbody" v-for="(item, index) in tableData">
          <div class="col tagname">
              <input class="tag-input" v-show="item.ifedit" v-model.trim="item.name" v-focus="true" maxlength="10" :placeholder="$t('qa_label.length')" key="tag-input" />
              <span v-show="!item.ifedit" class="tagname grey3" key="tagname">{{item.name}}</span>
          </div>
          <div class="col opts">
            <div class="tag-opts bluecolor" v-if='item.ifedit'>
              <a class="save-sqtag" @click="saveLabel(item)" href="javascript:void(0);" key="save-sqtag">{{$t('general.save')}}</a>
              <a class="cancel-sqtag" @click="cancelLabel(false,item)" href="javascript:void(0);" key="cancel-sqtag">{{$t('general.cancel')}}</a>
            </div>
            <div class="tag-opts bluecolor" v-if='!item.ifedit'>
              <a class="edit-sqtag" @click="editLabel(item)" href="javascript:void(0);" key="edit-sqtag">{{$t('general.edit')}}</a>
              <a class="remove-sqtag" @click="removeLabel(item,index)" href="javascript:void(0);" key="remove-sqtag">{{$t('general.delete')}}</a>
            </div>
          </div>
        </div>
        <div class="row row-tbody add-newtag">
          <span @click="addLabel">+{{$t('general.add')}}{{$t('qa_label.label')}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FlexTable from '@/components/FlexTable';
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
  api,
  data() {
    return {
      appid: this.getAppID('appid'),
      keyword: '',
      labels: [],
      labelsbak: [],
      ifedit: false,
      labelsCount: 0,
      tagblank: {
        name: '',
        ifedit: true,
        isadd: true,
      },
    };
  },
  computed: {
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
    editLabel(item) {
      if (!this.ifedit) {
        this.$set(this, 'ifedit', true);
        this.$set(item, 'ifedit', true);
        this.$set(item, 'namebak', JSON.parse(JSON.stringify(item.name)));
      }
    },
    removeLabel(item) {
      const that = this;
      that.$popCheck({
        title: `${that.$t('general.delete')}${that.$t('qa_label.label')}`,
        data: {
          msg: that.$t('qa_label.delete_label_name', { label: item.name }),
        },
        callback: {
          ok() {
            that.$emit('startLoading');
            const params = {
              appid: that.appid,
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
      this.labels.push(this.tagblank);
    },
    saveLabel(item) {
      const that = this;
      if (item.name.length <= 0) {
        that.$popError(that.$t('error_msg.input_empty'));
      } else {
        const params = {
          appid: that.appid,
          name: item.name,
          type: 'userdefine',
          category: 'sq',
        };
        if (item.name === item.namebak) {
          this.$set(this, 'ifedit', false);
          this.$set(item, 'ifedit', false);
          return;
        }
        if (item.isadd) {
          that.$api.addLabel(params).then((res) => {
            if (res.error_code === 0) {
              that.$set(this.tagblank, 'name', '');
              that.loadLabels();
            } else {
              that.$popError(res.error_message);
            }
          }, (err) => {
            // TODO: handle add error
            that.$set(this.tagblank, 'name', '');
            that.$popError(that.$t('error_msg.input_empty'));
            console.log(err);
          })
            .then(() => {
              that.$emit('endLoading');
            });
        } else {
          params.id = item.id;
          that.$api.updateLabel(params).then((res) => {
            if (res.error_code === 0) {
              that.$set(this.tagblank, 'name', '');
              that.loadLabels();
            } else {
              that.$popError(res.error_message);
            }
          }, (err) => {
            // TODO: handle add error
            that.$set(this.tagblank, 'name', '');
            console.log(err);
          })
            .then(() => {
              that.$emit('endLoading');
            });
        }
      }
    },
    cancelLabel() {
      this.labels = JSON.parse(JSON.stringify(this.labelsbak));
      this.$set(this.tagblank, 'name', '');
      this.ifedit = false;
    },
    loadLabels() {
      const that = this;
      that.$emit('startLoading');
      that.$api.loadLabels(that.appid).then((labels) => {
        if (labels.error_code === 0) {
          that.labels = labels.data.tag;
          that.labelsbak = JSON.parse(JSON.stringify(that.labels));
          that.labelsCount = that.labels.length;
        } else {
          that.$popError(labels.error_message);
        }
      }, () => {
        // TODO: handle error if status code is not 500,
      })
      .then(() => {
        that.$emit('endLoading');
      });
    },
    getAppID(name) {
      const label = `${name}=`;
      const ca = document.cookie.split(';');
      let appId = '';
      ca.forEach((val) => {
        let c = val;
        if (c.charAt(0) === ' ') {
          c = c.substring(1);
        }

        if (c.indexOf(label) !== -1) {
          appId = c.substring(label.length, c.length);
          return true;
        }

        return true;
      });

      return appId;
    },
  },
  mounted() {
    this.loadLabels();
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
