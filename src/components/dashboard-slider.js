import {
  TMDB_ACCESS_TOKEN,
  TMDB_BASE_URL
} from "../config.js";

import {
  LitElement,
  html,
  css,
} from "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js";

class DashboardSlider extends LitElement {
  static properties = {
    movies: { type: Array },
    currentIndex: { type: Number },
  };

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    /* Main Container */
    .slider-container {
      position: relative;
      background: #0d0d1a;
      padding: 40px 20px;
      min-height: 500px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    /* Inner Wrapper to handle Flex layout */
    .slider-content {
      display: flex;
      flex-direction: column-reverse; /* Poster on top for mobile */
      align-items: center;
      gap: 30px;
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
      z-index: 1;
    }

    /* Text Content Area */
    .info-section {
      text-align: center;
      width: 100%;
    }

    h3 {
      font-size: 0.75rem;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #f5c518;
      background: rgba(245, 197, 24, 0.12);
      display: inline-block;
      padding: 6px 16px;
      border-radius: 20px;
      margin-bottom: 20px;
    }

    h1 {
      font-size: 2rem;
      font-weight: 800;
      color: white;
      margin: 10px 0;
    }

    p {
      font-size: 0.95rem;
      color: #9a9aad;
      margin: 5px 0;
    }

    .rating {
      color: #f5c518;
      font-weight: 700;
    }

    .overview {
      margin-top: 16px;
      line-height: 1.6;
      color: #7a7a8e;
      display: -webkit-box;
      -webkit-line-clamp: 4; /* Limits text height on mobile */
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    /* Poster Image */
    .poster-img {
      width: 240px;
      height: auto;
      border-radius: 16px;
      box-shadow: 0 0 40px 10px rgba(100, 80, 200, 0.2);
      animation: fade 1.5s;
    }

    /* Navigation Buttons */
    .nav-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(255, 255, 255, 0.08);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 50%;
      width: 40px;
      height: 40px;
      cursor: pointer;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      transition: background 0.3s;
    }

    .nav-btn:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    #backward {
      left: 10px;
    }
    #forward {
      right: 10px;
    }

    /* Desktop Adjustments */
    @media (min-width: 768px) {
      .slider-container {
        padding: 60px 80px;
      }

      .slider-content {
        flex-direction: row; /* Side by side */
        text-align: left;
        justify-content: space-between;
      }

      .info-section {
        width: 55%;
      }

      h1 {
        font-size: 3.5rem;
      }

      .poster-img {
        width: 320px;
      }

      #backward {
        left: 20px;
      }
      #forward {
        right: 20px;
      }
    }

    @keyframes fade {
      from {
        opacity: 0.4;
      }
      to {
        opacity: 1;
      }
    }

    /* Navigation Dots */
    .dots-container {
      position: absolute;
      bottom: 20px;
      display: flex;
      gap: 5px;
    }

    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      cursor: pointer;
      transition: background-color 0.3s;
      border: 2px solid white;
    }

    .dot.active {
      background-color: #3e7e9d;
      transform: scale(1.2);
    }

    /* Update the Desktop Adjustments section to position dots correctly */
    @media (min-width: 768px) {
      .dots-container {
        bottom: 30px;
      }
    }
  `;

  constructor() {
    super();
    this.movies = [];
    this.currentIndex = 0;
  }

  connectedCallback() {
    super.connectedCallback();
    fetch(`${TMDB_BASE_URL}/trending/movie/day?language=en-US`, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Trending this week failed with status ${response.status}`);
        }

        return response.json();
      })
      .then((data) => {
        this.movies = data.results;
      })
      .catch((error) => {
        console.error("Trending this week error:", error);
      });
    this.timer = setInterval(() => this.handleForward(), 5000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this.timer);
  }

  handleBackward() {
    this.currentIndex =
      this.currentIndex > 0 ? this.currentIndex - 1 : this.movies.length - 1;
  }

  handleForward() {
    this.currentIndex =
      this.currentIndex < this.movies.length - 1 ? this.currentIndex + 1 : 0;
  }

  handleDotClick(index) {
    this.currentIndex = index;
  }

  render() {
    const movie = this.movies[this.currentIndex];

    if (!movie)
      return html`<p style="color: white; padding: 20px;">Loading...</p>`;

    return html`
      <div class="slider-container">
        <button id="backward" class="nav-btn" @click=${this.handleBackward}>
          ‹
        </button>

        <div class="slider-content">
          <div class="info-section">
            <h3>🔥 TRENDING THIS WEEK</h3>
            <h1>${movie.title}</h1>
            <p class="rating">⭐ ${movie.vote_average.toFixed(1)}</p>
            <p>${movie.release_date}</p>
            <p>${movie.vote_count} votes</p>
            <p class="overview">${movie.overview}</p>
          </div>

          <img
            class="poster-img"
            src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
            alt="${movie.title}"
            title="${movie.title}"
          />
        </div>

        <button id="forward" class="nav-btn" @click=${this.handleForward}>
          ›
        </button>
        <!-- Navigation Dots -->
        <div class="dots-container">
          ${this.movies.map(
            (_, index) => html`
              <span
                class="dot ${index === this.currentIndex ? "active" : ""}"
                @click=${() => this.handleDotClick(index)}
                aria-label="Slide ${index + 1}"
              ></span>
            `,
          )}
        </div>
      </div>
    `;
  }
}

customElements.define("dashboard-slider", DashboardSlider);
