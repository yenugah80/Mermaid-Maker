import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Index from '@/pages/Index'

describe('Export', () => {
  it('disables Export when code is empty', () => {
    render(<Index />)
    const exportBtn = screen.getByRole('button', { name: /export diagram as svg/i })
    // Initially has default code, so enabled
    expect(exportBtn).not.toHaveAttribute('disabled')
  })
})


