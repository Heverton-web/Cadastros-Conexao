---
name: learning-ai-tools-tableau
description: >- Ferramentas de IA no Tableau — Tableau Pulse, Tableau Agent, metricas, insights e integracao Slack/Salesforce
---

# Tableau Pulse e Tableau Agent — Passos Operacionais

## 1. Getting Started with Tableau Pulse

### 1.1 Prerequisites
1. Enable Pulse in Tableau Cloud: Settings → General → toggle on for all users or specific group (requires Site Admin permissions)
2. Ensure at least one published data source exists (standalone object with connection info, field customizations, calculations, permissions)
3. Only published data sources (not embedded) can create metrics

### 1.2 Build a Published Data Source
1. Connect to data (Excel, CSV, etc.) in Tableau Desktop/Prep Builder/Cloud
2. Customize fields: set default aggregation, number format, create hierarchies, assign geographic roles, add descriptions
3. Hide irrelevant fields (e.g., Row ID)
4. Right-click data source name in Data pane → Publish to Server
5. Configure name, location, permissions in the publish window
6. Access published data source in Tableau Cloud for metric building

### 1.3 Build a Metric Definition
1. Click Tableau Pulse in left navigation (beneath Explore)
2. Click New Metric Definition
3. Select the published data source
4. Configure Definition section:
   - Measure: choose numeric field + aggregation (Sum, Average, Median, Max, Min)
   - Time dimension: select date/datetime field
   - Compared to: set prior period, prior year, etc.
   - Definition filters: preset filters end users cannot change (text fields only)
5. Configure Options section:
   - Adjustable metric filters: dimension fields end users can filter by
   - Number format: Number, Currency, or Percentage
6. Click Save Definition
7. Customize child metrics: click Adjust to set time range, apply filters, add followers
8. Click Follow to add metric to own Pulse summary

### 1.4 Dissect a Metric Definition
1. Configure Value section fields:
   - Measure + Aggregation (see Table 2-1 for available aggregations per field type)
   - Show sparkline values to date as: Running total or Non-cumulative
   - Definition filters (preset, not user-accessible)
   - Time dimension (required)
   - Compared to (drag to reorder priority)
   - Create Advanced Definition (opens Advanced Analytics Editor)
2. Configure Options:
   - Adjustable metric filters (text fields only)
   - Number format (Number, Currency, Percentage)
3. Navigate Insights tab:
   - Dimensions: auto-listed from adjustable metric filters
   - Value going up is: Favorable, Neutral, or Unfavorable
   - Insight types: toggle on/off per type (Table 2-3 lists all types)

### 1.5 Interact with a Metric (End User)
1. View Overview: aggregate visualization with time comparison + line chart
2. Click Breakdown: bar chart broken down by adjustable filter dimensions
3. Scroll to Discover Top Insights: AI-generated questions with bar charts
4. Click Ask button to type custom questions
5. Provide feedback via thumbs up/down on each insight

## 2. Advanced Tableau Pulse Features

### 2.1 Apply Definition Filters
1. In metric definition menu, click Add Definition Filter below the measure
2. Select a text-based string field from dropdown
3. Set include/exclude with multiselect (search available for large value sets)
4. Repeat for additional fields (each field configurable only once)
5. Best practice: apply broadest filter first to reduce most rows

### 2.2 Time Dimension — Custom Date Fields
1. Right-click date field in data source → Create → Custom Date
2. Set Detail to Months, Quarters, or Years as needed
3. Right-click date → Duplicate → rename for fiscal calendar
4. Right-click duplicated field → Default Properties → Fiscal Year Start → set month (e.g., July)
5. Publish updated data source to Tableau Cloud
6. In metric def, select custom date as Time dimension
7. Use Minimum time granularity in Advanced time settings to avoid blank metrics when date granularity is coarse

### 2.3 Offset the Date
1. In metric Definition menu, click Advanced time settings beneath Time dimension dropdown
2. Enter positive integer 0–365 for offset days
3. Metric end date becomes today minus offset

