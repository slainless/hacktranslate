import { html, css, LitElement, customElement, property } from 'Modules/lit.js'

@customElement('ht-greet')
export class SimpleGreeting extends LitElement {
  static styles = css`
    p {
      color: blue;
    }
  `

  @property()
  name = 'Somebody'

  render() {
    return html`
      <div class="hehe">
        <cds-button>Click Here, ${this.name}</cds-button>
      </div>
    `
  }
}
