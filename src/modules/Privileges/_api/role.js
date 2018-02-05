// import axios from 'axios';

function getRoles() {
  return new Promise((resolve) => {
    const roles = [
      {
        name: 'RoleA',
        id: 'role-id-a',
        privileges: {
          module1: ['view', 'edit', 'add'],
          module2: ['view'],
        },
      },
      {
        name: 'RoleB',
        id: 'role-id-b',
        privileges: {
          module1: ['view', 'add'],
          module2: ['view'],
        },
      },
    ];
    setTimeout(() => {
      resolve(roles);
    }, 250);
  });
}

export default {
  getRoles,
};
