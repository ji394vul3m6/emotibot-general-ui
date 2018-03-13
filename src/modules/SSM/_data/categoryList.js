export default {
  getLocaleData(msg) {
    return [
      {
        key: 'categories',
        text: msg.statistics.categories.title,
        categories: [
          {
            type: 'platform',
            text: msg.statistics.categories.platform,
            allChecked: true,
            values: [
              {
                id: 'weixin',
                text: 'weixin',
                checked: false,
                tagId: 1,
              },
              {
                id: 'app',
                text: 'app',
                checked: false,
                tagId: 2,
              },
              {
                id: 'web',
                text: 'web',
                checked: false,
                tagId: 3,
              },
              {
                id: 'ios',
                text: 'ios',
                checked: false,
                tagId: 25,
              },
            ],
          },
          {
            type: 'brand',
            text: msg.statistics.categories.brand.title,
            allChecked: true,
            values: [
              {
                id: 'special_app',
                text: msg.statistics.categories.brand.special_app,
                checked: false,
                tagId: 4,
              },
              {
                id: 'baby_app',
                text: msg.statistics.categories.brand.baby_app,
                checked: false,
                tagId: 27,
              },
              {
                id: 'pc',
                text: msg.statistics.categories.brand.pc,
                checked: false,
                tagId: 5,
              },
              {
                id: 'wap',
                text: msg.statistics.categories.brand.wap,
                checked: false,
                tagId: 17,
              },
              {
                id: 'wechat_public',
                text: msg.statistics.categories.brand.wechat_public,
                checked: false,
                tagId: 18,
              },
              {
                id: 'vshhc',
                text: msg.statistics.categories.brand.vshhc,
                checked: false,
                tagId: 23,
              },
              {
                id: 'spiceal_app_new',
                text: msg.statistics.categories.brand.spiceal_app_new,
                checked: false,
                tagId: 24,
              },
              {
                id: 'qq_public',
                text: msg.statistics.categories.brand.qq_public,
                checked: false,
                tagId: 19,
              },
              {
                id: 'lefeng_app',
                text: msg.statistics.categories.brand.lefeng_app,
                checked: false,
                tagId: 20,
              },
            ],
          },
          {
            type: 'sex',
            text: msg.statistics.categories.sex.title,
            allChecked: true,
            values: [
              {
                id: '0',
                text: msg.statistics.categories.sex['0'],
                checked: false,
                tagId: 8,
              },
              {
                id: '1',
                text: msg.statistics.categories.sex['1'],
                checked: false,
                tagId: 7,
              },
            ],
          },
          {
            type: 'age',
            text: msg.statistics.categories.age,
            allChecked: true,
            values: [
              {
                id: '70s',
                text: '70s',
                checked: false,
                tagId: 9,
              },
              {
                id: '80s',
                text: '80s',
                checked: false,
                tagId: 10,
              },
              {
                id: '85s',
                text: '85s',
                checked: false,
                tagId: 11,
              },
              {
                id: '90s',
                text: '90s',
                checked: false,
                tagId: 12,
              },
            ],
          },
          {
            type: 'hobbies',
            text: msg.statistics.categories.hobbies.title,
            allChecked: true,
            values: [
              {
                id: '0',
                text: msg.statistics.categories.hobbies['0'],
                checked: false,
                tagId: 14,
              },
              {
                id: '1',
                text: msg.statistics.categories.hobbies['1'],
                checked: false,
                tagId: 13,
              },
            ],
          },
        ],
      },
      {
        key: 'emotions',
        text: msg.statistics.emotions.title,
        categories: [
          {
            type: 'emotion',
            text: msg.statistics.emotions.title,
            allChecked: true,
            values: [
              {
                id: 'angry',
                text: msg.statistics.emotions.angry,
                checked: false,
              },
              {
                id: 'not_satisfied',
                text: msg.statistics.emotions.not_satisfied,
                checked: false,
              },
              {
                id: 'neutral',
                text: msg.statistics.emotions.neutral,
                checked: false,
              },
              {
                id: 'satisfied',
                text: msg.statistics.emotions.satisfied,
                checked: false,
              },
            ],
          },
        ],
      },
      {
        key: 'qtypes',
        text: msg.statistics.qtypes.title,
        categories: [
          {
            type: 'qtype',
            text: msg.statistics.qtypes.title,
            allChecked: true,
            values: [
              {
                id: 'business',
                text: msg.statistics.qtypes.business,
                checked: false,
              },
              {
                id: 'chat',
                text: msg.statistics.qtypes.chat,
                checked: false,
              },
              {
                id: 'other',
                text: msg.statistics.qtypes.other,
                checked: false,
              },
            ],
          },
        ],
      },
    ];
  },
};
