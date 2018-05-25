import TaskEngine from './TaskEngine';
import TaskEngineV3 from './TaskEngineV3';
import TaskEngineUpload from './TaskEngineUpload';

export default {
  displayNameKey: 'task_engine',
  icon: 'menu_te',
  pages: {
    TaskEngine,
    TaskEngineV3,
    TaskEngineUpload,
  },
};
