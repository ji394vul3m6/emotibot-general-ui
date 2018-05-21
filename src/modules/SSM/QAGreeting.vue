<template>
  <basic-page>
  </basic-page>
</template>
<script>
export default {
  path: 'qa_greeting',
  privCode: 'qa_greeting',
  displayNameKey: 'qa_greeting',
  icon: 'white_SQ',
  name: 'qa-greeting',
};
</script>
<style lang="scss" scoped>
@import "styles/variable";
.tool-bar {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  .path-info {
    display: flex;
    align-items: center;
    span {
      margin-right: 0.5em;
    }
    .icon {
      margin-top: -5px;
    }
    .path-unit {
      cursor: pointer;
    }
  }
}
.greeting-list {
  line-height: $default-line-height;
  display: flex;
  flex-direction: column;
  .wordbank-entry {
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding: 10px;
    cursor: pointer;
    border-bottom: 1px solid $table-border-color;

    &:hover {
      background: $table-body-hover-background;
    }
    .wordbank-name {
      flex: 1;
    }
    .wordbank-icon {
      flex: 0 0 30px;
    }
  }
}
</style>
