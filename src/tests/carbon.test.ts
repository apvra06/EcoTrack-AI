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
    
    
    test("handles a minimal lifestyle profile", () => {

    const result = calculateFootprint({
        carTravel: 0,
        busTravel: 0,
        trainTravel: 0,
        electricityUsage: 0,
        foodChoice: "vegetarian",
        wasteChoice: "low"
    });


    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThan(5);

    });

    test("detects high carbon lifestyle patterns", () => {

    const result = calculateFootprint({
        carTravel: 1000,
        busTravel: 300,
        trainTravel: 0,
        electricityUsage: 800,
        foodChoice: "non-vegetarian",
        wasteChoice: "high"
    });


    expect(result)
        .toBeGreaterThan(5);

    });

    test("returns footprint rounded to two decimals", () => {

    const result = calculateFootprint({
        carTravel: 123,
        busTravel: 44,
        trainTravel: 12,
        electricityUsage: 321,
        foodChoice: "mixed",
        wasteChoice: "medium"
    });


    const decimals =
        result.toString().split(".")[1];


    expect(decimals?.length ?? 0)
        .toBeLessThanOrEqual(2);

    });

});