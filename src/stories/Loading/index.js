import { number } from '@storybook/addon-knobs';
import LoadingLine from '../../components/basic/LoadingLine';
import LoadingDot from '../../components/basic/LoadingDot';

export default [{
  name: 'Loading',
  func: () => {
    const magnifyLine = number('Line: magnify', 0.5);
    const magnifyDot = number('Dot: magnify', 0.5);
    const template = `
      <div style="height:300px">
        <div style="margin-bottom: 20px;">
          預設大小<br><br>
          <loading-line></loading-line>
          <br><br>
          自訂大小<br><br>
          <loading-line :magnify="magnifyLine"></loading-line>
        </div>
        <div>
          預設大小<br><br>
          <loading-dot></loading-dot>
          <br><br>
          自訂大小<br><br>
          <loading-dot :magnify="magnifyDot"></loading-dot>
        </div>
      </div>`;
    return {
      components: {
        LoadingLine,
        LoadingDot,
      },
      data() {
        return {
          magnifyLine,
          magnifyDot,
        };
      },
      template,
    };
  },
}];
