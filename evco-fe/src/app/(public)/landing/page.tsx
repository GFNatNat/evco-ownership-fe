export default function Landing() {
  return (
    <div className="min-h-[80vh] grid place-items-center p-8">
      <div className="max-w-2xl text-center">
        <h1 className="text-3xl font-semibold mb-3">EV Co-ownership & Cost-sharing</h1>
        <p className="text-gray-600">Phần mềm quản lý đồng sở hữu & chia sẻ chi phí xe điện.</p>
        <div className="mt-6 flex gap-3 justify-center">
          <a className="px-4 py-2 rounded bg-blue-600 text-white" href="/login">Đăng nhập</a>
          <a className="px-4 py-2 rounded border" href="/register">Đăng ký</a>
        </div>
      </div>
    </div>
  );
}
