"use client";

import { useRouter } from "next/navigation";
import { Input, Label } from "@/components/ui";

export function ChecklistDateForm({ date }: { date: string }) {
  const router = useRouter();

  return (
    <div className="space-y-2">
      <Label htmlFor="checklist-date">Checklist date</Label>
      <Input
        defaultValue={date}
        id="checklist-date"
        onChange={(event) => router.push(`/checklist?date=${event.target.value}`)}
        type="date"
      />
    </div>
  );
}
