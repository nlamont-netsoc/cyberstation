///* eslint-disable flowtype/require-valid-file-annotation */
//
///* global conn */
//// @flow weak
//
//import React, { Component } from 'react';
//import PropTypes from 'prop-types';
//import withRoot from '../components/withRoot';
//import withStyles from 'material-ui/styles/withStyles';
//import { CommonStix } from '../stix/common.js';
//
//export const styles = {
//  tabs: {
//    width: '100%',
//    position: 'fixed',
//    top: 52,
//    zIndex: 1,
//    marginTop: 2,
//    backgroundColor: "royalblue"
//  },
//  content: {
//    marginTop: 74,
//    top: 74
//  }
//};
//
//export class StixPage extends Component {
//
//  constructor(props) {
//    super(props);
//    this.state = { sdoType: '', sdoId: '', sdoName: ''};
//    this.commonUpdate = this.commonUpdate.bind(this);
//  }
//
//
//common(name, id) {
//     return (<CommonStix sdoname={name} sdoid={id} update={this.commonUpdate} sdotype={this.state.sdoType}/>);
//  };
//  
//  
//  // update the info display of the selected bundle object
//  selectedObject = (sdoid, isDeleted) => {
//  //  console.log("in StixPage selectedObject sdoid=" + sdoid);
//    if (isDeleted) {
//      this.setState({ sdoId: sdoid, comon: '' });
//    } else {
//      if (sdoid !== undefined && sdoid !== '') {
//        // find the object with sdoid in the bundle, to get its info
//        let objFound = this.props.bundle.objects.find(obj => obj.id === sdoid);
//        if (objFound !== undefined) {
//          console.log("in StixPage selectedObject objFound=" + JSON.stringify(objFound));
//    //      let newCommon = <Common sdoname={objFound.name} sdoid={sdoid} update={this.commonUpdate} sdotype={this.state.sdoType}/>;
////let newCommon = new Common({sdoname: objFound.name, sdoid: sdoid, update: this.commonUpdate, sdotype: this.state.sdoType});
//console.log("in StixPage newCommon=" + JSON.stringify(this.common(objFound.name, sdoid)));
//          this.setState({ sdoId: sdoid, comon: this.common(objFound.name, sdoid)});
//        } else {
//          this.setState({ sdoId: sdoid});
//        }
//      }
//    }
//  };
//  
//  // called by Common to update the sdo common properties
//  commonUpdate = (commonVal) => {    
////    if (commonVal !== undefined && commonVal !== '') {
////        // find the sdo in the bundle
////       // let sdo = this.props.bundle.objects.find(sdo => sdo.id === commonVal.id);
////       console.log("in StixPage commonVal=" + JSON.stringify(commonVal));
////    //   for(let sdo of this.props.bundle.objects){
////    //        console.log("in StixPage sdo.id=" + sdo.id);
////    //   }
////       
////        let sdondx = this.props.bundle.objects.findIndex(sdo => sdo.id === commonVal.id);
////    //    console.log("in StixPage sdondx=" + sdondx +" commonVal.id="+commonVal.id);
////        if(sdondx !== -1) {
////        //    console.log("in StixPage before=" + JSON.stringify(this.props.bundle.objects[sdondx]));
////            // copy the new values to the selected parent bundle sdo
////            Object.assign(this.props.bundle.objects[sdondx], commonVal);
////        //    console.log("in StixPage after=" + JSON.stringify(this.props.bundle.objects[sdondx]));
////        }
////    // update the state
////    this.forceUpdate();
////    }
//  };
//
//};
//
//StixPage.propTypes = {
//  server: PropTypes.object.isRequired,
//  bundle: PropTypes.object.isRequired
//};
//
//export default withRoot(withStyles(styles)(StixPage));