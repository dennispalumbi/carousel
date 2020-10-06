import React, { Component } from 'react';
import {
  View,
  Text,
  Animated,
  Easing,
  StyleSheet,
  PanResponder,
} from 'react-native';

const noop = () => {};
const PAGE_RATIO = 1 /6; //
const DRAG_SENSITIVITY =3/4;
const ANIMATION_DURATION = 100;

class InfiniteCarousel extends Component {
  state = {
    containerDimensions: {
      width: 0,
      height: 0,
    },
    contentDimensions: {
      width: 0,
      height: 0,
    },
  };

  _animatedXPosition = new Animated.Value(0);
  _xScrollOffset = 0;
  _xScrollPosition = 0;
  _pageWidth = 0;
  _currentPage = 0;

  _firstPosition = false;
  
  _isDistanceEnough = velocity =>
    (evt, gestureState) => Math.abs(gestureState.dx) > velocity;

  _panResponder = PanResponder.create({
   
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onStartShouldSetPanResponderCature: (evt, gestureState) => true,
    onMoveShouldSetPanResponder: (evt, gestureState) => false,
    onMoveShouldSetPanResponderCapture: this._isDistanceEnough(15),

    onPanResponderGrant: (evt, gestureState) => {
     
      this._xScrollOffset = this._xScrollPosition;
    },
    onPanResponderMove: (evt, gestureState) => {
      
      this._scrollTo(
        this._xScrollOffset + Math.round(gestureState.dx * DRAG_SENSITIVITY),
      );
    },
    onPanResponderTerminationRequest: (evt, gestureState) => true,
    onPanResponderRelease: (evt, gestureState) => {
    
      this._roundPage();
    },
    
  });

  _scrollTo = (pos, animated, callback = noop) => {
    const endOfContent = (this.state.contentDimensions.width -
      this.state.containerDimensions.width) *
      -1;
    /*  console.log(pos,(this.state.contentDimensions.width -
        this.state.containerDimensions.width) *
        -1)*/
    if (pos > 0) {

      this._xScrollPosition =-660
     
     
    } else if (pos < endOfContent) {
      this._xScrollPosition = endOfContent;
    } else {
      this._xScrollPosition = pos;
    }

    if (animated) {

     
      Animated.timing(this._animatedXPosition, {
        toValue: this._xScrollPosition,
        duration: ANIMATION_DURATION,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start(callback);


    } else {
      this._animatedXPosition.setValue(this._xScrollPosition);
    }
  };

  _getPositionToPageCenter = pageIndex =>
    Math.round((pageIndex - 1) * this._pageWidth + this._pageWidth / 2) * -1;

  _moveToPage = (page, animated, callback) => {
    this._currentPage = page;
    const pagePosition = this._getPositionToPageCenter(this._currentPage);
    this._scrollTo(pagePosition, animated, callback);
  };

  _roundPage = () => {
    const pageCenter = Math.round(this.state.containerDimensions.width / 6);//
    const relativePos = (this._xScrollPosition + pageCenter) / this._pageWidth;
    const page = Math.abs(Math.floor(relativePos) - 1);
    this._moveToPage(page, true, this._setCritical);
  };

  _setCritical = () => {
    const pageCount = this.props.children.length;
    if (this._currentPage === 1) {
      this._moveToPage(pageCount + 1);
    }
    if (this._currentPage === pageCount + 2) {
      this._moveToPage(2);
    }
  };

  _isSameMeasure = (measurement1, measurement2) =>
    measurement1.width === measurement2.width &&
    measurement1.height === measurement2.height;

  _manageLayout = key =>
    ({ nativeEvent }) => {
      const dimensions = nativeEvent.layout;
      if (!this._isSameMeasure(this.state[key], dimensions)) {
        this.setState({ [key]: dimensions });
      }
    };

  _renderContent() {
   
    const { containerDimensions } = this.state;
    const { children } = this.props;

    this._pageWidth = containerDimensions.width * PAGE_RATIO;

   
    const pages = [...children];
   
    pages.push(pages[0], pages[1], pages[2], pages[3], pages[4], pages[5]);//
    pages.unshift(pages[children.length - 2], pages[children.length - 1]);

    const compotedPageStyle = {
      width: this._pageWidth,
      height: containerDimensions.height,
      
    };
    const self = this;
    const content = pages.map((page, index) => {
      const pageOffset = (index * self._pageWidth - self._pageWidth / 2) * -1;//
      console.log(this._xScrollPosition )
      return (
        <View key={index} style={compotedPageStyle}>
          {page(self._animatedXPosition, self._pageWidth, pageOffset)}
        </View>
      );
    });
    return content;
  }

  componentDidUpdate() {
    const { containerDimensions, contentDimensions } = this.state;
    if (containerDimensions.width !== 0 && contentDimensions.width !== 0) {
      if (!this._firstPosition) {
        this._moveToPage(3);
        this._firstPosition = true;
      } else {
        this._moveToPage(this._currentPage);
      }
    }
  }

  render() {
    const computedContentStyle = {
      transform: [{ translateX: this._animatedXPosition }],
    };
    return (
      <View
        style={styles.horizontalContainer}
        onLayout={this._manageLayout('containerDimensions')}
        {...this._panResponder.panHandlers}>
        <View onLayout={this._manageLayout('contentDimensions')}>
          <Animated.View
            style={[computedContentStyle, styles.horizontalContent]}>
            {this._renderContent()}
          </Animated.View>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  horizontalContainer: {
    flexGrow: 1,
   
    flexDirection: 'row',
   
    backgroundColor:"#fff", 
    marginTop:10
   
  },
  horizontalContent: {
    flexDirection: 'row',
  },
});

export default InfiniteCarousel;
