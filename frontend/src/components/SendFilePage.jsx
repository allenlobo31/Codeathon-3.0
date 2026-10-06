import React, { useState } from 'react';
import { 
  ArrowLeft, CloudUpload, X, Plus, ChevronDown, Eye, Download, 
  Lock, CheckCircle2, QrCode, FileText, Check, Circle, Mail, User, Info, ArrowRight, ShieldCheck
} from 'lucide-react';

const SendFilePage = () => {
  const [file, setFile] = useState(null);
  const [recipients, setRecipients] = useState([]);
  const [emailInput, setEmailInput] = useState('');
  
  const [expiryHours, setExpiryHours] = useState('24');
  const [expiryMinutes, setExpiryMinutes] = useState('0');
  const [noExpiry, setNoExpiry] = useState(false);
  const [downloadLimit, setDownloadLimit] = useState(3);
  const [deliveryMode, setDeliveryMode] = useState('view');
  const [advancedSecurityOpen, setAdvancedSecurityOpen] = useState(false);
  
  const handleAddRecipient = () => {
    if (emailInput) {
      const name = emailInput.split('@')[0];
      setRecipients([...recipients, { name: name.charAt(0).toUpperCase() + name.slice(1), email: emailInput }]);
      setEmailInput('');
    }
  };

  const removeRecipient = (email) => {
    setRecipients(recipients.filter(r => r.email !== email));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      setFile({ name: droppedFile.name, size: (droppedFile.size / (1024*1024)).toFixed(2) + ' MB' });
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile({ name: selectedFile.name, size: (selectedFile.size / (1024*1024)).toFixed(2) + ' MB' });
    }
  };

  const onBack = () => {
    window.location.href = '/';
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
          <div className="flex justify-between items-start mb-2">
            <div className="flex gap-4 items-start">
              <button onClick={onBack} className="mt-1 flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors shadow-sm">
                <ArrowLeft className="w-4 h-4 text-gray-700" />
              </button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-1 flex items-center gap-4">
                  Send Secure File
                </h1>
                <p className="text-gray-500">Share a file with controlled access</p>
              </div>
            </div>
            <div className="bg-[#E5F876] text-black px-4 py-1.5 rounded-full text-sm font-semibold flex items-center shadow-sm">
              <Lock className="w-3.5 h-3.5 mr-2" />
              Secure
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col gap-10">
            {/* FILE SECTION */}
            <section>
              <div className="mb-4">
                <h2 className="text-lg font-bold">File</h2>
                <p className="text-sm text-gray-500">Upload the file you want to share securely.</p>
              </div>

              {/* Upload Area */}
              <div 
                className="border border-dashed border-gray-300 rounded-2xl p-8 text-center bg-[#FAFAFA] relative"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {!file ? (
                  <>
                    <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 border border-gray-100 text-gray-700">
                      <CloudUpload className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Upload your file</h3>
                    <p className="text-sm text-gray-500 mb-6">Drag & drop your file here or <span className="font-semibold text-gray-700">browse</span></p>
                    
                    <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} />
                    <label htmlFor="file-upload" className="inline-block bg-[#1A1D27] hover:bg-black text-white font-medium py-2.5 px-6 rounded-full cursor-pointer transition-colors text-sm">
                      Browse Files
                    </label>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 border border-gray-100 text-gray-700">
                      <CloudUpload className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Upload your file</h3>
                    <p className="text-sm text-gray-500 mb-6">Drag & drop your file here or <span className="font-semibold text-gray-700">browse</span></p>
                    
                    <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} />
                    <label htmlFor="file-upload" className="inline-block bg-[#1A1D27] hover:bg-black text-white font-medium py-2.5 px-6 rounded-full cursor-pointer transition-colors text-sm">
                      Browse Files
                    </label>

                    <div className="mt-6 flex items-center justify-between bg-white p-3 px-4 rounded-xl shadow-sm border border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-red-50 text-red-500 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 fill-current opacity-20 absolute" />
                          <span className="text-[10px] font-bold z-10">PDF</span>
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-sm text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{file.size}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center text-green-600 text-xs font-medium">
                          <CheckCircle2 className="w-4 h-4 mr-1.5 fill-green-600 text-white" />
                          Uploaded
                        </div>
                        <button onClick={() => setFile(null)} className="text-gray-400 hover:text-gray-600">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </section>

            <div className="w-full h-px bg-gray-100"></div>

            {/* RECIPIENTS SECTION */}
            <section>
              <div className="mb-4">
                <h2 className="text-lg font-bold">Recipients</h2>
                <p className="text-sm text-gray-500">Only selected users will be able to access this file.</p>
              </div>
              
              <div className="flex gap-3 relative mb-4">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input 
                    type="email" 
                    placeholder="Enter recipient email" 
                    className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-shadow"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddRecipient()}
                  />
                </div>
                <button 
                  onClick={handleAddRecipient}
                  className="w-12 h-12 bg-[#E5F876] text-black rounded-xl flex items-center justify-center hover:bg-[#d4ec55] transition-colors flex-shrink-0"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {recipients.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {recipients.map((recipient) => (
                    <div key={recipient.email} className="inline-flex items-center bg-[#F7F7F9] border border-gray-100 rounded-xl px-2 py-1.5 pr-3">
                      <div className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center mr-3 text-gray-500">
                        <User className="w-4 h-4" />
                      </div>
                      <div className="mr-4">
                        <p className="text-sm font-semibold text-gray-900 leading-tight">{recipient.name}</p>
                        <p className="text-[11px] text-gray-500">{recipient.email}</p>
                      </div>
                      <button onClick={() => removeRecipient(recipient.email)} className="text-gray-400 hover:text-gray-700 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <div className="w-full h-px bg-gray-100"></div>

            {/* ACCESS SETTINGS */}
            <section>
              <h2 className="text-lg font-bold mb-5">Access Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Expiry */}
                <div>
                  <h3 className="font-semibold text-sm text-gray-900 mb-1">Expiry</h3>
                  <p className="text-xs text-gray-500 mb-3">Choose when this share stops working.</p>
                  
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2 items-center">
                      <div className="flex-1">
                        <input 
                          type="number" 
                          min="0"
                          placeholder="Hrs"
                          disabled={noExpiry}
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:border-gray-400 disabled:opacity-50 disabled:bg-gray-50"
                          value={expiryHours}
                          onChange={(e) => setExpiryHours(e.target.value)}
                        />
                      </div>
                      <span className="text-gray-400 font-bold">:</span>
                      <div className="flex-1">
                        <input 
                          type="number" 
                          min="0"
                          max="59"
                          placeholder="Mins"
                          disabled={noExpiry}
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:border-gray-400 disabled:opacity-50 disabled:bg-gray-50"
                          value={expiryMinutes}
                          onChange={(e) => setExpiryMinutes(e.target.value)}
                        />
                      </div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer mt-1">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-[#84c311] border-gray-300 rounded focus:ring-[#84c311]" 
                        checked={noExpiry}
                        onChange={(e) => setNoExpiry(e.target.checked)}
                      />
                      <span className="text-xs text-gray-600 font-medium">No expiry (None)</span>
                    </label>
                  </div>
                </div>

                {/* Download Limit */}
                <div>
                  <h3 className="font-semibold text-sm text-gray-900 mb-1">Download limit</h3>
                  <p className="text-xs text-gray-500 mb-3">Maximum number of downloads allowed.</p>
                  
                  <div>
                    <div className="relative w-24">
                      <input 
                        type="number" 
                        min="1"
                        className="w-full bg-white border border-gray-200 rounded-xl pl-4 pr-8 py-2.5 text-sm font-medium text-gray-700 focus:outline-none focus:border-gray-400 appearance-none m-0"
                        value={downloadLimit}
                        onChange={(e) => setDownloadLimit(parseInt(e.target.value) || 1)}
                        style={{ MozAppearance: 'textfield' }}
                      />
                      <div className="absolute right-2 top-0 bottom-0 flex flex-col justify-center">
                        <button onClick={() => setDownloadLimit(d => d + 1)} className="text-gray-400 hover:text-gray-700 h-3 flex items-end">
                          <ChevronDown className="w-3 h-3 rotate-180" />
                        </button>
                        <button onClick={() => setDownloadLimit(d => Math.max(1, d - 1))} className="text-gray-400 hover:text-gray-700 h-3 flex items-start">
                          <ChevronDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{downloadLimit} downloads allowed</p>
                  </div>
                </div>
              </div>

              {/* Delivery Mode */}
              <div>
                <h3 className="font-semibold text-sm text-gray-900 mb-1">Delivery mode</h3>
                <p className="text-xs text-gray-500 mb-4">Control how the recipient can use the file.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div 
                    onClick={() => setDeliveryMode('view')}
                    className={`cursor-pointer rounded-xl p-4 border transition-all flex items-start gap-3
                      ${deliveryMode === 'view' ? 'border-[#C2D742] bg-[#FAFCF0]' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                  >
                    <Eye className="w-5 h-5 text-gray-700 flex-shrink-0 mt-0.5" />
                    <div className="flex-grow">
                      <h4 className="font-semibold text-sm text-gray-900">View Only</h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">Open in secure viewer</p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 ${deliveryMode === 'view' ? 'border-gray-900' : 'border-gray-300'}`}>
                      {deliveryMode === 'view' && <div className="w-2 h-2 rounded-full bg-gray-900"></div>}
                    </div>
                  </div>
                  
                  <div 
                    onClick={() => setDeliveryMode('download_once')}
                    className={`cursor-pointer rounded-xl p-4 border transition-all flex items-start gap-3
                      ${deliveryMode === 'download_once' ? 'border-[#C2D742] bg-[#FAFCF0]' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                  >
                    <Download className="w-5 h-5 text-gray-700 flex-shrink-0 mt-0.5" />
                    <div className="flex-grow">
                      <h4 className="font-semibold text-sm text-gray-900">Download Once</h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">Allow one download</p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 ${deliveryMode === 'download_once' ? 'border-gray-900' : 'border-gray-300'}`}>
                      {deliveryMode === 'download_once' && <div className="w-2 h-2 rounded-full bg-gray-900"></div>}
                    </div>
                  </div>
                  
                  <div 
                    onClick={() => setDeliveryMode('download_allowed')}
                    className={`cursor-pointer rounded-xl p-4 border transition-all flex items-start gap-3
                      ${deliveryMode === 'download_allowed' ? 'border-[#C2D742] bg-[#FAFCF0]' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                  >
                    <Download className="w-5 h-5 text-gray-700 flex-shrink-0 mt-0.5" />
                    <div className="flex-grow">
                      <h4 className="font-semibold text-sm text-gray-900 leading-tight">Download Allowed</h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">Allow downloads until limit</p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 ${deliveryMode === 'download_allowed' ? 'border-gray-900' : 'border-gray-300'}`}>
                      {deliveryMode === 'download_allowed' && <div className="w-2 h-2 rounded-full bg-gray-900"></div>}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ADVANCED SECURITY */}
            <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button 
                onClick={() => setAdvancedSecurityOpen(!advancedSecurityOpen)}
                className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <Lock className="w-4 h-4 text-gray-700 mr-3" />
                  <h2 className="text-sm font-bold text-gray-900">Advanced Security</h2>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${advancedSecurityOpen ? 'rotate-180' : ''}`} />
              </button>
            </section>

          </div>
        </div>

        {/* RIGHT COLUMN - SECURITY SUMMARY */}
        <div className="lg:w-[35%] pt-12 lg:pt-0">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900">Security Summary</h2>
            <p className="text-sm text-gray-500">Review your settings before sharing.</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100">
            
            {/* Confidential Badge */}
            <div className="bg-[#E5F876] bg-opacity-40 rounded-2xl p-4 flex items-start gap-4 mb-6">
              <div className="mt-0.5">
                <Lock className="w-5 h-5 text-black" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900 tracking-wide uppercase">Confidential</h4>
                <p className="text-xs text-gray-700 mt-0.5">Your file is protected with advanced security.</p>
              </div>
            </div>

            <div className="space-y-6 mb-8 px-2">
              {/* Summary Items */}
              <div className="flex items-start gap-4">
                <FileText className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                <div className="w-24 flex-shrink-0">
                  <span className="text-gray-900 font-semibold text-sm">File</span>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">{file ? file.name : '-'}</p>
                  <p className="text-xs text-gray-500">{file ? file.size : ''}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <User className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                <div className="w-24 flex-shrink-0">
                  <span className="text-gray-900 font-semibold text-sm">Recipients</span>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{recipients.length} recipients</p>
                  <p className="text-xs text-gray-500 truncate">{recipients.map(r => r.email).join(', ')}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0 text-gray-600">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <div className="w-24 flex-shrink-0">
                  <span className="text-gray-900 font-semibold text-sm">Expires</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {noExpiry ? 'None' : `${expiryHours || 0}h ${expiryMinutes || 0}m`}
                  </p>
                  <p className="text-xs text-gray-500">Oct 7, 2026 • 12:37 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Download className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                <div className="w-24 flex-shrink-0">
                  <span className="text-gray-900 font-semibold text-sm">Downloads</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{downloadLimit} allowed</p>
                  <p className="text-xs text-gray-500">0 / {downloadLimit} used</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Eye className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                <div className="w-24 flex-shrink-0">
                  <span className="text-gray-900 font-semibold text-sm">Permission</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {deliveryMode === 'view' ? 'View Only' : (deliveryMode === 'download_once' ? 'Download Once' : 'Download Allowed')}
                  </p>
                  <p className="text-xs text-gray-500">
                    {deliveryMode === 'view' ? 'Open in secure viewer' : (deliveryMode === 'download_once' ? 'Allow one download' : 'Allow downloads until limit')}
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-gray-100 mb-6"></div>

            {/* Actions */}
            <div>
              <button 
                className="w-full bg-[#1A1D27] hover:bg-black text-white py-3.5 px-2 rounded-full font-bold text-sm flex items-center justify-between transition-colors shadow-md relative"
              >
                <div className="flex-1 text-center pr-8 pl-12">
                  Generate Secure Link
                </div>
                <div className="w-9 h-9 bg-[#E5F876] rounded-full flex items-center justify-center mr-1 text-black flex-shrink-0 absolute right-1">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
              
              <p className="text-center text-xs text-gray-500 mt-4 px-2">
                Your file will be securely shared with the selected recipients.
              </p>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
};

export default SendFilePage;
