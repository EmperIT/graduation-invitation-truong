import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { Redis } from '@upstash/redis';

export const dynamic = 'force-dynamic';

const DATA_FILE = path.join(process.cwd(), 'data', 'status.json');

export interface StatusMessage {
  id: number;
  text: string;
  timestamp: string;
  isWelcome?: boolean;
  imageUrl?: string;
  location?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
}

export interface StatusData {
  isUnlocked: boolean;
  lockedMessage: string;
  messages: StatusMessage[];
}

export const DEFAULT_WELCOME_MESSAGE: StatusMessage = {
  id: 1,
  text: 'Chào mừng mọi người! Đây là kênh cập nhật vị trí và tình hình trực tiếp của buổi lễ tốt nghiệp.',
  timestamp: '',
  isWelcome: true,
};

// Khởi tạo Redis client nếu có cấu hình trên Vercel hoặc biến môi trường
function getRedisClient(): Redis | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    return new Redis({ url, token });
  }
  return null;
}

// In-memory store dự phòng để tránh crash EROFS trên Vercel Serverless
let memoryStore: StatusData = {
  isUnlocked: false,
  lockedMessage: 'Tính năng này sẽ được sử dụng vào ngày tốt nghiệp',
  messages: [],
};
let memoryInitialized = false;

async function getStatusData(): Promise<StatusData> {
  const redis = getRedisClient();
  if (redis) {
    try {
      const data = await redis.get<StatusData | string>('graduation_status');
      if (data) {
        const parsed: StatusData = typeof data === 'string' ? JSON.parse(data) : data;
        return {
          isUnlocked: Boolean(parsed.isUnlocked),
          lockedMessage: parsed.lockedMessage || 'Tính năng này sẽ được sử dụng vào ngày tốt nghiệp',
          messages: Array.isArray(parsed.messages)
            ? parsed.messages.filter((m: any) => m.id !== 1 && !m.isWelcome)
            : [],
        };
      }
    } catch (redisErr) {
      console.error('Lỗi đọc Upstash Redis:', redisErr);
    }
  }

  // Nếu đang chạy và memoryStore đã được cập nhật bởi Host
  if (memoryInitialized) {
    return memoryStore;
  }

  // Thử đọc từ local file (lần đầu khởi chạy)
  try {
    const content = await fs.readFile(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(content);
    
    if (Array.isArray(parsed)) {
      const hostMessages = parsed.filter((m: any) => m.id !== 1 && !m.isWelcome);
      memoryStore = {
        isUnlocked: false,
        lockedMessage: 'Tính năng này sẽ được sử dụng vào ngày tốt nghiệp',
        messages: hostMessages,
      };
      memoryInitialized = true;
      return memoryStore;
    }

    memoryStore = {
      isUnlocked: typeof parsed.isUnlocked === 'boolean' ? parsed.isUnlocked : false,
      lockedMessage: parsed.lockedMessage || 'Tính năng này sẽ được sử dụng vào ngày tốt nghiệp',
      messages: Array.isArray(parsed.messages)
        ? parsed.messages.filter((m: any) => m.id !== 1 && !m.isWelcome)
        : [],
    };
    memoryInitialized = true;
    return memoryStore;
  } catch {
    // Trên Vercel hoặc nếu không đọc được file, dùng memoryStore
    return memoryStore;
  }
}

async function saveStatusData(data: StatusData): Promise<void> {
  memoryStore = data;
  memoryInitialized = true;

  const redis = getRedisClient();
  if (redis) {
    try {
      await redis.set('graduation_status', data);
      return;
    } catch (redisErr) {
      console.error('Lỗi lưu Upstash Redis:', redisErr);
    }
  }

  // Fallback lưu file cục bộ (chỉ ghi được ở môi trường local)
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch {
    // Trên Vercel file system là Read-Only (EROFS), bỏ qua không throw lỗi 500
  }
}

// GET: Lấy trạng thái khóa, tin nhắn (kèm tin chào mừng mặc định) và GPS mới nhất
export async function GET() {
  try {
    const data = await getStatusData();
    const allMessages: StatusMessage[] = [DEFAULT_WELCOME_MESSAGE, ...data.messages];

    // Lấy toạ độ GPS gần nhất từ tin nhắn thực tế của Host
    const latestMsgWithLocation = [...data.messages].reverse().find((m) => m.location);
    const latestGps = latestMsgWithLocation?.location || null;

    return NextResponse.json({
      success: true,
      isUnlocked: data.isUnlocked,
      lockedMessage: data.lockedMessage,
      messages: allMessages,
      hostMessages: data.messages,
      latestGps,
      storage: getRedisClient() ? 'upstash-redis' : 'fallback-memory',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Lỗi đọc dữ liệu' },
      { status: 500 }
    );
  }
}

// POST: Host cập nhật tin nhắn HOẶC bật/tắt mở khóa tính năng
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await getStatusData();

    // 1. Cập nhật trạng thái khóa/mở khóa (Lock/Unlock)
    if (body.action === 'toggleUnlock' || typeof body.isUnlocked === 'boolean') {
      data.isUnlocked = Boolean(body.isUnlocked);
      if (typeof body.lockedMessage === 'string' && body.lockedMessage.trim()) {
        data.lockedMessage = body.lockedMessage.trim();
      }
      await saveStatusData(data);

      const allMessages = [DEFAULT_WELCOME_MESSAGE, ...data.messages];
      const latestMsgWithLocation = [...data.messages].reverse().find((m) => m.location);
      const latestGps = latestMsgWithLocation?.location || null;

      return NextResponse.json({
        success: true,
        isUnlocked: data.isUnlocked,
        lockedMessage: data.lockedMessage,
        messages: allMessages,
        hostMessages: data.messages,
        latestGps,
        storage: getRedisClient() ? 'upstash-redis' : 'fallback-memory',
      });
    }

    // 2. Gửi tin nhắn tình hình / GPS mới
    const text = (body.text || '').trim();
    const imageUrl = body.imageUrl || undefined;
    const location = body.location || undefined;

    if (!text && !imageUrl && !location) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng nhập nội dung, đính kèm ảnh hoặc vị trí GPS' },
        { status: 400 }
      );
    }

    const newMsg: StatusMessage = {
      id: Date.now(),
      text: text || (imageUrl ? 'Đã gửi ảnh tình hình thực tế' : 'Đã cập nhật vị trí GPS'),
      timestamp: new Date().toISOString(),
      isWelcome: false,
      ...(imageUrl ? { imageUrl } : {}),
      ...(location ? { location } : {}),
    };

    data.messages.push(newMsg);

    // Giữ tối đa 50 tin nhắn phát sóng gần nhất
    data.messages = data.messages.slice(-50);
    await saveStatusData(data);

    const allMessages = [DEFAULT_WELCOME_MESSAGE, ...data.messages];
    const latestGps = location || [...data.messages].reverse().find((m) => m.location)?.location || null;

    return NextResponse.json({
      success: true,
      message: newMsg,
      isUnlocked: data.isUnlocked,
      lockedMessage: data.lockedMessage,
      messages: allMessages,
      hostMessages: data.messages,
      latestGps,
      storage: getRedisClient() ? 'upstash-redis' : 'fallback-memory',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Lỗi gửi tin nhắn' },
      { status: 500 }
    );
  }
}