### 2.4 Advanced Metric Definition — Calculated Field
1. In metric Definition menu, click Create Advanced Definition
2. In Advanced Analytics Editor:
   - Right-click a measure → Create → Calculated Field
   - Enter calculation (e.g., `SUM(Profit) / SUM(Sales)`)
   - Name the field (e.g., Profit Ratio)
   - Drag calculated field to Measure shelf
   - Drag date field to Time Dimension shelf
3. Click Apply to save (warning appears if measure or time dimension is missing)
4. Definition now uses the advanced field; sparkline to-date becomes non-cumulative

### 2.5 Custom Definition Filter — Wildcard
1. Click Create Advanced Definition in metric definition window
2. Drag measure to Measure shelf, date to Time Dimension shelf
3. Drag text field to Filters shelf
4. In filter config: collapse General → expand Wildcard
5. Enter match value (e.g., `**Canon**`) with Contains or Starts with
6. Click Apply
7. Optionally add the filtered field as adjustable metric filter for end users

### 2.6 Custom Definition Filter — Measure-Based
1. Click Create Advanced Definition
2. Drag Quantity to Measure, Order Date to Time Dimension
3. Drag Discount (numerical) to Filters shelf
4. Select "All values" (row-level filter, not aggregated)
5. Set condition (e.g., At least → 0.5 for 50%)
6. Include related adjustable filter (e.g., Sub-Category)
7. Click Apply

### 2.7 Manage Permissions
1. Set published data source permissions in Tableau Cloud:
   - View + Connect required for Pulse access
   - Higher roles (Creator, Explorer can publish) can create metric definitions
   - Viewer and Explorer can create metrics from definitions
2. Check effective permissions: data source → Permissions → enter user name
3. Site roles determine definition vs metric creation capability (Table 3-3)

### 2.8 Manage Followers
1. Browse Metrics in Pulse to see all definitions and metrics
2. Click triple-dot menu on a metric → Manage Followers
3. Add or remove users/groups from the metric
4. Note: follower count in Manage Followers menu = groups+users; count on metric card = unique users

### 2.9 Track Usage with Admin Insights
1. Access Admin Insights project (auto-created per Tableau Cloud site)
2. Use Site Content data source to track definitions, metrics, users, data sources per time period
3. Use Permissions data source to audit capability types per user/group
4. Recommended: turn off Record-Level Outliers, Top Detractors, Bottom Contributors insights for admin metrics

## 3. Tableau Pulse for End Users

### 3.1 Browse and Create Metrics (Viewer Role)
1. Navigate to Pulse → browse available metric definitions
2. Click metric definition → See All Metrics or Insights Exploration
3. Click specific metric to customize → click Adjust for time range and filters
4. Must assign at least one follower before leaving the create screen
5. Followed metrics appear in chronological order in Pulse summary

### 3.2 Understand Generated Insights
1. Pulse scores and ranks insight types for statistical significance
2. Insights appear in Breakdown charts and automated summaries
3. Provide feedback: thumbs-up (helpful, optional 3000-char description) or thumbs-down (select reason: biased, inaccurate, incomplete, inappropriate tone, other)
4. Feedback influences future prompt instructions (no immediate change)

### 3.3 Set Up Digest Preferences
1. Click user icon → Preferences in Pulse
2. Set frequency: daily or weekly
3. Choose channels: Email and/or Slack (Slack requires prior admin configuration)
4. Digests sent after AI summary regeneration (~3-4 a.m. UTC)

### 3.4 Enable Slack Digests (End User)
1. Ensure Tableau Cloud admin enabled Slack integration
2. In Slack workspace → Add apps → search Tableau → add
3. Authorize connection: sign in to Tableau Cloud, grant permissions
4. Pulse digests arrive as DMs from Tableau app (alphabetical order, 4+ metrics in threaded reply)

