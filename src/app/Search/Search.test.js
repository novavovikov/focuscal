import React from 'react'
import { render } from '@testing-library/react'
import Search from './index'

test('renders learn react link', () => {
  const { getByText } = render(<Search/>)
  const linkElement = getByText(/learn react/i)
  expect(linkElement).toBeInTheDocument()
})
