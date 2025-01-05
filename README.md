# Tax Calculator Application

## Overview

This project was initially a senior frontend developer take-home assignment and has been adapted into a portfolio showcase to demonstrates my ability to:

1. Design and implement scalable, production-ready frontend applications.
2. Utilize modern tools and frameworks effectively to build maintainable codebases.
3. Create clean, reusable, and testable components.
4. Write robust tests for critical workflows and business logic.
5. Implement error handling, logging, and environment-aware configurations.
6. Optimize for performance and user experience.

![Tax Calculator Demo](https://github.com/anduscheung/my-icon-host/blob/main/tax-calculator-demo.gif)

Live demo: [https://react-tax-calculator-frontend.netlify.app/](https://react-tax-calculator-frontend.netlify.app/)

---

## **Initial Requirements**

The initial requirement was to write the UI for a tax calculating app that fetch the tax brackets from an API and displays calculated tax results based on user input.

1. Fetch tax rates by year from an given API endpoint (`/api/tax-calculator/tax-year/[year]`). (I rewrote the given Python backend in Netlify Node.js serverless function here: [https://github.com/anduscheung/tax-calculator-backend](https://github.com/anduscheung/tax-calculator-backend).)
2. Accept user inputs for **annual income** and **tax year** via a form.
3. Display:
   - Total income tax for the given parameters.
   - Taxes owed per bracket.
   - Effective tax rate.
4. Implement robust error handling and display appropriate error messages in the UI (The API endpoint will throw error randomly).
5. Build a clean, user-friendly interface with consistent design.
6. Ensure scalability, maintainability, and clean code principles.
7. Include documentation, automated testing, and logging.

---

## Starting the app locally

- Frontend: clone the [frontend](https://github.com/anduscheung/react-tax-calculator) and run `npm install && npm run start`
- Backend: clone the [backend](https://github.com/anduscheung/tax-calculator-backend) and install the Netlify Cli`npm install netlify-cli -g`, then run `npm install && npm run dev`

---

## UI/UX and user workflow

### **The Mandatory features**

- When initial load, this app will render TaxForm on the left and TaxResult on the right.
- When frontend is fetching the tax bracket for the selected year, the amount field of the TaxForm will be disable during api fetching.
- The year dropdown is enabled in purposed during fetching so that users can quickly change their mind of which year they want to view, only the latest selected will be loaded while the previous ones will be cancelled.
- Api fetching results are cached using the year as the key, with a stale time of 8 hours and cache time of 1 week to prevent server overload and faster frontend response time.
- If there is error when fetching the API, the app will automatically retry once, if it encounters two consecutive fails than it will show an error. This ensures the user isn’t blocked due to a temporary API issue.
- The amount field will only accept positive/negative number, all other input will lead to an error message and $0 tax on the tax result.

### **Enhancing User Input Experience**

- If user types a trailing zero in front of a positive number, or a zero between the negative size and the first number, the input will automatically delete the zero, making it more convenient for the user
- If user removes all words from the input the value will automatically be set to 0

### **Common Q&As about the stale and cache time for the API call**

#### **Q: Will users see stale data after 1 day?**

**A:** No. After 1 day, the data is marked as stale, and React Query triggers a background refetch the next time the data is accessed. While the refetch is happening, the user temporarily sees cached (stale) data, which is immediately replaced with fresh data once the fetch is complete.

#### **Q: Why is the stale time set to 8 hours instead of a shorter/longer duration (e.g., 4 hrs / 7 days), or even infinity?**

**A:** Setting a stale time of 8 hours strikes the right balance between data accuracy and performance. While tax brackets rarely change, there is a small chance of a sudden government policy update that necessitates immediate updates.

The 8-hour duration ensures:

- **Daily Refresh**: Data is refreshed at least once during a typical workday and once again the next morning if accessed after hours.
- **Accommodates Backend Updates**: If the backend is redeployed with new tax brackets at the end of the office hours (e.g., 4 PM), users accessing the app after 4 PM will have the most up-to-date data, while users who fetched before 4 PM will see their cached data expire before the next critical period (e.g., noon the next day).
- **Minimizes API Calls**: Compared to shorter durations (e.g., 4 hours), this reduces server load while still ensuring users see accurate data within the same day.
- **Better Than 7 Days**: A 7-day stale time risks users seeing outdated information for too long, especially in the rare case of a sudden mid-week policy change.

This setup aligns well with real-world government policy schedules while providing users with accurate data in a timely manner.

#### **Q: Why is the cache time set to 7 days instead of matching the stale time?**

**A:** Setting the cache time to 7 days ensures that cached data remains available for immediate display while fresh data is fetched in the background. If the cache time matched the stale time (8 hours), the data would be removed from memory immediately when it becomes stale, forcing a visual change of the UI due to reload (isLoading will change), now it only reloads in the backend and will not trigger a loading.

## Design Patterns and Architecture

### 1. Framework and Tools Selection

For a production grade setup, I decided to use the following well tested open source libraries to help me to increase the reliability and write less:

- **React with TypeScript**: Ensured type safety and reduced runtime errors.
- **React Query**: Simplified API state management and added caching for increasing performance.
- **React Hook Form**: Lightweight form validation for better user experience.
- **Ant Design**: Professional looking UI components with accessibility in mind.
- **Jest & Testing Library**: Covered key components and business logic with unit tests.

### 2. Folder structure:

A feature-based structure which in my opinion is the best structure for frontend for scalability and readability. In this structure, the pages are grouped by feature and the business logics are broken down into small parts and spread across the following folders:

- **`api/`**: Contains all API-related logic. This is where external API integrations (like the tax brackets API) are encapsulated.
- **`components/`**: Includes reusable, modular components that can be shared across the app.
- **`constants/`**: Stores global constants for the application, improving maintainability and reducing magic numbers or strings in code.
- **`features/`**: Organized by feature, where each feature has its components, styles, and tests grouped together. This structure enhances modularity and scalability.
- **`utils/`**: Utility functions that provide reusable, low-level logic like formatting, validation, and logging.
- **`tests/`**: Test files are colocated with the features or utilities they belong to, promoting clarity and ease of testing.

### 3. Logging

- I have demonstrated how I will set up a logger class and implemented different levels (`INFO`, `WARN`, `ERROR`) with environment-aware configurations for a production grade application.
- In production environment, all INFO will be hidden and for ERROR the logger will simulates sending errors to an external service, such as Sentry

### 4. Testing strategy

In my opinion, the primary purpose of testing is to ensure that core logic and existing functionality remain intact when future changes are made by other team members. In this project, I demonstrate how I approach writing tests for a production-grade frontend repository:

- **Utility Functions:** All utility functions include comprehensive unit tests to ensure reliability and robustness.
- **Features:** Each feature is equipped with integration tests to validate its behavior in real-world scenarios and ensure all parts work seamlessly together..
- **Reusable Components:** Reusable components are minimally tested if they primarily rely on well-tested open-source libraries to ensure their functionality is correctly integrated (e.g., ControlledDropdown.tsx and ControlledInput.tsx). However, fully custom-built components are tested comprehensively to cover edge cases and ensure robustness (e.g., ErrorMessage.tsx).
