"use client";

import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { FiArrowUp, FiArrowDown, FiChevronDown, FiDroplet, FiEye, FiEyeOff, FiFileText, FiKey, FiPlus, FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input, Textarea, FormField } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Alert } from "@/components/ui/alert";
import { BackLink } from "@/components/ui/back-link";
import { Section } from "@/components/ui/section";
import { ItemIcon } from "@/components/items/item-icon";
import { ItemBanner } from "@/components/items/item-banner";
import { IconPicker } from "@/components/items/icon-picker";
import { AppearanceEditor } from "@/components/items/appearance-editor";
import {
  createItemAction,
  updateItemAction,
} from "@/lib/actions/items";
import { itemSchema, emptyField, type ItemInput } from "@/lib/schemas";
import { FIELD_TYPE_META, fieldLabel, isSensitiveType, type FieldType } from "@/lib/field-types";
import { CATEGORIES, type ItemDetailData } from "@/lib/types";
import { cn } from "@/lib/utils";

function FieldIcon({ type, className }: { type: FieldType; className?: string }) {
  const Icon = FIELD_TYPE_META[type].icon;
  return <Icon className={className} />;
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
  const [openFields, setOpenFields] = useState(true);
  const [openNotes, setOpenNotes] = useState(true);
  const [openLook, setOpenLook] = useState(false);

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
            appearance: { accent: "#6366f1" },
            notes: "",
            fields: [emptyField()] as { name: string; type: "text"; value: string }[],
          },
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "fields",
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const values = watch();
  const appearance = values.appearance;

  const previewFields = values.fields
    .map((f) => ({ ...f, name: fieldLabel(f.type, f.name) }))
    .filter((f) => f.name.trim() !== "" || f.value.trim() !== "")
    .slice(0, 4);

  async function onSubmit(input: ItemInput) {
    if (saving) return;
    setSaving(true);
    const payload: ItemInput = {
      ...input,
      fields: input.fields
        .filter((f) => f.value.trim() !== "" || f.name.trim() !== "")
        .map((f) => ({ ...f, name: fieldLabel(f.type, f.name), value: f.value ?? "" })),
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

  const submitLabel = mode === "create" ? "Create item" : "Save changes";
  const cancel = () =>
    mode === "edit" && item
      ? router.push(`/vault/items/${item.id}`)
      : router.push("/vault");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      onKeyDown={(e) => {
        if (
          e.key === "Enter" &&
          e.target instanceof HTMLElement &&
          e.target.tagName !== "TEXTAREA" &&
          e.target.tagName !== "BUTTON"
        ) {
          e.preventDefault();
        }
      }}
    >
<div className="sticky top-14 z-30 border-b border-line/80 bg-app/90 backdrop-blur-xl lg:top-0">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <BackLink href={mode === "edit" && item ? `/vault/items/${item.id}` : "/vault"}>
            ← {mode === "edit" ? "Back to item" : "Vault"}
          </BackLink>
          <div className="flex items-center gap-2">
            <Button type="button" variant="secondary" onClick={cancel} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : submitLabel}
            </Button>
          </div>
        </div>
      </div>
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-9">
          <Section title="Basics">
            <div className="space-y-4">
              <FormField label="Name" htmlFor="name" error={errors.name?.message}>
                <Input
                  id="name"
                  autoFocus
                  placeholder="e.g. Netflix account"
                  {...register("name")}
                />
              </FormField>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Category" htmlFor="category">
                  <Select id="category" {...register("category")}>
                    {CATEGORIES.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </Select>
                </FormField>
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
          </Section>

          <div className="overflow-hidden rounded-xl bg-surface ring-1 ring-line divide-y divide-line/60">
            <DetailToggle
              open={openFields}
              onToggle={() => setOpenFields((o) => !o)}
              icon={<FiKey className="h-[17px] w-[17px]" />}
              label="Credential fields"
              meta={fields.length > 0 ? `${fields.length}` : undefined}
            >
            <div className="space-y-2.5">
              {fields.map((field, index) => {
                const type = (values.fields[index]?.type as FieldType) || "text";
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
                    className="rounded-xl bg-surface-2/50 p-3 ring-1 ring-line"
                  >
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <FieldIcon
                        type={type}
                        className="h-4 w-4 shrink-0 text-faint"
                      />
                      {meta.autoName ? (
                        <span className="flex h-8 min-w-0 flex-1 basis-36 items-center px-2 text-sm font-medium text-ink">
                          {meta.autoName}
                        </span>
                      ) : (
                        <input
                          placeholder="Field name"
                          aria-label="Field name"
                          className={cn(
                            "h-8 min-w-0 flex-1 basis-36 rounded-lg border border-transparent bg-transparent px-2 text-sm font-medium text-ink placeholder:font-normal placeholder:text-faint",
                            "focus-visible:border-line-strong focus-visible:bg-surface-2 focus-visible:outline-none",
                          )}
                          {...register(`fields.${index}.name`)}
                        />
                      )}
                      <Select
                        aria-label="Field type"
                        className="h-8 w-36 shrink-0 px-2.5 text-xs"
                        {...register(`fields.${index}.type`)}
                      >
                        {Object.entries(FIELD_TYPE_META).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value.label}
                          </option>
                        ))}
                      </Select>
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
                          className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg text-faint transition-colors hover:bg-danger/10 hover:text-danger"
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
              <FiPlus className="h-4 w-4" />
              Add field
            </Button>
            </DetailToggle>

            <DetailToggle
              open={openNotes}
              onToggle={() => setOpenNotes((o) => !o)}
              icon={<FiFileText className="h-[17px] w-[17px]" />}
              label="Notes"
            >
              <Textarea
                rows={4}
                placeholder="Anything worth remembering…"
                {...register("notes")}
              />
            </DetailToggle>

            <DetailToggle
              open={openLook}
              onToggle={() => setOpenLook((o) => !o)}
              icon={<FiDroplet className="h-[17px] w-[17px]" />}
              label="Icon & color"
            >
              <div className="space-y-7">
                <IconPicker
                  value={values.icon}
                  onChange={(next) => setValue("icon", next)}
                />
                <AppearanceEditor
                  value={appearance}
                  onChange={(next) => setValue("appearance", next)}
                />
              </div>
            </DetailToggle>
          </div>
        </div>

        <aside className="lg:sticky lg:top-20">
<LivePreview
            name={values.name}
            description={values.description}
            icon={values.icon}
            appearance={appearance}
            category={values.category}
            fields={previewFields}
            notes={values.notes ?? ""}
          />
        </aside>
      </div>
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

function DetailToggle({
  open,
  onToggle,
  icon,
  label,
  meta,
  children,
}: {
  open: boolean;
  onToggle: () => void;
  icon: ReactNode;
  label: string;
  meta?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-surface-2/40 focus-visible:bg-surface-2/40 focus-visible:outline-none"
      >
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent-strong">
          {icon}
        </span>
        <span className="flex-1 text-sm font-medium text-ink">{label}</span>
        {meta ? (
          <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-semibold text-muted ring-1 ring-line">
            {meta}
          </span>
        ) : null}
        <FiChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-faint transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>
      {open ? (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="px-4 pb-5 pt-1"
        >
          {children}
        </motion.div>
      ) : null}
    </div>
  );
}

function LivePreview({
  name,
  description,
  icon,
  appearance,
  category,
  fields,
  notes,
}: {
  name: string;
  description: string;
  icon: string;
  appearance: ItemInput["appearance"];
  category: ItemInput["category"];
  fields: { name: string; type: FieldType; value: string }[];
  notes: string;
}) {
  const hasNotes = Boolean(notes?.trim());
  return (
    <div className="overflow-hidden rounded-xl bg-surface ring-1 ring-line">
      <ItemBanner appearance={appearance} />
      <div className={cn("p-4")}>
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
        </div>

        {fields.length > 0 ? (
          <div className="mt-3.5 divide-y divide-line/60 border-t border-line/60">
            {fields.map((f, i) => (
              <div key={i} className="flex items-center justify-between gap-2 py-2">
                <span className="truncate text-[11px] font-medium uppercase tracking-wide text-faint">
                  {f.name}
                </span>
                <span
                  className={cn(
                    "truncate text-[12px] text-ink",
                    isSensitiveType(f.type) && "font-mono tracking-widest",
                  )}
                >
                  {isSensitiveType(f.type) ? "••••••••" : f.value || "—"}
                </span>
              </div>
            ))}
          </div>
        ) : null}

        {hasNotes ? (
          <div className="mt-3 border-t border-line pt-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-faint">
              Notes
            </p>
            <p className="mt-1 line-clamp-2 text-[11.5px] leading-relaxed text-muted">
              {notes}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}