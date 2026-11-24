# JobTrack — Job Application Tracker

JobTrack is a modern, responsive SaaS-style Job Application Tracker built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, **React Router**, **Lucide React**, and **Recharts**. All data is persisted locally in the browser via `localStorage`.

## Features

- **Dashboard Overview**: Dynamic time-based greeting, live application statistics (Total, Applied, Interviews, Offers), a 6-week Recharts activity chart, recent applications feed, and upcoming interviews list.
- **Applications Management**: Full CRUD with form validation, detailed view modal, inline status updates (`Wishlist`, `Applied`, `Under Review`, `Interview`, `Offer`, `Rejected`), search, status/employment-type filters, date sorting, and delete confirmation dialogs.
- **Saved Jobs**: Bookmark opportunities before applying, edit/remove saved roles, and move any saved job into active Applications in one click.
- **Interviews Tracker**: Schedule Online or On-site interviews with meeting links or addresses, toggle completion status, and view Upcoming vs. Past & Completed rounds separately.
- **Settings & Personalization**: Update display name, toggle Light/Dark mode, reset preferences, or clear all local data with confirmation safeguards.
- **Responsive SaaS UI**: Collapsible desktop sidebar, mobile navigation drawer, toast notifications, empty states, and accessible keyboard-friendly modals.

## Tech Stack

- **React 19** + **TypeScript**
- **Vite**
- **Tailwind CSS v4**
- **React Router DOM**
- **Lucide React**
- **Recharts**
- **LocalStorage** (custom `useLocalStorage` hook)

## Getting Started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

Run linter:

```bash
npm run lint
```
