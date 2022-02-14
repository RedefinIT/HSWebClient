Migrating GrommetV1/ReactV15 to GrommetV2/ReactV16

Followed migration guide from
https://github.com/grommet/grommet/wiki/2.0-Migration-Guide

Fix PropTypes from React:
React v16 doesnt have this.
Prior to React 15.5.0, a utility named PropTypes was available as part
of the React package, which provided a lot of validators for configuring
type definitions for component props. It could be accessed with React.PropTypes.

However, in later versions of React, this utility has been moved to a separate
package named prop-types, so you need to add it as a dependency for your project
in order to get access to the PropTypes utility.

npm install prop-types --save

It can be imported into your project files as follows:
import PropTypes from 'prop-types';

Note that PropTypes is needed only for development and React doesnt use it in production for performance.

Source: https://blog.logrocket.com/validating-react-component-props-with-prop-types-ef14b29963fc/#usingproptypesinreact

Fix: es6-promise

Installed additional dependencies:
npm install es6-promise --save

Fix: Module note installed -> grommet/utils/rest
import Rest, { headers, buildQuery, processStatus } from 'grommet/utils/Rest';

Just commented in actions/Api.js as code using this module is not referenced anywhere.

grommet/utils/Rest/processStatus = local function with code from this obsolete grommet component.
// reject promise of response isn't ok
export function processStatus (response) {
  if (response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(response.statusText || `Error ${response.status}`);
  }
}



Fix: react-intl

import { IntlProvider, addLocaleData } from 'react-intl';

If you are using react-intl, you will need to add a dependency for it.
Grommet 2.0 does not include react-intl.

Fix: Module not found "grommet/utils/Locale" issue:
Created utils/Locale.js with missing functions.

Fix: NPM modules old/deprecated
Install latest, the following are installed latest:
react-redux
react-router

Fix: browserHistory missing in react-router

<Router> changed to <BrowserRouter> which is now available in 'react-router-dom'.
And omit the prop 'history' from Router component.

npm install react-router-dom --save

Source: https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/migrating.md

Fix: module not found
"import Article from 'grommet/components/Article';"
import Sidebar from 'grommet/components/Sidebar';

<Article> = <Box tag='article'>
<Section> = <Box tag='section'>
<Tiles> = <Box tag='tiles'>
<Tile> = <Box tag='tile'>
<Title> = use Header/Heading
<Sidebar> = <Box tag='sidebar'>

<Heading tag="h3"> = <Heading level=3>

Fix: Missing module Form/ FormFields

V2 doesnt have FormFields so omit this tag from the code. No substitute required.
Form and FormField are available.

Fix:
<Value> not available in V2.

Replace it with grommet-controls/Value

Fix: Missing Grommet ICONs

import Status from 'grommet/components/icons/Status';
import AddIcon from 'grommet/components/icons/base/Add';
import EditIcon from 'grommet/components/icons/base/Edit';

Icons are now in 'grommet-icons'.

Just Replace in import statement with:
grommet/components/icons/ = grommet-icons/icons/

# npm install grommet-icons

<Status value='warning'> = <StatusWarning>
<Add > = <Add>
<Edit > = <Edit>
<Close> = <Close>
<Trash> = <Trash>


With
import AddIcon from 'grommet-icons/icons/Add';



Fix:
import PasswordInput from 'grommet/components/PasswordInput';
import NumberInput from 'grommet/components/NumberInput'

<PasswordInput> = <TextInput type="password" />
<NumberInput> = <TextInput type="number">

Fix:
Module not found List/ ListItem

GrommetV2 List component looks very different. Need code change to use new List component.
But for now, its safe to replace these with simple HTML tags. Have the below code at top of every JS file:

Use below:
const List = props => <Box fill tag='ul' border='top' {...props} />;
const ListItem = props => (  <Box tag='li' border='bottom' pad='small' direction='row' justify='between' {...props}  />);

Or:

