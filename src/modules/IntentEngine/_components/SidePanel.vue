<template>
<div id="side-panel">
  <div class="title margin-bottom">
    {{$t('intent_engine.side_bar.intent_train')}}
  </div>
  <div class="info margin-bottom">
    {{$t('intent_engine.side_bar.intent_train_info')}}
  </div>
  <text-button class="button margin-bottom" :height="'40px'">
    {{$t('intent_engine.side_bar.do_train')}}
  </text-button>
  <div class="records" style="margin-bottom: 20px;">
    <div class="record">
      {{$t('intent_engine.side_bar.last_success_train')}}
    </div>
    <div class="record">
      {{$t('intent_engine.side_bar.success_train_record')}}
    </div>
    <div class="link">
      {{$t('intent_engine.side_bar.show_train_records')}}
    </div>
    <div class="link">
      {{$t('intent_engine.side_bar.hide_train_records')}}
    </div>
  </div>
  <div class="title" style="margin-bottom: 20px;">
    {{$t('intent_engine.side_bar.intent_test')}}
  </div>
  <div class="info margin-bottom">
    {{$t('intent_engine.side_bar.intent_test_info')}}
  </div>
  <div class="hint">
    {{$t('intent_engine.side_bar.edit_intent_test_corpus_hint')}}
  </div>
  <text-button class="button" style="margin-bottom: 30px;" :height="'40px'" @click="toPage('test')">
    {{$t('intent_engine.side_bar.go_to_intent_test')}}
  </text-button>
  <div class="info margin-bottom" >
    {{$t('intent_engine.side_bar.do_intent_test_info')}}
  </div>
  <text-button class="button margin-bottom" :height="'40px'">
    {{$t('intent_engine.side_bar.do_test')}}
  </text-button>
  <div class="link" @click="toPage('test/records')">
    {{$t('intent_engine.side_bar.go_to_intent_test_records')}}
  </div>
</div>
</template>
<script>
// tooltip: {
//   intent_and_corpus_unchanged: '無新增任何意圖或語料',
//   intent_test_is_empty: '意圖測試集為空請先編輯',
// },
export default {
  name: 'side-panel',
  components: {},
  props: {
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  methods: {
    toPage(path) {
      this.$router.push(`/intent-manage/${path}`);
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
#side-panel{
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  width: 270px;
  height: 100%;
  border-left: 1px solid $color-borderline-disabled;
  padding: 20px 17px 20px 25px;
  overflow-y: scroll;
  @include customScrollbar();
  .title{
    @include font-16px-line-height-28px();
  }
  .info{
    @include font-14px();
  }
  .button{
    @include font-14px-line-height-28px();
    cursor: pointer;
  }
  .record{
    @include font-12px-line-height-28px();
    color: $color-font-mark;
  }
  .link{
    @include font-12px-line-height-28px();
    cursor: pointer;
    color: $app-active-color;
  }
  .hint{
    @include font-12px-line-height-28px();
    color: $color-warning; 
  }
  .margin-bottom{
    margin-bottom: 10px;
  }
}
</style>
