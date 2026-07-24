---
name: learning-genai-tools-excel
description: >- Ferramentas GenAI para Excel — ChatGPT, formulas, templates, analise de dados e VBA
---

# ChatGPT para Excel — Passos Operacionais

## 1. Getting Started with ChatGPT and Excel

### 1.1 Two Ways to Use ChatGPT with Excel
1. **Companion/External tutor**: ask ChatGPT questions about dataset, apply answers manually
2. **Direct editing tool**: upload Excel file to ChatGPT, edit inside ChatGPT, download modified file
3. Always verify ChatGPT suggestions — proceed iteratively

### 1.2 Structure a Conversation (Story Method)
1. **Context**: define topic, dataset structure with column names, Excel guidelines (table name, language)
   ```
   Consider a dataset relating to the Amazon Top 50 Bestselling Books 2009-2019.
   The dataset has the following columns:
   Name - Name of the book
   Author - The author of the book
   User Rating - Amazon user rating (1-5)
   Reviews - Number of written reviews on Amazon
   Price - The price of the book
   Year - The year(s) it ranked on bestsellers
   Genre - Whether fiction or non-fiction.
   Suppose you import this dataset into Excel in a table named books.
   ```
2. **Main point**: action + objective + additional details + level of complexity
   - Action: clear verb (Write, Explain, Analyze)
   - Objective: what you want to achieve
   - Additional details: relevant parameters, restrictions
   - Level of complexity: basic or advanced (optional)
3. **End**: ask ChatGPT to:
   - List the steps to implement in Excel
   - List alternative solutions
   - Calculate the answer and export as downloadable XLSX
4. Use separate prompts within same conversation to reuse context for multiple questions

### 1.3 ChatGPT Four Roles
1. **Assistant** — get formula/function: `Write the formula in Excel to [objective]`
2. **Teacher** — learn complex concepts: `Explain how to [concept] using [columns]. Use a [basic/advanced] level of complexity.`
3. **Analyst** — extract insights: `Analyze [specific request]. Suggest a graph to visualize the results.`
4. **Troubleshooter** — fix errors: `Find and explain the error in this formula: [formula]. Suggest the correct version.`

### 1.4 Basic Functions — Prompt Templates

**Calculation functions** (SUM, AVERAGE, MAX, MIN, ROUND):
- Prompt: `Write the formula in Excel to calculate [function] [column]. Use the table [table name].`

**Counting functions** (COUNTA, COUNTIF, COUNTIFS):
- Prompt: `Write the formula in Excel to count cells [criterium]. Use the table [table name].`

**Logical functions** (IF, AND, OR):
- Prompt: `Write the formula in Excel for [condition]. Use the table [table name].`

**Search functions** (VLOOKUP, INDEX, MATCH):
- Prompt: `Write the formula in Excel to search [criterium]. Use the table [table name].`

**Text manipulation** (CONCAT, LEFT, LEN, FIND):
- Prompt: `Write the formula in Excel to [text manipulation] [involved columns]. Use the table [table name].`

**Date and Time** (TODAY, YEAR, DATEDIF):
- Prompt: `Write the formula in Excel to calculate [date operation]. Use the table [table name].`

## 2. Speeding Up Common Operations with ChatGPT

### 2.1 Creating Templates from Scratch
1. Start new ChatGPT conversation → define context:
   ```
   I want to create an Excel template. I'll provide you with all the options to include in the template, and when I have finished, you'll format it as an .xlsx file.
   ```
2. Specify workbook structure (sheets, tables, columns):
   ```
   Create a single worksheet containing a table with the following columns: Date, Category, Description, Amount, Payment Method. Format the table as an Excel table and name it MainTable. Add 10 empty rows.
   ```
3. Download and open generated XLSX
4. Define formatting for each column (date format, text, currency, etc.)
5. Add formulas (e.g., total row below table)
6. Apply style (bold header, colors, borders, alignment)
7. If ChatGPT loses formatting: rerun prompt asking for specific formatting or use "Please try again"

### 2.2 Automate Template Generation from File
1. Prepare instructions.txt with `[STEP]` keywords before each prompt
2. Write opening prompt:
   ```
   Open the attached file and identify the first instruction, which begins with [STEP].
   Follow steps exactly in sequence without skipping. Complete each step fully.
   ```
3. Attach the instructions file
4. If table not formatted as Excel Table, follow up: `Format the generated table as an Excel Table.`

### 2.3 Creating Templates from Sketches (Photos)
1. Take photo of handwritten table with smartphone
2. Use ChatGPT mobile app → take photo directly in app
3. Prompt: `Format the attached table as an Excel file and make it downloadable. Populate columns and rows. Format as an Excel Table except for the row Total Amount. Calculate the Total Amount using a formula.`
4. Download and verify the file
5. (Optional) Ask to populate with more rows: `Populate this table with 15 consistent rows.`

### 2.4 Autofill with ChatGPT
1. Load dataset into ChatGPT (creates context)
2. Prompt:
   ```
   Consider the table attached.
   Using Autofill, populate all the table columns with dates from [start] to [end]. Use the correct day of week.
   Format the resulting table as an Excel table and keep the original table layout.
   ```
3. Download the generated file
4. If layout lost, repeat: `Format the resulting table as an Excel table and keep the original table layout.`

