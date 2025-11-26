import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";
import dayjs from "dayjs";

export default function CostBreakdownTable({ costs, onRefresh }) {
  const createPayment = async (costId) => {
    // open payment dialog or call API to create payment request for the cost
    // left for integration with PaymentDialog component
    alert("Tạo yêu cầu thanh toán cho cost " + costId);
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Ngày</TableCell>
          <TableCell>Loại</TableCell>
          <TableCell>Số tiền</TableCell>
          <TableCell>Chia</TableCell>
          <TableCell>Hành động</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {costs.map((c) => (
          <TableRow key={c._id}>
            <TableCell>{dayjs(c.date).format("DD/MM/YYYY")}</TableCell>
            <TableCell>{c.type}</TableCell>
            <TableCell>{c.amount}</TableCell>
            <TableCell>{c.splitMethod}</TableCell>
            <TableCell>
              <Button size="small" onClick={() => createPayment(c._id)}>
                Tạo yêu cầu thanh toán
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
