<template>
  <div>
    <div class="card h-fill w-fill">
      <nav-bar class='nav-bar' :options=pageOption></nav-bar>
      <div class="page">
        <command-row class="commands" @search="doSearch">
            <template v-if="isAdmin">
            <text-button button-type="primary"
            @click="popAddEnterprise">{{ $t('management.create_enterprise') }}</text-button>
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
              <div class="card-title-edit" @click.stop="popEditEnterprise(enterprise)" v-if="isAdmin">
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
import EnterpriseEditForm from './_components/EnterpriseEditForm';
import EnterpriseDeleteForm from './_components/EnterpriseDeleteForm';
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
      'setPrivilegedEnterprise',
    ]),
    doSearch(word) {
      this.keyword = word;
    },
    goEnterprise(enterprise) {
      const that = this;
      that.$api.getEnterpriseModules(enterprise.enterpriseID).then((modules) => {
        localStorage.setItem('enterprise', enterprise.enterpriseID);
        localStorage.setItem('modules', JSON.stringify(modules));
        this.setEnterprise(enterprise.enterpriseID);

        const robots = that.$getRobots();
        const userRoleMap = JSON.parse(localStorage.getItem('roleMap'));
        that.setRobotList(robots);
        that.setUserRoleMap(userRoleMap);
        that.setPrivilegeList(that.$getPrivModules());
        that.$router.push(robotListPage);
      });
    },
    editName(enterprise) {
      console.log(enterprise);
    },
    popDeleteEnterprise(enterprise) {
      const that = this;
      that.$pop({
        title: that.$t('management.delete_enterprise'),
        component: EnterpriseDeleteForm,
        validate: true,
        extData: {
          name: enterprise.name,
          description: enterprise.description,
        },
        callback: {
          ok() {
            that.$api.deleteEnterprise(enterprise.enterpriseID)
              .then(() => that.reloadEnterprise());
          },
        },
      });
    },
    popEditEnterprise(enterprise) {
      console.log(enterprise);
      const that = this;
      const promises = [
        that.$api.getEnterprises(),
        that.$api.getModules(),
        that.$api.getEnterpriseModules(enterprise.enterpriseID),
      ];

      return Promise.all(promises).then((datas) => {
        const [enterprises, modules, enterpriseModules] = datas;
        that.$pop({
          title: that.$t('management.create_enterprise'),
          component: EnterpriseEditForm,
          extData: {
            existedEnterprises: enterprises.map(e => e.name),
            modules,
            name: enterprise.name,
            description: enterprise.description,
            checkedModules: enterpriseModules,
          },
          left_button: {
            msg: that.$t('general.delete'),
            type: 'error',
            closeAfterClick: true,
            callback: () => {
              that.popDeleteEnterprise(enterprise);
            },
          },
          validate: true,
          callback: {
            ok(retData) {
              that.addEnterprise(retData);
            },
          },
        });
      });
    },
    popAddEnterprise() {
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
              that.addEnterprise(retData);
            },
          },
        });
      });
    },
    addEnterprise(data) {
      const that = this;
      that.$emit('startLoading');
      that.$api.addEnterprise(data)
      .then(() => that.reloadEnterprise())
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        that.$emit('endLoading');
      });
    },
    reloadEnterprise() {
      const that = this;
      return that.$api.getEnterprises().then((datas) => {
        that.setPrivilegedEnterprise(datas);
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
