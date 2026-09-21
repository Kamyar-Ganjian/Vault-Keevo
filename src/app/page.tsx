import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/actions/auth";

export default async function Home() {
  if (await isAuthenticated()) {
    redirect("/vault");
  }
  redirect("/login");
}