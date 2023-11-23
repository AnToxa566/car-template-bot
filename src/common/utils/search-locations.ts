import { locations } from "../../assets/data/locations.js";
import { ILocation } from "../interfaces/location.interface.js";

export interface PopulatedLocation {
  data: ILocation;
  fullName: string;
  parent?: ILocation;
}

export const searchLocations = (search: string): PopulatedLocation[] => {
  const searchedLocations = locations.filter((location) =>
    location.name.toLowerCase().includes(search.toLowerCase())
  );

  return searchedLocations.map((location) => {
    const parent = locations.find((parent) => parent.id === location.parent_id);
    const fullName = `${location.public_name}, ${parent?.public_name}`;

    return {
      data: location,
      parent,
      fullName,
    };
  });
};
