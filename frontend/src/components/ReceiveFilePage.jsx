import React, { useState } from 'react';
import { 
  ArrowLeft, Lock, FileText, User, Calendar, Clock, Download, Eye, ShieldCheck, Mail, ArrowRight, Key, Shield, HelpCircle, EyeOff, CheckCircle2
} from 'lucide-react';
import { getShareInfo, downloadUrl } from '../api';

const ReceiveFilePage = () => {
  const [accessCode, setAccessCode] = useState('');
<<<<<<< Updated upstream
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fileReceived, setFileReceived] = useState(false);
  const [shareData, setShareData] = useState(null);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
=======
  const [error, setError] = useState('');
>>>>>>> Stashed changes

  const onBack = () => {
    window.location.href = '/';
  };

<<<<<<< Updated upstream
  const handleAccess = async () => {
    if (!accessCode) return setError('Please enter an access code');
    setError(null);
    try {
      const data = await getShareInfo(accessCode);
      setShareData(data);
      setFileReceived(true);
    } catch (err) {
      setError(err.message || 'Failed to retrieve file info');
=======
  const handleAccess = (event) => {
    event.preventDefault();
    const code = accessCode.trim();
    if (!/^\d{6}$/.test(code)) {
      setError('Enter the 6-digit code from the sender');
      return;
>>>>>>> Stashed changes
    }
    window.location.href = `/s/${code}`;
  };

  const handleDownload = () => {
    if (!shareData || !shareData.accessAllowed) return;
    setDownloading(true);
    
    // In a real app we might fetch the blob and trigger a download to handle auth.
    // For now we use the downloadUrl direct link which works if public.
    window.location.href = downloadUrl(accessCode);
    
    setTimeout(() => {
      setDownloading(false);
      // Optimistically update remaining downloads
      if (shareData.remainingDownloads !== null && shareData.remainingDownloads > 0) {
        setShareData(prev => ({...prev, remainingDownloads: prev.remainingDownloads - 1}));
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAFBFF] text-[#1A1D27] font-sans selection:bg-[#E2F764] relative overflow-x-hidden" 
         style={{ backgroundImage: 'linear-gradient(#f0f0f5 1px, transparent 1px), linear-gradient(90deg, #f0f0f5 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      
      {/* Header */}
      <header className="px-8 py-6 flex items-center justify-between max-w-[1400px] mx-auto">
        <div className="flex items-center">
          <div className="w-2.5 h-2.5 bg-black rounded-full mr-2"></div>
          <span className="font-bold text-lg tracking-tight">VaultX</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1200px] mx-auto px-6 md:px-8 pb-16 flex flex-col lg:flex-row gap-10">
        
        {/* LEFT COLUMN */}
        <div className="flex-grow lg:w-[65%] flex flex-col gap-8">
          
          {/* Page Title Area */}
          <div className="flex items-start mb-2">
            <button onClick={onBack} className="mt-1 mr-4 flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors shadow-sm shrink-0">
              <ArrowLeft className="w-4 h-4 text-gray-700" />
            </button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-1">
                Receive Secure File
              </h1>
              <p className="text-gray-500">Access a file shared with you</p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            
            {/* SHARED FILE CARD */}
            <div className="bg-white rounded-3xl p-8 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900">Shared File</h2>
                <p className="text-sm text-gray-500">This file has been securely shared with you. Please verify the access details and enter the required information to open it.</p>
              </div>

              <div className="border border-gray-100 bg-[#FAFAFA] rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm bg-gray-200">
                    <FileText className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-400 text-[15px] italic">Enter a share code</h3>
                    <p className="text-xs text-gray-400 mt-0.5">The file details will appear next</p>
                  </div>
<<<<<<< Updated upstream
                  {fileReceived && shareData ? (
                    <div>
                      <h3 className="font-bold text-gray-900 text-[15px]">{shareData.fileName || 'Unknown File'}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {shareData.size ? (shareData.size / (1024 * 1024)).toFixed(2) + ' MB' : '-- MB'} 
                      </p>
                    </div>
                  ) : (
                    <div>
                      <h3 className="font-bold text-gray-400 text-[15px] italic">No file selected</h3>
                      <p className="text-xs text-gray-400 mt-0.5">-- MB</p>
                    </div>
                  )}
=======
>>>>>>> Stashed changes
                </div>
                <div className="bg-[#E5F876] bg-opacity-70 text-black px-3 py-1.5 rounded-full text-xs font-semibold flex items-center shadow-sm">
                  <Lock className="w-3.5 h-3.5 mr-1.5" />
                  Encrypted File
                </div>
              </div>
            </div>

            {/* ACCESS VERIFICATION CARD */}
            <div className="bg-white rounded-3xl p-8 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900">Access Verification</h2>
                <p className="text-sm text-gray-500">This file is protected. Enter the required details to access it.</p>
              </div>

              <div className="space-y-5">
                {/* Access Code */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Enter Access Code <span className="font-normal text-gray-500">(if required)</span>
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      placeholder="Enter share code" 
                      className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-10 py-3.5 text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-shadow"
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value)}
                    />
                    <HelpCircle className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer hover:text-gray-600" />
                  </div>
                </div>

                {/* Access Button */}
                <div className="pt-2">
                  <button 
                    onClick={handleAccess}
                    className="w-full bg-[#1A1D27] hover:bg-black text-white py-3.5 px-2 rounded-full font-bold text-sm flex items-center justify-between transition-colors shadow-md relative"
                  >
                    <div className="flex-1 text-center pr-8 pl-12">
                      Find File
                    </div>
                    <div className="w-9 h-9 bg-[#E5F876] rounded-full flex items-center justify-center mr-1 text-black flex-shrink-0 absolute right-1">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>
                  {error && <p className="text-center text-sm text-red-600 mt-2 font-medium">{error}</p>}
                </div>
                {error && <p className="text-center text-sm text-red-600">{error}</p>}

                {/* Divider */}
                <div className="flex items-center justify-center my-6">
                  <div className="flex-grow h-px bg-gray-100"></div>
                  <span className="px-4 text-xs font-semibold text-gray-400 tracking-wider">OR</span>
                  <div className="flex-grow h-px bg-gray-100"></div>
                </div>

                {/* Need Access */}
                <div className="bg-[#F8F9FC] rounded-2xl p-5 flex items-center justify-between">
                  <div className="flex items-start gap-4 pr-4">
                    <div className="w-10 h-10 bg-[#E8EBF5] text-[#5465FF] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">Need access?</h4>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">If you are not an authorized user, you can request access from the sender.</p>
                    </div>
                  </div>
                  <button className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-full text-xs font-bold transition-colors shadow-sm flex-shrink-0 whitespace-nowrap">
                    Request Access
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN - SHARE INFORMATION */}
        <div className="lg:w-[35%] pt-12 lg:pt-0">
          <div className="bg-white rounded-3xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 lg:sticky lg:top-10">
            
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900">Share Information</h2>
              <p className="text-sm text-gray-500 mt-1">Details about this shared file.</p>
            </div>

<<<<<<< Updated upstream
            {fileReceived && shareData ? (
              <div className="space-y-6 mb-8">
                
=======
            <div className="space-y-6 mb-8">
>>>>>>> Stashed changes
                <div className="flex items-start gap-5">
                  <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center flex-shrink-0 text-gray-600 bg-[#FAFAFA]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
<<<<<<< Updated upstream
                    <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">Status</span>
                    <p className={`font-bold text-sm ${shareData.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                      {shareData.status === 'active' ? 'Active' : 'Expired / Revoked'}
                    </p>
=======
                    <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">Shared by</span>
                    <p className="font-bold text-gray-500 text-sm">Shown after code lookup</p>
>>>>>>> Stashed changes
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center flex-shrink-0 text-gray-600 bg-[#FAFAFA]">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
<<<<<<< Updated upstream
                    <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">Expires on</span>
                    <p className="font-bold text-gray-900 text-sm">
                      {new Date(shareData.expiresAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(shareData.expiresAt).toLocaleTimeString()}
                    </p>
=======
                    <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">Shared on</span>
                    <p className="font-bold text-gray-500 text-sm">Shown after code lookup</p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center flex-shrink-0 text-gray-600 bg-[#FAFAFA]">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">Expires in</span>
                    <p className="font-bold text-gray-500 text-sm">Shown after code lookup</p>
>>>>>>> Stashed changes
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center flex-shrink-0 text-gray-600 bg-[#FAFAFA]">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">Download limit</span>
<<<<<<< Updated upstream
                    <p className="font-bold text-gray-900 text-sm">
                      {shareData.maxDownloads === null ? 'Unlimited downloads' : `${shareData.maxDownloads} downloads`}
                    </p>
                    {shareData.maxDownloads !== null && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {shareData.maxDownloads - shareData.remainingDownloads} / {shareData.maxDownloads} used
                      </p>
                    )}
=======
                    <p className="font-bold text-gray-500 text-sm">Shown after code lookup</p>
>>>>>>> Stashed changes
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center flex-shrink-0 text-gray-600 bg-[#FAFAFA]">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">Permission</span>
<<<<<<< Updated upstream
                    <p className="font-bold text-gray-900 text-sm">
                      {shareData.maxDownloads === null ? 'Download Allowed' : (shareData.maxDownloads === 1 ? 'Download Once' : 'Download Allowed')}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {shareData.requiresLogin ? 'Login required' : 'Open access'}
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={handleDownload}
                    disabled={downloading || shareData.status !== 'active' || (shareData.maxDownloads !== null && shareData.remainingDownloads <= 0)}
                    className="w-full bg-[#E5F876] hover:bg-[#d4ec55] text-black py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {downloading ? 'Downloading...' : 'Download File'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center border-2 border-dashed border-gray-100 rounded-2xl bg-[#FAFAFA]">
                <ShieldCheck className="w-10 h-10 text-gray-300 mb-3" />
                <p className="text-sm font-medium text-gray-500">Enter a valid access code to view share details and download limits.</p>
              </div>
            )}
=======
                    <p className="font-bold text-gray-500 text-sm">Shown after code lookup</p>
                  </div>
                </div>
            </div>
>>>>>>> Stashed changes



          </div>
        </div>

      </main>
    </div>
  );
};

export default ReceiveFilePage;
