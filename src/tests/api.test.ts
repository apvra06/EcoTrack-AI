import request from "supertest";
import { app } from "../../server";
import { describe, expect, test } from "vitest";


describe("EcoTrack API",()=>{

 test("rejects invalid profile", async()=>{

   const response = await request(app)
     .post("/api/profile")
     .send({
       carTravel:-100,
       foodChoice:"pizza"
     });


   expect(response.status)
     .toBe(400);

 });

});