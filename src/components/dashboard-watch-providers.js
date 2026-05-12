import {
  LitElement,
  html,
  css,
} from "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js";
import "./ad-widget.js";

class DashboardWatchProviders extends LitElement {
  static properties = {
    providers: { type: Array },
    spoken_languages: { type: Array },
    production_countries: { type: Array },
    production_companies: { type: Array },
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

    div {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    span {
      background: #1d2a3a;
      padding: 8px 12px;
      border-radius: 8px;
      color: #ecedf0;
      font-size: 14px;
    }
    p {
      color: #a0a8b5;
    }
  `;

  constructor() {
    super();
    this.providers = [];
    this.spoken_languages = [];
    this.production_countries = [];
    this.production_companies = [];
  }

  render() {
    return html`
      <h2>Watch Providers</h2>

      <div>
        ${this.providers && this.providers.length > 0
          ? this.providers.map(
              (provider) => html`<span>${provider.provider_name}</span>`,
            )
          : html`<span>N/A</span>`}
      </div>

      <p>
        Spoken Languages:
        ${this.spoken_languages && this.spoken_languages.length > 0
          ? this.spoken_languages.map((lang) => lang.name).join(", ")
          : "N/A"}
      </p>
      <p>
        Production Countries:
        ${this.production_countries && this.production_countries.length > 0
          ? this.production_countries.map((country) => country.name).join(", ")
          : "N/A"}
      </p>
      <p>
        Production Companies:
        ${this.production_companies && this.production_companies.length > 0
          ? this.production_companies.map((company) => company.name).join(", ")
          : "N/A"}
      </p>
      <ad-widget></ad-widget>
    `;
  }
}


customElements.define("dashboard-watch-providers", DashboardWatchProviders);
