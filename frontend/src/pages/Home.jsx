import React, { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import axios from 'axios';
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import ConfirmRide from '../components/ConfirmRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
import { SocketContext } from '../contexts/SocketContext';
import { useContext } from 'react';
import { UserDataContext } from '../contexts/UsserContext';
import { useNavigate } from 'react-router-dom';
import LiveTracking from '../components/LiveTracking';

const Home = () => {
    const [ pickup, setPickup ] = useState('')
    const [ destination, setDestination ] = useState('')
    const [ panelOpen, setPanelOpen ] = useState(false)
    const vehiclePanelRef = useRef(null)
    const confirmRidePanelRef = useRef(null)
    const vehicleFoundRef = useRef(null)
    const waitingForDriverRef = useRef(null)
    const panelRef = useRef(null)
    const panelCloseRef = useRef(null)
    const [ vehiclePanel, setVehiclePanel ] = useState(false)
    const [ confirmRidePanel, setConfirmRidePanel ] = useState(false)
    const [ vehicleFound, setVehicleFound ] = useState(false)
    const [ waitingForDriver, setWaitingForDriver ] = useState(false)
    const [ pickupSuggestions, setPickupSuggestions ] = useState([])
    const [ destinationSuggestions, setDestinationSuggestions ] = useState([])
    const [ activeField, setActiveField ] = useState(null)
    const [ fare, setFare ] = useState({})
    const [ vehicleType, setVehicleType ] = useState(null)
    const [ ride, setRide ] = useState(null)

    const navigate = useNavigate()

    const { socket } = useContext(SocketContext)
    const [user] = React.useContext(UserDataContext);


    useEffect(() => {
        socket.emit("join", { userType: "user", userId: user._id })
    }, [ user ])

    socket.on('ride-confirmed', ride => {


        setVehicleFound(false)
        setWaitingForDriver(true)
        setRide(ride)
    })

    socket.on('ride-started', ride => {
        console.log("ride")
        setWaitingForDriver(false)
        navigate('/riding', { state: { ride } }) // Updated navigate to include ride data
    })


    const handlePickupChange = async (e) => {
        setPickup(e.target.value)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/maps/getAutoSuggestions`, {
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }

            })
            setPickupSuggestions(response.data.suggestions)
        } catch {
            // handle error
        }
    }

    const handleDestinationChange = async (e) => {
        setDestination(e.target.value)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/maps/getAutoSuggestions`, {
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setDestinationSuggestions(response.data.suggestions)
        } catch {
            // handle error
        }
    }

    const submitHandler = (e) => {
        e.preventDefault()
    }

    useGSAP(function () {
        if (panelOpen) {
            gsap.to(panelRef.current, {
                height: '70%',
                padding: 24
                // opacity:1
            })
            gsap.to(panelCloseRef.current, {
                opacity: 1
            })
        } else {
            gsap.to(panelRef.current, {
                height: '0%',
                padding: 0
                // opacity:0
            })
            gsap.to(panelCloseRef.current, {
                opacity: 0
            })
        }
    }, [ panelOpen ])


    useGSAP(function () {
        if (vehiclePanel) {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ vehiclePanel ])

    useGSAP(function () {
        if (confirmRidePanel) {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ confirmRidePanel ])

    useGSAP(function () {
        if (vehicleFound) {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ vehicleFound ])

    useGSAP(function () {
        if (waitingForDriver) {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ waitingForDriver ])


    async function findTrip() {
        
        setVehiclePanel(true)
        setPanelOpen(false)

        const response = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/api/rides/calculateFare`,
            { pickup, destination }, // Request body
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
        

       
        setFare(response.data.fare)


    }

    async function createRide() {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/rides/rideCreate`, {
            pickup,
            destination,
            vehicleType
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        


    }

    return (
        <div className="relative h-screen overflow-hidden">
        {/* Uber Logo */}
        <img
          className="w-16 absolute top-5 left-5"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt="Uber Logo"
        />
         <div className='h-screen w-screen'>
                {/* image for temporary use  */}
                <LiveTracking />
            </div>
      
        {/* Background Image */}
        <div className="absolute top-0 left-0 h-screen w-screen">
          <img
            className="h-full w-full object-cover"
            src="https://simonpan.com/wp-content/themes/sp_portfolio/assets/uber-challenge.jpg"
            alt="Background"
          />
        </div>
      
        {/* Bottom Content */}
        <div className="absolute inset-0 flex flex-col justify-end">
          {/* Trip Details Panel */}
          <div className="p-6 bg-white shadow-md rounded-t-xl">
            <h5
              ref={panelCloseRef}
              onClick={() => setPanelOpen(false)}
              className="absolute right-6 top-6 text-2xl opacity-0 transition-opacity duration-300 cursor-pointer"
            >
              <i className="ri-arrow-down-wide-line"></i>
            </h5>
            <h4 className="text-2xl font-semibold">Find a trip</h4>
            <form
              className="relative py-3 space-y-3"
              onSubmit={(e) => submitHandler(e)}
            >
              {/* Line Indicator */}
              <div className="absolute left-5 top-[50%] -translate-y-1/2 h-16 w-1 bg-gray-700 rounded-full"></div>
      
              {/* Pickup Input */}
              <input
                onClick={() => {
                  setPanelOpen(true);
                  setActiveField("pickup");
                }}
                value={pickup}
                onChange={handlePickupChange}
                className="w-full rounded-lg bg-gray-100 px-4 py-3 text-lg focus:outline-none focus:ring focus:ring-gray-300"
                type="text"
                placeholder="Add a pick-up location"
              />
      
              {/* Destination Input */}
              <input
                onClick={() => {
                  setPanelOpen(true);
                  setActiveField("destination");
                }}
                value={destination}
                onChange={handleDestinationChange}
                className="w-full rounded-lg bg-gray-100 px-4 py-3 text-lg focus:outline-none focus:ring focus:ring-gray-300"
                type="text"
                placeholder="Enter your destination"
              />
            </form>
            <button
              onClick={findTrip}
              className="w-full mt-3 rounded-lg bg-black px-4 py-3 text-lg font-medium text-white hover:bg-gray-800"
            >
              Find Trip
            </button>
          </div>
      
          {/* Location Search Panel */}
          <div
            ref={panelRef}
            className="h-0 overflow-hidden bg-white transition-all duration-300"
          >
            <LocationSearchPanel
              suggestions={
                activeField === "pickup" ? pickupSuggestions : destinationSuggestions
              }
              setPanelOpen={setPanelOpen}
              setVehiclePanel={setVehiclePanel}
              setPickup={setPickup}
              setDestination={setDestination}
              activeField={activeField}
            />
          </div>
        </div>
      
        {/* Vehicle Panel */}
        <div
          ref={vehiclePanelRef}
          className="fixed bottom-0 left-0 z-50 w-full bg-white px-3 py-10 pt-12"
          >
          <VehiclePanel
            selectVehicle={setVehicleType}
            fare={fare}
            setConfirmRidePanel={setConfirmRidePanel}
            setVehiclePanel={setVehiclePanel}
          />
        </div>
      
        {/* Confirm Ride Panel */}
        <div
          ref={confirmRidePanelRef}
          className="fixed bottom-0 left-0 z-50 w-full bg-white px-3 py-10 pt-12"
        >
          <ConfirmRide
            createRide={createRide}
            pickup={pickup}
            destination={destination}
            fare={fare}
            vehicleType={vehicleType}
            setConfirmRidePanel={setConfirmRidePanel}
            setVehicleFound={setVehicleFound}
          />
        </div>
      
        {/* Looking for Driver Panel */}
        <div
          ref={vehicleFoundRef}
          className="fixed bottom-0 left-0 z-50 w-full bg-white px-3 py-10 pt-12"
        >
          <LookingForDriver
            createRide={createRide}
            pickup={pickup}
            destination={destination}
            fare={fare}
            vehicleType={vehicleType}
            setVehicleFound={setVehicleFound}
          />
        </div>
      
        {/* Waiting for Driver Panel */}
        <div
          ref={waitingForDriverRef}
          className="fixed bottom-0 left-0 z-50 w-full bg-white px-3 py-10 pt-12"
        >
          <WaitingForDriver
            ride={ride}
            setVehicleFound={setVehicleFound}
            setWaitingForDriver={setWaitingForDriver}
            waitingForDriver={waitingForDriver}
          />
        </div>
      </div>
      
    )
}

export default Home