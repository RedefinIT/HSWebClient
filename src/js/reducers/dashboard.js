import { DASHBOARD_LOAD_SUCCESS, DASHBOARD_UNLOAD } from '../actions/actions';
import { createReducer } from './utils';

const initialState = {
  data: {
    tasks: [],
    osPackages: {
      stats: [],
      total: 0
    },
    ovCount: 0
  },

  error: {}
};

const handlers = {
  [DASHBOARD_LOAD_SUCCESS]: (state, action) => {
    //console.log("DASHBOARD_LOAD_SUCCESS: action: ", action);
    return {data: action.data.result, error: action.data.error};
  },
  [DASHBOARD_UNLOAD]: () => initialState
};

export default createReducer(initialState, handlers);
