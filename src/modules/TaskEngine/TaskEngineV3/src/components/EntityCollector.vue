<template lang="html">
  <div id="entity-collector" class="entity-collector-container">
    <div class="order_column">
      <div class="order clickable" @click="moveUp" v-if="order !== 'start' && order !== 'single'">▲</div>
      <div class="order clickable" @click="moveDown" v-if="order !== 'end' && order !== 'single'">▼</div>
    </div>
    <div class="entity_name_column">
      <input class="no_border full_width" type="text" name="entity_name" 
        :placeholder="$t('task_engine_v3.entity_collecting_page.entity_name_placeholder')"
        v-model="entityCollector.entityName"
        @input="updateData"
      >
    </div>
    <div class="entity_category_column">
      <v-select
        class="entity_category_select"
        :value="entityCollector.entityCategory"
        :onChange="changeEntityCategory"
        :options="Object.keys(categoryToNerTypeMap)"
      >
      </v-select>
    </div>
    <div class="entity_type_column">
      <v-select
        class="entity_type_select"
        :value="entityCollector.ner"
        :onChange="changeNER"
        :options="categoryToNerTypeMap[entityCollector.entityCategory]"
        label="entityType"
      >
      </v-select>
      <input type="button" class="btn-basic" @click="addCustomEntityType" :value="$t('general.add')">
      <input type="button" class="btn-basic" @click="editCustomEntityType" :value="$t('general.modify')" v-if="entityCollector.ner !== undefined && entityCollector.ner.sourceType === 'custom'">
      <input type="button" class="btn-basic" @click="deleteCustomEntityType" :value="$t('general.delete')" v-if="entityCollector.ner !== undefined && entityCollector.ner.sourceType === 'custom'">
    </div>
    <div class="prompt_column">
      <input class="no_border full_width" type="text" name="prompt" 
        :placeholder="$t('task_engine_v3.entity_collecting_page.prompt_placeholder')"
        v-model="entityCollector.prompt"
        @input="updateData"
      >
      <div class="clickable" @click="editPrompt">&#x2699;</div>
    </div>
    <div class="delete-entity-collector-button clickable" @click="deleteThisEntityCollector">X</div>
  </div>
</template>

<script>
import CustomEntityTypeEditorPop from './CustomEntityTypeEditorPop';
import PromptEditorPop from './PromptEditorPop';

export default {
  name: 'entity-collector',
  components: {},
  props: {
    initialEntityCollector: {
      type: Object,
      required: true,
    },
    order: {
      type: String,
      required: true,
    },
    initialCategoryToNerTypeMap: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      entityCollector: {},
      categoryToNerTypeMap: {},
    };
  },
  computed: {},
  watch: {},
  methods: {
    hasNER(nerList, ner) {
      if (ner === undefined) { return false; }
      for (let i = 0; i < nerList.length; i += 1) {
        if (nerList[i].entityCategory === ner.entityCategory &&
           nerList[i].entityType === ner.entityType &&
           nerList[i].sourceType === ner.sourceType &&
           nerList[i].slotType === ner.slotType
          ) { return true; }
      }
      return false;
    },
    changeNER(val) {
      // workaround for selecting the same option bug of v-select
      if (val === null) {
        const oldVal = this.entityCollector.ner;
        this.entityCollector.ner = undefined;
        this.$nextTick(() => {
          this.entityCollector.ner = oldVal;
        });
        return;
      }
      // update NER
      this.entityCollector.ner = val;
      this.updateData();
    },
    changeEntityCategory(val) {
      // workaround for selecting the same option bug of v-select
      if (val === null) {
        const oldVal = this.entityCollector.entityCategory;
        this.entityCollector.entityCategory = null;
        this.$nextTick(() => {
          this.entityCollector.entityCategory = oldVal;
        });
        return;
      }
      // update entityCategory and NER
      this.entityCollector.entityCategory = val;
      if (this.categoryToNerTypeMap[val]) {
        if (!this.hasNER(this.categoryToNerTypeMap[val], this.entityCollector.ner)) {
          this.entityCollector.ner = this.categoryToNerTypeMap[val][0];
        } // else: NER remain the same.
      } else {
        this.entityCollector.ner = undefined;
      }
      this.updateData();
    },
    deleteCustomEntityType() {
      this.$emit('deleteCustomNer', this.entityCollector.ner);
      this.entityCollector.ner = this.categoryToNerTypeMap[this.entityCollector.entityCategory][0];
      this.$nextTick(() => {
        this.categoryToNerTypeMap = JSON.parse(JSON.stringify(this.initialCategoryToNerTypeMap));
      });
    },
    editCustomEntityType() {
      const options = {
        component: CustomEntityTypeEditorPop,
        buttons: ['ok', 'cancel'],
        validate: true,
        customPopContentStyle: {
          width: '70%',
          height: '70%',
        },
        data: {
          customEntity: this.entityCollector.ner,
          nerCategoryList: Object.keys(this.categoryToNerTypeMap),
        },
        callback: {
          ok: (ner) => {
            this.$emit('addCustomNer', ner);
            this.$nextTick(() => {
              this.categoryToNerTypeMap =
                JSON.parse(JSON.stringify(this.initialCategoryToNerTypeMap));
            });
            this.entityCollector.ner = ner;
          },
        },
      };
      this.$root.$emit('showWindow', options);
    },
    addCustomEntityType() {
      const options = {
        component: CustomEntityTypeEditorPop,
        buttons: ['ok', 'cancel'],
        validate: true,
        customPopContentStyle: {
          width: '70%',
          height: '70%',
        },
        data: {
          customEntity: {
            id: this.$uuid.v1(),
            entityType: null,
            entityTypeDescription: null,
            entityCategory: this.entityCollector.entityCategory,
            entitySynonymsList: [],
            sourceType: 'custom',
            slotType: 'pText',
          },
          nerCategoryList: Object.keys(this.categoryToNerTypeMap),
        },
        callback: {
          ok: (ner) => {
            this.$emit('addCustomNer', ner);
            this.$nextTick(() => {
              this.categoryToNerTypeMap =
                JSON.parse(JSON.stringify(this.initialCategoryToNerTypeMap));
            });
            this.entityCollector.ner = ner;
          },
        },
      };
      this.$root.$emit('showWindow', options);
    },
    editPrompt() {
      const options = {
        component: PromptEditorPop,
        buttons: ['ok', 'cancel'],
        validate: true,
        customPopContentStyle: {
          width: '70%',
          height: '250px',
          'min-width': '400px',
        },
        data: {
          must_retry: this.entityCollector.must_retry,
          retry_num: this.entityCollector.retry_num,
          required: this.entityCollector.required,
        },
        callback: {
          ok: (response) => {
            this.entityCollector.must_retry = response.must_retry;
            this.entityCollector.retry_num = response.retry_num;
            this.entityCollector.required = response.required;
            this.updateData();
          },
        },
      };
      this.$root.$emit('showWindow', options);
    },
    moveUp() {
      this.$emit('moveUp');
    },
    moveDown() {
      this.$emit('moveDown');
    },
    updateData() {
      this.$emit('updateData', this.entityCollector);
    },
    deleteThisEntityCollector() {
      this.$emit('deleteEntityCollectorButtonClick');
    },
  },
  beforeMount() {},
  mounted() {
    this.entityCollector = JSON.parse(JSON.stringify(this.initialEntityCollector));
    this.categoryToNerTypeMap = JSON.parse(JSON.stringify(this.initialCategoryToNerTypeMap));
  },
};
</script>

<style lang="scss" scoped>
@import "../scss/teVariable.scss";
@import "../scss/entityCollectingPage.scss";
</style>
