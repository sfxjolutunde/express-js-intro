import { Sum } from "../controllers/random-functions";
import { Subtract } from "./random-functions";

it("addition of two numbers", () => {
  expect(Sum(5, 5)).toEqual(10);
  expect(Sum(10, 20)).toEqual(30);
  expect(Sum(2,2)).not.toEqual(10);
});

test("subsctraction of two numbers", () => {
  expect(Subtract(10, 5)).toEqual(5);
  expect(Subtract(20, 10)).toEqual(10);
});
