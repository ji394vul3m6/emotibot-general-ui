import RobotProfile from './RobotProfile';
import FunctionSetting from './FunctionSetting';
import ChatSkill from './RobotChatSkill';
import Command from './RobotCommand';

export default {
  displayNameKey: 'robot_setting',
  icon: 'menu_robot',
  pages: {
    RobotProfile,
    ChatSkill,
    FunctionSetting,
    Command,
  },
};
