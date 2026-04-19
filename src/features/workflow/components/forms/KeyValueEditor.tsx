/**
 * Reusable controlled key/value editor for node metadata and custom fields.
 */
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { KeyValuePair } from "../../types/workflow";

interface KeyValueEditorProps {
  label: string;
  value: KeyValuePair[];
  onChange: (next: KeyValuePair[]) => void;
}

const uid = () => Math.random().toString(36).slice(2, 9);

export function KeyValueEditor({ label, value, onChange }: KeyValueEditorProps) {
  const update = (id: string, patch: Partial<KeyValuePair>) =>
    onChange(value.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  return (
    <div className="space-y-2">
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">{label}</Label>
      <div className="space-y-2">
        {value.map((pair) => (
          <div key={pair.id} className="flex items-center gap-2">
            <Input
              placeholder="key"
              value={pair.key}
              onChange={(e) => update(pair.id, { key: e.target.value })}
              className="h-9"
            />
            <Input
              placeholder="value"
              value={pair.value}
              onChange={(e) => update(pair.id, { value: e.target.value })}
              className="h-9"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0"
              onClick={() => onChange(value.filter((p) => p.id !== pair.id))}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => onChange([...value, { id: uid(), key: "", value: "" }])}
      >
        <Plus className="h-3.5 w-3.5" /> Add field
      </Button>
    </div>
  );
}
