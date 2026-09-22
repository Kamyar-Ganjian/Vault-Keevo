"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm, type Path } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "sonner";
import { LoginInput, SignupInput, loginSchema, signupSchema } from "@/lib/schemas";
import { loginAction, signupAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input, FormField } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { Logo, Mark } from "@/components/layout/logo";

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
              <Image
                src="/logos/keevo-white.png"
                alt=""
                aria-hidden
                width={663}
                height={131}
                priority
                className="hidden h-16 w-full object-contain object-center dark:block"
              />
              <Image
                src="/logos/keevo-black.png"
                alt="Keevo"
                width={663}
                height={131}
                priority
                className="h-16 w-full object-contain object-center dark:hidden"
              />
              <h1 className="mt-5 text-xl font-semibold tracking-tight text-ink">
                {isLogin ? "Welcome back" : "Create your vault"}
              </h1>
            </div>

            {serverError ? <Alert className="mb-4">{serverError}</Alert> : null}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              {!isLogin ? (
                <FormField label="Name" htmlFor="name" error={errors.name?.message}>
                  <Input
                    id="name"
                    autoComplete="name"
                    autoFocus
                    placeholder="Your name"
                    {...register("name")}
                  />
                </FormField>
              ) : null}

              <FormField label="Email" htmlFor="email" error={errors.email?.message}>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  autoFocus={isLogin}
                  {...register("email")}
                />
              </FormField>

              <FormField
                label="Password"
                htmlFor="password"
                error={errors.password?.message}
              >
                <div className="relative">
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
              </FormField>

              {!isLogin ? (
                <FormField
                  label="Confirm password"
                  htmlFor="confirmPassword"
                  error={errors.confirmPassword?.message}
                >
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Repeat your password"
                    {...register("confirmPassword")}
                  />
                </FormField>
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
        </div>
      </div>

      <footer className="flex items-center justify-center gap-1.5 pb-8 text-[11px] text-faint">
        <Mark className="h-3 w-[76px]" />
        Keevo
      </footer>
    </div>
  );
}