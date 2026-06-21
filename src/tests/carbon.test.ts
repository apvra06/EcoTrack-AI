import { describe, test, expect } from "vitest";
import { calculateFootprint } from "../utils/carbon";


describe("EcoTrack Carbon Engine", () => {


  test("calculates a positive carbon footprint", () => {

    const result = calculateFootprint({
      carTravel: 100,
      busTravel: 20,
      trainTravel: 10,
      electricityUsage: 200,
      foodChoice: "mixed",
      wasteChoice: "medium"
    });


    expect(result)
      .toBeGreaterThan(0);

  });



  test("vegetarian lifestyle should produce lower emissions", () => {


    const vegetarian =
      calculateFootprint({
        carTravel: 0,
        busTravel: 0,
        trainTravel: 0,
        electricityUsage: 100,
        foodChoice: "vegetarian",
        wasteChoice: "low"
      });


    const nonVegetarian =
      calculateFootprint({
        carTravel: 0,
        busTravel: 0,
        trainTravel: 0,
        electricityUsage: 100,
        foodChoice: "non-vegetarian",
        wasteChoice: "low"
      });


    expect(vegetarian)
      .toBeLessThan(nonVegetarian);

  });



  test("high waste should increase footprint", () => {


    const lowWaste =
      calculateFootprint({
        carTravel: 0,
        busTravel: 0,
        trainTravel: 0,
        electricityUsage: 0,
        foodChoice: "mixed",
        wasteChoice: "low"
      });


    const highWaste =
      calculateFootprint({
        carTravel: 0,
        busTravel: 0,
        trainTravel: 0,
        electricityUsage: 0,
        foodChoice: "mixed",
        wasteChoice: "high"
      });


    expect(highWaste)
      .toBeGreaterThan(lowWaste);

  });


});