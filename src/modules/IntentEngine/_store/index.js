export const intentTrain = {};
export const intentTest = {
  name: 'intentTest',
  namespaced: true,
  state: {
    allIntents: [],
    intentList: [],
    corpusGroupsWithoutIntent: [],
    searchIntentMode: false,
  },
  getters: {
    corpusCounts: (s) => {
      if (!s.searchIntentMode) {
        let count = s.corpusGroupsWithoutIntent.reduce(
          (acc, intent) => acc + intent.sentences_count, 0,
        );
        count += s.intentList.reduce(
          (acc, intent) => acc + intent.sentences_count, 0,
        );
        return count;
      }
      return 0;
    },
  },
  mutations: {
    setAllIntents(s, allIntents) {
      s.allIntents = allIntents;
    },
    setIntentList(s, intentList) {
      s.intentList = intentList;
    },
    setCorpusGroupsWithoutIntent(s, corpusGroups) {
      s.corpusGroupsWithoutIntent = corpusGroups;
    },
  },
};
