import { html, css, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { CONSTANT_TEXT } from '../common.js'

@customElement('ht-greet')
export class SimpleGreeting extends LitElement {
  static styles = css`
    p {
      color: blue;
    }
  `

  @property()
  name = CONSTANT_TEXT

  render() {
    return html`
      <div class="hehe">
        <cds-button>Click Here, ${this.name}</cds-button>
      </div>
    `
  }
}
