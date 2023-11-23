import { locations } from "../../assets/data/locations.js";

export const findLocationById = (id: number) => {
  return locations.find((location) => location.id === id);
};
