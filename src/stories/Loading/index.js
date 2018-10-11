import { number } from '@storybook/addon-knobs';
import { withMarkdownNotes } from '@storybook/addon-notes';
import LoadingLine from '../../components/basic/LoadingLine';
import LoadingDot from '../../components/basic/LoadingDot';
import README from './README.md';

export default [{
  name: 'Loading',
  func: withMarkdownNotes(README)(() => {
    const magnifyLine = number('Line: magnify', 0.5);
    const magnifyDot = number('Dot: magnify', 0.5);
    const template = `
      <div style="height:300px">
        <div style="margin-bottom: 20px;">
          Loading Line 預設大小<br><br>
          <loading-line></loading-line>
          <br><br>
          Loading Line 自訂大小<br><br>
          <loading-line :magnify="magnifyLine"></loading-line>
        </div>
        <div>
          Loading Dot 預設大小<br><br>
          <loading-dot></loading-dot>
          <br><br>
          Loading Dot 自訂大小<br><br>
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
  }),
}];
