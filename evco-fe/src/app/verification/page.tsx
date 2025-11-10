import Topbar from '@/components/Topbar';
import UploadKYC from '@/components/UploadKYC';

export default function VerificationPage() {
  return (
    <>
      <Topbar />
      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-xl font-semibold mb-3">Xác minh danh tính & giấy tờ</h2>
        <p className="text-gray-600 mb-4">Tải lên CMND/CCCD và Giấy phép lái xe để chuyển quyền sang Co-owner.</p>
        <UploadKYC />
      </div>
    </>
  );
}
