import { AnniversaryItem } from './types';

export function getTodayDateString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getTodayMonthDay(): string {
  const now = new Date();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${m}-${d}`;
}

export interface ComputedAnniversary extends AnniversaryItem {
  daysRemaining: number;
  isToday: boolean;
  targetYear: number;
  yearsCount?: number;
  formattedDateJP: string;
}

export function computeAnniversaryCountdown(
  item: AnniversaryItem,
  referenceDate: Date = new Date()
): ComputedAnniversary {
  const [mStr, dStr] = item.date.split('-');
  const month = parseInt(mStr, 10) || 1;
  const day = parseInt(dStr, 10) || 1;

  const today = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate()
  );

  let target = new Date(today.getFullYear(), month - 1, day);
  if (target.getTime() < today.getTime()) {
    target = new Date(today.getFullYear() + 1, month - 1, day);
  }

  const diffTime = target.getTime() - today.getTime();
  const daysRemaining = Math.round(diffTime / (1000 * 60 * 60 * 24));
  const isToday = daysRemaining === 0;
  const targetYear = target.getFullYear();

  const yearsCount = item.originYear
    ? Math.max(1, targetYear - item.originYear)
    : undefined;

  return {
    ...item,
    daysRemaining,
    isToday,
    targetYear,
    yearsCount,
    formattedDateJP: `${month}月${day}日`,
  };
}

export function sortAnniversariesByUpcoming(
  items: AnniversaryItem[],
  wifeBirthday: string,
  wifeName: string
): ComputedAnniversary[] {
  const syncedItems = items.map((item) => {
    if (item.id === 'anniv-wife') {
      return {
        ...item,
        date: wifeBirthday || item.date,
        title: `${wifeName || 'あなた'}のお誕生日`,
      };
    }
    return item;
  });

  return syncedItems
    .map((item) => computeAnniversaryCountdown(item))
    .sort((a, b) => a.daysRemaining - b.daysRemaining);
}

export function calculateStreak(stampedDates: string[]): number {
  if (!stampedDates.length) return 0;
  const set = new Set(stampedDates);
  const now = new Date();
  let checkDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const formatYMD = (dt: Date) => {
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, '0');
    const d = String(dt.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // If today is not yet stamped, check if yesterday was stamped to keep streak alive
  if (!set.has(formatYMD(checkDate))) {
    const yesterday = new Date(checkDate);
    yesterday.setDate(yesterday.getDate() - 1);
    if (!set.has(formatYMD(yesterday))) {
      return 0;
    }
    checkDate = yesterday;
  }

  let streak = 0;
  while (set.has(formatYMD(checkDate))) {
    streak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }
  return streak;
}
