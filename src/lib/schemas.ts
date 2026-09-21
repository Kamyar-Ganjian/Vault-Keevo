import { z } from "zod";
import { FIELD_TYPES } from "./field-types";
import { DEFAULT_APPEARANCE } from "./types";

export const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});

export const signupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Enter your name")
      .max(80, "Name is too long"),
    email: z.email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password is too long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const fieldSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .trim()
    .max(60, "Field name is too long"),
  type: z.enum(FIELD_TYPES),
  value: z.string().max(40000, "Field value is too long"),
});

const appearanceSchema = z.object({
  accent: z
    .string()
    .min(1)
    .max(40)
    .regex(/^#/, "Pick an accent color"),
  iconShape: z.enum(["circle", "rounded", "square"]),
  banner: z.enum(["none", "accent", "gradient"]),
});

export const itemSchema = z.object({
  name: z
    .string()
    .trim()
    .max(120, "Name is too long"),
  description: z.string().trim().max(300, "Description is too long"),
  icon: z.string().max(48),
  category: z.enum(["account", "server", "domain", "other"]),
  favorite: z.boolean(),
  appearance: appearanceSchema,
  notes: z.string().max(50000, "Notes are too long"),
  fields: z.array(fieldSchema).max(100, "Too many fields"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ItemInput = z.infer<typeof itemSchema>;

export function emptyField() {
  return { name: "", type: "text" as const, value: "" };
}

export function editorDefaults() {
  return {
    name: "",
    description: "",
    icon: "box",
    category: "other" as const,
    favorite: false,
    appearance: DEFAULT_APPEARANCE,
    notes: "",
    fields: [] as { name: string; type: "text"; value: string }[],
  };
}