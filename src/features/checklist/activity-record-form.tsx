"use client";

import { useActionState } from "react";
import { Alert, Button, Input, Label } from "@/components/ui";
import { recordActivityAction } from "./actions";

type ActivityRecordFormProps = {
  activity: {
    id: string;
    title: string;
    type: string;
    targetValue: string | null;
    targetUnit: string | null;
  };
  memberId: string;
  entryDate: string;
  record?: {
    status: string;
    booleanValue: boolean | null;
    numberValue: string | null;
    textValue: string | null;
    ratingValue: number | null;
  };
};

function valueLabel(type: string) {
  if (["NUMBER", "DURATION", "DISTANCE"].includes(type)) {
    return "Value";
  }

  if (type === "RATING") {
    return "Rating";
  }

  if (type === "TEXT") {
    return "Note";
  }

  return "Done";
}

export function ActivityRecordForm({ activity, memberId, entryDate, record }: ActivityRecordFormProps) {
  const [state, formAction, isPending] = useActionState(recordActivityAction, {});

  return (
    <form action={formAction} className="space-y-3 rounded-lg border border-neutral-200 p-3 dark:border-neutral-800">
      <input name="memberId" type="hidden" value={memberId} />
      <input name="activityId" type="hidden" value={activity.id} />
      <input name="entryDate" type="hidden" value={entryDate} />
      <input name="activityType" type="hidden" value={activity.type} />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-950 dark:text-neutral-50">{activity.title}</p>
          <p className="mt-1 text-xs text-neutral-500">
            {activity.type.toLowerCase()} {activity.targetValue ? `- target ${activity.targetValue}${activity.targetUnit ? ` ${activity.targetUnit}` : ""}` : ""}
          </p>
        </div>
        <select
          className="h-9 rounded-lg border border-neutral-300 bg-white px-3 text-sm text-neutral-950 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-50"
          defaultValue={record?.status ?? "PENDING"}
          name="status"
        >
          <option value="PENDING">Pending</option>
          <option value="COMPLETED">Completed</option>
          <option value="SKIPPED">Skipped</option>
          <option value="MISSED">Missed</option>
        </select>
      </div>

      {activity.type === "CHECKBOX" ? (
        <input name="booleanValue" type="hidden" value="true" />
      ) : (
        <input name="booleanValue" type="hidden" value="" />
      )}

      {["NUMBER", "DURATION", "DISTANCE"].includes(activity.type) ? (
        <div className="space-y-2">
          <Label htmlFor={`${activity.id}-${memberId}-number`}>{valueLabel(activity.type)}</Label>
          <Input
            defaultValue={record?.numberValue ?? ""}
            id={`${activity.id}-${memberId}-number`}
            name="numberValue"
            step="0.01"
            type="number"
          />
        </div>
      ) : (
        <input name="numberValue" type="hidden" value="" />
      )}

      {activity.type === "RATING" ? (
        <div className="space-y-2">
          <Label htmlFor={`${activity.id}-${memberId}-rating`}>{valueLabel(activity.type)}</Label>
          <Input
            defaultValue={record?.ratingValue ?? ""}
            id={`${activity.id}-${memberId}-rating`}
            max={5}
            min={1}
            name="ratingValue"
            type="number"
          />
        </div>
      ) : (
        <input name="ratingValue" type="hidden" value="" />
      )}

      {activity.type === "TEXT" ? (
        <div className="space-y-2">
          <Label htmlFor={`${activity.id}-${memberId}-text`}>{valueLabel(activity.type)}</Label>
          <Input defaultValue={record?.textValue ?? ""} id={`${activity.id}-${memberId}-text`} name="textValue" />
        </div>
      ) : (
        <input name="textValue" type="hidden" value="" />
      )}

      {state.error ? <Alert variant="danger">{state.error}</Alert> : null}
      {state.message ? <Alert variant="success">{state.message}</Alert> : null}

      <Button disabled={isPending} size="sm" type="submit">
        {isPending ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
