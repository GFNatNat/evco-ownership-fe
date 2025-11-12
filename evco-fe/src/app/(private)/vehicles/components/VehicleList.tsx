"use client";
import VehicleCard from "./VehicleCard";

const dummyVehicles = [
  {
    id: 1,
    name: "Tesla Model 3",
    licensePlate: "30G-12345",
    status: "Đang sử dụng",
    battery: 78,
    mileage: 21000,
  },
  {
    id: 2,
    name: "VinFast VF8",
    licensePlate: "51K-56789",
    status: "Sẵn sàng",
    battery: 94,
    mileage: 9400,
  },
];

export default function VehicleList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {dummyVehicles.map((v) => (
        <VehicleCard key={v.id} vehicle={v} />
      ))}
    </div>
  );
}
