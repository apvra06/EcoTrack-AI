/**
 * @vitest-environment jsdom
 */
import { describe, test, expect } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import App from "../App";


describe("EcoTrack Accessibility",()=>{


test("should not have accessibility violations", async()=>{

 const {container}=render(<App/>);

 const results = await axe(container);

 console.log(
    JSON.stringify(results.violations, null, 2)
 );
 
 expect(results.violations.length)
  .toBe(0);

});


});