// calculate splitting by ownership or usage
export type SplitMethod = "ownership" | "usage";

export interface Owner {
  id: number;
  name: string;
  sharePercent: number; // e.g. 40 for 40%
  usageAmount?: number; // e.g. km or hours (optional, for usage-based)
}

// totalCost in VND
export function splitCost(
  owners: Owner[],
  totalCost: number,
  method: SplitMethod = "ownership"
) {
  if (method === "ownership") {
    // split according to sharePercent
    const result = owners.map((o) => ({
      ...o,
      amount: Math.round((totalCost * o.sharePercent) / 100),
    }));
    // fix rounding: adjust last owner
    const sum = result.reduce((s, r) => s + r.amount, 0);
    const diff = totalCost - sum;
    if (diff !== 0 && result.length > 0) {
      result[result.length - 1].amount += diff;
    }
    return result;
  } else {
    // usage-based: proportion to usageAmount
    const totalUsage = owners.reduce((s, o) => s + (o.usageAmount || 0), 0);
    if (totalUsage === 0) {
      // fallback to even split
      const even = Math.floor(totalCost / owners.length);
      const res = owners.map((o) => ({ ...o, amount: even }));
      res[res.length - 1].amount += totalCost - res.reduce((s, r) => s + r.amount, 0);
      return res;
    }
    const result = owners.map((o) => ({
      ...o,
      amount: Math.round(((o.usageAmount || 0) / totalUsage) * totalCost),
    }));
    const sum = result.reduce((s, r) => s + r.amount, 0);
    const diff = totalCost - sum;
    if (diff !== 0 && result.length > 0) {
      result[result.length - 1].amount += diff;
    }
    return result;
  }
}
