import { Route, Routes } from "react-router-dom";
import { LoginPage } from "@/auth/components/login-page";
import { RequireAuth } from "@/auth/components/require-auth";
import { RequirePermission } from "@/auth/components/require-permission";
import { AdminLayout } from "@/components/layout/admin-layout";
import { DashboardPage } from "@/dashboard/components/dashboard-page";
import { KasbonOperasionalPage } from "@/kasbon-operasional/components/kasbon-operasional-page";
import { KasbonProdukPage } from "@/kasbon-produk/components/kasbon-produk-page";
import { EmployeePage } from "@/master/employee/components/employee-page";
import { GudangPage } from "@/master/gudang/components/gudang-page";
import { MarketAreaPage } from "@/master/market-area/components/market-area-page";
import { OutletPage } from "@/master/outlet/components/outlet-page";
import { ProductPage } from "@/master/product/components/product-page";
import { TipeHargaPage } from "@/master/tipe-harga/components/tipe-harga-page";
import { VehiclePage } from "@/master/vehicle/components/vehicle-page";
import { ProdukHargaPage } from "@/produk-harga/components/produk-harga-page";
import { ProdukOutPage } from "@/produk-out/components/produk-out-page";
import { ProdukInPage } from "@/produk-in/components/produk-in-page";
import { BatchProdukPage } from "@/batch-produk/components/batch-produk-page";
import { MutasiBatchPage } from "@/mutasi-batch/components/mutasi-batch-page";
import { InvoicePage } from "@/invoice/components/invoice-page";
import { ReturPage } from "@/retur/components/retur-page";
import { KartuPiutangPage } from "@/kartu-piutang/components/kartu-piutang-page";
import { PembayaranInvoicePage } from "@/pembayaran-invoice/components/pembayaran-invoice-page";
import { PlanDetailPage } from "@/plan/components/plan-detail-page";
import { PlanFormPage } from "@/plan/components/plan-form-page";
import { PlanListPage } from "@/plan/components/plan-list-page";
import { RolesPage } from "@/roles/components/roles-page";
import { UserManagementPage } from "@/user-management/components/user-management-page";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<RequireAuth />}>
        <Route element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />

          <Route element={<RequirePermission permission="employee:read" />}>
            <Route path="/master/employee" element={<EmployeePage />} />
          </Route>
          <Route element={<RequirePermission permission="gudang:read" />}>
            <Route path="/master/gudang" element={<GudangPage />} />
          </Route>
          <Route element={<RequirePermission permission="market-area:read" />}>
            <Route path="/master/market-area" element={<MarketAreaPage />} />
          </Route>
          <Route element={<RequirePermission permission="outlet:read" />}>
            <Route path="/master/outlet" element={<OutletPage />} />
          </Route>
          <Route element={<RequirePermission permission="produk:read" />}>
            <Route path="/master/product" element={<ProductPage />} />
          </Route>
          <Route element={<RequirePermission permission="tipe-harga:read" />}>
            <Route path="/master/tipe-harga" element={<TipeHargaPage />} />
          </Route>
          <Route element={<RequirePermission permission="produk-harga:read" />}>
            <Route path="/produk-harga" element={<ProdukHargaPage />} />
          </Route>
          <Route element={<RequirePermission permission="vehicle:read" />}>
            <Route path="/master/vehicle" element={<VehiclePage />} />
          </Route>
          <Route element={<RequirePermission permission="role:manage" />}>
            <Route path="/master/users" element={<UserManagementPage />} />
            <Route path="/master/roles" element={<RolesPage />} />
          </Route>

          <Route element={<RequirePermission permission="plan:read" />}>
            <Route path="/plan" element={<PlanListPage />} />
            <Route path="/plan/:id" element={<PlanDetailPage />} />
          </Route>
          <Route element={<RequirePermission permission="plan:write" />}>
            <Route path="/plan/new" element={<PlanFormPage />} />
            <Route path="/plan/:id/edit" element={<PlanFormPage />} />
          </Route>

          <Route
            path="/kasbon-operasional"
            element={<KasbonOperasionalPage />}
          />

          <Route path="/kasbon-produk" element={<KasbonProdukPage />} />

          <Route element={<RequirePermission permission="produk-out:read" />}>
            <Route path="/produk-out" element={<ProdukOutPage />} />
          </Route>

          <Route element={<RequirePermission permission="produk-in:read" />}>
            <Route path="/produk-in" element={<ProdukInPage />} />
          </Route>

          <Route element={<RequirePermission permission="batch-produk:read" />}>
            <Route path="/batch-produk" element={<BatchProdukPage />} />
          </Route>

          <Route element={<RequirePermission permission="mutasi-batch:read" />}>
            <Route path="/mutasi-batch" element={<MutasiBatchPage />} />
          </Route>

          <Route element={<RequirePermission permission="invoice:read" />}>
            <Route path="/invoice" element={<InvoicePage />} />
          </Route>

          <Route element={<RequirePermission permission="retur:read" />}>
            <Route path="/retur" element={<ReturPage />} />
          </Route>

          <Route element={<RequirePermission permission="kartu-piutang:read" />}>
            <Route
              path="/kartu-piutang"
              element={<KartuPiutangPage />}
            />
          </Route>

          <Route
            element={<RequirePermission permission="pembayaran-invoice:read" />}
          >
            <Route
              path="/pembayaran-invoice"
              element={<PembayaranInvoicePage />}
            />
          </Route>

          {/* <Route
            path="/master/kasbon-material-type"
            element={<KasbonMaterialTypePage />}
          /> */}

          <Route
            path="*"
            element={
              <p className="text-sm text-muted-foreground">
                Halaman tidak ditemukan.
              </p>
            }
          />
        </Route>
      </Route>
    </Routes>
  );
}
