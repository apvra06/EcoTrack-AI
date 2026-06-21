export interface CarbonProfile {
  carTravel: number;
  busTravel: number;
  trainTravel: number;
  electricityUsage: number;
  foodChoice: "vegetarian" | "non-vegetarian" | "mixed";
  wasteChoice: "low" | "medium" | "high";
}


export function calculateFootprint(profile: CarbonProfile) {

  const {
    carTravel,
    busTravel,
    trainTravel,
    electricityUsage,
    foodChoice,
    wasteChoice
  } = profile;


  const carEmissions =
    (carTravel * 52 * 0.18) / 1000;

  const busEmissions =
    (busTravel * 52 * 0.08) / 1000;

  const trainEmissions =
    (trainTravel * 52 * 0.04) / 1000;

  const electricityEmissions =
    (electricityUsage * 12 * 0.35) / 1000;


  let foodEmissions = 2.2;

  if(foodChoice === "vegetarian") {
    foodEmissions = 1.5;
  }
  else if(foodChoice === "non-vegetarian") {
    foodEmissions = 3.3;
  }


  let wasteEmissions = 0.5;

  if(wasteChoice === "low") {
    wasteEmissions = 0.2;
  }
  else if(wasteChoice === "high") {
    wasteEmissions = 0.9;
  }


  return Number(
    (
      carEmissions +
      busEmissions +
      trainEmissions +
      electricityEmissions +
      foodEmissions +
      wasteEmissions
    ).toFixed(2)
  );
}