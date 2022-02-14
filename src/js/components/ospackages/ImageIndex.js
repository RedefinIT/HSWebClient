
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadImageOsTypes, loadImages, unloadImages, queryIndex, moreIndex
  } from '../../actions/image';
import {Box, Header, Anchor, List, Heading, Text, Meter, Button} from 'grommet';
import {Add as AddIcon, CircleAlert, Edit, More} from 'grommet-icons';
import NavControl from '../NavControl';
import history from '../../history';

class ImageIndex extends Component {

  constructor (props) {
    super(props);
    this.onAction = this.onAction.bind(this);
    this.onChildren = this.onChildren.bind(this);
    this._onSearch = this._onSearch.bind(this);
    this._onMore = this._onMore.bind(this);
    this._onSelect = this._onSelect.bind(this);
    this.state = { image: {}, searchText: '' };
  }

  componentDidMount () {
    this.props.dispatch(loadImages({ category: 'ospackage', sort: 'name:asc' }));
  }

  componentWillUnmount () {
    this.props.dispatch(unloadImages());
  }

  _onSearch (event) {
    const { index } = this.props;
    const searchText = event.target.value;
    this.setState({ searchText });
    // const query = new Query(searchText);
    // this.props.dispatch(queryIndex(index, query));
    this.props.dispatch(queryIndex(index, {}));
  }

  _onMore () {
    const { index } = this.props;
    this.props.dispatch(moreIndex(index));
  }

  _onSelect (selection) {
    // this.setState({ selection: selection });
  }

  onChildren(datum, index) {
    //console.log("onChildren: ", index);
    //console.log(datum);
    return (
      <Box flex='shrink' key={index} direction="row" pad={{between: 'xsmall'}} align="center">
        <Text truncate={true} margin="small"> {datum.package}</Text>
        <Box flex="grow" align="center" justify="center" gap="small"
             background={{"color":"text-xweak"}}
             border={{"color":"border","style":"ridge","size":"small"}}
             margin="small" round="xsmall" elevation="xsmall" >
          <Text color='text-strong' margin="xsmall" size="small">
            {datum.osType}
          </Text>
        </Box>
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
                    icon={<Edit />}
                    onClick={() => {history.push({ pathname: `/ui/images/edit/${datum.uri}`})}}/>);
  }

  render () {
    //console.log("Images: this.props: ", this.props);
    const { error, images} = this.props;
    const { intl } = this.context;

    //console.log("Images: images: ", images);

    let images_list = [];
    let notif = "";

    // if ('error' in images && 'status' in images['error']) {
    //   //console.log("Error loading images: images['error']: ", images['error'])
    //   // Error loading images list
    //   images_list = [];
    //   notif = ( <Box
    //     animation="fadeIn"
    //     align="center"
    //     background="validation-critical"
    //     direction="row"
    //     gap="xsmall"
    //     margin={{top: 'medium', bottom: 'medium'}}
    //     pad="small"
    //     round="4px"
    //   >
    //     <CircleAlert size="small"/>
    //     <Text color='status-error' size="xsmall">{images.error['statusText']}</Text>
    //   </Box>);
    // }
    // else {
    images_list = images;
    // }

    const { searchText } = this.state;

    let addControl;
    addControl = (
        <Button icon={<AddIcon />} onClick={() => {history.push({ pathname: `/ui/images/add`})}} a11yTitle={`Add image`} />
    );

    return (
      <Box align="stretch" pad="small" overflow="auto" flex="grow" fill="vertical" >
        <Header size='large' pad={{ horizontal: 'medium' }}>
          <Box tag='title' direction="column" responsive={false}>
            <div>
            <Heading size="small" level={4} strong={false} >Images</Heading>
            <Heading size="small" level={5} strong={false} >Firmware Bundles and OS Installers</Heading>
            </div>
          </Box>
          {addControl}
        </Header>
        {notif}
        <List
          onClickItem={this._onSelect}
          border={{"style":"solid","side":"top","size":"small"}}
          gap="xsmall"
          pad="xsmall"
          data={images_list}
          children={this.onChildren}
          action={this.onAction}
        />
      </Box>
    );
  }
};

ImageIndex.defaultProps = {
  error: undefined,
  images: [],
  osTypes: [],
  uploads: []
};

ImageIndex.propTypes = {
  dispatch: PropTypes.func,
  error: PropTypes.object,
  images: PropTypes.arrayOf(PropTypes.object),
  osTypes: PropTypes.arrayOf(PropTypes.object),
  uploads: PropTypes.arrayOf(PropTypes.object)
};

ImageIndex.contextTypes = {
  intl: PropTypes.object,
  dispatch: PropTypes.func,
  error: PropTypes.object,
  images: PropTypes.arrayOf(PropTypes.object),
  osTypes: PropTypes.arrayOf(PropTypes.object),
  uploads: PropTypes.object
};

// const select = state => ({ ...state.images });
let select = (state, props) => {
  //console.log("select state: ", state);
  return {
    images: state.image.images,
    error: state.image.error,
    uploads: state.image.uploads,
    osTypes: state.image.osTypes
  };
};

export default connect(select)(ImageIndex);
