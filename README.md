# COMP2110 Portal - Starter

# New Media Cinema
 
**Deployment URL:** _[Replace this with your live deployment link, e.g. https://your-app.netlify.app]_
 
New Media Cinema is a single-page front-end movie and TV series discovery dashboard built with **Lit Web Components** and the **TMDB (The Movie Database) API**. Instead of presenting hard-coded content, the website pulls live data from TMDB so users can browse current trending films, search for any movie or TV series, drill into a specific TV season, view detailed metadata across four dashboard widgets, and watch the official trailer — all from one page.
 
Group: **GWDP G053**
Members: Lakshya Goyal, Mohamad Ehsan Qasemi, Cooper Gallibu, Min Khant Tun
 
---
 
## 1. API Overview and How It Is Integrated
 
### The API
 
The application uses the [TMDB (The Movie Database) API](https://www.themoviedb.org/documentation/api), a large community-maintained database of movies, TV shows, cast and crew, genres, keywords, trailers, watch providers and trending content. TMDB was chosen because it exposes everything our dashboard needs through a single consistent REST API, with high-quality images and reliable metadata for both films and TV series.
 
Authentication is handled with a Bearer access token stored in `src/config.js` and sent in the `Authorization` header of every request.
 
### How It Is Integrated
 
TMDB data flows through the application in several different ways depending on the widget:
 
- **Trending slider (`dashboard-slider.js`)** — On page load, the slider fetches the `/trending/movie/day` endpoint and rotates through current trending titles automatically. No user input is required.
- **Search (`dashboard-search.js`)** — A media-type dropdown lets the user pick **Movie** or **TV Series**, which controls whether the search bar hits the `/search/movie` or `/search/tv` endpoint. Results are shown in a dropdown so the user can select the exact title they meant.
- **Detail fetching** — Once a title is selected, the search component calls `fetchMovieDetails` or `fetchTVDetails`. These functions request full details, credits, keywords (or TV keywords), watch providers and videos via `append_to_response` and TMDB's related endpoints, then pass the merged data down to every dashboard widget as properties.
- **Season support** — If the selected title is a TV series with seasons, a second dropdown appears. Selecting a season triggers a `/tv/{id}/season/{number}` request, and the dashboard re-renders with season-specific overview, poster, release date and trailer.
- **Dashboard widgets** — `dashboard-information`, `dashboard-overview`, `dashboard-castAndCrew` and `dashboard-watch-providers` all receive their data through Lit properties from the single detail fetch, which keeps the number of API calls low and the UI in sync.
- **Trailer (`dashboard-trailer.js`)** — Reads the `videos` field of the selected title, finds the first YouTube trailer, and embeds it as an `<iframe>`. If TMDB has no trailer, the component displays a clear "Trailer does not exist" fallback.
All API requests use `fetch` with `response.ok` checks, `throw new Error` on failure, and `.catch()` handlers so that a broken request never silently corrupts the dashboard. Widgets also use fallback strings such as *"Information not provided"* and *"Cannot be calculated"* when TMDB returns missing or null fields (common for TV budgets, runtimes, or older titles).
 
---
 
## 2. What Our Group Has Achieved
 
We built a fully working, interactive movie and TV discovery dashboard. The finished application includes:
 
- **A header, footer and favicon** giving the site a consistent brand identity.
- **A trending movies slider** at the top of the page that auto-rotates and can also be navigated manually using arrow controls and indicator dots.
- **A dual-mode search system** where the user first chooses whether they are searching for a Movie or a TV Series. The search form, button label and result dropdown all adapt to that choice, and the application calls the correct TMDB endpoint based on the selection.
- **A result-count message and selection dropdown** so the user can see how many titles matched and pick the exact one they meant (sequels, remakes, etc.).
- **Automatic smooth scroll** to the dashboard section the moment a result is chosen, so the user is never left wondering where the information appeared.
- **Four scrollable dashboard widgets**, each with a fixed card height and internal scrolling for long content:
  - **General Information** — poster, title, year, runtime, TMDB rating, director, budget, revenue and calculated profit.
  - **Overview** — synopsis plus genre and keyword/theme tags.
  - **Cast & Crew** — actor profile photos with character names, plus crew with their job roles; falls back to initials when no profile image is available.
  - **Watch Providers** — streaming/rental availability, spoken languages, production countries and production companies, with the required advertisement widget integrated cleanly into this section.
- **TV series and season support** — selecting a TV show first shows the default series view; if seasons exist, a second dropdown lets the user select a specific season and the dashboard re-renders with that season's information. Selecting "Default" restores the original series data.
- **An embedded YouTube trailer component** that updates with the selected movie, TV series or specific season, and shows a clear fallback when no trailer is available.
- **Robust error and missing-data handling** so the dashboard never breaks on incomplete TMDB responses.
- **A responsive, dark-themed visual design** with consistent typography, spacing, custom scrollbar styling and fixed-height widget cards that keep the layout balanced regardless of content length.
---
 
## 3. Bonus / Above-and-Beyond Features
 
These are features that go beyond the minimum required for the assignment and are explicitly called out here for the bonus rubric.
 
### 3.1 Trending Movies Slider (live API-driven)
 
The top of the homepage is **not** a static banner. The slider component (`dashboard-slider.js`) fetches the current `/trending/movie/day` list from TMDB on load and rotates through real, up-to-date trending films — meaning the homepage content changes day to day without any code changes. Each slide displays the poster, title, TMDB rating, release date, vote count and overview pulled directly from the live API response.
 
Beyond the API integration, the slider has substantial UX complexity:
 
- **Auto-rotation** advances the slide every few seconds so the homepage always feels active.
- **Manual navigation** is available via forward/backward arrow buttons.
- **Indicator dots** at the bottom show the user which trending movie they are currently viewing and let them jump directly to any one of the trending titles.
- **Responsive layout** keeps the slider readable on both desktop and mobile viewports.
### 3.2 Embedded Trailer Component
 
After the four dashboard widgets, the page includes a full-width trailer section (`dashboard-trailer.js`). When the user selects a movie, a TV series, or a specific season, the application reads the `videos` data returned by TMDB, finds the first YouTube trailer for that selection, and embeds it directly into the page using a YouTube `<iframe>`. The user does not have to leave the site to watch the trailer.
 
The component is fully reactive to the rest of the dashboard:
 
- For a **movie**, it shows that movie's trailer.
- For a **default TV series**, it shows the trailer for the whole show.
- For a **specific TV season**, it switches to that season's trailer if TMDB provides one.
- If no trailer is available for the current selection, the component cleanly renders a *"Trailer does not exist"* message instead of breaking the layout.
### 3.3 TV Series + Season-Level Drill-Down (additional bonus feature)
 
What started as a movie-only project was extended late in development into a full media discovery tool. The same dashboard structure now supports three different states — a movie, a default TV series, and a selected TV season — by storing the original series data separately so the user can return to the default view at any time. This required separating the movie and TV fetch logic, adding a media-type-aware search, and wiring season selection through every widget. It is documented here as an extra achievement because it substantially extended the application beyond the original scope.
 
### 3.4 Auto-Scroll to Dashboard on Selection
 
A small but high-impact UX feature: when the user picks a title from the search results dropdown, the page automatically smooth-scrolls down to the dashboard widgets using Lit's `updated(changedProperties)` lifecycle hook combined with `scrollIntoView({ behavior: "smooth", block: "start" })`. This was added in response to informal user testing where testers did not realise the widgets had appeared below the search section.
 
---
 
## 4. Who Was Responsible for What
 
| Component / File | Primary Responsibility |
|---|---|
| `dashboard-search.js` | **Lakshya Goyal** (logic, movie + TV fetching, season handling), **Mohamad Ehsan Qasemi** (CSS / styling) |
| `dashboard-information.js` | **Lakshya Goyal** |
| `dashboard-slider.js` | **Cooper Gallibu** (initial API fetch, core slider functionality, base design ~50%), **Mohamad Ehsan Qasemi** (responsive layout, indicator dots, CSS refinement ~50%) |
| `dashboard-overview.js` | **Cooper Gallibu** |
| `dashboard-castAndCrew.js` | **Min Khant Tun** |
| `dashboard-watch-providers.js` | **Mohamad Ehsan Qasemi** |
| `ad-widget.js` (advertisement integration) | **Mohamad Ehsan Qasemi** (integrated into the Watch Providers widget) |
| `dashboard-trailer.js` | **Min Khant Tun**, **Cooper Gallibu** |
| `dashboard-header.js` | **Min Khant Tun**, **Cooper Gallibu** |
| `dashboard-footer.js` | **Min Khant Tun**, **Cooper Gallibu** |
| Auto-scroll on selection (UX) | **Mohamad Ehsan Qasemi** |
| Overall CSS / visual design / layout consistency | **Mohamad Ehsan Qasemi** |
| Favicon | **Mohamad Ehsan Qasemi** |
| Error handling in API requests (`response.ok`, `throw new Error`, `.catch`) | **Lakshya Goyal** (added during code review) |
| GitHub branch merges and integration | **Mohamad Ehsan Qasemi**, **Lakshya Goyal** |
 
---
 
## Installation and Running Locally
 
The project has no external runtime dependencies — Lit is loaded directly from a CDN inside the HTML page. Node is used only to run a local development server.
 
## Installation

The project has no external dependencies, it uses Lit via a CDN load directly into
the HTML page.   Node is used only to run a local HTTP server.

```bash
npm install
```

Will install the `http-server` node module.

```bash
npm start
```

will run the server.