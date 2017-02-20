import React, { Component } from 'react';
import * as THREE from 'three';
import React3 from 'react-three-renderer';
import Slider from 'react-rangeslider';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-rangeslider/lib/index.css';
import './App.css';
import ableness from './ableness.png';
import gender from './gender.png';
import sexuality from './sexuality.png';
import genderid from './genderid.png';
import race from './race.png';
import classface from './classface.png';

class Cube extends React.Component {
  constructor(props, context) {
    super(props, context);

    // construct the position vector here, because if we use 'new' within render,
    // React will think that things have changed when they have not.
    this.cameraPosition = new THREE.Vector3(0, 0, 300);
    this.lightPosition = new THREE.Vector3(0, 0, 300);

    this.state = {
      cubeRotation: new THREE.Euler(),
    };

    this._onAnimate = () => {
      // we will get this callback every frame

      // pretend cubeRotation is immutable.
      // this helps with updates and pure rendering.
      // React will be sure that the rotation has now updated.
      this.setState({
        cubeRotation: new THREE.Euler(
          this.state.cubeRotation.x + 0.01,
          this.state.cubeRotation.y + 0.02,
          this.state.cubeRotation.z + 0.03
        ),
      });
    };
  }

  applyMesh = (object) => {
    // geometry
    var geometry = new THREE.BoxGeometry( 100, 100, 100, 4, 4, 4 );

    // texture
    var cubeFaceImages = [
      gender,
      sexuality,
      genderid,
      classface,
      ableness,
      race
    ]
    var cubeFaces = [];
    var loader = new THREE.TextureLoader();
    for (var i = 0; i < cubeFaceImages.length; i++) {
      var Texture = loader.load( cubeFaceImages[i] );
      cubeFaces.push( Texture );
    }

    // materials
    var materials = [
    new THREE.MeshBasicMaterial( { map: cubeFaces[0], transparent: true, opacity: 1, side: THREE.DoubleSide }),
    new THREE.MeshBasicMaterial( { map: cubeFaces[1], transparent: true, opacity: 1, side: THREE.DoubleSide }),
    new THREE.MeshBasicMaterial( { map: cubeFaces[2], transparent: true, opacity: 1, side: THREE.DoubleSide }),
    new THREE.MeshBasicMaterial( { map: cubeFaces[3], transparent: true, opacity: 1, side: THREE.DoubleSide }),
    new THREE.MeshBasicMaterial( { map: cubeFaces[4], transparent: true, opacity: 1, side: THREE.DoubleSide }),
    new THREE.MeshBasicMaterial( { map: cubeFaces[5], transparent: true, opacity: 1, side: THREE.DoubleSide }),
    ];

    geometry.sortFacesByMaterialIndex(); // optional, to reduce draw calls

    // mesh
    var mesh = new THREE.Mesh( geometry, new THREE.MultiMaterial( materials ) );

    object.add( mesh );
  }

  componentDidMount(){
    const group = this.refs.group;
    this.applyMesh(group);
  }

  componentDidUpdate(prevProps, prevState){
    if (prevProps !== this.props) {
      const group = this.refs.group;
      var groupMaterials = group.children[0].material.materials;
      groupMaterials[0].opacity = this.props.genderValue / 100;
      groupMaterials[1].opacity = this.props.sexualityValue / 100;
      groupMaterials[2].opacity = this.props.genderidValue / 100;
      groupMaterials[3].opacity = this.props.classfaceValue / 100;
      groupMaterials[4].opacity = this.props.ablenessValue / 100;
      groupMaterials[5].opacity = this.props.raceValue / 100;
    }
  }

  render() {
    const width = window.innerWidth; // canvas width
    const height = window.innerHeight / 1.3; // canvas height


    return (<React3
      mainCamera="camera" // this points to the perspectiveCamera which has the name set to "camera" below
      width={width}
      height={height}

      onAnimate={this._onAnimate}
    >
      <scene>
        <perspectiveCamera
          name="camera"
          fov={40}
          aspect={width / height}
          near={1}
          far={10000}

          position={this.cameraPosition}
        />
        <ambientLight color={0x222222} />
        <directionalLight color={0xffffff} position={this.lightPosition} />
        <group ref="group" rotation={this.state.cubeRotation} />
      </scene>
    </React3>);
  }
}  

