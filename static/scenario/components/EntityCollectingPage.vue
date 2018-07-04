<template lang="html">
<div id="entity-collecting-page" class="page entity-collecting-page">
  <div class="title-container">
    <div class="title">{{$t("entity_collecting_page.title")}}</div>
    <div class="title-description">{{$t("entity_collecting_page.description")}}</div>
  </div>
  <div class="hr"><hr/></div>
  <div class="entity-collector-container">
    <div class="order_column">{{$t("entity_collecting_page.order")}}</div>
    <div class="entity_name_column">{{$t("entity_collecting_page.entity_name")}}</div>
    <div class="entity_category_column">{{$t("entity_collecting_page.entity_category")}}</div>
    <div class="entity_type_column">{{$t("entity_collecting_page.entity_type")}}</div>
    <div class="prompt_column">{{$t("entity_collecting_page.prompt")}}</div>
  </div>
  <div v-for="(entityCollector, index) in entityCollectorList" :key="entityCollector.id">
    <entity-collector
      :order="getOrder(index, entityCollectorList.length)"
      :initialEntityCollector="entityCollector"
      :initialCategoryToNerTypeMap="categoryToNerTypeMap"
      @deleteEntityCollectorButtonClick="deleteEntityCollector(index)"
      @moveUp="moveUp(index)"
      @moveDown="moveDown(index)"
      @updateData="updateData(index, $event)"
      @addCustomNer="addCustomNer"
      @deleteCustomNer="deleteCustomNer"
    ></entity-collector>
  </div>
  <button class="btn-basic add-new-entity-button"
      @click="addNewEntityCollector"
    >{{$t("entity_collecting_page.add_new_entity_collector")}}</button>
  <div class="bottom-container">
    <button class="btn-basic edit-entity-relation-button"
        @click="editEntityRelation"
      >{{$t("entity_collecting_page.edit_entity_relation")}}</button>
    <button class="btn-basic edit-sentence-replacement-button"
        @click="editSentenceReplacement"
      >{{$t("entity_collecting_page.edit_sentence_replacement")}}</button>
    <button class="btn-basic edit-tde-setting-button"
        @click="editTDESetting"
      >{{$t("entity_collecting_page.edit_tde_setting")}}</button>
  </div>
</div>
</template>

<script>
import EntityCollector from './EntityCollector.vue';
import EntityRelationEditPop from './EntityRelationEditPop.vue';
import SentenceReplacementEditorPop from './SentenceReplacementEditorPop.vue';
import TDESettingEditorPop from './TDESettingEditorPop.vue';
import i18nUtils from '../utils/i18nUtil';
import general from '../utils/general';

