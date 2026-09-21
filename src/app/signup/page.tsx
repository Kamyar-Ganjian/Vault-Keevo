import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { isAuthenticated } from "@/lib/actions/auth";

export const metadata: Metadata = {
  title: "Create account — Keevo",
};

export default async function SignupPage() {
  if (await isAuthenticated()) redirect("/vault");
  return <AuthForm mode="signup" />;
}