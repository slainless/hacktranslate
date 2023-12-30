import { html } from 'lit-html'
import { CONSTANT_TEXT } from '../common.js'
import './header.css'
// import '@carbon/web-components/es/components/button/index.js'

export default function Header() {
  return html`
    <header>
      <div>${CONSTANT_TEXT}</div>
    </header>
  `
}