export default {
  name: 'entity-collecting-page',
  components: {
    'entity-collector': EntityCollector
  },
  props: {
    initialEntityCollectorList: {
      type: Array,
      required: true,
    },
    initialIdToNerMap: {
      type: Object,
      required: true,
    },
    initialRelatedEntities: {
      type: Object,
      required: true,
    },
    initialREParsers: {
      type: Array,
      required: true,
    },
    initialTDESetting: {
      type: Object,
      required: true,
    }
  },
  data () {
    return {
      i18n: {},
      entityCollectorList: [],
      idToNerMap: {},
      categoryToNerTypeMap: {},
      relatedEntities: {
        relatedEntityCollectorList: [],
        relatedEntityMatrix: []
      },
      re_parsers: [],
      tde_setting: {}
    }
  },
  computed: {},
  watch: {
    entityCollectorList() {
      this.$emit('update', this.entityCollectorList);
    }
  },
  methods: {
    propEntityCollectorList(newList) {
      this.entityCollectorList = JSON.parse(JSON.stringify(this.newList));
    },
    addCustomNer(customNer){
      this.idToNerMap[customNer.id] = customNer;
      this.$emit('updateIdToNerMap', this.idToNerMap);
      this.updateCategoryToNerTypeMap(this.idToNerMap);
    },
    deleteCustomNer(customNer){
      delete this.idToNerMap[customNer.id];
      this.$emit('updateIdToNerMap', this.idToNerMap);
      this.updateCategoryToNerTypeMap(this.idToNerMap);
    },
    updateCategoryToNerTypeMap(idToNerMap){
      this.categoryToNerTypeMap = {
        '通用实体类别':[
          {
            "entityCategory": "通用实体类别",
            "entityType": "时间日期",
            "sourceType": "system",
            "slotType": "time"
          },
          {
            "entityCategory": "通用实体类别",
            "entityType": "时间日期(粒度-分)(未来时间)",
            "sourceType": "system",
            "slotType": "time-minute-future"
          },
          {
            "entityCategory": "通用实体类别",
            "entityType": "时间日期(粒度-时)(未来时间)",
            "sourceType": "system",
            "slotType": "time-hour-future"
          },
          {
            "entityCategory": "通用实体类别",
            "entityType": "整数",
            "sourceType": "system",
            "slotType": "integer"
          },
          {
            "entityCategory": "通用实体类别",
            "entityType": "人数",
            "sourceType": "system",
            "slotType": "person-number"
          },
          {
            "entityCategory": "通用实体类别",
            "entityType": "姓氏",
            "sourceType": "system",
            "slotType": "last-name"
          },
          {
            "entityCategory": "通用实体类别",
            "entityType": "电子邮件",
            "sourceType": "system",
            "slotType": "email"
          },
          {
            "entityCategory": "通用实体类别",
            "entityType": "大陆固定电话号码",
            "sourceType": "system",
            "slotType": "telephone-number"
          },
          {
            "entityCategory": "通用实体类别",
            "entityType": "大陆手机号码",
            "sourceType": "system",
            "slotType": "mobile-mainland"
          },
          {
            "entityCategory": "通用实体类别",
            "entityType": "大陆固定电话号码+手机号码",
            "sourceType": "system",
            "slotType": "phone-mainland"
          },
          {
            "entityCategory": "通用实体类别",
            "entityType": "台湾固定电话号码+手机号码",
            "sourceType": "system",
            "slotType": "phone-taiwan"
          },
          {
            "entityCategory": "通用实体类别",
            "entityType": "是否",
            "sourceType": "system",
            "slotType": "binary"
          },
          {
            "entityCategory": "通用实体类别",
            "entityType": "车牌号码",
            "sourceType": "system",
            "slotType": "car-plate"
          },
        ],
        '餐饮实体类别':[
          {
            "entityCategory": "餐饮实体类别",
            "entityType": "包厢还是大堂",
            "sourceType": "system",
            "slotType": "room-type"
          },
          {
            "entityCategory": "餐饮实体类别",
            "entityType": "宝宝椅",
            "sourceType": "system",
            "slotType": "baby-chair"
          },
          {
            "entityCategory": "餐饮实体类别",
            "entityType": "是否排号",
            "sourceType": "system",
            "slotType": "take-ticket"
          },
          {
            "entityCategory": "餐饮实体类别",
            "entityType": "特殊需求",
            "sourceType": "system",
            "slotType": "other-require"
          },
        ],
        '金融实体类别':[
          {
            "entityCategory": "金融实体类别",
            "entityType": "信用卡号",
            "sourceType": "system",
            "slotType": "bank-card"
          },
          {
            "entityCategory": "金融实体类别",
            "entityType": "金钱",
            "sourceType": "system",
            "slotType": "money"
          },
        ]
      };
      Object.keys(this.idToNerMap).map((id) => {
        const ner = this.idToNerMap[id];
        const category = ner.entityCategory;
        if (this.categoryToNerTypeMap[category] === undefined){
          this.categoryToNerTypeMap[category] = [ner];
        }else{
          this.categoryToNerTypeMap[category].push(ner);
        }
      });
    },
    updateData(index, newEntityCollector){
      this.entityCollectorList[index] = JSON.parse(JSON.stringify(newEntityCollector));
      this.$emit('update', this.entityCollectorList);
    },
    moveUp(index){
      let tmp = this.entityCollectorList[index-1];
      this.entityCollectorList[index-1] = this.entityCollectorList[index];
      this.entityCollectorList[index] = tmp;
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    },
    moveDown(index){
      let tmp = this.entityCollectorList[index+1];
      this.entityCollectorList[index+1] = this.entityCollectorList[index];
      this.entityCollectorList[index] = tmp;
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    },
    getOrder(index, length){
      if(index === 0 && index === length-1){
        return "single";
      } else if (index === 0){
        return "start";
      } else if (index === length-1){
        return "end";
      } else {
        return "mid";
      }
    },
    editEntityRelation(){
      const customEntityCollectorList = this.entityCollectorList.filter( collector => collector.ner.sourceType === "custom");
      if(customEntityCollectorList.length < 2){
        general.popErrorWindow(this,
          this.i18n.error_msg.custom_entity_list_length_must_greater_than_two,
          '',
          '30%',
          '10%',
        );
      }else{
        const options = {
          component: EntityRelationEditPop,
          buttons: ['ok', 'cancel'],
          validate: true,
          customPopContentStyle: {
            width: "70%",
            height: "70%",
          },
          data: {
            customEntityCollectorList: customEntityCollectorList,
            relatedEntityCollectorList: this.relatedEntities.relatedEntityCollectorList,
            relatedEntityMatrix: this.relatedEntities.relatedEntityMatrix
          },
          callback: {
            ok: (rtnObj) => {
              this.relatedEntities.relatedEntityCollectorList = rtnObj.relatedEntityCollectorList;
              this.relatedEntities.relatedEntityMatrix = rtnObj.relatedEntityMatrix;
              this.$emit('updateRelatedEntities', this.relatedEntities);
            },
          },
        };
        this.$root.$emit('showWindow', options);
      }
    },
    editSentenceReplacement(){
      const options = {
        component: SentenceReplacementEditorPop,
        buttons: ['ok', 'cancel'],
        validate: true,
        customPopContentStyle: {
          width: "70%",
          height: "70%",
        },
        data: {
          re_parsers: this.re_parsers
        },
        callback: {
          ok: (re_parsers) => {
            this.$emit('updateREParsers', re_parsers);
            this.re_parsers = re_parsers;
          },
        },
      };
      this.$root.$emit('showWindow', options);
    },
    editTDESetting(){
      const options = {
        component: TDESettingEditorPop,
        buttons: ['ok', 'cancel'],
        validate: true,
        customPopContentStyle: {
          width: "70%",
          height: "70%",
        },
        data: {
          tde_setting: this.tde_setting
        },
        callback: {
          ok: (tde_setting) => {
            this.$emit('updateTDESetting', tde_setting);
            this.tde_setting = tde_setting;
          },
        },
      };
      this.$root.$emit('showWindow', options);
    },
    addNewEntityCollector(){
      this.entityCollectorList.push({
        id: this.$uuid.v1(),
        entityName: null,
        entityCategory: '通用实体类别',
        ner: {
                "entityCategory": "通用实体类别",
                "entityType": "时间日期",
                "sourceType": "system",
                "slotType": "time"
             },
        prompt: null,
        must_retry: true,
        retry_num: 3,
        required: true
      })
    },
    deleteEntityCollector(index) {
      this.entityCollectorList.splice(index, 1);
    },
    rerender(){
      this.entityCollectorList = JSON.parse(JSON.stringify(this.initialEntityCollectorList));
      this.idToNerMap = JSON.parse(JSON.stringify(this.initialIdToNerMap));
      this.relatedEntities = JSON.parse(JSON.stringify(this.initialRelatedEntities));
      this.re_parsers = JSON.parse(JSON.stringify(this.initialREParsers));
      this.tde_setting = JSON.parse(JSON.stringify(this.initialTDESetting));
      this.updateCategoryToNerTypeMap(this.idToNerMap);
    },
  },
  beforeMount() {},
  mounted() {
    this.i18n = i18nUtils.getLocaleMsgs(this.$i18n);
    this.$on('rerender', this.rerender);
  },
  activated() {
    this.rerender();
  },
}
</script>

