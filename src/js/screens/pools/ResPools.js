import React, {Component, useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Edit, Favorite, Search, ShareOption, View} from 'grommet-icons';

import {
    Box,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Grid,
    Header,
    Heading,
    Meter,
    Stack,
    Text,
    TextInput
} from 'grommet';

import {pageLoaded} from '../utils';
import {FormAdd as AddIcon, FormSubtract as DeleteIcon, DocumentDownload as ReportIcon} from "grommet-icons/icons";
import {loadPools, unloadPools} from "../../actions/pools";
import history from '../../history';

class ResPools extends Component {
    constructor(props) {
        super(props);

        this.onCardClick = this.onCardClick.bind(this)
        this.handleAddPool = this.handleAddPool.bind(this)
        this.handleCancel = this.handleCancel.bind(this)

        this.state = {addPool: false};
    }


    componentDidMount() {
        pageLoaded('ResPools');
        //console.log("componentDidMount: ")
        this.props.dispatch(loadPools());
    }

    componentWillUnmount() {
        this.props.dispatch(unloadPools());
    }

    handleAddPool(event) {
        console.log("handleAddPool: ");
        history.push({pathname: '/ui/respools/addpool'});
    }

    handleAddServers(event) {
        console.log("handleAddPool: ");
        history.push('/ui/respools/addservers');
    }

    handleCancel(event) {
        //console.log("handleCancel");
        this.setState({addPool: false});
    }

    onCardClick(event, data) {
        //console.log("onCardClick 1: ", event);
        //console.log("onCardClick 2: ", data);
        //console.log("onCardClick 3: ", event.target);
    }

    render() {
        const {error, pools} = this.props;
        console.log("ResPools: render(): this.props: ", this.props);
        //console.log("ResPools: render(): data: ", pools);
        const {intl} = this.context;

        let pools_cards = "";

        if (pools.pools.length > 0) {
            pools_cards = pools.pools.map((value, index) => (
                <Card key={index} background={{"color": "background-contrast"}} onClick={() => {
                    history.push({pathname: '/ui/respools/view/' + value.name})}}>
                    <CardHeader pad="medium">
                        <Text weight='bold' level={2}>{value['name']} ({value['method']})</Text>
                    </CardHeader>
                    <CardBody pad="medium">

                    </CardBody>
                    <CardFooter pad={{horizontal: "small"}} background="light-2">
                        <Button
                            icon={<View color="blue"/>}
                            hoverIndicator
                        />
                        <Button icon={<Edit color="graph-0"/>} hoverIndicator onClick={() => {
                            history.push({pathname: '/ui/respools/edit/' + value.name})
                        }}/>
                    </CardFooter>
                </Card>
            ));
        }

        let addControl = "";
        addControl = (
            <Box direction="row-responsive" gap="small" wrap responsive>
                <Box>
                    <TextInput icon={<Search/>} reverse placeholder="search ..."/>
                </Box>
                <Button label={"Pool"} icon={<AddIcon/>} onClick={this.handleAddPool} a11yTitle={`Add Pool`}/>
                <Button label={"Servers"} icon={<AddIcon/>} onClick={this.handleAddServers} a11yTitle={`Add Servers`}/>
                <Button label={"Servers"} icon={<DeleteIcon/>} onClick={this.handleAddPool}
                        a11yTitle={`Delete Servers`}/>
                <Button label={"Report"} icon={<ReportIcon/>} onClick={this.handleAddPool} a11yTitle={`Report`}/>
            </Box>
        );
        // <Box align="stretch" pad="small" overflow="auto" flex="grow" fill="vertical" >
        return (
            <Box id="top2" fill="vertical" overflow="auto" align="start" flex="grow" justify="start"
                 direction="row-responsive" pad="small">
                <Box id="top3" overflow="visible" align="stretch" flex="grow" justify="start" direction="column"
                     pad="large">
                    <Header size='large' pad={{horizontal: 'medium'}}>
                        <Heading size="small" level={4} strong={false}>Server Pools</Heading>
                    </Header>
                    {addControl}
                    <br/>
                    <Grid gap="medium" columns={{count: 'fill', size: 'medium'}}>
                        {pools_cards}
                    </Grid>
                </Box>
            </Box>
        );
    }
}

ResPools.defaultProps = {
    error: undefined,
    pools: {}
};

ResPools.propTypes = {
    dispatch: PropTypes.func.isRequired,
    error: PropTypes.object,
    pools: PropTypes.object
};

ResPools.contextTypes = {
    intl: PropTypes.object
};

const select = state => ({...state.pools});

export default connect(select)(ResPools);
