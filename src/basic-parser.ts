import * as fs from "fs";
import * as readline from "readline";
import {z, ZodType} from "zod";
/**
 * This is a JSDoc comment. Similar to JavaDoc, it documents a public-facing
 * function for others to use. Most modern editors will show the comment when 
 * mousing over this function name. Try it in run-parser.ts!
 * 
 * File I/O in TypeScript is "asynchronous", meaning that we can't just
 * read the file and return its contents. You'll learn more about this 
 * in class. For now, just leave the "async" and "await" where they are. 
 * You shouldn't need to alter them.
 * 
 * @param path The path to the file being loaded.
 * @returns a "promise" to produce a 2-d array of cell values
 */

  // If no schema is passed, returns string[][]
  //if received a schema, validates each row and returns T[]
export async function parseCSV<T>(
  path: string,
  schema?: ZodType<T>
): Promise<T[] | string[][]> {
  const fileStream = fs.createReadStream(path);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  if (schema) {
    const results: T[] = [];
    for await (const line of rl) {
      const values = line.split(",").map(v => v.trim());
      const parsed = schema.safeParse(values);
      if (parsed.success) {
        results.push(parsed.data);
      } else {
        throw parsed.error;
      }
    }
    return results; // type is T[]
  } else {
    const results: string[][] = [];
    for await (const line of rl) {
      const values = line.split(",").map(v => v.trim());
      results.push(values);
    }
    return results; // type is string[][]
  }
}