class CubeControls extends Component {
  render() {
    return (
        <div className={this.props.className}>
            <label>{this.props.label}</label>
            <Slider
            min={0}
            max={100}
            step={25}
            value={this.props.value}
            onChange={this.props.onChangeMethod}
             />
           <p>{this.props.text} <a href={this.props.linkURL}>Learn More</a></p>
         </div>
    );
  }
}
  


class App extends Component {
  constructor (props, context) {
    super(props, context);
    this.state = {
      genderValue: 100,
      sexualityValue: 100,
      genderidValue: 100,
      classfaceValue: 100,
      ablenessValue: 100,
      raceValue: 100
    }
  }

  handleChange = (name, value) => {
    this.setState({
      [name]: value
    })
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1>The Privilege Cube</h1>
          <div className="App-sub-header">
            <h2>Inspired by <a href="https://twitter.com/Transition">Kojo Idrissa's</a> <a href="https://www.alterconf.com/talks/using-privilege-arbitrage-increase-inclusion">AlterConf talk</a></h2>
            <h2>A Project by <a href="https://twitter.com/allilevine">@allilevine</a></h2>
          </div>
        </div>
        <div className="App-content">

          <Cube genderValue={this.state.genderValue} sexualityValue={this.state.sexualityValue} genderidValue={this.state.genderidValue} classfaceValue={this.state.classfaceValue} ablenessValue={this.state.ablenessValue} raceValue={this.state.raceValue} />

          <div className='sliders'>
            <div className="slider-col">

              <CubeControls className={'race-slider slider'} label={'Race'} value={this.state.raceValue} onChangeMethod={this.handleChange.bind(this, 'raceValue')} text={'White people benefit from institutionalized racism and discrimination. If you\'re white, your racial privilege is 100%.'} linkURL={'http://everydayfeminism.com/2016/08/told-white-friend-black-opinion/'} />

              <CubeControls className={'sexuality-slider slider'} label={'Sexuality'} value={this.state.sexualityValue} onChangeMethod={this.handleChange.bind(this, 'sexualityValue')} text={'Heterosexual people benefit from institutionalized heteronormativity. If you\'re straight, your sexuality privilege is 100%.'} linkURL={'http://everydayfeminism.com/2015/03/examples-straight-privilege/'} />

            </div>
            <div className="slider-col">

              <CubeControls className={'gender-slider slider'} label={'Gender'} value={this.state.genderValue} onChangeMethod={this.handleChange.bind(this, 'genderValue')} text={'Men benefit from institutionalized sexism. If you\'re male, your gender privilege is 100%.'} linkURL={'http://everydayfeminism.com/2016/02/160-examples-of-male-privilege/'} />

              <CubeControls className={'genderid-slider slider'} label={'Gender ID'} value={this.state.genderidValue} onChangeMethod={this.handleChange.bind(this, 'genderidValue')} text={'Cisgender people (people who identify with the gender they were assigned at birth) benefit from institutionalized transphobia. If you\'re cis, your gender ID privilege is 100%.'} linkURL={'http://everydayfeminism.com/2016/02/130-examples-cis-privilege/'} />

            </div>
            <div className="slider-col">

              <CubeControls className={'classface-slider slider'} label={'Class'} value={this.state.classfaceValue} onChangeMethod={this.handleChange.bind(this, 'classfaceValue')} text={'People who come from middle or higher class families and neighborhoods benefit from institutionalized classism. If you grew up with these advantages, your class privilege is 100%.'} linkURL={'http://everydayfeminism.com/2015/12/everyday-class-privilege/'} />

              <CubeControls className={'ableness-slider slider'} label={'Able-ness'} value={this.state.ablenessValue} onChangeMethod={this.handleChange.bind(this, 'ablenessValue')} text={'Able-bodied people benefit from institutionalized ableism. If you\'re able-bodied, your able-ness privilege is 100%.'} linkURL={'https://en.wikipedia.org/wiki/Ableism'} />

            </div>
        </div>
      </div>
      </div>
    );
  }
}

export default App;
