"use client"

import Link from "next/link";
import { Loader } from '@googlemaps/js-api-loader';
import chargingData from './ChargingStationDayDataset';
import data from './EVLocations';
import {db} from "./../../firebaseConfig";
import { getDocs, collection, doc, setDoc, getDoc } from 'firebase/firestore';
import {useState,useEffect} from 'react';
import axios from 'axios';
import FormData from 'form-data';

const Hero = () => {
  const [addresses, setAddresses] = useState(data);
  const EVStationData = chargingData;
  const [userLocation, setUserLocation] = useState({ lat: 28.6107, lng: 77.219666 }); // Default location
  const [highestCapacityAddress, setHighestCapacityAddress] = useState(null);
  const addToIPFS = async (data) => {
    const url = 'https://ipfs.infura.io:5001/api/v0/add';
    const formData = new FormData();
    formData.append("file", new Blob([JSON.stringify(data)], { type: 'application/json' }));

    try {
      const response = await axios.post(url, formData,{
        headers: {
          'Authorization': `HjK7fQGPOV+g5D4LnkqGLHvpZy3B3or39eqXj+nQKrRE6inZ8Zi1nA`
        }
      });
      return response.data.Hash; // returns the IPFS hash
    } catch (error) {
      console.error('Error uploading file to IPFS:', error.message);
      throw error;
    }
  };

  // Function to store hash in Firebase
  const storeHashInFirebase = async (hash) => {
    try {
      const docRef = doc(db, "IPFSHashes", "latestHash");
      await setDoc(docRef, { hash });
      console.log("Hash stored in Firebase:", hash);
    } catch (error) {
      console.error('Error storing hash in Firebase:', error.message);
    }
  };

  // Function to check if hash exists in Firebase
  const checkHashInFirebase = async () => {
    try {
      const docRef = doc(db, "IPFSHashes","latestHash");
      const docSnap = await getDoc(docRef);
      console.log(docSnap,"kaise karo")

      if (docSnap.exists()) {
        console.log("Existing hash found:", docSnap.data().hash);
        return docSnap.data().hash;
      } else {
        console.log("No hash found, uploading data to IPFS.");
        return null;
      }
    } catch (error) {
      console.error('Error checking hash in Firebase:', error.message);
      throw error;
    }
  };

  // Function to handle data storage logic
  const handleStoreData = async () => {
    try {
      const existingHash = await checkHashInFirebase();
      if (!existingHash) {
        const newHash = await addToIPFS(EVStationData);
        await storeHashInFirebase(newHash);
      }
    } catch (error) {
      console.error('Error in handling data storage:', error.message);
    }
  };

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
    const distance = R * c; // Distance in km
    return distance;
  };
  const searchNearbyAddresses = (radius) => {
    return addresses.filter(address => {
        const distance = calculateDistance(userLocation.lat, userLocation.lng, address.latitude, address.longitude);
        return distance <= radius;
    });
};
const searchNearbyAddressesWithIncreasedRadius = (radius, maxRadius) => {
  if (radius > maxRadius) {
      return null; // Stop searching if reached the maximum radius
  }

  const nearbyAddresses = searchNearbyAddresses(radius);
  if (nearbyAddresses.length === 0) {
      // If no addresses found in the current radius, try with increased radius
      return searchNearbyAddressesWithIncreasedRadius(radius * 2, maxRadius);
  } else {
      return nearbyAddresses;
  }
};

