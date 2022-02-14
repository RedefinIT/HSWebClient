import {deleteRESTApi, getRESTApi, postRESTApi} from '../api/server-rest';
import {deleteImage_Success, loadImageOsTypesSuccess} from "./image";
import {createReducer} from "../reducers/utils";


require('es6-promise').polyfill();

// Pools
export const ADD_POOL_SUCCESS = 'ADD_POOL_SUCCESS';
export const DELETE_POOL_SUCCESS = 'DELETE_POOL_SUCCESS';
export const POOLS_LOAD = 'POOLS_LOAD';
export const POOLS_SUCCESS_LOAD = 'POOLS_SUCCESS_LOAD';
export const POOLS_FAILURE_LOAD = 'POOLS_FAILURE_LOAD';
export const POOL_SUCCESS_LOAD = 'POOL_SUCCESS_LOAD';
export const POOL_FAILURE_LOAD = 'POOL_FAILURE_LOAD';
export const POOLS_UNLOAD = 'POOLS_UNLOAD';
export const POOL_LOAD = 'POOL_LOAD';
export const POOL_LOAD_SUCCESS = 'POOL_LOAD_SUCCESS';
export const POOL_LOAD_FAILURE = 'POOL_LOAD_FAILURE';
export const POOL_UNLOAD = 'POOL_UNLOAD';


export function serverDiscovery(serverInfo, serverProfile=false, callback) {

  let uri = "/rest/respools/discover"
  if (serverProfile)
    uri = "/rest/respools/serverprofile"

    postRESTApi(uri, serverInfo)
        .then(function(response) {
          console.log("serverDiscovery response: ", response);
          callback(response.result);
        }).catch(function(ex){
      console.log("serverDiscovery Exception: ", ex);
    });

}


//This action will not update redux but expect the caller to refresh the data
export function deletePool(poolName) {
  //console.log("deletePool: ", poolName);

  let uri = "/rest/respools/" + poolName;

  // let data = {"name": poolName};
  deleteRESTApi(uri, (err, res) => {
    //console.log("deletePool: res: ", res);
    //console.log("deletePool: err: ", err);
    // dispatch(deletePool_Success({'result': res, 'error': err}));
    // history.push("/ui/respools")
  });

}

export function loadPools() {
  //console.log("loadPools: ");

  return dispatch => {

    let uri = "/rest/respools/list"

    getRESTApi(uri)
      .then((response) => {
        console.log("loadPools: response: ", response);
        //console.log("loadPools: response.result: ", response.result);
        dispatch(loadPools_Success({pools: response.result, error: response.error}));
      })
      .catch((err) => {
        //console.log("loadPools: err: ", err);
        dispatch(loadPools_Failure({error: err}));
      })
  };
}

export function loadPools_Success(result) {
  console.log("loadPools_Success: ", result);
  return {
    type: POOLS_SUCCESS_LOAD,
    pools: result
  };
}
export function loadPools_Failure(result) {
  //console.log("loadPools_Failure: ", result);
  return {
    type: POOLS_FAILURE_LOAD,
    pools: result
  };
}

export function loadPool(poolName) {
  //console.log("loadPool: ");

  return dispatch => {

    let uri = "/rest/respools/" + poolName

    getRESTApi(uri)
        .then((response) => {
          console.log("loadPool: response: ", response);
          //console.log("loadPool: response.result: ", response.result);
          dispatch(loadPool_Success({pool: response.result, error: response.error}));
        })
        .catch((err) => {
          //console.log("loadPool: err: ", err);
          dispatch(loadPool_Failure({error: err}));
        })
  };
}

export function loadPool_Success(result) {
  console.log("loadPools_Success: ", result);
  return {
    type: POOL_SUCCESS_LOAD,
    currentItem: result["pool"],
    error: result["error"]
  };
}

export function loadPool_Failure(result) {
  //console.log("loadPools_Failure: ", result);
  return {
    type: POOL_FAILURE_LOAD,
    currentItem: result["pool"],
    error: result["error"]
  };
}

export function addPool(data) {

  return dispatch => {
  let uri = "/rest/respools/add";

  postRESTApi(uri, data)
    .then(function(response) {
      //console.log("response: ", response);
      return response;
    }).then(function(result){
      //console.log("result: ", JSON.stringify(result));
      dispatch(addPool_Success(result.result));
  }).catch(function(ex){
    //console.log("Exception: ", ex);
  });
};
}


export function addPool_Success(pool) {
  return {
    type: ADD_POOL_SUCCESS,
    currentItem: pool
  };

}


export function unloadPools() {

  return { type: POOLS_UNLOAD };
}

// export function loadPool(id) {
//   return {
//     type: POOLS_SUCCESS_LOAD,
//     id: id
//   };
// }

export function unloadPool(id) {

  return { type: POOL_UNLOAD };
}

