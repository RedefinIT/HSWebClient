import { combineReducers } from 'redux';

import deployservers from './deployservers';
import dashboard from './dashboard';
import nav from './nav';
import session from './session';
import oneviewappls from './oneviewappls';
import settings from './settings';
import image from './image';
import item from './item';
import lifecycle from './lifecycle';
import pools from './pools';
// import index from './index';
import tasks from './tasks';
import env from './env';
import { connectRouter } from 'connected-react-router';


const createRootReducer = (history) => combineReducers({
  router: connectRouter(history),
  session,
  nav,
  dashboard,
  oneviewappls,
  env,
  image,
  pools,
  item,
  tasks,
  deployservers,
  settings,
  lifecycle
})


//
// cons default combineReducers({
//   router: connectRouter(history),
//   nav,
//   dashboard,
//   oneviewappls,
//   networks,
//   image,
//   item,
//   tasks,
//   session,
//   deployservers,
//   settings
// })

export default createRootReducer

// export default combineReducers({
//   dashboard,
//   nav,
//   session,
//   tasks,
//   settings,
//   integrations
// });
