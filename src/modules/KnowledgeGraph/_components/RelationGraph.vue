<template>
  <div id="app">
    <!--创建一个echarts的容器-->
    <div id="echartContainer"></div>
  </div>
</template>

<script>
  import * as echarts from 'echarts';
  import { mapGetters } from 'vuex';
  import api from '../_api/knowledgeGraph';

  export default {
    api,
    name: 'RelationGraph',

    data() {
      return {
        categories: [],
        nodes: [],
        links: [],
        entitySet: [],
        entityNodeList: [],

        // currentCategories: [],
        currentNodes: [],
        currentLinks: [],
        currentEntitySet: [],
        currentEntityNodeList: [],

        forceGraph: '',

      };
    },
    computed: {
      ...mapGetters([
        'robotID',
      ]),
    },

    methods: {


      getCategorySelected(entity) {
        const selectEntity = this.entitySet.filter(item => item.name === entity)[0];
        return selectEntity.selected;
      },

      reGenerateGraphStructure() {
        return this.$api.getV3Data(this.robotID).then((data) => {
          let nodeIdx = 0;
          this.entityNodeList.forEach((entity) => {
            this.categories.push({
              name: entity,
              keyword: {},
              base: entity,
              selected: this.getCategorySelected(entity),
            });
            this.nodes.push({
              id: nodeIdx,
              itemStyle: null,
              name: entity,
              x: null,
              y: null,
              draggable: true,
              value: 20,
              symbolSize: 25,
              category: this.entityNodeList.indexOf(entity),
              attributes: {
                modularity_class: this.entityNodeList.indexOf(entity),
              },
              label: {
                normal: {
                  show: true,
                },
              },
            });
            nodeIdx += 1;
          });

          // console.log(this.nodes);

          data.data.result.forEach((newData) => {
            // console.log(newData);
            if (newData.endType === 'entity') {
              // console.log(newData);
              this.links.push({
                source: this.nodes.indexOf(this.nodes
                  .filter(item => newData.source === item.name
                    && this.entityNodeList.indexOf(newData.source) === item.category)[0]),
                target: this.nodes.indexOf(this.nodes
                  .filter(item => newData.target === item.name
                    && this.entityNodeList.indexOf(newData.target) === item.category)[0]),
                property: newData.property,
                label: {
                  show: true,
                  formatter: () =>
                    // console.log(obj);
                    newData.property,
                },
              });
            } else if (this.nodes.indexOf(this.nodes
              .filter(item => newData.target === item.name
                && this.entityNodeList.indexOf(newData.target) === item.category)[0]) === -1) {
              // case: normal property-value relationship
              if (newData.startType !== 'anonymousEntity') {
                // console.log(newData);
                const filterEntity = this.entitySet.filter(item => item.name === newData.source);
                if (filterEntity !== undefined
                  && filterEntity.length > 0
                  && filterEntity[0].expanded) {
                  const newNode = {
                    id: nodeIdx,
                    itemStyle: null,
                    name: newData.target,
                    x: null,
                    y: null,
                    draggable: true,
                    // symbolSize: 10,
                    value: 20,
                    symbolSize: 10,
                    category: this.entityNodeList.indexOf(newData.source),
                  };
                  if (newData.source === '摩根.弗里曼') {
                    console.log(newNode);
                  }

                  this.nodes.push(newNode);

                  nodeIdx += 1;
                  this.links.push({
                    source: this.nodes.indexOf(this.nodes
                      .filter(item => newData.source === item.name
                        && this.entityNodeList.indexOf(newData.source) === item.category)[0]),
                    target: this.nodes.indexOf(this.nodes
                      .filter(item => newData.target === item.name
                        && this.entityNodeList.indexOf(newData.source) === item.category)[0]),
                    property: newData.property,
                  });
                }
              } else {
                 // case anonymousEntity
                const anonyNameArray = newData.source.split('|');
                // const propertyName = anonyNameArray[anonyNameArray.length - 1];
                const entityName = anonyNameArray[0];
                const filterEntity = this.entitySet.filter(item => item.name === entityName);
                if (filterEntity !== undefined
                  && filterEntity.length > 0
                  && filterEntity[0].expanded) {
                  this.nodes.push({
                    id: nodeIdx,
                    itemStyle: null,
                    name: newData.target,
                    x: null,
                    y: null,
                    draggable: true,
                    value: 20,
                    symbolSize: 10,
                    category: this.entityNodeList.indexOf(entityName),
                  });

                  nodeIdx += 1;
                  const newLink = {
                    source: this.nodes.indexOf(this.nodes
                      .filter(item => newData.source === item.name
                        && this.entityNodeList.indexOf(entityName) === item.category)[0]),
                    target: this.nodes.indexOf(this.nodes
                      .filter(item => newData.target === item.name
                        && this.entityNodeList.indexOf(entityName) === item.category)[0]),
                    property: newData.property,
                  };
                  // console.log(newLink);
                  this.links.push(newLink);
                }
              }
            } else if (this.entitySet.filter(item => item.name === newData.source)[0].expanded) {
              this.links.push({
                source: this.nodes.indexOf(this.nodes
                  .filter(item => newData.source === item.name
                    && this.entityNodeList.indexOf(newData.source) === item.category)[0]),
                target: this.nodes.indexOf(this.nodes
                  .filter(item => newData.target === item.name
                    && this.entityNodeList.indexOf(newData.source) === item.category)[0]),
                property: newData.property,
              });
            }
          });
          // console.log(this.links);
          // this.currentCategories = this.categories;
          this.currentNodes = this.nodes;
          this.currentLinks = this.links;
          this.currentEntitySet = this.entitySet;
          this.currentEntityNodeList = this.entityNodeList;
          return new Promise((resolve) => {
            resolve();
          });
        });
      },

      initData() {
        return this.$api.getAllEntitiesByrobotId(this.robotID).then((res) => {
          if (res.data.entities !== null && res.data.entities.length > 0) {
            this.entityNodeList = res.data.entities.map(item => item.name);
            this.entitySet = this.entityNodeList.map((item, idx) => ({
              id: idx,
              name: item,
              expanded: false,
              selected: idx < 5,
            }));
          }
          return new Promise((resolve) => {
            resolve();
          });
        }).then(() =>
        // console.log('init call');
         this.reGenerateGraphStructure(),


        );
      },

      // showEntityRelation() {
      //   // this.currentCategories = this.entitySet.map(d => d.name);
      //   const list = this.currentCategories.map(d => d.name);
      //   this.currentNodes = this.nodes.filter(item => list.indexOf(item.name) !== -1);
      //   this.currentLinks = this
      // .links.filter(item => list.indexOf(this.entityNodeList[item.source]) !== -1
      //     && list.indexOf(this.entityNodeList[item.target]) !== -1);
      // },

      showDetailNodes(param) {
        console.log(param);
        if (param.dataType === 'node') {
          const nodeName = param.name;
          const selectedNode = this.entitySet.filter(item => item.name === nodeName)[0];
          const nodeIndex = this.entitySet.indexOf(selectedNode);
          if (selectedNode.expanded === true) {
            selectedNode.expanded = false;
          } else {
            selectedNode.expanded = true;
          }
          this.entitySet.splice(nodeIndex, 1, selectedNode);
          this.categories = [];
          this.nodes = [];
          this.links = [];
          // console.log('change call');
          this.reGenerateGraphStructure().then(() => {
            this.forceGraph.setOption(this.updateForceGraph());
          });
        }
      },

      updateForceGraph() {
        const list = this.categories.map(d => ({ name: d.name, selected: d.selected }));
        const selected = {};
        list.forEach((item) => {
          // console.log(item);
          // if (index < 5) {
          selected[item.name] = item.selected;
          // } else {
          //   const entity = this.entitySet.filter(e => e.name === item)[0];
          //   if (entity.expanded) {
          //     selected[item] = true;
          //   } else {
          //     selected[item] = false;
          //   }
          // }
        });

        // console.log(this.currentNodes);


        return {
          tooltip: {
            formatter: (res) => {
              // console.log(res);
              if (res.dataType === 'node') {
                return res.name;
              } else if (res.dataType === 'edge') {
                const edgeList = res.name.split('>');
                const selectedData = this.currentLinks
                  .filter(item => parseInt(edgeList[0], 10) === item.source
                    && parseInt(edgeList[1], 10) === item.target);
                if (selectedData.length > 0) {
                  return selectedData[0].property;
                }
                return '';
              }
              return res;
            },
          },
          legend: {
            type: 'scroll',
            // orient: 'vertical',
            // right: 10,
            // top: 20,
            // bottom: 20,
            data: list, // 此处的数据必须和关系网类别中name相对应
            selected,
          },
          animationDuration: 1500,
          animationEasingUpdate: 'quinticInOut',
          series: [{
            type: 'graph',
            layout: 'force',
            focusNodeAdjacency: true,
            roam: true,
            label: {
              normal: {
                // show: true,
                position: 'right',
              },
            },
            edgeSymbol: ['', 'arrow'],
            // draggable: true,
            data: this.currentNodes,
            // data: this.currentNodes.map((node, idx) => {
            //   node.id = idx;
            //   return node;
            // }),
            lineStyle: {
              color: 'source',
              curveness: 0.2,
            },
            emphasis: {
              lineStyle: {
                width: 4,
              },
            },
            itemStyle: {
              normal: {
                borderColor: '#fff',
                borderWidth: 1,
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.3)',
              },
            },
            categories: this.categories,
            force: {
              // edgeLength: 105, // 连线的长度
              // repulsion: 100,  // 子节点之间的间距


              edgeLength: 105,
              repulsion: 500,
              // gravity: 0.1,
              // gravity: 0.1,
            },
            links: this.currentLinks,
          }],
        };
      },

      handleCategoryChange(params) {
        // console.log(params);
        const selectedName = params.name;
        const selectedEntity = this.entitySet.filter(item => item.name === selectedName)[0];
        const selectedIndex = this.entitySet.indexOf(selectedEntity);
        selectedEntity.selected = !selectedEntity.selected;
        this.entitySet.splice(selectedIndex, 1, selectedEntity);
      },

      initForceGraph() {
        this.forceGraph = echarts.init(document.getElementById('echartContainer'), 'light');
        this.forceGraph.showLoading();
        this.forceGraph.setOption(this.updateForceGraph());
        this.forceGraph.on('click', (params) => {
          this.showDetailNodes(params);
        });
        this.forceGraph.on('legendselectchanged', (params) => {
          this.handleCategoryChange(params);
        });
        this.forceGraph.hideLoading();
        window.onresize = () => {
          this.forceGraph.resize();
        };
      },
    },

    mounted() {
      // const loadingInstance = this.$loading({ fullscreen: true });
      this.$emit('startLoading');
      this.initData()
        .then(() => {
          // this.showEntityRelation();
          this.initForceGraph();
          this.$emit('endLoading');
          // this.$nextTick(() => {
          //   loadingInstance.close();
          // });
        });
    },

  };
</script>



<style scoped>
  #app {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  #echartContainer {
    width: 80vw;
    height: 80vh;
  }

</style>
