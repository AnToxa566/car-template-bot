import { locations } from "../../assets/data/locations.js";
import { states } from "../../assets/data/states.js";
import { Fuel } from "../enums/fuel.enum.js";
import { LocationType } from "../enums/location-type.enum.js";
import { Transmission } from "../enums/transmission.enum.js";
import { ICar } from "../interfaces/car.interface.js";

const priceLimits = [
  1000, 3000, 5000, 7000, 10000, 15000, 20000, 30000, 50000, 100000, 150000,
  200000, 500000, 1000000,
];

export const generateHashtags = (car: ICar) => {
  const hashtags: string[] = [];

  const priceLimitIdx = priceLimits.findIndex((price) => price >= car.price);
  hashtags.push(`#до${priceLimits[priceLimitIdx]}`);

  if (car.city.type === LocationType.STATE_CENTER) {
    hashtags.push(`#${car.city.name.toLowerCase()}`);
  } else {
    const state = states.find((state) => state.id === car.city.state_id);
    const stateCenter = locations.find(
      (location) => location.id === state?.state_center_id
    );

    hashtags.push(`#${stateCenter?.name.toLowerCase()}`);
  }

  if (car.transmission) {
    hashtags.push(
      car.transmission === Transmission.Mechanical ? "#механіка" : "#автомат"
    );
  }

  if (car.fuel === Fuel.Electric || car.fuel === Fuel.Gybrid) {
    hashtags.push(`#${car.fuel.toLowerCase()}`);
  }

  return hashtags.map((h) => h.replace("-", "")).join(" ");
};
