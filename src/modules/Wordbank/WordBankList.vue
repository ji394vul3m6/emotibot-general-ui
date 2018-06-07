
<template>
  <div id="wordbank-page">
    
    <category-card id="card-category" class="card"></category-card>
    <wordbank-list-card id="card-content" class="card"></wordbank-list-card>
    
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';
import CategoryCard from './_components/CategoryCard';
import WordbankListCard from './_components/WordbankListCard';
import api from './_api/wordbank';

export default {
  path: 'wordbank-list',
  privCode: 'wordbank',
  displayNameKey: 'wordbank_list',
  icon: 'white_folder',
  api,
  components: {
    CategoryCard,
    WordbankListCard,
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters([
      'wordbank',
      'currentCategory',
      'isEditMode',
    ]),
  },
  methods: {
    ...mapMutations([
      'setWordbank',
      'setCurrentCategory',
    ]),
    loadWordbanks() {
      const that = this;
      that.$emit('startLoading');
      that.$api.getWordbanks()
        .then((data) => {
          that.setWordbank(data);
          that.setCurrentCategory(data.children[0]);
          data.children[0].isActive = true;
        })
        .catch(() => {
          that.$notifyFail();
        })
        .finally(() => {
          that.$emit('endLoading');
        });
    },
  },
  mounted() {
    const that = this;
    that.loadWordbanks();
  },
};
</script>
<style lang="scss" scoped>
@import 'styles/variable';
#wordbank-page {
  display: flex;
  #card-category {
    flex: 0 0 200px;
  }
  #card-content {
    flex: 1 0 auto;
    margin-left: 20px;
  }
}
</style>
