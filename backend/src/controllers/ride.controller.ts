import { Request, Response } from 'express';
import { Ride, IRide } from '../models/ride.model';
import { validationOnRideCreate,validationOnConfirmRide,validationOnStartRide,validationOnEndRide } from '../utils/validation';
import { getFare, getOtp,getCaptainsInTheRadius } from '../services/ride.service';
import { fetchAddressCoordinates } from '../services/map.service';
import { sendMessageToSocketId } from '../socket';
import {Captain, ICaptain} from '../models/captain.model';


interface AuthenticatedRequest extends Request {
    user?: any;
}

// The rideCreate function now uses the `AuthenticatedRequest` type for the `req` parameter
export const rideCreate = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    try {
        const {pickup, destination } = req.body; 
        
        const user = req.user;  // Access the user from the authenticated request
        
        const vehicleType: "auto" | "car" | "motorcycle" = req.body.vehicleType;
        // Validate request data (this function should return validation errors if any)
        const validationErrors = validationOnRideCreate(req);
        if (validationErrors.length > 0) {
            return res.status(400).json({ message: 'Validation failed', errors: validationErrors });
        }

        // Get fare calculation for the ride
        const fare = await getFare(pickup, destination);
        if (!fare[vehicleType]) {
            return res.status(400).json({ message: 'Invalid vehicle type' });
        }

        // Create the ride in the database
        // Assuming Ride.create() uses the IRide interface as the structure for the new ride
        const ride = await Ride.create({
            user: user._id,  // Ensure user._id is safely accessed from the authenticated user
            pickup,
            destination,
            otp: getOtp(6),
            fare: fare[vehicleType],
            vehicleType
        });

        // Respond with success if the ride was created
        res.status(201).json({ message: 'Ride created successfully', data: ride });

        const pickupCoordinates = await fetchAddressCoordinates(pickup); 

        const captainsInRadius: any = await getCaptainsInTheRadius(pickupCoordinates.results[0].geometry.location.lat,pickupCoordinates.results[0].geometry.location.lng, 2000);
        console.log("totalCaptains:",captainsInRadius);
        
         ride.otp = null;

         const rideWithUser = await Ride.findOne({_id: ride._id}).populate('user');

         console.log("rideWithUser",rideWithUser);

         captainsInRadius.map((captain: ICaptain) => {
            console.log({
                event: 'new-ride',
                data: rideWithUser // Ensure 'ride' is correctly typed and defined in scope
            })
            sendMessageToSocketId(captain.socketId, {
                event: 'new-ride',
                data: rideWithUser // Ensure 'ride' is correctly typed and defined in scope
            });
        });


    } catch (error: any) {
        // Catch any errors during the ride creation process
        return res.status(500).json({ message: 'Error creating ride', error });
    }
};

export const calculateFare = async (req: Request, res: Response): Promise<void> => {
    try {
        const { pickup, destination } = req.body;
        // Validate request body
        if (!pickup || !destination) {
            res.status(400).json({ error: 'Pickup and destination are required!' });
            return;
        }

        // Call the service to calculate the fare
        const fare = await getFare(pickup, destination);

        // Send the calculated fare in the response
        res.status(200).json({
            message: 'Fare calculated successfully',
            fare,
        });
    } catch (error: any) {
        console.error('Error calculating fare:', error.message);
        res.status(500).json({ error: error.message });
    }
};

export const confirmRide = async (req: Request, res: Response): Promise<void> => {

    try {

        const { rideId, captainId } = req.body;
        // Validate request data (this function should return validation errors if any)
        const validationErrors = validationOnConfirmRide(req);
        if (validationErrors.length > 0) {
            res.status(400).json({ message: 'Validation failed', errors: validationErrors });
            return;
        }
        

        await Ride.findOneAndUpdate({
            _id: rideId
        }, {
            status: 'accepted',
            captain: captainId
        })
    
        const ride:any = await Ride.findOne({
            _id: rideId
        }).populate('user').populate('captain').select('+otp');
    
        if (!ride) {
            throw new Error('Ride not found');
        }
       

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: ride
        })
        console.log(ride);
        res.status(200).json(ride);
        return;
    } catch (err: any) {

        console.log(err);
        res.status(500).json({ message: err.message });
        return;
    }
}

export const startRide = async (req: Request, res: Response): Promise<void> => {

    const validationErrors = validationOnStartRide(req);
    if (validationErrors.length > 0) {
        res.status(400).json({ message: 'Validation failed', errors: validationErrors });
        return;
    }

    try {
        const { rideId, otp } = req.query;

        const ride:any = await Ride.findOne({
            _id: rideId
        }).populate('user').populate('captain').select('+otp');
        console.log("ride",ride);
        if (!ride) {
            throw new Error('Ride not found');
        }
    
        if (ride.status !== 'accepted') {
            throw new Error('Ride not accepted');
        }
    
        if (ride.otp != otp) {
            throw new Error('Invalid OTP');
        }
    
        await Ride.findOneAndUpdate({
            _id: rideId
        }, {
            status: 'ongoing'
        })

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        })

        res.status(200).json(ride);
        return;
    } catch (err: any) {
        res.status(500).json({ message: err.message });
        return;
    }
}

export const endRide = async (req:Request, res:Response): Promise<void> => {

    const validationErrors = validationOnEndRide(req);
    if (validationErrors.length > 0) {
        res.status(400).json({ message: 'Validation failed', errors: validationErrors });
        return;
    }

    try {

        const { rideId } = req.body;
        
        const ride:any = await Ride.findOne({
            _id: rideId
        }).populate('user').populate('captain').select('+otp');
    
        if (!ride) {
            throw new Error('Ride not found');
        }
    
        if (ride.status !== 'ongoing') {
            throw new Error('Ride not ongoing');
        }
    
        await Ride.findOneAndUpdate({
            _id: rideId
        }, {
            status: 'completed'
        })


        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-ended',
            data: ride
        })



        res.status(200).json(ride);
        return;
    } catch (err:any) {
        res.status(500).json({ message: err.message });
        return;
    } 
}