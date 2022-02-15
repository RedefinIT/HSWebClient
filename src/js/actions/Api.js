
// import Rest, { headers, buildQuery, } from 'grommet/utils/Rest';
// import { initialize as initializeWatching, watch, disregard,
//   refresh } from './watch_renamed';
import fetch from 'isomorphic-fetch';

let _hostname = window.location.host.replace('3010', '3000')
let _storagehost = window.location.host.replace('3010', '3040')

 /*
Code copied from Grommet V1 grommet/utils/Rest
 */

// converts object to parameter array, handles arrays

export const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

export function buildParams (object) {
  let params = [];
  if (object) {
    for (const property in object) {
      if (object.hasOwnProperty(property)) {
        const value = object[property];
        if (null !== value && undefined !== value) {
          if (Array.isArray(value)) {
            for (let i = 0; i < value.length; i++) {
              params.push(property + '=' + encodeURIComponent(value[i]));
            }
          } else {
            params.push(property + '=' + encodeURIComponent(value));
          }
        }
      }
    }
  }
  return params;
}

// joins params array and adds '?' prefix if needed
function buildQuery (object) {
  const params = (Array.isArray(object) ? object : buildParams(object));
  return (params.length > 0 ? `?${params.join('&')}` : '');
}

// reject promise of response isn't ok
function processStatus (response) {
  if (response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(response.statusText || `Error ${response.status}`);
  }
}

/*
/*
END - Code copied from Grommet V1 grommet/utils/Rest
 */


const _headers = {
  ...headers,
  'X-API-Version': 200
};

// XHR still for file upload progress
import request from 'superagent';
let _timeout = 20000;
// 20s, up from initial 10s due to use from slow mobile devices

// Configuration

export let pageSize = 20;
export let pollingInterval = 2000; // 2s
export let urlPrefix = '';


export function getRESTApi(url, request) {

  console.log('URL: ', 'http://' + _hostname + url);

  return fetch('http://' + _hostname + url, request);
}

export function postRESTApi(url, reqBody) {

  console.log("postRESTApi: url:", url);
  console.log("postRESTApi: reqBody:", reqBody);

  let restRequest = {
    method: "POST",
    body: JSON.stringify(reqBody),
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  };

  console.log('URL: ', 'http://' + _hostname + url);
  console.log('RESTrEQUEST: ', JSON.stringify(restRequest));

  // return fetch('http://' + _hostname + url, restRequest);
  return fetch('http://' + _hostname + url, restRequest);

}

export function getFileBaseURL(bucket) {
  // The file server is HSStorageManager which is listening on 3040
  // return 'http://' + _hostname.replace('3000', '3040') + '/rest/';
  if(bucket != undefined)
    return 'http://' + _storagehost + '/rest/file/' + bucket + '/';
  else
    return 'http://' + _storagehost + '/rest/file/';
}

export function fileServerBaseURL() {
  return 'http://' + _storagehost + '/rest/';
}