### 3.5 Use Tableau Mobile
1. Install free Tableau Mobile app (Android/iOS)
2. Pulse metrics appear in chronological follow order
3. Can view Overview/Breakdown, access Top Insights, Ask questions
4. Limitations: cannot create new metrics or use adjustable filters (except time horizon)
5. Optional: set Pulse as starting page, enable notification reminders

## 4. Use Cases with Tableau Pulse

### 4.1 Sales Pipeline KPI
1. Re-create a sales KPI dashboard: Measure = Amount (Sum), Definition filter = Won Flag False, Time dimension = Created Date
2. Set comparison: Prior period only; Secondary = None
3. Adjustable filters: Sales Territory, Opportunity Type, Opportunity Stage
4. Number format: Currency → USD
5. Insights: Value going up = Favorable; turn off Record-Level Outliers
6. Pre-generated questions cover top/bottom contributors, increase/decrease per dimension

### 4.2 Finance — Anomaly Detection
1. Create metric for Average Transaction Value filtered to payment type (e.g., Apple Pay)
2. In Insights tab, enable Record-Level Outliers
3. Set Record identifier field and name, fill Singular/Plural nouns
4. Turn off Contributions and Breakdowns insights to spotlight anomalies
5. Build concatenated field in data source for richer outlier detail display

### 4.3 Healthcare — Supply Chain Risk
1. Create metrics: Total Cost, Units Ordered, Unit Cost with supplier-related adjustable filters
2. Configure insight types: Concentrated Contribution Alert + Top Contributors
3. Use adjustable filters to drill into specific therapeutic categories
4. Create child metrics to compare preferred vs non-preferred suppliers
5. Track until issue resolves via followed metrics

### 4.4 Pulse Utilization Monitoring
1. Use Admin Insights → Site Content data source
2. Create metrics: Pulse Metrics (Count of Item LUID, Item Type = Metric), Pulse Definitions (Item Type = Metric Definition), Users Creating Definitions (Distinct Count of Owner Email), Users Creating Metrics, Data Sources with Metrics
3. Optionally join with TS Users/Groups data sources via Prep Builder for richer analytics
4. Use Subscriptions data source for following activity: Total Follows, Unique Followed Metrics, Unique Metric Followers

## 5. Integrating and Extending Tableau Pulse

### 5.1 Slack Integration (Administrator)
1. In Tableau Cloud: Settings → Integrations → Slack Connectivity
2. Enable Salesforce Slack Integration Proxy checkbox
3. Click Connect to Slack → authorize
4. Slack admin approves Tableau app in Slack App Directory
5. End users add Tableau app and authorize individually
6. Once connected, users can also receive notifications, data-driven alerts, search content

### 5.2 Embedding in Salesforce CRM

**Setup in Salesforce:**
1. Settings (cog) → Setup → search Trusted URLs
2. Create New Trusted URL: API Name (no spaces), URL (Tableau Cloud root), description
3. Set CSP context: All; check all CSP Directives
4. Search Tableau Embedding in Setup → turn on token-based SSO
5. Select Tableau User Identity field (matches Tableau Cloud username)
6. Copy Issuer URL and JWKS URI
7. Create Tableau Host Mapping entry with site URL and Site ID

**Setup in Tableau Cloud:**
1. Settings → Connected Apps → New Connected App → OAuth 2.0 Trust
2. Enter Connected App Name, Issuer URL, JWKS URI
3. Enable checkbox → Create
4. Copy Site ID from details page, pass to Salesforce admin

**Standalone embedded Pulse page in Salesforce:**
1. Salesforce Setup → Lightning App Builder → New → App Page
2. Drag Tableau Pulse component to page area
3. Configure Page (e.g., Pulse home), Site ID, Height
4. Save → Activate → select which apps show the page
5. Users access Pulse summary within Salesforce

### 5.3 Embedding in Custom Web Pages
1. Link Embedding API v3 library in HTML:
   ```html
   <script type="module" src="https://POD.online.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js"></script>
   ```
