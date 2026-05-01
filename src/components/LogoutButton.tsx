import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

export function LogoutButton({ children }: Props) {
  return (
    <Link className="text-ink font-serif" href="/logout">
      {children ?? "Logout"}
    </Link>
  );
}
