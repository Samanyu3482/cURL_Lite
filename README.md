#  cURL Lite — Visual HTTP Request Playground

> **Project Proposal & Specification Guide**  
> A lightweight, web-based API client and visual HTTP request playground built with Vanilla HTML5, CSS3, JavaScript (ES6+), and native Browser APIs.

---

##  Project Overview

**cURL Lite** is an interactive, browser-native HTTP request playground designed to simplify REST API testing and visually demonstrate key web concepts. Inspired by API testing tools like Postman and cURL, cURL Lite enables developers and learners to construct, send, inspect, abort, and persist HTTP requests directly within the browser—without relying on heavy third-party dependencies or external frameworks.

The application serves both as a functional developer utility and an educational visualizer, rendering the underlying **Promise Lifecycle** (`PENDING` → `FULFILLED` / `REJECTED`), network timing metrics, header management, and local request history in real time.

---

##  Goals & Objectives

### 1. Primary Objectives
* **Interactive API Testing**: Provide an intuitive visual interface to test RESTful APIs (`GET`, `POST`, `PUT`, `DELETE`).
* **Visualizing Asynchronous JS**: Demystify JavaScript Promises and the `fetch` API lifecycle through real-time state visualization.
* **Zero-Dependency Architecture**: Build a high-performance web app strictly using native modern Web APIs (`Fetch`, `AbortController`, `AbortSignal.timeout`, `LocalStorage`, `DOM API`).
* **Clean Software Engineering**: Enforce modular architecture by segregating API logic, UI updates, and data storage into dedicated modules.

### 2. Learning & Educational Outcomes
* Master asynchronous JavaScript (`async/await`, `Promises`, `.then()`, `.catch()`).
* Understand HTTP request/response lifecycles, headers, status codes (`200 OK`, `404 Not Found`, `500 Internal Server Error`), and request bodies (`JSON.stringify()`, `response.json()`).
* Implement network resiliency features like manual request cancellation (`AbortController`) and automated timeout handling (`AbortSignal.timeout()`).
* Implement browser persistence utilizing `localStorage` and JSON serializations.

---

##  Specifications

### 1. Functional Features Hierarchy

####  Level 1 — Essential Features
* **HTTP Method Selector**: Dropdown to choose between `GET`, `POST`, `PUT`, and `DELETE`.
* **URL Input Field**: Validated input box for target API endpoints (e.g., `https://dummyjson.com/products/1`).
* **Send Request Button**: Triggers the asynchronous request execution.
* **Response Inspector**: Displays status codes, response headers, and formatted JSON output.
* **Error Handling**: Graceful error UI for invalid URLs, network drops, or HTTP error status codes (`response.ok` check).
* **Loading Indicators**: Visual spinner/overlay during active network requests.
* **Readable JSON Formatting**: Pretty-prints raw JSON strings with syntax highlighting or clear indentation (`JSON.stringify(data, null, 2)`).

####  Level 2 — Important Features
* **Dynamic Headers Editor**: Add, edit, or remove custom HTTP Request Headers (key-value pairs such as `Content-Type: application/json` or `Authorization: Bearer <token>`).
* **Request Body Editor**: Multi-line JSON body editor for `POST` and `PUT` payloads.
* **Request History Panel**: Chronological list of previously executed requests (Method, URL, Timestamp).
* **LocalStorage Persistence**: Stores request history locally so data persists across browser reloads.
* **History Restoration & Management**: Clicking a past request restores its method, URL, headers, and body into the form. Includes a **Clear History** button.

####  Level 3 — Signature Features
* **Promise Lifecycle Visualizer**: Visual status badge depicting real-time promise states:
  * `PENDING`: Request initiated, awaiting server response.
  * `FULFILLED`: Request succeeded with data parsed.
  * `REJECTED`: Request failed due to network error, timeout, or abort.
* **Abort Request**: Immediate cancellation of active HTTP requests using `AbortController.abort()`.
* **Configurable Timeout**: Automated cancellation using `AbortSignal.timeout(ms)` to stop hanging requests.
* **Response Timing Metrics**: Calculates and displays request latency (round-trip time in milliseconds).

####  Stretch Goals
* **Code Generator**: Generates copyable, native JavaScript `fetch()` code snippets based on current form inputs.
* **Request Collections**: Group saved requests into categories (e.g., *Authentication*, *Products*, *Users*).
* **Response Analytics**: Detailed response payload stats (Status, Round-trip Time, Payload Size in KB, Content-Type).

