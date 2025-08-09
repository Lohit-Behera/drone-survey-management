import { redirect } from "next/navigation";

export default function Page() {
  // Default route: Login
  redirect("/login");
}
