import Dashboard from './StatisticDashboard';
import AuditLog from './StatisticAudit';
import DailyLog from './StatisticDaily';

export default {
  displayNameKey: 'statistics',
  icon: 'white_statistics',
  pages: {
    Dashboard,
    DailyLog,
    AuditLog,
  },
};
