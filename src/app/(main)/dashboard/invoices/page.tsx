import { apiFetch } from "@/lib/auth/client";
import { InvoiceList } from "./_components/invoice-list";

async function getInvoiceData() {
  const response = await apiFetch("/api/invoices/");
  return response;
}

export default async function InvoicesPage() {
  const invoiceData = await getInvoiceData();
  console.log(invoiceData);
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <InvoiceList invoiceData={invoiceData} />
    </div>
  );
}
