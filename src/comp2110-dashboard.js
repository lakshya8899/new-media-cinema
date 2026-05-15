import {
  LitElement,
  html,
  css,
} from "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js";
// import './components/widget-block.js';
// import './components/widget-column.js';
import "./components/dashboard-header.js";
import "./components/dashboard-slider.js";
import "./components/dashboard-search.js";
import "./components/dashboard-footer.js";
import "./components/ad-widget.js";

class Comp2110Dashboard extends LitElement {
  static properties = {};

  constructor() {
    super();
  }

  static styles = css`
    :host {
      display: block;
      font-family: Arial, sans-serif;
      background-color: #f0f0f0;
      color: #333;
    }
    .ad-container {
      display: flex;
      justify-content: center;
      margin: 20px 0; 
    }
  `;

  render() {
    return html`
      <dashboard-header
        title="new media cinema."
        logo="./assets/new-media-cinema.svg"
      ></dashboard-header>

      <dashboard-slider></dashboard-slider>

      <dashboard-search></dashboard-search>
      

      <dashboard-footer company="New Media Cinema"></dashboard-footer>
    `;
  }
}

customElements.define("comp2110-dashboard", Comp2110Dashboard);
