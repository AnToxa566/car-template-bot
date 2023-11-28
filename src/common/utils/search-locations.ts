import { locations } from "../../assets/data/locations.js";
import { LocationType } from "../enums/location-type.enum.js";
import { ILocation } from "../interfaces/location.interface.js";

import Fuse from "fuse.js";

export interface PopulatedLocation {
  data: ILocation;
  fullName: string;
  parent?: ILocation;
}

export const searchLocations = (search: string): PopulatedLocation[] => {
  const fuse = new Fuse(locations, {
    keys: ["name"],
  });

  const searchedLocations = fuse
    .search(search)
    .filter(
      ({ item }) =>
        item.type === LocationType.CITY ||
        item.type === LocationType.URBAN ||
        item.type === LocationType.STATE_CENTER
    );

  return searchedLocations.slice(0, 4).map((location) => {
    const parent = locations.find(
      (parent) => parent.id === location.item.parent_id
    );
    const fullName = `${location.item.public_name}, ${parent?.public_name}`;

    return {
      data: location.item,
      parent,
      fullName,
    };
  });
};
