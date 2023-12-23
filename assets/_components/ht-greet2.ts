import { html, css, LitElement, customElement, property } from '/modules/lit.js'
import 'https://1.www.s81c.com/common/carbon/web-components/tag/v2/latest/button.min.js'

@customElement('ht-greet2')
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
      <div>
        <p>Hello, ${this.name}!</p>
        <cds-button>Click Here</cds-button>
      </div>
    `
  }
}
