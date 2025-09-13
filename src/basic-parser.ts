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

export type ParseResult<T> =
  | { success: true; data: T[] }
  | { success: false; errors: { row: string[]; message: string }[] };

export async function parseCSV<T>(
  path: string,
  schema?: ZodType<T>
): Promise<ParseResult<T | string[]>> {
  const fileStream = fs.createReadStream(path);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const results: Array<T | string[]> = [];
  const errors: { row: string[]; message: string }[] = [];

  for await (const line of rl) {
    const values = line.split(",").map((v) => v.trim());

    if (schema) {
      const parsed = schema.safeParse(values);
      if (parsed.success) {
        results.push(parsed.data);
      } else {
        errors.push({
          row: values,
          message: parsed.error.issues.map(e => e.message).join("; "),
        });
      }
    } else {
      results.push(values);
    }
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }
  return { success: true, data: results };
}

// //define schema
// export const PersonRowSchema = z
//   .tuple([z.string(), z.coerce.number()])
//   .refine(tup => !Number.isNaN(tup[1]), {
//     message: "Age must be a valid number",
//   })
//   .transform(tup => ({ name: tup[0], age: tup[1] }));

// export type PersonRow = z.infer<typeof PersonRowSchema>

// export async function parseCSV<T>(path: string, schema?: ZodType<T>): Promise<T[] | string[][]> {
//   // This initial block of code reads from a file in Node.js. The "rl"
//   // value can be iterated over in a "for" loop. 

//   const fileStream = fs.createReadStream(path);
//   const rl = readline.createInterface({
//     input: fileStream,
//     crlfDelay: Infinity, // handle different line endings
//   });
  
//   // Create an empty array to hold the results
//   const result: Array<T | string[]> = [];
  
//   // We add the "await" here because file I/O is asynchronous. 
//   // We need to force TypeScript to _wait_ for a row before moving on. 
//   // More on this in class soon!
  
//   for await (const line of rl) {
//     const values = line.split(",").map((v) => v.trim());

//     if (schema) {
//       const parsed = schema.safeParse(values);

//       if (parsed.success) {
//         const row: T = parsed.data;
//         result.push(row);
//       } else {
//           throw parsed.error;
//       }
//     } else {
//         result.push(values)
//     } 
//   }
  
//   return result as T[] | string[][];
// }
