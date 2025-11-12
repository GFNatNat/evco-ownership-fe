export interface Invoice {
  id: string;
  groupId: number;
  vehicleId?: number;
  title: string;
  items: { desc: string; amount: number }[];
  total: number;
  date: string;
  status: "PENDING" | "PAID" | "OVERDUE";
  splitMethod: "ownership" | "usage";
}
