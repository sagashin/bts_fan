'use client';

import React, { useMemo, useState } from 'react';
import {
  Calendar as CalendarIcon,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Gift,
  Heart,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { AppData, QuoteItem } from '@/lib/types';
import { MEMBER_PROFILES } from '@/lib/seed-data';
import {
  calculateStreak,
  getTodayDateString,
  sortAnniversariesByUpcoming,
} from '@/lib/date-utils';

interface HomeTabProps {
  data: AppData;
  onToggleStamp: (dateStr: string, isTodayAction?: boolean) => void;
  onToggleFavoriteQuote: (quoteId: string) => void;
  onTriggerBurst: (label?: string) => void;
  onOpenSecretLetter: () => void;
}

export function HomeTab({
  data,
  onToggleStamp,
  onToggleFavoriteQuote,
  onTriggerBurst,
  onOpenSecretLetter,
}: HomeTabProps) {
  const { settings, quotes, anniversaries, stampedDates } = data;
  const biasProfile = MEMBER_PROFILES[settings.bias] || MEMBER_PROFILES.OT7;
  const todayStr = getTodayDateString();
  const isTodayStamped = stampedDates.includes(todayStr);

  // Daily quote selection + shuffle index
  const initialQuoteIndex = useMemo(() => {
    if (!quotes.length) return 0;
    const daySeed = new Date().getDate() + new Date().getMonth() * 31;
    return daySeed % quotes.length;
  }, [quotes.length]);

  const [quoteIdx, setQuoteIdx] = useState<number>(initialQuoteIndex);
  const [filterBiasQuotes, setFilterBiasQuotes] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredQuotes = useMemo(() => {
    if (!filterBiasQuotes || settings.bias === 'OT7') return quotes;
    const matches = quotes.filter(
      (q) => q.member === settings.bias || q.member === 'OT7'
    );
    return matches.length > 0 ? matches : quotes;
  }, [quotes, filterBiasQuotes, settings.bias]);

  const currentQuote: QuoteItem | undefined =
    filteredQuotes[quoteIdx % Math.max(1, filteredQuotes.length)] || quotes[0];

  const handleShuffleQuote = () => {
    if (filteredQuotes.length <= 1) return;
    let next = Math.floor(Math.random() * filteredQuotes.length);
    if (next === quoteIdx % filteredQuotes.length) {
      next = (next + 1) % filteredQuotes.length;
    }
    setQuoteIdx(next);
    onTriggerBurst('新しい言葉をお届け 💜');
  };

  const handleCopyQuote = (q: QuoteItem) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`${q.korean}\n${q.japanese} — ${q.member} (${q.source})`);
      setCopiedId(q.id);
      setTimeout(() => setCopiedId(null), 1800);
    }
  };

  // Anniversaries sorted by closest
  const upcomingAnniversaries = useMemo(
    () =>
      sortAnniversariesByUpcoming(
        anniversaries,
        settings.wifeBirthday,
        settings.wifeName
      ),
    [anniversaries, settings.wifeBirthday, settings.wifeName]
  );

  const nextAnniversary = upcomingAnniversaries[0];
  const todayAnniversaries = upcomingAnniversaries.filter((a) => a.isToday);
  const isWifeBirthdayToday = todayAnniversaries.some(
    (a) => a.id === 'anniv-wife' || a.category === 'personal'
  );

  // Calendar state
  const now = new Date();
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth()); // 0-indexed

  const calendarDays = useMemo(() => {
    const firstDayOfWeek = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const cells: Array<{ day: number | null; dateStr: string | null }> = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
      cells.push({ day: null, dateStr: null });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const m = String(calMonth + 1).padStart(2, '0');
      const dayPadded = String(d).padStart(2, '0');
      cells.push({ day: d, dateStr: `${calYear}-${m}-${dayPadded}` });
    }
    return cells;
  }, [calYear, calMonth]);

  const monthPrefix = `${calYear}-${String(calMonth + 1).padStart(2, '0')}`;
  const monthlyStampCount = useMemo(
    () => stampedDates.filter((d) => d.startsWith(monthPrefix)).length,
    [stampedDates, monthPrefix]
  );
  const streakCount = useMemo(
    () => calculateStreak(stampedDates),
    [stampedDates]
  );

  const handlePrevMonth = () => {
    if (calMonth === 0) {
      setCalYear((y) => y - 1);
      setCalMonth(11);
    } else {
      setCalMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (calMonth === 11) {
      setCalYear((y) => y + 1);
      setCalMonth(0);
    } else {
      setCalMonth((m) => m + 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Personal Greeting & Bias Hero Banner */}
      <section
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${biasProfile.gradientClass} p-6 text-white shadow-lg sm:p-8`}
      >
        <div
          className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-2xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-16 left-8 h-40 w-40 rounded-full bg-amber-300/15 blur-2xl"
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-purple-100/90">
              <span>I Purple You</span>
              <span aria-hidden="true">·</span>
              <span>My Bias: {biasProfile.name}</span>
              <span aria-hidden="true">·</span>
              <span>{biasProfile.koreanName}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl [text-wrap:balance]">
              おかえりなさい、{settings.wifeName}さん
            </h1>
            <p className="text-sm font-medium text-purple-50/95 sm:text-base">
              {biasProfile.greetingTitle}
            </p>
            <p className="text-xs text-purple-100/80 leading-relaxed">
              {biasProfile.greetingSub}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                if (!isTodayStamped) {
                  onToggleStamp(todayStr, true);
                } else {
                  onTriggerBurst('今日も一日ボラヘ 💜');
                }
              }}
              className="inline-flex min-h-[48px] items-center gap-2.5 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-purple-900 shadow-md transition-transform active:scale-[0.98] hover:bg-purple-50 whitespace-nowrap shrink-0"
            >
              <Heart
                className={`h-4 w-4 ${
                  isTodayStamped
                    ? 'fill-purple-600 text-purple-600'
                    : 'text-purple-600'
                }`}
              />
              <span>
                {isTodayStamped
                  ? '今日のボラヘスタンプ済'
                  : '今日のボラヘスタンプを押す'}
              </span>
            </button>
          </div>
        </div>

        {/* Today's Special Anniversary or Wife's Birthday Alert */}
        {todayAnniversaries.length > 0 && (
          <div className="relative z-10 mt-5 flex flex-col justify-between gap-3 rounded-2xl border border-white/25 bg-white/15 p-4 backdrop-blur-md sm:flex-row sm:items-center">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-200">
                <Sparkles className="h-4 w-4" />
                <span>SPECIAL ANNIVERSARY TODAY</span>
              </div>
              <p className="text-base font-bold text-white">
                本日は「{todayAnniversaries.map((a) => a.title).join(' & ')}」です！
              </p>
              <p className="text-xs text-purple-100">
                {todayAnniversaries[0].description}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() =>
                  onTriggerBurst(
                    `🎉 ${todayAnniversaries[0].title} おめでとう！ 💜`
                  )
                }
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-amber-300 px-4 py-2 text-xs font-bold text-slate-900 transition-colors hover:bg-amber-200 whitespace-nowrap shrink-0"
              >
                <Sparkles className="h-4 w-4" />
                <span>お祝いシャワー</span>
              </button>
              {isWifeBirthdayToday && (
                <button
                  type="button"
                  onClick={onOpenSecretLetter}
                  className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-bold text-purple-900 transition-colors hover:bg-purple-50 whitespace-nowrap shrink-0"
                >
                  <Gift className="h-4 w-4 text-pink-600" />
                  <span>特別な手紙を開く</span>
                </button>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Main 2-Column Responsive Desktop Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* Left Column: Daily Quote + Stamp Calendar (7 cols on desktop) */}
        <div className="space-y-6 lg:col-span-7">
          {/* 1. Daily Message Card */}
          <section className="rounded-3xl border border-purple-100/90 bg-white/85 p-6 shadow-sm backdrop-blur-md">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-100/70 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  今日の一言 · Daily Borahae Words
                </h2>
                <p className="text-xs text-slate-500">
                  心に寄り添うBTSの歌詞とメンバーの言葉
                </p>
              </div>

              {settings.bias !== 'OT7' && (
                <button
                  type="button"
                  onClick={() => setFilterBiasQuotes((prev) => !prev)}
                  className={`min-h-[40px] rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    filterBiasQuotes
                      ? 'bg-purple-700 text-white'
                      : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
                  }`}
                >
                  {settings.bias} の言葉を優先
                </button>
              )}
            </div>

            {currentQuote ? (
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-gradient-to-br from-purple-50/90 via-violet-50/60 to-pink-50/50 p-5">
                  <p className="text-lg font-bold leading-relaxed text-purple-950 sm:text-xl">
                    “{currentQuote.korean}”
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-700 sm:text-base">
                    {currentQuote.japanese}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs font-medium text-purple-800/80">
                    <span>{currentQuote.member}</span>
                    <span aria-hidden="true">·</span>
                    <span>{currentQuote.source}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={handleShuffleQuote}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-purple-700 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-purple-800 active:scale-[0.98] whitespace-nowrap shrink-0"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>別の言葉を見る</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onToggleFavoriteQuote(currentQuote.id)}
                      className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                        currentQuote.isFavorite
                          ? 'border-pink-200 bg-pink-50 text-pink-700'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          currentQuote.isFavorite
                            ? 'fill-pink-500 text-pink-500'
                            : 'text-slate-400'
                        }`}
                      />
                      <span>
                        {currentQuote.isFavorite ? 'お気に入り済' : 'お気に入り'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopyQuote(currentQuote)}
                      className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0"
                    >
                      {copiedId === currentQuote.id ? (
                        <>
                          <Check className="h-4 w-4 text-emerald-600" />
                          <span className="text-emerald-700">コピー完了</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          <span>コピー</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="py-6 text-center text-sm text-slate-500">
                名言データが登録されていません。設定タブから追加できます。
              </p>
            )}
          </section>

          {/* 2. Daily Borahae Stamp Calendar */}
          <section className="rounded-3xl border border-purple-100/90 bg-white/85 p-6 shadow-sm backdrop-blur-md">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-100/70 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  今日の推し活スタンプ帳
                </h2>
                <p className="text-xs text-slate-500">
                  毎日タップしてカレンダーを紫のハートでいっぱいにしよう
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs font-semibold text-purple-900 tabular-nums">
                <span>連続 {streakCount}日</span>
                <span aria-hidden="true" className="text-slate-300">
                  ·
                </span>
                <span>今月 {monthlyStampCount}個</span>
                <span aria-hidden="true" className="text-slate-300">
                  ·
                </span>
                <span>累計 {stampedDates.length}個</span>
              </div>
            </div>

            {/* Month switcher */}
            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-700 hover:bg-purple-50"
                aria-label="前の月"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-sm font-bold text-slate-900 tabular-nums">
                {calYear}年 {calMonth + 1}月
              </span>
              <button
                type="button"
                onClick={handleNextMonth}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-700 hover:bg-purple-50"
                aria-label="次の月"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="mt-3 grid grid-cols-7 gap-1.5 text-center">
              {['日', '月', '火', '水', '木', '金', '土'].map((dow, i) => (
                <div
                  key={dow}
                  className={`py-1.5 text-xs font-semibold ${
                    i === 0
                      ? 'text-rose-500'
                      : i === 6
                        ? 'text-indigo-500'
                        : 'text-slate-500'
                  }`}
                >
                  {dow}
                </div>
              ))}

              {calendarDays.map((cell, idx) => {
                if (!cell.day || !cell.dateStr) {
                  return <div key={`empty-${idx}`} className="h-11" />;
                }
                const isStamped = stampedDates.includes(cell.dateStr);
                const isTodayCell = cell.dateStr === todayStr;

                return (
                  <button
                    key={cell.dateStr}
                    type="button"
                    onClick={() =>
                      onToggleStamp(cell.dateStr!, cell.dateStr === todayStr)
                    }
                    className={`relative flex min-h-[44px] flex-col items-center justify-center rounded-xl border text-xs font-semibold transition-all tabular-nums ${
                      isStamped
                        ? 'border-purple-300 bg-purple-100/90 text-purple-950 shadow-xs'
                        : isTodayCell
                          ? 'border-purple-500 bg-purple-50/50 text-purple-900'
                          : 'border-transparent bg-slate-50/70 text-slate-600 hover:bg-purple-50/60'
                    }`}
                    title={`${cell.dateStr} のスタンプを切り替え`}
                  >
                    <span className="text-[11px] leading-none">{cell.day}</span>
                    {isStamped ? (
                      <Heart className="mt-1 h-3.5 w-3.5 fill-purple-600 text-purple-600" />
                    ) : isTodayCell ? (
                      <span className="mt-1 text-[9px] font-bold text-purple-700">
                        TODAY
                      </span>
                    ) : (
                      <span className="mt-1 h-3.5 w-3.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right Column: Anniversary Countdown (5 cols on desktop) */}
        <div className="space-y-6 lg:col-span-5">
          <section className="rounded-3xl border border-purple-100/90 bg-white/85 p-6 shadow-sm backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-purple-100/70 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  記念日カウントダウン
                </h2>
                <p className="text-xs text-slate-500">
                  大切な日までの残り日数を自動で計算します
                </p>
              </div>
              <CalendarIcon className="h-5 w-5 text-purple-600 shrink-0" />
            </div>

            {/* Next Highlighted Anniversary */}
            {nextAnniversary && (
              <div className="mt-5 rounded-2xl border border-purple-200/80 bg-gradient-to-br from-purple-900 via-violet-800 to-fuchsia-900 p-5 text-white shadow-md">
                <div className="flex items-center justify-between text-xs text-purple-200">
                  <span>NEXT SPECIAL DAY</span>
                  <span className="font-mono tabular-nums">
                    {nextAnniversary.formattedDateJP}
                    {nextAnniversary.yearsCount
                      ? ` · ${nextAnniversary.yearsCount}周年/歳`
                      : ''}
                  </span>
                </div>

                <h3 className="mt-2 text-lg font-bold tracking-tight">
                  {nextAnniversary.title}
                </h3>
                <p className="mt-1 text-xs text-purple-100/85 leading-relaxed">
                  {nextAnniversary.description}
                </p>

                <div className="mt-4 flex items-baseline justify-between border-t border-white/15 pt-4">
                  <div className="flex items-baseline gap-2">
                    {nextAnniversary.isToday ? (
                      <span className="text-2xl font-extrabold text-amber-300">
                        🎉 HAPPY DAY! 本日当日です
                      </span>
                    ) : (
                      <>
                        <span className="text-xs text-purple-200">あと</span>
                        <span className="font-mono text-3xl font-extrabold text-amber-300 tabular-nums">
                          {nextAnniversary.daysRemaining}
                        </span>
                        <span className="text-sm font-semibold text-purple-100">
                          日
                        </span>
                      </>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      onTriggerBurst(`💜 ${nextAnniversary.title} が楽しみ！`)
                    }
                    className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-xs transition-colors hover:bg-white/25 whitespace-nowrap shrink-0"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                    <span>お祝い演出</span>
                  </button>
                </div>
              </div>
            )}

            {/* Upcoming Anniversaries List */}
            <div className="mt-5 divide-y divide-purple-100/70">
              {upcomingAnniversaries.slice(1).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {item.title}
                    </p>
                    <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                      <span className="font-mono tabular-nums">
                        {item.formattedDateJP}
                      </span>
                      {item.member && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{item.member}</span>
                        </>
                      )}
                      {item.yearsCount && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums">
                            {item.category === 'birthday'
                              ? `${item.yearsCount}歳`
                              : `${item.yearsCount}周年`}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 text-right font-mono tabular-nums">
                    {item.isToday ? (
                      <span className="text-xs font-bold text-purple-700">
                        TODAY!
                      </span>
                    ) : (
                      <div className="flex items-baseline gap-1">
                        <span className="text-[11px] text-slate-400">あと</span>
                        <span className="text-base font-bold text-purple-900">
                          {item.daysRemaining}
                        </span>
                        <span className="text-xs text-slate-500">日</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
