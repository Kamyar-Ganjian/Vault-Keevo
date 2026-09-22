import { Spinner } from "@/components/ui/spinner";

export default function VaultLoading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <Spinner className="h-6 w-6 text-muted" />
    </div>
  );
}
