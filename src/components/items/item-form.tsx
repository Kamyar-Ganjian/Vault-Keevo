"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowUp, FiArrowDown, FiEye, FiEyeOff, FiPlus, FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ItemIcon } from "@/components/items/item-icon";
import { IconPicker } from "@/components/items/icon-picker";
import { AppearanceEditor } from "@/components/items/appearance-editor";
import {
  createItemAction,
  updateItemAction,
} from "@/lib/actions/items";
import { itemSchema, emptyField, type ItemInput } from "@/lib/schemas";
import { FIELD_TYPE_META, isSensitiveType, type FieldType } from "@/lib/field-types";
import { CATEGORIES, type ItemDetailData } from "@/lib/types";
import { cn } from "@/lib/utils";

function FieldIcon({ type, className }: { type: FieldType; className?: string }) {
  const Icon = FIELD_TYPE_META[type].icon;
  return <Icon className={className} />;
}

function SectionCard({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-5">
      <h2 className="text-sm font-semibold tracking-tight text-ink">{title}</h2>
      {hint ? <p className="mt-0.5 text-xs text-faint">{hint}</p> : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function ItemForm({
  mode,
  item,
}: {
  mode: "create" | "edit";
  item?: ItemDetailData;
}) {
  const router = useRouter();
  const [showSecrets, setShowSecrets] = useState<Record<number, boolean>>({});
  const [saving, setSaving] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ItemInput>({
    resolver: zodResolver(itemSchema),
    defaultValues:
      mode === "edit" && item
        ? {
            name: item.name,
            description: item.description,
            icon: item.icon || "box",
            category: item.category,
            favorite: item.favorite,
            appearance: item.appearance,
            notes: item.notes,
            fields: item.fields.map((f) => ({
              id: f.id,
              name: f.name,
              type: f.type,
              value: f.value,
            })),
          }
        : {
            name: "",
            description: "",
            icon: "box",
            category: "other",
            favorite: false,
            appearance: { accent: "#6366f1", iconShape: "rounded", banner: "accent" },
            notes: "",
            fields: [{ name: "", type: "text", value: "" }],
          },
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "fields",
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const values = watch();
  const appearance = values.appearance;

  const previewFields = useMemo(
    () => values.fields.filter((f) => f.name.trim()).slice(0, 4),
    [values.fields],
  );

  async function onSubmit(input: ItemInput) {
    if (saving) return;
    setSaving(true);
    const payload: ItemInput = {
      ...input,
      fields: input.fields.map((f) => ({ ...f, value: f.value ?? "" })),
    };

    const result =
      mode === "create"
        ? await createItemAction(payload)
        : await updateItemAction(item!.id, payload);

    setSaving(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success(mode === "create" ? "Item created" : "Item saved");
    router.push(`/vault/items/${result.id}`);
    router.refresh();
  }

  function toggleSecret(index: number) {
    setShowSecrets((s) => ({ ...s, [index]: !s[index] }));
  }

  const fieldErrorName = errors.fields?.message as string | undefined;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex items-center justify-between gap-3">
        <Link
          href={mode === "edit" && item ? `/vault/items/${item.id}` : "/vault"}
          className="flex cursor-pointer items-center gap-1.5 text-[13px] font-medium text-faint transition-colors hover:text-ink"
        >
          ← {mode === "edit" ? "Back to item" : "Vault"}
        </Link>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              mode === "edit" && item
                ? router.push(`/vault/items/${item.id}`)
                : router.push("/vault")
            }
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving
              ? "Saving…"
              : mode === "create"
                ? "Create item"
                : "Save changes"}
          </Button>
        </div>
      </div>

      {fieldErrorName ? (
        <p className="mt-4 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400">
          {fieldErrorName}
        </p>
      ) : null}

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <SectionCard title="Basics">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" error={errors.name?.message}>
                  Name
                </Label>
                <Input
                  id="name"
                  autoFocus
                  className="mt-1.5"
                  placeholder="e.g. Netflix account"
                  {...register("name")}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  className="mt-1.5"
                  placeholder="A short note about this item"
                  {...register("description")}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    id="category"
                    className="mt-1.5"
                    {...register("category")}
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="flex items-end pb-1">
                  <div className="flex items-center gap-2.5">
                    <Controller
                      control={control}
                      name="favorite"
                      render={({ field }) => (
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          aria-label="Mark as favorite"
                        />
                      )}
                    />
                    <span className="text-sm text-muted">Favorite</span>
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Icon">
            <Controller
              control={control}
              name="icon"
              render={({ field }) => (
                <IconPicker value={field.value} onChange={field.onChange} />
              )}
            />
          </SectionCard>

          <SectionCard
            title={`Fields (${fields.length}${fields.length >= 100 ? ", max 100" : ""})`}
            hint="Custom fields with a type, a name and a value. Secret and code values are encrypted."
          >
            <div className="space-y-2.5">
              {fields.map((field, index) => {
                const type = (field.type as FieldType) || "text";
                const meta = FIELD_TYPE_META[type];
                const sensitive = isSensitiveType(type);
                const shouldShow = sensitive
                  ? Boolean(showSecrets[index])
                  : true;

                return (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                    className="rounded-xl border border-line bg-surface-3/50 p-3"
                  >
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <FieldIcon
                        type={type}
                        className="h-3.5 w-3.5 shrink-0 text-faint"
                      />
                      <input
                        placeholder="Field name"
                        aria-label="Field name"
                        className={cn(
                          "h-8 min-w-0 flex-1 basis-36 rounded-lg border border-transparent bg-transparent px-2 text-sm font-medium text-ink placeholder:font-normal placeholder:text-faint",
                          "focus-visible:border-line-strong focus-visible:bg-surface-2 focus-visible:outline-none",
                        )}
                        {...register(`fields.${index}.name`)}
                      />
                      <select
                        aria-label="Field type"
                        value={field.type as string}
                        onChange={(e) =>
                          setValue(
                            `fields.${index}.type`,
                            e.target.value as FieldType,
                          )
                        }
                        className="h-8 shrink-0 cursor-pointer appearance-none rounded-lg border border-line bg-surface-2 px-2.5 text-xs font-medium text-muted focus-visible:border-accent/60 focus-visible:outline-none"
                      >
                        {Object.entries(FIELD_TYPE_META).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value.label}
                          </option>
                        ))}
                      </select>
                      <div className="flex shrink-0 items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => toggleSecret(index)}
                          aria-label={
                            shouldShow ? "Hide value" : "Show value"
                          }
                          className={cn(
                            "grid h-8 w-8 cursor-pointer place-items-center rounded-lg text-faint transition-colors hover:text-ink",
                            !sensitive && "invisible",
                          )}
                        >
                          {shouldShow ? (
                            <FiEyeOff className="h-3.5 w-3.5" />
                          ) : (
                            <FiEye className="h-3.5 w-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          aria-label="Remove field"
                          className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg text-faint transition-colors hover:bg-red-500/10 hover:text-red-500"
                        >
                          <FiTrash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      {meta.kind === "textarea" ? (
                        <Textarea
                          rows={2}
                          placeholder={sensitive && !shouldShow ? "••••••••" : "Value"}
                          aria-label={`${field.name || "Field"} value`}
                          className={cn(
                            "font-mono text-[13px]",
                            propertiesFromType(type),
                          )}
                          {...register(`fields.${index}.value`)}
                        />
                      ) : type === "toggle" ? (
                        <Controller
                          control={control}
                          name={`fields.${index}.value`}
                          render={({ field: toggleField }) => (
                            <div className="flex h-9 items-center gap-2.5 px-1">
                              <Switch
                                checked={toggleField.value === "true"}
                                onCheckedChange={(checked) =>
                                  toggleField.onChange(checked ? "true" : "false")
                                }
                                aria-label="Value"
                              />
                              <span
                                className={cn(
                                  "text-xs font-medium",
                                  toggleField.value === "true"
                                    ? "text-mint"
                                    : "text-faint",
                                )}
                              >
                                {toggleField.value === "true" ? "On" : "Off"}
                              </span>
                            </div>
                          )}
                        />
                      ) : (
                        <Input
                          placeholder="Value"
                          aria-label={`${field.name || "Field"} value`}
                          type={
                            sensitive && !shouldShow
                              ? "password"
                              : (meta.inputType ?? "text")
                          }
                          className={cn(
                            "min-w-0 flex-1",
                            propertiesFromType(type),
                          )}
                          {...register(`fields.${index}.value`)}
                        />
                      )}

                      <div className="flex flex-col gap-0.5">
                        <button
                          type="button"
                          onClick={() =>
                            index > 0 && move(index, index - 1)
                          }
                          disabled={index === 0}
                          aria-label="Move up"
                          className="grid h-6 w-7 cursor-pointer place-items-center rounded-md text-faint transition-colors hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <FiArrowUp className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            index < fields.length - 1 &&
                            move(index, index + 1)
                          }
                          disabled={index === fields.length - 1}
                          aria-label="Move down"
                          className="grid h-6 w-7 cursor-pointer place-items-center rounded-md text-faint transition-colors hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <FiArrowDown className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="mt-3"
              onClick={() => append(emptyField())}
              disabled={fields.length >= 100}
            >
              <FiPlus className="h-3.5 w-3.5" />
              Add field
            </Button>
          </SectionCard>

          <SectionCard title="Notes">
            <Textarea
              rows={4}
              placeholder="Anything else worth remembering…"
              className="mt-1"
              {...register("notes")}
            />
          </SectionCard>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-20">
          <LivePreview
            name={values.name}
            description={values.description}
            icon={values.icon}
            appearance={appearance}
            category={values.category}
            fields={previewFields}
            hasNotes={Boolean(values.notes?.trim())}
          />

          <SectionCard title="Appearance">
            <AppearanceEditor
              value={appearance}
              onChange={(next) => setValue("appearance", next)}
            />
          </SectionCard>
        </aside>
      </div>
    </form>
  );
}

function propertiesFromType(type: FieldType) {
  switch (type) {
    case "code":
      return "font-mono text-[13px]";
    case "secret":
      return "font-mono tracking-wider";
    default:
      return undefined;
  }
}

function LivePreview({
  name,
  description,
  icon,
  appearance,
  category,
  fields,
  hasNotes,
}: {
  name: string;
  description: string;
  icon: string;
  appearance: ItemInput["appearance"];
  category: ItemInput["category"];
  fields: { name: string; type: FieldType; value: string }[];
  hasNotes: boolean;
}) {
  const accentSoft = `color-mix(in srgb, ${appearance.accent} 10%, transparent)`;
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
      {appearance.banner !== "none" ? (
        <span
          aria-hidden
          className="block h-10 w-full"
          style={{
            background:
              appearance.banner === "gradient"
                ? `radial-gradient(120% 160% at 15% 0%, color-mix(in srgb, ${appearance.accent} 45%, transparent), transparent 60%), linear-gradient(160deg, color-mix(in srgb, ${appearance.accent} 18%, transparent), transparent 55%)`
                : `linear-gradient(150deg, color-mix(in srgb, ${appearance.accent} 20%, transparent), transparent 70%)`,
          }}
        />
      ) : null}
      <div className={cn("p-4", appearance.banner === "none" && "pt-5")}>
        <div className="flex items-center gap-3">
          <ItemIcon
            icon={icon || "box"}
            appearance={appearance}
            size="md"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-semibold tracking-tight text-ink">
              {name || "Item name"}
            </p>
            <p className="truncate text-xs text-faint">
              {description || category}
            </p>
          </div>
          <span className="rounded-full border border-line bg-surface-2 px-2 py-0.5 text-[10px] font-medium capitalize text-muted">
            {category}
          </span>
        </div>

        {fields.length > 0 ? (
          <div className="mt-3.5 grid gap-1.5">
            {fields.map((f, i) => (
              <div key={i} className="rounded-lg border border-line bg-surface-3/60 p-2">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-faint">
                  {f.name}
                </p>
                <p
                  className={cn(
                    "mt-0.5 truncate text-[12px] text-ink",
                    isSensitiveType(f.type) && "font-mono tracking-widest",
                  )}
                >
                  {isSensitiveType(f.type)
                    ? "••••••••"
                    : f.value || "—"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="mt-3.5 rounded-lg border border-dashed px-3 py-3"
            style={{ borderColor: appearance.accent, background: accentSoft }}
          >
            <p className="text-center text-[11px] font-medium" style={{ color: appearance.accent }}>
              No fields yet — add one in the editor
            </p>
          </div>
        )}

        {hasNotes ? (
          <div className="mt-3 border-t border-line pt-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-faint">
              Notes
            </p>
            <p className="mt-1 line-clamp-2 text-[11.5px] leading-relaxed text-muted">
              Notes preview
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}