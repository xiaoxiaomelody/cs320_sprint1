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
2. consider scenario when CSV doesn't include a header
Prompt A
“Imagine you are designing a CSV parsing library for TypeScript that should be production-ready and competitive with existing libraries. What edge cases in CSV files should it handle, and what developer-facing APIs or configuration options would make it flexible and safe to use?”
The answers are framed around production-grade library.
1. Clear error messages. If parsing fails, include: File name, Line number, Snippet of the offending row
2. for streaming, instead of reading everything into memory, the parser can support a streaming API
Prompt B
“As a developer who wants to use a CSV parser in a TypeScript project, what features, validations, and error reporting would you expect from the parser so that it’s easy and safe to integrate into my application?”
Answers are framed around 
1. 
2. 

- #### Step 3: use an LLM to help expand your perspective.

    Include a list of the top 4 enhancements or edge cases you think are most valuable to explore in the next week’s sprint. Label them clearly by category (extensibility vs. functionality), and include whether they came from you, the LLM, or both. Describe these using the User Story format—see below for a definition. 

    Include your notes from above: what were your initial ideas, what did the LLM suggest, and how did the results differ by prompt? What resonated with you, and what didn’t? (3-5 sentences.) 

    “As a user of the application, I am able to filter search results by multiple criteria like time, location, or price so that I can quickly find the items that match my needs.” 
    Acceptance Criteria: 
    The user can select one or more filter options from a list.
    The search results update dynamically based on the selected filters.
    If no results match the filters, the user sees a clear “no results found” message. 

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
3. Schema & Type Validation (Me)
User Story:
“As a developer, I want to define an expected schema for the CSV (e.g., column age must be an integer) so that invalid data is caught at parse time rather than breaking downstream logic.”

Acceptance Criteria:
Parser accepts a schema definition (e.g., { name: "string", age: "number", enrolled: "boolean" }).
If a value does not match the schema type, parser outputs a clear error with column name + row number.
Parser supports common primitive types (string, number, boolean, date).
Developer can opt-in to either strict mode (fail immediately) or lenient mode (coerce if possible, else warn).

### Design Choices


- #### 3. Overall experience, Bugs encountered and resolved
#### Errors/Bugs:
#### Tests:
#### How To…

#### Team members and contributions (include cs logins):

#### Collaborators (cslogins of anyone you worked with on this project and/or generative AI):
#### Total estimated time it took to complete project:
#### Link to GitHub Repo:  
