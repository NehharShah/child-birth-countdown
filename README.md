# Baby Countdown

A delightful Next.js app that lets you set a due date and shows a live countdown with a whimsical 3D background.

## Features

- Beautiful 3D animated background using React Three Fiber and Drei
- Live countdown (days, hours, minutes, seconds)
- Optional baby's name in the headline
- Responsive UI with modern components

## Tech Stack

- Next.js 15, React 19
- Tailwind CSS
- @react-three/fiber, @react-three/drei

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm installed

### Install

```bash
pnpm install
```

### Run locally

```bash
pnpm dev
```

Open `http://localhost:3000` in your browser.

### Build

```bash
pnpm build
pnpm start
```

## Project Structure

- `app/`: Next.js App Router pages and layout
- `components/`: UI components
- `public/`: Static assets
- `styles/`: Global styles
- `lib/`: Utilities

## Deployment

Deploy to any Node-compatible host or static platform that supports Next.js.

- Build with `pnpm build`
- Serve with `pnpm start` on a Node server, or export and host as needed

## License

MIT
