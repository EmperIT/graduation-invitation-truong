/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EnvelopeRevealProps {
  children: React.ReactNode;
  senderName?: string;
  recipientLabel?: string;
}

export default function EnvelopeReveal({
  children,
  senderName = "Nguyễn Minh Trường",
  recipientLabel,
}: EnvelopeRevealProps) {
  // State: 'closed' | 'opening' | 'opened'
  const [phase, setPhase] = useState<"closed" | "opening" | "opened">("closed");

  const handleOpen = useCallback(() => {
    if (phase !== "closed") return;
    setPhase("opening");

    // Transition to opened after flap open + soft fade
    const timer = setTimeout(() => {
      setPhase("opened");
    }, 1100);

    return () => clearTimeout(timer);
  }, [phase]);

  // Confetti colors (lightweight array)
  const confettiColors = [
    "#f59e0b", "#ef4444", "#8b5cf6", "#10b981", "#ec4899",
    "#3b82f6", "#f97316", "#fcd34d", "#a78bfa", "#34d399",
  ];

  return (
    <div className="relative w-full min-h-[100dvh]">
      {/* NỘI DUNG THIỆP CHÍNH (Đã load sẵn bên dưới để tránh lag/giật khi mở) */}
      <div
        className={`w-full min-h-[100dvh] transition-opacity duration-700 ease-out ${
          phase === "closed" ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        {children}
      </div>

      {/* CONFETTI KHI MỞ THIỆP (Tự động biến mất sau 3s, tối ưu phần cứng) */}
      {phase !== "closed" && (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${(i * 5) + (i % 2 === 0 ? 2 : 4)}%`,
                backgroundColor: confettiColors[i % confettiColors.length],
                width: `${(i % 3) * 2 + 6}px`,
                height: `${(i % 3) * 2 + 6}px`,
                borderRadius: i % 2 === 0 ? "50%" : "2px",
                "--fall-duration": `${2.2 + (i % 4) * 0.3}s`,
                "--fall-delay": `${(i % 5) * 0.08}s`,
                "--sway-duration": `${1.4 + (i % 3) * 0.3}s`,
                opacity: 0.85,
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}

      {/* LỚP INTRO PHONG BÌ (TỰ ĐỘNG UNMOUNT KHI ĐÃ MỞ XONG ĐỂ GIẢM TẢI 100%) */}
      <AnimatePresence>
        {phase !== "opened" && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{
              opacity: phase === "opening" ? 0 : 1,
              scale: phase === "opening" ? 1.04 : 1,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.6,
              delay: phase === "opening" ? 0.5 : 0,
              ease: "easeInOut",
            }}
            className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-[radial-gradient(ellipse_at_top,#f7f3ec_0%,#eee7dc_55%,#dfd5c5_100%)] select-none overflow-hidden transform-gpu"
          >
            {/* Nút bỏ qua intro góc trên bên phải */}
            <button
              type="button"
              onClick={() => setPhase("opened")}
              className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-full bg-white/70 hover:bg-white/90 text-[#8b6b42] text-[12px] font-medium tracking-wide shadow-sm border border-[#d4b896]/40 transition-colors"
            >
              Bỏ qua &rarr;
            </button>

            {/* Container phong bì */}
            <motion.div
              initial={{ y: 25, opacity: 0, scale: 0.94 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative cursor-pointer group flex flex-col items-center"
              onClick={handleOpen}
              style={{ perspective: "1000px" }}
            >
              {/* Lời tựa người gửi */}
              <div className="mb-4 text-center">
                <p className="text-[#8b6b42] text-[16px] sm:text-[18px] font-dancing font-bold tracking-wide">
                  Thư mời tốt nghiệp từ {senderName}
                </p>
              </div>

              {/* Thân phong bì */}
              <div className="relative w-[310px] sm:w-[360px] h-[215px] sm:h-[245px] rounded-lg shadow-[0_20px_45px_rgba(60,40,25,0.22)]">
                {/* Mặt sau phong bì */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#d4b896] to-[#c4a57b] rounded-lg" />

                {/* Thẻ thiệp nhỏ nhô lên khi mở */}
                <motion.div
                  initial={{ y: 0, opacity: 0 }}
                  animate={
                    phase === "opening"
                      ? { y: -70, opacity: 1, scale: 1.02 }
                      : { y: 0, opacity: 0 }
                  }
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                  className="absolute left-4 right-4 top-4 bottom-4 bg-[#faf8f5] rounded-md shadow-md flex flex-col items-center justify-center p-3 border border-[#c9a96e]/30 pointer-events-none z-10"
                >
                  <span className="text-[#967243] font-dancing text-[18px] font-bold">
                    Happy Graduation
                  </span>
                  <span className="text-[#666] text-[11px] mt-1 font-medium">
                    Đang mở thiệp...
                  </span>
                </motion.div>

                {/* Mặt trước phong bì */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#e8d5b8] to-[#dcc5a3] rounded-lg overflow-hidden z-20">
                  {/* Tam giác xếp nếp trái */}
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-[#d9c4a2] to-transparent pointer-events-none"
                    style={{ clipPath: "polygon(0 0, 50% 60%, 0 100%)" }}
                  />
                  {/* Tam giác xếp nếp phải */}
                  <div
                    className="absolute inset-0 bg-gradient-to-bl from-[#d9c4a2] to-transparent pointer-events-none"
                    style={{ clipPath: "polygon(100% 0, 50% 60%, 100% 100%)" }}
                  />
                  {/* Tam giác nếp dưới */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[#d0b694] to-transparent pointer-events-none"
                    style={{ clipPath: "polygon(0 100%, 50% 45%, 100% 100%)" }}
                  />

                  {/* Con dấu sáp nắp phong bì */}
                  <div className="absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 z-30">
                    <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-full bg-gradient-to-br from-[#8b1a1a] via-[#b22222] to-[#7a1515] shadow-[0_4px_16px_rgba(139,26,26,0.45)] flex items-center justify-center border-2 border-[#a01c1c]/50 group-hover:scale-105 transition-transform duration-200">
                      <span className="text-[#f5e6c8] text-[22px] select-none">
                        🎓
                      </span>
                    </div>
                  </div>

                  {/* Tên khách nhận */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center w-full px-4">
                    <p className="text-[#5a4228] text-[12.5px] font-medium tracking-wide truncate">
                      {recipientLabel || "Trân trọng kính mời bạn"}
                    </p>
                  </div>
                </div>

                {/* Nắp gập phong bì (Flap) với 3D Flip animation mượt mà */}
                <motion.div
                  initial={{ rotateX: 0 }}
                  animate={{ rotateX: phase === "opening" ? -180 : 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute top-0 left-0 right-0 h-[56%] origin-top z-30 transform-gpu"
                  style={{
                    transformStyle: "preserve-3d",
                    clipPath: "polygon(0 0, 50% 100%, 100% 0)",
                  }}
                >
                  {/* Mặt trước nắp gập */}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#e2ceb0] via-[#d8c09f] to-[#cdb290] shadow-[0_2px_8px_rgba(0,0,0,0.1)]" />
                </motion.div>
              </div>

              {/* Nút bấm / Lời nhắc mở thiệp */}
              <div className="mt-6 flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-[#d4b896]/40 shadow-sm group-hover:bg-white/90 group-hover:shadow transition-all duration-200">
                <span className="text-[14px]">✉️</span>
                <span className="text-[#8b6b42] text-[13px] font-semibold tracking-wide">
                  Chạm để mở thiệp
                </span>
                <span className="text-[14px]">✨</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
