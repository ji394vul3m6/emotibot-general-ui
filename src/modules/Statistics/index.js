import AuditLog from './StatisticAudit';
// import DailyLog from './StatisticDaily';
import DailyLog from './StatisticDaily';
import Analysis from './StatisticAnalysisNew';
// import Learning from './StatisticLearning';

export default {
  displayNameKey: 'statistics',
  icon: 'menu_statistics',
  pages: {
    Analysis,
    DailyLog,
    // Learning,
    AuditLog,
  },
};
