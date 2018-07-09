<template>
  <div>
    <div class="card h-fill w-fill">
      <nav-bar class='nav-bar' :options=pageOption></nav-bar>
      <div class="page">
        <command-row class="commands" @search="doSearch">
            <template v-if="isAdmin">
            <text-button button-type="primary"
            @click="addEnterprise">{{ $t('management.create_enterprise') }}</text-button>
            </template>
        </command-row>
        <div class="enterprise-list">
          <div class="enterprise-card" 
            v-for="enterprise in filteredEnterprise" :key="enterprise.id"
            @click="goEnterprise(enterprise)">
            <div class="card-title">
              <div class="card-title-text">
                {{ enterprise.name }}
              </div>
              <div class="card-title-edit" @click.stop="editName(enterprise)" v-if="isAdmin">
                <icon :size=12 icon-type="edit_blue"></icon>
              </div>
            </div>
            <div class="card-description">
              {{ enterprise.description }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import NavBar from '@/components/NavigationBar';
import EnterpriseAddForm from './_components/EnterpriseAddForm';
import enterpriseAPI from './_api/enterprise';
import systemAPI from './_api/system';
import CommandRow from '../_components/CommandRow';

const robotListPage = '/manage/robot-manage';
export default {
  path: 'enterprise-manage',
  name: 'enterprise-manage',
  components: {
    NavBar,
    CommandRow,
  },
  api: [enterpriseAPI, systemAPI],
  computed: {
    ...mapGetters([
      'userInfo',
      'enterpriseList',
    ]),
    isAdmin() {
      return this.userInfo.type < 1;
    },
    filteredEnterprise() {
      if (this.keyword === '') {
        return this.enterpriseList;
      }
      return this.enterpriseList.filter(enterprise =>
        enterprise.name.indexOf(this.keyword) >= 0 ||
        (enterprise.description && enterprise.description.indexOf(this.keyword) >= 0));
    },
  },
  data() {
    return {
      pageOption: {
        enterpriseList: this.$t('management.enterprise_list'),
      },
      keyword: '',
    };
  },
  methods: {
    ...mapMutations([
      'setEnterprise',
      'setRobotList',
      'setUserRoleMap',
      'setPrivilegeList',
    ]),
    doSearch(word) {
      this.keyword = word;
    },
    goEnterprise(enterprise) {
      const that = this;
      localStorage.setItem('enterprise', enterprise.enterpriseID);
      this.setEnterprise(enterprise.enterpriseID);

      const robots = that.$getRobots();
      const userRoleMap = JSON.parse(localStorage.getItem('roleMap'));
      that.setRobotList(robots);
      that.setUserRoleMap(userRoleMap);
      that.setPrivilegeList(that.$getPrivModules());
      that.$router.push(robotListPage);
    },
    editName(enterprise) {
      console.log(enterprise);
    },
    addEnterprise() {
      const that = this;
      const promises = [
        that.$api.getEnterprises(),
        that.$api.getModules(),
      ];

      return Promise.all(promises).then((datas) => {
        const [enterprises, modules] = datas;
        that.$pop({
          title: that.$t('management.create_enterprise'),
          component: EnterpriseAddForm,
          extData: {
            existedEnterprises: enterprises.map(enterprise => enterprise.name),
            modules,
          },
          validate: true,
          callback: {
            ok(retData) {
              console.log(retData);
            },
          },
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  display: flex;
  flex-direction: column;

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

  .enterprise-list {
    flex: 1;
    padding: 20px;
    padding-bottom: 0px;
    @include auto-overflow();
    @include customScrollbar();
    
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    .enterprise-card {
      flex: 0 0 380px;
      max-width: 380px;
      height: 150px;
      border-radius: 4px;
      box-shadow: 0 0 3px 0 rgba(102, 102, 102, 0.5);
      margin-right: 30px;
      margin-bottom: 20px;
      padding: 20px;
      @include click-button();

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
        margin-bottom: 20px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;

        display: flex;
        align-items: center;
        .card-title-text {
          flex: 1;
          font-size: 20px;
          line-height: 24px;
          color: #333333;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
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
      .card-description {
        @include font-14px();
        color: #666666;
        word-break: break-all;
      }
    }
  }
}
</style>
