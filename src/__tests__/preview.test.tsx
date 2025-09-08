import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Preview from '@/components/Preview'

describe('Preview', () => {
  it('renders placeholder when empty code', () => {
    render(<Preview code="" />)
    expect(screen.getByText(/Your diagram will appear here/i)).toBeTruthy()
  })
})


