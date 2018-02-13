<template>
  <table class="general-table">
    <thead>
      <tr class="table-header">
        <td v-if="checkBox" class="check-container"></td>
        <td v-for="header in headerInfo" :key="header.text">
            {{ header.text }}
        </td>
      </tr>
    </thead>
    <tbody>
      <tr class="table-content" v-for="(content, idx) in contents" :key="idx">
        <td v-if="checkBox" class="check-container">
          <input v-if="checkMethod(content)" type="checkbox"/>
        </td>
        <td v-for="header in headerInfo" :class="getClassObj(header)" :style="{width: header.width}" :key="header.text">
          <template v-if="header.type === 'clickable-text'">
            <a v-on:click="header.callback(content)">{{ content[header.key] }}</a>
          </template>
          <template v-if="header.type === 'text'">
            {{ content[header.key] }}
          </template>
          <template v-if="header.type === 'raw-text'">
            <pre>{{ content[header.key] }}</pre>
          </template>
          <template v-else-if="header.type === 'buttons'">
            <div v-for="button in content[header.key].button" :key="button.text" class="text-button auto-size" :class="{primary: button.primary}" v-on:click="button.callback(idx)">
              {{ button.text }}
            </div>
            <div v-if="!content[header.key].button">
              {{ content[header.key].info }}
            </div>
          </template> 
          <template v-else-if="header.type === 'map-text'">
          {{ header.map[content[header.key]] }}
          </template>
        </td>
      </tr>
      <tr v-if="contents.length <= 0">
        <td v-if="checkBox" :colspan="headerInfo.length + 1" class="table-content-empty-row test">
          {{ $t('error_msg.empty_data') }}
        </td>
        <td v-else :colspan="headerInfo.length" class="table-content-empty-row">
          {{ $t('error_msg.empty_data') }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: {
    headerInfo: {
      type: Array,
      required: true,
      default() {
        return [];
      },
    },
    contents: {
      type: Array,
      required: true,
      default() {
        return [];
      },
    },
    checkBox: {
      type: Boolean,
      required: false,
      default: false,
    },
    checkMethod: {
      type: Function,
      required: false,
      default() {
        return () => true;
      },
    },
  },
  methods: {
    getClassObj(header) {
      const ret = {
        wrap: header.wrap,
      };
      ret[header.type] = true;
      return ret;
    },
  },
};
</script>