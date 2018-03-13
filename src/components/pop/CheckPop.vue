<template>
  <div>
    <div>
      {{ value.msg }}
    </div>
    <br>
    <div>
      <pre>
        {{ value.info }}
      </pre>
    </div>
  </div>  
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default() {
        return {};
      },
    },
  },
};
</script>