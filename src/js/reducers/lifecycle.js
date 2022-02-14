import { ADD_ENVIRONMENT_SUCCESS, LOAD_ENVIRONMENTS_SUCCESS, LOAD_ENVIRONMENT_TYPES_SUCCESS, LOAD_ENVIRONMENTS_FAILURE, LOAD_ENVIRONMENT_TYPES_FAILURE } from '../actions/lifecycle';
import { createReducer } from './utils';

const initialState = {
  error: {},
  environments: [],
  envTypes: []
};

const handlers = {
  [ADD_ENVIRONMENT_SUCCESS]: (state, action) => {
    //console.log("ADD_ENVIRONMENT_SUCCESS: action: ", action);
    return {error: {}};
  },
  [LOAD_ENVIRONMENTS_SUCCESS]: (state, action) => {
    //console.log("LOAD_ENVIRONMENTS_SUCCESS: action: ", action);
    return {environments: action.result};
  },
  [LOAD_ENVIRONMENT_TYPES_SUCCESS]: (state, action) => {
    //console.log("Reducer LOAD_ENVIRONMENT_TYPES_SUCCESS action: ", action);
    //console.log("Reducer LOAD_ENVIRONMENT_TYPES_SUCCESS state: ", state);
    return {envTypes: action.result};
  },
  [LOAD_ENVIRONMENTS_FAILURE]: (state, action) => {
    //console.log("Reducer LOAD_ENVIRONMENTS_FAILURE action: ", action);
    //console.log("Reducer LOAD_ENVIRONMENTS_FAILURE state: ", state);
    return {error: action.error};
  },
  [LOAD_ENVIRONMENT_TYPES_FAILURE]: (state, action) => {
    //console.log("Reducer LOAD_ENVIRONMENT_TYPES_FAILURE: action: ", action);
    return {error: action.error};
  }
};

export default createReducer(initialState, handlers);
