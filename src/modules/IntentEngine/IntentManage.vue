<template>
<div id="intent-manage">
  <div id="intent-manage-card" class="card w-fill h-fill">
    <div class="header">
      <div class="header-title">
        {{ $t('pages.intent_engine.intent_manage') }}
      </div>
      <div class="right-align-header">
        <search-input v-model="searchKeyword" @focus="inSearchIntentMode"></search-input>
        <text-button @click="toPage('')">train</text-button>
      </div>
    </div>
    <div class="tab-container">
      <router-view
        :searchKeyword=searchKeyword
        :searchIntentMode=searchIntentMode
      ></router-view>
    </div>
  </div>
</div>
</template>
<script>

const IntentTrainTab = () => import('./_components/IntentTrainTab');
const IntentTestTab = () => import('./_components/IntentTestTab');
const IntentTestRecords = () => import('./_components/IntentTestRecords');

export default {
  path: 'intent-manage',
  privCode: 'intent_manage',
  displayNameKey: 'intent_manage',
  name: 'intent-manage',
  components: {},
  childrenPath: [
    { path: '', component: IntentTrainTab },
    { path: 'test', component: IntentTestTab },
    { path: 'test/records', component: IntentTestRecords },
  ],
  data() {
    return {
      searchKeyword: '',
      searchIntentMode: false,
    };
  },
  computed: {},
  watch: {},
  methods: {
    toPage(path) {
      this.$router.push(`/intent-manage/${path}`);
    },
    inSearchIntentMode(bool) {
      this.searchIntentMode = bool;
    },
  },
};
</script>

<style lang="scss" scoped>
#intent-manage{
  #intent-manage-card {
    display: flex;
    flex-direction: column;
    .header {
      height: 60px;
      padding: 0 20px;
      border-bottom: 1px solid $color-borderline-disabled;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .header-title {
        @include font-16px();
        color: $color-font-active;
        min-width: 64px;
      }
    }
    .tab-container{
      flex: 1 1 auto;
      display: flex;
      flex-direction: column;
      min-width: 336px;
    }
  }
}
</style>
