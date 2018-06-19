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
    labels: JSON.stringify(command.labels),
    begin_time: command.start_time,
    end_time: command.end_time,
  };

  param.cid = cid < 0 ? -1 : cid; // add to root or to cid

  return this.$reqPost(`${COMMAND_PATH}`, qs.stringify(param), {
    'Content-Type': 'application/x-www-form-urlencoded',
  }).then((response) => {
    const rspCommand = response.data.result;
    if (rspCommand.labels === null) {
      rspCommand.labels = [];
    }
    return rspCommand;
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
    labels: JSON.stringify(command.labels),
    begin_time: command.begin_time,
    end_time: command.end_time,
  };
  return this.$reqPut(`${COMMAND_PATH}/${id}`, qs.stringify(param), {
    'Content-Type': 'application/x-www-form-urlencoded',
  }).then((response) => {
    const rspCommand = response.data.result;
    if (rspCommand.labels === null) {
      rspCommand.labels = [];
    }
    return rspCommand;
  });
}

function getSingleRobotCommand(id) {
  return this.$reqGet(`${COMMAND_PATH}/${id}`)
    .then((response) => {
      const command = response.data.result;
      return command;
    });
}

function parseCommands(commands) {
  commands.children.forEach((child) => {
    /** add attributes to display category */
    child.deletable = true;
    child.editable = true;
    child.isActive = false;
    child.layer = 1;
    child.visible = true;
    if (!child.children) {
      child.children = [];
    }

    /** Api will return null if have no label, however, labels should always be an array */
    if (child.labels === null) {
      child.labels = [];
    }
  });

  // put rules in no category
  const noCategory = {
    cid: -3,
    name: '未分类',
    cmds: commands.cmds,
    children: [],
    labels: [],

    deletable: false,
    editable: false,
    isActive: false,
    layer: 1,
    visible: true,
  };

  commands.children.splice(0, 0, noCategory);
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
}

export default {
  getRobotCommands,
  getSingleRobotCommand,
  addRobotCommand,
  editRobotCommand,
  deleteRobotCommand,
};
