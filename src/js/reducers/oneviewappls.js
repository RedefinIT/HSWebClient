import { INTEGRATIONS_LOAD, INTEGRATIONS_SUCCESS_LOAD, INTEGRATIONS_FAILURE_LOAD, ADD_INTEGRATION_SUCCESS, INTEGRATION_LOAD_SUCCESS, INTEGRATIONS_UNLOAD, INTEGRATION_LOAD, INTEGRATION_UNLOAD, INTEGRATION_DELETE_SUCCESS} from '../actions/integrations';
import { createReducer } from './utils';

const initialState = {
  integrations: {
    error: {},
    result: []
  },
  currentItem: {},
  result: {}
};

const handlers = {
  [INTEGRATIONS_LOAD]: (state, action) => {
    // console.log("INTEGRATIONS_LOAD: action: ", action);
    return {integrations: action.integrations};
  },
  [INTEGRATIONS_SUCCESS_LOAD]: (state, action) => {
    //console.log("Reducer INTEGRATIONS_SUCCESS_LOAD action: ", action);
    //console.log("Reducer INTEGRATIONS_SUCCESS_LOAD state: ", state);
    return {integrations: action.integrations};
  },
  [INTEGRATIONS_FAILURE_LOAD]: (state, action) => {
    //console.log("Reducer INTEGRATIONS_FAILURE_LOAD action: ", action);
    //console.log("Reducer INTEGRATIONS_FAILURE_LOAD state: ", state);
    return {integrations: action.integrations};
  },
  [ADD_INTEGRATION_SUCCESS]: (state, action) => {
    // console.log("oneviewappls: reducer: ADD_INTEGRATION_SUCCESS: action: ", action);
    return {result: action.result};
  },
  [INTEGRATION_LOAD_SUCCESS]: (state, action) => {
    // console.log("oneviewappls: reducer: LOAD_INTEGRATION_SUCCESS: action: ", action);
    return {currentItem: action.currentItem.result, error: action.currentItem.error};
  },
  [INTEGRATION_DELETE_SUCCESS]: (state, action) => {
    // console.log("oneviewappls: reducer: INTEGRATION_DELETE_SUCCESS: action: ", action);
    // return {currentItem: action.currentItem.result, error: action.currentItem.error};
  },
  [INTEGRATIONS_UNLOAD]: () => initialState,
  [INTEGRATION_LOAD]: (state, action) => {
    if (!action.error) {
      action.payload.error = undefined;
      return action.payload;
    }
    return { error: action.payload };
  },
  [INTEGRATION_UNLOAD]: (state, action) => {
    // console.log("oneviewappls: reducer: INTEGRATION_UNLOAD: action: ", action);
    return {result: {}, currentItem: {}, error: ""};
  }
};

export default createReducer(initialState, handlers);
