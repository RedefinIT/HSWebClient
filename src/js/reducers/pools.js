import { POOLS_LOAD, POOLS_SUCCESS_LOAD, POOLS_FAILURE_LOAD, POOL_SUCCESS_LOAD, POOL_FAILURE_LOAD, ADD_POOL_SUCCESS, POOL_LOAD_SUCCESS, POOL_LOAD_FAILURE, POOLS_UNLOAD, POOL_LOAD, POOL_UNLOAD } from '../actions/pools';
import { createReducer } from './utils';

const initialState = {
  pools: {
    error: {},
    pools: []
  },
  servers: {
    error: {},
    pools: []
  },
  currentItem: {},
};

const handlers = {
  [POOLS_LOAD]: (state, action) => {
    //console.log("POOLS_LOAD: action: ", action);
    return {pools: action.pools};
  },
  [POOLS_SUCCESS_LOAD]: (state, action) => {
    console.log("Reducer POOLS_SUCCESS_LOAD action: ", action);
    //console.log("Reducer POOLS_SUCCESS_LOAD state: ", state);
    return {pools: action.pools};
  },
  [POOLS_FAILURE_LOAD]: (state, action) => {
    //console.log("Reducer POOLS_FAILURE_LOAD action: ", action);
    //console.log("Reducer POOLS_FAILURE_LOAD state: ", state);
    return {pools: action.pools};
  },
  [POOL_SUCCESS_LOAD]: (state, action) => {
    console.log("Reducer POOL_SUCCESS_LOAD action: ", action);
    //console.log("Reducer POOLS_SUCCESS_LOAD state: ", state);
    return {currentItem: action.currentItem};
  },
  [POOL_FAILURE_LOAD]: (state, action) => {
    //console.log("Reducer POOLS_FAILURE_LOAD action: ", action);
    //console.log("Reducer POOLS_FAILURE_LOAD state: ", state);
    return {currentItem: action.currentItem};
  },
  [ADD_POOL_SUCCESS]: (state, action) => {
    //console.log("pools: reducer: ADD_POOL_SUCCESS: action: ", action);
    return {currentItem: action.currentItem};
  },
  [POOL_LOAD_SUCCESS]: (state, action) => {
    //console.log("pools: reducer: LOAD_POOL_SUCCESS: action: ", action);
    return {currentItem: action.currentItem};
  },
  [POOLS_UNLOAD]: () => initialState,
  [POOL_LOAD]: (state, action) => {
    if (!action.error) {
      action.payload.error = undefined;
      return action.payload;
    }
    return { error: action.payload };
  },
  [POOL_UNLOAD]: () => initialState
};

export default createReducer(initialState, handlers);
