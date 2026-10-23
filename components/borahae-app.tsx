'use client';

import React, { useEffect, useState } from 'react';
import {
  BookHeart,
  Gift,
  Heart,
  Home,
  Settings,
  Sparkles,
  Stethoscope,
  X,
} from 'lucide-react';
import {
  AnniversaryItem,
  AppData,
  CollectionItem,
  DiaryEntry,
  PersonalSettings,
  PrescriptionItem,
  QuoteItem,
  WatchVisitItem,
} from '@/lib/types';
import { createInitialAppData } from '@/lib/seed-data';
import { getTodayDateString } from '@/lib/date-utils';
import { BorahaeParticles, ParticleBurst } from './borahae-particles';
import { HomeTab } from './home-tab';
import { PrescriptionTab } from './prescription-tab';
import { ArchiveTab } from './archive-tab';
import { SettingsTab } from './settings-tab';
import { PWAInstallButton } from './pwa-install-button';

const STORAGE_KEY = 'borahae_archive_v1';

export type MainTab = 'home' | 'prescription' | 'archive' | 'settings';

export function BorahaeApp() {
  const [data, setData] = useState<AppData>(() => createInitialAppData());
  const [isHydrated, setIsHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [burst, setBurst] = useState<ParticleBurst | null>(null);
  const [secretLetterOpen, setSecretLetterOpen] = useState(false);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as AppData;
        if (parsed && parsed.settings && Array.isArray(parsed.quotes)) {
          setData(parsed);
        }
      }
    } catch {
      // Fallback to seed data if storage is unavailable
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save to localStorage whenever data changes after hydration
  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Ignore quota errors silently
    }
  }, [data, isHydrated]);

  const triggerBurst = (label?: string) => {
    setBurst({ id: Date.now(), label });
  };

  // --- Handlers ---
  const handleToggleStamp = (dateStr: string, isTodayAction?: boolean) => {
    setData((prev) => {
      const exists = prev.stampedDates.includes(dateStr);
      const nextStamps = exists
        ? prev.stampedDates.filter((d) => d !== dateStr)
        : [...prev.stampedDates, dateStr];
      if (!exists) {
        triggerBurst(
          isTodayAction
            ? '今日のボラヘスタンプを獲得しました 💜'
            : `${dateStr} にスタンプを押しました 💜`
        );
      }
      return {
        ...prev,
        stampedDates: nextStamps,
      };
    });
  };

  const handleToggleFavoriteQuote = (quoteId: string) => {
    setData((prev) => ({
      ...prev,
      quotes: prev.quotes.map((q) => {
        if (q.id === quoteId) {
          const nextFav = !q.isFavorite;
          if (nextFav) triggerBurst('お気に入りの言葉に登録しました 💜');
          return { ...q, isFavorite: nextFav };
        }
        return q;
      }),
    }));
  };

  const handleQuickSavePrescriptionToDiary = (rx: PrescriptionItem) => {
    const newEntry: DiaryEntry = {
      id: `diary-${Date.now()}`,
      date: getTodayDateString(),
      mood: 'purple_love',
      memberTag: rx.member,
      contentTitle: `処方箋『${rx.songTitle}』を聴いた日`,
      note: `${rx.member}からの言葉: ${rx.memberMessage}\n（アルバム/出典: ${rx.albumOrEra}）`,
      createdAt: new Date().toISOString(),
    };
    setData((prev) => ({
      ...prev,
      diaryEntries: [newEntry, ...prev.diaryEntries],
    }));
  };

  const handleSaveDiary = (entry: DiaryEntry) => {
    setData((prev) => {
      const exists = prev.diaryEntries.some((d) => d.id === entry.id);
      const nextEntries = exists
        ? prev.diaryEntries.map((d) => (d.id === entry.id ? entry : d))
        : [entry, ...prev.diaryEntries];
      return { ...prev, diaryEntries: nextEntries };
    });
  };

  const handleDeleteDiary = (id: string) => {
    setData((prev) => ({
      ...prev,
      diaryEntries: prev.diaryEntries.filter((d) => d.id !== id),
    }));
  };

  const handleSaveWatchVisit = (item: WatchVisitItem) => {
    setData((prev) => {
      const exists = prev.watchVisitList.some((w) => w.id === item.id);
      const nextList = exists
        ? prev.watchVisitList.map((w) => (w.id === item.id ? item : w))
        : [item, ...prev.watchVisitList];
      return { ...prev, watchVisitList: nextList };
    });
  };

  const handleDeleteWatchVisit = (id: string) => {
    setData((prev) => ({
      ...prev,
      watchVisitList: prev.watchVisitList.filter((w) => w.id !== id),
    }));
  };

  const handleSaveCollection = (item: CollectionItem) => {
    setData((prev) => {
      const exists = prev.collectionItems.some((c) => c.id === item.id);
      const nextList = exists
        ? prev.collectionItems.map((c) => (c.id === item.id ? item : c))
        : [item, ...prev.collectionItems];
      return { ...prev, collectionItems: nextList };
    });
  };

  const handleDeleteCollection = (id: string) => {
    setData((prev) => ({
      ...prev,
      collectionItems: prev.collectionItems.filter((c) => c.id !== id),
    }));
  };

  const handleUpdateSettings = (nextSettings: PersonalSettings) => {
    setData((prev) => ({
      ...prev,
      settings: nextSettings,
      anniversaries: prev.anniversaries.map((an) =>
        an.id === 'anniv-wife'
          ? {
              ...an,
              date: nextSettings.wifeBirthday,
              title: `${nextSettings.wifeName}のお誕生日`,
            }
          : an
      ),
    }));
  };

  const handleSaveQuote = (quote: QuoteItem) => {
    setData((prev) => ({
      ...prev,
      quotes: [quote, ...prev.quotes],
    }));
  };

  const handleDeleteQuote = (id: string) => {
    setData((prev) => ({
      ...prev,
      quotes: prev.quotes.filter((q) => q.id !== id),
    }));
  };

  const handleSavePrescription = (rx: PrescriptionItem) => {
    setData((prev) => ({
      ...prev,
      prescriptions: [rx, ...prev.prescriptions],
    }));
  };

  const handleDeletePrescription = (id: string) => {
    setData((prev) => ({
      ...prev,
      prescriptions: prev.prescriptions.filter((p) => p.id !== id),
    }));
  };

  const handleSaveAnniversary = (anniv: AnniversaryItem) => {
    setData((prev) => ({
      ...prev,
      anniversaries: [...prev.anniversaries, anniv],
    }));
  };

  const handleDeleteAnniversary = (id: string) => {
    setData((prev) => ({
      ...prev,
      anniversaries: prev.anniversaries.filter((a) => a.id !== id),
    }));
  };

  const handleImportData = (imported: AppData) => {
    setData(imported);
  };

  const handleResetDefaultData = () => {
    const fresh = createInitialAppData();
    setData(fresh);
  };

  const openSecretLetter = () => {
    setSecretLetterOpen(true);
    triggerBurst('💌 特別な手紙が開かれました 💜');
  };

  return (
    <div className="min-h-screen bg-[#FAF7FF] text-slate-900 pb-24 md:pb-12">
      {/* Floating Purple Hearts & Stars Micro-Interaction */}
      <BorahaeParticles burst={burst} />

      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-30 border-b border-purple-100/90 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-8 px-4 sm:px-6">
          {/* Zone 1: Single text element wordmark */}
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className="text-lg font-bold tracking-tight text-purple-950 whitespace-nowrap shrink-0"
          >
            Borahae Archive
          </button>

          {/* Zone 2: 4 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              type="button"
              onClick={() => setActiveTab('home')}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'home'
                  ? 'border-b-2 border-purple-700 font-bold text-purple-950'
                  : 'hover:text-purple-900'
              }`}
            >
              ホーム＆記念日
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('prescription')}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'prescription'
                  ? 'border-b-2 border-purple-700 font-bold text-purple-950'
                  : 'hover:text-purple-900'
              }`}
            >
              BTS処方箋
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('archive')}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'archive'
                  ? 'border-b-2 border-purple-700 font-bold text-purple-950'
                  : 'hover:text-purple-900'
              }`}
            >
              推し活日記＆図鑑
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'settings'
                  ? 'border-b-2 border-purple-700 font-bold text-purple-950'
                  : 'hover:text-purple-900'
              }`}
            >
              カスタム＆保存
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-2 shrink-0">
            <PWAInstallButton compact />
            <button
              type="button"
              onClick={() => triggerBurst('보라해 · I Purple You 💜')}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-purple-700 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-transform active:scale-95 hover:bg-purple-800 whitespace-nowrap shrink-0"
            >
              <Heart className="h-3.5 w-3.5 fill-white" />
              <span>ボラヘ</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container (Expands cleanly on Desktop, Mobile-First on Smartphone) */}
      <main className="mx-auto max-w-6xl px-4 pt-5 sm:px-6 sm:pt-7">
        {activeTab === 'home' && (
          <HomeTab
            data={data}
            onToggleStamp={handleToggleStamp}
            onToggleFavoriteQuote={handleToggleFavoriteQuote}
            onTriggerBurst={triggerBurst}
            onOpenSecretLetter={openSecretLetter}
          />
        )}

        {activeTab === 'prescription' && (
          <PrescriptionTab
            data={data}
            onTriggerBurst={triggerBurst}
            onQuickSaveToDiary={handleQuickSavePrescriptionToDiary}
          />
        )}

        {activeTab === 'archive' && (
          <ArchiveTab
            data={data}
            onSaveDiary={handleSaveDiary}
            onDeleteDiary={handleDeleteDiary}
            onSaveWatchVisit={handleSaveWatchVisit}
            onDeleteWatchVisit={handleDeleteWatchVisit}
            onSaveCollection={handleSaveCollection}
            onDeleteCollection={handleDeleteCollection}
            onTriggerBurst={triggerBurst}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsTab
            data={data}
            onUpdateSettings={handleUpdateSettings}
            onSaveQuote={handleSaveQuote}
            onDeleteQuote={handleDeleteQuote}
            onSavePrescription={handleSavePrescription}
            onDeletePrescription={handleDeletePrescription}
            onSaveAnniversary={handleSaveAnniversary}
            onDeleteAnniversary={handleDeleteAnniversary}
            onImportData={handleImportData}
            onResetDefaultData={handleResetDefaultData}
            onOpenSecretLetter={openSecretLetter}
            onTriggerBurst={triggerBurst}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation Bar for Mobile Viewports */}
      <nav
        aria-label="メインナビゲーション"
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-purple-100 bg-white/95 backdrop-blur-md md:hidden"
      >
        <div className="mx-auto grid h-16 max-w-lg grid-cols-4 items-center px-2">
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className={`flex min-h-[48px] flex-col items-center justify-center rounded-xl transition-colors ${
              activeTab === 'home'
                ? 'text-purple-700 font-bold'
                : 'text-slate-500 hover:text-purple-900'
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="mt-1 text-[10px] tracking-tight whitespace-nowrap">
              ホーム
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('prescription')}
            className={`flex min-h-[48px] flex-col items-center justify-center rounded-xl transition-colors ${
              activeTab === 'prescription'
                ? 'text-purple-700 font-bold'
                : 'text-slate-500 hover:text-purple-900'
            }`}
          >
            <Stethoscope className="h-5 w-5" />
            <span className="mt-1 text-[10px] tracking-tight whitespace-nowrap">
              BTS処方箋
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('archive')}
            className={`flex min-h-[48px] flex-col items-center justify-center rounded-xl transition-colors ${
              activeTab === 'archive'
                ? 'text-purple-700 font-bold'
                : 'text-slate-500 hover:text-purple-900'
            }`}
          >
            <BookHeart className="h-5 w-5" />
            <span className="mt-1 text-[10px] tracking-tight whitespace-nowrap">
              日記＆図鑑
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`flex min-h-[48px] flex-col items-center justify-center rounded-xl transition-colors ${
              activeTab === 'settings'
                ? 'text-purple-700 font-bold'
                : 'text-slate-500 hover:text-purple-900'
            }`}
          >
            <Settings className="h-5 w-5" />
            <span className="mt-1 text-[10px] tracking-tight whitespace-nowrap">
              設定＆追加
            </span>
          </button>
        </div>
      </nav>

      {/* Secret Letter Modal (Easter Egg from Husband) */}
      {secretLetterOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-sm"
          onClick={() => setSecretLetterOpen(false)}
        >
          <div
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-purple-200 bg-white p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-purple-700">
                <Gift className="h-4 w-4 text-pink-600" />
                <span>SPECIAL MESSAGE FOR YOU</span>
              </div>
              <button
                type="button"
                onClick={() => setSecretLetterOpen(false)}
                className="flex min-h-[44px] min-w-[44px] -mr-2 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100"
                aria-label="閉じる"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <h3 className="mt-2 text-xl font-bold text-slate-900">
              親愛なる {data.settings.wifeName} へ
            </h3>

            <div className="mt-4 rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50/90 via-violet-50/60 to-pink-50/60 p-5">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-800 sm:text-base">
                {data.settings.secretMessage}
              </p>
              <p className="mt-4 text-right text-xs font-bold text-purple-900">
                — {data.settings.husbandName} 💜
              </p>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => triggerBurst('いつもありがとう！ボラヘ 💜')}
                className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl bg-purple-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-purple-800"
              >
                <Sparkles className="h-4 w-4 text-amber-300" />
                <span>紫のハートを降らせる</span>
              </button>
              <button
                type="button"
                onClick={() => setSecretLetterOpen(false)}
                className="min-h-[44px] rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
