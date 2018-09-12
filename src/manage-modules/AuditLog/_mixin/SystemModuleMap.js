const systemModule = {
  data() {
    return {
      systemModuleList: [
        {
          id: 'all',
          name: this.$t('general.all'),
          privCode: [],
          operation: ['all', 'create', 'edit', 'delete', 'login', 'logout'],
        },
        {
          id: 'manage_admin',
          name: this.$t('pages.manage_admin.module_name'),
          privCode: ['manage_admin'],
          operation: ['all', 'create', 'edit', 'delete', 'login', 'logout'],
        },
        {
          id: 'manage_enterprise',
          name: this.$t('pages.manage_enterprise.module_name'),
          privCode: ['manage_enterprise'],
          operation: ['all', 'create', 'edit', 'delete'],
        },
      ],
    };
  },
};

export default systemModule;
