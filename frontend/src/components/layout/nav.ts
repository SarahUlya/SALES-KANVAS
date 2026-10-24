import {
  ClipboardList,
  LayoutDashboard,
  MapPin,
  Package,
  RotateCcw,
  ShieldCheck,
  Store,
  Tags,
  Truck,
  Users,
  UserCog,
  Wallet,
  Warehouse,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  permission?: string;
};

export const NAV: { label: string; items: NavItem[] }[] = [
  {
    label: "Umum",
    items: [{ title: "Dashboard", url: "/", icon: LayoutDashboard }],
  },
  {
    label: "Master",
    items: [
      {
        title: "Karyawan",
        url: "/master/employee",
        icon: Users,
        permission: "employee:read",
      },
      {
        title: "Gudang",
        url: "/master/gudang",
        icon: Warehouse,
        permission: "gudang:read",
      },
      {
        title: "Market Area",
        url: "/master/market-area",
        icon: MapPin,
        permission: "market-area:read",
      },
      {
        title: "Outlet",
        url: "/master/outlet",
        icon: Store,
        permission: "outlet:read",
      },
      {
        title: "Produk",
        url: "/master/product",
        icon: Package,
        permission: "produk:read",
      },
      {
        title: "Tipe Harga",
        url: "/master/tipe-harga",
        icon: Tags,
        permission: "tipe-harga:read",
      },
      {
        title: "Produk Harga",
        url: "/produk-harga",
        icon: Tags,
        permission: "produk-harga:read",
      },
      {
        title: "Kendaraan",
        url: "/master/vehicle",
        icon: Truck,
        permission: "vehicle:read",
      },
      {
        title: "Manajemen User",
        url: "/master/users",
        icon: UserCog,
        permission: "role:manage",
      },
      {
        title: "Role & Permission",
        url: "/master/roles",
        icon: ShieldCheck,
        permission: "role:manage",
      },
      // {
      //   title: "Jenis Kasbon Material",
      //   url: "/master/kasbon-material-type",
      //   icon: Wallet,
      // },
    ],
  },
  {
    label: "Transaksi",
    items: [
      {
        title: "Sales Kanvas Plan",
        url: "/plan",
        icon: ClipboardList,
        permission: "plan:read",
      },
      {
        title: "Kasbon Operasional",
        url: "/kasbon-operasional",
        icon: Wallet,
      },
      {
        title: "Kasbon Produk",
        url: "/kasbon-produk",
        icon: Package,
      },
      {
        title: "Produk Keluar",
        url: "/produk-out",
        icon: Package,
        permission: "produk-out:read",
      },
      {
        title: "Produk Masuk",
        url: "/produk-in",
        icon: Package,
        permission: "produk-in:read",
      },
      {
        title: "Batch Produk / Stok",
        url: "/batch-produk",
        icon: Package,
        permission: "batch-produk:read",
      },
      {
        title: "Mutasi Batch",
        url: "/mutasi-batch",
        icon: ClipboardList,
        permission: "mutasi-batch:read",
      },
      {
        title: "Invoice Penjualan",
        url: "/invoice",
        icon: ClipboardList,
        permission: "invoice:read",
      },
      {
        title: "Retur Produk",
        url: "/retur",
        icon: RotateCcw,
        permission: "retur:read",
      },
      {
        title: "Kartu Piutang Outlet",
        url: "/kartu-piutang",
        icon: Wallet,
        permission: "kartu-piutang:read",
      },
      {
        title: "Pembayaran Invoice",
        url: "/pembayaran-invoice",
        icon: Wallet,
        permission: "pembayaran-invoice:read",
      },
    ],
  },
];

export const isActive = (pathname: string, url: string) =>
  url === "/" ? pathname === "/" : pathname.startsWith(url);
