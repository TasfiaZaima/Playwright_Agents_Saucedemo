# Playwright Test Project

This project is set up for end-to-end testing using Playwright with Allure reporting.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   npm run install-playwright
   # or
   npx playwright install
   ```

3. Install system dependencies (optional, but recommended):
   ```bash
   npm run install-deps
   # or
   npx playwright install-deps
   ```

## Running Tests

Run tests in all browsers:
```bash
npm run test
# or
npx playwright test
```

Run tests in UI mode:
```bash
npm run test:ui
# or
npx playwright test --ui
```

Run tests in a specific browser:
```bash
npx playwright test --project=chromium
```

Run tests in headed mode:
```bash
npx playwright test --headed
```

## Allure Reporting

This project uses Allure for detailed test reporting.

To generate and view the Allure report:
```bash
# Run the tests (results are saved in allure-results/)
npm run test

# Install allure command line tool (if not already installed)
npm install -g allure-commandline

# Generate and serve the report
allure serve allure-results
```

To generate a static Allure report:
```bash
allure generate allure-results --clean
```

## Debugging

To debug tests:
```bash
npx playwright test --debug
```

Or use the HTML report after running tests:
```bash
npx playwright show-report
```

## Writing Tests

Tests should be placed in the `tests/` directory with the `.spec.ts` extension.