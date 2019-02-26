import DailyLog from './StatisticDaily';
import Analysis from './StatisticAnalysisNew';
import Session from './StatisticSession';

export default {
  displayNameKey: 'statistics',
  icon: 'menu_statistics',
  pages: {
    Analysis,
    DailyLog,
    Session,
  },
};
