import { Fuel } from "../enums/fuel.enum.js";
import { Occasion } from "../enums/occasion.enum.js";
import { Transmission } from "../enums/transmission.enum.js";

export interface ICar {
  title: string;
  issue_year: number;
  price: number;
  city: string;
  mileage: number;
  vin_code: string;
  fuel: Fuel;
  battery_capacity?: number;
  power_reserve?: number;
  engine_capacity?: number;
  transmission?: Transmission;
  occasion: Occasion;
  description: string;
  phone_number: string;
  owner_name: string;
}
