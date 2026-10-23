'use client';

import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Disc,
  ExternalLink,
  ImagePlus,
  MapPin,
  Pencil,
  Plus,
  Sparkles,
  Star,
  Trash2,
  Tv,
  X,
} from 'lucide-react';
import {
  AppData,
  CollectionCategory,
  CollectionItem,
  CollectionThemeVariant,
  DiaryEntry,
  DiaryMood,
  MemberId,
  WatchVisitItem,
  WatchVisitStatus,
  WatchVisitType,
} from '@/lib/types';
import { DIARY_MOOD_LABELS, MEMBER_PROFILES } from '@/lib/seed-data';
import { getTodayDateString } from '@/lib/date-utils';

interface ArchiveTabProps {
  data: AppData;
  onSaveDiary: (entry: DiaryEntry) => void;
  onDeleteDiary: (id: string) => void;
  onSaveWatchVisit: (item: WatchVisitItem) => void;
  onDeleteWatchVisit: (id: string) => void;
  onSaveCollection: (item: CollectionItem) => void;
  onDeleteCollection: (id: string) => void;
  onTriggerBurst: (label?: string) => void;
}

type ArchiveSubTab = 'diary' | 'watch_visit' | 'collection';

const MEMBER_KEYS: MemberId[] = [
  'OT7',
  'RM',
  'JIN',
  'SUGA',
  'J-HOPE',
  'JIMIN',
  'V',
  'JUNG KOOK',
];

const COLLECTION_CATEGORIES: CollectionCategory[] = [
  'Photocard',
  'Album',
  'Lightstick',
  'Merch',
  'DVD / Blu-ray',
];

const THEME_GRADIENTS: Record<
  CollectionThemeVariant,
  { label: string; bgClass: string }
> = {
  cosmos: {
    label: 'コズミック・パープル',
    bgClass: 'from-violet-900 via-purple-800 to-indigo-900 text-white',
  },
  lavender: {
    label: 'ラベンダー・シルク',
    bgClass: 'from-purple-200 via-violet-100 to-fuchsia-100 text-purple-950',
  },
  velvet: {
    label: 'ベルベット・アメジスト',
    bgClass: 'from-purple-950 via-fuchsia-900 to-violet-900 text-white',
  },
  rose: {
    label: 'ロゼ・ボラヘ',
    bgClass: 'from-pink-200 via-purple-100 to-rose-100 text-purple-950',
  },
  gold: {
    label: 'ロイヤル・ゴールド',
    bgClass: 'from-amber-100 via-purple-100 to-amber-200 text-purple-950',
  },
};

