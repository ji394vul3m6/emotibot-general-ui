<template>
  <div class="chat-tools">
    <div class="tools-top-header">
      <p>测试分析</p>
      <div class="btn-group">
        <span><a href="/testing/download/template">下载模版</a></span>
        <div id="import_tool">
          <input type="file" ref="fileChooser" id="fileChooser" accept=".xlsx" @change="validateFile"/>
          <text-button
            width="96px"
            @click="openFileChooser">
            {{ $t('wordbank.batch_import') }}
          </text-button>
        </div>
      </div>
    </div>
    <div class="chat-search">
      <div class='chat-search-item'>
        <div class="left">
          APPID&nbsp;&nbsp;<input type="text" v-model.trim="appId">
          对话场景：&nbsp;&nbsp;<dropdown-select class="single-input"
              width='300px'
              placeholder="请选择对话场景"
              :options="groupOptions" multi v-model="groupFilter"/>
        </div>
        <div class="right">
          <span class="show-test-result" v-if="correct !== undefined">测试完成，正确率 {{`${correct}%`}}</span>
          <span class="down-test-result" @click="downResult">下载测试结果</span>
          <span class="start-testing" :class="{'active': this.sheetGroup.length > 0}" @click="handleTest">开始测试</span>
        </div>
      </div>
    </div>
    <div class="test-result-table">
      <div class="result-teble-header result-box">
        <span class="test-case">测试题</span>
        <span class="excepted-result">期望结果</span>
        <span class="actual-result">实际结果</span>
        <span class="response-module">出话模块</span>
        <span class="if-pass">是否通过</span>
      </div>
      <div class="result-table-body">
        <div class="table-item">
          <div class="result-box result-box-body" v-for="(val, index) in sheetGroup" :key="index">
            <span class="test-case">{{val.input}}</span>
            <span class="excepted-result">{{val.expected}}</span>
            <span class="actual-result">{{val.actual}}</span>
            <span class="response-module">{{val.actualModule}}</span>
            <span class="if-pass" v-if="val.result === null">待测试</span>
            <span class="if-pass" v-else :class="{'pass': val.result === true, 'wran': val.result === false}"></span>
          </div>
        </div>
      </div>
      <v-pagination v-if="curTotal>0" class="fix-bottom" size="small" :total="curTotal" :pageIndex="curPageIdx" :pageSize="pageLimit" :pageSizeOption="[25, 50, 100, 200, 500, 1000]" :layout="['prev', 'pager', 'next','jumper']" @page-change="handlePageChange" @page-size-change="handlePageSizeChange"></v-pagination>
    </div>
  </div>
</template>

<script>
import DropdownSelect from '@/components/DropdownSelect';
import api from './_api/chattools';

