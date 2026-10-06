import React, { useState } from 'react';
import { ArrowLeft, Download, FileText, Key, Lock, ShieldCheck } from 'lucide-react';
import mammoth from 'mammoth';
import { downloadShare, getShareInfo, viewShare } from '../api';

const ReceiveFilePage = () => {
  const [accessCode, setAccessCode] = useState('');
  const [shareData, setShareData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [previewing, setPreviewing] = useState(false);

  const onBack = () => {
    window.location.href = '/';
  };

  const handleAccess = async (event) => {
    event.preventDefault();
    const code = accessCode.trim();
    if (!/^\d{6}$/.test(code)) {
      setError('Enter the 6-digit code from the sender');
      setShareData(null);
      return;
    }

    const previewWindow = window.open('', '_blank', 'width=900,height=700');
    setLoading(true);
    setError('');
    try {
      const data = await getShareInfo(code);
      setShareData(data);
      if (!data.accessAllowed || data.status !== 'active') {
        previewWindow?.close();
        return;
      }

      if (data.deliveryMode === 'view') {
        const blob = await viewShare(code);
        await showPreview(blob, data.fileName, previewWindow);
      } else {
        const { blob } = await downloadShare(code);
        downloadBlob(blob, data.fileName || 'shared-file');
        await showPreview(blob, data.fileName, previewWindow);
        if (data.remainingDownloads !== null) {
          setShareData((current) => current && {
            ...current,
            remainingDownloads: Math.max(current.remainingDownloads - 1, 0),
          });
        }
      }
    } catch (requestError) {
      setShareData(null);
      setError(requestError.message);
      previewWindow?.close();
    } finally {
      setLoading(false);
    }
  };

  const downloadBlob = (blob, fileName) => {
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = fileName;
    link.click();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  };

  const showPreview = async (blob, fileName, previewWindow) => {
    if (!previewWindow) throw new Error('Please allow pop-ups to preview the file');
    const isDocx = blob.type.includes('wordprocessingml') || fileName.toLowerCase().endsWith('.docx');
    if (isDocx) {
      const result = await mammoth.convertToHtml({ arrayBuffer: await blob.arrayBuffer() });
      previewWindow.document.title = fileName;
      previewWindow.document.body.innerHTML = `<main style="font:16px sans-serif;max-width:800px;margin:40px auto;line-height:1.6">${result.value}</main>`;
      return;
    }
    const objectUrl = URL.createObjectURL(blob);
    previewWindow.location.href = objectUrl;
    setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
  };

  const handleDownload = async () => {
    if (!shareData?.accessAllowed || shareData.status !== 'active') return;

    setDownloading(true);
    setError('');
    try {
      const { blob } = await downloadShare(accessCode.trim());
      downloadBlob(blob, shareData.fileName || 'shared-file');
      setShareData((current) => current && current.remainingDownloads !== null
        ? { ...current, remainingDownloads: Math.max(current.remainingDownloads - 1, 0) }
        : current);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setDownloading(false);
    }
  };

  const handlePreview = async () => {
    if (!shareData?.accessAllowed || shareData.status !== 'active') return;
    setPreviewing(true);
    setError('');
    try {
      const blob = await viewShare(accessCode.trim());
      const mimeType = blob.type || 'application/octet-stream';
      if (mimeType.includes('wordprocessingml') || shareData.fileName.toLowerCase().endsWith('.docx')) {
        const arrayBuffer = await blob.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        setPreview({ type: 'docx', html: result.value });
      } else {
        setPreview({ type: 'url', url: URL.createObjectURL(blob), mimeType });
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setPreviewing(false);
    }
  };

  const hasRemainingDownloads = shareData?.remainingDownloads === null || shareData?.remainingDownloads > 0;

  return (
    <div className="min-h-screen bg-[#FAFBFF] text-[#1A1D27] font-sans relative overflow-x-hidden" style={{ backgroundImage: 'linear-gradient(#f0f0f5 1px, transparent 1px), linear-gradient(90deg, #f0f0f5 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      <header className="px-8 py-6 max-w-[1400px] mx-auto">
        <div className="flex items-center"><div className="w-2.5 h-2.5 bg-black rounded-full mr-2" /><span className="font-bold text-lg tracking-tight">VaultX</span></div>
      </header>

      <main className="max-w-xl mx-auto px-6 pb-16">
        <div className="flex items-start mb-8">
          <button onClick={onBack} className="mt-1 mr-4 flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 bg-white shadow-sm"><ArrowLeft className="w-4 h-4 text-gray-700" /></button>
          <div><h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-1">Receive Secure File</h1><p className="text-gray-500">Enter the 6-digit code from the sender.</p></div>
        </div>

        <section className="bg-white rounded-3xl p-8 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100">
          <form onSubmit={handleAccess}>
            <label className="block text-sm font-bold text-gray-900 mb-2" htmlFor="share-code">Share code</label>
            <div className="relative">
              <Key className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input id="share-code" type="text" inputMode="numeric" maxLength={6} placeholder="000000" className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 text-lg tracking-[0.35em] focus:outline-none focus:border-gray-400" value={accessCode} onChange={(event) => setAccessCode(event.target.value.replace(/\D/g, ''))} />
            </div>
            <button type="submit" disabled={loading} className="w-full mt-4 bg-[#1A1D27] hover:bg-black text-white py-3.5 rounded-full font-bold text-sm disabled:opacity-50">{loading ? 'Finding file...' : 'Find File'}</button>
          </form>

          {error && <p className="text-center text-sm text-red-600 mt-4">{error}</p>}

          {shareData && (
            <div className="mt-8 border-t border-gray-100 pt-8">
              <div className="rounded-2xl bg-[#FAFCF0] border border-[#C2D742] p-5 text-center">
                <FileText className="w-8 h-8 mx-auto mb-2 text-gray-700" />
                <h2 className="font-bold text-gray-900 break-all">{shareData.fileName || 'Shared file'}</h2>
                {shareData.size > 0 && <p className="text-sm text-gray-500 mt-1">{(shareData.size / (1024 * 1024)).toFixed(2)} MB</p>}
                <p className="text-xs text-gray-500 mt-2">Expires: {new Date(shareData.expiresAt).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-3 mt-5 text-sm text-gray-600"><ShieldCheck className="w-5 h-5 text-gray-700" /><span>{shareData.deliveryMode === 'view' ? 'View only' : shareData.maxDownloads === null ? 'Unlimited downloads' : `${shareData.remainingDownloads} download(s) remaining`}</span></div>
              {shareData.status !== 'active' ? <p className="text-red-600 text-sm mt-5">This share is no longer available.</p> : !shareData.accessAllowed ? <p className="text-red-600 text-sm mt-5">Sign in with an authorized email to view this file.</p> : shareData.deliveryMode === 'view' ? <><button onClick={handlePreview} disabled={previewing} className="w-full mt-5 bg-[#E5F876] hover:bg-[#d4ec55] text-black py-3.5 rounded-full font-bold text-sm disabled:opacity-50">{previewing ? 'Opening preview...' : 'View File'}</button>{preview?.type === 'url' && <iframe title="File preview" src={preview.url} className="w-full h-[500px] mt-5 rounded-xl border border-gray-200" />}{preview?.type === 'docx' && <div className="prose max-w-none mt-5 p-5 rounded-xl border border-gray-200 bg-white" dangerouslySetInnerHTML={{ __html: preview.html }} />}</> : <button onClick={handleDownload} disabled={downloading || !hasRemainingDownloads} className="w-full mt-5 bg-[#E5F876] hover:bg-[#d4ec55] text-black py-3.5 rounded-full font-bold text-sm flex items-center justify-center disabled:opacity-50"><Download className="w-4 h-4 mr-2" />{downloading ? 'Downloading...' : hasRemainingDownloads ? 'Download File' : 'Download Limit Reached'}</button>}
            </div>
          )}

          {!shareData && !error && <div className="text-center mt-8 text-gray-500 text-sm"><Lock className="w-8 h-8 mx-auto mb-2 text-gray-300" />Your shared file details will appear here.</div>}
        </section>
      </main>
    </div>
  );
};

export default ReceiveFilePage;
