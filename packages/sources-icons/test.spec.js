import { readFileSync } from 'fs'
import { join } from 'path'

describe('SVGIcon', () => {
  let container

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.innerHTML = ''
    document.body.removeChild(container)
  })
  
  test('renders the correct class and XML namespace', () => {
    container.innerHTML = readFileSync(join('./icons', 'ua-nbu.svg'), 'utf-8')
    const svg = container.querySelector('svg')

    expect(svg.getAttribute('xmlns')).toBe('http://www.w3.org/2000/svg')
    expect(svg.getAttribute('fill')).toBe('currentColor')
    expect(svg.getAttribute('width')).toBe('48')
  })
})