---

### 2. Architecture & Directory Structure

cURL Lite follows a clean separation of concerns:

```
cURL_Lite/
│
├── index.html          # Semantic HTML5 page layout & structure
├── css/
│   └── style.css       # Visual layout, design system, theme variables & animations
└── js/
    ├── app.js          # Core controller connecting UI events, API calls, and storage
    ├── api.js          # Asynchronous HTTP handler (Fetch, AbortController, Timeout)
    ├── storage.js      # LocalStorage persistence wrapper (Save, Load, Clear)
    └── ui.js           # DOM manipulation, render logic, and lifecycle visualizer
```

#### Module Breakdown:
* `index.html`: Defines the layout structure (Header, Request Configuration Panel, Promise Lifecycle Bar, Response Panel, Request History Sidebar).
* `css/style.css`: Contains CSS Grid/Flexbox styling, custom dark/light theme properties, glassmorphism UI cards, animations for loading/promise transitions, and responsive mobile layouts.
* `js/app.js`: Main entry point initializing event handlers and managing application state flow.
* `js/api.js`: Handles network calls with `fetch()`, configures headers/body options, attaches `AbortController` signals, and measures execution timing.
* `js/storage.js`: Wraps `localStorage` read/write operations with `JSON.stringify()` and `JSON.parse()`.
* `js/ui.js`: Encapsulates all DOM modifications (e.g., updating lifecycle state classes, syntax formatting, history item rendering).

---

##  Visual & UI Design

### 1. Interface Layout (ASCII Mockup)

```
┌───────────────────────────────────────────────────────────┐
│                        cURL Lite                          │
│              Visual HTTP Request Playground               │
├───────────────────────────────────────────────────────────┤
│ Method       URL                                          │
│ [ GET ▼ ]    [ https://dummyjson.com/products/1        ]  │
│                                                           │
│ Headers                                                   │
│ Key: [ Content-Type  ]  Value: [ application/json    ] [-] │
│ Key: [ Authorization ]  Value: [ Bearer token123...  ] [-] │
│ [ + Add Header ]                                          │
│                                                           │
│ Request Body (JSON)                                       │
│ ┌───────────────────────────────────────────────────────┐ │
│ │ { "title": "New Product", "price": 29.99 }            │ │
│ └───────────────────────────────────────────────────────┘ │
│                                                           │
│ Timeout: [ 5000 ms ▼ ]                                    │
│ [  Send Request ]             [ ⏹ Abort Request ]        │
├───────────────────────────────────────────────────────────┤
│ Request Lifecycle Visualizer                               │
│ [ PENDING ] ➔ [ FULFILLED ] (Latency: 245ms)             │
├───────────────────────────────────────────────────────────┤
│ Response Panel                                            │
│ Status: 200 OK  | Time: 245 ms | Size: 1.2 KB             │
│ Headers: Content-Type: application/json; charset=utf-8    │
│ Body:                                                     │
│ {                                                         │
│   "id": 1,                                                │
│   "title": "Essence Mascara Lash Princess",               │
│   "price": 9.99                                           │
│ }                                                         │
├───────────────────────────────────────────────────────────┤
│ Request History                                           │
│  GET  https://dummyjson.com/products/1      (11:42 AM)  │
│  POST https://dummyjson.com/products        (11:40 AM)  │
│ [  Clear History ]                                      │
└───────────────────────────────────────────────────────────┘
```

### 2. Design System & Aesthetics
* **Theme**: Modern Dark Mode with a high-contrast layout, sleek cards, and glassmorphism accents.
* **HTTP Method Color Palette**:
  * `GET`: Bright Emerald Green (`#10B981`)
  * `POST`: Royal Sapphire Blue (`#3B82F6`)
  * `PUT`: Amber Gold (`#F59E0B`)
  * `DELETE`: Crimson Red (`#EF4444`)
* **Promise Visualizer Indicators**:
  * `PENDING`: Pulsing Yellow / Amber Glow
  * `FULFILLED`: Glowing Emerald Green Border & Badge
  * `REJECTED`: Neon Crimson Red Glow & Error Icon
* **Typography**: Clean modern sans-serif (`Inter`, `Roboto`, or system default font stack) for UI, paired with monospace (`Fira Code`, `JetBrains Mono`) for code/headers/body formatting.

---

