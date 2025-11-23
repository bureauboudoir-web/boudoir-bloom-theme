import { useState } from "react";
import { Check, ChevronsUpDown, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Creator {
  id: string;
  email: string;
  full_name: string | null;
  profile_picture_url: string | null;
}

interface CreatorSelectorProps {
  creators: Creator[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  placeholder?: string;
  label?: string;
}

const getInitials = (name: string | null, email: string) => {
  if (name) {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
};

const getAvatarColor = (id: string) => {
  const colors = [
    "bg-rose-500",
    "bg-purple-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-amber-500",
    "bg-pink-500",
  ];
  const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

export function CreatorSelector({
  creators,
  value,
  onChange,
  multiple = false,
  placeholder = "Search creators...",
}: CreatorSelectorProps) {
  const [open, setOpen] = useState(false);

  const selectedIds = Array.isArray(value) ? value : [value];
  const selectedCreators = creators.filter((c) => selectedIds.includes(c.id));

  const handleSelect = (creatorId: string) => {
    if (multiple) {
      const currentValue = Array.isArray(value) ? value : [];
      const newValue = currentValue.includes(creatorId)
        ? currentValue.filter((id) => id !== creatorId)
        : [...currentValue, creatorId];
      onChange(newValue);
    } else {
      onChange(creatorId);
      setOpen(false);
    }
  };

  const getDisplayText = () => {
    if (selectedCreators.length === 0) return placeholder;
    if (selectedCreators.length === 1) {
      const creator = selectedCreators[0];
      return creator.full_name || creator.email;
    }
    return `${selectedCreators.length} creators selected`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <span className="truncate">{getDisplayText()}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandEmpty>No creator found.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {creators.map((creator) => {
              const isSelected = selectedIds.includes(creator.id);
              const initials = getInitials(creator.full_name, creator.email);
              const avatarColor = getAvatarColor(creator.id);

              return (
                <CommandItem
                  key={creator.id}
                  value={`${creator.full_name} ${creator.email}`}
                  onSelect={() => handleSelect(creator.id)}
                  className="flex items-center gap-3 px-2 py-3"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={creator.profile_picture_url || undefined} />
                    <AvatarFallback className={cn("text-white text-xs", avatarColor)}>
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {creator.full_name || "No name"}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {creator.email}
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                  )}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function CreatorSelectorMultiple({
  creators,
  value,
  onChange,
  placeholder = "Search and select creators...",
}: Omit<CreatorSelectorProps, "multiple">) {
  const [open, setOpen] = useState(false);
  const selectedIds = Array.isArray(value) ? value : [];
  const selectedCreators = creators.filter((c) => selectedIds.includes(c.id));

  const handleSelect = (creatorId: string) => {
    const currentValue = Array.isArray(value) ? value : [];
    const newValue = currentValue.includes(creatorId)
      ? currentValue.filter((id) => id !== creatorId)
      : [...currentValue, creatorId];
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <span className="truncate">
              {selectedCreators.length === 0
                ? placeholder
                : `${selectedCreators.length} creators selected`}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search by name or email..." />
            <CommandEmpty>No creator found.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {creators.map((creator) => {
                const isSelected = selectedIds.includes(creator.id);
                const initials = getInitials(creator.full_name, creator.email);
                const avatarColor = getAvatarColor(creator.id);

                return (
                  <CommandItem
                    key={creator.id}
                    value={`${creator.full_name} ${creator.email}`}
                    onSelect={() => handleSelect(creator.id)}
                    className="flex items-center gap-3 px-2 py-3"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={creator.profile_picture_url || undefined} />
                      <AvatarFallback className={cn("text-white text-xs", avatarColor)}>
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {creator.full_name || "No name"}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {creator.email}
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="h-4 w-4 shrink-0 text-primary" />
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      {selectedCreators.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedCreators.map((creator) => (
            <Badge key={creator.id} variant="secondary" className="gap-1">
              <Avatar className="h-4 w-4">
                <AvatarImage src={creator.profile_picture_url || undefined} />
                <AvatarFallback className={cn("text-[8px]", getAvatarColor(creator.id))}>
                  {getInitials(creator.full_name, creator.email)}
                </AvatarFallback>
              </Avatar>
              {creator.full_name || creator.email}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
