import { describe, test, expect } from "vitest";
import { z } from "zod";


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


});