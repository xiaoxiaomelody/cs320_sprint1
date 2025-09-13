import { parseCSV} from "../src/basic-parser";
import * as path from "path";
import {z} from "zod";

//define schema
const PersonRowSchema = z
  .tuple([z.string(), z.coerce.number()])
  .refine(tup => !Number.isNaN(tup[1]), {
    message: "Age must be a valid number",
  })
  .transform(tup => ({ name: tup[0], age: tup[1] }));

const PEOPLE_CSV_PATH = path.join(__dirname, "../data/people.csv");
const PEOPLE_CSV_NEW_PATH = path.join(__dirname, "../data/people copy.csv")

//original tests without schema
test("parseCSV yields arrays", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH);
  expect(results.success).toBe(true);
  if (results.success) {
      expect(results.data[0]).toEqual(["name", "age"]);
      expect(results.data[1]).toEqual(["Alice", "23"]);
      expect(results.data[2]).toEqual(["Bob", "thirty"]); // why does this work? :(
      expect(results.data[3]).toEqual(["Charlie", "25"]);
      expect(results.data[4]).toEqual(["Nim", "22"]);
    }
});

 test("yields only arrays", async () => {
    const results = await parseCSV(PEOPLE_CSV_PATH);
    expect(results.success).toBe(true);
    if (results.success) {
      for (const row of results.data) {
        expect(Array.isArray(row)).toBe(true);
      }
    }
  });

  test("yields an empty array when input is empty", async () => {
    const results = await parseCSV(PEOPLE_CSV_NEW_PATH);
    expect(results.success).toBe(true);
    if (results.success) {
      expect(results.data).toEqual([]);
    }
  });

  test("removes extra spaces", async () => {
    const results = await parseCSV(PEOPLE_CSV_PATH);
    expect(results.success).toBe(true);
    if (results.success) {
      expect(results.data[5]).toEqual(["Melody", "18"]);
    }
  });

  test("detects column missing", async () => {
    const results = await parseCSV(PEOPLE_CSV_PATH);
    expect(results.success).toBe(true);
    if (results.success) {
      expect(Array.isArray(results.data[6])).toBe(true);
    }
  });

  test("detects internal commas", async () => {
    const results = await parseCSV(PEOPLE_CSV_PATH);
    expect(results.success).toBe(true);
    if (results.success) {
      expect(results.data[7]).toEqual(["Alice", "30,10"]);
    }
  });

//tests with schema
test("parseCSV fails on invalid number with schema", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH, PersonRowSchema)
  expect(results.success).toBe(false);
  if (!results.success) {
    expect(results.errors[0].row).toEqual(["Bob", "thirty"]);
    expect(results.errors[0].message).toContain("Age must be a valid number");
    }
});


test("parses valid rows into objects", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH, PersonRowSchema);
  if (results.success) {
    expect(results.data[1]).toEqual({ name: "Alice", age: 23 });
    expect(results.data[3]).toEqual({ name: "Charlie", age: 25 });
  }
});