##  Request Lifecycle & Control Flow

### 1. Standard Request Flow
```
User clicks [Send Request]
       │
       ▼
Collect Form Data (Method, URL, Headers, Body)
       │
       ▼
Update Lifecycle UI ──> Set Status to [ PENDING ]
       │
       ▼
Execute fetch(url, options) with AbortController Signal
       │
  ┌────┴────────────────────────┐
  ▼                             ▼
[ Response Received ]      [ Network Failure / Abort ]
  │                             │
  ▼                             ▼
Check response.ok           Set Status to [ REJECTED ]
  │                             │
  ├─► True: Parse JSON ────────► Set Status to [ FULFILLED ]
  │
  └─► False: Parse Error ──────► Render HTTP Error Code
       │
       ▼
Render Status, Headers, Body & Save to History (LocalStorage)
```

---

##  Step-by-Step Implementation Roadmap

| Phase | Task Description | Key Concepts Demonstrated |
| :--- | :--- | :--- |
| **Phase 1** | Build HTML Skeleton | Forms, Semantic Structure, Inputs, Select, Textarea |
| **Phase 2** | Visual Layout & CSS | Flexbox, CSS Grid, Glassmorphism, Theme Variables |
| **Phase 3** | DOM Event Listeners | `querySelector`, `addEventListener`, Event Delegation |
| **Phase 4** | Request Form Reader | Data Extraction, JavaScript Objects, Form Validation |
| **Phase 5** | Core GET Implementation | Native `fetch()`, `async/await`, Promises |
| **Phase 6** | Error Handling Layer | `try...catch`, `response.ok`, Error Boundaries |
| **Phase 7** | Status Code Display | HTTP Status Mapping, Dynamic CSS Styling |
| **Phase 8** | JSON Formatting & Beautification | `JSON.parse()`, `JSON.stringify(data, null, 2)` |
| **Phase 9** | POST Request Support | Request Payload, `Content-Type: application/json` |
| **Phase 10**| Dynamic Headers Editor | Dynamic DOM Creation, Array Manipulation |
| **Phase 11**| PUT & DELETE Support | Generalized `sendRequest()` Handler Abstraction |
| **Phase 12**| Loading States & Feedback | UI Spinner, Button Disabling, Async Feedback |
| **Phase 13**| Promise Lifecycle Visualizer | State Machine UI Updates, CSS Status Animations |
| **Phase 14**| AbortController Integration | `AbortController`, Signal Cancellation |
| **Phase 15**| Automated Request Timeout | `AbortSignal.timeout()`, Latency Handling |
| **Phase 16**| Request History Array | Data Structuring, History Queueing |
| **Phase 17**| LocalStorage Persistence | `localStorage.setItem()`, `localStorage.getItem()` |
| **Phase 18**| Restore Request State | State Hydration on Click, Form Repopulation |
| **Phase 19**| UI Polish & Micro-animations | Responsive Breakpoints, Transitions, Accessibility |

---

##  Common Pitfalls & Guidelines

1. **`response.json()` returns a Promise**: Remember that `fetch()` resolves to a `Response` object; `response.json()` must also be `await`ed.
2. **HTTP Errors vs Network Errors**: A `404 Not Found` or `500 Server Error` will *not* reject the `fetch()` promise. Always check `response.ok` before attempting standard payload extraction.
3. **JSON Stringification**: Body payloads sent via `POST` or `PUT` must be stringified with `JSON.stringify()` before sending over HTTP.
4. **LocalStorage Storage Format**: `localStorage` only stores strings. Always use `JSON.stringify()` when saving and `JSON.parse()` when loading objects/arrays.
5. **Decoupled Architecture**: Keep API fetch logic (`api.js`), DOM rendering (`ui.js`), and storage logic (`storage.js`) strictly separated from the main orchestrator (`app.js`).

---

## 🏁 Getting Started

### Prerequisites
No build tools, bundlers, or frameworks required! You only need a modern web browser (Chrome, Firefox, Safari, Edge).

### Installation & Execution
1. Clone the repository:
   ```bash
   git clone https://github.com/Samanyu3482/cURL_Lite.git
   ```
2. Navigate to the project directory:
   ```bash
   cd cURL_Lite
   ```
3. Open `index.html` in your browser or run a local static server:
   ```bash
   npx serve .
   ```

---

*cURL Lite — Built layer by layer for clean, robust visual HTTP testing.*