### 2.5 Data Enrichment with VLOOKUP (Manual)
1. Ensure datasets share a common unique identifier column (e.g., Title)
2. In destination table, write formula:
   ```
   =VLOOKUP([@Title],Info[#All],2,FALSE)
   ```
3. Rename the new column appropriately
4. Repeat for additional columns (change col_index_num)

### 2.6 Data Enrichment with ChatGPT from Web
1. Load simplified dataset into ChatGPT
2. Prompt:
   ```
   Consider the table [Name] in the first worksheet. Extend it with columns: [col1, col2, ...]. Extract the required information from the web. Format as an Excel Table. Keep original layout and style.
   ```
3. If data missing, enable "Search the web" button in ChatGPT and repeat: `Repeat the operation.`
4. Ask to format: `Format the resulting table as an Excel Table. Keep the original table layout and style.`
5. Download file immediately to avoid timeout loss
6. Always verify ChatGPT results (may hallucinate)

## 3. Advanced Operations with ChatGPT

### 3.1 Analyze a Dataset with ChatGPT
Follow this workflow (Figure 4-1):

1. Extract a portion of dataset with column names (or upload the full dataset)
2. Upload to ChatGPT
3. Ask: `Identify the category to which the dataset belongs (finance, health, etc.) and list the top 5 helpful questions.`
4. Review generated questions (varies per session but thematically stable)
5. For more questions: `List 5 more questions. Repeat to get five more questions each time.`
6. Request formula answers:
   ```
   Write the Excel formula or steps to answer each question and how to implement it in Excel. Don't use PivotTables. Use the table name MainTable and column names. Write general formulas without focusing on specific values.
   ```
7. Implement answers in original file:
   ```
   Add a sheet to the original file for Question 1 named as the question. Format the dataset as an Excel Table named MainTable. Implement all required steps to answer Question 1. Make the file downloadable.
   ```
8. For remaining questions, repeat: `Repeat for Question N. Use the file from previous step, maintaining all formulas.`

### 3.2 Complete Answers from ChatGPT Framework
1. After ChatGPT generates framework, select non-empty cells → Format as Table
2. Sort the relevant column (e.g., Total Revenue → Sort Largest to Smallest)
3. The top row answers the question (e.g., highest-revenue product)
4. For trend questions: Insert a line chart (Insert → Line or Area Chart → Line)
5. Challenge: ask ChatGPT to generate the chart and insert it into the file

### 3.3 PivotTables via ChatGPT (Teacher Role)
1. In the same conversation, prompt:
   ```
   Describe the steps to implement question [N] using PivotTables.
   ```
2. Follow ChatGPT's step-by-step instructions:
   - Step 1: Select data
   - Step 2: Insert PivotTable (Insert → PivotTable)
   - Step 3: Configure Fields (drag fields to Rows/Values areas)
   - Step 4: Sort to identify top values
   - Step 5: Apply formatting (Number Format, column widths)
   - Step 6: Identify the result
3. (Bonus) Create a chart from PivotTable: Insert → Column/Bar Chart
4. SUMIFS vs PivotTable tradeoffs: SUMIFS auto-updates but complex for many conditions; PivotTable handles large data quickly but requires manual refresh

### 3.4 Enable Macros in Excel
1. Windows: File → Options → Trust Center → Trust Center Settings → Macro Settings → "Disable VBA macros with notification"
2. Mac: Excel → Preferences → Security → "Disable all macros with notification"
3. Enable Developer tab:
   - Windows: File → Options → Customize Ribbon → check Developer
   - Mac: Excel → Preferences → Ribbon & Toolbar → check Developer
4. Save files as Macro-Enabled Workbook (.xlsm) to retain macros

### 3.5 Record and Generalize a Macro
1. Navigate to target worksheet
2. Developer tab → Record Macro → name it, assign shortcut, add description
3. Perform actions (select cell range, create table, format columns, etc.)
4. Click Stop Recording
5. Developer tab → Macros → select macro → Edit to open VBA Editor
6. Copy the generated VBA code
7. In ChatGPT, prompt with code:
   ```
   Modify the following macro as follows: replace the specific sheet with the active sheet, replace cell references with all nonempty cells, don't set the table name.
   [paste VBA code]
   ```
8. Replace original code in VBA Editor with ChatGPT's generalized version
9. If errors appear, paste error in ChatGPT: `I got this error: [error message]` → insert fixed code
10. Test macro on different worksheet: Developer → Macros → select → Run

### 3.6 Generate VBA Macros from Scratch with ChatGPT
1. Define context with table structure and column names
2. Main prompt:
   ```
   Consider an Excel table named [TableName] representing [description], with columns: [col1, col2, ...].
   Write a VBA macro to [task]:
   1. [requirement 1]
   2. [requirement 2]
   [etc.]
   ```
3. Add macro to workbook:
   - Developer → Visual Basic
   - Project pane → right-click VBAProject → Insert → Module
   - Paste ChatGPT-generated code → Save as .xlsm
4. Run: Developer → Macros → select → Run
5. Use reasoning model (GPT-o1 or similar) for better macro code quality

### 3.7 General Workflow for Macro Automation
1. Record macro for simple task
2. Copy VBA code to ChatGPT asking for generalization
3. Quick-check generated code for obvious errors
4. Test in Excel
5. If errors: use ChatGPT to troubleshoot with error message
6. Run the finalized macro on all target worksheets
