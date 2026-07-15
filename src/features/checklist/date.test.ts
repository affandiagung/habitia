import { describe, expect, it } from "vitest";
import { parseChecklistDate, toDatabaseDate } from "./date";

describe("checklist date helpers", () => {
  it("keeps valid ISO date input", () => {
    expect(parseChecklistDate("2026-07-15")).toBe("2026-07-15");
  });

  it("converts date input to UTC midnight date", () => {
    expect(toDatabaseDate("2026-07-15").toISOString()).toBe("2026-07-15T00:00:00.000Z");
  });
});
