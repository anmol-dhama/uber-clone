import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CaptainDataContext } from '../contexts/CaptainContext';
import axios from 'axios';

const CaptainProtectWrapper = ({ children }) => {
    const navigate = useNavigate();
    const [captain, setCaptain] = useContext(CaptainDataContext);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/captain-login');
            return;
        }

        const fetchCaptainProfile = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/captains/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    setCaptain(response.data.captain);
                } else {
                    throw new Error("Failed to fetch captain profile");
                }
            } catch (error) {
                console.error("Error fetching captain profile:", error);
                localStorage.removeItem('token');
                navigate('/captain-login');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCaptainProfile();
    }, [navigate, setCaptain]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return <>{children}</>;
};

export default CaptainProtectWrapper;
