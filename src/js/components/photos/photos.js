/**
 * Created by govind on 2/Feb/2022.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadImageOsTypes, loadImages, unloadImages, queryIndex, moreIndex
} from '../../actions/image';
import {Box, Header, Anchor, Grid, List, Heading, Text, Meter, Button, Card, CardBody, TextInput} from 'grommet';
import {Add as AddIcon, CircleAlert, Edit, More, Search} from 'grommet-icons';
import NavControl from '../NavControl';
import history from '../../history';





import PhotoFrame from './photoframe';
// var PhotoFrame = require('./photoframe');
// var index = require("../../actions/indexactions");

// import {indexLoad, indexUnLoad, indexNextMore, indexNav} from '../../actions/indexactions';
import {documentsLoad, documentsNav, documentsNextMore, documentAdd, documentsUnLoad} from '../../actions/documentsactions';

import Immutable, {Map, List} from 'immutable';
let HSFileUpload = require('../hsfileupload/hsfileupload');

// var Photos = React.createClass({
class Photos extends Component{

  constructor(props) {
    super(props);

    this.handleScroll = this.handleScroll.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onCameraFilterClick = this.onCameraFilterClick.bind(this);
    this._onSearchChange = this._onSearchChange.bind(this);
    this._onSearchClick = this._onSearchClick.bind(this);
    this._onSearchEnter = this._onSearchEnter.bind(this);
    this.onSearch = this.onSearch.bind(this);

    this.state = {search: "", query: {}, selection: -1};

  }

  /*
   * This function will be called right after the component mounting on DOM
   * and before render()
   * */
  componentWillMount() {

  }
  componentWillReceiveProps(nextProps) {
    console.log("componentWillReceiveProps: ", nextProps);
    if (nextProps.category && this.props.category !== nextProps.category) {
      this.props.dispatch(documentsUnLoad(this.props.documents));
      this.props.dispatch(
        documentsLoad(nextProps.category, nextProps.index, this.props.selection));
    }

  }

  /*
   * This function will be called after render()
   * It is good idea to perform any async operations here as render can show some default
   * content first and this function can asyncronously trigger render() when there is data
   * */
  componentDidMount() {

    console.log("componentDidMount this.props ", this.props);
    console.log("componentDidMount this.props.documents ", this.props.documents);
    console.log("componentDidMount query", this.props.documents.get('context'));
    window.addEventListener('scroll', this.handleScroll);
    this.props.dispatch(documentsLoad("photos", this.props.documents.get('context')));

  }

  componentWillUnmount() {
    console.log("photos componentWillUnmount");

    window.removeEventListener('scroll', this.handleScroll);
    this.props.dispatch(documentsUnLoad("photos", this.props.documents));

  }


  handleScroll(event) {

    if (event.pageY === 0 ) {
      //if pageY == 0 the page is scrolled up to the TOP.
      // If previous items should be queried to server then this is that place
      console.log("handleScroll UP so get previous items");
      // this.props.dispatch(documentsPrevMore("photos"));
    } else if (event.pageY === event.view.scrollMaxY) {
      //if pageY == 0 the page is scrolled down to the END.
      // If next items should be queried to server then this is that place
      console.log("handleScroll DOWN so get more ahead documents: ", this.props.documents);
      console.log("handleScroll DOWN so get more ahead documents: ", this.state.query);
      this.props.dispatch(documentsNextMore("photos", this.props.documents, this.props.documents.get('context')));
    }

  }

  _onSearchChange (event) {
    console.log("Main: _onChange: ", event.target.value);
    console.log("Main: this.state: ", this.state);
    this.setState({search: event.target.value});
  }


  _onSearchClick (event) {
    console.log("Main: _onSearchClick: event: ", event.target);
    console.log("Main: _onSearchClick: this.state: ", this.state);

    this.onSearch();

  }

  _onSearchEnter (event) {
    console.log("Main: _onSearchEnter: event: ", event.target);
    console.log("Main: _onSearchEnter: event key: ", event.key);
    if(event.key === 'Enter') {
      this.onSearch();
    }
  }

  onSearch() {
    let context = this.props.documents.get('context');
    context.search = this.state.search;
    this.props.dispatch(documentsLoad("photos", context));

  }



  onClick(selection) {
    console.log("onClick photos clicked ", selection);
    // this.props.dispatch(documentsNav("/photos/photoframe", "photoframe", e));

    // console.log("onClick: this.props.documents: ", this.props.documents);
    let currentBegin = this.props.documents.get('result').get('currentBegin');
    let currentEnd = this.props.documents.get('result').get('currentEnd');
    console.log("onClick photos currentBegin ", currentBegin);
    console.log("onClick photos currentEnd ", currentEnd);

    if(selection >= currentBegin && selection <= currentEnd){
      this.setState({ selection: selection});
    }

    if(selection === currentEnd - 1){
      // Need to load next documents
      this.props.dispatch(documentsNextMore("photos", this.props.documents, this.props.documents.get('context')));
    }
    else if(selection === currentBegin ){
      // Need to load previous documents
      // this.props.dispatch(documentsNextMore("photos", this.props.documents, this.props.documents.get('context')));
    }




  }

  onCameraFilterClick(event) {
    console.log("onCameraFilterClick: event", );
    console.log("onCameraFilterClick: query: ", this.state.query);

    let query = {};

    if(this.state.query.hasOwnProperty('camerafilter')
      && event.target.innerText === this.state.query.camerafilter) {
      // If the user selects already selected filter item then remove that filter item
      query = {};
    } else {
      query = {camerafilter: event.target.innerText};
    }
    this.setState({query: query});
    console.log("onCameraFilterClick: after query: ", query);

    // this.props.dispatch(documentsFilter("photos", {query: query}));
    this.props.dispatch(documentsLoad("photos", {query: query}));

  }

  render () {

    // const { filterActive, searchText, selection } = this.state;
    const { selection } = this.state;

    // console.log("photos this.props: ", this.props);
    // console.log("photos this.props: ", this.props.documents.getIn(['result']));
    // console.log("photos this.props: Selection: ", selection);
    let context = this.props.documents.getIn(['context']);
    // console.log("photos context: ", context);

    let items = this.props.documents.get('result').get('items');
    let filters = this.props.documents.get('result').get('filters');
    // console.log("photos filters: ", filters);
    // console.log("photos filters.camera: ", filters.camera);
    // console.log("photos items count: ", this.props.documents.get('result').get('total'));

    let elements, detailsLayer, photosmenu;


    let camerafilters = (<div className="item"> None found!!!  </div>);

    if(filters.camera) {
      camerafilters = filters.camera.map((item, index) => {

        if(item === this.state.query.camerafilter) {
          return (
            <div className="ui selected  item" onClick={this.onCameraFilterClick}>
              {item}
            </div>
          );

        }
        else {
          return (
            <div className="ui item" onClick={this.onCameraFilterClick}>
              {item}
            </div>
          );

        }
      });

    }

    photosmenu =
      (
        <div className="ui menu">
          <a className="ui button item">
            Location
          </a>
          <div className="ui simple labeled icon dropdown button">
            <i className="filter icon"></i>
            <span className="text">Camera</span>
            <div className="menu" onClick={this.onCameraFilterClick}>

              <div class="ui icon search input">
                <i className="search icon"></i>
                <input placeholder="Search tags..." type="text"></input>
              </div>
              <div className="divider"></div>
              <div className="header">
                <i className="tags icon"></i>
                Select Camera...
              </div>
              {camerafilters}
            </div>
          </div>
          <a className="item">
            Date
          </a>
          <a className="item">
            Rating
          </a>
        </div>

      );

    if(selection >= 0) {
      detailsLayer = (
        <PhotoFrame photoitem={items[selection]} index={selection} onSelect={this.onClick} view="fullview"  />
      );

      // Dont show the menu in photoframe view
      photosmenu = undefined;
    }
    else {
      if(items) {
        // let elements = this.props.index.result.items.map((item, index) => {
        elements = items.map((item, index) => {
          return (
            <Card>
              <CardBody>
                <PhotoFrame photoitem={item} view='listview' index={index} onSelect={this.onClick}/>
              </CardBody>
            </Card>
          );
        });
      }
    }

    console.log("elements: ", elements);
    console.log("camerafilters: ", camerafilters);
    let tag = {'category': "photos", 'directory': context.directory};
    console.log("tag", tag);

    return (
      <Box direction={"column"}>
        <Box direction={"column"}>
          <Box direction="column">
            <a>
              <HSFileUpload caption="Upload Photos" context={tag}/>
            </a>
            <Box fill align="center" justify="start" pad="large">
              <Box width="medium" gap="medium">
                <TextInput
                  icon={<Search />}
                  reverse
                  placeholder="Search ..."
                  onKeyPress={this._onSearchEnter}
                  onChange={this._onSearchChange}
                  onClick={this._onSearchClick}
                />
              </Box>
            </Box>
          </Box>
        </Box>
        <Text>
          Total
          <div >{this.props.documents.get('result').get('total')}</div>
        </Text>
        {photosmenu}
        <Grid className="ui internally celled grid">
          {elements}
        </Grid>
        <div>
          {detailsLayer}
        </div>
      </Box>
    );
  }
}

Photos.contextTypes = {
  store: PropTypes.object
};

Photos.propTypes = {
  type: PropTypes.string.isRequired,
  hosturl: PropTypes.string.isRequired,

  documents: PropTypes.shape({
    category: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string)
    ]),
    label: PropTypes.string,
    query: PropTypes.object,
    result: {
      begin: PropTypes.number,
      currentBegin: PropTypes.number,
      currentEnd: PropTypes.number,
      total: PropTypes.number,
      items: PropTypes.arrayOf(PropTypes.object),
    },
    view: PropTypes.oneOf(["table", "tiles", "list"]),
    addRoute: PropTypes.string
  }).isRequired,
  dispatch: PropTypes.func.isRequired
};

// for react-redux
const mapStateToProps = (state) => {

  console.log("photos:mapStateProps: state: ", state);
  const category = 'photos';

  return {
    category: category,
    documents: state.documents.getIn(['categories', category])

  };
};


// module.exports = Photos;
export default connect(mapStateToProps)(Photos);