// Use the recursive function to search for addresses with increasing radii
const nearbyAddresses = searchNearbyAddressesWithIncreasedRadius(5, 20);
  let calculateBestStation = ()=>{
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

    console.log(bestStation);
    return bestStation;
  }
  const fetchEVStations = async () => {
    const querySnapshot = await getDocs(collection(db, "EVStations"));
    const stations = [];
    querySnapshot.forEach((doc) => {
      stations.push(doc.data());
    });
    setAddresses(stations);
  };
  useEffect(() => {
    console.log("Addresses Updated: ", addresses); // Debug log
    setHighestCapacityAddress(calculateBestStation());
  }, [addresses,userLocation,nearbyAddresses]);
  useEffect(() => {
    handleStoreData();
    // fetchEVStations();
    fetchUserLocation();
  }, []);
  return (
    <>
      <section
        id="home"
        className="relative z-10 overflow-hidden bg-white pb-16 pt-[120px] dark:bg-gray-dark md:pb-[120px] md:pt-[150px] xl:pb-[160px] xl:pt-[180px] 2xl:pb-[200px] 2xl:pt-[210px]"
      >
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div
                className="wow fadeInUp mx-auto max-w-[800px] text-center"
                data-wow-delay=".2s"
                style={{ marginLeft: "100px" }}
              >
                <h1 className="mb-5 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight">
                  Out of Juice?
                </h1>
                <p className="mb-12 text-base !leading-relaxed text-body-color dark:text-body-color-dark sm:text-lg md:text-xl">
                EVNotify facilitates seamless communication between powerhouses and EV charging stations. Using decentralized networks, we provide users with real-time updates on Charging Stations status, maintenance schedules, and nearby optimal charging options. Simplifying EV charging for a greener future.
                </p>
                <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                  <Link
                    href={`https://www.google.com/maps/search/?api=1&query=${highestCapacityAddress?.latitude},${highestCapacityAddress?.longitude}`}
                    target="_blank"
                    className="rounded-xl bg-primary px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-primary/80"
                  >
                    Nearest Station
                  </Link>
                  <Link
                    href="/blog"
                    className="inline-block rounded-xl bg-black px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-black/90 dark:bg-white/10 dark:text-white dark:hover:bg-white/5"
                  >
                    Map
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-[-1] h-full w-full bg-[url(/images/video/shape.svg)] bg-cover bg-center bg-no-repeat"></div>

        <div className="absolute right-0 top-0 z-[-1] opacity-40 lg:opacity-100">
          <img
            src="https://64.media.tumblr.com/40a4d0519a8b2c41945153db17e0790e/tumblr_mwivpwTa3P1qkgvd1o1_640.gif"
            alt="Animated GIF"
            className="mt-20 object-cover"
            style={{ height: "400px", width: "400px", marginTop: "200px" }}
          />
        </div>
        <div
          className="absolute bottom-0 left-0 z-[-1] opacity-30 lg:opacity-100"
          style={{ marginLeft: "1000px" }}
        >
          <svg
            width="364"
            height="201"
            viewBox="0 0 364 201"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.88928 72.3303C33.6599 66.4798 101.397 64.9086 150.178 105.427C211.155 156.076 229.59 162.093 264.333 166.607C299.076 171.12 337.718 183.657 362.889 212.24"
              stroke="url(#paint0_linear_25:218)"
            />
            <path
              d="M-22.1107 72.3303C5.65989 66.4798 73.3965 64.9086 122.178 105.427C183.155 156.076 201.59 162.093 236.333 166.607C271.076 171.12 309.718 183.657 334.889 212.24"
              stroke="url(#paint1_linear_25:218)"
            />
            <path
              d="M-53.1107 72.3303C-25.3401 66.4798 42.3965 64.9086 91.1783 105.427C152.155 156.076 170.59 162.093 205.333 166.607C240.076 171.12 278.718 183.657 303.889 212.24"
              stroke="url(#paint2_linear_25:218)"
            />
            <path
              d="M-98.1618 65.0889C-68.1416 60.0601 4.73364 60.4882 56.0734 102.431C120.248 154.86 139.905 161.419 177.137 166.956C214.37 172.493 255.575 186.165 281.856 215.481"
              stroke="url(#paint3_linear_25:218)"
            />
            <circle
              opacity="0.8"
              cx="214.505"
              cy="60.5054"
              r="49.7205"
              transform="rotate(-13.421 214.505 60.5054)"
              stroke="url(#paint4_linear_25:218)"
            />
            <circle cx="220" cy="63" r="43" fill="url(#paint5_radial_25:218)" />
            <defs>
              <linearGradient
                id="paint0_linear_25:218"
                x1="184.389"
                y1="69.2405"
                x2="184.389"
                y2="212.24"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_25:218"
                x1="156.389"
                y1="69.2405"
                x2="156.389"
                y2="212.24"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" />
              </linearGradient>
              <linearGradient
                id="paint2_linear_25:218"
                x1="125.389"
                y1="69.2405"
                x2="125.389"
                y2="212.24"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" />
              </linearGradient>
              <linearGradient
                id="paint3_linear_25:218"
                x1="93.8507"
                y1="67.2674"
                x2="89.9278"
                y2="210.214"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" />
              </linearGradient>
              <linearGradient
                id="paint4_linear_25:218"
                x1="214.505"
                y1="10.2849"
                x2="212.684"
                y2="99.5816"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <radialGradient
                id="paint5_radial_25:218"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(220 63) rotate(90) scale(43)"
              >
                <stop offset="0.145833" stopColor="white" stopOpacity="0" />
                <stop offset="1" stopColor="white" stopOpacity="0.08" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </section>
    </>
  );
};

export default Hero;
