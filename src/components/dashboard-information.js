import {
  LitElement,
  html,
  css,
} from "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js";

class dashboardInformation extends LitElement {
  static properties = {
    title: { type: String },
    releaseYear: { type: String },
    rating: { type: Number },
    director: { type: String },
    budget: { type: Number },
    revenue: { type: Number },
    profit: { type: Number },
    posterUrl: { type: String },
  };

  static styles = css`
    :host {
      display: block;
      background: #101727;
      font-family: "Inter", sans-serif;
      border-radius: 10px;
      padding: 24px;
      height: 600px;
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: #1d2a3a transparent;
    }

    img {
      width: 50%;
      border-radius: 8px;
      display: block;
      margin: 0 auto 16px;
    }

    .no-poster {
      padding: 40px;
      text-align: center;
      background: #151a28;
      border-radius: 8px;
      margin-bottom: 16px;
    }

    .info {
      padding: 10px 0;
      border-bottom: 1px solid #1c2133;
      font-size: 0.9rem;
    }

    .label {
      color: #6b7280;
    }

    .value {
      color: #e0e3ea;
      font-weight: 600;
    }

    .money .value {
      color: #5eead4;
    }

    

   
  `;

  constructor() {
    super();
    this.title = "";
    this.releaseYear = "";
    this.runtime = 0;
    this.rating = 0;
    this.director = "";
    this.budget = 0;
    this.revenue = 0;
    this.profit = 0;
    this.posterUrl = "";

  }

  formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  render() {
    return html`
      <h2>General Information</h2>

      ${this.posterUrl
        ? html`<img src="${this.posterUrl}" alt="${this.title}" title="${this.title}" />`
        : html`<div class="no-poster">No poster available</div>`}

      <div class="info">
        <span class="label">Title:</span>
        <span class="value">${this.title}</span>
      </div>
      <div class="info">
        <span class="label">Release Year:</span>
        <span class="value">${this.releaseYear}</span>
      </div>
      <div class="info">
        <span class="label">Runtime:</span>
        <span class="value"
          >${typeof this.runtime === "number"
            ? this.runtime + " min"
            : this.runtime}</span
        >
      </div>
      <div class="info">
        <span class="label">TMDB Rating:</span>
        <span class="value">${this.rating}/10</span>
      </div>
      <div class="info">
        <span class="label">Director:</span>
        <span class="value">${this.director}</span>
      </div>
      <div class="info money">
        <span class="label">Budget:</span>
        <span class="value"
          >${typeof this.budget === "number"
            ? this.formatCurrency(this.budget)
            : this.budget}</span
        >
      </div>
      <div class="info money">
        <span class="label">Revenue:</span>
        <span class="value"
          >${typeof this.revenue === "number"
            ? this.formatCurrency(this.revenue)
            : this.revenue}</span
        >
      </div>

      <!-- if the profit is 0 show "cannot be calculated" otherwise show the profit. -->

        <div class="info money">
          <span class="label">Profit:</span>
          <span class="value"
            >${typeof this.profit === "number"
              ? this.formatCurrency(this.profit)
              : this.profit}</span
          >
        </div>

        
   
    `;
  }
}

// ← ADD THIS LINE
customElements.define("dashboard-information", dashboardInformation);
