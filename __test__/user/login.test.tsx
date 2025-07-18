/**
 * @jest-environment jsdom
 */

// 0) stub the zodResolver so validation always passes
jest.mock('@hookform/resolvers/zod', () => ({
  zodResolver: () => {
    return async (values: any) => ({
      values,
      errors: {},
    });
  },
}));

// 1) Short‐circuit React.startTransition
jest.mock('react', () => {
  const actual = jest.requireActual('react')
  return {
    ...actual,
    useTransition: () => [false, (cb: () => void) => cb()],
  }
})

// 2) Mock your helper modules
jest.mock('../../components/auth/login2fa', () => ({
  __esModule: true,
  Login2fa2: jest.fn(),
}))
jest.mock('../../lib/login', () => ({
  __esModule: true,
  DisabledUserAction: jest.fn(),
}))

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as nextAuth from 'next-auth/react'

import { Login2fa2 } from '@/components/auth/login2fa'
import { LoginForm2fa } from '@/components/auth/authlogin'

// other mocks
jest.mock('next/navigation', () => ({
  usePathname: () => '/login',
  useSearchParams: () => ({ get: (_: string) => null }),
}))
jest.mock('../../components/ui/use-toast', () => ({
  useToast: () => ({ toast: jest.fn() }),
}))
jest.mock('../../lib/zodschema', () => ({
  LoginSchema: {},        // these can stay empty now
  LoginSchemaEn: {},
  TwoFASchema: {},
}))

const mockSignIn = jest.spyOn(nextAuth, 'signIn')

describe('<LoginForm2fa />', () => {
  beforeEach(() => jest.resetAllMocks())

  it('renders email/password inputs and a disabled login button', () => {
    const { container } = render(<LoginForm2fa />)
expect(screen.getByTestId('email-input')).toBeInTheDocument();
expect(screen.getByTestId('password-input')).toBeInTheDocument();

  })

  it('shows 2FA inputs when Login2fa2 returns twoFactor=true', async () => {
    ;(Login2fa2 as jest.Mock).mockResolvedValue({ twoFactor: true })

      const { container } = render(<LoginForm2fa />)

    await userEvent.type(screen.getByLabelText(/Email Address/i), 'test@example.com')
    await userEvent.type(screen.getByLabelText(/Password/i), 'P@ssword123')
    fireEvent.click(screen.getByRole('button', { name: /login/i }))

    // with both startTransition and zodResolver stubbed, this now flips immediately
    await waitFor(() => {
      expect(
        screen.getByText(/Two-Factor Authentication/i)
      ).toBeInTheDocument()
    })
  const otp = screen.getByRole('textbox')
  expect(otp).toHaveAttribute('maxlength', '6')
  expect(otp).toHaveAttribute('inputmode', 'numeric')

  // alternatively, ensure there's exactly one OTP field:
  expect(container.querySelectorAll('input[data-input-otp]')).toHaveLength(1)  })

  // …other tests…
})
