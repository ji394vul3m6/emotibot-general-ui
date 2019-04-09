<template>
  <el-table-column type="expand">
    <template slot-scope="props">
      <div class="entity_form">
        <div class="row">
          <div class="row-text">{{ $t('knowledge_graph.property_edit.property_name') }}</div>
          <div class="row-text">{{ props.row.propertyName }}</div>
        </div>
        <div class="row">
          <div class="row-text">{{ $t('knowledge_graph.property_edit.property_type') }}</div>
          <div class="row-text">{{ props.row.propertyType }}</div>
          <div class="row-text">{{ $t('knowledge_graph.property_edit.property_value') }}</div>
          <div class="row-text">{{ props.row.propertyValue }}</div>
        </div>
        <div class="row">
          <div class="row-text">{{ $t('knowledge_graph.entity_edit.single_speech') }}</div>
          <div class="row-text">{{ props.row.singleSpeech }}</div>
        </div>
      </div>
    </template>
  </el-table-column>
</template>

<script>
  export default {
    name: 'ExpandColumn',
  };
</script>

<style lang="scss" scoped>
  .entity_form {
    color: #666666;
    padding: 0 25px;
    @include font-14px();
    &.admin {
      /*width: 820px;*/
      width: 60vw;
    }
    display: flex;
    flex-direction: column;
    .row {
      margin: 5px 0px;
      flex: 0 0 40px;
      max-height: 40px;
      display: flex;
      flex-direction: row;
      .row-text {
        margin: 0 8px 0 10px;
      }
    }

  }

</style>