List is changed. No ListItem anymore.
Should be like:
        <List
          selectable={true}
          onClickItem={this._onSelect}
          onMore={onMore}>
          data={items}
        </List>

where, items is:

Fix:
import Notification from 'grommet/components/Notification';

Grommet V2 omitted Notification, Meter and other cool components. Dont know why.
However there is 'grommet-controls' that provides these missing components. But this module is from different Author.
From https://github.com/atanasster/grommet-controls

Install this component first:
# npm install grommet-controls

Replace
import Notification from 'grommet/components/Notification';
With
import Notification from 'grommet-controls/dist/components/Notification';

Fix: Module not found
import AnnotatedMeter from 'grommet-addons/components/AnnotatedMeter';

Changed to "Meter" for now. Need to modify this to make it work close to original.

Fix: Module not found
import Search from 'grommet/components/Search';

This component is missing in v2.
Temporarily substituted with <TextInput>

Fix: Module not found
import FilterControl from 'grommet-addons/components/FilterControl';

Omit it for now!

Fix: Module not found
import { getMessage } from 'grommet/utils/Intl';

Fix: Module not found:
import Split from 'grommet/components/Split';

Replace
     <Split flex='left' separator={true}>
With
      <Box tag='split' flex='left' separator={true}>
TODO need testing!

Fix: Module not found:
import LoginForm from 'grommet/components/LoginForm';

Replace with HTML5 tag <form>. TODO Need some improvement here!

Fix: Module not found
import { announcePageLoaded } from 'grommet/utils/Announcer';

TODO Commented for now. Need to find right alternative.


Fix: Babel dependencies

babel-preset-es2015 is deprecated now.
Change:
babel-preset-es2015 -> babel-preset-env

And modify '.babelrc':
From: {
        "presets": [ "es2015", "react" ],
        "plugins": [ "transform-object-rest-spread" ],
        "env": {
          "development": {
            "presets": ["react-hmre"]
          }
        }
      }
To:
{
  "presets": [ "env", "react" ],
  "plugins": [ "transform-object-rest-spread" ],
  "env": {
    "development": {
      "presets": ["react-hmre"]
    }
  }
}
Ref: https://babeljs.io/docs/en/env/


Change:
babel-preset-react-hmre ->

Fix: Changes to webpack.config.babel.js

Change:
import path from 'path';
To:
const path = require('path');

Change:
import webpack from 'webpack';
To:
const webpack = require('webpack');

Change:
import CopyWebpackPlugin from 'copy-webpack-plugin';
To:
const CopyWebpackPlugin = require('copy-webpack-plugin');


Fix: issue with copy-webpack-plugin when building using 'npm run dev':

'npm upgrade' upgraded NPM modules to latest, but copy-webpack-plugin@8.1.1 is not compatible with existing webpack configuration.
So downgrade this version to match with grommet-sample sources.

Make sure the package.json has this particular version of copy-webpack-plugin (the latest one is 8.1.1 which is not compatible):
"copy-webpack-plugin": "^4.0.1",

