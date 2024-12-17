import { fetchDistanceTime } from './map.service';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Captain } from '../models/captain.model';

// Fare calculation logic moved here
export const getFare = async (pickup: string, destination: string) => {
    if (!pickup || !destination) {
        throw new Error('Pickup and destination are required!');
    }

    // Fetch distance and time from the external service (e.g., Google Maps API)
    const distanceTime = await fetchDistanceTime(pickup, destination, 'driving');

    // Ensure that distance and duration are properly parsed as numbers
    const distance = parseFloat(distanceTime.rows[0].elements[0].distance.text.replace(/[^\d.-]/g, '')); // Ensure distance is in kilometers
    const duration = parseFloat(distanceTime.rows[0].elements[0].duration.text.replace(/[^\d.-]/g, '')); // Ensure duration is in minutes

    // If fetching distanceTime failed or values are invalid, throw an error
    if (isNaN(distance) || isNaN(duration)) {
        throw new Error('Invalid distance or duration values.');
    }

    // Base fare rates and per unit rates
    const baseFare = {
        auto: 30,
        car: 100,
        motorcycle: 20
    };
    const perKmRate = {
        auto: 10,
        car: 15,
        motorcycle: 8
    };
    const perMinuteRate = {
        auto: 2,
        car: 3,
        motorcycle: 1.5
    };

    // Calculate fare for each vehicle type based on distance and duration
    const fare = {
        auto: baseFare.auto + (distance * perKmRate.auto) + (duration * perMinuteRate.auto),
        car: baseFare.car + (distance * perKmRate.car) + (duration * perMinuteRate.car),
        motorcycle: baseFare.motorcycle + (distance * perKmRate.motorcycle) + (duration * perMinuteRate.motorcycle)
    };

    // Return calculated fare object
    return fare;
};

export const getOtp = (num: any)=>{
   function generateOtp(num: any){
    const otp = crypto.randomInt(Math.pow(10, num-1), Math.pow(10, num)).toString();
    return otp;
   }
   return generateOtp(num);
}

export const getCaptainsInTheRadius = async (ltd: number, lng: number, radius: any) => {
    try {
        if (!ltd || !lng || !radius) {
            throw new Error('Latitude, longitude, and radius are required.');
        }

        // Convert radius to meters (assuming radius is provided in kilometers)
        const radiusInMeters = radius * 1000;

        // Geospatial query using MongoDB's $geoNear
        const captains = await Captain.aggregate([
            {
                $geoNear: {
                    near: {
                        type: 'Point',
                        coordinates: [lng, ltd],  // [longitude, latitude]
                    },
                    distanceField: 'distance',  // Field to store the calculated distance
                    maxDistance: radiusInMeters,  // Max search distance in meters
                    spherical: true,  // Use spherical geometry for accurate distance calculation
                },
            },
            {
                $limit: 10,  // Limit the number of results to 10
            },
        ]);
        return captains;
    } catch (error: any) {
        console.error(error);
        return { error: 'Error fetching captains within radius' };
    }
};

