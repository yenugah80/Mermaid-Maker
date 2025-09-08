
# Mermaid Maker

**AI-powered Mermaid diagram editor**

Transform ideas into clear visual diagrams using natural language. Mermaid Maker combines Mermaid syntax with an AI assistant to generate, edit, and export flowcharts, sequences, and system diagrams quickly.

Features
- AI Assistant: Generate diagrams from plain English prompts
- Mermaid Editor: Edit Mermaid code directly with tab support and auto-resize
- Live Preview: Real-time rendering using Mermaid.js with loading/error states
- Export to SVG: Download high-quality SVGs with smart filenames
- API Key Management: Store your OpenAI API key securely in localStorage
- Mock Mode: Works without an API key for demos/testing
- Templates: One-click templates for Flowchart, Sequence, Gantt, Class, State, and ER
- Theme Toggle: Light/dark mode with preview re-render
- Persistence: Auto-saves code and prompt to localStorage

Tech stack
- Vite + React + TypeScript
- Tailwind CSS + shadcn/ui
- Mermaid.js
- React Query (prepared)

Getting started
1) Clone & install
```bash
git clone <REPO_URL>
cd <REPO_DIR>
npm install
```
2) Run dev server
```bash
npm run dev
```
Open the printed URL (Vite defaults to http://localhost:5173).

AI setup (optional)
To enable AI generation:
1) Create an API key at platform.openai.com
2) In the app, open the settings button in the AI panel
3) Paste your key (stored locally in your browser)
Without a key, Mermaid Maker uses a built-in mock mode.

Usage
- Type a prompt and click “Generate with AI” to get Mermaid code
- Edit the code in the editor; the preview updates live
- Use Quick Actions to Export SVG, Reset, or Copy code
- Click a Diagram Type to load a template

Accessibility & compatibility
- Buttons have disabled states and ARIA labels for key actions
- Clipboard uses navigator.clipboard; consider polyfill for older browsers

Production notes
- Preview catches Mermaid render errors and shows messages
- Local state persists across refreshes
- Remove the mock API in production and route requests through your backend if needed

License
MIT