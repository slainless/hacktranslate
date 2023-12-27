import { html, css, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

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
