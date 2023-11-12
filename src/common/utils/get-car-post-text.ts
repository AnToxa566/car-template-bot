import { Fuel } from "../enums/fuel.enum.js";
import { ICar } from "../interfaces/car.interface.js";

export const getCarPostText = (post: ICar) => {
  return `
<b>🚗 ${post.title} | Рік: ${post.issue_year}</b>
  
💰${post.price}$ | ${post.city} | Пробіг: ${post.mileage} тис. км
    
⚙️ Технічна частина авто: 
    
• ${
    post.fuel === Fuel.Electric
      ? `Ємність акумулятора: ${post.battery_capacity} кВт•год`
      : `Об‘єм двигуна: ${post.engine_capacity} л`
  } 
• Тип палива: ${post.fuel}
• ${
    post.fuel === Fuel.Electric
      ? `Запас ходу: ${post.power_reserve} кВт•год`
      : `Коробка передач: ${post.transmission}`
  } 
• Привід: ${post.occasion}
  
🍝 Короткий опис:
  ${post.description}
    
VIN: ${post.description}
    
🗣 Контакти: ${post.phone_number}, ${post.owner_name}
    
🇺🇦 <a href="https://t.me/chesniybarig">Обирай область</a> | <a href="https://t.me/crysimpletrade">Подати оголошення</a>`;
};
