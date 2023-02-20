import { render } from '@testing-library/react'
import { IconUaNbu } from './src/icons.js'
import React from 'react'
import renderer from 'react-test-renderer'

describe('React Icon component', () => {
  test('should render icon component', () => {
    const { container } = render(<IconUaNbu />)
    expect(container.getElementsByTagName('svg').length).toBeGreaterThan(0)
  })

  test('should update svg attributes when there are props passed to the component', () => {
    const { container } = render(<IconUaNbu size={48} />)

    const svg = container.getElementsByTagName('svg')[0]

    expect(svg.getAttribute('width')).toBe('48')
    expect(svg.getAttribute('fill')).toBe('currentColor')
  })

  // Jest creates separate file to store snapshots
  test('should match snapshot', () => {
    const icon = renderer.create(<IconUaNbu />).toJSON()
    expect(icon).toMatchSnapshot()
  })
})