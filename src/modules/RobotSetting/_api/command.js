import qs from 'qs';

const COMMANDS_PATH = '/api/v1/bf/cmds';
const COMMAND_PATH = '/api/v1/bf/cmd';

function deleteRobotCommand(id) {
  return this.$reqDelete(`${COMMAND_PATH}/${id}`);
}

function addRobotCommand(cid, command) {
  const param = {
    name: command.name,
    rule: JSON.stringify(command.rule),
    target: command.target,
    answer: command.answer,
    response_type: command.response_type,
    status: command.status,
    labels: JSON.stringify(command.tags),
    begin_time: command.start_time,
    end_time: command.end_time,
  };

  param.cid = cid < 0 ? -1 : cid; // add to root or to cid

  return this.$reqPost(`${COMMAND_PATH}`, qs.stringify(param), {
    'Content-Type': 'application/x-www-form-urlencoded',
  });
}

function editRobotCommand(command) {
  // TODO: give parent id;
  const id = command.id;
  const param = {
    name: command.name,
    rule: JSON.stringify(command.rule),
    target: command.target,
    answer: command.answer,
    response_type: command.response_type,
    status: command.status,
    labels: JSON.stringify(command.tags),
    begin_time: command.start_time,
    end_time: command.end_time,
  };
  return this.$reqPut(`${COMMAND_PATH}/${id}`, qs.stringify(param), {
    'Content-Type': 'application/x-www-form-urlencoded',
  }).then(response => response.data.result);
}

function getSingleRobotCommand(id) {
  return this.$reqGet(`${COMMAND_PATH}/${id}`)
    .then((response) => {
      const command = response.data.result;
      return command;
    });
}

function parseCommands(commands) {
  // put rules in no category
  const noCategory = {
    cid: -3,
    name: '未分类',
    cmds: commands.cmds,
  };

  commands.children.splice(0, 0, noCategory);

  // add attributes to display category
  commands.children.forEach((child) => {
    child.deletable = true;
    child.editable = true;
    child.isActive = false;
    child.layer = 1;
    child.visible = true;
    if (!child.children) {
      child.children = [];
    }
  });
}

function getRobotCommands() {
  console.log(COMMANDS_PATH);
  return this.$reqGet(COMMANDS_PATH)
    .then((response) => {
      const commands = response.data.result;
      parseCommands(commands);
      // parse commands add no category
      return commands;
    });

  // const mockData = {
  //   cid: -1,
  //   name: '',
  //   cmds: [{
  //     id: 0,
  //     name: '某個指令名稱',
  //     target: 1,
  //     response_type: 2,
  //     rule: [{
  //       type: 'keyword', // 'regex'
  //       value: ['信用卡'],
  //     }, {
  //       type: 'keyword',
  //       value: ['關鍵字'],
  //     }, {
  //       type: 'regex',
  //       value: ['somereg'],
  //     }],
  //     answer: '[{\"type\":\"cmd\",\"subType\":\"credit\",\"value\":\"信用卡相关业务请进入\u003ca href=\\\"http://credit.cmbc.com.cn\\\"\u003e信用卡页面\u003c/a\u003e\",\"data\":[]}]',
  //     status: false,
  //     begin_time: null,
  //     end_time: null,
  //     labels: ['7', '1'],
  //   }],
  //   children: [],
  // };

  // parseCommands(mockData);
  // return Promise.resolve(mockData);
}

export default {
  getRobotCommands,
  getSingleRobotCommand,
  addRobotCommand,
  editRobotCommand,
  deleteRobotCommand,
};
