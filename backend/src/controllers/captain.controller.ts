import { Captain, ICaptain } from '../models/captain.model';
import { BlacklistToken } from '../models/blacklistToken.model';
import { Request, Response } from 'express';
import { validationOnCaptainRegister } from '../utils/validation';

interface AuthenticatedRequest extends Request {
    captain?: any;
}
  
export const register = async (req: Request, res: Response): Promise<any> => {
    try {
        const { fullName, email, password,status,vehicle,location } = req.body;

        // Validate request data
        const validationErrors = validationOnCaptainRegister(req);
        if (validationErrors.length > 0) {
            return res.status(400).json({ message: 'Validation failed', errors: validationErrors });
        }

        // Check if email already exists
        const emailExist = await Captain.findOne({ email: email });
        if (emailExist) {
            return res.status(400).send("Email already exists!");
        }

        // Hash the password using the static method
        const hashedPassword = await Captain.hashPassword(password);

         // Create a new captain document
         const captain = new Captain({
            email: email,
            password: hashedPassword,
            fullName: { firstName: fullName.firstName, lastName: fullName.lastName }, // Corrected structure
            socketId: "",  // Set socketId if needed, otherwise remove it
            status: status,
            vehicle: vehicle,
            location: location
        });

        const Gentoken = await captain.getJWT();

        const savedCaptain = await captain.save();

        return res.status(201).json({ message: 'Captain created successfully', data: savedCaptain, token: Gentoken });
    } catch (error) {
        return res.status(500).json({ message: 'Error creating captain', error });
    }
};


export const login = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new Error("Provide all mandatory fields!")
        }

        const fetchCaptain = await Captain.findOne({ email }).select('+password') as ICaptain;

        if (!fetchCaptain) {
            throw new Error("User not exist!")
        }

        const isPasswordValid = await fetchCaptain.validatePassword(password);

        if (!isPasswordValid) {
            throw new Error("Invalid credentials");
        }

        const token = await fetchCaptain.getJWT();

        res.cookie("token", token);

        return res.status(200).send({ status: "Login Successfully!", token: token ,captain: fetchCaptain.fullName});

    } catch (error) {
        return res.status(500).json({ message: 'Error in login', error });
    }
}

export const getProfile = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    try {
        const captain = req.captain;
        if (!captain) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        return res.status(200).json({ captain });
    } catch (err:any) {
        return res.status(500).json({ message: "Something went wrong", error: err.message });
    }
};

export const logout = async (req: Request, res: Response): Promise<any> => {
    try {
        // Get the token from the request cookies or headers
        const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(400).send("No token provided!");
        }

        // Blacklist the token
        await BlacklistToken.create({ token });

        // Clear the token cookie
        res.cookie("token", null, {
            httpOnly: true,
            expires: new Date(0),
        });

        return res.status(200).send("Logged out successfully!");
    } catch (err) {
        console.error(err);
        return res.status(500).send("Something went wrong during logout.");
    }
};

