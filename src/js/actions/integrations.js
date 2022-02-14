import {getRESTApi, deleteRESTApi, postRESTApi} from '../api/server-rest';
import {deleteImage_Success, loadImageOsTypesSuccess} from "./image";
require('es6-promise').polyfill();

// Integrations
export const ADD_INTEGRATION_SUCCESS = 'ADD_INTEGRATION_SUCCESS';
export const INTEGRATIONS_LOAD = 'INTEGRATIONS_LOAD';
export const INTEGRATIONS_SUCCESS_LOAD = 'INTEGRATIONS_SUCCESS_LOAD';
export const INTEGRATIONS_FAILURE_LOAD = 'INTEGRATIONS_FAILURE_LOAD';
export const INTEGRATIONS_UNLOAD = 'INTEGRATIONS_UNLOAD';
export const INTEGRATION_LOAD = 'INTEGRATION_LOAD';
export const INTEGRATION_LOAD_SUCCESS = 'INTEGRATION_LOAD_SUCCESS';
export const INTEGRATION_UNLOAD = 'INTEGRATION_UNLOAD';
export const INTEGRATION_DELETE_SUCCESS = 'INTEGRATION_DELETE_SUCCESS';


export function loadIntegrations() {
  //console.log("loadIntegrations: ");

  return dispatch => {

    let uri = "/rest/rm/list"
    getRESTApi(uri)
      .then((response) => {
        console.log("loadIntegrations: response: ", response);
        ////console.log("loadIntegrations: response.result: ", response.result);
        dispatch(loadIntegrations_Success({integrations: response.result, error: response.error}));
      })
      .catch((err) => {
        console.log("loadIntegrations: err: ", err);
        dispatch(loadIntegrations_Failure({error: err}));
      })
  };
}

export function loadIntegrations_Success(integrations) {
  ////console.log("loadIntegrations_Success: ", integrations);
  return {
    type: INTEGRATIONS_SUCCESS_LOAD,
    integrations: integrations
  };
}

export function loadIntegrations_Failure(integrations) {
  ////console.log("loadIntegrations_Failure: ", integrations);
  return {
    type: INTEGRATIONS_FAILURE_LOAD,
    integrations: integrations
  };
}

export function addIntegration(data) {

  return dispatch => {


  let uri = "/rest/rm/add";


  postRESTApi(uri, data)
    .then(function(response) {

      ////console.log("response: ", response);
      return response;

    }).then(function(result){

      ////console.log("addIntegration result: ", (result));
      dispatch(addIntegration_Success(result));

  }).catch(function(ex){
    ////console.log("Exception: ", ex);
    dispatch(addIntegration_Success({error: ex}));
  });

};

}

export function loadIntegration (uri) {
  ////console.log("loadIntegration: uri: ", uri)
  return function (dispatch) {
    // dispatch({ type: ITEM_LOAD, uri: uri });
    getRESTApi(uri)
      .then((response) => {
        ////console.log("loadIntegration: response: ", response);
        ////console.log("loadIntegration: response.result: ", response.result);
        dispatch(loadIntegration_Success(response));
      })
      .catch((err) => {
        ////console.log("loadIntegration: err: ", err);
      })

    //   getRESTApi(uri)
    //   .then(item => dispatch(loadItemSuccess(item)))
    //   .catch(error => dispatch(loadItemFailure(error)));
  };
}

export function loadIntegration_Success(appliance) {
  // ////console.log("loadIntegration_Success: appliance: ", appliance);
  return { type: INTEGRATION_LOAD_SUCCESS, currentItem: appliance };
}

export function deleteIntegration (uri) {
  ////console.log("deleteIntegration: uri: ", uri)
  return function (dispatch) {
    deleteRESTApi(uri)
      .then((response) => {
        ////console.log("deleteIntegration: response: ", response);
        // dispatch(deleteIntegration_Success(response.result));
      })
      .catch((err) => {
        //console.log("deleteIntegration: err: ", err);
      })

  };
}

export function deleteIntegration_Success(result) {
  //console.log("deleteIntegration_Success: result: ", result);
  return { type: INTEGRATION_DELETE_SUCCESS, result: result};
}



export function unloadIntegration() {

  return { type: INTEGRATION_UNLOAD };
}


export function addIntegration_Success(appliance) {
  return {
    type: ADD_INTEGRATION_SUCCESS,
    result: appliance
  };

}

export function unloadIntegrations() {

  return { type: INTEGRATIONS_UNLOAD };
}

