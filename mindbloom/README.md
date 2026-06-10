# 🌿 MindBloom — Mental Health & Productivity Companion

A React frontend for Anant's AI-Powered Mental Health & Productivity Companion project.

## Project Structure

```
mindbloom/
├── public/
│   └── index.html          # HTML entry point
├── src/
│   ├── index.js            # React root render
│   ├── index.css           # Global styles & CSS variables
│   ├── App.js              # Root component, shared state
│   └── components/
│       ├── Sidebar.js      # Navigation sidebar
│       ├── CircleProgress.js  # Reusable SVG ring chart
│       ├── Dashboard.js    # Main overview page
│       ├── MoodLog.js      # Mood check-in & weekly view
│       ├── Focus.js        # Pomodoro timer + task list
│       ├── Habits.js       # Habit tracker grid
│       └── Journal.js      # Daily journal entry
├── package.json
└── README.md
```

## How to Run

### Step 1 — Make sure Node.js is installed
Open your terminal and run:
```bash
node -v
```
If you see a version number (e.g. v18.x.x), you're good.
If not, download Node.js from: https://nodejs.org/

### Step 2 — Go into the project folder
```bash
cd mindbloom
```

### Step 3 — Install dependencies (only first time)
```bash
npm install
```
This downloads React and all required packages into a `node_modules/` folder.
Wait for it to finish (1-2 minutes).

### Step 4 — Start the app
```bash
npm start
```
Your browser will open automatically at: http://localhost:3000

---

## What's Inside

| Page | Feature |
|------|---------|
| Dashboard | Mood check-in, task stats, weekly trend chart, affirmations |
| Mood Log | 5-level mood selector, weekly bar chart |
| Focus | Live Pomodoro timer with ring progress, task checklist |
| Habits | Weekly habit tracker with completion rates |
| Journal | Freeform daily entry with save feedback |

## Next Steps (Backend Phase)
- [ ] Add Flask or Express.js backend
- [ ] Connect MongoDB for data persistence
- [ ] Integrate Claude API for AI insights
- [ ] Add user authentication (JWT)
- [ ] Deploy on Vercel (frontend) + Render (backend)
