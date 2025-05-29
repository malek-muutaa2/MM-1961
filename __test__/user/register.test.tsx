import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { RegisterForm } from "../../components/auth/register-form"

jest.mock("react-google-recaptcha", () => ({
  __esModule: true,
  default: ({ onChange }: { onChange: (token: string) => void }) => {
    onChange("fake-recaptcha-token")
    return <div data-testid="recaptcha">Mocked reCAPTCHA</div>
  },
}))

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))
jest.mock("react-google-recaptcha", () => ({
  __esModule: true,
  default: ({ onChange }: { onChange: (token: string) => void }) => {
    onChange("mocked-token")
    return <div data-testid="recaptcha">Mocked reCAPTCHA</div>
  },
}))

const toastMock = jest.fn()
jest.mock("../../hooks/use-toast", () => ({
  useToast: () => ({
    toast: toastMock,
  }),
}))

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
) as jest.Mock

describe("RegisterForm", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders and submits successfully with valid data", async () => {
    render(<RegisterForm />)

    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: "John Doe" } })
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "john@example.com" } })
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "Abcdefg!12345" } })
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: "Abcdefg!12345" } })
    fireEvent.change(screen.getByLabelText(/Organization/i), { target: { value: "MyOrg" } })

    const submitButton = screen.getByRole("button", { name: /Create Account/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/register", expect.anything())
    })
  })

it("shows error for weak password", async () => {
  render(<RegisterForm />)

  // Fill all required fields to allow submission
  fireEvent.change(screen.getByLabelText(/Full ?Name/i), { target: { value: "John Doe" } })
  fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "john@example.com" } })
  fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "short" } })
  fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: "short" } })
  fireEvent.change(screen.getByLabelText(/Organization/i), { target: { value: "TestOrg" } })

  // Trigger form submission
  fireEvent.click(screen.getByRole("button", { name: /Create Account/i }))

  // Wait for the toast to be called
  await waitFor(() => {
    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Invalid Password",
      })
    )
  })
})


 it("shows error for password mismatch", async () => {
  render(<RegisterForm />)

  // Fill all required fields
  fireEvent.change(screen.getByLabelText(/Full ?Name/i), { target: { value: "John Doe" } })
  fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "john@example.com" } })
  fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "StrongPass1!" } })
  fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: "Mismatch1!" } })
  fireEvent.change(screen.getByLabelText(/Organization/i), { target: { value: "TestOrg" } })

  // Simulate dropdown selections (if required)
  // fireEvent.change(screen.getByLabelText(/Job Title/i), { target: { value: "manager" } })

  // Submit form
  fireEvent.click(screen.getByRole("button", { name: /Create Account/i }))

  await waitFor(() => {
    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Error",
        description: "Passwords do not match",
      })
    )
  })
})

})
