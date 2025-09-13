# Sprint 1: TypeScript CSV

### Task C: Proposing Enhancement

- #### Step 1: Brainstorm on your own.
Functionality
1. current parser doesn't detect internal comma in one string and output with the right version, including special char detection (""); 
2. no error handling when a column missing or there's an extra column
3. current parser doesn't have a schema for checking input types (when type fails will output an error)
4. header is not distinguished in the process
 
- #### Step 2: Use an LLM to help expand your perspective.
It overlapped with a lot of my thoughts. It adds the following when I input the given prompt:
1. the parser can distinguish between empty string, null, or underfined
eg. Ben, (age is undefined)
    , 32 (name is an empty string)
    Alex, null (age is null)
2. consider scenario when CSV doesn't include a header detection
Prompt A
“Imagine you are designing a CSV parsing library for TypeScript that should be production-ready and competitive with existing libraries. What edge cases in CSV files should it handle, and what developer-facing APIs or configuration options would make it flexible and safe to use?”
The answers are framed around production-grade library.
1. Clear error messages. If parsing fails, include: File name, Line number, Snippet of the offending row
2. for streaming, instead of reading everything into memory, the parser can support a streaming API
Prompt B
“As a developer who wants to use a CSV parser in a TypeScript project, what features, validations, and error reporting would you expect from the parser so that it’s easy and safe to integrate into my application?”
Answers are framed around easy-usage and safety on a developer side.
1. Flexible schema support: Ability to define the structure of rows using a schema (e.g., Zod) so I can map raw string arrays into typed objects.
2. Type validation: When using schemas, fields should be coerced to the right type (e.g., numbers, emails) and fail if invalid.

- #### Step 3: use an LLM to help expand your perspective.

    Include a list of the top 4 enhancements or edge cases you think are most valuable to explore in the next week’s sprint. Label them clearly by category (extensibility vs. functionality), and include whether they came from you, the LLM, or both. Describe these using the User Story format—see below for a definition. 

Extensibility:
1. Header Row Option (Me + LLM)
User Story:
“As another developer, I want to specify whether the first row of the CSV should be treated as headers or as data so that the parser can flexibly handle both structured and raw datasets.”
Acceptance Criteria:
The parser has a boolean flag (hasHeader)
If true, parser uses the first row as keys and returns an array of objects assigning key to elements in each column.
If false, parser returns plain arrays.

Functionality:
1. Data Type Validation (Me)
User Story:
"As a user of the application, I want my input of number to be automatically converted to integer while I'm notified clearly when I input string values that are not numbers."
Acceptance Criteria: 
Strings that match integer or float patterns are converted automatically.
Non-numeric strings remain unchanged.
The function provides a clear error message when conversion fails.
2. Column Consistency Validation (Me + LLM)
User Story:
“As a developer, I want the parser to detect when a row has missing or extra columns compared to the header row so that I can catch malformed input early instead of silently working with bad data.”
Acceptance Criteria:
If a row has fewer columns than expected, parser raises a clear error (with row number).
If a row has more columns than expected, parser raises a clear error (with row number).
Optionally, developer can choose whether to throw an error or auto-truncate/pad with nulls.
3. Schema & Type Validation (LLM)
User Story:
“As a developer, I want to define an expected schema for the CSV (e.g., column age must be an integer) so that invalid data is caught at parse time rather than breaking downstream logic.”
Acceptance Criteria:
Parser function is separated from schema function. 
Parser accepts a schema definition (e.g., { name: "string", age: "number", enrolled: "boolean" }). 
If a value does not match the schema type, parser outputs a clear error with column name + row number.
Parser supports common primitive types (string, number, boolean, date).
Developer can opt-in to either strict mode (fail immediately) or lenient mode (coerce if possible, else warn).

Include your notes from above: what were your initial ideas, what did the LLM suggest, and how did the results differ by prompt? What resonated with you, and what didn’t? (3-5 sentences.)    
I came up with the initial ideas of the first three user stories, and LLM gave me a clear suggestion on writing the acceptance criteria by transforming broad concepts to code language and concrete steps. Regarding the fourth user story (Schema & type validation), I don't quite understand the "Strict mode" or "Lenient mode" that a developer can use. So I prompt it again by asking further about these two approaches.

### Reflection
1. What makes a CSV parser “correct”
Specific to hw's example:
The first column must be a string, the second must be a number > 0;
Overall:
The parser never accepts a row with missing or extra columns; every row must have exactly two fields.
The parser never mutates or drops valid rows when other rows are invalid.
Schema validation: each row must match the caller’s schema; types are coerced where possible, but invalid data is either rejected (strict mode) or flagged with a clear error/warning.
Row integrity: every line of the CSV file corresponds to exactly one row in the output, with no rows skipped or duplicated.
Row splitting: each row is split into the right number of columns according to the special characters (commas, tabs, etc.), without incorrectly breaking on commas inside quotes.
Error reporting: when data is malformed (e.g., missing column, invalid type), the parser communicates this clearly to the caller without silently failing.
Consistency across modes: running the parser with no schema always yields string[][]; running with a schema always yields typed objects or structured errors.

2. Random, On-Demand Generation
I would like to use this function for edge-case testing (if it generate rows with missing values or random whitespace, unusual characters);
Mostly importantly, this big dataset can 
Also, I would use it for type stress-testing, where random numbers, strings, and invalid entries are used to check that schema validation consistently accepts or rejects as expected.
This kind of testing largely validates the parser's ability as it not only passes tests I wrote.

3. Overall experience, Bugs encountered and resolved
Overall, this task allows me to strengthen my understanding of constructing a parser and make use of schema. I'm still getting familiar with Typescript, and this new Typpe logic bothers me for a while in the beginning. I got into an error where my results array initially defaulted to unknown[] when I didn’t give it an explicit type, which led to confusing compile errors. I fixed this by explicitly declaring results: string[][] | T[].
I also encountered a bug where Zod error messages of [Bob, thirty] is different from my expectations. I updated my tests to match Zod's defaults (not sure this is the right approach still).

#### Team members and contributions (include cs logins):
NA
#### Collaborators (cslogins of anyone you worked with on this project and/or generative AI):
generative AI I used for brainstorming: CHATGPT
#### Total estimated time it took to complete project: 
8 hours
#### Link to GitHub Repo: 
https://github.com/xiaoxiaomelody/cs320_sprint1.git
