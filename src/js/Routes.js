
import React, { Component } from 'react';

import Login from './screens/Login';
import OneViewAppls from './screens/RMListView';
import OneViewApplAdd from './screens/RMAdd';
import OneViewApplForm from './screens/RMForm';
import Dashboard from './screens/Dashboard';
import Settings from './screens/Settings';
import NotFound from './screens/NotFound';
import Main from './components/Main';
import KickstartViewer from './components/kickstarts/KickstartViewer';
import KickstartAdd from './components/kickstarts/KSAdd';
import ImageIndex from './components/ospackages/ImageIndex';
import ImageAdd from './components/ospackages/ImageAdd';
import ImageEdit from './components/ospackages/ImageEdit';
import DeployServers from './screens/DeployServers';
import DeployServerProgress from './screens/DeployServerProgress';
import ActivityIndex from './components/activity/ActivityIndex';
// import DeploymentNetworks from './screens/env/DeploymentNetworks';
import EnvironmentForm from "./screens/env/EnvironmentsForm";
import EnvironmentAdd from './screens/env/EnvironmentsAdd';
import Discovery from './screens/Discovery';
import About from './screens/About';
import TaskDetails from "./screens/TaskDetails";
import Lifecycle from './screens/lifecycle/lifecycle';
import {Route, useRouteMatch} from 'react-router-dom';
import {Box} from "grommet";
// import EnvironmentForm from "./screens/lifecycle/environmentForm";
// import EnvironmentAdd from "./screens/lifecycle/environmenAdd";
import Environments from "./screens/env/Environments";
import ResPools from "./screens/pools/ResPools";
import ResPoolAdd from "./screens/pools/ResPoolAdd";
import ResPoolView from "./screens/pools/ResPoolView";
import ServerAdd from "./screens/pools/ServersAdd";

export default function () {
  // const { path } = useRouteMatch();
  let prefix = "/ui";

  if (process.env.NODE_ENV === 'production') {
    // Code will be removed from production build.
    prefix = "/ui";
  }
  else {
    prefix = "/ui";
  }

  //console.log("useRouteMatch prefix: ", prefix);

  return (
    <Box id="routesbox" as="main" overflow="auto" flex="grow" fill="vertical" align="center" justify="between" direction="row" >
      <Route exact path={`/`} component={Main} />
      <Route exact path={`${prefix}/`} component={Main} />
      <Route exact path={`${prefix}/dashboard`} component={Dashboard} />
      <Route exact path={`${prefix}/login`} component={Login} />
      <Route exact path={`${prefix}/logout`} component={Login} />
      <Route path={`${prefix}/images/edit/*`} component={ImageEdit} />
      <Route path={`${prefix}/images/add`} component={ImageAdd} />
      <Route exact path={`${prefix}/images`} component={ImageIndex} />
      <Route path={`${prefix}/kickstarts/add`} component={KickstartAdd} />
      <Route exact path={`${prefix}/kickstarts`} component={KickstartViewer} />
      <Route path={`${prefix}/discovery`} component={Discovery} />
      <Route exact path={`${prefix}/respools`} component={ResPools} />
      <Route path={`${prefix}/respools/view/*`} component={ResPoolView} />
      <Route path={`${prefix}/respools/addpool`} component={ResPoolAdd} />
      <Route path={`${prefix}/respools/addservers`} component={ServerAdd} />
      <Route path={`${prefix}/deploy`} component={DeployServers} />
      <Route path={`${prefix}/lc`} component={Lifecycle} />
      <Route path={`${prefix}/lc/env/add`} component={EnvironmentAdd} />
      <Route path={`${prefix}/lc/env/edit/*`} component={EnvironmentForm} />
      <Route path={`${prefix}/taskdetails/*`} component={TaskDetails} />
      <Route path={`${prefix}/deployprogress/*`} component={DeployServerProgress} />
      <Route exact path={`${prefix}/env/edit/*`} component={EnvironmentForm} />
      <Route exact path={`${prefix}/env/add`} component={EnvironmentAdd} />
      <Route exact path={`${prefix}/env`} component={Environments} />
      <Route path={`${prefix}/rm/edit/*`} component={OneViewApplForm} />
      <Route path={`${prefix}/rm/add`} component={OneViewApplAdd} />
      <Route exact path={`${prefix}/rm`} component={OneViewAppls} />
      <Route path={`${prefix}/activity`} component={ActivityIndex} />
      <Route path={`${prefix}/settings`} component={Settings} />
      <Route path={`${prefix}/about`} component={About} />
    </Box>
  );
}
