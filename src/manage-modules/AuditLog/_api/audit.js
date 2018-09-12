const auditRobotURL = '/audit/robot';
const auditEnterpriseURL = '/audit/enterprise';
const auditSystemURL = '/audit/system';
const fullEnterpriseURL = '/auth/v3/enterpriselist';

function parseTableHeader(header) {
  const parsedHeader = header.map(h => ({
    key: h.id,
    text: h.text,
  }));
  return parsedHeader;
}

function getRobotAuditLog(params) {
  const URL = auditRobotURL;
  console.log({ URL, params });
  // return this.$reqPost(URL, params).then((response) => {
  //   console.log({ response });
  //   return response.data;
  // });
  const mockData = { status: 0, message: 'success', result: { total_size: 31, data: [{ user_id: 'csbotadmin', module: '6', operation: '4', result: 1, create_time: '2018-09-05T19:32:05+08:00', user_ip: '192.168.184.38', content: '下载日志管理 record.csv' }, { user_id: 'csbotadmin', module: '6', operation: '4', result: 1, create_time: '2018-09-05T19:22:10+08:00', user_ip: '192.168.184.38', content: '下载日志管理 record.csv' }, { user_id: 'csbotadmin', module: '6', operation: '4', result: 1, create_time: '2018-09-05T18:59:33+08:00', user_ip: '192.168.3.150', content: '下载日志管理 record.csv' }, { user_id: 'csbotadmin', module: '9', operation: '2', result: 1, create_time: '2018-09-05T13:48:09+08:00', user_ip: '192.168.3.192', content: '删除任务引擎场景 ID: 6f2d00e5-b6e4-4551-960f-8acc39489617' }, { user_id: 'csbotadmin', module: '9', operation: '0', result: 1, create_time: '2018-09-05T13:43:13+08:00', user_ip: '192.168.3.192', content: '新增任务引擎场景: HIII' }, { user_id: 'csbotadmin', module: '9', operation: '2', result: 1, create_time: '2018-09-05T13:43:02+08:00', user_ip: '192.168.3.192', content: '删除任务引擎场景 ID: f04f2d6e-2f53-42ec-805b-5831c39dd21f' }, { user_id: 'csbotadmin', module: '9', operation: '0', result: 1, create_time: '2018-09-05T13:41:00+08:00', user_ip: '192.168.3.192', content: '新增任务引擎场景: HELLO' }, { user_id: 'csbotadmin', module: '9', operation: '1', result: 1, create_time: '2018-09-05T11:02:23+08:00', user_ip: '192.168.3.85', content: '開始編輯場景：multiselect' }, { user_id: 'csbotadmin', module: '7', operation: '6', result: 1, create_time: '2018-09-05T10:44:17+08:00', user_ip: '192.168.3.85', content: '[用户登入]: csbotadmin' }, { user_id: 'deployer', module: '7', operation: '6', result: 1, create_time: '2018-09-05T10:15:24+08:00', user_ip: '192.168.3.208', content: '[用户登入]: deployer' }, { user_id: 'kimsys', module: '7', operation: '6', result: 1, create_time: '2018-09-05T10:06:25+08:00', user_ip: '192.168.3.103', content: '[用户登入]: kimsys' }, { user_id: 'csbotadmin', module: '8', operation: '2', result: 1, create_time: '2018-09-04T18:56:53+08:00', user_ip: '172.16.106.157', content: '[删除权限]: txxxxxxx' }, { user_id: 'csbotadmin', module: '8', operation: '1', result: 1, create_time: '2018-09-04T18:56:47+08:00', user_ip: '172.16.106.157', content: '[更新权限]: txxxxxxx' }, { user_id: 'csbotadmin', module: '8', operation: '0', result: 1, create_time: '2018-09-04T18:56:33+08:00', user_ip: '172.16.106.157', content: '[新增权限]: txxxxxxx' }, { user_id: 'csbotadmin', module: '7', operation: '6', result: 1, create_time: '2018-09-04T18:18:52+08:00', user_ip: '192.168.3.192', content: '[用户登入]: deployer' }, { user_id: 'deployer', module: '7', operation: '6', result: 1, create_time: '2018-09-04T17:44:06+08:00', user_ip: '192.168.3.192', content: '[用户登入]: csbotadmin' }, { user_id: 'csbotadmin', module: '2', operation: '0', result: 1, create_time: '2018-09-03T22:24:12+08:00', user_ip: '172.16.106.198', content: '常用标准问题测试' }, { user_id: 'csbotadmin', module: '2', operation: '0', result: 1, create_time: '2018-09-03T22:23:59+08:00', user_ip: '172.16.106.198', content: '常用标准问题训练' }, { user_id: 'csbotadmin', module: '2', operation: '4', result: 1, create_time: '2018-09-03T22:22:30+08:00', user_ip: '172.16.106.198', content: '导出标准问题' }, { user_id: 'csbotadmin', module: '2', operation: '4', result: 1, create_time: '2018-09-03T22:22:29+08:00', user_ip: '172.16.106.198', content: '导出标准问题' }, { user_id: 'csbotadmin', module: '2', operation: '0', result: 1, create_time: '2018-09-03T22:22:16+08:00', user_ip: '172.16.106.198', content: '常用标准问题测试' }, { user_id: 'csbotadmin', module: '2', operation: '0', result: 1, create_time: '2018-09-03T22:22:13+08:00', user_ip: '172.16.106.198', content: '常用标准问题训练' }, { user_id: 'csbotadmin', module: '2', operation: '0', result: 1, create_time: '2018-09-03T22:22:10+08:00', user_ip: '172.16.106.198', content: '保存/修改扩写' }, { user_id: 'csbotadmin', module: '2', operation: '0', result: 1, create_time: '2018-09-03T22:18:47+08:00', user_ip: '172.16.106.198', content: '常用标准问题测试' }, { user_id: 'csbotadmin', module: '2', operation: '0', result: 1, create_time: '2018-09-03T22:18:43+08:00', user_ip: '172.16.106.198', content: '常用标准问题训练' }] } };

  mockData.result.table_header = [
    {
      text: '用戶 ID',
      id: 'user_id',
    },
    {
      text: '操作模塊',
      id: 'module',
    },
    {
      text: '操作類型',
      id: 'operation',
    },
    {
      text: '動作描述',
      id: 'content',
    },
    {
      text: '動作結果',
      id: 'result',
    },
    {
      text: '發生時間',
      id: 'create_time',
    },
    {
      text: 'IP 地址',
      id: 'user_ip',
    },
  ];
  return Promise.resolve(mockData.result).then((result) => {
    result.table_header = parseTableHeader(result.table_header);
    return result;
  });
}
function exportRobotAuditLog(params) {
  const URL = `${auditRobotURL}/export`;
  console.log({ URL });
  return this.$reqPost(URL, params).then((response) => {
    console.log({ response });
    return response.data;
  });
}
function getEnterpriseAuditLog(params) {
  const URL = auditEnterpriseURL;
  console.log({ URL });
  return this.$reqPost(URL, params).then((response) => {
    console.log({ response });
    return response.data;
  });
}
function exportEnterpriseAuditLog(params) {
  const URL = `${auditEnterpriseURL}/export`;
  console.log({ URL });
  return this.$reqPost(URL, params).then((response) => {
    console.log({ response });
    return response.data;
  });
}
function getSystemAuditLog(params) {
  const URL = auditSystemURL;
  console.log({ URL });
  return this.$reqPost(URL, params).then((response) => {
    console.log({ response });
    return response.data;
  });
}
function exportSystemAuditLog(params) {
  const URL = `${auditSystemURL}/export`;
  console.log({ URL });
  return this.$reqPost(URL, params).then((response) => {
    console.log({ response });
    return response.data;
  });
}

function getFullEnterpriseList() {
  const URL = fullEnterpriseURL;
  console.log({ URL });
  // return this.$reqGet(URL).then((response) => {
  //   console.log({ response });
  //   return response.data;
  // });

  const mockData = [{
    enterprise_id: '1234567',
    enterprise_name: '企業一號',
    robot_list: [
      {
        robot_id: 'robot001',
        robot_name: '機器人一號',
      },
      {
        robot_id: 'robot001',
        robot_name: '機器人二號',
      },
    ],
  }, {
    enterprise_id: '7654321',
    enterprise_name: '企業二號',
    robot_list: [
      {
        robot_id: 'robot003',
        robot_name: '機器人三號',
      },
      {
        robot_id: 'robot004',
        robot_name: '機器人四號',
      },
    ],
  }];
  return Promise.resolve(mockData);
}

export default {
  getRobotAuditLog,
  exportRobotAuditLog,
  getEnterpriseAuditLog,
  exportEnterpriseAuditLog,
  getSystemAuditLog,
  exportSystemAuditLog,
  getFullEnterpriseList,
};
