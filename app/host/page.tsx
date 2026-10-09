"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

interface GpsLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
}

interface StatusMessage {
  id: number;
  text: string;
  timestamp: string;
  isWelcome?: boolean;
  imageUrl?: string;
  location?: GpsLocation;
}

// Client-side image compression: nén ảnh xuống WebP/JPEG nhẹ ~100-200KB trước khi upload
async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const MAX_WIDTH = 1200;
      const MAX_HEIGHT = 1200;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width = Math.round((width * MAX_HEIGHT) / height);
          height = MAX_HEIGHT;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Canvas toBlob error"));
        },
        "image/jpeg",
        0.82
      );
    };

    reader.readAsDataURL(file);
  });
}

export default function HostControlPage() {
  const [messages, setMessages] = useState<StatusMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [hostGps, setHostGps] = useState<GpsLocation | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);
  
  // Trạng thái Khóa / Mở khóa tính năng Xem thực tại cho khách mời
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [lockedMessage, setLockedMessage] = useState("Tính năng này sẽ được sử dụng vào ngày tốt nghiệp");
  const [isTogglingLock, setIsTogglingLock] = useState(false);
  
  // Trạng thái xác nhận xoá tin inline (tránh window.confirm bị trình duyệt chặn)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [confirmClearAll, setConfirmClearAll] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const presets = [
    "Tui chưa ra khỏi hội trường",
    "Mọi người chờ tui tí nhe",
    "Tui ra tới sảnh chính rồi",
    "Đợi tui tí nhe",
    "Lễ xong rồi, mình ra tới sân trường nhé!",
  ];

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/status", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          if (Array.isArray(data.hostMessages)) {
            setMessages(data.hostMessages);
          } else if (Array.isArray(data.messages)) {
            setMessages(data.messages.filter((m: any) => !m.isWelcome && m.id !== 1));
          }
          if (typeof data.isUnlocked === "boolean") {
            setIsUnlocked(data.isUnlocked);
          }
          if (data.lockedMessage) {
            setLockedMessage(data.lockedMessage);
          }
        }
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const showNotification = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  // Toggle Mở khóa / Khóa tính năng
  const handleToggleUnlock = async () => {
    setIsTogglingLock(true);
    try {
      const nextState = !isUnlocked;
      const res = await fetch("/api/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggleUnlock",
          isUnlocked: nextState,
          lockedMessage,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsUnlocked(data.isUnlocked);
        showNotification(
          data.isUnlocked
            ? "Đã MỞ KHÓA tính năng Xem thực tại cho khách mời!"
            : "Đã KHÓA tính năng Xem thực tại!"
        );
      }
    } catch (err: any) {
      alert("Lỗi cập nhật trạng thái khóa: " + err.message);
    } finally {
      setIsTogglingLock(false);
    }
  };

  // Lưu thông báo khi bị khóa
  const handleSaveLockedMessage = async () => {
    try {
      const res = await fetch("/api/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggleUnlock",
          isUnlocked,
          lockedMessage,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification("Đã lưu lời nhắn khi bị khóa!");
      }
    } catch (err: any) {
      alert("Lỗi lưu lời nhắn: " + err.message);
    }
  };

  // 1-touch GPS capture
  const handleGetGps = () => {
    if (!navigator.geolocation) {
      alert("Thiết bị không hỗ trợ định vị GPS.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude, accuracy } = pos.coords;
        setHostGps({ latitude, longitude, accuracy });
        showNotification(`Đã lấy toạ độ GPS: sai số ±${Math.round(accuracy)}m`);
      },
      (err) => {
        setIsLocating(false);
        alert("Không thể lấy toạ độ GPS: " + err.message + ". Vui lòng bật quyền vị trí.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Handle image pick
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Submit update
  const handleSend = async () => {
    const trimmed = inputText.trim();
    if (!trimmed && !selectedImage && !hostGps) {
      alert("Vui lòng nhập lời nhắn, đính kèm ảnh hoặc vị trí GPS.");
      return;
    }

    setIsSubmitting(true);
    try {
      let uploadedImageUrl: string | undefined = undefined;

      // 1. Upload ảnh lên Cloud/API nếu có chọn ảnh
      if (selectedImage) {
        try {
          const compressedBlob = await compressImage(selectedImage);
          const formData = new FormData();
          formData.append("file", compressedBlob, selectedImage.name);

          const uploadRes = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (uploadRes.ok) {
            const uploadData = await uploadRes.json();
            if (uploadData.success && uploadData.imageUrl) {
              uploadedImageUrl = uploadData.imageUrl;
            }
          }
        } catch (uploadErr) {
          console.warn("Lỗi tải ảnh lên cloud:", uploadErr);
        }
      }

      // 2. Gửi dữ liệu cập nhật tới API status
      const payload: any = {
        text: trimmed,
        ...(uploadedImageUrl ? { imageUrl: uploadedImageUrl } : {}),
        ...(hostGps ? { location: hostGps } : {}),
      };

      const res = await fetch("/api/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setInputText("");
        handleRemoveImage();
        setHostGps(null);
        if (Array.isArray(data.hostMessages)) {
          setMessages(data.hostMessages);
        } else if (Array.isArray(data.messages)) {
          setMessages(data.messages.filter((m: any) => !m.isWelcome && m.id !== 1));
        }
        showNotification("Đã phát sóng tình hình & vị trí tới khách mời!");
      } else {
        alert("Lỗi khi gửi: " + (data.error || "Không xác định"));
      }
    } catch (err: any) {
      alert("Lỗi kết nối: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete message với xác nhận inline an toàn
  const handleDelete = async (id: number) => {
    setConfirmDeleteId(null);
    // Optimistic UI update
    setMessages((prev) => prev.filter((m) => m.id !== id));
    try {
      const res = await fetch(`/api/status?id=${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        if (Array.isArray(data.hostMessages)) {
          setMessages(data.hostMessages);
        } else if (Array.isArray(data.messages)) {
          setMessages(data.messages.filter((m: any) => !m.isWelcome && m.id !== 1));
        }
        showNotification("Đã xoá tin nhắn khỏi thiệp mời!");
      } else {
        fetchStatus();
        alert("Lỗi khi xoá: " + (data.error || "Không xác định"));
      }
    } catch (err: any) {
      fetchStatus();
      alert("Lỗi kết nối khi xoá: " + err.message);
    }
  };

  // Clear all
  const handleClearAll = async () => {
    setConfirmClearAll(false);
    setMessages([]);
    try {
      const res = await fetch("/api/status?clearAll=true", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clearAll: true }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages([]);
        showNotification("Đã làm sạch toàn bộ lịch sử phát sóng!");
      }
    } catch (err: any) {
      fetchStatus();
      alert("Lỗi khi xoá: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#14100c] text-white flex flex-col items-center p-4 sm:p-6 font-sans">
      {/* Toast notification */}
      {feedback && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#c9a96e] text-[#1a1208] px-4 py-2 rounded-full font-bold text-xs shadow-2xl flex items-center gap-1.5 animate-bounce">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{feedback}</span>
        </div>
      )}

      <div className="w-full max-w-lg flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between py-2 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#c9a96e] to-[#8a6532] flex items-center justify-center shadow-md text-[#1a1208]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold text-[#f5deb3] leading-tight">
                Phát Sóng Tình Hình & GPS (Host)
              </h1>
              <p className="text-[11px] text-white/50">Cập nhật vị trí & ảnh thực tế cho khách mời</p>
            </div>
          </div>

          <Link
            href="/"
            className="text-[11px] text-[#c9a96e] bg-[#c9a96e]/10 border border-[#c9a96e]/20 px-2.5 py-1.5 rounded-lg hover:bg-[#c9a96e]/20 transition-all font-medium flex items-center gap-1.5"
          >
            <span>Xem thiệp</span>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </Link>
        </div>

        {/* ── CARD ĐIỀU KHIỂN KHÓA / MỞ KHÓA TÍNH NĂNG (UNLOCK CONTROL) ── */}
        <div
          className="border rounded-2xl p-4 shadow-xl flex flex-col gap-3 transition-all"
          style={{
            background: isUnlocked
              ? "linear-gradient(145deg, rgba(16, 185, 129, 0.08) 0%, rgba(20, 16, 12, 0.95) 100%)"
              : "linear-gradient(145deg, rgba(201, 169, 110, 0.10) 0%, rgba(20, 16, 12, 0.95) 100%)",
            borderColor: isUnlocked ? "rgba(16, 185, 129, 0.35)" : "rgba(201, 169, 110, 0.35)",
          }}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  isUnlocked ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-300"
                }`}
              >
                {isUnlocked ? (
                  /* SVG Unlock Icon */
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                  </svg>
                ) : (
                  /* SVG Lock Icon */
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xs font-bold text-[#f5deb3] uppercase tracking-wider">
                    Tính năng Xem thực tại
                  </h2>
                  <span
                    className={`text-[9.5px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      isUnlocked
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    }`}
                  >
                    {isUnlocked ? "Đang mở khóa" : "Đang khóa"}
                  </span>
                </div>
                <p className="text-[11px] text-white/50 mt-0.5">
                  {isUnlocked
                    ? "Khách mời có thể mở xem GPS & bản đồ thời gian thực."
                    : "Khách mời bấm vào sẽ nhận thông báo chờ ngày tốt nghiệp."}
                </p>
              </div>
            </div>

            {/* Switch Toggle Button */}
            <button
              type="button"
              onClick={handleToggleUnlock}
              disabled={isTogglingLock}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isUnlocked ? "bg-emerald-500" : "bg-white/20"
              }`}
              title={isUnlocked ? "Bấm để KHÓA tính năng" : "Bấm để MỞ KHÓA tính năng"}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  isUnlocked ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Locked message input */}
          <div className="pt-2 border-t border-white/5 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-white/50">Thông báo hiển thị cho khách khi đang khóa:</span>
              <button
                type="button"
                onClick={handleSaveLockedMessage}
                className="text-[10.5px] text-[#c9a96e] hover:underline font-medium"
              >
                Lưu lời nhắn
              </button>
            </div>
            <input
              type="text"
              value={lockedMessage}
              onChange={(e) => setLockedMessage(e.target.value)}
              placeholder="Tính năng này sẽ được sử dụng vào ngày tốt nghiệp"
              className="w-full bg-[#14100c] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-white/30 outline-none focus:border-[#c9a96e] transition-colors"
            />
          </div>
        </div>

        {/* Input box section */}
        <div className="bg-[#1e1813] border border-[#c9a96e]/30 rounded-2xl p-4 shadow-xl flex flex-col gap-3">
          <label className="text-xs font-semibold text-white/80 flex items-center justify-between">
            <span>Lời nhắn của bạn:</span>
            <span className="text-[10px] text-white/40">{inputText.length}/250 ký tự</span>
          </label>

          <textarea
            ref={textareaRef}
            rows={3}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ví dụ: Mình đang đứng ở sảnh A gần cây bàng lớn, mọi người tới thì gọi mình nhé..."
            maxLength={250}
            className="w-full bg-[#14100c] border border-white/10 rounded-xl p-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#c9a96e] transition-colors resize-none"
          />

          {/* Quick preset chips */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10.5px] text-white/40 font-medium">Gợi ý nhanh 1 chạm:</span>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setInputText(preset);
                    textareaRef.current?.focus();
                  }}
                  className="text-[11px] bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/10 text-white/80 px-2.5 py-1 rounded-lg transition-all text-left"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* GPS Attachment Badge */}
          {hostGps && (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="font-semibold">GPS đính kèm:</span>
                <span>
                  {hostGps.latitude.toFixed(5)}, {hostGps.longitude.toFixed(5)}
                </span>
                <span className="text-white/40 text-[10.5px]">(±{Math.round(hostGps.accuracy)}m)</span>
              </div>
              <button
                type="button"
                onClick={() => setHostGps(null)}
                className="w-5 h-5 rounded-md bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 flex items-center justify-center transition-colors"
                title="Bỏ đính kèm GPS"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          )}

          {/* Image Preview Badge */}
          {imagePreview && (
            <div className="relative inline-block w-fit rounded-xl overflow-hidden border border-[#c9a96e]/30 shadow-md">
              <img
                src={imagePreview}
                alt="Preview ảnh đính kèm"
                className="h-24 w-auto object-cover rounded-xl"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/75 hover:bg-red-500 text-white flex items-center justify-center transition-colors"
                title="Xoá ảnh này"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          )}

          {/* Hidden file input for images */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageChange}
            className="hidden"
          />

          {/* Attachment Controls + Send Button */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {/* GPS Capture Button */}
            <button
              type="button"
              onClick={handleGetGps}
              disabled={isLocating}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all active:scale-95 disabled:opacity-50 ${
                hostGps
                  ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-300"
                  : "border-[#c9a96e]/40 bg-[#c9a96e]/10 hover:bg-[#c9a96e]/20 text-[#f5deb3]"
              }`}
            >
              {isLocating ? (
                <div className="w-3.5 h-3.5 border-2 border-[#c9a96e] border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                </svg>
              )}
              <span>{isLocating ? "Đang định vị..." : hostGps ? "Cập nhật lại GPS" : "Lấy GPS của tôi"}</span>
            </button>

            {/* Photo Attach Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all active:scale-95 ${
                selectedImage
                  ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-300"
                  : "border-white/15 bg-white/5 hover:bg-white/10 text-white/80"
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span>{selectedImage ? "Đã chọn ảnh" : "Đính kèm ảnh"}</span>
            </button>

            {/* Send Button */}
            <button
              type="button"
              onClick={handleSend}
              disabled={isSubmitting || (!inputText.trim() && !selectedImage && !hostGps)}
              className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#c9a96e] to-[#967243] hover:brightness-110 active:scale-[0.98] text-[#1a1208] text-sm font-bold shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed ml-auto"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-[#1a1208] border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              )}
              <span>{isSubmitting ? "Đang phát sóng..." : "GỬI CẬP NHẬT"}</span>
            </button>
          </div>
        </div>

        {/* Sent messages list */}
        <div className="bg-[#1e1813] border border-white/10 rounded-2xl p-4 shadow-xl flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h2 className="text-xs font-bold text-[#f5deb3] uppercase tracking-wider flex items-center gap-1.5">
              <span>Đã phát sóng</span>
              <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded-full text-white/70">
                {messages.length}
              </span>
            </h2>

            {messages.length > 0 && (
              <div>
                {confirmClearAll ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleClearAll}
                      className="px-2 py-0.5 rounded bg-red-500 text-white text-[10px] font-bold hover:bg-red-600 transition-all active:scale-95"
                    >
                      Xoá hết
                    </button>
                    <button
                      onClick={() => setConfirmClearAll(false)}
                      className="px-1.5 py-0.5 rounded text-white/50 hover:text-white text-[10px] transition-all"
                    >
                      Huỷ
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmClearAll(true)}
                    className="text-[10.5px] text-red-400/80 hover:text-red-400 transition-colors"
                  >
                    Xoá tất cả
                  </button>
                )}
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="text-center py-6 text-xs text-white/40">Đang tải tin nhắn...</div>
          ) : messages.length === 0 ? (
            <div className="text-center py-6 text-xs text-white/40">
              Chưa có cập nhật nào do bạn gửi. Hãy nhập lời nhắn hoặc vị trí ở trên để phát sóng!
            </div>
          ) : (
            <div className="flex flex-col gap-2.5 max-h-[350px] overflow-y-auto pr-1">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className="bg-[#14100c] border border-white/5 rounded-xl p-3 flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs text-white/90 leading-relaxed break-words font-medium flex-1">
                      {msg.text}
                    </p>

                    {/* Inline confirm delete button */}
                    {confirmDeleteId === msg.id ? (
                      <div className="flex items-center gap-1 shrink-0 bg-red-500/10 p-0.5 rounded-lg border border-red-500/30">
                        <button
                          onClick={() => handleDelete(msg.id)}
                          className="px-2 py-0.5 rounded bg-red-500 text-white text-[10px] font-bold hover:bg-red-600 transition-all active:scale-95 shadow-sm"
                        >
                          Xoá
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-1.5 py-0.5 rounded text-white/50 hover:text-white text-[10px] transition-all"
                        >
                          Huỷ
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(msg.id)}
                        title="Xoá tin này"
                        className="w-7 h-7 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 flex items-center justify-center transition-all shrink-0 active:scale-95"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Attached photo thumbnail */}
                  {msg.imageUrl && (
                    <a
                      href={msg.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-fit rounded-lg overflow-hidden border border-white/10 hover:opacity-90 transition-opacity"
                    >
                      <img
                        src={msg.imageUrl}
                        alt="Ảnh đính kèm"
                        className="h-20 w-auto object-cover rounded-lg"
                      />
                    </a>
                  )}

                  <div className="flex items-center justify-between text-[10px] text-white/40 pt-1 border-t border-white/5">
                    {msg.location ? (
                      <span className="text-emerald-400/90 font-medium flex items-center gap-1">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span>GPS:</span>
                        <span>
                          {msg.location.latitude.toFixed(4)}, {msg.location.longitude.toFixed(4)}
                        </span>
                        <span>(±{Math.round(msg.location.accuracy)}m)</span>
                      </span>
                    ) : (
                      <span className="text-white/30">Không đính kèm GPS</span>
                    )}

                    <span>
                      {msg.timestamp
                        ? new Date(msg.timestamp).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="text-center text-[11px] text-white/35 pt-1 flex items-center justify-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-[#c9a96e]">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span>Tọa độ GPS & ảnh chụp của bạn được phát sóng trực tiếp tới tất cả khách mời mở thiệp.</span>
        </p>
      </div>
    </div>
  );
}
