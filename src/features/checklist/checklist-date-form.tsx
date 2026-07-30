"use client";

import { useRouter } from "next/navigation";
import { Input, Label } from "@/components/ui";

export function ChecklistDateForm({
  date,
  memberId,
  onDateChange,
}: {
  date: string;
  memberId?: string | null;
  onDateChange?: (date: string) => void;
}) {
  const router = useRouter();

  function updateDate(nextDate: string) {
    if (onDateChange) {
      onDateChange(nextDate);
      return;
    }

    const params = new URLSearchParams({ date: nextDate });

    if (memberId) {
      params.set("memberId", memberId);
    }

    router.push(`/checklist?${params.toString()}`);
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="checklist-date">Checklist date</Label>
      <Input
        defaultValue={date}
        id="checklist-date"
        onChange={(event) => updateDate(event.target.value)}
        type="date"
      />
    </div>
  );
}
