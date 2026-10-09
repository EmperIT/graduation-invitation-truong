import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

// Thư mục lưu trữ ảnh tĩnh nội bộ (fallback nếu cloud ngoài timeout)
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy file ảnh' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // 1. Thử upload lên Cloud Image Storage miễn phí (Freeimage.host API)
    try {
      const cloudFormData = new FormData();
      cloudFormData.append('key', '6d207e02198a847e5294950b50ce7b8b'); // Free development API key
      cloudFormData.append('action', 'upload');
      cloudFormData.append('source', buffer.toString('base64'));
      cloudFormData.append('format', 'json');

      const cloudRes = await fetch('https://freeimage.host/api/1/upload', {
        method: 'POST',
        body: cloudFormData,
        signal: AbortSignal.timeout(6000), // Timeout 6s nếu mạng yếu
      });

      if (cloudRes.ok) {
        const cloudData = await cloudRes.json();
        if (cloudData.status_code === 200 && cloudData.image?.url) {
          return NextResponse.json({
            success: true,
            imageUrl: cloudData.image.url,
            storage: 'cloud',
          });
        }
      }
    } catch {
      // Nếu cloud ngoài lỗi hoặc timeout (do mạng chập chờn), tự động chuyển sang lưu trữ cục bộ
    }

    // 2. Fallback: Lưu trực tiếp vào public/uploads trên server
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `img_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    await fs.writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      imageUrl: `/uploads/${fileName}`,
      storage: 'local',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Lỗi tải ảnh lên' },
      { status: 500 }
    );
  }
}
