import { describe, test, expect } from "vitest";
import { z } from "zod";
import { calculateFootprint } from "../utils/carbon";


const profileSchema = z.object({
  carTravel: z.number().min(0),
  busTravel: z.number().min(0),
  trainTravel: z.number().min(0),
  electricityUsage: z.number().min(0),

  foodChoice: z.enum([
    "vegetarian",
    "non-vegetarian",
    "mixed"
  ]),

  wasteChoice: z.enum([
    "low",
    "medium",
    "high"
  ])
});


describe("Carbon Profile Validation", () => {


  test("accepts valid profile data", () => {

    const result = profileSchema.safeParse({
      carTravel: 100,
      busTravel: 20,
      trainTravel: 5,
      electricityUsage: 250,
      foodChoice: "vegetarian",
      wasteChoice: "low"
    });


    expect(result.success)
      .toBe(true);

  });



  test("rejects negative travel values", () => {

    const result = profileSchema.safeParse({
      carTravel: -50,
      busTravel: 20,
      trainTravel: 5,
      electricityUsage: 250,
      foodChoice: "vegetarian",
      wasteChoice: "low"
    });


    expect(result.success)
      .toBe(false);

  });



  test("rejects invalid lifestyle categories", () => {

    const result = profileSchema.safeParse({
      carTravel: 50,
      busTravel: 20,
      trainTravel: 5,
      electricityUsage: 250,
      foodChoice: "pizza",
      wasteChoice: "low"
    });


    expect(result.success)
      .toBe(false);

  });

  test("rejects incomplete carbon profiles", () => {

    const result = profileSchema.safeParse({

        carTravel: 100,
        foodChoice: "vegetarian"

    });


    expect(result.success)
        .toBe(false);

    });

    test("rejects incorrect data types", () => {

    const result = profileSchema.safeParse({

        carTravel: "500",
        busTravel: 20,
        trainTravel: 5,
        electricityUsage: 200,
        foodChoice: "mixed",
        wasteChoice: "low"

    });


    expect(result.success)
        .toBe(false);

    });

    test("food choices influence carbon intensity", () => {

    const vegetarian =
        calculateFootprint({
        carTravel: 0,
        busTravel: 0,
        trainTravel: 0,
        electricityUsage: 0,
        foodChoice:"vegetarian",
        wasteChoice:"medium"
        });


    const meat =
        calculateFootprint({
        carTravel: 0,
        busTravel: 0,
        trainTravel: 0,
        electricityUsage: 0,
        foodChoice:"non-vegetarian",
        wasteChoice:"medium"
        });


    expect(meat)
        .toBeGreaterThan(vegetarian);

    });

    test("waste reduction lowers footprint", () => {

        const low =
        calculateFootprint({
            carTravel:0,
            busTravel:0,
            trainTravel:0,
            electricityUsage:0,
            foodChoice:"mixed",
            wasteChoice:"low"
        });


        const high =
        calculateFootprint({
            carTravel:0,
            busTravel:0,
            trainTravel:0,
            electricityUsage:0,
            foodChoice:"mixed",
            wasteChoice:"high"
        });


        expect(high)
        .toBeGreaterThan(low);

    });


});