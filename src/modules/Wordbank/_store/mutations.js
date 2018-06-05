import * as types from './mutations_type';

function resetActive(wordbank) {
  wordbank.isActive = false;
  if (wordbank.children && wordbank.children.length > 0) {
    wordbank.children.forEach((child) => {
      resetActive(child);
    });
  }
}
function findParent(wordbank, cid) {
  if (wordbank.children && wordbank.children.length > 0) {
    const targetIndex = wordbank.children.findIndex(child => child.cid === cid);
    if (targetIndex !== -1) {
      return wordbank;
    }
    let parent;
    wordbank.children.forEach((child) => {
      const newparent = findParent(child, cid);
      parent = (newparent === undefined) ? parent : newparent;
    });
    return parent;
  }
  return undefined;
}

export const state = {
  wordbank: {},
  currentCategory: undefined,
  isEditMode: false,
};

export const mutations = {
  [types.SET_WORDBANK]: (_, wordbank) => {
    state.wordbank = wordbank;
  },
  [types.SET_CURRENT_CATEGORY]: (_, category) => {
    state.currentCategory = category;
    state.currentCategory.isActive = true;
  },
  [types.RESET_ACTIVE_CATEGORY]: () => {
    resetActive(state.wordbank);
  },
  [types.TOGGLE_EDIT_MODE]: () => {
    state.isEditMode = !state.isEditMode;
    if (!state.isEditMode) {
      resetActive(state.wordbank);
      state.currentCategory = state.wordbank.children[0];
      state.currentCategory.isActive = true;
    }
  },
  [types.APPEND_TO_ROOT_CATEGORY]: (_, category) => {
    state.wordbank.children.push(category);
    const idx = state.wordbank.children.length - 1;
    state.currentCategory = state.wordbank.children[idx];
  },
  [types.APPEND_SUB_CATEGORY]: () => {
    const subCategory = {
      name: '',
      layer: state.currentCategory.layer + 1,
      cid: 0,
      editable: true,
      deletable: true,
      isActive: true,
      showChild: false,
      children: [],
      wordbanks: [],
    };
    state.currentCategory.children.splice(0, 0, subCategory);
    state.currentCategory.showChild = true;
  },
  [types.ADD_TO_CURRENT_CATEGORY]: (_, category) => {
    state.currentCategory.children.splice(0, 1);
    state.currentCategory.children.push(category);
    const idx = state.currentCategory.children.length - 1;
    state.currentCategory = state.currentCategory.children[idx];
  },
  [types.CANCEL_ADD_FROM_CURRENT_CATEGORY]: () => {
    state.currentCategory.children.splice(0, 1);
    state.currentCategory.isActive = true;
  },
  [types.REMOVE_CURRENT_CATEGORY]: (_, cid) => {
    const parent = findParent(state.wordbank, cid);
    const categoryIndex = parent.children.findIndex(child => child.cid === cid);
    parent.children.splice(categoryIndex, 1);
  },

};
