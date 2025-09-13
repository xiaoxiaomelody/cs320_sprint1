import { parseCSV } from "../src/basic-parser";
import * as path from "path";

const PEOPLE_CSV_PATH = path.join(__dirname, "../data/people.csv");
const PEOPLE_CSV_NEW_PATH = path.join(__dirname, "../data/people copy.csv")

test("parseCSV yields arrays", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH)
  
  expect(results).toHaveLength(9);
  expect(results[0]).toEqual(["name", "age"]);
  expect(results[1]).toEqual(["Alice", "23"]);
  expect(results[2]).toEqual(["Bob", "thirty"]); // why does this work? :(
  expect(results[3]).toEqual(["Charlie", "25"]);
  expect(results[4]).toEqual(["Nim", "22"]);
});

test("parseCSV yields only arrays", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH)
  for(const row of results) {
    expect(Array.isArray(row)).toBe(true);
  }
});

test("parseCSV yields an empty array when input is empty", async () => {
  const results = await parseCSV(PEOPLE_CSV_NEW_PATH)
  expect(results).toEqual([]);
});

test("parseCSV removes extra spaces", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH)
  expect(results[5]).toEqual(["Melody", "18"]);
});

test("parseCSV detects column missing", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH)
  expect(Array.isArray(results[6])).toBe(false);;
});

test("parseCSV detects internal commas", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH)
  expect(results[7]).toEqual(["Alice", "30,10"]);
});

test("parseCSV detects special characters", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH)
  expect(results[8]).toEqual(["Ben,Kate", "10"]);
});