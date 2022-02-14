import {getRESTApi, postRESTApi} from '../api/server-rest';
require('es6-promise').polyfill();

export const ADD_ENVIRONMENT_SUCCESS = 'ADD_ENVIRONMENT_SUCCESS';
export const LOAD_ENVIRONMENTS_SUCCESS = 'LOAD_ENVIRONMENTS_SUCCESS';
export const LOAD_ENVIRONMENT_TYPES_SUCCESS = 'LOAD_ENVIRONMENT_TYPES_SUCCESS';
export const LOAD_ENVIRONMENTS_FAILURE = 'LOAD_ENVIRONMENTS_FAILURE';
export const LOAD_ENVIRONMENT_TYPES_FAILURE = 'LOAD_ENVIRONMENT_TYPES_FAILURE';

export function loadEnvironments1 (searchText) {
  return function (dispatch) {
    let uri = "/rest/lc/env/list"

    getRESTApi(uri)
      .then((response) => {
        //console.log("loadEnvironments: response: ", response);
        dispatch(loadEnvironmentsSuccess({environments: response.result}));
      })
      .catch((err) => {
        //console.log("loadEnvironments: err: ", err);
      })
  };
}

export function loadEnvironmentTypes (searchText) {
  return function (dispatch) {
    let uri = "/rest/lifecycle/environments/types"

    getRESTApi(uri)
      .then((response) => {
        //console.log("loadEnvironmentTypes: response: ", response);
        dispatch(loadEnvironmentTypesSuccess({envTypes: response.result}));
      })
      .catch((err) => {
        //console.log("loadEnvironmentTypes: err: ", err);
      })
  };
}

export function loadEnvironmentsSuccess1 (result) {
  return { type: LOAD_ENVIRONMENTS_SUCCESS, result: result };
}

export function loadEnvironmentTypesSuccess1 (result) {
  return { type: LOAD_ENVIRONMENT_TYPES_SUCCESS, result: result };
}

export function loadEnvironmentsFailure1 (error) {
  return { type: LOAD_ENVIRONMENTS_FAILURE, error: error };
}

export function loadEnvironmenttYPEsFailure1 (error) {
  return { type: LOAD_ENVIRONMENT_TYPES_FAILURE, error: error };
}

export function addEnvironment1(data) {
  //console.log("addEnvironment: data: ", data);

  return dispatch => {
    let uri = "/rest/lc/env/add";

    postRESTApi(uri, data)
      .then(function(response) {
        //console.log("response: ", response);
        return response;
      })
      .then(function(result){
        //console.log("addEnvironment result: ", (result));
        dispatch(addEnvironment_Success(result));
      })
      .catch(function(ex){
        //console.log("Exception: ", ex);
        dispatch(addEnvironment_Success({error: ex}));
      });
  };
}

function addEnvironment_Success1(result){
  return { type: ADD_ENVIRONMENT_SUCCESS, result: result };
}

export function loadEnvironment (uri) {
  //console.log("loadEnvironment: uri: ", uri)
  return function (dispatch) {
    // dispatch({ type: ITEM_LOAD, uri: uri });
    getRESTApi(uri)
      .then((response) => {
        //console.log("loadIntegration: response: ", response);
        //console.log("loadIntegration: response.result: ", response.result);
        dispatch(loadIntegration_Success(response));
      })
      .catch((err) => {
        //console.log("loadIntegration: err: ", err);
      })
  };
}
