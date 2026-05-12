import {
  LitElement,
  html,
  css,
} from "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js";

class DashboardTrailer extends LitElement {
  static properties = {
    trailerUrl: { type: String, attribute: "trailer-url" },
  };

  constructor() {
    super();
    this.trailerUrl = null;
  }

  static styles = css`
    :host {
      grid-column: 1 / -1;
      display: block;
      margin-bottom: 40px;
      font-family: "Inter", sans-serif;
      box-sizing: border-box;
    }

    .trailer-card {
      width: 100%;
      background-color: #0b0f19;
      border-radius: 16px;
      padding: 24px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .trailer-heading {
      margin: 0 0 20px;
      color: #ffffff;
    }

    .trailer-container {
      width: 100%;
      max-width: 900px;
      aspect-ratio: 16 / 9;
      border-radius: 12px;
      overflow: hidden;
    }

    .trailer-container iframe {
      width: 100%;
      height: 100%;
      border: none;
    }

    .no-trailer {
      width: fit-content;
      margin: 0 auto;
      padding: 14px 22px;
      background-color: #060913;
      border: 1px solid #1f2937;
      border-radius: 12px;
      color: #ef4444;
      font-size: 0.95rem;
      font-weight: 700;
      text-align: center;
      box-sizing: border-box;
    }
  `;

  render() {
    if (!this.trailerUrl) {
      return html` <div class="no-trailer">Trailer does not exist</div> `;
    }

    return html`
      <section class="trailer-card">
        <h2 class="trailer-heading">Watch The Trailer Below Right Now</h2>

        <div class="trailer-container">
          <iframe
            .src=${`https://www.youtube.com/embed/${this.trailerUrl}`}
            
            allowfullscreen
          ></iframe>
        </div>
      </section>
    `;
  }
}

customElements.define("dashboard-trailer", DashboardTrailer);
