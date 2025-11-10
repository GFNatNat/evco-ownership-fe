export default function OwnershipCard() {
  // TODO: Gọi API profile & hợp đồng
  return (
    <div>
      <h4 className="font-semibold mb-2">Tỷ lệ sở hữu</h4>
      <ul className="text-sm text-gray-700">
        <li>Bạn: 40%</li>
        <li>Thành viên B: 30%</li>
        <li>Thành viên C: 30%</li>
      </ul>
      <div className="mt-3 text-sm text-blue-600 underline cursor-pointer">Xem hợp đồng đồng sở hữu</div>
    </div>
  );
}
