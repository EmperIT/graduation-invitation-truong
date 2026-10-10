/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export interface InvitationLayoutProps {
  dearName?: string;

  hostName?: string;
  subTitle?: string;
  ceremonyTitle?: string;

  dayOfWeek?: string;
  date?: string;
  time?: string;

  venueName?: string;
  venueAddressLine1?: string;
  venueAddressLine2?: string;

  phone?: string;
  email?: string;

  footerNote?: string;

  bgCampusImage?: string;
  piecesImage?: string;
  graduateImage?: string;
  paperStrip1?: string;
  paperStrip2?: string;
  invitationBoard?: string;
  schoolLogo?: string;

  itemPen?: string;
  itemNotebook?: string;
  itemVase?: string;
}

export default function NewInvitationLayout({
  dearName = "Mỹ Linh",
  hostName = "Nguyễn Minh Trường",
  subTitle = "Happy",
  ceremonyTitle = "GRADUATION",
  dayOfWeek = "THỨ SÁU",
  date = "23.10.2026",
  time = "9:00 - 10:30",
  venueName = "TRƯỜNG ĐẠI HỌC TÔN ĐỨC THẮNG",
  venueAddressLine1 = "19 đường Nguyễn Hữu Thọ, phường Tân Hưng, quận 7",
  footerNote = "Một thời điểm đánh dấu hành trình của mình về sự trưởng thành và phát triển nên mình mong rằng bạn sẽ đến chung vui với mình!",
  bgCampusImage = "/anhtdtu.png",
  graduateImage = "/anhtotnghiep.png",
  paperStrip1 = "/piece_paper1.png",
  paperStrip2 = "/piece_paper2.png",
  invitationBoard = "/invitation_board.png",
  schoolLogo = "/logo-tdt.webp",
  itemPen = "/item_bg.png",
  itemNotebook = "/item_bg1.png",
  itemVase = "/item_bg2.png",
}: InvitationLayoutProps) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window === "undefined") return;
      const w = window.innerWidth;
      if (w < 480) {
        // Tự động tính toán scale khi width điện thoại nhỏ
        // Bounding box chuẩn của thiệp bao gồm cả phần nhô ra của 2 mảnh giấy ~ 400px
        const availableW = Math.max(260, w - 16);
        const wScale = availableW / 400;

        const h = window.innerHeight;
        const availableH = Math.max(480, h - 24);
        const hScale = availableH / 660;

        setScale(Math.min(1, wScale, hScale));
      } else {
        setScale(1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="invitation-root-layout relative w-full min-h-[100dvh] h-[100dvh] flex flex-col justify-center items-center bg-[radial-gradient(circle_at_25%_15%,#F3F2EE_0%,#EBEAE5_45%,#DFDED8_100%)] py-2 px-2 sm:py-3 sm:px-4 select-none font-sans overflow-hidden">
      {/* 
        CÁC VẬT DỤNG TRÊN MẶT BÀN (CHỈ HIỂN THỊ TRÊN BẢN WEB - ẨN TRÊN MOBILE)
        - Kích thước vừa phải, gọn gàng, thanh thoát
        - Ẩn hoàn toàn trên màn hình mobile (hidden md:block) để thiệp làm trung tâm
      */}
      {/* 1. Sổ tay & bát kẹp giấy (Top-Left - Gọn gàng) */}
      <div
        className="hidden md:block absolute top-0 left-0 pointer-events-none select-none z-0"
        style={{
          filter: "drop-shadow(6px 10px 10px rgba(50,35,25,0.30)) drop-shadow(16px 24px 28px rgba(60,45,35,0.18)) drop-shadow(28px 45px 50px rgba(70,55,45,0.10))",
        }}
      >
        <img
          src={itemNotebook}
          alt="Notebook and paperclips"
          className="w-[200px] lg:w-[240px] xl:w-[260px] h-auto object-contain"
        />
      </div>

      {/* 2. Bình hoa đỏ (Top-Right - To hơn cây bút, hoa nổi bật rõ rệt) */}
      <div
        className="hidden md:block absolute top-0 right-1 lg:right-4 xl:right-10 pointer-events-none select-none z-0"
        style={{
          filter: "drop-shadow(6px 10px 12px rgba(50,35,25,0.32)) drop-shadow(16px 24px 28px rgba(60,45,35,0.20)) drop-shadow(30px 48px 52px rgba(70,55,45,0.12))",
        }}
      >
        <img
          src={itemVase}
          alt="Flower vase"
          className="w-[230px] lg:w-[275px] xl:w-[290px] h-auto object-contain"
        />
      </div>

      {/* 3. Cây bút vàng (Bottom-Right - Thon nhỏ, thanh mảnh hơn bình hoa) */}
      <div
        className="hidden md:block absolute bottom-8 right-10 lg:bottom-10 lg:right-20 xl:right-30 pointer-events-none select-none z-0"
        style={{
          filter: "drop-shadow(3px 5px 6px rgba(50,35,25,0.34)) drop-shadow(8px 12px 14px rgba(60,45,35,0.20)) drop-shadow(16px 22px 26px rgba(70,55,45,0.10))",
        }}
      >
        <img
          src={itemPen}
          alt="Golden pen"
          className="w-[125px] lg:w-[180px] xl:w-[195px] rotate-[75deg]"
        />
      </div>

      {/* 
        KHUNG THIỆP CHÍNH (CARD CONTAINER)
        - Khi dưới 480px (< 480px): Chiếm full toàn bộ màn hình điện thoại (w-full h-[100dvh]), giữ vững layout chuẩn mẫu
        - Khi từ 480px trở lên (>= 480px): Giữ nguyên 100% layout cũ (mockup trên bàn, đổ bóng bàn, bo góc, nghiêng nhẹ)
      */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="invitation-card-layout relative w-full max-w-[385px] sm:max-w-[395px] my-auto bg-[#faf8f5] rounded-[2px] shadow-[8px_16px_32px_rgba(40,25,15,0.24),18px_32px_55px_rgba(50,35,25,0.18),2px_4px_8px_rgba(30,18,10,0.25)] flex flex-col justify-between pt-4 pb-4 px-4 sm:pt-4 sm:pb-4 sm:px-4.5 shrink-0 bg-cover bg-center rotate-0 md:-rotate-[2deg] hover:md:-rotate-[0.5deg] transition-transform duration-300 ease-out overflow-hidden md:overflow-visible"
        style={{
          backgroundImage: "url('/background.png')",
        }}
      >
        {/* Khung nội dung tập trung vào giữa (center), tự động co giãn tỷ lệ trên màn hình nhỏ */}
        <div
          className="invitation-scaler relative w-[380px] shrink-0 flex flex-col items-center justify-center my-auto select-none origin-center"
          style={{
            transform: scale < 1 ? `scale(${scale})` : undefined,
          }}
        >
        {/* -------------------------------------------------------------
            KHỐI HERO: "Happy GRADUATION" + ẢNH TRƯỜNG HỌC + CỬ NHÂN + 2 NHÃN GIẤY
            - Giữ nguyên khoảng cách và bố cục chuẩn như ảnh thiết kế ban đầu
            ------------------------------------------------------------- */}
        <div className="relative w-full flex flex-col items-center shrink-0 pt-0 sm:pt-0.5">
          {/* Lớp nền trường học (Campus Background) */}
          <div className="absolute top-0 left-0 right-0 h-[370px] sm:h-[375px] flex items-center justify-center pointer-events-none z-10 overflow-visible">
            <img
              src={bgCampusImage}
              alt="Đại học Tôn Đức Thắng"
              className="w-full h-full object-contain scale-[1.72] min-[480px]:scale-[1.52] sm:scale-[1.60] -translate-x-[9.5px] filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.24)]"
            />
          </div>

          {/* 1. Phần băng kraft trên cùng: "Happy GRADUATION" */}
          <div className="relative flex justify-center items-start z-30 pt-0 sm:pt-0.5 shrink-0">
            <div className="relative px-4.5 py-1.5 min-[480px]:px-3.5 sm:px-4.5 sm:py-1.5 flex flex-col items-start justify-center -rotate-[0.8deg] drop-shadow-[0_6px_16px_rgba(0,0,0,0.22)] min-w-[185px] min-[480px]:min-w-[165px] sm:min-w-[185px]">
              {/* Nền giấy rách piece_paper1.png */}
              <img
                src={paperStrip1}
                alt="Torn paper"
                className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none"
              />
              {/* Chữ "Happy" viết tay cursive mềm mại */}
              <span className="relative z-10 text-[#2b241e] text-[17px] min-[480px]:text-[15.5px] sm:text-[17px] leading-tight font-dancing font-semibold tracking-wide">
                {subTitle}
              </span>

              {/* Chữ "GRADUATION" font đậm màu nâu vàng + shimmer effect */}
              <span className="relative z-10 shimmer-gold text-[20px] min-[480px]:text-[17.5px] sm:text-[19.5px] leading-none font-montserrat font-extrabold tracking-[0.14em]">
                {ceremonyTitle}
              </span>
            </div>
          </div>

          {/* 2. Khung ảnh cử nhân & 2 mảnh giấy */}
          <div className="relative w-full h-[370px] min-[480px]:h-[340px] sm:h-[360px] mt-0 mb-0.5 flex items-center justify-center overflow-visible">
            {/* Lớp ảnh cử nhân */}
            <div className="absolute inset-0 flex items-end justify-center pointer-events-none z-30 pb-0 -translate-y-2 min-[480px]:-translate-y-3 sm:-translate-y-5">
              {graduateImage && (
                <img
                  src={graduateImage}
                  alt="Graduate portrait"
                  className="w-[260px] min-[480px]:w-[220px] sm:w-[240px] max-w-none object-contain filter drop-shadow-[0_8px_18px_rgba(0,0,0,0.22)] [mask-image:linear-gradient(to_bottom,black_45%,black_65%,rgba(0,0,0,0.6)_80%,rgba(0,0,0,0.15)_92%,transparent_100%)]"
                />
              )}
            </div>

            {/* DẢI GIẤY KRAFT GIỚI THIỆU: "Xin chào, mình là..." */}
            <div className="absolute top-9 min-[480px]:top-8 sm:top-9 -left-[18px] min-[480px]:left-0 sm:left-[-8px] z-20 px-4 py-2 min-[480px]:px-3.5 min-[480px]:py-1.5 sm:px-4 sm:py-2 -rotate-3 drop-shadow-[0_6px_16px_rgba(0,0,0,0.24)] flex items-center justify-center">
              {/* Background hình piece_paper2.png */}
              <img
                src={paperStrip2}
                alt="Torn paper"
                className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none"
              />

              <div className="relative z-10 flex flex-col select-none px-1">
                <span className="text-[12.5px] min-[480px]:text-[11px] sm:text-[12px] text-[#221b16] font-medium leading-tight">
                  Xin chào, mình là
                </span>
                <span className="text-[16.5px] min-[480px]:text-[14px] sm:text-[16px] text-[#7d5125] font-dancing font-bold leading-tight">
                  {hostName}
                </span>
              </div>
            </div>

            {/* MẢNH GIẤY THIỆP GỬI KHÁCH: "Thân mời [Tên khách]" */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.4 }}
              className="absolute bottom-11 min-[480px]:bottom-11 sm:bottom-12 -right-[14px] min-[480px]:right-[-10px] sm:right-[-6px] z-30 w-[145px] min-[480px]:w-[130px] sm:w-[142px] h-[112px] min-[480px]:h-[102px] sm:h-[112px] rotate-2 flex flex-col items-center justify-center pt-2.5 pb-2 px-2.5 drop-shadow-[0_8px_22px_rgba(0,0,0,0.28)]"
            >
              {/* Background hình invitation_board.png */}
              <img
                src={invitationBoard}
                alt="Invitation board"
                className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none"
              />

              <span className="relative z-10 text-[#1a1a1a] text-[13px] min-[480px]:text-[12px] sm:text-[13px] font-bold tracking-wide select-none">
                Thân mời
              </span>
              <span className="relative z-10 text-[#7d5125] text-[22px] min-[480px]:text-[18px] sm:text-[22px] font-dancing font-bold leading-tight -mt-0.5 px-1 whitespace-nowrap">
                {dearName}
              </span>
            </motion.div>
          </div>
        </div>

        {/* -------------------------------------------------------------
            3 & 4. CỤM THÔNG TIN & LỜI KẾT
            - Nằm liền kề ngay bên dưới ảnh cử nhân (chuẩn theo ảnh thiết kế)
            ------------------------------------------------------------- */}
        <div className="relative w-full mt-2 min-[480px]:mt-0 pb-2 min-[480px]:pb-4 sm:pb-4 z-25 shrink-0">
          {/* Vùng sương khói mờ loang mềm mại (Soft Misty Fog Vignette - Không bị đóng thành khối hộp) */}
          <div className="absolute -inset-x-5 -top-10 pointer-events-none -z-10 overflow-hidden">
            {/* 1. Quầng sương trắng loang tròn mềm mại ở trung tâm cụm thông tin */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_75%_at_50%_65%,rgba(255,255,255,0.92)_0%,rgba(255,255,255,0.78)_35%,rgba(255,255,255,0.35)_68%,transparent_95%)]" />

            <div className="absolute left-1/2 top-10 -translate-x-1/2 w-[320px] h-[75px] rounded-[50%] bg-white/60 blur-2xl" />
            <div className="absolute left-[10%] top-14 w-[180px] h-[65px] rounded-[50%] bg-white/50 blur-xl" />
            <div className="absolute right-[10%] top-16 w-[180px] h-[65px] rounded-[50%] bg-white/45 blur-xl" />
          </div>

          {/* CỤM THÔNG TIN THỜI GIAN & ĐỊA ĐIỂM */}
          <div className="relative grid grid-cols-2 gap-2.5 items-start px-3 sm:px-1 z-10">
            {/* CỘT 1: THỜI GIAN */}
            <div className="flex flex-col items-center text-center pr-1 sm:pr-2">
              <span className="text-[#967243] font-montserrat font-bold text-[13.5px] min-[480px]:text-[12px] sm:text-[13px] uppercase tracking-wider">
                THỜI GIAN
              </span>
              <span className="text-[#111] font-montserrat font-black text-[15.5px] min-[480px]:text-[14px] sm:text-[15.5px] mt-0.5 tracking-tight">
                {dayOfWeek}
              </span>
              <span className="text-[#262626] font-medium text-[13.5px] min-[480px]:text-[12px] sm:text-[13px] leading-tight mt-0.5">
                {date}
              </span>
              <span className="text-[#333] font-normal text-[12.5px] min-[480px]:text-[11px] sm:text-[12px] leading-tight mt-0.5">
                {time}
              </span>
            </div>

            {/* ĐƯỜNG PHÂN CÁCH DỌC GIỮA 2 CỘT */}
            <div className="absolute left-1/2 top-1.5 bottom-1.5 w-[1.5px] bg-[#333]/70 -translate-x-1/2" />

            {/* CỘT 2: ĐỊA ĐIỂM */}
            <div className="flex flex-col items-center text-center pl-1 sm:pl-2">
              <span className="text-[#967243] font-montserrat font-bold text-[13.5px] min-[480px]:text-[12px] sm:text-[13px] uppercase tracking-wider">
                ĐỊA ĐIỂM
              </span>
              <span className="text-[#111] font-montserrat font-black text-[13.5px] min-[480px]:text-[12px] sm:text-[13.5px] mt-0.5 leading-snug">
                {venueName}
              </span>
              <span className="text-[#333] font-normal text-[12px] min-[480px]:text-[10.5px] sm:text-[11px] leading-tight mt-0.5 max-w-[170px]">
                {venueAddressLine1}
              </span>
            </div>
          </div>

          {/* LỜI KẾT CUỐI THIỆP */}
          <div className="mt-3.5 min-[480px]:mt-2 text-center z-10 pb-0.5 relative">
            <p className="text-[12.5px] min-[480px]:text-[11px] sm:text-[12px] font-bold text-[#111] leading-tight">
              {footerNote}
            </p>
          </div>
        </div>
        </div>
      </motion.div>
    </div>
  );
}
