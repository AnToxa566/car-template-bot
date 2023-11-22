import { Fuel } from "../enums/fuel.enum.js";
import { ICar } from "../interfaces/car.interface.js";

export const getCarPostText = (car: ICar) => {
  return `
<b>🚗 ${car.title} | Рік: ${car.issue_year}</b>
  
💰${car.price}$ | ${car.city} | Пробіг: ${car.mileage} тис. км
    
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
    
VIN: ${car.description}
    
🗣 Контакти: ${car.phone_number}, ${car.owner_name}
    
🇺🇦 <a href="https://t.me/chesniybarig">Обирай область</a> | <a href="https://t.me/crysimpletrade">Подати оголошення</a>`;
};
