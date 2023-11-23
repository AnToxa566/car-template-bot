import { states } from "../../assets/data/states.js";
import { Fuel } from "../enums/fuel.enum.js";
import { LocationType } from "../enums/location-type.enum.js";
import { ICar } from "../interfaces/car.interface.js";
import { ILocation } from "../interfaces/location.interface.js";
import { generateHashtags } from "./generate-hashtags.js";

const getCityName = (city: ILocation) => {
  if (city.type === LocationType.STATE_CENTER) {
    return city.name;
  } else {
    const state = states.find((state) => state.id === city.state_id);
    return `${city.name} (${state?.public_name})`;
  }
};

export const getCarPostText = (car: ICar) => {
  return `
<b>🚗 ${car.title} | Рік: ${car.issue_year}</b>
  
💰${car.price}$ | ${getCityName(car.city)} | Пробіг: ${car.mileage} тис. км
    
⚙️ Технічна частина авто: 
    
• ${
    car.fuel === Fuel.Electric
      ? `Ємність акумулятора: ${car.battery_capacity} кВт•год`
      : `Об‘єм двигуна: ${car.engine_capacity} л`
  } 
• Тип палива: ${car.fuel}
• ${
    car.fuel === Fuel.Electric
      ? `Запас ходу: ${car.power_reserve} км`
      : `Коробка передач: ${car.transmission}`
  } 
• Привід: ${car.occasion}
  
🍝 Короткий опис:
${car.description}
    
VIN: ${car.vin_code}
    
🗣 Контакти: ${car.phone_number}, ${car.owner_name}

${generateHashtags(car)}
    
🇺🇦 <a href="https://t.me/chesniybarig">Обирай область</a> | <a href="https://t.me/crysimpletrade">Подати оголошення</a>`;
};
