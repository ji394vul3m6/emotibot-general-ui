<template>
  <div id='role-manage'>
    <div class="actions row">
      <text-button main icon-type="white_add_icon">{{$t('general.add')}}{{$t('privileges.role')}}</text-button>
      <search-input v-model="keyword"></search-input>
    </div>
    <div class="header row">
      <div class="check"></div>
      <div class="name">{{$t('privileges.role_name')}}</div>
      <div class="privileges">{{$t('privileges.privileges')}}</div>
      <div class="actions">{{$t('general.actions')}}</div>
    </div>
    <div class="lists">
      <div v-for="role in roles" v-if="role.name.indexOf(keyword) !== -1" :key="role.id" class='role-row row'>
        <div class="check">
          <input type="checkbox">
        </div>
        <div class="name">{{role.name}}</div>
        <div class="privileges">
          <div v-for="(actions, privilege) in role.privileges" :key="privilege">
            {{privilegeList[privilege].name}}:
            <span v-for="action in actions" :key="action">{{$t(`privileges.actions.${action}`)}}</span>
          </div>
        </div>
        <div class="actions">
          <div class="icon button">
            <div class="edit_icon"></div>
            <div class="tooltip">{{$t('general.edit')}}</div>
          </div>
          <div class="icon button">
            <div class="delete_icon"></div>
            <div class="tooltip">{{$t('general.delete')}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import * as mutationsType from './_store/mutations_type';
import api from './_api/role';

export default {
  path: 'role-manage',
  privCode: 'management',
  displayNameKey: 'role_manage',
  icon: 'white_role',
  data() {
    return {
      keyword: '',
    };
  },
  computed: {
    ...mapGetters([
      'roles',
      'privilegeList',
    ]),
  },
  methods: {
    ...mapMutations({
      setRoles: mutationsType.SET_ROLES,
    }),
  },
  mounted() {
    api.getRoles().then((roles) => {
      this.setRoles(roles);
    });
  },
};
</script>

<style lang="scss" scoped>
@import "styles/variable";

#role-manage {
  display: flex;
  flex-direction: column;
  height: 100%;
  .actions {
    flex: 0 0 $table-row-height;
  }
  .header {
    background: $table-header-background;
  }
  .lists {
    flex: 1 1 100px;
    background: $table-body-background;

    display: flex;
    flex-direction: column;
    .role-row {
      &:hover {
        background: $table-body-hover-background;
      }
      border-bottom: 1px solid $table-border-color;
    }
  }
  .row {
    flex: 0 0 auto;
    min-height: $table-row-height;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 10px;

    .check {
      flex: 0 0 50px;
    }
    .name {
      flex: 0.5 1 100px;
    }
    .privileges {
      flex: 3 1 300px;

      & > div {
        display: inline-block;
        float: left;
        padding: 5px;
        background: $table-header-background;
        margin: 5px;
        margin-left: 0;
        border-radius: 4px;
        span {
          &:not(:last-child):after {
            content: ", ";
          }
        }
      }
    }
    .actions {
      flex: 0 0 90px;
    }
  }
}
</style>
