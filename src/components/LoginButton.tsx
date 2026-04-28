import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

export function LoginButton({ children }: Props) {
  return (
    <Link
      className="bg-amber-light m-2 rounded-[14px] p-2 font-serif"
      href="/login"
    >
      {children ?? "Login"}
    </Link>
  );
}
