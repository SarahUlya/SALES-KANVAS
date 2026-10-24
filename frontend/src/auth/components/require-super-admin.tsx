import { Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useMe } from "../hooks/useAuth";

export function RequireSuperAdmin() {
  const { data: user, isPending, isError, refetch } = useMe();

  if (isPending) {
    return (
      <div className="grid min-h-40 place-items-center text-sm text-muted-foreground">
        Memuat…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-40 flex-col items-center justify-center gap-3 p-4 text-sm">
        <p>Tidak dapat memuat informasi pengguna.</p>
        <Button variant="outline" onClick={() => refetch()}>
          Coba lagi
        </Button>
      </div>
    );
  }

  const roleName = user?.role?.name.trim().toLowerCase();
  if (roleName !== "super admin" && roleName !== "superadmin") {
    return (
      <p className="text-sm text-muted-foreground">
        Anda tidak punya akses ke halaman ini.
      </p>
    );
  }

  return <Outlet />;
}
