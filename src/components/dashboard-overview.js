import {
  LitElement,
  html,
  css,
} from "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js";

class dashboardOverview extends LitElement {
  static properties = {
    information: { type: String },
    genres: { type: Array },
    keywords: { type: Array },
    providers: { type: Array },
    studios: { type: Array },
  };

  static styles = css`
    :host {
      display: block;
      background: #101727;
      font-family: "Inter", sans-serif;
      border-radius: 10px;
      padding: 24px;
      padding-bottom: 0;
      box-sizing: border-box;
      height: 600px;
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: #1d2a3a transparent;
    }

    .information-text {
      color: #a0a8b5;
    }

    .tag-group {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .tag {
      background: #1d2a3a;
      padding: 8px 12px;
      border-radius: 8px;
      color: #ecedf0;
      font-size: 14px;
    }
  `;

  constructor() {
    super();
    this.information = "";
    this.genres = [];
    this.keywords = [];
  }

  render() {
    return html`
      <h2>Overview</h2>

      <p class="information-text">
        ${this.information || "No information available."}
      </p>

      <h3>Genres</h3>
      <div class="tag-group">
        ${this.genres.length
          ? this.genres.map((g) => html`<span class="tag">${g.name}</span>`)
          : html`<span class="tag">No genres provided.</span>`}
      </div>

      <h3>Keywords and Themes</h3>
      <div class="tag-group">
        ${this.keywords.length
          ? this.keywords.map((k) => html`<span class="tag">${k.name}</span>`)
          : html`<span class="tag">No keywords provided.</span>`}
      </div>
    `;
  }
}

customElements.define("dashboard-overview", dashboardOverview);
