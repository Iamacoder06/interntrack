# InternTrack

InternTrack is a responsive internship and job application tracker for students. It keeps application details, status, dates, and notes together in a focused dashboard.

## Features

- Create, view, edit, and delete applications
- Dashboard counts for applied, interview, offer, and rejected statuses
- Search by company, role, or location, with status, type, and location filters
- Sort by application date or company name
- Browser LocalStorage persistence and saved light/dark theme preference
- Responsive dashboard, mobile navigation, accessible forms, validation, and empty states
- Fictional sample applications are added only when no saved data exists

## Tech stack

- React 19
- Vite 8
- JavaScript and plain CSS

## Screenshots

_Add screenshots of the dashboard and mobile layout here._

## Run locally

```sh
npm install
npm run dev
```

## Available npm commands

- `npm run dev` — start the local development server
- `npm run build` — create a production build in `dist/`
- `npm run preview` — serve the production build locally
- `npm run lint` — run Oxlint

## Project structure

```text
src/
  App.jsx                  Main dashboard and application interactions
  App.css                  Application layout and responsive styles
  index.css                Global styles and typography
  hooks_useApplications.js LocalStorage application data hook and demo data
  main.jsx                 React entry point
```

## Future improvements

- Add user accounts and cloud synchronization
- Add reminders and calendar integration for interviews
- Add export and import for application data
- Add configurable dashboard views
