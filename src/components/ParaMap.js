import React, {Component, PropTypes} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions
} from 'react-native';
import MapView from 'react-native-maps';
import Carousel from 'react-native-snap-carousel';
import _ from 'lodash';

import PlaceSlide from './PlaceSlide';

export default class ParaMap extends Component {
  constructor(props) {
    super(props);

    const markers = this.toMarkers(this.props.places);
    this.state = {
      region: {
        latitude: this.props.currentPosition.latitude,
        longitude: this.props.currentPosition.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      markers: markers
    }
  }

  componentWillReceiveProps(nextProps) {
    let markers = this.toMarkers(nextProps.places);
    this.setState({
      ...this.state,
      markers: markers
    });
  }

  toMarkers(places){
    let markers = places.map( (place) => {
      return ({
        id: place.place_id,
        name: place.name,
        coordinate: {
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng,
        },
        place_id: place.place_id
      });
    });
    return markers;
  }

  onRegionChange(region) {
    this.setState({ region });
  }

  renderItem(place) {
    return (
      <PlaceSlide onPlaceClick={this.props.onPlaceClick} place={place} />
    );
  }

  zoomToRegion(slideIndex, itemData) {
    this.onRegionChange({
      latitude: itemData.geometry.location.lat,
      longitude: itemData.geometry.location.lng,
      latitudeDelta: 0.0122,
      longitudeDelta: 0.0121,

    });
  }

  render() {
    const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
    const slideWidth = viewportWidth * 0.9;
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          region={this.state.region}
          onRegionChange={this.onRegionChange.bind(this)}
        >
          {this.state.markers.map((marker, i) => (
            <MapView.Marker
              coordinate={marker.coordinate}
              title={marker.name}
              key={i}
            />
          ))}

        </MapView>
        <View style={{position: 'absolute', bottom: 0, left: 0}}>
          <Carousel
            ref={'carousel'}
            style={{paddingLeft: 20, paddingBottom: 10}}
            items={this.props.places}
            renderItem={this.renderItem.bind(this)}
            sliderWidth={slideWidth}
            itemWidth={slideWidth}
            onSnapToItem={this.zoomToRegion.bind(this)}
           />
        </View>

      </View>
    );
  }
}

ParaMap.propTypes = {
  places: PropTypes.array.isRequired,
  currentPosition: PropTypes.object.isRequired,
  onPlaceClick: PropTypes.func.requires
}

let styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  map: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});