import {
  LitElement,
  html,
  css,
} from "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js";

class DashboardCastCrew extends LitElement {
  static properties = {
    cast: { type: Array },
    crew: { type: Array },
  };

  static styles = css`
    :host {
      display: block;
      background: #101727;
      padding: 24px;
      font-family: "Inter", sans-serif;
      border-radius: 10px;
      height: 600px;
      overflow-y: scroll;
      scrollbar-width: thin;
      scrollbar-color: #1d2a3a transparent;
    }

    .h2 {
      margin-block: 28px;
    }

    .section-block {
      height: 280px;
      overflow-y: scroll;
    }

    .section-block h3 {
      margin-bottom: 10px;
      margin-top: 40px;
    }

    .members-section {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding-right: 4px;
    }

    .member {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      overflow: hidden;
      flex-shrink: 0;
      background: #1d2a3a;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 600;
      color: #a0a8b5;
      letter-spacing: 0.03em;
    }

    .avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .member-info {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .member-name {
      font-size: 13px;
      font-weight: 500;
      color: #ffffff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.3;
    }

    .member-roles {
      font-size: 11px;
      color: #a0a8b5;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.4;
    }

    .scroll-container {
      flex: 1;
      overflow-y: auto;
      min-height: 0;
      scrollbar-width: thin;
      scrollbar-color: #1d2a3a transparent;
    }
  `;

  constructor() {
    super();
    this.cast = [];
    this.crew = [];
  }

  _initials(name) {
    //in case actor or crew has no photo, it will be their initials
    if (!name) return "?";
    return name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("");
  }

  render() {
    return html`
      <h2>Cast & Crew</h2>
      <div class="section-block">
        <h3>Cast</h3>
        <div class="scroll-container">
          <div class="members-section">
            ${this.cast.length
              ? this.cast.map(
                  (member) => html`
                    <div class="member">
                      <div class="avatar">
                        ${member.profile_path
                          ? html`<img
                              src="https://image.tmdb.org/t/p/w185${member.profile_path}"
                              alt="${member.name}"
                              title="${member.name}"
                            />`
                          : html`${this._initials(member.name)}`}
                      </div>
                      <div class="member-info">
                        <span class="member-name">${member.name}</span>
                        <span class="member-roles">${member.character}</span>
                      </div>
                    </div>
                  `,
                )
              : html`<span style="color:#777;font-size:13px;"
                  >No cast available</span
                >`}
          </div>
        </div>
      </div>

      <div class="section-block">
        <h3 class="section-label">Crew</h3>
        <div class="scroll-container">
          <div class="members-section">
            ${this.crew.length
              ? this.crew.map(
                  (member) => html`
                    <div class="member">
                      <div class="avatar">
                        ${member.profile_path
                          ? html`<img
                              src="https://image.tmdb.org/t/p/w185${member.profile_path}"
                              alt="${member.name}"
                              title="${member.name}"
                            />`
                          : html`${this._initials(member.name)}`}
                      </div>
                      <div class="member-info">
                        <span class="member-name">${member.name}</span>
                        <span class="member-roles">${member.job}</span>
                      </div>
                    </div>
                  `,
                )
              : html`<span style="color:#777;font-size:13px;"
                  >No crew available</span
                >`}
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("dashboard-cast-crew", DashboardCastCrew);
