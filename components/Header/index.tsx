"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { PushAPI, CONSTANTS, NotificationOptions } from "@pushprotocol/restapi";
import { ethers } from "ethers";
import ThemeToggler from "./ThemeToggler";
import menuData from "./menuData";
import detectEthereumProvider from "@metamask/detect-provider";
import {db} from "./../../firebaseConfig";
import { getDocs,collection } from 'firebase/firestore';
import chargingData from './ChargingStationDayDataset';
import data from './EVLocations';


interface Address {
  address: string;
  capacity: string;
  city: string;
  close: string;
  cost_per_unit: any; // Replace 'any' with a more specific type if possible
  country: string;
  latitude: number;
  longitude: number;
  name: string;
  open: string;
  payment_modes: string;
  postal_code: number;
  staff: string;
  station_type:string;
  total:number;
  type:string;
  power_type: string;
  zone: string;
  time?: string; 
}


const Header = () => {
  const [addresses, setAddresses] = useState<Address[]>(data);
  const EVStationData = chargingData;
  const [closedStation, setclosedStation] = useState([]);
  const [maintainceStation, setMaintainceStation] = useState([]);
  const [highTrafficStation, setHighTrafficStation] = useState([]);
  const fetchEVStations = async () => {
    const querySnapshot = await getDocs(collection(db, "EVStations"));
    const stations = [];
    querySnapshot.forEach((doc) => {
      stations.push(doc.data());
    });
    setAddresses(stations);
  };

  const setData = () => {
    // Ensure there are addresses to choose from
    if (addresses.length > 0) {
      console.log("hello")
      // Select random stations for closedStation
      const closedStationsCount = Math.floor(Math.random() * 2) + 2; // Randomly choose 2 or 3
      const selectedClosedStations = selectRandomStations(closedStationsCount);
      setclosedStation(selectedClosedStations);
  
      // Select random stations for maintainceStation
      const maintainceStationsCount = Math.floor(Math.random() * 2) + 2; // Randomly choose 2 or 3
      const selectedMaintainceStations = selectRandomStations(maintainceStationsCount, true);
      setMaintainceStation(selectedMaintainceStations);
    }
  };
  
  const selectRandomStations = (count: number, withTime: boolean = false): Address[]  => {
    const selectedStations: Address[] = [];
  
    while (selectedStations.length < count) {
      const randomIndex = Math.floor(Math.random() * addresses.length);
      const station = { ...addresses[randomIndex] };
  
      // Add random maintenance time if needed
      if (withTime) {
        const randomHour = Math.floor(Math.random() * 24);
        const randomMinute = Math.floor(Math.random() * 60);
        station.time = `${randomHour.toString().padStart(2, '0')}:${randomMinute.toString().padStart(2, '0')}`;
      }
  
      // To avoid duplicates
      if (!selectedStations.some(s => s.name === station.name)) {
        selectedStations.push(station);
      }
    }
  
    return selectedStations;
  };
  const statusValues = {
    LOW: 1,
    MEDIUM: 2,
    HIGH: 3,
  };
  
  // Function to calculate the average status for a given station name
  const getAverageStatus = (stationName) => {
    const relevantData = EVStationData.filter(item => item.station_id === stationName);
    const totalStatus = relevantData.reduce((total, currentItem) => {
      return total + statusValues[currentItem.status];
    }, 0);
    return relevantData.length > 0 ? totalStatus / relevantData.length : 0;
  };
  
  // Function to find high traffic stations
  const setHighTrafficStations = () => {
    const averageStatuses = addresses.map(station => {
      return {
        ...station,
        averageStatus: getAverageStatus(station.name),
      };
    });
  
    // Sort the stations by average status and pick the top 2-3
    const sortedStations = averageStatuses.sort((a, b) => b.averageStatus - a.averageStatus).slice(0, 3);
    setHighTrafficStation(sortedStations);
  };
  useEffect(() => {
    setData();
    setHighTrafficStations();
  }, []);
  const createStationListHtml = (stations, includeTime = false) => {
    return stations.map(station => {
      const googleMapsLink = `https://www.google.com/maps?q=${station.latitude},${station.longitude}`;
      return `<li><a href='${googleMapsLink}' target='_blank'>${station.name}</a>${includeTime ? ` - Maintenance Time: ${station.time}` : ''}</li>`;
    }).join('');
  };
  const handleInfo = async () => {
    console.log(closedStation,maintainceStation,highTrafficStation,"kaise");

    // Check if user is connected to a web3 wallet
    if (typeof window !== "undefined" && (window as any).ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(
          (window as any).ethereum, 
        );
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        // Initialize PushAPI with the signer
        const initializedUser = await PushAPI.initialize(signer, {
          env: CONSTANTS.ENV.STAGING,
        });

        // Subscribe to the push channel
        const pushChannelAddress = "0x2712940f11eC4Cb52F9BeD237B45De17c82Ff863";
        await initializedUser.notification.subscribe(
          `eip155:11155111:${pushChannelAddress}`,
        );

        console.log({ pushChannelAddress }, "this is channel address");
        const closedStationsHtml = createStationListHtml(closedStation);
        const maintainceStationsHtml = createStationListHtml(maintainceStation, true);
        const highTrafficStationsHtml = createStationListHtml(highTrafficStation);

        console.log(closedStationsHtml,maintainceStationsHtml,highTrafficStationsHtml);

        // Send a test notification
        const options1 = {
          notification: { title: "Closed EV Stations", body:`<ul>${closedStationsHtml}</ul>`,},
        };
        const options2 = {
          notification: { title: "EV Station under Maintance", body:`<ul>${maintainceStationsHtml}</ul>` ,},
        };
        const options3 = {
          notification: { title: "High Traffic EV Station", body:`<ul>${highTrafficStationsHtml}</ul>`,},
        };

        console.log({ options1 }, "this the notification how it is passed for option 1");
        console.log({ options2 }, "this the notification how it is passed for option 2");
        console.log({ options3 }, "this the notification how it is passed for option 3");

        let broadcast = await initializedUser.channel.send(["*"], options1);
        broadcast = await initializedUser.channel.send(["*"], options2);
        broadcast = await initializedUser.channel.send(["*"], options3);
        console.log("Broadcast sent:", broadcast);
      } catch (error) {
        console.error("Error initializing PushAPI:", error);
      }
    } else {
      console.error("Ethereum provider not found.");
    }
  };
  const [navbarOpen, setNavbarOpen] = useState(false);
  const navbarToggleHandler = () => {
    setNavbarOpen(!navbarOpen);
  };

  const [sticky, setSticky] = useState(false);
  const handleStickyNavbar = () => {
    if (window.scrollY > -1) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
  });

  const [openIndex, setOpenIndex] = useState(-1);
  const handleSubmenu = (index) => {
    if (openIndex === index) {
      setOpenIndex(-1);
    } else {
      setOpenIndex(index);
    }
  };

  const usePathName = usePathname();

  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);

  const connectWithMetaMask = async (): Promise<void> => {
    const provider = await detectEthereumProvider();

    if (provider) {
      try {
        const accounts = await (window as any).ethereum.request({
          method: "eth_requestAccounts",
        });

        const connectedAccount = accounts[0];

        //slicing the connected address
        const truncatedAddress = connectedAccount.slice(0, 4) + "..." + connectedAccount.slice(-2);
        setConnectedAddress(truncatedAddress);

        console.log(
          "MetaMask connected successfully! Selected account:",
          connectedAccount,
        );
      } catch (error) {
        console.error("Error connecting with MetaMask:", error.message);
      }
    } else {
      alert("MetaMask extension not detected. Please install MetaMask.");
    }
    handleInfo();
  };

  return (
    <>
      <header
        className={`header left-0 top-0 z-40 flex w-full items-center ${
          sticky
            ? "fixed z-[9999] bg-white !bg-opacity-80 shadow-sticky backdrop-blur-sm transition dark:bg-gray-dark dark:shadow-sticky-dark"
            : "absolute bg-transparent"
        }`}
      >
        <div className="container"  style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '20px' }}>
          
          <div className="relative -mx-4 flex items-center justify-between" >
            <div className="w-60 max-w-full px-4 xl:mr-12 ">
              <Link
                href="/"
                className={`header-logo block w-full ${
                  sticky ? "py-5 lg:py-2" : "py-8"
                } `}
              >
                {/* green grid */}
                <Image
                  src="/images/logo/logo2.jpg"
                  alt="logo"
                  width={140}
                  height={30}
                  className="w-full dark:hidden"
                />
                <Image
                  src="/images/logo/logo1.png"
                  alt="logo"
                  width={140}
                  height={30}
                  className="hidden w-full dark:block"
                />
              </Link>
            </div>
            <div className="flex w-full items-center justify-between px-4">
              
              <div>
                <button
                  onClick={navbarToggleHandler}
                  id="navbarToggler"
                  aria-label="Mobile Menu"
                  className="absolute right-4 top-1/2 block translate-y-[-50%] rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden transition duration-300 ease-in-out transform hover:scale-105"
                >
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                      navbarOpen ? " top-[7px] rotate-45" : " "
                    }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                      navbarOpen ? "opacity-0 " : " "
                    }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                      navbarOpen ? " top-[-8px] -rotate-45" : " "
                    }`}
                  />
                </button>
                <nav
                  id="navbarCollapse"
                  className={`navbar absolute right-0 z-30 w-[250px] rounded border-[.5px] border-body-color/50 bg-white px-6 py-4 duration-300 dark:border-body-color/20 dark:bg-dark lg:visible lg:static lg:w-auto lg:border-none lg:!bg-transparent lg:p-0 lg:opacity-100 ${
                    navbarOpen
                      ? "visibility top-full opacity-100"
                      : "invisible top-[120%] opacity-0"
                  }`}
                >
                  <ul className="block lg:flex lg:space-x-12 justify-center">
                    {menuData.map((menuItem, index) => (
                      <li key={index} className="group relative">
                        {menuItem.path ? (
                          <Link
                            href={menuItem.path}
                            className={`flex py-2 text-base lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 ${
                              usePathName === menuItem.path
                                ? "text-primary dark:text-white"
                                : "text-dark hover:text-primary dark:text-white/70 dark:hover:text-white"
                            }`}
                          >
                            {menuItem.title}
                          </Link>
                        ) : (
                          <>
                            <p
                              onClick={() => handleSubmenu(index)}
                              className="flex cursor-pointer items-center justify-between py-2 text-base text-dark group-hover:text-primary dark:text-white/70 dark:group-hover:text-white lg:mr-0 lg:inline-flex lg:px-0 lg:py-6"
                            >
                              {menuItem.title}
                              <span className="pl-3">
                                <svg width="25" height="24" viewBox="0 0 25 24">
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M6.29289 8.8427C6.68342 8.45217 7.31658 8.45217 7.70711 8.8427L12 13.1356L16.2929 8.8427C16.6834 8.45217 17.3166 8.45217 17.7071 8.8427C18.0976 9.23322 18.0976 9.86639 17.7071 10.2569L12 15.964L6.29289 10.2569C5.90237 9.86639 5.90237 9.23322 6.29289 8.8427Z"
                                    fill="currentColor"
                                  />
                                </svg>
                              </span>
                            </p>
                            <div
                              className={`submenu relative left-0 top-full rounded-sm bg-white transition-[top] duration-300 group-hover:opacity-100 dark:bg-dark lg:invisible lg:absolute lg:top-[110%] lg:block lg:w-[250px] lg:p-4 lg:opacity-0 lg:shadow-lg lg:group-hover:visible lg:group-hover:top-full ${
                                openIndex === index ? "block" : "hidden"
                              }`}
                            >
                              {menuItem.submenu.map((submenuItem, index) => (
                                <Link
                                  href={submenuItem.path}
                                  key={index}
                                  className="block rounded py-2.5 text-sm text-dark hover:text-primary dark:text-white/70 dark:hover:text-white lg:px-3"
                                >
                                  {submenuItem.title}
                                </Link>
                              ))}
                            </div>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
              <div className="flex items-center justify-end pr-16 lg:pr-0 space-x-4">
                <div>
                  {connectedAddress ? (
                    <button className="ease-in-up hidden rounded-xl bg-primary px-8 py-3 text-base font-medium text-white shadow-btn transition duration-300 hover:bg-opacity-90 hover:shadow-btn-hover md:block md:px-9 lg:px-6 xl:px-9">
                      {connectedAddress}
                    </button>
                  ) : (
                    <button
                      onClick={connectWithMetaMask}
                      className="ease-in-up hidden rounded-xl bg-primary px-8 py-3 text-base font-medium text-white shadow-btn transition duration-300 hover:bg-opacity-90 hover:shadow-btn-hover md:block md:px-9 lg:px-6 xl:px-9"
                    >
                      Connect Your Wallet
                    </button>
                  )}
                </div>

                <div>
                  <ThemeToggler />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;