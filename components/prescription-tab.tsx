'use client';

import React, { useState } from 'react';
import {
  BookHeart,
  Check,
  ExternalLink,
  HeartHandshake,
  Music,
  RefreshCw,
  Sparkles,
  X,
} from 'lucide-react';
import {
  AppData,
  MoodCategory,
  PrescriptionItem,
} from '@/lib/types';
import { MOOD_CATEGORIES } from '@/lib/seed-data';

interface PrescriptionTabProps {
  data: AppData;
  onTriggerBurst: (label?: string) => void;
  onQuickSaveToDiary: (rx: PrescriptionItem) => void;
}

export function PrescriptionTab({
  data,
  onTriggerBurst,
  onQuickSaveToDiary,
}: PrescriptionTabProps) {
  const { prescriptions, settings } = data;
  const [activeMoodModal, setActiveMoodModal] = useState<MoodCategory | null>(
    null
  );
  const [selectedRx, setSelectedRx] = useState<PrescriptionItem | null>(null);
  const [savedToDiaryId, setSavedToDiaryId] = useState<string | null>(null);
  const [catalogFilter, setCatalogFilter] = useState<MoodCategory | 'all'>(
    'all'
  );

  const drawPrescription = (mood: MoodCategory, currentId?: string) => {
    const candidates = prescriptions.filter((p) => p.mood === mood);
    const pool = candidates.length > 0 ? candidates : prescriptions;
    if (pool.length === 0) return;

    let chosen = pool[Math.floor(Math.random() * pool.length)];
    if (pool.length > 1 && currentId && chosen.id === currentId) {
      const others = pool.filter((p) => p.id !== currentId);
      chosen = others[Math.floor(Math.random() * others.length)];
    }

    setActiveMoodModal(mood);
    setSelectedRx(chosen);
    setSavedToDiaryId(null);
    const moodMeta = MOOD_CATEGORIES.find((m) => m.id === mood);
    onTriggerBurst(`💊 「${moodMeta?.label || '今日'}」の処方箋を調合しました 💜`);
  };

  const handleSaveDiary = (rx: PrescriptionItem) => {
    onQuickSaveToDiary(rx);
    setSavedToDiaryId(rx.id);
    onTriggerBurst('推し活日記に記録しました 💜');
  };

  const filteredCatalog =
    catalogFilter === 'all'
      ? prescriptions
      : prescriptions.filter((p) => p.mood === catalogFilter);

  const currentMoodMeta = MOOD_CATEGORIES.find(
    (m) => m.id === (selectedRx?.mood || activeMoodModal)
  );

  return (
    <div className="space-y-6">
      {/* Header Hero Section */}
      <section className="rounded-3xl border border-purple-100/90 bg-white/85 p-6 shadow-sm backdrop-blur-md sm:p-8">
        <div className="max-w-2xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-700">
            <HeartHandshake className="h-4 w-4" />
            <span>BORAHAE MAGIC SHOP PHARMACY</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl [text-wrap:balance]">
            気分別・BTS処方箋ガチャ
          </h1>
          <p className="text-sm leading-relaxed text-slate-600">
            {settings.wifeName}さん、今の気分はいかがですか？
            ボタンをひとつ選ぶと、今のあなたの心にぴったり寄り添うBTSの楽曲・動画・メンバーからの励ましメッセージを1つ処方します。
          </p>
        </div>

        {/* 5 Mood Selection Buttons */}
        <div className="mt-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {MOOD_CATEGORIES.map((mood) => {
            const count = prescriptions.filter(
              (p) => p.mood === mood.id
            ).length;
            return (
              <button
                key={mood.id}
                type="button"
                onClick={() => drawPrescription(mood.id)}
                className={`group flex min-h-[88px] flex-col justify-between rounded-2xl border p-5 text-left transition-all active:scale-[0.99] ${mood.softBgClass} ${mood.borderClass}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-base font-bold text-slate-900 group-hover:text-purple-900">
                    {mood.label}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 tabular-nums shrink-0">
                    {count}種
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  {mood.subLabel}
                </p>
              </button>
            );
          })}

          {/* Random All-Mood Magic Draw Button */}
          <button
            type="button"
            onClick={() => {
              const randomMood =
                MOOD_CATEGORIES[
                  Math.floor(Math.random() * MOOD_CATEGORIES.length)
                ].id;
              drawPrescription(randomMood);
            }}
            className="flex min-h-[88px] flex-col justify-between rounded-2xl border border-purple-300 bg-gradient-to-br from-purple-700 via-violet-700 to-fuchsia-700 p-5 text-left text-white shadow-md transition-all hover:opacity-95 active:scale-[0.99]"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-base font-bold">
                おまかせMagic Shop処方
              </span>
              <Sparkles className="h-5 w-5 text-amber-300 shrink-0" />
            </div>
            <p className="mt-2 text-xs text-purple-100 leading-relaxed">
              今の運勢と直感で、すべての処方箋からランダムに1つ引き当てます
            </p>
          </button>
        </div>
      </section>

      {/* Browsable Prescription Directory */}
      <section className="rounded-3xl border border-purple-100/90 bg-white/85 p-6 shadow-sm backdrop-blur-md">
        <div className="flex flex-col justify-between gap-4 border-b border-purple-100/70 pb-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              処方箋ライブラリ一覧
            </h2>
            <p className="text-xs text-slate-500">
              登録されている全 {prescriptions.length}{' '}
              件の処方箋（設定タブから自由に追加・編集できます）
            </p>
          </div>

          {/* Interactive Filter Controls */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-xl bg-purple-50/80 p-1">
            <button
              type="button"
              onClick={() => setCatalogFilter('all')}
              className={`min-h-[36px] rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                catalogFilter === 'all'
                  ? 'bg-white text-purple-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              すべて ({prescriptions.length})
            </button>
            {MOOD_CATEGORIES.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setCatalogFilter(m.id)}
                className={`min-h-[36px] rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  catalogFilter === m.id
                    ? 'bg-white text-purple-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {m.label.split('・')[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredCatalog.map((item) => {
            const moodMeta = MOOD_CATEGORIES.find((m) => m.id === item.mood);
            return (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-2xl border border-purple-100 bg-white p-5 transition-shadow hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                    <span>{moodMeta?.label}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-semibold text-purple-800">
                      From {item.member}
                    </span>
                  </div>

                  <h3 className="mt-1.5 text-base font-bold text-slate-900">
                    {item.songTitle}
                  </h3>
                  <p className="text-xs text-slate-500">{item.albumOrEra}</p>

                  <p className="mt-3 rounded-xl bg-purple-50/70 p-3 text-xs leading-relaxed text-purple-950">
                    {item.memberMessage}
                  </p>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    効能メモ: {item.prescriptionNote}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMoodModal(item.mood);
                      setSelectedRx(item);
                      setSavedToDiaryId(null);
                    }}
                    className="inline-flex min-h-[40px] items-center gap-1.5 text-xs font-semibold text-purple-700 hover:text-purple-900 whitespace-nowrap shrink-0"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>処方箋カードで開く</span>
                  </button>

                  <a
                    href={item.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800 whitespace-nowrap shrink-0"
                  >
                    <span>YouTubeで聴く・見る</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Prescription Popup Modal */}
      {selectedRx && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onClick={() => setSelectedRx(null)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-3xl border border-purple-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Prescription Header */}
            <div className="bg-gradient-to-r from-purple-900 via-violet-800 to-fuchsia-800 px-6 py-5 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-medium text-purple-200">
                  <Sparkles className="h-4 w-4 text-amber-300" />
                  <span>BORAHAE SPECIAL PRESCRIPTION</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedRx(null)}
                  className="flex min-h-[44px] min-w-[44px] -mr-2 items-center justify-center rounded-xl text-purple-100 hover:bg-white/10"
                  aria-label="閉じる"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-1 text-xs text-purple-200">
                対象気分: {currentMoodMeta?.label}
              </p>
              <h3 className="mt-1 text-xl font-bold tracking-tight">
                {settings.wifeName}さんへの本日の処方箋
              </h3>
            </div>

            {/* Body */}
            <div className="space-y-4 p-6">
              {/* Song / Content Box */}
              <div className="flex items-start gap-3.5 rounded-2xl border border-purple-100 bg-purple-50/60 p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-700 text-white shadow-xs">
                  <Music className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium text-purple-700">
                    処方楽曲・コンテンツ
                  </div>
                  <h4 className="mt-0.5 text-lg font-bold text-slate-900">
                    {selectedRx.songTitle}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {selectedRx.albumOrEra}
                  </p>
                </div>
              </div>

              {/* Member Message */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-purple-900">
                  <span>{selectedRx.member} からのメッセージ</span>
                </div>
                <p className="mt-2 text-sm font-medium leading-relaxed text-slate-800">
                  {selectedRx.memberMessage}
                </p>
                <p className="mt-2.5 border-t border-slate-200/70 pt-2 text-xs text-slate-500">
                  服用アドバイス: {selectedRx.prescriptionNote}
                </p>
              </div>

              {/* Primary CTA: YouTube Link */}
              <a
                href={selectedRx.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-700 to-fuchsia-700 px-5 py-3 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-95"
              >
                <span>YouTubeでこの曲・動画を開く</span>
                <ExternalLink className="h-4 w-4" />
              </a>

              {/* Secondary Actions: Save to Diary & Redraw */}
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() =>
                    drawPrescription(selectedRx.mood, selectedRx.id)
                  }
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-purple-200 bg-purple-50/70 px-4 py-2.5 text-xs font-bold text-purple-900 transition-colors hover:bg-purple-100 whitespace-nowrap shrink-0"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>同じ気分でもう1回引く</span>
                </button>

                <button
                  type="button"
                  disabled={savedToDiaryId === selectedRx.id}
                  onClick={() => handleSaveDiary(selectedRx)}
                  className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                    savedToDiaryId === selectedRx.id
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {savedToDiaryId === selectedRx.id ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span>日記に記録しました</span>
                    </>
                  ) : (
                    <>
                      <BookHeart className="h-4 w-4 text-purple-600" />
                      <span>推し活日記に記録する</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
