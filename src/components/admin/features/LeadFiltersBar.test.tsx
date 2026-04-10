import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LeadFiltersBar } from "./LeadFiltersBar";

describe("LeadFiltersBar", () => {
  it("propagates filter interactions", () => {
    const onStatusChange = vi.fn();
    const onSearchChange = vi.fn();
    const onApply = vi.fn();

    render(
      <LeadFiltersBar
        status="ALL"
        search=""
        onStatusChange={onStatusChange}
        onSearchChange={onSearchChange}
        onApply={onApply}
      />
    );

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "NEW" } });
    fireEvent.change(screen.getByPlaceholderText("Search by name, phone, email or service"), {
      target: { value: "john" }
    });
    fireEvent.click(screen.getByText("Apply"));

    expect(onStatusChange).toHaveBeenCalledWith("NEW");
    expect(onSearchChange).toHaveBeenCalledWith("john");
    expect(onApply).toHaveBeenCalled();
  });
});
