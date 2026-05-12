import {
  LitElement,
  html,
  css,
} from "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js";


class DashboardFooter extends LitElement {
  constructor() {
    super();
    this.year = new Date().getFullYear();
  }

  static properties = {
    company: { type: String },
    year: { type: Number },
  };

  static styles = css`
    :host {
      font-family: 'Inter', sans-serif;
    }
    footer {
      background-color: #0c0e22;
      padding: 20px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      bottom: 0;
      color: white;
    }
  `;

  render() {
    return html`
      <footer>
        <p>&copy; ${this.year} ${this.company}. All rights reserved.</p>
      </footer>
    `;
  }
}
customElements.define("dashboard-footer", DashboardFooter);
