import { TMDB_ACCESS_TOKEN, TMDB_BASE_URL } from "../config.js";

import {
  LitElement,
  html,
  css,
} from "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js";

import "./dashboard-information.js";

import "./dashboard-overview.js";

import "./dashboard-watch-providers.js";

import "./dashboard-castAndCrew.js";

import "./dashboard-trailer.js";

import "./ad-widget.js";

class DashboardSearch extends LitElement {
  static properties = {
    searchQuery: { type: String },

    mediaType: { type: String },

    searchResults: { type: Array },

    selectedMedia: { type: Object },

    availableSeasons: { type: Array },

    selectedResultId: { type: String },

    lastSearchQuery: { type: String },

    errorMessage: { type: String },

    _originalTVData: { type: Object },

    totalResults: { type: Number },

    currentPage: { type: Number },

    totalPages: { type: Number },

    isLoading: { type: Boolean },
  };

  constructor() {
    super();

    this.searchQuery = "";

    this.mediaType = "movie";

    this.searchResults = [];

    this.selectedMedia = null;

    this.availableSeasons = [];

    this._originalTVData = null;

    this.selectedResultId = "";

    this.lastSearchQuery = "";

    this.errorMessage = "";

    this.totalResults = 0;

    this.currentPage = 1;

    this.totalPages = 0;

    this.isLoading = false;
  }