Fix: UglifyJsPlugin is not supported, use minimize.
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({

Deleted this plugin from webpack.config.babel.js
TODO

Fix: grommet-templates
This is a very old component not updated for latest grommet.
Trying to eliminate this dependency. 3 files have references to this.

Delete this dependency and try.

<IPAddressInput> = local IPAddressInput
Copied IPAddressInput.js to the sources from https://raw.githubusercontent.com/grommet/grommet-templates/master/src/js/components/IPAddressInput.js
and made required changes for Grommet V2.


Fix: Module not found
import App from 'grommet/components/App';

Change:
import App from 'grommet/components/App';
To:
import App from 'grommet/components/Grommet';

Fix: Grommet-cli dependency.

grommet-cli is no more available in GrommetV2. If the build scripts use grommet cli instead of webpack,
then there is need for migration to alternate options.

package.json has script entries that invoke grommet cli.
  "scripts": {
    "test": "grommet check",
    "dev-server": "nodemon ./server/dev",
    "dev": "cross-env PORT=3006 NODE_OPTIONS='--trace-warnings' NODE_ENV=development webpack --config webpack.config.babel.js",
    "dist": "cross-env NODE_ENV=production grommet pack",
    "dist-server": "babel -d ./dist-server ./server -s",
    "start": "npm run dist"
  },

changing:
 "dev": "cross-env PORT=3006 NODE_OPTIONS='--trace-warnings' NODE_ENV=development grommet pack",
to:
 "dev": "cross-env PORT=3006 NODE_ENV=development webpack serve --mode=development --config webpack.config.babel.js",

Note: If you're using webpack-cli 4 or webpack 5, change webpack-dev-server to webpack serve


changing:
    "dist": "cross-env NODE_ENV=production grommet pack",
to:
    "dist": "cross-env NODE_ENV=production webpack",


Fix: babel-loader compatibility with Babel 7.x

Use babel-loader v8 (   "babel-loader": "^8.2.2") when babel version is v7.x


Fix: Module not found 'grommet/components/Search'
This component is missing in GrommetV2

Fix: Module not found 'grommet-addons/components/ListPlaceholder'
Remove the code as temp fix. TODO proper fix.

Fix: Module not found 'grommet-addons/utils/Query'

Commenting the code as temp fix. TODO correct fix.

Fix:
ERROR in ./src/scss/index.scss
Module build failed (from ./node_modules/sass-loader/dist/cjs.js):
TypeError: this.getOptions is not a function
    at Object.loader (/Users/govindavireddi/redefinit/bma-ui/node_modules/sass-loader/dist/index.js:25:24)
 @ ./src/js/index.js 5:0-28
 @ multi ./node_modules/react-dev-utils/webpackHotDevClient.js ./src/js/index.js

src/scss/index.scss has:
@import '~grommet/scss/grommet-core/index';

Removed index.scss and made following changes to index.html
Change:
<link rel="stylesheet" type="text/css" href="/index.css">
To:
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />

Removed reference to index.scss from src/js/index.js:
import '../scss/index.scss';

Fix: Dependency on deprecated component
import JsonTree from 'react-json-dom';
This is last updated 5 years ago. Time to change it.

Code is:
import JsonTree from 'react-json-dom';
<JsonTree jsonObject={this.state.deployCSV} />

Change to:

import JSONTree from 'react-json-tree'
<JSONTree data={this.state.deployCSV} />


Fix: Error fro the brownse
Error message:
```
Error: Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.

Check the render method of `Login`.
```
Solution:

Use all import statements like:
import { Box } from 'grommet';
instead of:
import Box from 'grommet/components/Box';

But not for local imports like:
import NavSidebar from './NavSidebar';

***Good reference code for Grommet V2***
https://github.com/cengizcan/react-redux-grommet-boilerplate


Fix:
router object missing
router.push({pathname: '/deploy'})

Solution:
Using connected-react-router and followed instructions from following link to make changes:
https://www.npmjs.com/package/connected-react-router


Fix: Warnings from browser console:
Error in parsing value for ‘-webkit-box-align’.  Declaration dropped

These warnings are due to some issue with Firefox on Centos 7. Not seeing in Chrome.

Fix: Changes in Anchor component in Grommet v2
Replace the component prop 'path' with 'href'.

From:
            <Anchor path="/oneviewappls" icon={<CloseIcon />}
                    a11yTitle={`Close ${this.props.heading} Form`}/>
To:
            <Anchor href="/oneviewappls" icon={<CloseIcon />}
                    a11yTitle={`Close ${this.props.heading} Form`}/>

Fix: history push() for navigation
It turns out that according to the linked github discussions, that version 5.0 of the history package is causing the issue and downgrading to version 4.10.1 solves the problem for me.
```
npm install history@4.10.1
```
Source: https://stackoverflow.com/questions/54315988/connectedrouter-error-could-not-find-router-reducer-in-state-tree-it-must-be-m

Programmatically navigating to pages:
https://dev.to/projectescape/programmatic-navigation-in-react-3p1l