<style lang="scss">
$text-color: #5E5E5E;
$text-hightlight-color: #004D7F;

.entity-collecting-page{
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  color: $text-color;
  overflow: auto;
  .clickable{
    cursor: pointer; 
  }
  .title-container{
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: $text-hightlight-color;
    padding: 10px;
    .title{
      font-size: 30px;
      margin: 10px;
      width: 100%;
      min-width: 400px;
      text-align: center;
    }
    .title-description{
      font-size: 14px;
      margin: 10px;
      width: 50%;
      min-width: 500px;
      text-align: center;
    }
  }
  .hr{
    flex: 0 0 auto;
    hr {
      border:1px solid $text-color;
    }
  }
  .entity-collector-container{
    flex: 0 0 auto;
    border: 1px solid #e4eaec;
    line-height: 50px;
    min-width: 936px;
    width: 100%;
    display:flex;
    flex-direction: row;
    a{
      text-decoration: none;
    }
    .order_column{
      flex:0.2;
      display:flex;
      flex-direction: row;
    }
    .entity_name_column{
      flex:1;
      display:flex;
      flex-direction: row;
    }
    .entity_category_column{
      flex:1;
      display:flex;
      flex-direction: row;
      align-items: center;
      .entity_category_select{
        min-width: 150px;
      }
    }
    .entity_type_column{
      flex:2;
      display:flex;
      flex-direction: row;
      align-items: center;
      .entity_type_select{
        min-width: 150px;
      }
    }
    .prompt_column{
      flex:1;
      display:flex;
      flex-direction: row;
    }
    input{
      font-size: 16px;
    }

    .full_width{
      width:100%;
    }
    .no_border{
      border:none;
    }
    .order{
      display:flex;
    }
    .delete-entity-collector-button{
      width: 10px;
      display:inline-block;
    }
  }
  .add-new-entity-button{
    flex: 0 0 auto;
  }
  .bottom-container{
    flex: 0 0 auto;
    margin-top: auto;
    display:flex;
    flex-direction: row;
    .edit-entity-relation-button{
      width: 300px;
    }
    .edit-sentence-replacement-button{
      width: 300px;
    }
    .edit-tde-setting-button{
      width: 300px;
    }
  }
}
</style>