  updated(changedProperties) {
    // Scroll to dashboard-information when a movie/series is selected
    if (changedProperties.has("selectedMedia") && this.selectedMedia) {
      setTimeout(() => {
        const dashboardInfo = this.shadowRoot?.querySelector(
          "dashboard-information",
        );
        if (dashboardInfo) {
          dashboardInfo.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 0);
    }
  }

  static styles = css`
    :host {
      display: grid;

      grid-template-columns: 1fr;

      gap: 20px;

      padding: 24px;

      background-color: #060913;

      font-family: "Inter", sans-serif;

      color: #ffffff;

      box-sizing: border-box;
    }

    h1 {
      grid-column: 1 / -1;
      text-align: center;
      margin: 0;
    }

    @media (min-width: 768px) {
      :host {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (min-width: 1280px) {
      :host {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    /* --- Search Bar Container Styles from Image --- */

    .search-form {
      grid-column: 1 / -1;

      display: grid;

      grid-template-columns: auto 1fr;

      grid-template-rows: auto auto auto;

      gap: 15px 25px;

      background-color: #101727;

      padding: 35px;

      border-radius: 15px;
    }

    .search-label {
      font-weight: 700;

      color: #ffffff;
    }

    .search-input {
      background-color: #e8f0fe;

      border: none;

      border-radius: 12px;

      padding: 15px 20px;

      color: #000000;

      width: 100%;

      box-sizing: border-box;
    }

    .search-button {
      background-color: #2563eb;

      color: white;

      border: none;

      border-radius: 12px;

      padding: 12px 0;

      font-weight: 700;

      cursor: pointer;

      width: 160px;
    }

    .media-type-select,
    .movie-list,
    .season-select {
      background-color: #0b0f19;

      border: 1px solid #2563eb;

      border-radius: 12px;

      padding: 15px;

      color: white;

      width: 100%;

      cursor: pointer;

      appearance: none;

      background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");

      background-repeat: no-repeat;

      background-position: right 15px top 50%;

      background-size: 12px auto;
    }

    .movie-list.has-results {
      border-color: #22c55e;
      box-shadow: 0 0 0 1px #22c55e;
    }

    .results-count {
      grid-column: 1 / -1;
      font-size: 0.85rem;
      color: #22c55e;
      font-weight: 600;
      margin: -5px 0;
    }

    .error-message {
      grid-column: 1 / -1;
      color: #ef4444;
      font-weight: 600;
      margin: 0;
    }

    .ad-widget-wrapper {
      grid-column: 1 / -1;
      display: flex;
      justify-content: center;
    }

    .dashboard-card {
      height: 600px;
      box-sizing: border-box;
      align-self: start;
    }

    .load-more-button {
      grid-column: 1 / -1;
      background-color: transparent;
      color: #2563eb;
      border: 1px solid #2563eb;
      border-radius: 12px;
      padding: 12px 0;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
    }
    .load-more-button:hover {
      background-color: #2563eb;
      color: white;
    }

    .no-results {
      grid-column: 1 / -1;
      font-size: 0.85rem;
      color: #f59e0b;
      font-weight: 600;
      margin: -5px 0;
    }

    .load-more-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `;

  // Handles switching between Movie and TV Series.
  // Updates the media type and resets the old search data so the dashboard starts fresh.

  handleMediaTypeChange = (event) => {
    this.mediaType = event.target.value;
    this.searchResults = [];
    this.selectedMedia = null;
    this.searchQuery = "";
    this.totalResults = 0;
    this.currentPage = 1;
    this.totalPages = 0;
    this.lastSearchQuery = "";
    this.errorMessage = "";
    this.selectedResultId = ""; 
    this.availableSeasons = []; 
    this._originalTVData = null; 
  };

  // Handles the search form submission.
  // Clears the previous selected result and search results, sends a request to TMDB,
  // checks for API errors, then stores the new results or logs an error if the search fails.
  handleSubmit = (event) => {
    event.preventDefault();

    this.totalResults = 0;
    this.currentPage = 1;
    this.totalPages = 0;

    if (this.searchQuery.trim() === "") {
      this.errorMessage = "Please enter a search term.";
      return;
    }

    this.errorMessage = "";
    this.selectedMedia = null;
    this.selectedResultId = "";
    this.searchResults = [];
    this.lastSearchQuery = this.searchQuery;

    this.fetchSearchPage(1);
  };

  fetchSearchPage = (page) => {
    if (this.isLoading) return;
    this.isLoading = true;
    fetch(
      `${TMDB_BASE_URL}/search/${this.mediaType}?query=${this.searchQuery}&language=en-US&page=${page}`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
        },
      },
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Search failed with status ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const newResults = data.results || [];
        if (page === 1) {
          this.searchResults = newResults;
        } else {
          this.searchResults = [...this.searchResults, ...newResults];
        }
        this.currentPage = data.page;
        this.totalPages = data.total_pages || 0;
        this.totalResults = data.total_results || 0;
      })
      .catch((error) => {
        console.error("Search failed:", error);
      })
      .finally(() => {
        this.isLoading = false;
      });
  };

  handleLoadMore = () => {
    if (this.currentPage < this.totalPages) {
      this.fetchSearchPage(this.currentPage + 1);
    }
  };

  // Handles when the user selects a movie or TV show from the results dropdown.
  // Saves the selected ID, stops if no real result was selected,
  // then fetches the full details for either a TV show or movie.
  handleDropdown = (event) => {
    const itemID = event.target.value;

    this.selectedResultId = itemID;

    if (!itemID) return;

    this.selectedMedia = null;

    if (this.mediaType === "tv") {
      this.fetchTVDetails(itemID);
    } else {
      this.fetchMovieDetails(itemID);
    }
  };

  // Fetches full details for the selected movie using its TMDB movie ID.
  // Checks if the API response is valid, converts the response to JSON,
  // stores the movie data in selectedMedia, then fetches extra keyword data.
  // If the request fails, the error is logged in the console.

  fetchMovieDetails = (movieId) => {
    fetch(
      `${TMDB_BASE_URL}/movie/${movieId}?language=en-US&append_to_response=credits,videos`,

      {
        headers: {
          accept: "application/json",

          Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
        },
      },
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Movie details failed with status ${response.status}`,
          );
        }

        return response.json();
      })

      .then((data) => {
        this.availableSeasons = [];

        this.selectedMedia = {
          ...data,

          mediaType: "movie",

          director: this.getDirector(data.credits),

          trailerUrl: this.getTrailer(data.videos),
        };

        this.fetchKeyword(movieId);
      })
      .catch((error) => {
        console.error("Movie details error:", error);
      });
  };

  // Fetches full details for the selected TV show using its TMDB TV ID.
  // TV data uses different field names from movie data, so this function
  // formats the TV response to match the dashboard structure.
  // It collects the show creators as the director value, gets the episode runtime,
  // stores available seasons for the season dropdown, adds fallback values for
  // budget/revenue because TV shows do not provide them, then fetches keywords.
  // Check if the TV details request failed, and send the error to catch().

  fetchTVDetails = (tvId) => {
    fetch(
      `${TMDB_BASE_URL}/tv/${tvId}?language=en-US&append_to_response=credits,videos`,

      {
        headers: {
          accept: "application/json",

          Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
        },
      },
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`TV details failed with status ${response.status}`);
        }

        return response.json();
      })

      .then((data) => {
        let director = "N/A";

        if (data.created_by && data.created_by.length > 0) {
          const names = [];

          for (const persons of data.created_by) {
            names.push(persons.name);
          }

          director = names.join(", ");
        }

        let runtime = "Information not provided";

        if (data.episode_run_time && data.episode_run_time.length > 0) {
          runtime = data.episode_run_time[0];
        }

        this.availableSeasons = data.seasons || [];

        this.selectedMedia = {
          ...data,

          mediaType: "tv",

          title: data.name,

          release_date: data.first_air_date,

          runtime: runtime,

          director: director,

          budget: "Information not provided",

          revenue: "Information not provided",

          profit: "Cannot be calculated",

          trailerUrl: this.getTrailer(data.videos),
        };

        this.fetchKeyword(tvId);
      })
      .catch((error) => {
        console.error("TV details error:", error);
      });
  };

  // Handles when the user selects a TV season from the season dropdown.
  // If "Default" is selected, it restores the original TV show data.
  // Otherwise, it fetches the selected season's details from TMDB,
  // checks for API errors, then updates the dashboard with season-specific data.
  handleSeasonChange = (event) => {
    const seasonNumber = event.target.value;

    if (seasonNumber === "default") {
      if (this._originalTVData) {
        this.selectedMedia = { ...this._originalTVData };
      }
      return;
    }

    const tvId = this.selectedMedia.id;

    fetch(
      `${TMDB_BASE_URL}/tv/${tvId}/season/${seasonNumber}?language=en-US&append_to_response=videos`,
      {
        headers: {
          accept: "application/json",

          Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
        },
      },
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Season details failed with status ${response.status}`,
          );
        }

        return response.json();
      })

      .then((seasonData) => {
        // Override with season-specific data

        this.selectedMedia = {
          ...this.selectedMedia,

          overview: seasonData.overview,

          poster_path: seasonData.poster_path,

          release_date: seasonData.air_date,

          trailerUrl: this.getTrailer(seasonData.videos),
        };
      })
      .catch((error) => {
        console.error("Season details error:", error);
      });
  };

  // Fetches keyword data for the selected movie or TV show.
  // TMDB uses different keyword response names for movies and TV shows,
  // so this function checks the media type, extracts the correct keyword array,
  // stores it inside selectedMedia, then fetches the cast and crew credits.

  fetchKeyword = (itemId) => {
    const endpoint = this.mediaType === "tv" ? "tv" : "movie";

    fetch(`${TMDB_BASE_URL}/${endpoint}/${itemId}/keywords`, {
      headers: {
        accept: "application/json",

        Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Keyword request failed with status ${response.status}`,
          );
        }

        return response.json();
      })

      .then((data) => {
        // TV returns { results: [...] }, Movie returns { keywords: [...] }

        let keywords = [];

        if (this.mediaType === "tv") {
          keywords = data.results;
        } else {
          keywords = data.keywords;
        }

        this.selectedMedia = {
          ...this.selectedMedia,

          keywords: keywords,
        };

        this.fetchCredits(itemId);
      })
      .catch((error) => {
        console.error("Keyword error:", error);
      });
  };

  // Fetches cast and crew credits for the selected movie or TV show.
  // Uses the current media type to choose the correct TMDB endpoint,
  // checks for API errors, stores cast and filtered crew data in selectedMedia,
  // then fetches the watch provider information.

  fetchCredits = (movieId) => {
    const endpoint = this.mediaType === "tv" ? "tv" : "movie";

    fetch(`${TMDB_BASE_URL}/${endpoint}/${movieId}/credits?language=en-US`, {
      headers: {
        accept: "application/json",

        Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Credits request failed with status ${response.status}`,
          );
        }

        return response.json();
      })

      .then((credits) => {
        this.selectedMedia = {
          ...this.selectedMedia,

          cast: credits.cast || [],

          crew: (credits.crew || []).filter((m) => m.name && m.job),
        };

        this.fetchWatchProviders(movieId);
      })
      .catch((error) => {
        console.error("Credits error:", error);
      });
  };

  // Fetches watch provider data for the selected movie or TV show.
  // Uses the current media type to choose the correct TMDB endpoint,
  // checks for API errors, then stores the Australian streaming providers
  // inside selectedMedia so the watch providers component can display them.

  fetchWatchProviders = (movieId) => {
    const endpoint = this.mediaType === "tv" ? "tv" : "movie";

    fetch(`${TMDB_BASE_URL}/${endpoint}/${movieId}/watch/providers`, {
      headers: {
        accept: "application/json",

        Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Watch providers request failed with status ${response.status}`,
          );
        }

        return response.json();
      })

      .then((data) => {
        this.selectedMedia = {
          ...this.selectedMedia,

          watchProviders: data.results?.AU?.flatrate || [],
        };

        if (this.mediaType === "tv") {
          this._originalTVData = { ...this.selectedMedia };
        }
      })
      .catch((error) => {
        console.error("Watch providers error:", error);
      });
  };

  // Looks through the already-fetched credits data and returns the movie director's name.
  // This does not make a new API request; it only searches the crew array from data.credits.
  getDirector(credits) {
    const director = credits?.crew?.find((person) => person.job === "Director");

    return director ? director.name : "N/A";
  }

  // Looks through the already-fetched videos data and returns the YouTube trailer key.
  // This does not make a new API request; it only searches the videos array from data.videos.
  getTrailer(videos) {
    const trailer = videos?.results?.find(
      (video) => video.type === "Trailer" && video.site === "YouTube",
    );

    return trailer?.key || null;
  }

  render() {
    return html`
      <h1>Discover Movies & Series</h1>

      <form class="search-form" @submit=${this.handleSubmit}>
        <label class="search-label" for="media-type">Search Type</label>

        <select
          class="media-type-select"
          id="media-type"
          @change=${this.handleMediaTypeChange}
        >
          <option value="movie" ?selected=${this.mediaType === "movie"}>
            Movie
          </option>

          <option value="tv" ?selected=${this.mediaType === "tv"}>
            TV Series
          </option>
        </select>

        <label class="search-label" for="search"
          >Search ${this.mediaType === "tv" ? "TV Series" : "Movie"}</label
        >

        <input
          class="search-input"
          type="text"
          id="search"
          name="query"
          .value=${this.searchQuery}
          @input=${(event) => (this.searchQuery = event.target.value)}
        />

        <button class="search-button" type="submit">
          Search ${this.mediaType === "tv" ? "TV Series" : "Movie"}
        </button>

        <select
          class="movie-list ${this.searchResults.length > 0
            ? "has-results"
            : ""}"
          id="movie-select"
          .value=${this.selectedResultId}
          @change=${this.handleDropdown}
        >
          <option value="">
            ${this.searchResults.length > 0
              ? `Select from ${this.totalResults} results for "${this.lastSearchQuery}"`
              : this.lastSearchQuery && !this.isLoading
                ? `No matches for "${this.lastSearchQuery}"`
                : `Select a ${this.mediaType === "tv" ? "TV series" : "movie"}`}
          </option>
          ${this.searchResults.map(
            (movie) =>
              html`<option value=${movie.id}>
                ${movie.original_title || movie.name} :
                ${movie.release_date || movie.first_air_date || "Unknown"}
              </option>`,
          )}
        </select>

        ${this.searchResults.length > 0
          ? html`<span class="results-count"
              >${this.totalResults} results found for "${this.lastSearchQuery}"
              — showing ${this.searchResults.length}, select one above</span
            >`
          : this.isLoading
            ? html`<span class="results-count"
                >Searching for "${this.lastSearchQuery}"...</span
              >`
            : this.lastSearchQuery
              ? html`<span class="no-results"
                  >No results found for "${this.lastSearchQuery}". Try a
                  different search.</span
                >`
              : ""}
        ${this.searchResults.length > 0 && this.currentPage < this.totalPages
          ? html`<button
              type="button"
              class="load-more-button"
              ?disabled=${this.isLoading}
              @click=${this.handleLoadMore}
            >
              ${this.isLoading
                ? "Loading..."
                : `Load 20 more (${this.searchResults.length} of ${this.totalResults})`}
            </button>`
          : ""}
        ${this.mediaType === "tv" &&
        this.selectedMedia &&
        this.availableSeasons.length > 0
          ? html`
              <label class="search-label" for="season-select"
                >Select Season</label
              >

              <select
                class="season-select"
                id="season-select"
                @change=${this.handleSeasonChange}
              >
                <option value="default">
                  ${this.selectedMedia.title + " - Default"}
                </option>

                ${this.availableSeasons.map(
                  (season) => html`
                    <option value=${season.season_number}>
                      ${season.name}
                    </option>
                  `,
                )}
              </select>
            `
          : ""}
        ${this.errorMessage
          ? html`<p class="error-message">${this.errorMessage}</p>`
          : ""}
      </form>

      ${!this.selectedMedia
        ? html`
            <div class="ad-widget-wrapper">
              <ad-widget></ad-widget>
            </div>
          `
        : ""}
      ${this.selectedMedia
        ? html`
            <dashboard-information
              class="dashboard-card"
              .title=${this.selectedMedia.title}
              .releaseYear=${this.selectedMedia.release_date?.split("-")[0]}
              .runtime=${this.selectedMedia.runtime}
              .rating=${this.selectedMedia.vote_average}
              .director=${this.selectedMedia.director || "N/A"}
              .budget=${this.selectedMedia.budget}
              .revenue=${this.selectedMedia.revenue}
              .profit=${typeof this.selectedMedia.revenue === "number" &&
              typeof this.selectedMedia.budget === "number"
                ? this.selectedMedia.revenue - this.selectedMedia.budget
                : "Cannot be calculated"}
              .posterUrl=${"https://image.tmdb.org/t/p/w500" +
              this.selectedMedia.poster_path}
              .trailerUrl=${this.selectedMedia.trailerUrl}
            ></dashboard-information>
          `
        : ""}
      ${this.selectedMedia
        ? html`
            <dashboard-overview
              class="dashboard-card"
              .information=${this.selectedMedia.overview}
              .genres=${this.selectedMedia.genres}
              .keywords=${this.selectedMedia?.keywords}
            ></dashboard-overview>
          `
        : ""}
      ${this.selectedMedia
        ? html`
            <dashboard-cast-crew
              class="dashboard-card"
              .cast=${this.selectedMedia?.cast ?? []}
              .crew=${this.selectedMedia?.crew ?? []}
            ></dashboard-cast-crew>
          `
        : ""}
      ${this.selectedMedia
        ? html`
            <dashboard-watch-providers
              class="dashboard-card"
              .providers=${this.selectedMedia?.watchProviders || []}
              .spoken_languages=${this.selectedMedia.spoken_languages}
              .production_countries=${this.selectedMedia.production_countries}
              .production_companies=${this.selectedMedia.production_companies}
            ></dashboard-watch-providers>
          `
        : ""}
      ${this.selectedMedia
        ? html`
            <dashboard-trailer
              .trailerUrl=${this.selectedMedia.trailerUrl}
            ></dashboard-trailer>
          `
        : ""}
    `;
  }
}

customElements.define("dashboard-search", DashboardSearch);
