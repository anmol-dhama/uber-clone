import mongoose, { Document, Schema } from 'mongoose';

// Define an interface for the Ride document (instance methods)
interface IRide extends Document {
    user: mongoose.Schema.Types.ObjectId;
    captain?: mongoose.Schema.Types.ObjectId;
    pickup: string;
    destination: string;
    fare: number;
    status: 'pending' | 'accepted' | 'ongoing' | 'completed' | 'cancelled'; // Use literal types for status
    duration?: number;
    distance?: number;
    paymentId?: string;
    orderId?: string;
    signature?: string;
    otp?: number | null;
    vehicleType: 'auto' | 'car' | 'motorcycle';  // Using string literals for vehicleType
}

// Define the Ride schema
const rideSchema: Schema<IRide> = new Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        captain: { type: mongoose.Schema.Types.ObjectId, ref: 'Captain' },
        pickup: { type: String, required: true },
        destination: { type: String, required: true },
        fare: { type: Number, required: true },
        status: { type: String, required: true, enum: ['pending', 'accepted', 'ongoing', 'completed', 'cancelled'], default: 'pending' },
        duration: { type: Number },
        distance: { type: Number },
        paymentId: { type: String },
        orderId: { type: String },
        signature: { type: String },
        otp: {type: Number},
        vehicleType: { type: String, required: true, enum: ['auto', 'car', 'motorcycle'] }
    },
    { timestamps: true }
);

// Define the Ride model
const Ride = mongoose.model<IRide>('Ride', rideSchema);

export { Ride, IRide };
