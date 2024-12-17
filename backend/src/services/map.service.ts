import axios from "axios";

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API;

// Service to fetch address coordinates
export const fetchAddressCoordinates = async (address: string) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${GOOGLE_MAPS_API_KEY}`;

  const response = await axios.get(url);
  return response.data;
};

// Service to fetch distance and time
export const fetchDistanceTime = async (
  origin: string,
  destination: string,
  mode: string
) => {
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
    origin
  )}&destinations=${encodeURIComponent(
    destination
  )}&mode=${mode}&key=${GOOGLE_MAPS_API_KEY}`;

  const response = await axios.get(url);
  return response.data;
};

// Service to fetch auto-suggestions
export const fetchAutoSuggestions = async (
  input: string,
  location?: string,
  radius: number = 50000
) => {
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
    input
  )}&key=${GOOGLE_MAPS_API_KEY}${location ? `&location=${location}` : ""}&radius=${radius}`;

  const response = await axios.get(url);
  return response.data;
};