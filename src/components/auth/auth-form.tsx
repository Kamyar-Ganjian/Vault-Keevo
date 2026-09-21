"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, type Path } from "react-hook-form";
import { FiArchive, FiEye, FiEyeOff, FiLock, FiZap } from "react-icons/fi";
import { toast } from "sonner";
import { LoginInput, SignupInput, loginSchema, signupSchema } from "@/lib/schemas";
import { loginAction, signupAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Spinner } from "@/components/ui/kbd";
import { Logo, KeevoMark } from "@/components/layout/logo";

interface AuthValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const isLogin = mode === "login";
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<AuthValues>({
    defaultValues: isLogin
      ? { email: "", password: "" }
      : { name: "", email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(raw: AuthValues) {
    if (submitting) return;
    setSubmitting(true);
    setServerError("");
    setError("root", { type: "clear" });

    const parsed = isLogin
      ? loginSchema.safeParse(raw)
      : signupSchema.safeParse(raw);

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        setError(issue.path[0] as Path<AuthValues>, {
          type: "manual",
          message: issue.message,
        });
      }
      setSubmitting(false);
      return;
    }

    const result = isLogin
      ? await loginAction(parsed.data as LoginInput)
      : await signupAction(parsed.data as SignupInput);
    if (result?.error) {
      setServerError(result.error);
      setSubmitting(false);
      toast.error(result.error);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col px-4">
      <header className="flex h-14 items-center">
        <Logo href="/" />
      </header>

      <div className="relative flex flex-1 items-center justify-center pb-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(52%_100%_at_50%_0%,rgba(139,124,255,0.1),transparent)]"
        />

        <div className="w-full max-w-md">
          <div className="rounded-2xl bg-surface p-7 shadow-elev ring-1 ring-line-strong sm:p-8">
            <div className="mb-6 flex flex-col items-center text-center">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-accent-fg">
                <KeevoMark className="h-6 w-6" />
              </span>
              <h1 className="mt-4 text-xl font-semibold tracking-tight text-ink">
                {isLogin ? "Welcome back" : "Create your vault"}
              </h1>
              <p className="mt-1.5 text-sm text-muted">
                {isLogin
                  ? "Sign in to Keevo to see your items."
                  : "Everything you use every day, in one safe place."}
              </p>
            </div>

            {serverError ? (
              <div
                role="alert"
                className="mb-4 rounded-xl border border-danger/25 bg-danger/5 px-3.5 py-2.5 text-[13px] font-medium text-danger"
              >
                {serverError}
              </div>
            ) : null}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              {!isLogin ? (
                <div>
                  <Label htmlFor="name" error={errors.name?.message}>
                    Name
                  </Label>
                  <Input
                    id="name"
                    autoComplete="name"
                    autoFocus
                    className="mt-1.5"
                    placeholder="Your name"
                    {...register("name")}
                  />
                </div>
              ) : null}

              <div>
                <Label htmlFor="email" error={errors.email?.message}>
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="mt-1.5"
                  placeholder="you@example.com"
                  autoFocus={isLogin}
                  {...register("email")}
                />
              </div>

              <div>
                <Label htmlFor="password" error={errors.password?.message}>
                  Password
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={
                      isLogin ? "current-password" : "new-password"
                    }
                    placeholder={isLogin ? "Your password" : "At least 8 characters"}
                    className="pr-10"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-1.5 top-1/2 grid h-7 w-7 -translate-y-1/2 cursor-pointer place-items-center rounded-md text-faint transition-colors hover:text-ink"
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-4 w-4" />
                    ) : (
                      <FiEye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {!isLogin ? (
                <div>
                  <Label
                    htmlFor="confirmPassword"
                    error={errors.confirmPassword?.message}
                  >
                    Confirm password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    className="mt-1.5"
                    placeholder="Repeat your password"
                    {...register("confirmPassword")}
                  />
                </div>
              ) : null}

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? (
                  <>
                    <Spinner />
                    {isLogin ? "Signing in…" : "Creating account…"}
                  </>
                ) : isLogin ? (
                  "Sign in"
                ) : (
                  "Create account"
                )}
              </Button>
            </form>

            <p className="mt-5 text-center text-[13px] text-faint">
              {isLogin ? (
                <>
                  New to Keevo?{" "}
                  <Link
                    href="/signup"
                    className="font-medium text-accent transition-opacity hover:opacity-80"
                  >
                    Create an account
                  </Link>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-accent transition-opacity hover:opacity-80"
                  >
                    Sign in
                  </Link>
                </>
              )}
            </p>
          </div>

          {!isLogin ? (
            <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
              <Feature icon={FiZap} label="Instant access" />
              <Feature icon={FiLock} label="Encrypted at rest" />
              <Feature icon={FiArchive} label="In one safe place" />
            </div>
          ) : null}
        </div>
      </div>

      <footer className="flex items-center justify-center gap-1.5 pb-8 text-[11px] text-faint">
        <KeevoMark className="h-3 w-3" />
        Keevo — your personal vault
      </footer>
    </div>
  );
}

function Feature({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-xl bg-surface px-2 py-3.5 text-center ring-1 ring-line">
      <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent-soft text-accent-strong">
        <Icon className="h-4 w-4" />
      </span>
      <span className="text-[11px] font-medium text-muted">{label}</span>
    </div>
  );
}