import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { User } from "lucide-react";

interface Creator {
  id: string;
  full_name: string | null;
  email: string;
  profile_picture_url: string | null;
}

interface CreatorSelectorProps {
  creators: Creator[];
  selectedCreatorId: string | null;
  onSelectCreator: (creatorId: string) => void;
  loading?: boolean;
}

export const CreatorSelector = ({
  creators,
  selectedCreatorId,
  onSelectCreator,
  loading = false
}: CreatorSelectorProps) => {
  const selectedCreator = creators.find(c => c.id === selectedCreatorId);

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return email.slice(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <Card className="p-4 mb-6">
        <div className="h-10 bg-muted animate-pulse rounded" />
      </Card>
    );
  }

  if (creators.length === 0) {
    return (
      <Card className="p-4 mb-6 text-center">
        <p className="text-muted-foreground">No creators assigned yet</p>
      </Card>
    );
  }

  return (
    <Card className="p-4 mb-6">
      <div className="flex items-center gap-4">
        <User className="h-5 w-5 text-muted-foreground" />
        <div className="flex-1">
          <Select value={selectedCreatorId || undefined} onValueChange={onSelectCreator}>
            <SelectTrigger className="w-full">
              <SelectValue>
                {selectedCreator && (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={selectedCreator.profile_picture_url || undefined} />
                      <AvatarFallback className="text-xs">
                        {getInitials(selectedCreator.full_name, selectedCreator.email)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{selectedCreator.full_name || selectedCreator.email}</span>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {creators.map(creator => (
                <SelectItem key={creator.id} value={creator.id}>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={creator.profile_picture_url || undefined} />
                      <AvatarFallback className="text-xs">
                        {getInitials(creator.full_name, creator.email)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{creator.full_name || creator.email}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
};
