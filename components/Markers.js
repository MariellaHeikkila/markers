import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { useState, useEffect } from 'react';
import { Text, Button } from 'react-native';

export default function Markers() {

    const [isLoading, setIsLoading] = useState(true);
    const [markers, setMarkers] = useState([]);

    useEffect(() => {
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          try {
            if (status !== 'granted') {
            setIsLoading(false)
            alert('Geolocation failed');
            return;
          }
    
          const location = await Location.getLastKnownPositionAsync({
            accuracy: Location.Accuracy.High
          });

          const newLocation = [...markers, location.coords ];
          setMarkers(newLocation);
          setIsLoading(false)
        } catch (error) {
          alert('whot' + error)
          setIsLoading(false)
        }
      })();
      }, []);

    const addMarker = (coords) => {
        const newLocation = [...markers, coords ];
        setMarkers(newLocation);
    }

    const clearExtraMarkers = () => {
        const myLocation = [...markers.slice(0, 1)];
        setMarkers(myLocation);
    }

    if(isLoading) {
        return (
            <View style={styles.container}>
                <Text>Retrieving location.</Text>
            </View>
        );
    } else {
  return (
    <View style={styles.container}>
      <MapView style={styles.map}
      showsUserLocation={true} 
      initialRegion={{
        latitude:  markers[0].latitude,
        longitude: markers[0].longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }} 
      onLongPress={(event) => addMarker(event.nativeEvent.coordinate)}
      >
        {markers.map((location, index) => (
            <Marker 
            key={index}
            title={(index + 1) + '. location'}
            coordinate={{
                latitude: location.latitude, 
                longitude: location.longitude}}
            />))}
        </MapView>
        {markers.length > 1 && 
        <Button 
        title="Clear extra markers" 
        onPress={clearExtraMarkers} />
        }
    </View>
  );
}
}

const styles = StyleSheet.create({
    container: {
      paddingTop: Constants.statusBarHeight,
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    map: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height - Constants.statusBarHeight - 50,
      marginTop: 10,
      marginBottom: 10
    }
  });