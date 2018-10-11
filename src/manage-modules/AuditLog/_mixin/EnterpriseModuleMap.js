const enterpriseModule = {
  data() {
    return {
      enterpriseModuleList: [
        {
          id: 'all',
          name: this.$t('general.all'),
          privCode: [],
          operation: ['all', 'create', 'edit', 'delete', 'login', 'logout'],
        },
        {
          id: 'manage_user',
          name: this.$t('pages.manage_user.module_name'),
          privCode: ['manage_user'],
          operation: ['all', 'create', 'edit', 'delete', 'login', 'logout'],
        },
        {
          id: 'manage_robot',
          name: this.$t('pages.manage_robot.module_name'),
          privCode: ['manage_robot'],
          operation: ['all', 'create', 'edit', 'delete'],
        },
      ],
    };
  },
};

export default enterpriseModule;
