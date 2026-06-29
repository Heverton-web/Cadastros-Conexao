import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

describe('Button A11y', () => {
  it('deve ter zero violações', async () => {
    const { container } = render(<button>Clique</button>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