export function ArchiveTab({
  data,
  onSaveDiary,
  onDeleteDiary,
  onSaveWatchVisit,
  onDeleteWatchVisit,
  onSaveCollection,
  onDeleteCollection,
  onTriggerBurst,
}: ArchiveTabProps) {
  const [subTab, setSubTab] = useState<ArchiveSubTab>('diary');

  // --- 1. Diary State & Modal ---
  const [diaryModalOpen, setDiaryModalOpen] = useState(false);
  const [editingDiary, setEditingDiary] = useState<DiaryEntry | null>(null);
  const [diaryDate, setDiaryDate] = useState(getTodayDateString());
  const [diaryMood, setDiaryMood] = useState<DiaryMood>('purple_love');
  const [diaryMember, setDiaryMember] = useState<MemberId>('OT7');
  const [diaryTitle, setDiaryTitle] = useState('');
  const [diaryNote, setDiaryNote] = useState('');

  const openNewDiaryModal = () => {
    setEditingDiary(null);
    setDiaryDate(getTodayDateString());
    setDiaryMood('purple_love');
    setDiaryMember(data.settings.bias || 'OT7');
    setDiaryTitle('');
    setDiaryNote('');
    setDiaryModalOpen(true);
  };

  const openEditDiaryModal = (entry: DiaryEntry) => {
    setEditingDiary(entry);
    setDiaryDate(entry.date);
    setDiaryMood(entry.mood);
    setDiaryMember(entry.memberTag);
    setDiaryTitle(entry.contentTitle);
    setDiaryNote(entry.note);
    setDiaryModalOpen(true);
  };

  const handleSubmitDiary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diaryTitle.trim() && !diaryNote.trim()) return;
    const entry: DiaryEntry = {
      id: editingDiary ? editingDiary.id : `diary-${Date.now()}`,
      date: diaryDate || getTodayDateString(),
      mood: diaryMood,
      memberTag: diaryMember,
      contentTitle: diaryTitle.trim() || '今日の推し活メモ',
      note: diaryNote.trim(),
      createdAt: editingDiary ? editingDiary.createdAt : new Date().toISOString(),
    };
    onSaveDiary(entry);
    setDiaryModalOpen(false);
    onTriggerBurst('推し活日記を保存しました 💜');
  };

  // --- 2. Watch & Visit State & Modal ---
  const [wvTypeFilter, setWvTypeFilter] = useState<'all' | WatchVisitType>('all');
  const [wvStatusFilter, setWvStatusFilter] = useState<'all' | WatchVisitStatus>('all');
  const [wvModalOpen, setWvModalOpen] = useState(false);
  const [editingWv, setEditingWv] = useState<WatchVisitItem | null>(null);
  const [wvType, setWvType] = useState<WatchVisitType>('watch');
  const [wvCategory, setWvCategory] = useState('Run BTS!');
  const [wvTitle, setWvTitle] = useState('');
  const [wvStatus, setWvStatus] = useState<WatchVisitStatus>('todo');
  const [wvRating, setWvRating] = useState(5);
  const [wvMemo, setWvMemo] = useState('');
  const [wvLink, setWvLink] = useState('');

  const filteredWatchVisit = useMemo(() => {
    return data.watchVisitList.filter((item) => {
      if (wvTypeFilter !== 'all' && item.type !== wvTypeFilter) return false;
      if (wvStatusFilter !== 'all' && item.status !== wvStatusFilter) return false;
      return true;
    });
  }, [data.watchVisitList, wvTypeFilter, wvStatusFilter]);

  const openNewWvModal = (defaultType: WatchVisitType = 'watch') => {
    setEditingWv(null);
    setWvType(defaultType);
    setWvCategory(defaultType === 'watch' ? 'Run BTS!' : '聖地カフェ・ロケ地');
    setWvTitle('');
    setWvStatus('todo');
    setWvRating(5);
    setWvMemo('');
    setWvLink('');
    setWvModalOpen(true);
  };

  const openEditWvModal = (item: WatchVisitItem) => {
    setEditingWv(item);
    setWvType(item.type);
    setWvCategory(item.category);
    setWvTitle(item.title);
    setWvStatus(item.status);
    setWvRating(item.rating);
    setWvMemo(item.memo);
    setWvLink(item.locationOrLink || '');
    setWvModalOpen(true);
  };

  const handleSubmitWv = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wvTitle.trim()) return;
    const item: WatchVisitItem = {
      id: editingWv ? editingWv.id : `wv-${Date.now()}`,
      type: wvType,
      category: wvCategory.trim() || (wvType === 'watch' ? '動画' : '聖地'),
      title: wvTitle.trim(),
      status: wvStatus,
      rating: wvRating,
      memo: wvMemo.trim(),
      locationOrLink: wvLink.trim() || undefined,
      updatedAt: getTodayDateString(),
    };
    onSaveWatchVisit(item);
    setWvModalOpen(false);
    onTriggerBurst('リストを更新しました 💜');
  };

  const handleToggleWvStatus = (item: WatchVisitItem) => {
    const nextStatus: WatchVisitStatus = item.status === 'done' ? 'todo' : 'done';
    onSaveWatchVisit({
      ...item,
      status: nextStatus,
      updatedAt: getTodayDateString(),
    });
    if (nextStatus === 'done') {
      onTriggerBurst(
        item.type === 'watch' ? '視聴完了おめでとう！ 💜' : '聖地巡礼達成！ 💜'
      );
    }
  };

  // --- 3. Collection State & Modal ---
  const [colMemberFilter, setColMemberFilter] = useState<'ALL' | MemberId>('ALL');
  const [colModalOpen, setColModalOpen] = useState(false);
  const [editingCol, setEditingCol] = useState<CollectionItem | null>(null);
  const [colTitle, setColTitle] = useState('');
  const [colCategory, setColCategory] = useState<CollectionCategory>('Photocard');
  const [colMember, setColMember] = useState<MemberId>('OT7');
  const [colEra, setColEra] = useState('');
  const [colMemo, setColMemo] = useState('');
  const [colImage, setColImage] = useState('');
  const [colTheme, setColTheme] = useState<CollectionThemeVariant>('cosmos');
  const [colDate, setColDate] = useState(getTodayDateString());

  const filteredCollection = useMemo(() => {
    if (colMemberFilter === 'ALL') return data.collectionItems;
    return data.collectionItems.filter((c) => c.member === colMemberFilter);
  }, [data.collectionItems, colMemberFilter]);

  const openNewColModal = () => {
    setEditingCol(null);
    setColTitle('');
    setColCategory('Photocard');
    setColMember(data.settings.bias || 'OT7');
    setColEra('');
    setColMemo('');
    setColImage('');
    setColTheme('cosmos');
    setColDate(getTodayDateString());
    setColModalOpen(true);
  };

  const openEditColModal = (item: CollectionItem) => {
    setEditingCol(item);
    setColTitle(item.title);
    setColCategory(item.category);
    setColMember(item.member);
    setColEra(item.eraOrSeries);
    setColMemo(item.memo);
    setColImage(item.imageUrl || '');
    setColTheme(item.themeVariant || 'cosmos');
    setColDate(item.acquiredDate);
    setColModalOpen(true);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 560;
        let w = img.width;
        let h = img.height;
        if (w > h && w > maxDim) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else if (h >= w && h > maxDim) {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
          setColImage(compressedDataUrl);
        }
      };
      if (typeof event.target?.result === 'string') {
        img.src = event.target.result;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitCol = (e: React.FormEvent) => {
    e.preventDefault();
    if (!colTitle.trim()) return;
    const item: CollectionItem = {
      id: editingCol ? editingCol.id : `col-${Date.now()}`,
      title: colTitle.trim(),
      category: colCategory,
      member: colMember,
      eraOrSeries: colEra.trim() || 'Special Collection',
      memo: colMemo.trim(),
      imageUrl: colImage.trim() || undefined,
      themeVariant: colTheme,
      acquiredDate: colDate || getTodayDateString(),
    };
    onSaveCollection(item);
    setColModalOpen(false);
    onTriggerBurst('コレクション図鑑に登録しました 💜');
  };

  return (
    <div className="space-y-6">
      {/* Top Sub-Tab Switcher */}
      <section className="rounded-3xl border border-purple-100/90 bg-white/85 p-5 shadow-sm backdrop-blur-md sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              推し活アーカイブ＆図鑑
            </h1>
            <p className="text-xs text-slate-500">
              日々のときめき、見たコンテンツ、大切なグッズをひとつに記録
            </p>
          </div>

          {/* 3 Sub-Tabs Segmented Control */}
          <div className="grid grid-cols-3 gap-1 rounded-2xl bg-purple-50/90 p-1.5">
            <button
              type="button"
              onClick={() => setSubTab('diary')}
              className={`flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                subTab === 'diary'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-purple-900 hover:bg-purple-100/60'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5 shrink-0" />
              <span>推し活日記 ({data.diaryEntries.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setSubTab('watch_visit')}
              className={`flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                subTab === 'watch_visit'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-purple-900 hover:bg-purple-100/60'
              }`}
            >
              <Tv className="h-3.5 w-3.5 shrink-0" />
              <span>視聴＆聖地 ({data.watchVisitList.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setSubTab('collection')}
              className={`flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                subTab === 'collection'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-purple-900 hover:bg-purple-100/60'
              }`}
            >
              <Disc className="h-3.5 w-3.5 shrink-0" />
              <span>トレカ・グッズ ({data.collectionItems.length})</span>
            </button>
          </div>
        </div>
      </section>

      {/* SUB-TAB 1: DIARY TIMELINE */}
      {subTab === 'diary' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              推し活タイムライン日記
            </h2>
            <button
              type="button"
              onClick={openNewDiaryModal}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-purple-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-purple-800 whitespace-nowrap shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>日記を書く</span>
            </button>
          </div>

          <div className="space-y-4">
            {data.diaryEntries.map((entry) => {
              const moodInfo =
                DIARY_MOOD_LABELS[entry.mood] || DIARY_MOOD_LABELS.purple_love;
              return (
                <article
                  key={entry.id}
                  className="rounded-3xl border border-purple-100/90 bg-white/90 p-5 shadow-xs backdrop-blur-md transition-shadow hover:shadow-md sm:p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="font-mono font-semibold text-purple-900 tabular-nums">
                          {entry.date}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>
                          {moodInfo.symbol} {moodInfo.label}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-semibold text-purple-700">
                          {entry.memberTag}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                        {entry.contentTitle}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => openEditDiaryModal(entry)}
                        className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-xl text-slate-400 hover:bg-purple-50 hover:text-purple-700"
                        aria-label="編集"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteDiary(entry.id)}
                        className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                        aria-label="削除"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                    {entry.note}
                  </p>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* SUB-TAB 2: WATCH & VISIT LIST */}
      {subTab === 'watch_visit' && (
        <section className="space-y-4">
          <div className="flex flex-col justify-between gap-3 rounded-3xl border border-purple-100/90 bg-white/85 p-5 backdrop-blur-md sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 rounded-xl bg-purple-50 p-1">
                <button
                  type="button"
                  onClick={() => setWvTypeFilter('all')}
                  className={`min-h-[36px] rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    wvTypeFilter === 'all'
                      ? 'bg-white text-purple-950 shadow-xs'
                      : 'text-slate-600'
                  }`}
                >
                  すべて
                </button>
                <button
                  type="button"
                  onClick={() => setWvTypeFilter('watch')}
                  className={`min-h-[36px] rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    wvTypeFilter === 'watch'
                      ? 'bg-white text-purple-950 shadow-xs'
                      : 'text-slate-600'
                  }`}
                >
                  視聴リスト
                </button>
                <button
                  type="button"
                  onClick={() => setWvTypeFilter('visit')}
                  className={`min-h-[36px] rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    wvTypeFilter === 'visit'
                      ? 'bg-white text-purple-950 shadow-xs'
                      : 'text-slate-600'
                  }`}
                >
                  聖地巡礼リスト
                </button>
              </div>

              <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setWvStatusFilter('all')}
                  className={`min-h-[36px] rounded-lg px-2.5 py-1 text-xs font-semibold whitespace-nowrap shrink-0 ${
                    wvStatusFilter === 'all'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600'
                  }`}
                >
                  全状態
                </button>
                <button
                  type="button"
                  onClick={() => setWvStatusFilter('todo')}
                  className={`min-h-[36px] rounded-lg px-2.5 py-1 text-xs font-semibold whitespace-nowrap shrink-0 ${
                    wvStatusFilter === 'todo'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600'
                  }`}
                >
                  未視聴・行きたい
                </button>
                <button
                  type="button"
                  onClick={() => setWvStatusFilter('done')}
                  className={`min-h-[36px] rounded-lg px-2.5 py-1 text-xs font-semibold whitespace-nowrap shrink-0 ${
                    wvStatusFilter === 'done'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600'
                  }`}
                >
                  視聴済・行った
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => openNewWvModal('watch')}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-purple-700 px-3.5 py-2 text-xs font-bold text-white hover:bg-purple-800 whitespace-nowrap shrink-0"
              >
                <Plus className="h-4 w-4" />
                <span>動画を追加</span>
              </button>
              <button
                type="button"
                onClick={() => openNewWvModal('visit')}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50 px-3.5 py-2 text-xs font-bold text-purple-900 hover:bg-purple-100 whitespace-nowrap shrink-0"
              >
                <MapPin className="h-4 w-4" />
                <span>聖地を追加</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filteredWatchVisit.map((item) => {
              const isDone = item.status === 'done';
              const statusLabel =
                item.type === 'watch'
                  ? isDone
                    ? '視聴済'
                    : '未視聴'
                  : isDone
                    ? '行った！'
                    : '行きたい';

              return (
                <div
                  key={item.id}
                  className="flex flex-col justify-between rounded-3xl border border-purple-100/90 bg-white/90 p-5 shadow-xs backdrop-blur-md"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-semibold text-purple-800">
                          {item.type === 'watch' ? '動画コンテンツ' : '聖地スポット'}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{item.category}</span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => openEditWvModal(item)}
                          className="flex min-h-[38px] min-w-[38px] items-center justify-center rounded-xl text-slate-400 hover:bg-purple-50 hover:text-purple-700"
                          aria-label="編集"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteWatchVisit(item.id)}
                          className="flex min-h-[38px] min-w-[38px] items-center justify-center rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                          aria-label="削除"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <h3 className="mt-1 text-base font-bold text-slate-900">
                      {item.title}
                    </h3>

                    {/* 5-Star Rating */}
                    <div className="mt-2 flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() =>
                            onSaveWatchVisit({ ...item, rating: star })
                          }
                          className="p-0.5 text-amber-400 transition-transform hover:scale-110"
                          title={`星${star}つに設定`}
                        >
                          <Star
                            className={`h-4 w-4 ${
                              star <= item.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-200'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-1.5 text-xs font-semibold text-slate-500 tabular-nums">
                        {item.rating}.0
                      </span>
                    </div>

                    {item.memo && (
                      <p className="mt-2.5 text-xs leading-relaxed text-slate-600">
                        {item.memo}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                    <button
                      type="button"
                      onClick={() => handleToggleWvStatus(item)}
                      className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                        isDone
                          ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                          : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Circle className="h-4 w-4 text-purple-600" />
                      )}
                      <span>{statusLabel}（タップで切替）</span>
                    </button>

                    {item.locationOrLink && (
                      item.locationOrLink.startsWith('http') ? (
                        <a
                          href={item.locationOrLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-[40px] items-center gap-1 text-xs font-semibold text-purple-700 hover:underline whitespace-nowrap shrink-0"
                        >
                          <span>リンクを開く</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      ) : (
                        <span className="truncate text-xs text-slate-500 max-w-[180px]">
                          📍 {item.locationOrLink}
                        </span>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* SUB-TAB 3: COLLECTION DIGITAL ENCYCLOPEDIA */}
      {subTab === 'collection' && (
        <section className="space-y-4">
          <div className="flex flex-col justify-between gap-3 rounded-3xl border border-purple-100/90 bg-white/85 p-5 backdrop-blur-md sm:flex-row sm:items-center">
            {/* Member Filter */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setColMemberFilter('ALL')}
                className={`min-h-[38px] rounded-xl px-3 py-1.5 text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                  colMemberFilter === 'ALL'
                    ? 'bg-purple-700 text-white'
                    : 'bg-purple-50 text-purple-900 hover:bg-purple-100'
                }`}
              >
                ALL ({data.collectionItems.length})
              </button>
              {MEMBER_KEYS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setColMemberFilter(m)}
                  className={`min-h-[38px] rounded-xl px-3 py-1.5 text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                    colMemberFilter === m
                      ? 'bg-purple-700 text-white'
                      : 'bg-purple-50 text-purple-900 hover:bg-purple-100'
                  }`}
                >
                  {m === 'OT7' ? 'OT7 (全員)' : m}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={openNewColModal}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl bg-purple-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-purple-800 whitespace-nowrap shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>グッズ・トレカを登録</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCollection.map((item) => {
              const theme =
                THEME_GRADIENTS[item.themeVariant] || THEME_GRADIENTS.cosmos;
              return (
                <article
                  key={item.id}
                  className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-purple-100/90 bg-white/90 shadow-xs transition-shadow hover:shadow-md"
                >
                  <div>
                    {/* Visual Header / Uploaded Photo or Styled Borahae Artwork Card */}
                    <div className="relative h-48 w-full overflow-hidden bg-purple-950">
                      {item.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div
                          className={`flex h-full w-full flex-col items-center justify-center bg-gradient-to-br p-6 text-center ${theme.bgClass}`}
                        >
                          <Sparkles className="h-8 w-8 opacity-80" />
                          <p className="mt-2 text-xs font-semibold tracking-wider uppercase opacity-80">
                            {item.category} · {item.member}
                          </p>
                          <p className="mt-1 line-clamp-2 text-sm font-bold">
                            {item.title}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                        <div>
                          <span className="font-semibold text-purple-800">
                            {item.member}
                          </span>
                          <span aria-hidden="true"> · </span>
                          <span>{item.category}</span>
                        </div>
                        <span className="font-mono tabular-nums">
                          {item.acquiredDate}
                        </span>
                      </div>

                      <h3 className="mt-1.5 text-base font-bold text-slate-900">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {item.eraOrSeries}
                      </p>

                      {item.memo && (
                        <p className="mt-3 text-xs leading-relaxed text-slate-600">
                          {item.memo}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-1 border-t border-slate-100 px-4 py-2.5">
                    <button
                      type="button"
                      onClick={() => openEditColModal(item)}
                      className="inline-flex min-h-[38px] items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-purple-50 hover:text-purple-800"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      <span>編集</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteCollection(item.id)}
                      className="inline-flex min-h-[38px] items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>削除</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* MODAL 1: DIARY ADD/EDIT */}
      {diaryModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onClick={() => setDiaryModalOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-3xl border border-purple-100 bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                {editingDiary ? '推し活日記を編集' : '新しい推し活日記を書く'}
              </h3>
              <button
                type="button"
                onClick={() => setDiaryModalOpen(false)}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitDiary} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    日付
                  </label>
                  <input
                    type="date"
                    value={diaryDate}
                    onChange={(e) => setDiaryDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-purple-600 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    メンバータグ
                  </label>
                  <select
                    value={diaryMember}
                    onChange={(e) => setDiaryMember(e.target.value as MemberId)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-purple-600 focus:outline-none"
                  >
                    {MEMBER_KEYS.map((m) => (
                      <option key={m} value={m}>
                        {MEMBER_PROFILES[m].name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  今日の気持ちアイコン
                </label>
                <div className="mt-1.5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {(Object.keys(DIARY_MOOD_LABELS) as DiaryMood[]).map((mKey) => {
                    const info = DIARY_MOOD_LABELS[mKey];
                    return (
                      <button
                        key={mKey}
                        type="button"
                        onClick={() => setDiaryMood(mKey)}
                        className={`flex min-h-[40px] items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
                          diaryMood === mKey
                            ? 'border-purple-600 bg-purple-50 text-purple-950'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span>{info.symbol}</span>
                        <span>{info.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  タイトル・見たコンテンツ名
                </label>
                <input
                  type="text"
                  value={diaryTitle}
                  onChange={(e) => setDiaryTitle(e.target.value)}
                  placeholder="例: In the SOOP を見ながら癒やされた夜"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-purple-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  感想・思い出メモ
                </label>
                <textarea
                  rows={4}
                  value={diaryNote}
                  onChange={(e) => setDiaryNote(e.target.value)}
                  placeholder="心に残ったシーンや歌詞、今日の出来事を自由に記録しましょう..."
                  className="mt-1 w-full rounded-xl border border-slate-200 p-3.5 text-sm text-slate-900 focus:border-purple-600 focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDiaryModalOpen(false)}
                  className="min-h-[44px] rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] rounded-xl bg-purple-700 px-5 py-2 text-xs font-bold text-white hover:bg-purple-800"
                >
                  保存する
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: WATCH & VISIT ADD/EDIT */}
      {wvModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onClick={() => setWvModalOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-3xl border border-purple-100 bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                {editingWv ? 'リスト項目を編集' : '視聴＆聖地リストに追加'}
              </h3>
              <button
                type="button"
                onClick={() => setWvModalOpen(false)}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitWv} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    種類
                  </label>
                  <select
                    value={wvType}
                    onChange={(e) => setWvType(e.target.value as WatchVisitType)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900"
                  >
                    <option value="watch">動画・コンテンツ (視聴)</option>
                    <option value="visit">聖地・カフェ・ロケ地 (訪問)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    ステータス
                  </label>
                  <select
                    value={wvStatus}
                    onChange={(e) =>
                      setWvStatus(e.target.value as WatchVisitStatus)
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900"
                  >
                    <option value="todo">
                      {wvType === 'watch' ? '未視聴' : '行きたい'}
                    </option>
                    <option value="done">
                      {wvType === 'watch' ? '視聴済' : '行った！'}
                    </option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    カテゴリー名
                  </label>
                  <input
                    type="text"
                    value={wvCategory}
                    onChange={(e) => setWvCategory(e.target.value)}
                    placeholder="例: Run BTS! / ソウル聖地カフェ"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    おすすめ度（5段階評価）
                  </label>
                  <div className="mt-2 flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setWvRating(st)}
                        className="p-1"
                      >
                        <Star
                          className={`h-5 w-5 ${
                            st <= wvRating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  タイトル・スポット名
                </label>
                <input
                  type="text"
                  value={wvTitle}
                  onChange={(e) => setWvTitle(e.target.value)}
                  placeholder="例: Run BTS! Ep.33 写真ゾーン回 / 休家カフェ"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  場所メモ または 動画URL（任意）
                </label>
                <input
                  type="text"
                  value={wvLink}
                  onChange={(e) => setWvLink(e.target.value)}
                  placeholder="例: https://youtube.com/... または ソウル江南区"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  ひとこと感想・メモ
                </label>
                <textarea
                  rows={3}
                  value={wvMemo}
                  onChange={(e) => setWvMemo(e.target.value)}
                  placeholder="見どころや聖地で頼みたいメニューなど..."
                  className="mt-1 w-full rounded-xl border border-slate-200 p-3.5 text-sm text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setWvModalOpen(false)}
                  className="min-h-[44px] rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] rounded-xl bg-purple-700 px-5 py-2 text-xs font-bold text-white hover:bg-purple-800"
                >
                  保存する
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: COLLECTION ADD/EDIT */}
      {colModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onClick={() => setColModalOpen(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-purple-100 bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                {editingCol ? 'コレクションを編集' : 'グッズ・トレカを図鑑に登録'}
              </h3>
              <button
                type="button"
                onClick={() => setColModalOpen(false)}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitCol} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  アイテム名（アルバム・トレカ・グッズ名）
                </label>
                <input
                  type="text"
                  value={colTitle}
                  onChange={(e) => setColTitle(e.target.value)}
                  placeholder="例: LOVE YOURSELF 結 'Answer' トレカ"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    カテゴリー
                  </label>
                  <select
                    value={colCategory}
                    onChange={(e) =>
                      setColCategory(e.target.value as CollectionCategory)
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900"
                  >
                    {COLLECTION_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    メンバータグ
                  </label>
                  <select
                    value={colMember}
                    onChange={(e) => setColMember(e.target.value as MemberId)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900"
                  >
                    {MEMBER_KEYS.map((m) => (
                      <option key={m} value={m}>
                        {MEMBER_PROFILES[m].name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    シリーズ・年代（任意）
                  </label>
                  <input
                    type="text"
                    value={colEra}
                    onChange={(e) => setColEra(e.target.value)}
                    placeholder="例: Proof Era / 2022"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    入手日
                  </label>
                  <input
                    type="date"
                    value={colDate}
                    onChange={(e) => setColDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900"
                  />
                </div>
              </div>

              {/* Photo Upload or Theme Selector */}
              <div className="rounded-2xl border border-purple-100 bg-purple-50/50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-950">
                    写真登録（スマホの写真 または 背景テーマ）
                  </span>
                  {colImage && (
                    <button
                      type="button"
                      onClick={() => setColImage('')}
                      className="text-xs font-semibold text-rose-600 hover:underline"
                    >
                      写真をクリア
                    </button>
                  )}
                </div>

                <label className="flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-purple-300 bg-white px-4 py-2.5 text-xs font-semibold text-purple-800 hover:bg-purple-50">
                  <ImagePlus className="h-4 w-4" />
                  <span>スマホから写真を選択（自動で軽量保存されます）</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    className="hidden"
                  />
                </label>

                <div>
                  <label className="block text-[11px] font-medium text-slate-500">
                    写真がない場合の背景カードカラー
                  </label>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {(
                      Object.keys(THEME_GRADIENTS) as CollectionThemeVariant[]
                    ).map((tKey) => (
                      <button
                        key={tKey}
                        type="button"
                        onClick={() => setColTheme(tKey)}
                        className={`rounded-lg border px-2.5 py-1 text-xs font-semibold ${
                          colTheme === tKey
                            ? 'border-purple-700 bg-purple-700 text-white'
                            : 'border-slate-200 bg-white text-slate-700'
                        }`}
                      >
                        {THEME_GRADIENTS[tKey].label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  お気に入りポイント・保管メモ
                </label>
                <textarea
                  rows={3}
                  value={colMemo}
                  onChange={(e) => setColMemo(e.target.value)}
                  placeholder="自引きした思い出や、バインダーの何ページ目にあるかなど..."
                  className="mt-1 w-full rounded-xl border border-slate-200 p-3.5 text-sm text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setColModalOpen(false)}
                  className="min-h-[44px] rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] rounded-xl bg-purple-700 px-5 py-2 text-xs font-bold text-white hover:bg-purple-800"
                >
                  登録する
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
