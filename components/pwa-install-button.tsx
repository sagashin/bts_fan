'use client';

import React, { useState } from 'react';
import { Download, Share, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '@/hooks/use-pwa-install';

interface PWAInstallButtonProps {
  compact?: boolean;
}

export function PWAInstallButton({ compact = false }: PWAInstallButtonProps) {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);

  if (isInstalled) {
    return null;
  }

  const handleAction = async () => {
    if (isInstallable) {
      await install();
    } else {
      setShowGuideModal(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleAction}
        className={
          compact
            ? 'inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-purple-200/80 bg-purple-50/80 px-3.5 py-2 text-xs font-semibold text-purple-800 transition-colors hover:bg-purple-100 whitespace-nowrap shrink-0'
            : 'inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-purple-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-purple-800 whitespace-nowrap shrink-0'
        }
      >
        <Download className="h-4 w-4 shrink-0" />
        <span>
          {isInstallable
            ? 'アプリをインストール'
            : compact
              ? 'ホーム画面に追加'
              : 'スマホのホーム画面に追加する方法'}
        </span>
      </button>

      {showGuideModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onClick={() => setShowGuideModal(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-purple-100 bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-purple-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
                  <Smartphone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    ホーム画面に追加してアプリ化
                  </h3>
                  <p className="text-xs text-slate-500">
                    全画面でいつでもワンタップで開けます
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="閉じる"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-sm text-slate-700">
              <div className="rounded-2xl bg-purple-50/70 p-4">
                <p className="font-semibold text-purple-950">
                  {isIOS
                    ? 'iPhone / iPad (Safari) の手順'
                    : 'iPhone (Safari) の場合'}
                </p>
                <ol className="mt-2 list-inside list-decimal space-y-1.5 text-xs leading-relaxed text-slate-700">
                  <li>
                    画面下のツールバーにある{' '}
                    <span className="inline-flex items-center gap-1 font-semibold text-purple-800">
                      <Share className="h-3.5 w-3.5" /> 共有ボタン
                    </span>{' '}
                    をタップします。
                  </li>
                  <li>
                    メニューを下にスクロールして{' '}
                    <strong className="text-purple-900">
                      「ホーム画面に追加」
                    </strong>{' '}
                    を選びます。
                  </li>
                  <li>
                    右上の「追加」をタップすると、紫のハートアイコンがホーム画面に並びます。
                  </li>
                </ol>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">
                  Android (Chrome) の場合
                </p>
                <ol className="mt-2 list-inside list-decimal space-y-1.5 text-xs leading-relaxed text-slate-600">
                  <li>
                    ブラウザ右上のメニュー（︙）をタップします。
                  </li>
                  <li>
                    <strong className="text-slate-900">
                      「アプリをインストール」
                    </strong>{' '}
                    または{' '}
                    <strong className="text-slate-900">
                      「ホーム画面に追加」
                    </strong>{' '}
                    をタップします。
                  </li>
                </ol>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              className="mt-5 flex min-h-[44px] w-full items-center justify-center rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </>
  );
}
