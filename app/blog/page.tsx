
"use client"
import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import chargingData from './ChargingStationDayDataset';
import data from './EVLocations.js';
import { db } from "./../../firebaseConfig";
import { getDocs, collection } from 'firebase/firestore';

const MapComponent = () => {
    const googlemap = useRef(null);
    const [addresses, setAddresses] = useState(data);
    const EVStationData = chargingData;
    const [userLocation, setUserLocation] = useState({ lat: 28.6107, lng: 77.219666 }); // Default location

    const fetchUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            }, () => {
                console.log("Error in getting your location");
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    };

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the Earth in km
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const searchNearbyStations = (radius) => {
        return addresses.filter(address => {
            const distance = calculateDistance(userLocation.lat, userLocation.lng, address.latitude, address.longitude);
            return distance <= radius;
        });
    };
    
    let nearbyAddresses = searchNearbyStations(5);

    const searchNearbyStationsWithIncreasedRadius = (radius, maxRadius) => {
        if (radius > maxRadius) {
            return null; // Stop searching if reached the maximum radius
        }
    
        const nearbyStations = searchNearbyStations(radius);
        if (nearbyStations.length === 0) {
            // If no stations found in the current radius, try with increased radius
            return searchNearbyStationsWithIncreasedRadius(radius * 2, maxRadius);
        } else {
            return nearbyStations;
        }
    };
    
    // Use the recursive function to search for stations with increasing radii
    nearbyAddresses = searchNearbyStationsWithIncreasedRadius(10, 300); 

    const calculateBestStation = () => {
        const loadValues = { LOW: 1, MEDIUM: 2, HIGH: 3 };
        const loadTotals = {};
        const loadCounts = {};

        EVStationData.forEach(record => {
            if (nearbyAddresses.some(addr => addr.name === record.station_id)) {
                const loadValue = loadValues[record.status.toUpperCase()] || 0;
                loadTotals[record.station_id] = (loadTotals[record.station_id] || 0) + loadValue;
                loadCounts[record.station_id] = (loadCounts[record.station_id] || 0) + 1;
            }
        });

        let minAvgLoad = Infinity;
        let bestStation = null;

        Object.keys(loadTotals).forEach(station => {
            const avgLoad = loadTotals[station] / loadCounts[station];
            if (avgLoad < minAvgLoad) {
                minAvgLoad = avgLoad;
                bestStation = nearbyAddresses.find(addr => addr.name === station);
            }
        });

        return bestStation;
    };

    const highestCapacityAddress = calculateBestStation();

    const fetchEVStations = async () => {
        const querySnapshot = await getDocs(collection(db, "EVStations"));
        const stations = [];
        querySnapshot.forEach((doc) => {
            stations.push(doc.data());
        });
        setAddresses(stations);
    };

    useEffect(() => {
        fetchUserLocation();
    }, []);

    useEffect(() => {
        const openGoogleMaps = (event) => {
            const lat = event.target.getAttribute('data-lat');
            const lng = event.target.getAttribute('data-lng');
            const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
            window.open(url, '_blank');
        };

        window.openGoogleMaps = openGoogleMaps;

        const loader = new Loader({
            apiKey: "AIzaSyBvdxOyyKyljBkWE2M4Y8WUTlVBkBvHwQw",
            version: "weekly",
        });

        loader.load().then(() => {
            const map = new window.google.maps.Map(googlemap.current, {
                center: userLocation,
                zoom: 13.3,
                mapTypeControl: false
            });

            const greenIcon = { url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' };
            const yellowIcon = { url: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png' };
            const redIcon = { url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' };
            const blueIcon = { url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' }; // Blue icon for user location

            new window.google.maps.Marker({
                position: { lat: userLocation.lat, lng: userLocation.lng },
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

                marker.addListener("click", () => {
                    const distance = calculateDistance(userLocation.lat, userLocation.lng, address.latitude, address.longitude).toFixed(2);
                    const contentString = `
                        <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; border: 1px solid #ddd; border-radius: 5px; padding: 10px;">
                            <p style="font-size: 16px; color: #333; margin: 0;">Distance: ${distance} km</p>
                            <button data-lat="${address.latitude}" data-lng="${address.longitude}" onclick="window.openGoogleMaps(event)" style="background-color: #007BFF; color: #fff; border: none; border-radius: 5px; padding: 8px 16px; font-size: 14px; cursor: pointer; margin-top: 10px;">Open in Google Maps</button>
                        </div>
                    `;
                    infoWindow.setContent(contentString);
                    infoWindow.open(map, marker);
                });
            });
        });
    }, [addresses, userLocation, nearbyAddresses, highestCapacityAddress]);

    return <div ref={googlemap} style={{ width: '100vw', height: '100vh' }} />;
};

export default MapComponent;
