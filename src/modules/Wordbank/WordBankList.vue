
<template>
  <div id="wordbank-page">
    <category-card id="card-category" class="card"></category-card>

    <div id="card-content" class="card">
      <div id="card-content-header">
        <search-input v-model="wordbankKeyword"></search-input>
        <div id="io-buttons">
          <text-button>{{ $t('wordbank.batch_import') }}</text-button>
          <text-button>{{ $t('wordbank.export_all') }}</text-button>
        </div>
      </div>
      <div id="card-content-content">
        <div id="toolbar">
          <text-button button-type="primary">{{ $t('wordbank.add_wordbank') }}</text-button>
          <text-button button-type="error">{{ $t('wordbank.delete') }}</text-button>
          <text-button>{{ $t('wordbank.moveto') }}</text-button>
        </div>
      </div>
      <div id="card-content-footer">

      </div>
    </div>
  </div>
</template>
<script>
// import Vue from 'vue';
import { mapGetters, mapMutations } from 'vuex';
import CategoryCard from './_components/CategoryCard';
// import CategoryTree from './_components/CategoryTree';
import api from './_api/wordbank';

// Vue.component('category-tree', CategoryTree);

export default {
  path: 'wordbank-list',
  privCode: 'wordbank',
  displayNameKey: 'wordbank_list',
  icon: 'white_folder',
  api,
  components: {
    CategoryCard,
  },
  data() {
    return {
      wordbankKeyword: '',
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

#card-content {
  display: flex;
  flex-direction: column;
  #card-content-header {
    flex: 0 0 72px;
    padding: 20px;
    padding-bottom: 24px;
    border-bottom: 1px solid $color-borderline;
    display: flex;
    align-items: center;
    justify-content: space-between;

    #io-buttons {
      display: flex;
      justify-content: space-between;
      .text-button {
        margin: 0 5px;
      }
      :last-child {
        margin-right: 0px;
      }
    }
  }
  #card-content-content {
    flex: 1 1 auto;
    #toolbar {
      margin: 10px 20px;
      display: flex;
      .text-button {
        margin: 0 5px;
      }
      :first-child {
        margin-left: 0px;
      }
    }
  }
  #card-content-footer {
    border: 1px solid green;
    flex: 0 0 50px;
  }
}
</style>
