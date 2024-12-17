import { Request, Response } from "express";
import {
  fetchAddressCoordinates,
  fetchDistanceTime,
  fetchAutoSuggestions,
} from "../services/map.service";
import { Captain } from "../models/captain.model";

export const getAddressCoordinates = async (req: Request, res: Response): Promise<void> => {
  try {
    const { address } = req.query;

    if (!address) {
      res.status(400).json({ error: "Address is required." });
      return;
    }

    const data = await fetchAddressCoordinates(address as string);

    if (data.status !== "OK" || !data.results.length) {
      res.status(404).json({ error: "No coordinates found for the given address." });
      return;
    }

    const { lat, lng } = data.results[0].geometry.location;

    res.status(200).json({ latitude: lat, longitude: lng });
  } catch (error: any) {
    console.error("Error fetching coordinates:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const getDistanceTime = async (req: Request, res: Response): Promise<void> => {
  try {
    const { origin, destination, mode = "driving" } = req.query;

    if (!origin || !destination) {
      res.status(400).json({
        error: "Both 'origin' and 'destination' query parameters are required.",
      });
      return;
    }

    const data = await fetchDistanceTime(
      origin as string,
      destination as string,
      mode as string
    );

    if (data.status !== "OK") {
      res.status(400).json({
        error: data.error_message || "Unable to fetch distance and time.",
        details: data,
      });
      return;
    }

    const element = data.rows[0].elements[0];
    if (element.status !== "OK") {
      res.status(400).json({
        error: "No results found for the specified locations.",
        details: element,
      });
      return;
    }

    res.status(200).json({
      origin: data.origin_addresses[0],
      destination: data.destination_addresses[0],
      distance: element.distance.text,
      duration: element.duration.text,
    });
  } catch (error: any) {
    console.error("Error fetching distance and time:", error);
    res.status(500).json({
      error: "Internal server error.",
      details: error,
    });
  }
};

export const getAutoSuggestions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { input, location, radius = 50000 } = req.query;

    if (!input) {
      res.status(400).json({
        error: "The 'input' query parameter is required.",
      });
      return;
    }

    const data = await fetchAutoSuggestions(
      input as string,
      location as string | undefined,
      Number(radius)
    );

    if (data.status !== "OK") {
      res.status(400).json({
        error: data.error_message || "Unable to fetch auto-suggestions.",
        details: data,
      });
      return;
    }

    const suggestions = data.predictions.map((prediction: any) => ({
      description: prediction.description,
      place_id: prediction.place_id,
    }));

    res.status(200).json({
      suggestions,
    });
  } catch (error: any) {
    console.error("Error fetching auto-suggestions:", error);
    res.status(500).json({
      error: "Internal server error.",
      details: error,
    });
  }
};

