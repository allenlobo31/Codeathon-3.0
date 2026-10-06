import React, { useState } from 'react';
import { 
  ArrowLeft, Lock, FileText, User, Calendar, Clock, Download, Eye, ShieldCheck, Mail, ArrowRight, Key, Shield, HelpCircle, EyeOff, CheckCircle2
} from 'lucide-react';

const ReceiveFilePage = () => {
  const [accessCode, setAccessCode] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const onBack = () => {
    window.location.href = '/';
  };

  const handleAccess = () => {
    // Functional mock for accessing the file
    if (accessCode && password) {
      alert("Accessing secure file...");
    }
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
                  <div className="w-12 h-12 bg-[#FF3B30] rounded-xl flex items-center justify-center shadow-sm">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-400 text-[15px] italic">No file selected</h3>
                    <p className="text-xs text-gray-400 mt-0.5">-- MB</p>
                  </div>
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

                {/* Password */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Enter Password <span className="font-normal text-gray-500">(if required)</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Enter password" 
                      className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-10 py-3.5 text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-shadow"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Access Button */}
                <div className="pt-2">
                  <button 
                    onClick={handleAccess}
                    className="w-full bg-[#1A1D27] hover:bg-black text-white py-3.5 px-2 rounded-full font-bold text-sm flex items-center justify-between transition-colors shadow-md relative"
                  >
                    <div className="flex-1 text-center pr-8 pl-12">
                      Access File
                    </div>
                    <div className="w-9 h-9 bg-[#E5F876] rounded-full flex items-center justify-center mr-1 text-black flex-shrink-0 absolute right-1">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>
                </div>

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

            <div className="space-y-6 mb-8">
              
              <div className="flex items-start gap-5">
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center flex-shrink-0 text-gray-600 bg-[#FAFAFA]">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">Shared by</span>
                  <p className="font-bold text-gray-900 text-sm">Anush Sharma</p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center flex-shrink-0 text-gray-600 bg-[#FAFAFA]">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">Shared on</span>
                  <p className="font-bold text-gray-900 text-sm">Oct 6, 2026</p>
                  <p className="text-xs text-gray-500 mt-0.5">12:37 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center flex-shrink-0 text-gray-600 bg-[#FAFAFA]">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">Expires in</span>
                  <p className="font-bold text-gray-900 text-sm">24 hours</p>
                  <p className="text-xs font-bold text-[#84c311] mt-0.5">23h 42m 18s</p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center flex-shrink-0 text-gray-600 bg-[#FAFAFA]">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">Download limit</span>
                  <p className="font-bold text-gray-900 text-sm">3 downloads</p>
                  <p className="text-xs text-gray-500 mt-0.5">0 / 3 used</p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center flex-shrink-0 text-gray-600 bg-[#FAFAFA]">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">Permission</span>
                  <p className="font-bold text-gray-900 text-sm">View Only</p>
                  <p className="text-xs text-gray-500 mt-0.5">Open in secure viewer</p>
                </div>
              </div>
            </div>



          </div>
        </div>

      </main>
    </div>
  );
};

export default ReceiveFilePage;
