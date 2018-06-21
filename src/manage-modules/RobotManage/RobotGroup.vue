<template>
  <div>
    <div class="card w-fill h-fill">
      <nav-bar :options="pageOption"></nav-bar>
      <div class="back-button">
        <text-button @click="goRobotList">{{ $t('management.go_back') }}</text-button>
      </div>
      <div class="page">
        <command-row class="commands" @search="keywordChange">
          <text-button button-type="primary" @click="popGroupEditor()">{{ $t('management.create_group') }}</text-button>
        </command-row>
        <div class="group-list">
          <div v-for="group in filteredGroup" :key="group.id" class="group-card">
            <div class="card-title">
              <div class="card-title-text">
                {{ group.name }}
              </div>
              <div class="card-title-edit" @click="popGroupEditor(group)">
                <icon :size=12 icon-type="edit_blue"></icon>
              </div>
            </div>
            <div class="card-content">
              <div v-for="app in group.apps" :key="app.id" class="robot-name">
                {{ app.name }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import NavBar from '@/components/NavigationBar';
import CommandRow from '../_components/CommandRow';
import GroupAddForm from './_components/GroupAddForm';
import GroupAPI from '../_api/group';
import AppAPI from '../_api/robot';

export default {
  path: 'robot-group',
  name: 'robot-group',
  api: [GroupAPI, AppAPI],
  data() {
    return {
      pageOption: {
        robotGroup: this.$t('management.group_manage'),
      },
      robotGroups: [],
      keyword: '',
    };
  },
  components: {
    NavBar,
    CommandRow,
  },
  computed: {
    ...mapGetters([
      'enterpriseID',
    ]),
    filteredGroup() {
      if (this.keyword === '') {
        return this.robotGroups;
      }
      return this.robotGroups.filter(group => group.name.indexOf(this.keyword) >= 0);
    },
  },
  methods: {
    keywordChange(word) {
      this.keyword = word;
    },
    goRobotList() {
      this.$router.push('/manage/robot-manage');
    },
    getRobotsAndGroups() {
      const that = this;

      let robots = [];
      let groups = [];
      return that.$api.getRobots(that.enterpriseID)
      .then((data) => {
        robots = data;
      })
      .then(() => that.$api.getRobotGroups(that.enterpriseID))
      .then((data) => {
        groups = data;
      })
      .then(() => ({
        groups,
        robots,
      }));
    },
    popGroupEditor(group) {
      const that = this;

      that.$emit('startLoading');
      that.getRobotsAndGroups()
      .then((data) => {
        that.$pop({
          title: that.$t('management.create_group'),
          component: GroupAddForm,
          validate: true,
          extData: {
            robots: data.robots,
            groups: data.groups.map(g => g.name),
            group,
          },
          callback: {
            ok(retData) {
              that.$emit('startLoading');
              let promise;
              if (group === undefined) {
                promise = that.$api.addRobotGroup(that.enterpriseID, retData);
              } else {
                promise = that.$api.updateRobotGroup(that.enterpriseID, group.id, retData);
              }
              promise.finally(() => {
                that.loadGroup();
                that.$emit('endLoading');
              });
            },
          },
        });
      })
      .finally(() => {
        that.$emit('endLoading');
      });
    },
    loadGroup() {
      const that = this;
      that.$emit('startLoading');
      that.$api.getRobotGroups(that.enterpriseID).then((groups) => {
        that.robotGroups = groups;
      })
      .finally(() => {
        that.$emit('endLoading');
      });
    },
  },
  mounted() {
    this.loadGroup();
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';

.card {
  display: flex;
  flex-direction: column;
  position: relative;
  .back-button {
    position: absolute;
    right: 20px;
    top: 20px;
  }

  .nav-bar {
    flex: 0 0 60px;
  }
  .page {
    flex: 1;
  }
}
.page {
  display: flex;
  flex-direction: column;
  .commands {
    flex: 0 0 auto;
  }
  .group-list {
    flex: 1;
    padding: 20px;
    padding-bottom: 0;
    @include auto-overflow();
    @include customScrollbar();

    display: flex;
    flex-wrap: wrap;
    .group-card {
      flex: 0 0 274px;
      height: 180px;
      margin-right: 30px;
      margin-bottom: 30px;
      border-radius: 4px;
      border: solid 1px #e9e9e9;

      &:hover {
        box-shadow: 0 0 14px 0 rgba(0, 0, 0, 0.2);
        .card-title {
          .card-title-edit {
            visibility: visible;
          }
        }
      }

      display: flex;
      flex-direction: column;
      .card-title {
        flex: 0 0 auto;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        background-color: #ffffff;
        border-bottom: solid 1px #e9e9e9;
        font-size: 16px;
        line-height: 24px;
        padding: 10px;

        display: flex;
        align-items: center;
        .card-title-text {
          flex: 1;
        }
        .card-title-edit {
          flex: 0 0 24px;
          height: 24px;
          visibility: hidden;
          @include click-button();

          display: flex;
          align-items: center;
          justify-content: center;
          &:hover {
            background-color: #f7f7f7;
            border-radius: 12px;
          }
        }
      }
      .card-content {
        flex: 1;
        padding: 20px 10px;
        @include auto-overflow();
        @include customScrollbar();

        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
        & > div {
          flex: 0 0 auto;
          margin-right: 20px;
          max-width: 150px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style>
