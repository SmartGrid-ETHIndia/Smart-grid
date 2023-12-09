"use client";
import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import data from './../../EVLocations'; 

const MapComponent = () => {
  const googlemap = useRef(null);
  const addresses = data;
  const userLat = 28.6107;
  const userLng = 77.219666;

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const calculateBestStation = () => {
    return null;
  };

  const highestCapacityAddress = calculateBestStation();

  const nearbyAddresses = addresses.filter(address => {
    const distance = calculateDistance(userLat, userLng, address.latitude, address.longitude);
    return distance <= 5;
  });

  useEffect(() => {
    const openGoogleMaps = (lat, lng) => {
      if (typeof window === 'undefined') {
        return;
      }
      const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
      window.open(url, '_blank');
    };

    window.openGoogleMaps = openGoogleMaps;

    const loader = new Loader({
      apiKey: "AIzaSyBvdxOyyKyljBkWE2M4Y8WUTlVBkBvHwQw", 
      version: 'weekly',
    });

    loader.load().then(() => {
      const map = new window.google.maps.Map(googlemap.current, {
        center: { lat: userLat, lng: userLng },
        zoom: 8,
      });

      const greenIcon = { url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' };
      const yellowIcon = { url: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png' };
      const redIcon = { url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' };
      const blueIcon = { url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' }; // Blue icon for user location

      new window.google.maps.Marker({
        position: { lat: userLat, lng: userLng },
        map: map,
        title: "Your Location",
        icon: blueIcon,
      });

      const infoWindow = new window.google.maps.InfoWindow();

      addresses.forEach(address => {
        const isNearby = nearbyAddresses.includes(address);
        const isHighestCapacity = address === highestCapacityAddress;
        const marker = new window.google.maps.Marker({
          position: { lat: address.latitude, lng: address.longitude },
          map: map,
          title: address.name,
          icon: isNearby ? (isHighestCapacity ? greenIcon : yellowIcon) : redIcon,
        });

        marker.addListener('click', () => {
          const distance = calculateDistance(userLat, userLng, address.latitude, address.longitude).toFixed(2);
          const contentString = `
            <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; border: 1px solid #ddd; border-radius: 5px; padding: 10px;">
                <p style="font-size: 16px; color: #333; margin: 0;">Distance: ${distance} km</p>
                <button onclick="openGoogleMaps()" style="background-color: #007BFF; color: #fff; border: none; border-radius: 5px; padding: 8px 16px; font-size: 14px; cursor: pointer; margin-top: 10px;">Open in Google Maps</button>
            </div>
          `;
          infoWindow.setContent(contentString);
          infoWindow.open(map, marker);
        });
      });
    });
  }, [nearbyAddresses, highestCapacityAddress]);

  return <div style={{marginTop:'100px'}}><div ref={googlemap} style={{ width: '100vw', height: '100vh' }} /></div>;
};

export default MapComponent;
