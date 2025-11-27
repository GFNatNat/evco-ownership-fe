import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import adminApi from "../../api/adminApi";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import { notifySuccess, notifyError } from "../../utils/notifications";

export default function AdminContractDetail() {
  const { id } = useParams();
  const [contract, setContract] = useState(null);

  const load = async () => {
    try {
      const res = await adminApi.getContract(id);
      setContract(res.data);
    } catch {
      notifyError("Failed to load contract");
    }
  };

  useEffect(() => load(), [id]);

  const sign = async () => {
    try {
      await adminApi.signContract(id);
      notifySuccess("Contract signed");
      load();
    } catch {
      notifyError("Sign failed");
    }
  };

  if (!contract) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <Typography variant="h4" className="mb-4">
        Contract Detail
      </Typography>

      <Card className="shadow p-4">
        <CardContent>
          <Typography variant="h6">{contract.title}</Typography>
          <Typography className="text-gray-600 mb-3">
            Status: {contract.status}
          </Typography>

          <Typography className="font-semibold mb-2">
            Contract Content
          </Typography>
          <pre className="bg-gray-50 p-3 rounded text-sm overflow-auto max-h-80">
            {contract.content}
          </pre>

          {contract.status !== "signed" && (
            <Button className="mt-4" variant="contained" onClick={sign}>
              Sign Contract
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
