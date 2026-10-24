import { RefreshCw } from "lucide-react";
import { useMe } from "@/auth/hooks/useAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDashboardMetrics } from "../hooks/useDashboardMetrics";

export function DashboardPage() {
  const { data: user } = useMe();
  const metrics = useDashboardMetrics();
  const isFetching = Object.values(metrics).some((query) => query.isFetching);
  const refresh = () => {
    void Promise.all(
      Object.values(metrics).map((query) => query.refetch()),
    );
  };
  const cards = [
    {
      title: "Total Rencana Kanvas",
      description: "Jumlah seluruh rencana kanvas",
      query: metrics.plans,
      value: metrics.plans.data?.meta.total,
    },
    {
      title: "Total Outlet",
      description: "Seluruh outlet terdaftar",
      query: metrics.outlets,
      value: metrics.outlets.data?.length,
    },
    {
      title: "Total Produk",
      description: "Seluruh produk terdaftar",
      query: metrics.products,
      value: metrics.products.data?.length,
    },
    {
      title: "Total Invoice",
      description: "Seluruh invoice penjualan",
      query: metrics.invoices,
      value: metrics.invoices.data?.length,
    },
    {
      title: "Total Pembayaran",
      description: "Jumlah catatan pembayaran invoice",
      query: metrics.payments,
      value: metrics.payments.data?.length,
    },
  ];

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="grid gap-1">
          <h2 className="text-2xl font-semibold">
            {user?.username ?? "Dashboard"}
          </h2>
          <p className="text-sm text-muted-foreground">
            Ringkasan data Sales Kanvas.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={refresh}
          disabled={isFetching}
        >
          <RefreshCw className={isFetching ? "animate-spin" : ""} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(({ title, description, query, value }) => (
          <Card key={title}>
            <CardHeader>
              <CardDescription>{description}</CardDescription>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
              {query.isLoading ? (
                <p className="text-2xl font-semibold text-muted-foreground">
                  Memuat…
                </p>
              ) : query.isError ? (
                <p className="text-sm text-destructive">
                  Data tidak dapat dimuat.
                </p>
              ) : (
                <p className="text-3xl font-semibold tabular-nums">
                  {value?.toLocaleString("id-ID") ?? "0"}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
