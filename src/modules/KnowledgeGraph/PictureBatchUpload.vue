<template>

  <div>
    <div class="test">
      <input type="file" style="display: none" ref="fileMutiply" name="files" multiple="multiple" @change="batchUploadFile" />
      <text-button button-type="primary" @click.stop="initKG">
        批量导入图片
      </text-button>
    </div>

    <div>
      <div>导出图片访问地址</div>
      <div v-for="(entity, idx) in resultList">
        {{ resultList[idx] }}
      </div>
    </div>
  </div>


</template>

<script>
  import { mapGetters } from 'vuex';
  import api from './_api/knowledgeGraph';

  export default {
    name: 'PictureBatchUpload',
    privCode: 'wordbank',
    path: 'picture',
    api,

    data() {
      return {
        resultList: [],
      };
    },

    computed: {
      ...mapGetters([
        'robotID',
        'userID',
      ]),
    },

    methods: {

      batchUploadFile() {
        const apiBatch = [];
        const fileList = this.$refs.fileMutiply.files;
        let length = fileList.length;
        const list = [];
        while (length > 0) {
          list.push(fileList[length - 1]);
          length -= 1;
        }

        list.forEach((item) => {
          apiBatch.push(
            new Promise(resolve => this.$api
              .UploadPicture(this.robotID, this.userID, item).then((res) => {
                resolve(res.data.data);
              })),
          );
        });
        Promise.all(apiBatch).then((res) => {
          this.resultList = res;
        });
      },
      initKG() {
        this.$refs.fileMutiply.click();
      },
    },
  };
</script>

<style scoped>

</style>
