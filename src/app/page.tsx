import { isAuthenticated } from "@/lib/actions/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  if (await isAuthenticated()) {
    redirect("/vault");
  }
  redirect("/login");
}
