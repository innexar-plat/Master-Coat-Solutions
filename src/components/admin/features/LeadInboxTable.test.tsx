import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LeadInboxTable } from "./LeadInboxTable";

describe("LeadInboxTable", () => {
  it("renders lead rows and triggers status update callback", () => {
    const onUpdateStatus = vi.fn();

    render(
      <LeadInboxTable
        leads={[
          {
            id: "1",
            name: "John",
            phone: "4075551111",
            service: "Interior",
            locale: "en",
            source: "free-estimate",
            status: "NEW",
            createdAt: new Date().toISOString()
          }
        ]}
        onUpdateStatus={onUpdateStatus}
        selectedLeadId="1"
        onSelectLead={vi.fn()}
      />
    );

    expect(screen.getByText("Lead Inbox")).toBeInTheDocument();
    expect(screen.getByText("Notes")).toBeInTheDocument();
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "CONTACTED" } });
    expect(onUpdateStatus).toHaveBeenCalledWith("1", "CONTACTED");
  });
});
