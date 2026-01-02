import type { AttendantRole } from "../../domain/attendant";

type Props = {
  role: AttendantRole;
  className?: string;
};

export default function RoleIcon({ role, className }: Props) {
  if (role === "DEFAULT") {
    return <i className={`fa-solid fa-headset ${className ?? ""}`.trim()} />;
  }

  if (role === "PRIORITARIO") {
    return (
      <i className={`fa-solid fa-shield-halved ${className ?? ""}`.trim()} />
    );
  }

  return (
    <i
      className={`fa-solid fa-hand-holding-medical ${className ?? ""}`.trim()}
    />
  );
}
