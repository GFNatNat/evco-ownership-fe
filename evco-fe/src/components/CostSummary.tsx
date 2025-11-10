export default function CostSummary() {
  // TODO: Gọi paymentApi / admin.reports để hiển thị thực tế
  return (
    <div>
      <h4 className="font-semibold mb-2">Tổng kết chi phí tháng này</h4>
      <div className="text-sm text-gray-700 space-y-1">
        <div>Phí sạc điện: 1.200.000đ</div>
        <div>Bảo dưỡng: 500.000đ</div>
        <div>Bảo hiểm: 0đ</div>
        <div>Đăng kiểm: 0đ</div>
        <div>Vệ sinh xe: 150.000đ</div>
        <div className="font-semibold mt-2">Tổng: 1.850.000đ</div>
      </div>
    </div>
  );
}
