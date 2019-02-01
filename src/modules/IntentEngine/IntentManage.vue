<template>
<div id="intent-manage">
  <router-view></router-view>
</div>
</template>
<script>

const IntentTrainPage = () => import('./_components/IntentTrainPage');
const IntentTestPage = () => import('./_components/IntentTestPage');
const IntentTestRecordListPage = () => import('./_components/IntentTestRecordListPage');
const IntentTestRecordPage = () => import('./_components/IntentTestRecordPage');

export default {
  path: 'intent-manage',
  privCode: 'intent_manage',
  displayNameKey: 'intent_manage',
  name: 'intent-manage',
  components: {},
  childrenPath: [
    { path: '', component: IntentTrainPage },
    { path: 'test', component: IntentTestPage },
    { path: 'test/records', component: IntentTestRecordListPage },
    { path: 'test/record/:id', component: IntentTestRecordPage },
  ],
  data() {
    return {
    };
  },
  computed: {},
  watch: {},
  methods: {},
};
</script>

<style lang="scss" scoped>
// #intent-manage{
//   overflow-x: scroll;
//   overflow-y: scroll;
//   @include customScrollbar();
// }
</style>
