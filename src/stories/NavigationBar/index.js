import { text, object } from '@storybook/addon-knobs';
import NavBar from '../../components/NavigationBar';

export default [{
  name: 'navigationBar',
  func: () => {
    const pageMap = object('pageMap', {
      basic: 'BASIC',
      emotion: 'EMOTION',
      timeout: 'TIMEOUT',
    });
    const currentPage = text('currentPage', '');

    const template = `
    <div>
      <nav-bar v-model=currentPage :options="pageMap" />
      <br>
      current page: {{ currentPage }}
    </div>
    `;

    return {
      components: {
        NavBar,
      },
      data() {
        return {
          pageMap,
          currentPage,
        };
      },
      template,
    };
  },
}];
