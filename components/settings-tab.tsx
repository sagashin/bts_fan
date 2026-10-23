'use client';

import React, { useState } from 'react';
import {
  Check,
  Download,
  Gift,
  Heart,
  Lock,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react';
import {
  AnniversaryCategory,
  AnniversaryItem,
  AppData,
  MemberId,
  MoodCategory,
  PersonalSettings,
  PrescriptionItem,
  QuoteItem,
} from '@/lib/types';
import { MEMBER_PROFILES, MOOD_CATEGORIES } from '@/lib/seed-data';
import { PWAInstallButton } from './pwa-install-button';

interface SettingsTabProps {
  data: AppData;
  onUpdateSettings: (next: PersonalSettings) => void;
  onSaveQuote: (q: QuoteItem) => void;
  onDeleteQuote: (id: string) => void;
  onSavePrescription: (rx: PrescriptionItem) => void;
  onDeletePrescription: (id: string) => void;
  onSaveAnniversary: (anniv: AnniversaryItem) => void;
  onDeleteAnniversary: (id: string) => void;
  onImportData: (imported: AppData) => void;
  onResetDefaultData: () => void;
  onOpenSecretLetter: () => void;
  onTriggerBurst: (label?: string) => void;
}

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

type CmsSection = 'quotes' | 'prescriptions' | 'anniversaries';

export function SettingsTab({
  data,
  onUpdateSettings,
  onSaveQuote,
  onDeleteQuote,
  onSavePrescription,
  onDeletePrescription,
  onSaveAnniversary,
  onDeleteAnniversary,
  onImportData,
  onResetDefaultData,
  onOpenSecretLetter,
  onTriggerBurst,
}: SettingsTabProps) {
  const { settings } = data;

  // Personal settings form state
  const [wifeName, setWifeName] = useState(settings.wifeName);
  const [bMonth, setBMonth] = useState(
    parseInt(settings.wifeBirthday.split('-')[0] || '5', 10)
  );
  const [bDay, setBDay] = useState(
    parseInt(settings.wifeBirthday.split('-')[1] || '15', 10)
  );
  const [bias, setBias] = useState<MemberId>(settings.bias);
  const [secretMessage, setSecretMessage] = useState(settings.secretMessage);
  const [husbandName, setHusbandName] = useState(settings.husbandName);
  const [showHusbandEditor, setShowHusbandEditor] = useState(false);
  const [savedProfileBanner, setSavedProfileBanner] = useState(false);

  // CMS Section state
  const [cmsTab, setCmsTab] = useState<CmsSection>('quotes');

  // 1. Add Quote Form
  const [qKorean, setQKorean] = useState('');
  const [qJapanese, setQJapanese] = useState('');
  const [qMember, setQMember] = useState<MemberId>('OT7');
  const [qSource, setQSource] = useState('');

  // 2. Add Prescription Form
  const [rxMood, setRxMood] = useState<MoodCategory>('healing');
  const [rxSong, setRxSong] = useState('');
  const [rxAlbum, setRxAlbum] = useState('');
  const [rxUrl, setRxUrl] = useState('');
  const [rxMember, setRxMember] = useState<MemberId>('OT7');
  const [rxMessage, setRxMessage] = useState('');
  const [rxNote, setRxNote] = useState('');

  // 3. Add Anniversary Form
  const [anTitle, setAnTitle] = useState('');
  const [anMonth, setAnMonth] = useState(6);
  const [anDay, setAnDay] = useState(13);
  const [anYear, setAnYear] = useState('');
  const [anDesc, setAnDesc] = useState('');

  // Backup status message
  const [backupStatus, setBackupStatus] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedBday = `${String(bMonth).padStart(2, '0')}-${String(
      bDay
    ).padStart(2, '0')}`;
    onUpdateSettings({
      wifeName: wifeName.trim() || 'ARMY',
      wifeBirthday: formattedBday,
      bias,
      secretMessage: secretMessage.trim() || settings.secretMessage,
      husbandName: husbandName.trim() || '夫より',
    });
    setSavedProfileBanner(true);
    onTriggerBurst('プロフィール＆最推し設定を保存しました 💜');
    setTimeout(() => setSavedProfileBanner(false), 2500);
  };

  const handleSelectBiasInstant = (newBias: MemberId) => {
    setBias(newBias);
    const formattedBday = `${String(bMonth).padStart(2, '0')}-${String(
      bDay
    ).padStart(2, '0')}`;
    onUpdateSettings({
      wifeName: wifeName.trim() || settings.wifeName,
      wifeBirthday: formattedBday,
      bias: newBias,
      secretMessage,
      husbandName,
    });
    onTriggerBurst(`最推しを ${MEMBER_PROFILES[newBias].name} に変更しました 💜`);
  };

  const handleAddQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qKorean.trim() && !qJapanese.trim()) return;
    onSaveQuote({
      id: `quote-${Date.now()}`,
      korean: qKorean.trim() || '보라해 💜',
      japanese: qJapanese.trim(),
      member: qMember,
      source: qSource.trim() || 'BTS Special Message',
      isFavorite: true,
    });
    setQKorean('');
    setQJapanese('');
    setQSource('');
    onTriggerBurst('新しい名言を追加しました 💜');
  };

  const handleAddPrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rxSong.trim()) return;
    const defaultUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
      'BTS ' + rxSong.trim()
    )}`;
    onSavePrescription({
      id: `rx-${Date.now()}`,
      mood: rxMood,
      songTitle: rxSong.trim(),
      albumOrEra: rxAlbum.trim() || 'BTS Special Track',
      youtubeUrl: rxUrl.trim() || defaultUrl,
      member: rxMember,
      memberMessage:
        rxMessage.trim() ||
        '「この曲を聴いて、今日もあなたらしい素敵な時間を過ごしてね！」',
      prescriptionNote:
        rxNote.trim() || '心を落ち着けて、好きな飲み物と一緒に楽しみましょう。',
    });
    setRxSong('');
    setRxAlbum('');
    setRxUrl('');
    setRxMessage('');
    setRxNote('');
    onTriggerBurst('処方箋アイテムを追加しました 💜');
  };

  const handleAddAnniversary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!anTitle.trim()) return;
    const dateStr = `${String(anMonth).padStart(2, '0')}-${String(
      anDay
    ).padStart(2, '0')}`;
    const parsedYear = anYear ? parseInt(anYear, 10) : undefined;
    const category: AnniversaryCategory = 'special';
    onSaveAnniversary({
      id: `anniv-${Date.now()}`,
      title: anTitle.trim(),
      date: dateStr,
      originYear: parsedYear && !isNaN(parsedYear) ? parsedYear : undefined,
      category,
      member: 'OT7',
      description: anDesc.trim() || '大切な思い出の記念日。',
    });
    setAnTitle('');
    setAnYear('');
    setAnDesc('');
    onTriggerBurst('新しい記念日を登録しました 💜');
  };

  // JSON Export
  const handleExportJSON = () => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStamp = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `borahae-archive-backup-${dateStamp}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setBackupStatus('バックアップJSONファイルを書き出しました。');
    onTriggerBurst('バックアップを保存しました 💜');
  };

  // JSON Import
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const raw = event.target?.result;
        if (typeof raw !== 'string') return;
        const parsed = JSON.parse(raw) as AppData;
        if (
          !parsed ||
          !parsed.settings ||
          !Array.isArray(parsed.quotes) ||
          !Array.isArray(parsed.anniversaries)
        ) {
          setBackupStatus(
            'エラー: 正しいBorahae Archiveバックアップファイルではありません。'
          );
          return;
        }
        onImportData(parsed);
        setWifeName(parsed.settings.wifeName);
        setBias(parsed.settings.bias);
        setSecretMessage(parsed.settings.secretMessage);
        setHusbandName(parsed.settings.husbandName || '夫より');
        const [m, d] = (parsed.settings.wifeBirthday || '05-15').split('-');
        setBMonth(parseInt(m || '5', 10));
        setBDay(parseInt(d || '15', 10));
        setBackupStatus('バックアップデータを正常に復元しました！');
        onTriggerBurst('データを復元しました 💜');
      } catch {
        setBackupStatus('エラー: JSONファイルの読み込みに失敗しました。');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* 1. Personal & Bias Customization */}
      <section className="rounded-3xl border border-purple-100/90 bg-white/85 p-6 shadow-sm backdrop-blur-md sm:p-8">
        <div className="border-b border-purple-100/70 pb-4">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            最推し（Bias）＆パーソナル設定
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            選んだ最推しメンバーに合わせてホーム画面の挨拶メッセージやテーマカラーが変化します
          </p>
        </div>

        {/* Bias Selector Cards */}
        <div className="mt-5">
          <label className="block text-xs font-bold text-slate-700">
            最推しメンバー（Bias）を選択
          </label>
          <div className="mt-2.5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {MEMBER_KEYS.map((mKey) => {
              const prof = MEMBER_PROFILES[mKey];
              const isSelected = bias === mKey;
              return (
                <button
                  key={mKey}
                  type="button"
                  onClick={() => handleSelectBiasInstant(mKey)}
                  className={`flex min-h-[68px] flex-col justify-between rounded-2xl border p-3.5 text-left transition-all ${
                    isSelected
                      ? 'border-purple-700 bg-purple-50/90 ring-2 ring-purple-600/20'
                      : 'border-slate-200/90 bg-white hover:border-purple-200 hover:bg-purple-50/30'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-sm font-bold text-slate-900">
                      {mKey === 'OT7' ? 'OT7 (全員)' : prof.name}
                    </span>
                    {isSelected && (
                      <Heart className="h-4 w-4 fill-purple-600 text-purple-600 shrink-0" />
                    )}
                  </div>
                  <span className="mt-1 text-[11px] text-slate-500">
                    {prof.koreanName}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Nickname & Birthday Form */}
        <form onSubmit={handleSaveProfile} className="mt-6 space-y-4 border-t border-purple-100/70 pt-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-700">
                お名前（ニックネーム）
              </label>
              <input
                type="text"
                value={wifeName}
                onChange={(e) => setWifeName(e.target.value)}
                placeholder="例: ゆい / マイARMY"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-purple-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700">
                あなたのお誕生日（記念日カウントダウンに自動連動）
              </label>
              <div className="mt-1.5 flex items-center gap-2">
                <select
                  value={bMonth}
                  onChange={(e) => setBMonth(parseInt(e.target.value, 10))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>
                      {m}月
                    </option>
                  ))}
                </select>
                <select
                  value={bDay}
                  onChange={(e) => setBDay(parseInt(e.target.value, 10))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900"
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>
                      {d}日
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <button
              type="submit"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-purple-700 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-purple-800 whitespace-nowrap shrink-0"
            >
              <Check className="h-4 w-4" />
              <span>プロフィール設定を保存</span>
            </button>

            {savedProfileBanner && (
              <span className="text-xs font-semibold text-emerald-700">
                ✓ 設定を保存しました！
              </span>
            )}
          </div>
        </form>
      </section>

      {/* 2. CMS Content Addition & Management */}
      <section className="rounded-3xl border border-purple-100/90 bg-white/85 p-6 shadow-sm backdrop-blur-md sm:p-8">
        <div className="flex flex-col justify-between gap-4 border-b border-purple-100/70 pb-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              アプリを育てる · コンテンツ追加＆管理
            </h2>
            <p className="text-xs text-slate-500">
              好きな歌詞・処方箋動画・記念日をいつでも自由に追加できます
            </p>
          </div>

          <div className="flex items-center gap-1 rounded-xl bg-purple-50 p-1">
            <button
              type="button"
              onClick={() => setCmsTab('quotes')}
              className={`min-h-[38px] rounded-lg px-3 py-1.5 text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                cmsTab === 'quotes'
                  ? 'bg-white text-purple-950 shadow-xs'
                  : 'text-slate-600'
              }`}
            >
              名言・歌詞 ({data.quotes.length})
            </button>
            <button
              type="button"
              onClick={() => setCmsTab('prescriptions')}
              className={`min-h-[38px] rounded-lg px-3 py-1.5 text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                cmsTab === 'prescriptions'
                  ? 'bg-white text-purple-950 shadow-xs'
                  : 'text-slate-600'
              }`}
            >
              BTS処方箋 ({data.prescriptions.length})
            </button>
            <button
              type="button"
              onClick={() => setCmsTab('anniversaries')}
              className={`min-h-[38px] rounded-lg px-3 py-1.5 text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                cmsTab === 'anniversaries'
                  ? 'bg-white text-purple-950 shadow-xs'
                  : 'text-slate-600'
              }`}
            >
              記念日 ({data.anniversaries.length})
            </button>
          </div>
        </div>

        {/* CMS TAB 1: QUOTES */}
        {cmsTab === 'quotes' && (
          <div className="mt-5 space-y-6">
            <form
              onSubmit={handleAddQuote}
              className="rounded-2xl border border-purple-100 bg-purple-50/40 p-5 space-y-4"
            >
              <h3 className="text-sm font-bold text-purple-950">
                ＋ 日替わり名言・歌詞を新規追加
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    メンバー
                  </label>
                  <select
                    value={qMember}
                    onChange={(e) => setQMember(e.target.value as MemberId)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                  >
                    {MEMBER_KEYS.map((m) => (
                      <option key={m} value={m}>
                        {MEMBER_PROFILES[m].name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    曲名・出典（任意）
                  </label>
                  <input
                    type="text"
                    value={qSource}
                    onChange={(e) => setQSource(e.target.value)}
                    placeholder="例: Magic Shop / Weverse Live"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  韓国語フレーズ（または英語歌詞）
                </label>
                <input
                  type="text"
                  value={qKorean}
                  onChange={(e) => setQKorean(e.target.value)}
                  placeholder="例: 보라해 💜"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  日本語訳・メッセージ
                </label>
                <textarea
                  rows={2}
                  value={qJapanese}
                  onChange={(e) => setQJapanese(e.target.value)}
                  placeholder="例: 虹の最後の色である紫のように、末永く愛し合おう"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900"
                  required
                />
              </div>
              <button
                type="submit"
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-purple-700 px-4 py-2 text-xs font-bold text-white hover:bg-purple-800"
              >
                <Plus className="h-4 w-4" />
                <span>名言リストに追加する</span>
              </button>
            </form>

            <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto pr-1">
              {data.quotes.map((q) => (
                <div
                  key={q.id}
                  className="flex items-start justify-between gap-3 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-purple-900">
                      {q.member} · {q.source}
                    </p>
                    <p className="mt-0.5 text-xs font-medium text-slate-800">
                      {q.korean}
                    </p>
                    <p className="text-xs text-slate-500">{q.japanese}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteQuote(q.id)}
                    className="flex min-h-[36px] min-w-[36px] items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 shrink-0"
                    title="削除"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CMS TAB 2: PRESCRIPTIONS */}
        {cmsTab === 'prescriptions' && (
          <div className="mt-5 space-y-6">
            <form
              onSubmit={handleAddPrescription}
              className="rounded-2xl border border-purple-100 bg-purple-50/40 p-5 space-y-4"
            >
              <h3 className="text-sm font-bold text-purple-950">
                ＋ 気分別・BTS処方箋を新規追加
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    気分カテゴリー
                  </label>
                  <select
                    value={rxMood}
                    onChange={(e) => setRxMood(e.target.value as MoodCategory)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                  >
                    {MOOD_CATEGORIES.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    担当メンバー
                  </label>
                  <select
                    value={rxMember}
                    onChange={(e) => setRxMember(e.target.value as MemberId)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
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
                    おすすめ楽曲名 または 動画タイトル
                  </label>
                  <input
                    type="text"
                    value={rxSong}
                    onChange={(e) => setRxSong(e.target.value)}
                    placeholder="例: Mikrokosmos / Run BTS! Ep.85"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    アルバム名・シリーズ（任意）
                  </label>
                  <input
                    type="text"
                    value={rxAlbum}
                    onChange={(e) => setRxAlbum(e.target.value)}
                    placeholder="例: MAP OF THE SOUL : PERSONA"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  YouTube URL（空欄の場合は自動でYouTube検索リンクになります）
                </label>
                <input
                  type="text"
                  value={rxUrl}
                  onChange={(e) => setRxUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  メンバーからの励ましメッセージ
                </label>
                <textarea
                  rows={2}
                  value={rxMessage}
                  onChange={(e) => setRxMessage(e.target.value)}
                  placeholder="例: 「今日もお疲れさま！温かいココアを飲んでゆっくり聴いてね」"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900"
                />
              </div>

              <button
                type="submit"
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-purple-700 px-4 py-2 text-xs font-bold text-white hover:bg-purple-800"
              >
                <Plus className="h-4 w-4" />
                <span>処方箋ガチャに追加する</span>
              </button>
            </form>

            <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto pr-1">
              {data.prescriptions.map((rx) => {
                const mMeta = MOOD_CATEGORIES.find((m) => m.id === rx.mood);
                return (
                  <div
                    key={rx.id}
                    className="flex items-start justify-between gap-3 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-purple-900">
                        {mMeta?.label} · {rx.member}
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        {rx.songTitle}
                      </p>
                      <p className="text-xs text-slate-500">
                        {rx.memberMessage}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onDeletePrescription(rx.id)}
                      className="flex min-h-[36px] min-w-[36px] items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CMS TAB 3: ANNIVERSARIES */}
        {cmsTab === 'anniversaries' && (
          <div className="mt-5 space-y-6">
            <form
              onSubmit={handleAddAnniversary}
              className="rounded-2xl border border-purple-100 bg-purple-50/40 p-5 space-y-4"
            >
              <h3 className="text-sm font-bold text-purple-950">
                ＋ 記念日を新規追加（毎年自動でカウントダウンされます）
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    記念日タイトル
                  </label>
                  <input
                    type="text"
                    value={anTitle}
                    onChange={(e) => setAnTitle(e.target.value)}
                    placeholder="例: 初ライブ参戦記念日 / 結婚記念日"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    始まった西暦（任意）
                  </label>
                  <input
                    type="number"
                    value={anYear}
                    onChange={(e) => setAnYear(e.target.value)}
                    placeholder="例: 2021"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:w-1/2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    月
                  </label>
                  <select
                    value={anMonth}
                    onChange={(e) => setAnMonth(parseInt(e.target.value, 10))}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <option key={m} value={m}>
                        {m}月
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    日
                  </label>
                  <select
                    value={anDay}
                    onChange={(e) => setAnDay(parseInt(e.target.value, 10))}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                  >
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                      <option key={d} value={d}>
                        {d}日
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  ひとこと説明（任意）
                </label>
                <input
                  type="text"
                  value={anDesc}
                  onChange={(e) => setAnDesc(e.target.value)}
                  placeholder="例: 一生忘れられない紫の海を見た日"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                />
              </div>

              <button
                type="submit"
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-purple-700 px-4 py-2 text-xs font-bold text-white hover:bg-purple-800"
              >
                <Plus className="h-4 w-4" />
                <span>記念日カレンダーに追加する</span>
              </button>
            </form>

            <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto pr-1">
              {data.anniversaries.map((an) => (
                <div
                  key={an.id}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {an.title}{' '}
                      <span className="font-mono text-xs font-normal text-purple-700 tabular-nums">
                        ({an.date})
                      </span>
                    </p>
                    <p className="text-xs text-slate-500">{an.description}</p>
                  </div>
                  {an.id !== 'anniv-wife' && (
                    <button
                      type="button"
                      onClick={() => onDeleteAnniversary(an.id)}
                      className="flex min-h-[36px] min-w-[36px] items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 3. Data Backup (JSON Export / Import) & PWA Install */}
      <section className="rounded-3xl border border-purple-100/90 bg-white/85 p-6 shadow-sm backdrop-blur-md sm:p-8">
        <div className="border-b border-purple-100/70 pb-4">
          <h2 className="text-lg font-bold text-slate-900">
            データバックアップ（保存・復元）＆アプリ化
          </h2>
          <p className="text-xs text-slate-500">
            すべてのデータはスマホ内に安全に保存されています。機種変更時や念のためのバックアップとしてJSONファイルに書き出せます。
          </p>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={handleExportJSON}
            className="flex min-h-[52px] items-center justify-center gap-2.5 rounded-2xl border border-purple-200 bg-purple-50/80 px-5 py-3 text-sm font-bold text-purple-900 transition-colors hover:bg-purple-100"
          >
            <Download className="h-4 w-4 text-purple-700" />
            <span>全データをJSONで書き出す（保存）</span>
          </button>

          <label className="flex min-h-[52px] cursor-pointer items-center justify-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50">
            <Upload className="h-4 w-4 text-purple-700" />
            <span>バックアップJSONを読み込む（復元）</span>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleImportJSON}
              className="hidden"
            />
          </label>
        </div>

        {backupStatus && (
          <div className="mt-3 rounded-xl bg-purple-50 px-4 py-2.5 text-xs font-semibold text-purple-900">
            {backupStatus}
          </div>
        )}

        <div className="mt-5 flex flex-col justify-between gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center">
          <div className="w-full sm:w-auto">
            <PWAInstallButton />
          </div>

          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="inline-flex min-h-[40px] items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-rose-600"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>初期データに戻す</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-rose-600">
                本当に初期化しますか？
              </span>
              <button
                type="button"
                onClick={() => {
                  onResetDefaultData();
                  setConfirmReset(false);
                  onTriggerBurst('初期データにリセットしました');
                }}
                className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white"
              >
                初期化する
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600"
              >
                キャンセル
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 4. Secret Easter Egg Letter from Husband */}
      <section className="rounded-3xl border border-purple-200/80 bg-gradient-to-br from-purple-950 via-violet-900 to-fuchsia-950 p-6 text-white shadow-md sm:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
              <Sparkles className="h-4 w-4" />
              <span>SECRET BORAHAE LETTER · 隠しメッセージ</span>
            </div>
            <h2 className="text-lg font-bold">
              {settings.wifeName}さんへ贈る特別な手紙
            </h2>
            <p className="text-xs text-purple-200">
              アプリを作ったパートナーからのメッセージが封印されています
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onOpenSecretLetter}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-white px-5 py-2.5 text-xs font-bold text-purple-950 shadow-md transition-transform active:scale-[0.98] hover:bg-purple-50 whitespace-nowrap shrink-0"
            >
              <Gift className="h-4 w-4 text-pink-600" />
              <span>手紙を読む</span>
            </button>

            <button
              type="button"
              onClick={() => setShowHusbandEditor((prev) => !prev)}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-2xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-medium text-purple-100 hover:bg-white/20 whitespace-nowrap shrink-0"
            >
              <Lock className="h-3.5 w-3.5" />
              <span>手紙の文面を編集</span>
            </button>
          </div>
        </div>

        {showHusbandEditor && (
          <form
            onSubmit={handleSaveProfile}
            className="mt-5 space-y-3 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md"
          >
            <p className="text-xs font-semibold text-amber-200">
              🎁 プレゼント用カスタム設定（ここで書き換えて保存するとアプリに記憶されます）
            </p>
            <div>
              <label className="block text-xs text-purple-100">
                隠しメッセージ本文
              </label>
              <textarea
                rows={3}
                value={secretMessage}
                onChange={(e) => setSecretMessage(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/20 bg-white/95 p-3 text-sm text-slate-900"
              />
            </div>
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div className="w-full sm:w-64">
                <label className="block text-xs text-purple-100">
                  差出人サイン
                </label>
                <input
                  type="text"
                  value={husbandName}
                  onChange={(e) => setHusbandName(e.target.value)}
                  placeholder="例: 夫より"
                  className="mt-1 w-full rounded-xl border border-white/20 bg-white/95 px-3 py-2 text-sm text-slate-900"
                />
              </div>
              <button
                type="submit"
                className="min-h-[42px] rounded-xl bg-amber-300 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-200 whitespace-nowrap shrink-0"
              >
                手紙の内容を保存する
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
