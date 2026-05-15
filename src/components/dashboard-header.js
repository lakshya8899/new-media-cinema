import {
  LitElement,
  html,
  css,
} from "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js";

class Dashboard_Header extends LitElement {
  static properties = {
    logo: { type: String },
  };

  static styles = css`
    header {
      background: #0C0E22;
    }


    img {
        width: auto;
      height: 50px;
      
    }
  `;

  render() {
    return html` 
    <header>
      <img src=${this.logo} alt="company logo" title="New Media Cinema"/>
    </header>`;
  }
}

customElements.define("dashboard-header", Dashboard_Header);
