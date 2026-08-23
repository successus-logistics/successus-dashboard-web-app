import { apiFetch } from "@/lib/auth/client";
import { ContractVault } from "./_components/contract-vault";
import { ClientRecord } from "./_components/contract-data";

async function getContracts() {
  const response = await apiFetch<ClientRecord[]>("/api/business/contracts/");
  return response;
}

export default async function ContractsPage() {
  const data = (await getContracts()) ?? [];
  return <ContractVault clientData={data} />;
}
