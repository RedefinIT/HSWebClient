import {Component} from "react";

/**
 * Created by govind on 7/23/16.
 */

const FileUpload = require('react-fileupload');
const React = require('react');
import {fileServerBaseURL} from '../../Api';

class HSFileUpload extends Component{
// var HSFileUpload = React.createClass({

  getDefaultProps () {
    return {
      text: 'Welcome home from props!'
    }
  }

  getInitialState () {

    console.log("HSFileUpload getInitialState: ", this.props.caption);
    console.log("HSFileUpload getInitialState: ", this.props.context);

    var baseUrl = fileServerBaseURL() + 'upload';

    console.log("HSFileUpload baseURL: ", baseUrl);

    return {
      options: {
        baseUrl: baseUrl,
        param:{
          fid:0,
          context: JSON.stringify(this.props.context)
        },
        chooseAndUpload: true,
        fileFieldName : 'file',
        paramAddToField : {context: JSON.stringify(this.props.context)},
        beforeUpload: this._beforeUpload,
        uploading: this.uploadProgress,
        uploadSuccess: this.uploadSuccess,
        uploadError: this.uploadError,
        uploadFail: this.uploadFail,
        multiple:true
      }
    }
  }

  uploadProgress (progress){
    console.log('loading...',progress);
  }

  uploadSuccess (resp){
    console.log('upload success: ', resp);
  }
  uploadError (err){
    console.log('uploadError: ', err)
    console.log('uploadError: ', err.message)
  }
  uploadFail (resp){
    console.log('uploadFail: ', resp)

  }

  _beforeUpload(files, mill) {

    console.log("HSFileUpload beforeUpload, ", this.state.options);
    return true;

    //console.log(mill);
    //console.log(files);
    //console.log(files[0]);
    //console.log(typeof files);
    //if(typeof files === string) {
    //  console.log("returning true1");
    //  return true;
    //}
    //if(files[0].size<1024*1024*20){
    //  files[0].mill = mill;
    //  console.log("returning true");
    //  return true;
    //}
    //console.log("returning false");
    //return false;
  }

  /*
   * This function will be called right after the component mounting on DOM
   * and before render()
   * */
  componentWillMount () {
    console.log("HSFileUpload componentWillMount: ");

  }

  /*
   * This function will be called after render()
   * It is good idea to perform any async operations here as render can show some default
   * content first and this function can asyncronously trigger render() when there is data
   * */
  componentDidMount () {
    console.log("HSFileUpload componentDidMount: ");
  }


  componentWillUnmount () {

  }

  render () {

    // console.log("HSFileUpload render: ", this.props);
    console.log("HSFileUpload render: ", this.props.caption);
    // console.log("HSFileUpload render this.state.options: ", this.state.options);

    return (
      <FileUpload options={this.state.options}>
        <div className="large ui icon button" ref="chooseAndUpload"><i className="upload icon"></i>{this.props.caption}</div>
      </FileUpload>
    );
    //return (
    //  <FileUploadProgress key='ex1' url='http://localhost:3000/api/upload'
    //                      onProgress={(e, request, progress) => {console.log('progress', e, request, progress);}}
    //                      onLoad={ (e, request) => {console.log('load', e, request);}}
    //                      onError={ (e, request) => {console.log('error', e, request);}}
    //                      onAbort={ (e, request) => {console.log('abort', e, request);}}
    //  />
    //);
  }
};

export default HSFileUpload;