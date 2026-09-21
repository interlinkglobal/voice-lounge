import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface AppSelectOption {
  value: string;
  label: string;
  disabled?: boolean | undefined;
}

export function AppSelect({
  value,
  onValueChange,
  options,
  placeholder,
  ariaLabel,
  className,
  contentClassName,
}: {
  value?: string | undefined;
  onValueChange: (value: string) => void;
  options: AppSelectOption[];
  placeholder?: string | undefined;
  ariaLabel: string;
  className?: string | undefined;
  contentClassName?: string | undefined;
}) {
  return (
    <Select {...(value === undefined ? {} : { value })} onValueChange={onValueChange}>
      <SelectTrigger
        aria-label={ariaLabel}
        className={cn(
          "min-h-11 min-w-0 w-full overflow-hidden rounded-xl border-hairline bg-background px-3 text-sm font-semibold shadow-none [&>span]:min-w-0 [&>span]:truncate sm:w-auto",
          className,
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent
        position="popper"
        className={cn(
          "z-[220] max-h-[min(24rem,70vh)] min-w-[var(--radix-select-trigger-width)] rounded-xl border-hairline bg-popover",
          contentClassName,
        )}
      >
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            disabled={option.disabled ?? false}
            className="min-h-10 rounded-lg px-3 pr-8 text-sm"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
