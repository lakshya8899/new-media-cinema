# COMP2110 Portal - Starter

# New Media Cinema
 
**Deployment URL:** _[https://lakshya8899.github.io/new-media-cinema/]_
 
New Media Cinema is a single-page front-end movie and TV series discovery dashboard built with **Lit Web Components** and the **TMDB (The Movie Database) API**. Instead of presenting hard-coded content, the website pulls live data from TMDB so users can browse current trending films, search for any movie or TV series, drill into a specific TV season, view detailed metadata across four dashboard widgets, and watch the official trailer all from one page.
 
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


- **Search (`dashboard-search.js`)** — A media-type dropdown lets the user pick **Movie** or **TV Series**, which controls whether the search bar hits the `/search/movie` or `/search/tv` endpoint. TMDB returns paginated results (20 per page), so the search component reads the `total_results`, `total_pages`, and `page` fields from the response to display the real match count and drive a "Load More" button. Each Load More click calls the same endpoint with `&page=N`, appending the next 20 results to the dropdown until `currentPage` reaches `totalPages` and the button hides itself. An `isLoading` flag guards against duplicate fetches from rapid clicks.


- **Detail fetching** - Once a title is selected, the search component calls `fetchMovieDetails` or `fetchTVDetails`, which kicks off a chain of individual fetch calls. First it requests the core details (with an initial credits and videos payload via `append_to_response`, used immediately to extract the director and trailer), then separately fetches the full keyword list via `fetchKeyword`, the complete cast and crew via `fetchCredits`, and finally watch providers via `fetchWatchProviders`. Each fetch updates `selectedMedia` with its own piece of data before triggering the next one in the chain, and the merged result is passed down to the dashboard widgets as properties.


- **Season support** - If the selected title is a TV series with seasons, a second dropdown appears. When a season is picked, `handleSeasonChange` calls `/tv/{id}/season/{number}` and updates the selected media with season-specific data. All four widgets re-render as a result: `dashboard-information`, `dashboard-overview`, `dashboard-cast-crew`, and `dashboard-watch-providers`. Selecting "Default" restores the original show-level data from `_originalTVData`.



- **Trailer (`dashboard-trailer.js`)** — A full-width section below the four dashboard widgets that reads the `videos` field returned by TMDB, uses `getTrailer` to find the first video where `type === "Trailer"` and `site === "YouTube"`, and embeds it directly in the page through a YouTube `<iframe>` with a responsive 16:9 aspect ratio. The trailer reacts to every selection change — it shows the movie trailer for a movie, the series trailer for a default TV view, and switches to the season-specific trailer when a season is picked (since `handleSeasonChange` re-runs `getTrailer` on the season's own `videos` payload). When TMDB returns no matching trailer, `getTrailer` resolves to `null` and the component renders a clear "Trailer does not exist" fallback instead of breaking the layout.

  
- **Error and missing-data handling** — All API requests use `fetch` with `response.ok` checks, `throw new Error` on failure, and `.catch()` handlers so that a broken request never silently corrupts the dashboard. Widgets also use fallback strings such as "Information not provided" and "Cannot be calculated" when TMDB returns missing or null fields (common for TV budgets, runtimes, or older titles).
---
 
## 2. What Our Group Has Achieved
 
We built a fully working, interactive movie and TV discovery dashboard. The finished application includes:
 
- **A header, footer and favicon** giving the site a consistent brand identity.
- **A trending movies slider** at the top of the page that auto-rotates and can also be navigated manually using arrow controls and indicator dots.
- **A dual-mode search system** where the user first chooses whether they are searching for a Movie or a TV Series. The search form, button label and result dropdown all adapt to that choice, and the application calls the correct TMDB endpoint based on the selection.

- **A result-count message and selection dropdown** that displays the *true* total of matches (e.g. "337 results found for 'cars' — showing 20") and lets the user pick the exact title they meant (sequels, remakes, etc.).
- **A "Load More" button** that fetches the next page of TMDB results and appends them to the dropdown, with a "Loading..." state, disabled-while-fetching styling to prevent duplicate clicks, and automatic removal once all results are loaded.
- **Clear loading and empty-state feedback** — a "Searching for…" indicator appears while a fetch is in progress, and an amber "No results found" message appears when a search returns zero matches.

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
 
After the four dashboard widgets, the page includes a full-width trailer section (`dashboard-trailer.js`). When the user selects a movie, a TV series, or a specific season, the application reads the `videos` data returned by TMDB, and `getTrailer` filters for a video where `type === "Trailer"` and `site === "YouTube"`, then embeds it directly into the page using a YouTube `<iframe>` with the src set to `https://www.youtube.com/embed/${this.trailerUrl}`. The user does not have to leave the site to watch the trailer.
 
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
| `dashboard-search.js` | **Lakshya Goyal** (logic, movie + TV fetching, season handling, paginated Load More with `isLoading` guard, empty-state and loading feedback), **Mohamad Ehsan Qasemi** (CSS / styling and responsive design) |
| `dashboard-information.js` | **Lakshya Goyal** |
| `dashboard-slider.js` | **Lakshya Goyal** (initial API fetch, core slider functionality, base design ~50%), **Mohamad Ehsan Qasemi** (responsive layout, indicator dots, CSS refinement ~50%) |
| `dashboard-overview.js` | **Cooper Gallibu** |
| `dashboard-castAndCrew.js` | **Min Khant Tun** |
| `dashboard-watch-providers.js` | **Mohamad Ehsan Qasemi** |
| `ad-widget.js` (advertisement integration) | **Mohamad Ehsan Qasemi** Adapted it to the website's UX and UI |
| `dashboard-trailer.js` | **Min Khant Tun**, **Cooper Gallibu** |
| `dashboard-header.js` | **Min Khant Tun**, **Cooper Gallibu** |
| `dashboard-footer.js` | **Min Khant Tun**, **Cooper Gallibu** |
| Auto-scroll on selection (UX) | **Mohamad Ehsan Qasemi** |
| Overall CSS / visual design / layout consistency and responsiveness | **Mohamad Ehsan Qasemi** |
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
