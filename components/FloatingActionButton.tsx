"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";

// ---------- SVG ICONS ----------

function MapIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3" />
      <path d="M12 19v3" />
      <path d="M2 12h3" />
      <path d="M19 12h3" />
      <path d="M4.93 4.93l2.12 2.12" />
      <path d="M16.95 16.95l2.12 2.12" />
      <path d="M4.93 19.07l2.12-2.12" />
      <path d="M16.95 7.05l2.12-2.12" />
    </svg>
  );
}

function CopyIcon({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function CompassIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

function NavigationIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </svg>
  );
}

function PinIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function GraduationIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

function MapOutlineIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  );
}

function SearchZoomIcon({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function CloseIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function LockIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function ParkingIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <path d="M9 17V7h4.5a3 3 0 0 1 0 6H9" />
    </svg>
  );
}

// ---------- BRIGHT & CHEERFUL GRADUATION MASCOT ROBOT ----------

function RobotSVG({ mouthOpen }: { mouthOpen: boolean }) {
  return (
    <svg width="54" height="60" viewBox="0 0 54 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Warm cream & ivory body gradient */}
        <linearGradient id="robotBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#FFF9F2" />
          <stop offset="100%" stopColor="#F7EADB" />
        </linearGradient>

        {/* Graduation cap gradient - deep navy blue with gold trim */}
        <linearGradient id="gradCapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2D3748" />
          <stop offset="100%" stopColor="#1A202C" />
        </linearGradient>

        {/* Gold accents gradient */}
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="50%" stopColor="#E5B95C" />
          <stop offset="100%" stopColor="#C99436" />
        </linearGradient>
      </defs>

      {/* GRADUATION CAP (Mũ cử nhân) */}
      <motion.g
        animate={{
          rotate: mouthOpen ? [0, -3, 3, 0] : [0, -1, 1, 0],
          y: mouthOpen ? -2 : 0,
        }}
        transition={{
          duration: mouthOpen ? 0.6 : 3.5,
          repeat: mouthOpen ? 0 : Infinity,
          ease: "easeInOut",
        }}
        style={{ transformOrigin: "27px 14px" }}
      >
        {/* Cap diamond mortarboard */}
        <polygon
          points="27,3 45,9.5 27,16 9,9.5"
          fill="url(#gradCapGrad)"
          stroke="#E5B95C"
          strokeWidth="1.4"
        />
        {/* Cap base band under diamond */}
        <path
          d="M 19 12.5 Q 27 15.5 35 12.5 L 34.5 16.5 Q 27 19.5 19.5 16.5 Z"
          fill="#1A202C"
          stroke="#C99436"
          strokeWidth="0.8"
        />
        {/* Center gold button on cap */}
        <circle cx="27" cy="9.5" r="2.2" fill="url(#goldGrad)" stroke="#B8860B" strokeWidth="0.6" />

        {/* Gold tassel dangling to the right */}
        <motion.path
          d="M 27 9.5 Q 39 10 41.5 18"
          stroke="#FDE68A"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
          animate={{
            d: mouthOpen
              ? "M 27 9.5 Q 42 12 43 20"
              : "M 27 9.5 Q 39 10 41.5 18",
          }}
          transition={{ duration: 0.3 }}
        />
        {/* Tassel brush end */}
        <motion.ellipse
          cx="41.5"
          cy="20"
          rx="2.2"
          ry="3.8"
          fill="url(#goldGrad)"
          stroke="#B8860B"
          strokeWidth="0.5"
          animate={{
            cx: mouthOpen ? 43 : 41.5,
            cy: mouthOpen ? 22 : 20,
            rotate: mouthOpen ? 15 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.g>

      {/* EARS (Cute golden audio knobs) */}
      <rect x="3" y="24" width="4.5" height="11" rx="2.25" fill="url(#goldGrad)" stroke="#B8860B" strokeWidth="0.8" />
      <rect x="46.5" y="24" width="4.5" height="11" rx="2.25" fill="url(#goldGrad)" stroke="#B8860B" strokeWidth="0.8" />

      {/* HEAD - Soft bright cream/ivory */}
      <rect
        x="6.5"
        y="15"
        width="41"
        height="28"
        rx="14"
        fill="url(#robotBodyGrad)"
        stroke="#E5B95C"
        strokeWidth="1.8"
      />
      {/* Forehead glossy highlight */}
      <path
        d="M 16 18.5 Q 27 16.5 38 18.5"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.9"
      />

      {/* EYES */}
      {mouthOpen ? (
        /* Joyful cheerful laughing eyes (^ ^) when active */
        <motion.g
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {/* Left happy curved eye */}
          <path
            d="M 14.5 28.5 Q 18.5 24 22.5 28.5"
            stroke="#3B2615"
            strokeWidth="2.6"
            strokeLinecap="round"
            fill="none"
          />
          {/* Right happy curved eye */}
          <path
            d="M 31.5 28.5 Q 35.5 24 39.5 28.5"
            stroke="#3B2615"
            strokeWidth="2.6"
            strokeLinecap="round"
            fill="none"
          />
        </motion.g>
      ) : (
        /* Big friendly sparkling kawaii eyes when closed */
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {/* Left eye */}
          <circle cx="18.5" cy="27.5" r="4.2" fill="#3B2615" />
          <circle cx="17.2" cy="26" r="1.6" fill="#FFFFFF" />
          <circle cx="19.8" cy="28.8" r="0.8" fill="#FFFFFF" />

          {/* Right eye */}
          <circle cx="35.5" cy="27.5" r="4.2" fill="#3B2615" />
          <circle cx="34.2" cy="26" r="1.6" fill="#FFFFFF" />
          <circle cx="36.8" cy="28.8" r="0.8" fill="#FFFFFF" />
        </motion.g>
      )}

      {/* BLUSHING CHEEKS (Má hồng) - warm & cute */}
      <motion.ellipse
        cx="14"
        cy="33"
        rx="3.5"
        ry="2.2"
        fill="#FF8585"
        animate={{ opacity: mouthOpen ? 0.85 : 0.65, scale: mouthOpen ? 1.15 : 1 }}
        transition={{ duration: 0.3 }}
      />
      <motion.ellipse
        cx="40"
        cy="33"
        rx="3.5"
        ry="2.2"
        fill="#FF8585"
        animate={{ opacity: mouthOpen ? 0.85 : 0.65, scale: mouthOpen ? 1.15 : 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* MOUTH */}
      {mouthOpen ? (
        /* Joyful cheering open mouth (:D) with cute pink tongue */
        <motion.g
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25, type: "spring", stiffness: 400 }}
          style={{ transformOrigin: "27px 34px" }}
        >
          {/* Mouth cavity */}
          <path
            d="M 21.5 32 Q 27 32 32.5 32 C 32.5 38.5 21.5 38.5 21.5 32 Z"
            fill="#8B2525"
            stroke="#3B2615"
            strokeWidth="1.2"
          />
          {/* Cute pink tongue */}
          <path
            d="M 23.5 36.5 Q 27 34 30.5 36.5"
            fill="#FF7A8A"
          />
        </motion.g>
      ) : (
        /* Cute gentle cat smile */
        <motion.path
          d="M 23 33 Q 27 36.5 31 33"
          stroke="#3B2615"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}

      {/* NECK */}
      <rect x="23.5" y="43" width="7" height="3" rx="1.5" fill="url(#goldGrad)" stroke="#B8860B" strokeWidth="0.6" />

      {/* BODY */}
      <rect
        x="13.5"
        y="46"
        width="27"
        height="12"
        rx="6"
        fill="url(#robotBodyGrad)"
        stroke="#E5B95C"
        strokeWidth="1.6"
      />

      {/* GRADUATION BOW TIE (Nơ cổ vàng quý phái) */}
      <path
        d="M 27 51 L 22.5 48.5 L 22.5 53.5 Z M 27 51 L 31.5 48.5 L 31.5 53.5 Z"
        fill="url(#goldGrad)"
        stroke="#B8860B"
        strokeWidth="0.7"
      />
      <circle cx="27" cy="51" r="1.6" fill="#C99436" />
    </svg>
  );
}

// ---------- ARC TRACK (decorative curved line connecting buttons) ----------

function ArcTrack({ radius, count = 4 }: { radius: number; count?: number }) {
  // Angle range: extends slightly past 180° and 90° (from 195° down to 75°)
  // so the arc cradles all buttons gracefully
  const extStart = 195;
  const extEnd = 75;
  const startRad = (extStart * Math.PI) / 180;
  const endRad = (extEnd * Math.PI) / 180;
  const x1 = Math.cos(startRad) * radius;
  const y1 = -Math.sin(startRad) * radius;
  const x2 = Math.cos(endRad) * radius;
  const y2 = -Math.sin(endRad) * radius;

  const padding = 20;
  const size = (radius + padding) * 2;
  const half = radius + padding;

  const startAngle = 180;
  const endAngle = 90;
  const angles = Array.from({ length: count }, (_, i) =>
    count > 1 ? startAngle - i * ((startAngle - endAngle) / (count - 1)) : startAngle
  );

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox={`-${half} -${half} ${size} ${size}`}
      className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[10]"
      style={{ left: 0, top: 0 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <defs>
        <linearGradient id="arcGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#C9A96E" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#F5DEB3" stopOpacity="1" />
          <stop offset="100%" stopColor="#C9A96E" stopOpacity="0.85" />
        </linearGradient>
      </defs>

      {/* Soft warm glow under arc */}
      <motion.path
        d={`M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`}
        stroke="#F5DEB3"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
        opacity="0.35"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        exit={{ pathLength: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />

      {/* Main crisp golden arc track */}
      <motion.path
        d={`M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`}
        stroke="url(#arcGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        exit={{ pathLength: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />

      {/* Golden anchor dots sitting right at the center of each button position */}
      {angles.map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = Math.cos(rad) * radius;
        const y = -Math.sin(rad) * radius;
        return (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r="3.5"
            fill="#FFFFFF"
            stroke="#C9A96E"
            strokeWidth="1.5"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ delay: 0.12 + i * 0.06, duration: 0.25 }}
          />
        );
      })}
    </motion.svg>
  );
}

// ---------- LIVE LOCATION POPUP (DÀNH CHO KHÁCH MỜI XEM) ----------

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

const CACHE_KEY = "grad-live-status-cache";
const TDTU_COORDS = { latitude: 10.73241, longitude: 106.69912 };

function formatTime(isoString?: string) {
  if (!isoString) return "";
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

function formatDate(isoString?: string) {
  if (!isoString) return "";
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return "";
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return "Hôm nay";
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Hôm qua";
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
}

// Haversine formula to compute distance between Guest and Host
function calculateDistanceInMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `khoảng ~${Math.round(meters)}m`;
  return `khoảng ~${(meters / 1000).toFixed(1)}km`;
}

function renderMessageText(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, i) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#f5deb3] underline font-medium hover:text-white break-all transition-colors inline-flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <span>{part}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function LiveLocationPopup({
  onClose,
  onOpenParking,
}: {
  onClose: () => void;
  onOpenParking?: () => void;
}) {
  const [messages, setMessages] = useState<StatusMessage[]>([]);
  const [hostGps, setHostGps] = useState<GpsLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapType, setMapType] = useState<"osm" | "google">("google");
  const [copied, setCopied] = useState(false);
  const [measuringDistance, setMeasuringDistance] = useState(false);
  const [distanceText, setDistanceText] = useState<string | null>(null);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  const touchStartY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchEndY - touchStartY.current;
    const container = e.currentTarget;
    if (container.scrollTop <= 2 && deltaY > 75) {
      onClose();
    }
  };

  // Network State
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Fetch status updates from backend API
  const fetchStatus = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const res = await fetch("/api/status", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.messages)) {
          setMessages(data.messages);
          if (data.latestGps) {
            setHostGps(data.latestGps);
          }
          try {
            localStorage.setItem(
              CACHE_KEY,
              JSON.stringify({ messages: data.messages, latestGps: data.latestGps })
            );
          } catch { /* storage full */ }
        }
      }
    } catch {
      // Offline fallback: load cached data
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.messages) setMessages(parsed.messages);
          if (parsed.latestGps) setHostGps(parsed.latestGps);
        }
      } catch { /* ignore */ }
    } finally {
      setIsLoading(false);
      if (isManual) {
        setTimeout(() => setIsRefreshing(false), 500);
      }
    }
  }, []);

  // Initial load + Auto-polling every 8 seconds
  useEffect(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.messages) setMessages(parsed.messages);
        if (parsed.latestGps) setHostGps(parsed.latestGps);
        setIsLoading(false);
      }
    } catch { /* ignore */ }

    fetchStatus(false);
    const interval = setInterval(() => {
      fetchStatus(false);
    }, 8000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Copy Host GPS coordinates
  const handleCopyHostGps = () => {
    if (!hostGps) return;
    const textToCopy = `${hostGps.latitude.toFixed(6)}, ${hostGps.longitude.toFixed(6)}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Guest measures distance to Host using guest's GPS
  const handleMeasureDistance = () => {
    if (!hostGps) return;
    if (!navigator.geolocation) {
      alert("Thiết bị không hỗ trợ định vị để đo khoảng cách.");
      return;
    }
    setMeasuringDistance(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMeasuringDistance(false);
        const dist = calculateDistanceInMeters(
          pos.coords.latitude,
          pos.coords.longitude,
          hostGps.latitude,
          hostGps.longitude
        );
        setDistanceText(formatDistance(dist));
      },
      (err) => {
        setMeasuringDistance(false);
        alert("Không thể lấy vị trí của bạn: " + err.message);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Determine target coordinates for map (host GPS if available, else TDTU)
  const targetCoords = hostGps || TDTU_COORDS;

  // Interactive HTML map với Leaflet hỗ trợ đầy đủ Zoom (lăn chuột/cảm ứng) và Drag/Pan 360 độ mượt mà
  // Cả Google Maps và OpenStreetMap đều tương tác tự do, không bị khóa như iframe embed mặc định của Google
  const interactiveMapHtml = useMemo(() => {
    const lat = targetCoords.latitude;
    const lng = targetCoords.longitude;
    const isHost = Boolean(hostGps);
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #map { width: 100%; height: 100%; background: #1a1612; overflow: hidden; }
    .leaflet-control-zoom { border: none !important; box-shadow: 0 2px 8px rgba(0,0,0,0.5) !important; margin: 8px !important; }
    .leaflet-control-zoom a {
      background: rgba(26, 22, 18, 0.92) !important;
      color: #f5deb3 !important;
      border: 1px solid rgba(201, 169, 110, 0.35) !important;
      font-size: 16px !important;
      width: 28px !important;
      height: 28px !important;
      line-height: 26px !important;
      border-radius: 6px !important;
      margin-bottom: 3px !important;
      transition: all 0.2s ease;
    }
    .leaflet-control-zoom a:hover {
      background: #c9a96e !important;
      color: #14100c !important;
    }
    .leaflet-control-attribution {
      background: rgba(0,0,0,0.65) !important;
      color: #bbb !important;
      font-size: 9px !important;
      padding: 1px 5px !important;
    }
    .leaflet-control-attribution a { color: #f5deb3 !important; text-decoration: none; }
    .pulse-marker {
      position: relative;
      width: 24px;
      height: 24px;
    }
    .pulse-marker .dot {
      width: 14px;
      height: 14px;
      background: #EA4335;
      border: 2px solid #ffffff;
      border-radius: 50%;
      position: absolute;
      top: 5px;
      left: 5px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.6);
    }
    .pulse-marker .ring {
      width: 24px;
      height: 24px;
      background: rgba(234, 67, 53, 0.45);
      border-radius: 50%;
      position: absolute;
      top: 0;
      left: 0;
      animation: pulse 1.8s infinite ease-out;
    }
    @keyframes pulse {
      0% { transform: scale(0.6); opacity: 1; }
      100% { transform: scale(1.6); opacity: 0; }
    }
    .leaflet-popup-content-wrapper {
      background: #1e1914 !important;
      color: #fff !important;
      border: 1px solid rgba(201, 169, 110, 0.4);
      border-radius: 8px !important;
      box-shadow: 0 4px 15px rgba(0,0,0,0.6) !important;
    }
    .leaflet-popup-content {
      margin: 8px 12px !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 11px;
      line-height: 1.4;
    }
    .leaflet-popup-tip { background: #1e1914 !important; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    const map = L.map('map', {
      center: [${lat}, ${lng}],
      zoom: 17,
      zoomControl: true,
      scrollWheelZoom: true,
      dragging: true,
      touchZoom: true,
      doubleClickZoom: true,
      boxZoom: true
    });

    if ('${mapType}' === 'google') {
      L.tileLayer('https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: '0123',
        attribution: '&copy; Google Maps'
      }).addTo(map);
    } else {
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);
    }

    const customIcon = L.divIcon({
      className: 'pulse-icon',
      html: '<div class="pulse-marker"><div class="ring"></div><div class="dot"></div></div>',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12]
    });

    const marker = L.marker([${lat}, ${lng}], { icon: customIcon }).addTo(map);
    marker.bindPopup(${
      isHost
        ? `'<strong style="color:#c9a96e">📍 Vị trí Host (Trực tiếp)</strong><br><span style="color:#ddd;font-size:10.5px">Toạ độ: ${lat.toFixed(5)}, ${lng.toFixed(5)}</span>'`
        : `'<strong style="color:#c9a96e">📍 Trường ĐH Tôn Đức Thắng</strong><br><span style="color:#ddd;font-size:10.5px">19 Nguyễn Hữu Thọ, P. Tân Phong, Q.7</span>'`
    });
  </script>
</body>
</html>`;
  }, [targetCoords.latitude, targetCoords.longitude, hostGps, mapType]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" />

        <motion.div
          drag="y"
          dragListener={false}
          dragControls={dragControls}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0.05, bottom: 0.7 }}
          onDragEnd={(_, info) => {
            if (info.offset.y > 75 || info.velocity.y > 350) {
              onClose();
            }
          }}
          initial={{ scale: 0.92, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: "100%", transition: { duration: 0.25 } }}
          transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
          className="relative z-10 w-full max-w-[440px] sm:rounded-2xl rounded-t-2xl overflow-hidden flex flex-col"
          style={{
            maxHeight: "min(92vh, 690px)",
            background: "linear-gradient(160deg, #1e1914 0%, #2a2118 40%, #1a1612 100%)",
            boxShadow: "0 -8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,169,110,0.15), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile Drag-to-dismiss Handle Bar */}
          <div
            className="w-full pt-3 pb-1 flex justify-center items-center sm:hidden cursor-grab active:cursor-grabbing touch-none select-none"
            onPointerDown={(e) => dragControls.start(e)}
          >
            <div className="w-12 h-1.5 rounded-full bg-white/30 hover:bg-white/50 active:bg-[#c9a96e] transition-colors" />
          </div>

          {/* Offline banner */}
          {!isOnline && (
            <div className="px-4 py-1.5 bg-amber-500/15 border-b border-amber-500/30 flex items-center justify-between text-[11px] text-amber-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                Mạng yếu / Mất mạng — Bạn vẫn có thể sao chép toạ độ GPS bên dưới
              </span>
            </div>
          )}

          {/* ── HEADER ── */}
          <div
            onPointerDown={(e) => {
              if ((e.target as HTMLElement).closest("button, a")) return;
              dragControls.start(e);
            }}
            className="px-4 pt-1 sm:pt-4 pb-3 shrink-0 cursor-grab active:cursor-grabbing touch-none select-none"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "linear-gradient(135deg, #EA4335 0%, #C62828 100%)", boxShadow: "0 3px 10px rgba(234,67,53,0.35)" }}
              >
                <LocationIcon />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[15px] font-bold text-white/95 leading-tight">Xem thực tại (Vị trí)</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </span>
                  <span className="text-[11px] text-green-400/80 font-medium">Theo dõi thời gian thực</span>
                </div>
              </div>

              {/* Refresh & Close */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => fetchStatus(true)}
                  disabled={isRefreshing}
                  title="Làm mới cập nhật"
                  className="w-8 h-8 rounded-full bg-white/8 hover:bg-white/15 flex items-center justify-center text-white/50 hover:text-[#c9a96e] transition-all duration-200"
                >
                  <motion.svg
                    animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
                    transition={isRefreshing ? { duration: 0.8, repeat: Infinity, ease: "linear" } : { duration: 0.2 }}
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  >
                    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                  </motion.svg>
                </button>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/8 hover:bg-white/15 flex items-center justify-center text-white/50 hover:text-white/80 transition-all duration-200"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-[#c9a96e]/25 to-transparent mx-3" />

          {/* ── HOST GPS HERO CARD (Dành cho mạng yếu & copy tra cứu) ── */}
          <div
            onPointerDown={(e) => {
              if ((e.target as HTMLElement).closest("button, a")) return;
              dragControls.start(e);
            }}
            className="px-4 py-2.5 shrink-0 bg-black/25 border-b border-white/5 cursor-grab active:cursor-grabbing touch-none select-none"
          >
            {hostGps ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[12px] font-bold text-[#f5deb3]">Tọa độ GPS thực tế của Host</span>
                  </div>
                  <span className="text-[10.5px] text-white/40">
                    Sai số ±{Math.round(hostGps.accuracy)}m
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-[#c9a96e]/25">
                  <span className="text-xs font-mono text-emerald-300 font-semibold tracking-wide">
                    {hostGps.latitude.toFixed(6)}, {hostGps.longitude.toFixed(6)}
                  </span>

                  <button
                    onClick={handleCopyHostGps}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#c9a96e]/20 hover:bg-[#c9a96e]/30 text-[#f5deb3] text-[11px] font-semibold transition-all active:scale-95"
                  >
                    {copied ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckIcon className="w-3 h-3" />
                        <span>Đã chép!</span>
                      </span>
                    ) : (
                      <>
                        <CopyIcon className="w-3 h-3" />
                        <span>Sao chép GPS</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Distance calculation & Directions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleMeasureDistance}
                    disabled={measuringDistance}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-medium text-white/80 active:scale-95 transition-all"
                  >
                    <CompassIcon className="w-3.5 h-3.5 text-[#c9a96e]" />
                    <span>
                      {measuringDistance
                        ? "Đang đo..."
                        : distanceText
                        ? `Cách bạn ${distanceText}`
                        : "Đo khoảng cách tới Host"}
                    </span>
                  </button>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${hostGps.latitude},${hostGps.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#c9a96e]/15 hover:bg-[#c9a96e]/25 text-[#f5deb3] border border-[#c9a96e]/30 text-[11px] font-semibold active:scale-95 transition-all"
                  >
                    <NavigationIcon className="w-3.5 h-3.5" />
                    <span>Dẫn đường</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between text-xs text-white/50 py-0.5">
                <span className="flex items-center gap-1.5">
                  <PinIcon className="w-3.5 h-3.5 text-[#c9a96e]" />
                  <span>Host chưa gửi toạ độ GPS (hiển thị vị trí trường TDTU)</span>
                </span>
              </div>
            )}
          </div>

          {/* ── STATUS MESSAGES SECTION (Tình hình kèm Ảnh Cloud) ── */}
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="flex-1 overflow-y-auto min-h-[110px] max-h-[175px] px-4 py-2.5 scroll-smooth"
            style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(201,169,110,0.3) transparent" }}
          >
            {isLoading && messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-5">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-[#c9a96e]/30 border-t-[#c9a96e] rounded-full mb-1.5"
                />
                <span className="text-[11px] text-white/40">Đang tải tình hình...</span>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-5 text-center">
                <p className="text-[12px] text-white/50 font-medium">
                  Host chưa có cập nhật mới.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {messages.map((msg, idx) => {
                  const isWelcome = msg.isWelcome || msg.id === 1;
                  const showDate =
                    !isWelcome &&
                    Boolean(msg.timestamp) &&
                    (idx === 0 ||
                      formatDate(msg.timestamp) !== formatDate(messages[idx - 1].timestamp));
                  return (
                    <div key={msg.id}>
                      {showDate && (
                        <div className="flex items-center justify-center my-1.5">
                          <div className="h-px flex-1 bg-white/8" />
                          <span className="px-2 text-[9.5px] text-white/35 font-medium uppercase tracking-wider">{formatDate(msg.timestamp)}</span>
                          <div className="h-px flex-1 bg-white/8" />
                        </div>
                      )}
                      <motion.div
                        initial={idx === messages.length - 1 ? { opacity: 0, y: 8 } : false}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-2 items-start"
                      >
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-sm"
                          style={{
                            background: "linear-gradient(135deg, #c9a96e 0%, #8a6532 100%)",
                            border: "1px solid rgba(255,255,255,0.25)",
                          }}
                        >
                          <GraduationIcon className="w-3.5 h-3.5 text-[#1a1208]" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[10.5px] font-semibold text-[#f5deb3]/90">Host</span>
                            {!isWelcome && msg.timestamp && (
                              <span className="text-[9.5px] text-white/35">• {formatTime(msg.timestamp)}</span>
                            )}
                            {isWelcome && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#c9a96e]/15 text-[#f5deb3]/80 font-medium border border-[#c9a96e]/20">
                                Lời giới thiệu
                              </span>
                            )}
                            {msg.location && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono inline-flex items-center gap-1">
                                <PinIcon className="w-2.5 h-2.5" />
                                <span>Có GPS</span>
                              </span>
                            )}
                          </div>
                          <div
                            className="rounded-xl rounded-tl-sm px-3 py-2"
                            style={{
                              background: "linear-gradient(145deg, rgba(201,169,110,0.14) 0%, rgba(201,169,110,0.06) 100%)",
                              border: "1px solid rgba(201,169,110,0.22)",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                            }}
                          >
                            <p className="text-[12.5px] text-white/90 leading-relaxed break-words font-medium">
                              {renderMessageText(msg.text)}
                            </p>

                            {/* Attached Image Thumbnail */}
                            {msg.imageUrl && (
                              <div className="mt-2">
                                <button
                                  type="button"
                                  onClick={() => setLightboxImg(msg.imageUrl || null)}
                                  className="block relative rounded-lg overflow-hidden border border-[#c9a96e]/30 group hover:opacity-90 transition-opacity"
                                >
                                  <img
                                    src={msg.imageUrl}
                                    alt="Ảnh chụp thực tế của Host"
                                    className="max-h-32 w-auto object-cover rounded-lg"
                                  />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[11px] font-semibold transition-opacity gap-1.5">
                                    <SearchZoomIcon className="w-3.5 h-3.5" />
                                    <span>Bấm để phóng to</span>
                                  </div>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* ── MAP HEADER (Chọn bản đồ không giới hạn) ── */}
          <div className="px-4 py-1.5 bg-black/30 border-t border-white/5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-semibold text-[#f5deb3] flex items-center gap-1.5">
                <MapOutlineIcon className="w-3.5 h-3.5 text-[#c9a96e]" />
                <span>Bản đồ thời gian thực</span>
                {hostGps && <span className="text-[10px] text-emerald-400 font-normal">(Vị trí Host)</span>}
              </span>
              {onOpenParking && (
                <button
                  type="button"
                  onClick={onOpenParking}
                  className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-[10px] font-semibold active:scale-95 transition-all"
                  title="Mở sơ đồ gửi xe TDTU"
                >
                  <ParkingIcon className="w-2.5 h-2.5" />
                  <span>Sơ đồ gửi xe</span>
                </button>
              )}
            </div>

            {/* Map Switcher: OpenStreetMap (Unlimited) vs Google Maps */}
            <div className="flex items-center rounded-lg bg-white/5 p-0.5 border border-white/10 text-[10px]">            
              <button
                onClick={() => {
                  setMapLoaded(false);
                  setMapType("google");
                }}
                className={`px-2 py-0.5 rounded font-medium transition-all ${
                  mapType === "google"
                    ? "bg-[#c9a96e] text-[#14100c] font-bold shadow"
                    : "text-white/60 hover:text-white"
                }`}
                title="Bản đồ Google Maps (Zoom & Di chuyển tự do)"
              >
                Google Maps
              </button>
              <button
                onClick={() => {
                  setMapLoaded(false);
                  setMapType("osm");
                }}
                className={`px-2 py-0.5 rounded font-medium transition-all ${
                  mapType === "osm"
                    ? "bg-[#c9a96e] text-[#14100c] font-bold shadow"
                    : "text-white/60 hover:text-white"
                }`}
                title="OpenStreetMap - Không giới hạn"
              >
                OpenStreetMap
              </button>
            </div>
          </div>

          {/* ── MAP EMBED CONTAINER ── */}
          <div className="relative shrink-0" style={{ height: "200px" }}>
            {!mapLoaded && isOnline && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#1a1612] z-[5]">
                <div className="flex flex-col items-center gap-1.5">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-[#c9a96e]/30 border-t-[#c9a96e] rounded-full"
                  />
                  <span className="text-[10.5px] text-white/35">Đang tải bản đồ...</span>
                </div>
              </div>
            )}

            {!mapLoaded && !isOnline && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1a1612] p-4 text-center z-[5]">
                <PinIcon className="w-6 h-6 mb-1 text-[#c9a96e]/70" />
                <p className="text-[11px] text-white/50 leading-relaxed">
                  Mất kết nối mạng để tải hình bản đồ.<br />
                  <span className="text-[#f5deb3]">Tọa độ GPS của Host vẫn lưu ở khung trên, hãy bấm sao chép!</span>
                </p>
              </div>
            )}

            <iframe
              key={`${mapType}-${targetCoords.latitude.toFixed(5)}-${targetCoords.longitude.toFixed(5)}`}
              srcDoc={interactiveMapHtml}
              width="100%"
              height="200"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="Bản đồ theo dõi thực tại"
              onLoad={() => setMapLoaded(true)}
              className="w-full h-full"
            />

            {/* Host Pin Tag on Map */}
            {hostGps && (
              <div className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2 py-1 rounded-md bg-black/85 border border-[#c9a96e]/40 backdrop-blur-md text-[10px] text-[#f5deb3] shadow-lg pointer-events-none">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="font-bold">Host:</span>
                <span>{hostGps.latitude.toFixed(5)}, {hostGps.longitude.toFixed(5)}</span>
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 h-5 bg-gradient-to-t from-[#1a1612] to-transparent pointer-events-none" />
          </div>

          {/* ── FOOTER ── */}
          <div className="px-4 py-2 shrink-0">
            <a
              href={`https://maps.google.com/?q=${targetCoords.latitude},${targetCoords.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg text-[11.5px] font-semibold text-[#c9a96e] bg-[#c9a96e]/10 hover:bg-[#c9a96e]/15 active:scale-[0.98] transition-all duration-200"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              <span>Mở trong ứng dụng Google Maps</span>
            </a>
          </div>
        </motion.div>
      </motion.div>

      {/* Lightbox Modal để phóng to ảnh */}
      <AnimatePresence>
        {lightboxImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setLightboxImg(null)}
          >
            <motion.div
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0.2, bottom: 0.7 }}
              onDragEnd={(_, info) => {
                if (Math.abs(info.offset.y) > 70 || Math.abs(info.velocity.y) > 300) {
                  setLightboxImg(null);
                }
              }}
              className="relative max-w-full max-h-full cursor-grab active:cursor-grabbing"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightboxImg}
                alt="Ảnh phóng to"
                className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl shadow-2xl border border-white/20 select-none pointer-events-none"
              />
              <button
                onClick={() => setLightboxImg(null)}
                className="absolute top-2 right-2 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white text-base flex items-center justify-center border border-white/20 transition-colors"
                title="Đóng ảnh"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ---------- PARKING MODAL (HƯỚNG DẪN & SƠ ĐỒ GỬI XE TDTU) ----------

function ParkingModal({ onClose }: { onClose: () => void }) {
  const [isZoomed, setIsZoomed] = useState(false);
  const dragControls = useDragControls();

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

        <motion.div
          drag="y"
          dragListener={false}
          dragControls={dragControls}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0.05, bottom: 0.7 }}
          onDragEnd={(_, info) => {
            if (info.offset.y > 75 || info.velocity.y > 350) {
              onClose();
            }
          }}
          initial={{ scale: 0.92, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: "100%", transition: { duration: 0.25 } }}
          transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
          className="relative z-10 w-full max-w-[490px] sm:rounded-2xl rounded-t-2xl overflow-hidden flex flex-col"
          style={{
            maxHeight: "min(92vh, 740px)",
            background: "linear-gradient(160deg, #1e1914 0%, #2a2118 40%, #1a1612 100%)",
            boxShadow: "0 -8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,169,110,0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile Drag-to-dismiss Handle Bar */}
          <div
            className="w-full pt-3 pb-1 flex justify-center items-center sm:hidden cursor-grab active:cursor-grabbing touch-none select-none"
            onPointerDown={(e) => dragControls.start(e)}
          >
            <div className="w-12 h-1.5 rounded-full bg-white/30 hover:bg-white/50 active:bg-[#c9a96e] transition-colors" />
          </div>

          {/* ── HEADER ── */}
          <div
            onPointerDown={(e) => {
              if ((e.target as HTMLElement).closest("button, a")) return;
              dragControls.start(e);
            }}
            className="px-4 pt-1 sm:pt-4 pb-3 shrink-0 cursor-grab active:cursor-grabbing touch-none select-none"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
                  boxShadow: "0 3px 10px rgba(245,158,11,0.35)",
                }}
              >
                <ParkingIcon className="w-5 h-5 text-[#14100c]" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-[15px] font-bold text-white/95 leading-tight">
                  Sơ đồ & Vị trí gửi xe
                </h3>
                <p className="text-[11px] text-[#f5deb3]/85 font-medium mt-0.5">
                  Trường Đại học Tôn Đức Thắng (TDTU)
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/8 hover:bg-white/15 flex items-center justify-center text-white/50 hover:text-white/80 transition-all duration-200"
                aria-label="Đóng"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-[#c9a96e]/25 to-transparent mx-3" />

          {/* ── SCROLLABLE BODY ── */}
          <div
            className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
            style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(201,169,110,0.3) transparent" }}
          >
            {/* Chú giải nhanh phân luồng gửi xe */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-start gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0 mt-0.5 shadow-sm" />
                <div>
                  <span className="font-bold text-blue-300 block">Xe Ô tô</span>
                  <span className="text-white/70 text-[10px] leading-tight">
                    Đi theo hướng cam vào bãi đỗ xe ô tô
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-900 border border-amber-400 shrink-0 mt-0.5 shadow-sm" />
                <div>
                  <span className="font-bold text-amber-300 block">Xe Máy</span>
                  <span className="text-white/70 text-[10px] leading-tight">
                    Vào Cổng 9 hoặc cổng CSND tới nhà xe máy
                  </span>
                </div>
              </div>
            </div>

            {/* Khung hiển thị ảnh sơ đồ */}
            <div className="relative rounded-xl overflow-hidden border border-[#c9a96e]/35 bg-white shadow-lg group">
              <img
                src="/park.png"
                alt="Sơ đồ gửi xe Trường Đại học Tôn Đức Thắng"
                className="w-full h-auto object-contain cursor-zoom-in transition-transform duration-200 group-hover:scale-[1.01]"
                onClick={() => setIsZoomed(true)}
              />

              {/* Nút bấm phóng to nổi góc trên ảnh */}
              <button
                type="button"
                onClick={() => setIsZoomed(true)}
                className="absolute bottom-2.5 right-2.5 px-2.5 py-1.5 rounded-lg bg-black/80 hover:bg-black text-[#f5deb3] text-[11px] font-semibold backdrop-blur-md border border-[#c9a96e]/40 flex items-center gap-1.5 shadow-lg active:scale-95 transition-all"
              >
                <SearchZoomIcon className="w-3.5 h-3.5" />
                <span>Xem phóng to</span>
              </button>
            </div>

            {/* Lưu ý & hướng dẫn di chuyển */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11.5px] space-y-1.5 text-white/80">
              <div className="flex items-center gap-1.5 font-bold text-[#f5deb3]">
                <PinIcon className="w-3.5 h-3.5 text-[#c9a96e]" />
                <span>Hướng dẫn di chuyển & Lối vào:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-white/70 text-[11px] leading-relaxed">
                <li><strong className="text-white">Lối vào Cổng 7:</strong> Hướng vào bãi đỗ xe chính theo điều phối của bảo vệ.</li>
                <li><strong className="text-white">Lối vào Cổng 9:</strong> Nằm ở phía đường bờ sông, lối vào phụ và thông thoáng nhất cho khách đi xe máy & ô tô.</li>
              </ul>
            </div>
          </div>

          {/* ── FOOTER ── */}
          <div className="p-3 bg-black/35 border-t border-white/10 shrink-0 flex items-center gap-2">
            <button
              onClick={() => setIsZoomed(true)}
              className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#c9a96e] to-[#a07a42] hover:brightness-110 active:scale-[0.98] text-[#14100c] text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <SearchZoomIcon className="w-3.5 h-3.5" />
              <span>Phóng to toàn màn hình</span>
            </button>

            <a
              href="/park.png"
              download="So_do_gui_xe_TDTU.png"
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 active:scale-[0.98] text-[#f5deb3] text-xs font-semibold border border-white/15 transition-all flex items-center justify-center gap-1.5"
              title="Tải ảnh sơ đồ về máy"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Tải ảnh</span>
            </a>
          </div>
        </motion.div>
      </motion.div>

      {/* Lightbox Modal phóng to ảnh sơ đồ đỗ xe */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10001] bg-black/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 cursor-pointer"
            onClick={() => setIsZoomed(false)}
          >
            <motion.div
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0.2, bottom: 0.7 }}
              onDragEnd={(_, info) => {
                if (Math.abs(info.offset.y) > 70 || Math.abs(info.velocity.y) > 300) {
                  setIsZoomed(false);
                }
              }}
              className="relative max-w-full max-h-full cursor-grab active:cursor-grabbing"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src="/park.png"
                alt="Sơ đồ gửi xe phóng to"
                className="max-h-[90vh] max-w-[96vw] object-contain rounded-xl shadow-2xl border border-white/20 select-none bg-white"
              />
              <button
                onClick={() => setIsZoomed(false)}
                className="absolute top-2 right-2 w-9 h-9 rounded-full bg-black/80 hover:bg-black text-white text-base flex items-center justify-center border border-white/25 transition-colors shadow-lg"
                title="Đóng ảnh"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ---------- MAIN FAB COMPONENT ----------

interface FloatingActionButtonProps {
  phoneNumber?: string;
  mapUrl?: string;
  liveLocationUrl?: string;
}

export default function FloatingActionButton({
  phoneNumber = "0334053171",
  mapUrl = "",
  liveLocationUrl = "",
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showParkingModal, setShowParkingModal] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [lockedMessage, setLockedMessage] = useState(
    "Tính năng này sẽ được sử dụng vào ngày tốt nghiệp"
  );
  const [showLockedModal, setShowLockedModal] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isTooltipDismissed, setIsTooltipDismissed] = useState(false);

  useEffect(() => {
    // Hiển thị chú thích sau 1s để tạo sự chú ý tự nhiên
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchLockStatus = async () => {
      try {
        const res = await fetch("/api/status", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
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
      }
    };
    fetchLockStatus();
    const interval = setInterval(fetchLockStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const actions = [
    {
      id: "map",
      label: "Sơ đồ trường TDTU",
      desc: "Mở bản đồ trường TDTU để biết vị trí của các tòa",
      icon: <MapIcon />,
      onClick: () => {
        if (mapUrl) {
          window.open(mapUrl, "_blank");
        } else {
          window.open("https://discovery.tdtu.edu.vn/?fbclid=IwY2xjawR8E1ZleHRuA2FlbQIxMQBicmlkETE2dlZCVHdaQWxCV0NGeTJXc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHnEQ3xbn1GP7a5BAhB1rmk5OGGhK1_5nrLN6p9M3YcZA4DXX-sXjjSgS3Y5F_aem_9mRM0gGzCJTJ8UWwHKsAOA", "_blank");
        }
        setIsOpen(false);
      },
      color: "#4285F4",
      darkColor: "#2563EB",
      glowColor: "rgba(66, 133, 244, 0.4)",
    },
    {
      id: "parking",
      label: "Sơ đồ gửi xe",
      desc: "Xem vị trí & sơ đồ bãi đỗ xe máy / ô tô",
      icon: <ParkingIcon />,
      onClick: () => {
        setShowParkingModal(true);
        setIsOpen(false);
      },
      color: "#F59E0B",
      darkColor: "#D97706",
      glowColor: "rgba(245, 158, 11, 0.4)",
    },
    {
      id: "phone",
      label: "Gọi điện thoại",
      desc: "Gọi điện thoại trực tiếp cho Host",
      icon: <PhoneIcon />,
      onClick: () => {
        window.location.href = `tel:${phoneNumber}`;
        setIsOpen(false);
      },
      color: "#34A853",
      darkColor: "#16A34A",
      glowColor: "rgba(52, 168, 83, 0.4)",
    },
    {
      id: "location",
      label: "Xem thực tại",
      desc: "Xem vị trí GPS & cập nhật từ Host",
      icon: <LocationIcon />,
      onClick: async () => {
        let currentUnlocked = isUnlocked;
        try {
          const res = await fetch("/api/status", { cache: "no-store" });
          if (res.ok) {
            const data = await res.json();
            if (data.success && typeof data.isUnlocked === "boolean") {
              currentUnlocked = data.isUnlocked;
              setIsUnlocked(data.isUnlocked);
              if (data.lockedMessage) {
                setLockedMessage(data.lockedMessage);
              }
            }
          }
        } catch {
          // ignore
        }

        if (!currentUnlocked) {
          setShowLockedModal(true);
          setIsOpen(false);
          return;
        }
        if (liveLocationUrl) {
          window.open(liveLocationUrl, "_blank");
        } else {
          setShowLocationModal(true);
        }
        setIsOpen(false);
      },
      color: "#EA4335",
      darkColor: "#DC2626",
      glowColor: "rgba(234, 67, 53, 0.4)",
    },
  ];

  // Radius from center of robot to center of action buttons: 80px (for 4 buttons without overlap)
  const arcRadius = 80;
  const startAngle = 180; // Map: left (180°)
  const endAngle = 90;    // Location: top (90°)
  const angleStep = (startAngle - endAngle) / (actions.length - 1); // 30° step

  return (
    <>
      {/* Backdrop overlay when menu is open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9989]"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Guide Toast positioned at top-center of the screen */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed top-5 left-0 right-0 flex justify-center z-[9995] pointer-events-none px-4">
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-[340px] pointer-events-auto"
            >
              <div
                className="relative rounded-2xl p-3.5 shadow-2xl backdrop-blur-xl border border-[#c9a96e]/40"
                style={{
                  background: "linear-gradient(145deg, rgba(28, 22, 16, 0.96) 0%, rgba(44, 34, 25, 0.98) 100%)",
                  boxShadow: "0 18px 45px rgba(0,0,0,0.5), 0 0 25px rgba(201,169,110,0.15), inset 0 1px 0 rgba(255,255,255,0.1)",
                }}
              >
                {/* Header */}
                <div className="flex items-center gap-2 pb-2 mb-2 border-b border-[#c9a96e]/20">
                  <div className="w-6 h-6 rounded-full bg-[#c9a96e]/20 flex items-center justify-center text-[#c9a96e] shrink-0">
                    <GraduationIcon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[13px] font-bold text-[#f5deb3] font-montserrat tracking-wide leading-tight">
                      Hướng dẫn tiện ích
                    </h4>
                    <p className="text-[11px] text-white/55 leading-tight mt-0.5">
                      Bấm nút màu ở góc dưới hoặc chọn nhanh:
                    </p>
                  </div>
                </div>

                {/* 3 Action rows */}
                <div className="space-y-1.5">
                  {actions.map((act) => (
                    <div
                      key={`toast-${act.id}`}
                      onClick={act.onClick}
                      className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-white/10 active:bg-white/15 transition-all cursor-pointer group"
                    >
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white shadow-sm transition-transform group-hover:scale-105"
                        style={{
                          background: `linear-gradient(135deg, ${act.color} 0%, ${act.darkColor} 100%)`,
                          boxShadow: `0 2px 8px ${act.glowColor}`,
                        }}
                      >
                        <div className="scale-75">{act.icon}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-semibold text-white/95 leading-tight">
                          {act.label}
                        </div>
                        <div className="text-[10.5px] text-white/60 leading-tight truncate mt-0.5">
                          {act.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FAB container fixed at bottom-right corner */}
      <div className="fixed bottom-5 right-5 md:bottom-8 md:right-8 z-[9990]" id="fab-container">
        {/* Desktop scale wrapper: scales cluster by ~25% on desktop while keeping mobile intact */}
        <div className="origin-bottom-right scale-100 md:scale-[1.25] lg:scale-[1.3] transition-transform duration-300">
          {/* Wrapper around robot button to establish exact center coordinates */}
          <div className="relative w-[54px] h-[60px] flex items-center justify-center">
          {/* Coordinate Anchor: origin (0, 0) is EXACTLY the center of the robot button */}
          <div className="absolute left-1/2 top-1/2 w-0 h-0 pointer-events-none">
            {/* Decorative Arc Track — runs along the exact same radius and center */}
            <AnimatePresence>
              {isOpen && <ArcTrack radius={arcRadius} count={actions.length} />}
            </AnimatePresence>

            {/* Action buttons along the arc — centers align 100% with the arc line */}
            <AnimatePresence>
              {isOpen &&
                actions.map((action, index) => {
                  const angle = startAngle - index * angleStep;
                  const radian = (angle * Math.PI) / 180;
                  const x = Math.cos(radian) * arcRadius;
                  const y = -Math.sin(radian) * arcRadius;

                  return (
                    <motion.button
                      key={action.id}
                      initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                      animate={{ opacity: 1, x: x, y: y, scale: 1 }}
                      exit={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: index * 0.06,
                        type: "spring",
                        stiffness: 350,
                        damping: 22,
                      }}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={action.onClick}
                      className="absolute -translate-x-1/2 -translate-y-1/2 w-[38px] h-[38px] rounded-full flex items-center justify-center text-white cursor-pointer border-0 outline-none z-[20] pointer-events-auto"
                      style={{
                        left: 0,
                        top: 0,
                        background: `linear-gradient(135deg, ${action.color} 0%, ${action.darkColor} 100%)`,
                        boxShadow: `0 4px 14px ${action.glowColor}, 0 0 0 1.5px rgba(255,255,255,0.4), inset 0 1px 1px rgba(255,255,255,0.5)`,
                      }}
                      aria-label={action.label}
                    >
                      {action.icon}
                    </motion.button>
                  );
                })}
            </AnimatePresence>
          </div>

          {/* Chú thích / Tooltip mời gọi bấm hỗ trợ */}
          <AnimatePresence>
            {!isOpen && showTooltip && !isTooltipDismissed && (
              <motion.div
                initial={{ opacity: 0, x: 12, scale: 0.92 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  y: [0, -3, 0],
                }}
                exit={{ opacity: 0, x: 8, scale: 0.92 }}
                transition={{
                  opacity: { duration: 0.3 },
                  x: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                  scale: { duration: 0.3 },
                  y: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                onClick={toggleOpen}
                className="absolute right-[64px] top-1/2 -translate-y-1/2 z-[40] cursor-pointer select-none group pointer-events-auto"
                title="Bấm để mở tiện ích hỗ trợ"
              >
                <div
                  className="relative flex items-center gap-2 pl-3 pr-2 py-2 rounded-2xl border border-[#c9a96e]/45 backdrop-blur-xl shadow-2xl transition-all duration-200 group-hover:border-[#c9a96e] group-hover:scale-[1.03]"
                  style={{
                    background: "linear-gradient(135deg, rgba(28, 22, 16, 0.96) 0%, rgba(42, 32, 23, 0.98) 100%)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.55), 0 0 20px rgba(201,169,110,0.2), inset 0 1px 0 rgba(255,255,255,0.12)",
                  }}
                >
                  {/* Pulsing indicator dot */}
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c9a96e] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d4af37]" />
                  </span>

                  {/* Text nội dung */}
                  <div className="flex flex-col whitespace-nowrap text-left pr-0.5">
                    <span className="text-[11.5px] font-bold text-[#f5deb3] font-montserrat tracking-wide leading-tight group-hover:text-white transition-colors">
                      Cần hỗ trợ? Bấm tui nhé!
                    </span>
                    <span className="text-[9.5px] text-white/55 leading-tight mt-0.5">
                      Sơ đồ • Gửi xe • Vị trí Host • Liên hệ
                    </span>
                  </div>

                  {/* Nút đóng nhỏ (✕) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsTooltipDismissed(true);
                    }}
                    className="w-4 h-4 rounded-full flex items-center justify-center text-white/40 hover:text-white/90 hover:bg-white/15 transition-all shrink-0 ml-0.5"
                    aria-label="Đóng chú thích"
                  >
                    <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>

                  {/* Đuôi nhọn speech bubble chỉ sang phải (về phía robot mascot) */}
                  <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-0 h-0 border-y-[5px] border-y-transparent border-l-[6px] border-l-[#c9a96e]/45" />
                  <div className="absolute top-1/2 -right-[5px] -translate-y-1/2 w-0 h-0 border-y-[4px] border-y-transparent border-l-[5px] border-l-[#231a12]" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Robot Trigger Button — no circular button background, mascot is the button */}
          <motion.button
            onClick={toggleOpen}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            animate={
              !isOpen
                ? {
                    y: [0, -3, 0],
                  }
                : { y: 0 }
            }
            transition={
              !isOpen
                ? {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
                : { duration: 0.2 }
            }
            className="relative flex items-center justify-center cursor-pointer border-0 outline-none z-[30] p-0 bg-transparent"
            style={{
              filter: "drop-shadow(0 6px 16px rgba(150,114,67,0.35)) drop-shadow(0 2px 4px rgba(0,0,0,0.12))",
            }}
            aria-label={isOpen ? "Đóng menu" : "Mở menu liên hệ"}
          >
            <RobotSVG mouthOpen={isOpen} />

            {/* Soft warm aura pulse behind robot when closed */}
            {!isOpen && (
              <motion.div
                className="absolute inset-0 rounded-full pointer-events-none -z-10"
                style={{
                  background: "radial-gradient(circle, rgba(201,169,110,0.35) 0%, transparent 70%)",
                }}
                animate={{
                  scale: [1, 1.6, 2],
                  opacity: [0.6, 0.2, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            )}
          </motion.button>
        </div>
      </div>
    </div>

      {/* Modal thông báo khi tính năng đang bị khóa */}
      <AnimatePresence>
        {showLockedModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
            onClick={() => setShowLockedModal(false)}
          >
            <motion.div
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0.05, bottom: 0.65 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 60 || info.velocity.y > 350) {
                  setShowLockedModal(false);
                }
              }}
              initial={{ scale: 0.9, opacity: 0, y: 25 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 80 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-[350px] rounded-2xl p-5 border border-[#c9a96e]/35 text-center flex flex-col items-center gap-3.5 shadow-2xl cursor-grab active:cursor-grabbing touch-none select-none"
              style={{
                background: "linear-gradient(155deg, #1e1813 0%, #2a2016 50%, #17130e 100%)",
                boxShadow: "0 20px 50px rgba(0,0,0,0.6), 0 0 25px rgba(201,169,110,0.15)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag handle bar for mobile */}
              <div className="w-10 h-1.5 rounded-full bg-white/25 mx-auto -mt-1 sm:hidden pointer-events-none" />

              {/* Lock SVG Icon */}
              <div className="w-12 h-12 rounded-2xl bg-[#c9a96e]/15 border border-[#c9a96e]/30 flex items-center justify-center text-[#f5deb3]">
                <LockIcon className="w-5 h-5 text-[#f5deb3]" />
              </div>

              <div>
                <h3 className="text-base font-bold text-[#f5deb3] font-montserrat tracking-wide">
                  Xem thực tại (Vị trí)
                </h3>
                <p className="text-xs text-white/90 font-medium mt-1 leading-relaxed px-1">
                  {lockedMessage || "Tính năng này sẽ được sử dụng vào ngày tốt nghiệp"}
                </p>
                <p className="text-[11px] text-white/45 mt-2 leading-relaxed">
                  Host buổi lễ sẽ mở tính năng phát sóng GPS và tình hình trực tiếp vào ngày lễ tốt nghiệp để mọi người dễ dàng gặp nhau.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowLockedModal(false)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#c9a96e] to-[#a07a42] hover:brightness-110 active:scale-[0.98] text-[#14100c] text-xs font-bold uppercase tracking-wider transition-all shadow-md"
              >
                Đã hiểu
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live location modal */}
      <AnimatePresence>
        {showLocationModal && (
          <LiveLocationPopup
            onClose={() => setShowLocationModal(false)}
            onOpenParking={() => {
              setShowLocationModal(false);
              setShowParkingModal(true);
            }}
          />
        )}
      </AnimatePresence>

      {/* Parking map modal */}
      <AnimatePresence>
        {showParkingModal && (
          <ParkingModal onClose={() => setShowParkingModal(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
