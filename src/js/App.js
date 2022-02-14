import React, {Component} from 'react';
// import { IntlProvider, addLocaleData } from 'react-intl';
import {IntlProvider} from 'react-intl';
// import en from 'react-intl/locale-data/en';
import {getCurrentLocale, getLocaleData} from './utils/Locale';
import {Provider} from 'react-redux';
import {Router} from 'react-router-dom';
import Routes from './Routes';
import {Box, Grid, Grommet} from 'grommet';
// import {hpe} from 'grommet-theme-hpe';
import {redefinit} from './theme';
import {ConnectedRouter} from 'connected-react-router';
import configureStore from './store';
import history from './history';
import {initialize, validateToken} from './actions/session';
import NavSidebar from './components/NavSidebar';
import {navResponsive} from './actions/nav';
import {AppHeader} from "./components/AppHeader";
import {ServerCluster as GrommetIcon} from "grommet-icons";
import {routeChanged} from "./actions/route";
import Login from './screens/Login';

const locale = getCurrentLocale();

// addLocaleData(en);
let messages;

try {
  messages = require(`./messages/${locale}`);
} catch (e) {
  messages = require('./messages/en-US');
}

const localeData = getLocaleData(messages, locale);
const localStorage = window.localStorage;

// listen for history changes and initiate routeChanged actions for them
history.listen((location) => {
  // const publish = store.getState().session.publishRoute;
  //console.log("history.listen: location: ", location);
  // console.log("publish: ", publish);
  // store.dispatch(routeChanged(location, false));
});

const store = configureStore(/* provide initial state if any */)
store.dispatch(initialize(window.location.pathname));
const currentState = store.getState();
//console.log("app: currentState ", currentState);
//console.log("app: currentState.session ", currentState.session);
//console.log("app: currentState auth ", currentState.session.data['isAuthenticated']);
//console.log("app: currentState token ", currentState.session.data['token']);
// if (currentState.session.data['isAuthenticated'] == true) {
//   store.dispatch(validateToken(currentState.session.data['token'], (tokenValid) => {}))
// }
if (currentState.session.data['isAuthenticated'] == true) {
  store.dispatch(validateToken(currentState.session.data['token'], (tokenValid) => {if (tokenValid == false) {
    window.location.href = "/ui/login";
  }}))
}


// if (window.location.pathname !== '/login') {
//   store.dispatch(initialize(window.location.pathname));
// }

const userSession = {
  user: {
    name: " ",
    thumbnail: ""
  },
  items: [
    {
      label: "Logout",
      href: "#"
    }
  ]
};


export default function App() {
  //console.log("window.location.pathname: ", window.location.pathname);
  //console.log("localStorage: ", localStorage);

  const {themeMode} = localStorage;

  const currentState = store.getState();
  //console.log("currentState: ", currentState);
  const {session, settings} = currentState;

  let themeModeSetting = themeMode ? themeMode.toLowerCase(): "light";
  // let themeModeSetting = themeMode ? settings.settings.themeMode.toLowerCase(): "light";



  let main_content = Routes();
  //console.log("App: main_content: ", main_content);

  // if (session.data['isAuthenticated'] == false  ) {
  //   main_content = (<Login></Login>);
  //   if (window.location.pathname != "/ui/login")
  //     // window.location.href = '/ui/login';
  //     console.log("Redirecting to login...");
  //     history.push({pathname: '/ui/login'});
  // }
  // else {
  //   main_content = Routes();
  // }

  let appIcon = "";
  if (process.env.NODE_ENV !== 'production') {
    // Code will be removed from production build.
    appIcon = "/img/newbma-logo-letter.svg";
  }
  else {
    appIcon = "/ui/img/newbma-logo-letter.svg";
  }

  return (
    <Grommet full={true} theme={redefinit} themeMode={themeModeSetting}>
      <Provider store={store}>
        <IntlProvider locale={localeData.locale} messages={localeData.messages}>
          <Router history={history}>
            {/*<id="top1" direction="row" align="start" pad="small" justify="start" fill="vertical"></>*/}
            <Grid id="grid" responsive={true} justify="stretch" fill
              rows={['auto', 'flex']}
              columns={['auto', 'flex']}
              areas={[
                { name: 'header', start: [0, 0], end: [1, 0] },
                { name: 'nav', start: [0, 1], end: [0, 1] },
                { name: 'main', start: [1, 1], end: [1, 1] },
              ]}
            >
              <Box elevation="medium" gridArea="header" >
                <AppHeader
                  appName="BMA"
                  appIcon={appIcon}
                  userSession={userSession}
                  isAuthenticated={session.data['isAuthenticated']}
                />
              </Box>
              <Box id={"sidebar"} elevation="medium" gridArea="nav">
                <NavSidebar/>
              </Box>
              <Box gridArea="main">
                {main_content}
              </Box>
            </Grid>
          </Router>
        </IntlProvider>
      </Provider>
    </Grommet>
  );
}

// export default () => (
//         <Provider store={store}>
//             <IntlProvider locale={localeData.locale} messages={localeData.messages}>
//                 <BrowserRouter >
//                     <Grommet full={true}>
//                         {routes1}
//                     </Grommet>
//                 </BrowserRouter>
//             </IntlProvider>
//         </Provider>
// );


