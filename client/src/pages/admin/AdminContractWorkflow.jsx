import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import adminApi from "../../api/adminApi";
import {
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import { notifySuccess, notifyError } from "../../utils/notifications";

export default function AdminContractWorkflow() {
  const { id } = useParams();
  const [contract, setContract] = useState(null);
  const [active, setActive] = useState(0);

  const steps = ["Draft", "Pending Signatures", "Signed", "Completed"];

  const load = async () => {
    const res = await adminApi.getContract(id);
    setContract(res.data);
    const stepMap = { draft: 0, pending: 1, signed: 2, completed: 3 };
    setActive(stepMap[res.data.status] || 0);
  };

  useEffect(() => load(), [id]);

  const nextStep = async () => {
    try {
      await adminApi.signContract(id);
      notifySuccess("Progressed workflow");
      load();
    } catch {
      notifyError("Workflow update failed");
    }
  };

  if (!contract) return <div className="p-6">Loading workflow...</div>;

  return (
    <div className="p-6">
      <Typography variant="h4" className="mb-4">
        Contract Signing Workflow
      </Typography>

      <Stepper activeStep={active} className="mb-6">
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Card className="shadow p-4">
        <CardContent>
          <Typography variant="h6">{contract.title}</Typography>
          <Typography>Status: {contract.status}</Typography>

          {active < 3 && (
            <Button className="mt-4" variant="contained" onClick={nextStep}>
              Next Step
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
