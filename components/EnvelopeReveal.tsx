/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EnvelopeRevealProps {
  children: React.ReactNode;
  senderName?: string;
  recipientLabel?: string;
}

export default function EnvelopeReveal({
  children,
  senderName = "Hoàng Thị Ngọc",
  recipientLabel = "Thân gửi bạn...",
}: EnvelopeRevealProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [flapOpen, setFlapOpen] = useState(false);
  const [cardRisen, setCardRisen] = useState(false);
  const [envelopeGone, setEnvelopeGone] = useState(false);

  const handleOpen = useCallback(() => {
    if (isOpened) return;
    setIsOpened(true);

    // Step 1: Flap opens (0 -> 0.6s)
    setFlapOpen(true);

    // Step 2: Card rises out (0.7s)
    setTimeout(() => setCardRisen(true), 700);

    // Step 3: Envelope fades away (1.8s)
    setTimeout(() => setEnvelopeGone(true), 1800);
  }, [isOpened]);

  // === PHONG BÌ CHƯA MỞ ===
  if (!isOpened) {
    return (
      <div className="w-full min-h-[100dvh] flex flex-col justify-center items-center bg-gradient-to-br from-[#f5f0e8] via-[#ede6da] to-[#e0d5c4] select-none overflow-hidden">
        {/* Floating particles background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-[#c9a96e]/30"
              initial={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                scale: Math.random() * 0.5 + 0.5,
              }}
              animate={{
                y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: Math.random() * 6 + 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Envelope container */}
        <motion.div
          initial={{ y: 40, opacity: 0, scale: 0.92 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative cursor-pointer group"
          onClick={handleOpen}
          style={{ perspective: "1000px" }}
        >
          {/* Main envelope body */}
          <div className="relative w-[320px] sm:w-[380px] h-[220px] sm:h-[260px]">
            {/* Envelope back */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#d4b896] to-[#c4a57b] rounded-b-lg rounded-t-sm shadow-[0_20px_50px_rgba(0,0,0,0.2)]" />

            {/* Envelope front body */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#e8d5b8] to-[#dcc5a3] rounded-b-lg overflow-hidden">
              {/* Decorative left triangle */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-[#d9c4a2] to-transparent"
                style={{
                  clipPath: "polygon(0 0, 50% 60%, 0 100%)",
                }}
              />
              {/* Decorative right triangle */}
              <div
                className="absolute inset-0 bg-gradient-to-bl from-[#d9c4a2] to-transparent"
                style={{
                  clipPath: "polygon(100% 0, 50% 60%, 100% 100%)",
                }}
              />
              {/* Bottom triangle */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#d0b694] to-transparent"
                style={{
                  clipPath: "polygon(0 100%, 50% 45%, 100% 100%)",
                }}
              />

              {/* Seal / wax stamp */}
              <div className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 z-10">
                <motion.div
                  animate={{ rotate: [0, 3, -3, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#8b1a1a] via-[#b22222] to-[#7a1515] shadow-[0_4px_15px_rgba(139,26,26,0.5)] flex items-center justify-center border-2 border-[#a01c1c]/60"
                >
                  <span className="text-[#f5e6c8] text-[20px] sm:text-[22px] font-dancing font-bold leading-none">
                    🎓
                  </span>
                </motion.div>
              </div>

              {/* Recipient label */}
              <div className="absolute bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 text-center">
                <p className="text-[#5a4228] text-[12px] sm:text-[13px] font-medium tracking-wide">
                  {recipientLabel}
                </p>
              </div>
            </div>

            {/* Envelope flap (top triangle) - CLOSED */}
            <div
              className="absolute top-0 left-0 right-0 h-[55%] bg-gradient-to-b from-[#e2ceb0] via-[#d8c09f] to-[#cdb290] origin-top shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
              style={{
                clipPath: "polygon(0 0, 50% 100%, 100% 0)",
              }}
            />
          </div>

          {/* Sender label on the back */}
          <div className="absolute -top-10 sm:-top-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <motion.p
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="text-[#8b6b42] text-[14px] sm:text-[16px] font-dancing font-bold tracking-wide"
            >
              Từ {senderName}
            </motion.p>
          </div>

          {/* "Tap to open" prompt */}
          <motion.div
            animate={{ y: [0, 6, 0], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-12 sm:-bottom-14 left-1/2 -translate-x-1/2 whitespace-nowrap"
          >
            <p className="text-[#9a7d55] text-[13px] sm:text-[14px] font-medium flex items-center gap-2">
              <span className="text-lg">✉️</span>
              Nhấn để mở thiệp
              <span className="text-lg">✉️</span>
            </p>
          </motion.div>

          {/* Hover glow effect */}
          <div className="absolute inset-0 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-t from-[#c9a96e]/20 to-transparent" />
        </motion.div>
      </div>
    );
  }

  // === PHONG BÌ ĐANG MỞ (ANIMATION) ===
  if (!envelopeGone) {
    return (
      <div className="w-full min-h-[100dvh] flex flex-col justify-center items-center bg-gradient-to-br from-[#f5f0e8] via-[#ede6da] to-[#e0d5c4] select-none overflow-hidden">
        <div className="relative" style={{ perspective: "1200px" }}>
          {/* Envelope body */}
          <motion.div
            animate={cardRisen ? { y: 80, opacity: 0, scale: 0.85 } : {}}
            transition={{ duration: 0.8, ease: "easeIn" }}
            className="relative w-[320px] sm:w-[380px] h-[220px] sm:h-[260px]"
          >
            {/* Envelope back */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#d4b896] to-[#c4a57b] rounded-b-lg rounded-t-sm shadow-[0_20px_50px_rgba(0,0,0,0.2)]" />

            {/* Envelope front body */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#e8d5b8] to-[#dcc5a3] rounded-b-lg overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-br from-[#d9c4a2] to-transparent"
                style={{ clipPath: "polygon(0 0, 50% 60%, 0 100%)" }}
              />
              <div
                className="absolute inset-0 bg-gradient-to-bl from-[#d9c4a2] to-transparent"
                style={{ clipPath: "polygon(100% 0, 50% 60%, 100% 100%)" }}
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#d0b694] to-transparent"
                style={{ clipPath: "polygon(0 100%, 50% 45%, 100% 100%)" }}
              />
            </div>

            {/* Flap OPENING animation */}
            <motion.div
              initial={{ rotateX: 0 }}
              animate={{ rotateX: flapOpen ? 180 : 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute top-0 left-0 right-0 h-[55%] origin-top"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Front of flap */}
              <div
                className="absolute inset-0 bg-gradient-to-b from-[#e2ceb0] via-[#d8c09f] to-[#cdb290] shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
                style={{
                  clipPath: "polygon(0 0, 50% 100%, 100% 0)",
                  backfaceVisibility: "hidden",
                }}
              />
              {/* Back of flap (visible when opened) */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#c5aa8a] to-[#b89c7c]"
                style={{
                  clipPath: "polygon(0 0, 50% 100%, 100% 0)",
                  backfaceVisibility: "hidden",
                  transform: "rotateX(180deg)",
                }}
              />
            </motion.div>
          </motion.div>

          {/* Card rising out of envelope */}
          <motion.div
            initial={{ y: 0, scale: 0.6, opacity: 0 }}
            animate={
              cardRisen
                ? { y: -350, scale: 1, opacity: 1 }
                : { y: -20, scale: 0.5, opacity: 0.4 }
            }
            transition={{
              duration: cardRisen ? 1.0 : 0.3,
              ease: cardRisen ? "easeOut" : "easeInOut",
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[340px] origin-center pointer-events-none z-20"
          >
            {/* Mini preview of the invitation card */}
            <div className="bg-[#fbf9f5] border-2 border-[#8b5cf6] rounded-sm shadow-[0_12px_40px_rgba(0,0,0,0.25)] p-4 text-center">
              <p className="text-[#967243] font-dancing text-[20px] sm:text-[24px] font-bold">
                Happy
              </p>
              <p className="text-[#967243] font-montserrat text-[14px] sm:text-[16px] font-extrabold tracking-[0.12em]">
                GRADUATION
              </p>
              <p className="text-[#555] text-[11px] mt-2 font-medium">
                Đang mở thiệp...
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // === THIỆP ĐÃ MỞ XONG — HIỆN NỘI DUNG CHÍNH + CONFETTI ===
  const confettiColors = [
    "#f59e0b", "#ef4444", "#8b5cf6", "#10b981", "#ec4899",
    "#3b82f6", "#f97316", "#fcd34d", "#a78bfa", "#34d399",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full relative"
    >
      {/* Confetti burst overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="confetti-piece"
            style={{
              left: `${Math.random() * 100}%`,
              backgroundColor: confettiColors[i % confettiColors.length],
              width: `${Math.random() * 8 + 5}px`,
              height: `${Math.random() * 8 + 5}px`,
              borderRadius: Math.random() > 0.5 ? "50%" : "2px",
              "--fall-duration": `${Math.random() * 2 + 2.5}s`,
              "--fall-delay": `${Math.random() * 0.8}s`,
              "--sway-duration": `${Math.random() * 1.5 + 1}s`,
              opacity: Math.random() * 0.4 + 0.6,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {children}
    </motion.div>
  );
}
