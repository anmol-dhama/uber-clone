import mongoose, { Document, Model, Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

// Define an interface for the User document (instance methods)
interface ICaptain extends Document {
    fullName: {
        firstName: string;
        lastName: string;
    };
    email: string;
    password: string;
    socketId: string;
    status: string;
    vehicle: {
        color: string;
        plate: string;
        capacity: string;
        vehicleType: string;
    };
    location: {
        lat: Number;
        long: Number;
    }

    //instance methods
    getJWT(): Promise<string>,
    validatePassword(password: string): Promise<boolean>
}

// Define an interface for the static methods (including hashPassword)
interface ICaptainModel extends Model<ICaptain> {
    hashPassword(password: string): Promise<string>; // Static method for hashing password
}

// Define the User schema
const captainSchema: Schema<ICaptain, ICaptainModel> = new Schema(
    {
        fullName: {
            firstName: { type: String, required: true },
            lastName: { type: String, required: true }
        },
        password: { type: String, required: true, select: false },
        email: { type: String, required: true, unique: true },
        socketId: { type: String },
        status: { type: String, required: true, enum: ["active","inactive"], default: "active"},
        vehicle: {
            color: {type: String, required: true},
            plate: {type: String, required: true},
            capacity: {type: String, required: true},
            vehicleType: { type: String, required: true, enum:["car","bike","auto"]}
        },
        location: {
            lat:{type:Number},
            long:{type:Number}
        }
    },
    { timestamps: true }
);

// Static method for password hashing
captainSchema.statics.hashPassword = async function (password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
};

// Instance method to generate JWT
captainSchema.methods.getJWT = async function () {
    const token = await jwt.sign({ _id: this._id, first_name: this.first_name, email: this.email }, process.env.JWT_SECRET as string, {expiresIn: '24h'});
    return token;
};

// Instance method to validate password
captainSchema.methods.validatePassword = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
};

// Define the User model
const Captain = mongoose.model<ICaptain, ICaptainModel>('Captain', captainSchema);

export { Captain, ICaptain, ICaptainModel };
