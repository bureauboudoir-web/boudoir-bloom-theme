import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { RoleNavigation } from "@/components/RoleNavigation";
import { creatorNavigation } from "@/config/roleNavigation";

export default function CreatorDetail() {
  const { id } = useParams<{ id: string }>();

  return (
    <DashboardLayout
      navigation={<RoleNavigation sections={creatorNavigation} />}
      title="Creator Detail"
    >
      <Card>
        <CardHeader>
          <CardTitle>Creator Detail</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">Creator ID Loaded: <span className="font-mono font-semibold">{id}</span></p>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
