import { describe, test, expect } from "vitest";
import request from "supertest";
import { app } from "../../server";


describe("EcoTrack Authentication API", () => {


test("rejects incomplete registration", async()=>{

 const response = await request(app)
   .post("/api/auth/register")
   .send({
      email:"",
      name:"",
      password:""
   });


 expect(response.status)
   .toBe(400);


});


test("rejects invalid login", async()=>{

 const response = await request(app)
   .post("/api/auth/login")
   .send({
      email:"fake@test.com",
      password:"wrong"
   });


 expect(response.status)
   .toBe(401);


});


});