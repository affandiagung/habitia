import { Badge, Card, CardContent } from "@/components/ui";
import { memberColorOptions } from "./options";

type Member = {
  id: string;
  name: string;
  nickname: string | null;
  role: string;
  gender: string | null;
  birthDate: Date | null;
  colorTheme: string;
};

function getColorClass(colorTheme: string) {
  return memberColorOptions.find((color) => color.value === colorTheme)?.className ?? "bg-slate-500";
}

function formatRole(role: string) {
  return role.toLowerCase().replaceAll("_", " ");
}

export function MemberList({ members }: { members: Member[] }) {
  if (members.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-sm font-medium text-neutral-950 dark:text-neutral-50">No family members yet</p>
          <p className="mt-2 text-sm text-neutral-500">Add the people you want to track goals and habits for.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {members.map((member) => (
        <Card key={member.id}>
          <CardContent className="flex items-start gap-4 p-4">
            <div className={`mt-1 h-10 w-10 shrink-0 rounded-lg ${getColorClass(member.colorTheme)}`} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-semibold text-neutral-950 dark:text-neutral-50">{member.name}</p>
                <Badge variant="muted">{formatRole(member.role)}</Badge>
              </div>
              <p className="mt-1 text-sm text-neutral-500">{member.nickname || "No nickname"}</p>
              <p className="mt-2 text-xs text-neutral-400">
                {member.birthDate ? `Born ${member.birthDate.toLocaleDateString()}` : "Birth date not set"}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
