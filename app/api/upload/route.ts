import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

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
    const mimeType = file.type || 'image/jpeg';
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `img_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;

    // 1. Nếu có cấu hình Vercel Blob (Token BLOB_READ_WRITE_TOKEN trong Vercel Storage)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { put } = await import('@vercel/blob');
        const blob = await put(fileName, file, { access: 'public' });
        return NextResponse.json({
          success: true,
          imageUrl: blob.url,
          storage: 'vercel-blob',
        });
      } catch (blobErr) {
        console.error('Lỗi upload Vercel Blob:', blobErr);
      }
    }

    // 2. Nếu có cấu hình ImgBB API Key
    if (process.env.IMGBB_API_KEY) {
      try {
        const imgbbForm = new FormData();
        imgbbForm.append('image', buffer.toString('base64'));
        const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, {
          method: 'POST',
          body: imgbbForm,
        });
        if (imgbbRes.ok) {
          const imgbbData = await imgbbRes.json();
          if (imgbbData?.data?.url) {
            return NextResponse.json({
              success: true,
              imageUrl: imgbbData.data.url,
              storage: 'imgbb',
            });
          }
        }
      } catch (imgbbErr) {
        console.error('Lỗi upload ImgBB:', imgbbErr);
      }
    }

    // 3. Môi trường local (cho phép ghi file vào thư mục public/uploads)
    try {
      await fs.mkdir(UPLOAD_DIR, { recursive: true });
      const filePath = path.join(UPLOAD_DIR, fileName);
      await fs.writeFile(filePath, buffer);
      return NextResponse.json({
        success: true,
        imageUrl: `/uploads/${fileName}`,
        storage: 'local',
      });
    } catch {
      // Trên Vercel serverless là Read-Only (EROFS), tự động chuyển sang Data URL
    }

    // 4. Fallback tự động trên Vercel khi chưa gắn cloud storage: Trả về Base64 Data URL trực tiếp
    // Ảnh đã được nén ở client xuống ~100-200KB nên Data URL hoàn toàn hiển thị mượt mà trên mọi thiết bị
    const base64Data = buffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64Data}`;

    return NextResponse.json({
      success: true,
      imageUrl: dataUrl,
      storage: 'data-url',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Lỗi tải ảnh lên' },
      { status: 500 }
    );
  }
}