export default {
  path: 'chat-tools',
  privCode: 'ssm',
  displayNameKey: 'chat',
  name: 'chat-tools',
  api: [api],
  components: {
    DropdownSelect,
  },
  data() {
    return {
      appId: '',
      backUpdata: {},
      allowImport: true,
      fileValid: false,
      file: undefined,
      sheetGroup: [],
      allData: [],
      scenarioName: '对话场景',
      correct: undefined,
      keywords: '',
      curPageIdx: 1,
      pageLimit: 10,
      groupOptions: [],
      groupFilter: [],
    };
  },
  created() {
    this.appId = this.$cookie.get('appid');
    this.fetchTestHis();
  },
  watch: {
    groupFilter: {
      handler() {
        let filter = [];
        if (this.groupFilter.length === 0) {
          filter = this.allData;
        }
        for (let i = 0; i < this.groupFilter.length; i += 1) {
          this.allData.filter((item) => {
            if (item.group === this.groupFilter[i]) {
              filter.push(item);
            }
            return true;
          });
        }
        this.$set(this, 'sheetGroup', filter.slice(this.curPageIdx - 1, this.pageLimit));
        this.$set(this, 'backUpdata', filter);
        const passTotal = this.sheetGroup.filter(item => item.result === true);
        this.correct = (passTotal / this.sheetGroup.length).toFixed(2);
      },
      deep: true,
    },
  },
  methods: {
    validateFile() {
      const theFile = this.$refs.fileChooser.files[0];
      if (!theFile) {
        this.fileValid = false;
        // this.updateFilename(this.$t('wordbank.upload_file_undefined'));
        this.updateFilename('对话测试文件格式错误');
      } else {
        this.fileValid = true;
        this.file = theFile;
        this.updateFilename();
      }
      if (this.fileValid) {
        this.uploadFile();
      }
    },
    uploadFile() {
      const that = this;
      // that.$startPageLoading();
      that.$api.uploadFile(this.file, this.appId)
        .then((res) => {
          if (res.data.status === 0) {
            that.calculateRest(res.data.result.scripts);
          }
        })
        .catch(() => {
          that.$notifyFail('上传失败');
        })
        .finally(() => {
          that.$refs.fileChooser.value = '';
          // that.$emit('endLoading');
        });
    },
    updateFilename(msg) {
      this.filename = msg || this.file.name;
    },
    openFileChooser() {
      this.$refs.fileChooser.click();
    },
    fetchTestHis() {
      const that = this;
      that.$api.getHisResult(this.appId)
        .then((res) => {
          if (res.data.status === 0) {
            that.calculateRest(res.data.result.scripts);
          }
        })
        .finally(() => {

        });
    },
    handleTest() {
      if (this.appId.length === 0) {
        this.$notifyFail('请输入APPID');
        return;
      }
      if (this.sheetGroup.length === 0) {
        this.$notifyFail('当前没有数据可测试~');
        return;
      }
      const that = this;
      that.$startPageLoading();
      that.$api.startTest(this.appId)
        .then((res) => {
          if (res.data.status === 0) {
            that.calculateRest(res.data.result.scripts);
          } else {
            that.$notifyFail(res.data.message);
          }
        })
        .finally(() => {
          that.$emit('endLoading');
        });
    },
    calculateRest(data) {
      // 计算有多少分组
      const group = Object.keys(data);
      this.groupOptions = group.map(item => ({
        text: item,
        value: item,
      }));
      // 重组数据
      const total = [];
      Object.entries(data).forEach((item) => {
        item[1].map((val) => {
          val.group = item[0];
          total.push(val);
          return true;
        });
      });
      // backUpdata 用于前端分页计算总数
      this.$set(this, 'backUpdata', total);
      this.$set(this, 'sheetGroup', total.slice(this.curPageIdx - 1, this.pageLimit));
      // allData 用户处理过滤的原始数据
      this.$set(this, 'allData', total);
      // 计算正确率
      const passTotal = this.sheetGroup.filter(item => item.result === true);
      this.correct = (passTotal / this.sheetGroup.length).toFixed(2);
    },
    downResult() {
      const a = document.createElement('a');
      a.setAttribute('id', 'exportHotExcel');
      event.target.parentNode.appendChild(a);
      const that = this;
      that.$api.getResult(that.appId)
        .then((res) => {
          const data = res.data;
          const blob = new Blob([data], { type: 'applicatoin/vnd.ms-excel' });
          const objURL = URL.createObjectURL(blob);
          const curtime = new Date();
          const filename = `测试结果${curtime.getTime()}.xlsx`;
          if ('msSaveOrOpenBlob' in navigator) {
            window.navigator.msSaveOrOpenBlob(blob, filename);
          } else {
            a.setAttribute('href', objURL);
          }
          a.setAttribute('download', filename);
          const downloadNode = document.getElementById('exportHotExcel');
          downloadNode.click();
          downloadNode.parentNode.removeChild(downloadNode);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {

        });
    },
    handlePageChange(page) {
      if (page <= 0) {
        this.toFirstPage();
      } else {
        this.toCurPage(page);
      }
      const startIndex = (this.curPageIdx - 1) * this.pageLimit;
      this.$set(this, 'sheetGroup', this.backUpdata.slice(startIndex, startIndex + this.pageLimit));
    },
    handlePageSizeChange(pageSize) {
      this.pageLimit = pageSize;
      this.toFirstPage();
      this.sheetGroup = [];
    },
    toFirstPage() {
      this.curPageIdx = 1;
    },
    toCurPage(page) {
      this.curPageIdx = page;
    },
  },
  computed: {
    curTotal() {
      return this.backUpdata.length;
    },
    lastPageIdx() {
      return Math.floor((this.backUpdata - 1) / this.pageLimit) + 1;
    },
  },
};
</script>

<style lang="scss" scoped>
  @import 'styles/variable.scss';
  #app-page{
    .app-body{
      padding: 0;
    }
  }
  #import_tool {
    display: flex;
    align-items: center;
    margin-left: 20px;
    #fileChooser {
      display: none;
    }
    #filename {
      color: $color-success;
    }
  }
  .chat-tools{
    font-weight: 400!important;
    font-family:PingFangSC-Regular;
    width: calc(100% - 40px);
    height: calc(100% - 40px)!important;
    background:rgba(255,255,255,1);
    box-shadow:0px 0px 5px 0px rgba(102,102,102,0.08);
    border-radius:4px;
    margin: 20px;
    display: flex;
    flex-direction: column;
    padding-bottom: 20px!important;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
  }
  .tools-top-header{
    height: 66px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 20px 20px;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    font-size: 14px;
    .btn-group{
      display: flex;
      flex-direction: row;
      margin-left: 20px;
    }
    p{
      font-size: 18px;
    }
    span{
      display: inline-block;
      height: 28px;
      line-height: 28px;
      border-radius:2px;
      border:1px solid rgba(219,219,219,1);
      padding: 0 20px;
      margin-left: 20px;
      cursor: pointer;
      a{
        text-decoration: none;
        color: #666666;
      }
    }
  }
  .chat-search{
    padding: 0 20px;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
  }
  .chat-search-item{
    height: 72px;
    width: 100%;
    background:rgba(247,247,247,1);
    border-radius:1px;
    border:1px solid rgba(238,238,238,1);
    margin-bottom: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    font-size: 14px;
    input{
      margin-right: 20px;
      width: 200px;
      height: 32px;
    }
    .left{
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .right{
      span{
        display: inline-block;
        height: 32px;
        line-height: 32px;
        border-radius:2px;
        border:1px solid rgba(219,219,219,1);
        padding: 0 20px;
        margin-left: 20px;
        cursor: pointer;
        &.start-testing.active{
          background: #4B4B64;
          color: #ffffff;
          border:1px solid #4B4B64;
        }
      }
    }
  }
  .test-result-table{
    flex: 1;
    overflow: hidden;
    padding-bottom: 30px;
    position: relative;
    .fix-bottom{
      position: absolute;
      bottom: 0;
      right: 20px;
      color: #000000;
    }
    .result-teble-header{
      background: #E9E9E9;
    }
    .result-box{
      display: flex;
      flex: row;
      &.result-box-body{
        border-bottom:1px solid rgba(238,238,238,1);
      }
      span{
        padding: 10px 0 10px 20px;
        line-height: 20px;
        padding-left: 20px;
        box-sizing: border-box;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        font-size: 14px;
        &.test-case{
          flex: 8;
        }
        &.excepted-result{
          flex: 6;
        }
        &.actual-result{
          flex: 6;
        }
        &.response-module{
          flex: 2;
        }
        &.if-pass{
          flex: 2;
          &.pass{
            background: url('../../assets/icons/test_result_correct.svg') no-repeat center;
            background-size: 20px;
          }
          &.wran{
            background: url('../../assets/icons/test_result_wraning.svg') no-repeat center;
            background-size: 20px;
          }
        }
      }
    }
    .result-table-body{
      height: calc(100% - 50px);
      overflow: hidden;
      .table-item{
        height: 100%;
        overflow-y: auto;
      }
    }
  }
</style>
