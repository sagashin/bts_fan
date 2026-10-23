export type MemberId =
  | 'OT7'
  | 'RM'
  | 'JIN'
  | 'SUGA'
  | 'J-HOPE'
  | 'JIMIN'
  | 'V'
  | 'JUNG KOOK';

export interface MemberProfile {
  id: MemberId;
  name: string;
  koreanName: string;
  fullName: string;
  birthDate: string; // MM-DD
  birthYear: number;
  roleLabel: string;
  accentHex: string;
  softBgHex: string;
  gradientClass: string;
  badgeTextClass: string;
  greetingTitle: string;
  greetingSub: string;
}

export interface QuoteItem {
  id: string;
  korean: string;
  japanese: string;
  member: MemberId;
  source: string;
  isFavorite?: boolean;
}

export type AnniversaryCategory =
  | 'debut'
  | 'army'
  | 'birthday'
  | 'personal'
  | 'special';

export interface AnniversaryItem {
  id: string;
  title: string;
  date: string; // MM-DD
  originYear?: number;
  category: AnniversaryCategory;
  member?: MemberId;
  description: string;
}

export type MoodCategory =
  | 'healing'
  | 'energy'
  | 'focus'
  | 'laugh'
  | 'sleep';

export interface MoodMeta {
  id: MoodCategory;
  label: string;
  subLabel: string;
  colorHex: string;
  softBgClass: string;
  borderClass: string;
}

export interface PrescriptionItem {
  id: string;
  mood: MoodCategory;
  songTitle: string;
  albumOrEra: string;
  youtubeUrl: string;
  member: MemberId;
  memberMessage: string;
  prescriptionNote: string;
}

export type DiaryMood =
  | 'purple_love'
  | 'touched'
  | 'excited'
  | 'peaceful'
  | 'grateful';

export interface DiaryEntry {
  id: string;
  date: string; // YYYY-MM-DD
  mood: DiaryMood;
  memberTag: MemberId;
  contentTitle: string;
  note: string;
  createdAt: string;
}

export type WatchVisitType = 'watch' | 'visit';
export type WatchVisitStatus = 'todo' | 'done';

export interface WatchVisitItem {
  id: string;
  type: WatchVisitType;
  category: string;
  title: string;
  status: WatchVisitStatus;
  rating: number; // 1 to 5
  memo: string;
  locationOrLink?: string;
  updatedAt: string;
}

export type CollectionCategory =
  | 'Album'
  | 'Photocard'
  | 'Merch'
  | 'DVD / Blu-ray'
  | 'Lightstick';

export type CollectionThemeVariant =
  | 'cosmos'
  | 'lavender'
  | 'velvet'
  | 'rose'
  | 'gold';

export interface CollectionItem {
  id: string;
  title: string;
  category: CollectionCategory;
  member: MemberId;
  eraOrSeries: string;
  memo: string;
  imageUrl?: string;
  themeVariant: CollectionThemeVariant;
  acquiredDate: string;
}

export interface PersonalSettings {
  wifeName: string;
  wifeBirthday: string; // MM-DD
  bias: MemberId;
  secretMessage: string;
  husbandName: string;
}

export interface AppData {
  version: number;
  settings: PersonalSettings;
  stampedDates: string[]; // YYYY-MM-DD
  quotes: QuoteItem[];
  anniversaries: AnniversaryItem[];
  prescriptions: PrescriptionItem[];
  diaryEntries: DiaryEntry[];
  watchVisitList: WatchVisitItem[];
  collectionItems: CollectionItem[];
}
