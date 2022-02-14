import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import {Anchor, Box, Button, Header, Heading, List, Text} from 'grommet';
// import Box from 'grommet/components/Box';
// import Header from 'grommet/components/Header';
// import List from 'grommet/components/List';
// import ListItem from 'grommet/components/ListItem';
// const List = props => <Box fill tag='ul' border='top' {...props} />;
// const ListItem = props => (  <Box tag='li' border='bottom' pad='small' direction='row' justify='between' {...props}  />);

import {Add as AddIcon, CircleAlert, Edit as EditIcon} from 'grommet-icons';
// import Title from 'grommet/components/Title';
// import EditIcon from 'grommet-icons/icons/Edit';

// import { getMessage } from 'grommet/utils/Intl';

import {
  loadIntegrations, unloadIntegrations
} from '../actions/integrations';

import { pageLoaded } from './utils';
import {Edit} from "grommet-icons";
import history from '../history';

class RMListView extends Component {

  constructor(props){
    super(props);

    this._onSelect = this._onSelect.bind(this);
  }

  componentDidMount() {
    pageLoaded('RMListView');
    console.log("RMListView: componentDidMount: ");
    this.props.dispatch(loadIntegrations());
  }

  componentWillUnmount() {
    this.props.dispatch(unloadIntegrations());
  }

  _onSelect (selection) {
    // this.setState({ selection: selection });
  }

  onChildren(datum, index, obj) {
    //console.log("onChildren: ", index);
    //console.log("onChildren: obj", obj);
    //console.log(datum);

    return (
      <Box key={index} direction="row" pad={{between: 'small'}} align="center">
        <Text truncate={true} margin="small"> {datum.alias}</Text>
      </Box>
    );
  }

  onAction(datum, index) {
    //console.log("onAction: ", index);
    //console.log(datum);
    return (<Button plain={false}
                    key={index}
                    margin="xsmall"
                    type="button"
                    icon={<EditIcon />}
                    onClick={() => history.push({pathname: `/ui/rm/edit/${datum.alias}`})}/>);
  }


  render() {
    //console.log("RMListView: this.props: ", this.props);
    const { error, integrations} = this.props;
    const { intl } = this.context;

    let key=0;

    let edit;
    let role = 'write';
    let configuredIntegrations = "";

    let integrations_list = "";
    let notif = "";

    console.log("integrations: ", integrations)

    if (integrations && 'error' in integrations && 'status' in integrations['error']) {
      //  Error loading networks
      integrations_list = [];
      notif = ( <Box
        animation="fadeIn"
        align="center"
        background="validation-critical"
        direction="row"
        gap="xsmall"
        margin={{top: 'medium', bottom: 'medium'}}
        pad="small"
        round="4px"
      >
        <CircleAlert size="small"/>
        <Text color='status-error' size="xsmall">{integrations.error['msg']}</Text>
      </Box>);

    }
    else {
      integrations_list = integrations['integrations'];
    }

    let addControl;
    addControl = (
      <Button icon={<AddIcon />} onClick={() => {history.push({ pathname: '/ui/rm/add'})}} a11yTitle={`Add Connection`} />
    );

    let notifications = "";
    // console.log("configuredIntegrations: ", configuredIntegrations);

    return (
      <Box align="stretch" pad="small" overflow="auto" flex="grow" fill="vertical">
        <Header size='large' pad={{ horizontal: 'medium' }}>
          <Heading size="small" level={4} strong={false} >Registered Resource Managers</Heading>
          {addControl}
        </Header>
        {notif}
        <List
          onClickItem={this._onSelect}
          border={{"style":"solid","side":"top","size":"small"}}
          focus={false}
          gap="xsmall"
          pad="xsmall"
          data={integrations_list}
          onMouseOver={() => {}}
          children={this.onChildren}
          action={this.onAction}
          />
        {/*<List selectable={true} onSelect={this._onSelect} >*/}
        {/*  {configuredIntegrations}*/}
        {/*</List>*/}
      </Box>
    );
  }
}

RMListView.defaultProps = {
  error: undefined,
  integrations: {}
};

RMListView.propTypes = {
  dispatch: PropTypes.func,
  error: PropTypes.object,
  integrations: PropTypes.object
};

RMListView.contextTypes = {
  intl: PropTypes.object,
  dispatch: PropTypes.func,
  error: PropTypes.object,
  integrations: PropTypes.object
};

const select = state => ({ ...state.oneviewappls });

export default connect(select)(RMListView);
