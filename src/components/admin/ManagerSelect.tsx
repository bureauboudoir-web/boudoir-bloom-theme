import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Manager {
  id: string;
  full_name: string;
  email: string;
}

interface ManagerSelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  excludeUserId?: string; // Used to prevent self-assignment
}

export const ManagerSelect = ({ value, onChange, label = "Assign to", excludeUserId }: ManagerSelectProps) => {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchManagers();
  }, []);

  const fetchManagers = async () => {
    try {
      // Get all users with admin or manager roles
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('user_id')
        .in('role', ['admin', 'manager', 'super_admin']);

      if (roleError) throw roleError;

      const managerIds = [...new Set(roleData?.map(r => r.user_id))];

      if (managerIds.length === 0) {
        setManagers([]);
        return;
      }

      // Fetch profiles for these users
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', managerIds);

      if (profileError) throw profileError;

      // Filter out the excluded user if provided (to prevent self-assignment)
      const filteredProfiles = excludeUserId 
        ? profiles?.filter(p => p.id !== excludeUserId) || []
        : profiles || [];

      setManagers(filteredProfiles);
    } catch (error) {
      console.error("Error fetching managers:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Loading..." />
          </SelectTrigger>
        </Select>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select admin/manager" />
        </SelectTrigger>
        <SelectContent>
          {managers.map((manager) => (
            <SelectItem key={manager.id} value={manager.id}>
              {manager.full_name || manager.email} ({manager.email})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
