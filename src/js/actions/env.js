import {deleteRESTApi, getRESTApi, postRESTApi} from '../api/server-rest';
import {deleteImage_Success, loadImageOsTypesSuccess} from "./image";


require('es6-promise').polyfill();

// Networks
export const ADD_NETWORK_SUCCESS = 'ADD_NETWORK_SUCCESS';
export const DELETE_NETWORK_SUCCESS = 'DELETE_NETWORK_SUCCESS';
export const NETWORKS_LOAD = 'NETWORKS_LOAD';
export const NETWORKS_SUCCESS_LOAD = 'NETWORKS_SUCCESS_LOAD';
export const NETWORKS_FAILURE_LOAD = 'NETWORKS_FAILURE_LOAD';
export const NETWORKS_UNLOAD = 'NETWORKS_UNLOAD';
export const NETWORK_LOAD = 'NETWORK_LOAD';
export const NETWORK_LOAD_SUCCESS = 'NETWORK_LOAD_SUCCESS';
export const NETWORK_LOAD_FAILURE = 'NETWORK_LOAD_FAILURE';
export const NETWORK_UNLOAD = 'NETWORK_UNLOAD';


//This action will not update redux but expect the caller to refresh the data
export function deleteNetwork(networkName) {
  //console.log("deleteNetwork: ", networkName);

  let uri = "/rest/env/" + networkName;

  // let data = {"name": networkName};
  deleteRESTApi(uri, (err, res) => {
    //console.log("deleteNetwork: res: ", res);
    //console.log("deleteNetwork: err: ", err);
    // dispatch(deleteNetwork_Success({'result': res, 'error': err}));
    history.push("/ui/env")
  });

  // postRESTApi(uri, data)
  //   .then((response) => {
  //     //console.log("deleteNetwork: response: ", response);
  //     //console.log("deleteNetwork: response.result: ", response.result);
  //     return {status: "success"};
  //   })
  //   .catch((err) => {
  //     //console.log("loadNetworks: err: ", err);
  //     return {status: "fail", error: {"msg": str(err)}};
  //   })

}

export function loadEnvironments() {
  //console.log("loadNetworks: ");

  return dispatch => {

    let uri = "/rest/env/list"

    getRESTApi(uri)
      .then((response) => {
        //console.log("loadNetworks: response: ", response);
        //console.log("loadNetworks: response.result: ", response.result);
        dispatch(loadNetworks_Success({members: response.result, error: {}}));
      })
      .catch((err) => {
        //console.log("loadNetworks: err: ", err);
        dispatch(loadNetworks_Failure({error: err}));
      })
  };
}

export function loadNetworks_Success(result) {
  //console.log("loadNetworks_Success: ", result);
  return {
    type: NETWORKS_SUCCESS_LOAD,
    env: result
  };
}
export function loadNetworks_Failure(result) {
  //console.log("loadNetworks_Failure: ", result);
  return {
    type: NETWORKS_FAILURE_LOAD,
    networks: result
  };
}

export function addNetwork(data) {

  return dispatch => {
  let uri = "/rest/env/add";

  postRESTApi(uri, data)
    .then(function(response) {
      //console.log("response: ", response);
      return response;
    }).then(function(result){
      //console.log("result: ", JSON.stringify(result));
      dispatch(addNetwork_Success(result.result));
  }).catch(function(ex){
    //console.log("Exception: ", ex);
  });
};
}

export function loadNetwork(uri) {
  //console.log("loadNetwork: uri: ", uri)
  return function (dispatch) {
    // dispatch({ type: ITEM_LOAD, uri: uri });
    getRESTApi(uri)
      .then((response) => {
        //console.log("loadNetwork: response: ", response);
        //console.log("loadNetwork: response.result: ", response.result);
        dispatch(loadNetwork_Success(response.result.result));
      })
      .catch((err) => {
        //console.log("loadNetwork: err: ", err);
        dispatch(loadNetwork_Failure({error: err}));
      })

    //   getRESTApi(uri)
    //   .then(item => dispatch(loadItemSuccess(item)))
    //   .catch(error => dispatch(loadItemFailure(error)));
  };
}

export function loadNetwork_Success(result) {
  //console.log("loadNetwork_Success: result: ", result);
  return { type: NETWORK_LOAD_SUCCESS, currentItem: result };
}

export function loadNetwork_Failure(result) {
  //console.log("loadNetwork_Failure: result: ", result);
  return { type: NETWORK_LOAD_FAILURE, currentItem: result };
}


export function addNetwork_Success(network) {
  return {
    type: ADD_NETWORK_SUCCESS,
    currentItem: network
  };

}


export function unloadNetworks() {

  return { type: NETWORKS_UNLOAD };
}

// export function loadNetwork(id) {
//   return {
//     type: NETWORKS_SUCCESS_LOAD,
//     id: id
//   };
// }

export function unloadNetwork(id) {

  return { type: NETWORK_UNLOAD };
}