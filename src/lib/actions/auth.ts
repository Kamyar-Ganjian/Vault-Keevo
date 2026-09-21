"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { signIn, signOut, auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { loginSchema, signupSchema } from "@/lib/schemas";

export async function isAuthenticated() {
  const session = await auth();
  return Boolean(session?.user?.id);
}

export async function signupAction(input: unknown): Promise<{ error?: string }> {
  const parsed = signupSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your input." };
  }

  const { name, email, password } = parsed.data;
  const normalizedEmail = email.trim().toLowerCase();

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { email: normalizedEmail, name: name.trim(), passwordHash },
  });

  await signIn("credentials", {
    email: normalizedEmail,
    password,
    redirectTo: "/vault",
  });
  return {};
}

export async function loginAction(input: unknown): Promise<{ error?: string }> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your input." };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email.trim().toLowerCase(),
      password: parsed.data.password,
      redirectTo: "/vault",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Incorrect email or password." };
    }
    throw error;
  }
  return {};
}

export async function logoutAction(): Promise<{ error?: string }> {
  try {
    await signOut({ redirectTo: "/login" });
  } catch (error) {
    if (error instanceof AuthError) return { error: "Could not sign out." };
    throw error;
  }
  redirect("/login");
}

export async function requireUserId(): Promise<string> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/login");
  return userId;
}