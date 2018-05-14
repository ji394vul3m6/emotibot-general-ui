import Dashboard from './StatisticDashboard';
import AuditLog from './StatisticAudit';
import DailyLog from './StatisticDaily';
import Analysis from './StatisticAnalysis';

export default {
  displayNameKey: 'statistics',
  icon: 'menu_statistics',
  dftOpen: true,
  pages: {
    Dashboard,
    Analysis,
    DailyLog,
    AuditLog,
  },
};