2. Use tableau-pulse web component:
   ```html
   <tableau-pulse id="tableauPulse"
     src='https://POD.online.tableau.com/site/SITE/pulse/metrics/METRIC-ID'
     token='JWT'>
   </tableau-pulse>
   ```
3. Configure properties: height, width, disable-explore-filter, layout (default/card/bar), token (required JWT)

### 5.4 Tableau REST API
- Metric definitions: create, update, delete, list, get batch
- Metrics: get details, get-or-create, create/update/delete, get batch
- Insights: generate basic/springboard/detail insight bundles
- Subscriptions: get details, list per user, create/delete, update followers, batch operations, batch subscribe, get follower counts

## 6. Tableau Agent

### 6.1 Prerequisites
1. Requires Tableau+ subscription on Tableau Cloud
2. Organization must have Data Cloud instance + Salesforce CRM with Einstein AI enabled
3. Connection between platforms tracks requests and provides credit-based AI usage

### 6.2 Visualization Authoring with Tableau Agent
1. Open workbook in Tableau Cloud → click Einstein icon (upper-right, next to Data Guide)
2. Write natural language prompts:
   - Direct chart type: "Make a line chart showing sales by week"
   - Ambiguous with fields: "Create a bar chart breaking down sales of each sub-category for each category"
   - No chart type: "Make a chart showing the sales and quantity for every product"
   - Specify analytical goal: "I want to see the relationship between the two values"
   - Part-to-whole: "Make a chart showing the part-to-whole relationship of Category and Sub-Category by quantity"
3. Follow up to refine: "I want both category and sub-category to be on the left side"
4. Best practices: use imperative verbs, minimize irrelevant fields, use Tableau language, work in steps, ask questions when unsure

### 6.3 Calculated Fields with Tableau Agent
1. Open Einstein panel in web authoring
2. Simple calc: "Create a calculated field that is the number of days between Order Date and Ship Date"
3. Advanced calc: "Create a calculated field showing the percentage difference between each month for sales" (uses LOOKUP, table calculation)
4. Complex calc: "For every state, find the very first order date using customers whose first name is exactly 5 characters" (uses LOD + string functions)
5. Explain existing calc: "Explain Profit Rank" (returns description of RANK_UNIQUE)
6. Debug/modify: "How can I change the calculation so the rank starts over for every Category?" (advises on Compute Using setting)

### 6.4 Filtering with Tableau Agent
1. Date filter: "Limit the data to the last 18 months" (creates relative date filter)
2. Dimension filter: "I only want to see Consumer and Corporate in the chart"
3. Measure filter: "Only include rows of data where the sales value is more than 100" (key: use "rows of data" for row-level filter vs aggregation)
4. Iterate prompt wording if initial attempt uses aggregated filter instead of row-level

### 6.5 Prompting Best Practices for Tableau Agent
1. Use direct, explicit language: start with imperative verbs (Make, Create, Build, Write, Explain, Show me)
2. Hide/exclude unnecessary fields to reduce noise
3. Use Tableau-specific language and documentation phrases
4. Break complex tasks into separate prompts, iterate step by step
5. Phrase as questions (how, what, which) when unsure of desired output
6. Provide feedback via thumbs up/down (aggregated for model improvement, not immediate)

### 6.6 Tableau Agent in Prep Builder
1. Open Add Field editor in web-based Prep Builder
2. Access Einstein section for calculation assistance
3. Supported: logical operators, fixed LODs, numerical aggregations, regular expressions
4. Example regex prompt: "Write a regular expression to parse the four-digit year from the Order ID into its own field"
5. Agent provides extract button to replace editor content
6. Unsupported: join/union, pivot/aggregation steps, new rows, predictions, script insertion, output

### 6.7 Tableau Data Catalog — Draft with Einstein
1. Navigate to edit description for workbook, data source, or table
2. Click Draft with Einstein button
3. AI generates description based on metadata (field names, table names)
4. Regenerate by clicking button again
5. Manually edit/adjust formatting as needed
