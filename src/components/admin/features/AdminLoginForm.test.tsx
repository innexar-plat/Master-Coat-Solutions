import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AdminLoginForm } from "./AdminLoginForm";

describe("AdminLoginForm", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("shows error feedback when login request fails", async () => {
    const fetchMock = vi.fn(async () => ({ ok: false }));
    vi.stubGlobal("fetch", fetchMock as unknown as typeof fetch);
    Object.defineProperty(window, "fetch", {
      value: fetchMock,
      writable: true
    });

    render(
      <AdminLoginForm
        title="Admin Login"
        submitLabel="Sign in"
        emailLabel="Email"
        passwordLabel="Password"
        errorLabel="Invalid credentials"
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "admin@vinipainting.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "wrong-password" } });
    fireEvent.submit(screen.getByRole("form", { name: "admin-login-form" }));

    expect(await screen.findByText("Invalid credentials")).toBeInTheDocument();
  });
});