// DELETE: Xoá tin nhắn phát sóng của Host
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    let idParam = url.searchParams.get('id');
    let clearAll = url.searchParams.get('clearAll') === 'true';

    // Đọc body nếu có truyền thêm trong JSON
    if (!idParam && !clearAll) {
      try {
        const body = await request.json();
        if (body.id !== undefined) idParam = String(body.id);
        if (body.clearAll) clearAll = true;
      } catch {
        // Không có json body
      }
    }

    const data = await getStatusData();

    if (clearAll) {
      data.messages = [];
      await saveStatusData(data);
      return NextResponse.json({
        success: true,
        isUnlocked: data.isUnlocked,
        lockedMessage: data.lockedMessage,
        messages: [DEFAULT_WELCOME_MESSAGE],
        hostMessages: [],
        latestGps: null,
        storage: getRedisClient() ? 'upstash-redis' : 'fallback-memory',
      });
    }

    if (idParam) {
      const targetId = String(idParam);
      data.messages = data.messages.filter((m) => String(m.id) !== targetId);
      await saveStatusData(data);

      const allMessages = [DEFAULT_WELCOME_MESSAGE, ...data.messages];
      const latestGps = [...data.messages].reverse().find((m) => m.location)?.location || null;

      return NextResponse.json({
        success: true,
        isUnlocked: data.isUnlocked,
        lockedMessage: data.lockedMessage,
        messages: allMessages,
        hostMessages: data.messages,
        latestGps,
        storage: getRedisClient() ? 'upstash-redis' : 'fallback-memory',
      });
    }

    return NextResponse.json(
      { success: false, error: 'Thiếu tham số id hoặc clearAll' },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Lỗi xoá tin nhắn' },
      { status: 500 }
    );
  }
}
