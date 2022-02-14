import { NETWORKS_LOAD, NETWORKS_SUCCESS_LOAD, NETWORKS_FAILURE_LOAD, ADD_NETWORK_SUCCESS, NETWORK_LOAD_SUCCESS, NETWORK_LOAD_FAILURE, NETWORKS_UNLOAD, NETWORK_LOAD, NETWORK_UNLOAD } from '../actions/env';
import { createReducer } from './utils';

const initialState = {
  env: {
    error: {},
    members: []
  },
  currentItem: {},
};

const handlers = {
  [NETWORKS_LOAD]: (state, action) => {
    //console.log("NETWORKS_LOAD: action: ", action);
    return {networks: action.networks};
  },
  [NETWORKS_SUCCESS_LOAD]: (state, action) => {
    //console.log("Reducer NETWORKS_SUCCESS_LOAD action: ", action);
    //console.log("Reducer NETWORKS_SUCCESS_LOAD state: ", state);
    return {env: action.env};
  },
  [NETWORKS_FAILURE_LOAD]: (state, action) => {
    //console.log("Reducer NETWORKS_FAILURE_LOAD action: ", action);
    //console.log("Reducer NETWORKS_FAILURE_LOAD state: ", state);
    return {networks: action.networks};
  },
  [ADD_NETWORK_SUCCESS]: (state, action) => {
    //console.log("networks: reducer: ADD_NETWORK_SUCCESS: action: ", action);
    return {currentItem: action.currentItem};
  },
  [NETWORK_LOAD_SUCCESS]: (state, action) => {
    //console.log("networks: reducer: LOAD_NETWORK_SUCCESS: action: ", action);
    return {currentItem: action.currentItem};
  },
  [NETWORKS_UNLOAD]: () => initialState,
  [NETWORK_LOAD]: (state, action) => {
    if (!action.error) {
      action.payload.error = undefined;
      return action.payload;
    }
    return { error: action.payload };
  },
  [NETWORK_UNLOAD]: () => initialState
};

export default createReducer(initialState, handlers);
