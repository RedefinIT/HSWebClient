/**
 * Created by govind on 9/5/18.
 */


import {getRESTApi, postRESTApi, postRESTApi2} from '../api/server-rest';
require('es6-promise').polyfill();

// import { SETTINGS_LOAD, SETTINGS_LOAD_SUCCESS, SETTINGS_UNLOAD, CATALOG_LOAD, CATALOG_LOAD_SUCCESS, CATALOG_UNLOAD } from './actions';
export const SETTINGS_LOAD = 'SETTINGS_LOAD';
export const SETTINGS_LOAD_SUCCESS = 'SETTINGS_LOAD_SUCCESS';
export const SETTINGS_UNLOAD = 'SETTINGS_UNLOAD';
export const CATALOG_LOAD = 'CATALOG_LOAD';
export const CATALOG_LOAD_SUCCESS = 'CATALOG_LOAD_SUCCESS';
export const CATALOG_UNLOAD = 'CATALOG_UNLOAD';


export function loadSettings() {
  ////console.log("actions/settings");

  return dispatch => {

    let uri = "/rest/settings"
    // let reqBody = {"settings": "all settings please!"};

    getRESTApi(uri)
      .then(function(response) {

        //console.log("loadSettings response: ", response);
        return response;

      }).then(function(result){

        //console.log("loadSettings result: ", JSON.stringify(result));
        dispatch(loadSettings_Success(result));

    }).catch(function(ex){
      //console.log("Exception: ", ex);
    });

  };
}

export function saveSettings(settings) {
  //console.log("actions/settings: saveSettings: ", settings);

  return dispatch => {

    let uri = "/rest/settings"
    let reqBody = settings;

    postRESTApi(uri, reqBody)
      .then(function(response) {

        //console.log("saveSettings response: ", response);
        return response;

      }).then(function(result){

        //console.log("saveSettings result: ", JSON.stringify(result));
        dispatch(loadSettings_Success(result));

    }).catch(function(ex){
      //console.log("Exception: ", ex);
    });

  };
}

export function unloadSettings() {
  return { type: SETTINGS_UNLOAD };
}

export function loadSettings_Success(settings){
  return {
    type: SETTINGS_LOAD_SUCCESS,
    settings: settings
  };

}

