// lib/icons.ts
//
// 📌 Lucide-react icon registry — TEK KAYNAK.
// Mimari: tüm sayfalar aynı icon setini kullanır (kod tekrarı yok).
// lucide-react 1.22.0 named export API'si.
//
// Yeni ikon ekle:
//   1) import'a ekle
//   2) CATEGORY_ICONS veya ICONS map'ine ekle
//
// Avantaj:
//   - Tek import yeri, 1 tree-shake noktası
//   - Icon adı string → component (sayfa route'unda dinamik kullanım)
//   - Bundle: lucide-react 1.22 named export → sadece kullanılanlar

import {
  Code,
  Terminal,
  FileCode,
  Bug,
  Lightbulb,
  Play,
  Pause,
  RotateCcw,
  Copy,
  Check,
  X,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  Sparkles,
  Trophy,
  Target,
  Layers,
  ListTree,
  Database,
  Cpu,
  Brain,
  ListOrdered,
  Mountain,
  BookOpen,
  GraduationCap,
  Zap,
  Search,
  Filter,
  Star,
  Clock,
  Hash,
  Settings,
  User,
  Users,
  Lock,
  Unlock,
  LogIn,
  LogOut,
  Mail,
  Eye,
  EyeOff,
  Menu,
  XCircle,
  CheckCircle,
  AlertCircle,
  Info,
  HelpCircle,
  // v1.22 brand icons: yeni versiyonda mevcut, burada kaldırıldı
  // Twitter/Github/Linkedin eklenmeli (raw SVG ile veya custom)
  Share2,
  Send,
  MessageSquare,
  Quote,
  Type,
  AlignLeft,
  TrendingUp,
  Award,
  Compass,
  Map,
  Activity,
  BarChart3,
  PieChart,
  Calendar,
  Tag,
  Bookmark,
  Heart,
  Flame,
  Wrench,
  KeyRound,
  PencilLine,
  FileText,
  Folder,
  Image as ImageIcon,
  Box,
  GitBranch,
  Workflow,
  TrendingDown,
  CircleDot,
  CircleSlash,
  CircleCheck,
  CirclePlay,
  Code2,
  Sigma,
  Binary,
  Braces,
  Regex,
  CpuIcon,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

// ─── 9 pillar kategori icon mapping ───────────────────────────
export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "python-basics": Code,
  "data-structures": Layers,
  "list-dict": ListTree,
  "pandas": Database,
  "algorithms": Cpu,
  "dynamic-programming": Brain,
  "heap": Mountain,
  "stack": Layers,
  "queue": ListOrdered,
};

// ─── Seviye badge icons ────────────────────────────────────────
export const LEVEL_ICONS: Record<string, LucideIcon> = {
  beginner: SproutIcon,
  intermediate: Zap,
  advanced: Trophy,
};

// ─── Bölüm iconları (intro, when-to-use, related) ──────────────
export const SECTION_ICONS = {
  intro: BookOpen,
  when: Compass,
  related: ArrowUpRight,
  tip: Lightbulb,
  warning: AlertCircle,
  check: CheckCircle,
  cross: XCircle,
  target: Target,
} as const;

// ─── UI action icons ───────────────────────────────────────────
export const UI_ICONS = {
  play: Play,
  pause: Pause,
  reset: RotateCcw,
  copy: Copy,
  check: Check,
  x: X,
  share: Share2,
  send: Send,
  search: Search,
  filter: Filter,
  star: Star,
  bookmark: Bookmark,
  menu: Menu,
  arrow: ArrowRight,
  external: ExternalLink,
  chevronRight: ChevronRight,
  chevronLeft: ChevronLeft,
  chevronDown: ChevronDown,
} as const;

// ─── Auth icons ────────────────────────────────────────────────
export const AUTH_ICONS = {
  user: User,
  users: Users,
  lock: Lock,
  unlock: Unlock,
  login: LogIn,
  logout: LogOut,
  mail: Mail,
  eye: Eye,
  eyeOff: EyeOff,
} as const;

// ─── Workspace icons ───────────────────────────────────────────
export const WORKSPACE_ICONS = {
  terminal: Terminal,
  code: FileCode,
  bug: Bug,
  hint: Lightbulb,
  trophy: Trophy,
  flame: Flame,
  heart: Heart,
  award: Award,
  clock: Clock,
  hash: Hash,
  activity: Activity,
  chart: BarChart3,
  pieChart: PieChart,
  wrench: Wrench,
  key: KeyRound,
  edit: PencilLine,
  file: FileText,
  folder: Folder,
  image: ImageIcon,
  box: Box,
  branch: GitBranch,
  workflow: Workflow,
} as const;

// ─── Stat icons (dashboard, /interviews) ───────────────────────
export const STAT_ICONS = {
  sparkles: Sparkles,
  trophy: Trophy,
  target: Target,
  trending: TrendingUp,
  trendingDown: TrendingDown,
  award: Award,
  calendar: Calendar,
  tag: Tag,
} as const;

// ─── Inline emoji → lucide replacement helper ──────────────────
//   Kullanım: <Icon name="python-basics" className="..." />
//   Eski: <span>🐍</span>
//   Yeni: <Icon name="python-basics" />
export type IconName =
  | keyof typeof CATEGORY_ICONS
  | keyof typeof LEVEL_ICONS
  | keyof typeof SECTION_ICONS
  | keyof typeof UI_ICONS
  | keyof typeof AUTH_ICONS
  | keyof typeof WORKSPACE_ICONS
  | keyof typeof STAT_ICONS;

import { Sprout as SproutIcon } from "lucide-react";
