import React, { Component, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Edit, Favorite, ShareOption, View} from 'grommet-icons';

import {Box, Button, Card, CardBody, CardFooter, CardHeader, Grid, Header, Heading, Meter, Stack, Text} from 'grommet';

import { pageLoaded } from '../utils';
import {Add as AddIcon} from "grommet-icons/icons";
import EnvironmentAdd from "./EnvironmentsAdd";
import {loadEnvironments, unloadNetworks} from "../../actions/env";
import history from '../../history';

class Environments extends Component {
    constructor (props) {
        super(props);

        this.onCardClick = this.onCardClick.bind(this)
        this.handleAddEnv = this.handleAddEnv.bind(this)
        this.handleCancel = this.handleCancel.bind(this)

        this.state = { addEnv: false};
    }


    componentDidMount() {
        pageLoaded('Environments');
        //console.log("componentDidMount: ")
        this.props.dispatch(loadEnvironments());
    }

    componentWillUnmount() {
        this.props.dispatch(unloadNetworks());
    }

    handleAddEnv(event, newEnvData) {
        //console.log("handleAddEnv: newEnvData: ", newEnvData);
    }

    handleCancel(event) {
        //console.log("handleCancel");
        this.setState({addEnv: false});
    }

    _renderLayer () {
        let addControls = "";
        let iloPasswordMismatch;

        if (this.state.addEnv === true) {

            let heading = "Add Environment";

            addControls =
                // <DeploymentAddHost onClose={this._onLayerClose}
                <EnvironmentAdd
                    heading={heading}
                    handleAddEnv={this.handleAddEnv}
                    handleCancel={this.handleCancel}
                />
        }

        return addControls;
    }

    onCardClick(event, data) {
        //console.log("onCardClick 1: ", event);
        //console.log("onCardClick 2: ", data);
        //console.log("onCardClick 3: ", event.target);

    }

    render() {
        const { error, env } = this.props;
        console.log("Environments: render(): this.props: ", this.props);
        //console.log("Environments: render(): data: ", env);
        const { intl } = this.context;

        let environments_cards = "";

        if(env.members.length > 0){
            environments_cards = env.members.map((value, index) => (
                <Card key={index} background={{"color":"background-contrast"}} >
                    <CardHeader pad="medium">
                        <Text weight='bold' level={2}>{value['name']} ({value['envType']})</Text>
                    </CardHeader>
                    <CardBody pad="medium">
                        <Text><b>GW:</b>   {value['mgmtNetwork']['gateway']}</Text>
                        <Text><b>NM:</b>   {value['mgmtNetwork']['subnetmask']}</Text>
                        <Text><b>DNS1:</b> {value['mgmtNetwork']['dns1']}</Text>
                        <Text><b>VLAN:</b> {value['mgmtNetwork']['vlan']}</Text>
                    </CardBody>
                    <CardFooter pad={{horizontal: "small"}} background="light-2">
                        <Button
                            icon={<View color="blue"/>}
                            hoverIndicator
                        />
                        <Button icon={<Edit color="graph-0" />} hoverIndicator onClick={() => {history.push({pathname: '/ui/env/edit/' + value.name})}} />
                    </CardFooter>
                </Card>
            ));

        }


        let layerAddEnv = this._renderLayer();

        let addControl;
        addControl = (
            <Button icon={<AddIcon />} onClick={() => this.setState({addEnv: true})} a11yTitle={`Add Environment`} />
        );
        // <Box align="stretch" pad="small" overflow="auto" flex="grow" fill="vertical" >
        return (
            <Box id="top2" fill="vertical" overflow="auto" align="start" flex="grow"  justify="start" direction="row-responsive" pad="small"  >
                <Box id="top3" overflow="visible" align="stretch" flex="grow"  justify="start" direction="column" pad="large"  >
                    <Header size='large' pad={{ horizontal: 'medium' }}>
                        <Heading size="small" level={4} strong={false} >Environments</Heading>
                        {addControl}
                    </Header>
                    <Grid gap="medium" columns={{ count: 'fill', size: 'small' }}>
                        {environments_cards}
                    </Grid>
                </Box>
                {layerAddEnv}
            </Box>

        );
    }
}

Environments.defaultProps = {
    error: undefined,
    env: {}
};

Environments.propTypes = {
    dispatch: PropTypes.func.isRequired,
    error: PropTypes.object,
    env: PropTypes.object
};

Environments.contextTypes = {
    intl: PropTypes.object
};

const select = state => ({ ...state.env });

export default connect(select)(Environments);
