import {
  useInvoiceList,
} from "@/invoice/hooks/useInvoice";
import { useOutlets } from "@/master/outlet/hooks/useOutlet";
import { useProducts } from "@/master/product/hooks/useProduct";
import { usePembayaranInvoiceList } from "@/pembayaran-invoice/hooks/usePembayaranInvoice";
import { usePlans } from "@/plan/hooks/usePlan";

export function useDashboardMetrics() {
  const plans = usePlans({ page: 1, limit: 1 });
  const outlets = useOutlets();
  const products = useProducts();
  const invoices = useInvoiceList();
  const payments = usePembayaranInvoiceList();

  return {
    plans,
    outlets,
    products,
    invoices,
    payments,
  };
}
