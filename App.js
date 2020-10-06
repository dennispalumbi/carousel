import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions
} from 'react-native';

import InfiniteCarousel from './InfiniteCarousel';

import Icon from 'react-native-vector-icons/dist/AntDesign';
import Feather from 'react-native-vector-icons/dist/Feather';
const AnimatedIcon = Animated.createAnimatedComponent(Icon);
const animals = [
  {
    name: 'Leon',
    color: 'black',
  },
  {
    name: 'Cat',
    color: 'red',
  },
  {
    name: 'Elephant',
    color: 'blue',
  },
  {
    name: 'Unicorn',
    color: 'yellow',
  },

  {
    name: 'Leon1',
    color: 'orange',
  },
  {
    name: 'Cat1',
    color: 'purple',
  },
  {
    name: 'Elephant1',
    color: 'brown',
  },
  {
    name: 'Unicorn1',
    color: '#9365B8',
  },
  {
    name: 'Cat1',
    color: '#FBA026',
  },
  {
    name: 'Elephant1',
    color: '#E14938',
  },
  {
    name: 'Unicorn1',
    color: '#9365B8',
  },
];

const HEIGHT = 50;

const Animal = ({ name, color, animatedScale, index, style,animatedBgColor,pageOffset }) => {
  
  let size=animatedScale
  console.log(animatedScale)
  return(
  <TouchableOpacity onPress={() => console.log(`Selected index is ${index}`)}>

   
      <Animated.View
        style={[
          {
            transform: [{ scale: animatedScale }],
         
          },
          style,
          styles.animalAnimatedBox,
        ]}>
        <View  ><Icon name={"pluscircle"} size={20} color={color} /></View>
      </Animated.View>
    {/*</TouchableOpacity>
 
  
    
      <AnimatedIcon
      style={[
        {
          transform: [{ scale: animatedScale }],
       
        },
         style,
          styles.animalAnimatedBox,
      ]}
        name={'pluscircle'}
        size={30}
       /> */}
    </TouchableOpacity>
 
)};

class Example extends Component {
  state = {
    dimensions: {},
  };

  _isSameMeasure = (measurement1, measurement2) =>
    measurement1.width === measurement2.width &&
    measurement1.height === measurement2.height;

  _onLayout = ({ nativeEvent }) => {
   
    const dimensions = nativeEvent.layout;
    if (!this._isSameMeasure(this.state.dimensions, dimensions)) {
      this.setState({ dimensions });
    }
  };

  render() {
    console.log("w",this.state.dimensions.width)
    const dynamicContainerStyle = {
      height: HEIGHT,
      width: this.state.dimensions.width,
    };

    const MIN_SCALE = 0.7;
    const MAX_SCALE =1.3;
    // we will pass an array of functions as children
    const pages = animals.map((animal, index) =>
      (animatedPosition, pageWidth, pageOffset) => {
       
        const height = pageWidth * 0.4;
        const width =30;
        console.log(animatedPosition)
        return (
         
          <Animal
            {...animal}
            index={index}
            //style={{ width, height }}
            pageOffset={pageOffset}
            animatedScale={animatedPosition.interpolate({
              inputRange: [
                pageOffset-100,
                pageOffset+0,
                pageOffset+60,
                pageOffset+140,
                pageOffset+200,
                pageOffset+260,
                pageOffset+300,
              ],

              outputRange: [ 0.1,0.4,0.8,1.3,0.8,0.4,0.1],
            })}
            animatedBgColor={animatedPosition.interpolate({
              inputRange: [
                pageOffset+200,
                pageOffset+400,
              
               
              ],             
              outputRange:["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 1)"]
            })}
          />
        );
      });

    return (
      <View style={styles.container} onLayout={this._onLayout}>
        <View style={dynamicContainerStyle}>
          <InfiniteCarousel>
            {pages}
          </InfiniteCarousel>
         
        </View>
        <View style={styles.leftBarBtn} ><Icon name="bars" size={30} color="#787878" /></View>
        <View style={styles.rightBarBtn} ><Feather name="settings" size={30} color="#787878" /></View>
      </View>
      
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:0,
    backgroundColor:"#fff",
   
  },
  horizontalWrapper: {
    flexDirection: 'row',
  },
  animal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  animalAnimatedBox: {
    justifyContent: 'center',
    alignItems: 'center',
    
   },
  leftBarBtn:{
    width:50,
    height:50,
    backgroundColor:"#fff",
    position:"absolute",
    paddingTop:10,
    paddingLeft:10
  },
  rightBarBtn:{
    width:50,
    height:50,
    backgroundColor:"#fff",
    position:"absolute",
    right:0,
    alignItems:"flex-end",
    paddingRight:10,
    paddingTop:10,
    
  }
});

export default Example;
