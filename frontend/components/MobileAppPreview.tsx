import { X, Wifi, Battery, Signal } from 'lucide-react';

interface MobileAppPreviewProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileAppPreview({ isOpen, onClose }: MobileAppPreviewProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute -top-10 -right-2 p-2 text-white hover:text-gray-300 transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>
        
        {/* iPhone Frame */}
        <div className="relative w-[375px] h-[812px] bg-black rounded-[55px] p-2 shadow-2xl">
          {/* iPhone Screen */}
          <div className="w-full h-full bg-white rounded-[45px] overflow-hidden relative">
            {/* iPhone Notch */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[154px] h-[34px] bg-black rounded-b-3xl z-10"></div>
            
            {/* Status Bar */}
            <div className="relative z-20 flex justify-between items-center px-8 pt-3 pb-2 bg-white">
              <div className="text-sm font-semibold text-black">9:41</div>
              <div className="flex items-center space-x-1">
                <Signal className="w-3 h-3 text-black" />
                <Wifi className="w-3 h-3 text-black" />
                <Battery className="w-5 h-3 text-black" />
              </div>
            </div>
            
            {/* App Content */}
            <div className="h-full bg-gradient-to-br from-violet-50 to-purple-50 px-4 pb-8">
              {/* App Header */}
              <div className="flex items-center justify-center py-6">
                <div className="w-12 h-12 bg-[#7B61FF] rounded-2xl flex items-center justify-center shadow-lg">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 text-white">
                    <path fill="currentColor" d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                  </svg>
                </div>
              </div>
              
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Nava AI</h1>
                <p className="text-gray-600">Your AI Assistant</p>
              </div>
              
              {/* Quick Actions */}
              <div className="space-y-4 mb-8">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#7B61FF]/10 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#7B61FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">New Task</h3>
                      <p className="text-sm text-gray-600">Create something amazing</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#7B61FF]/10 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#7B61FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Recent Projects</h3>
                      <p className="text-sm text-gray-600">View your work</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#7B61FF]/10 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#7B61FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Settings</h3>
                      <p className="text-sm text-gray-600">Customize your experience</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Bottom Navigation */}
              <div className="absolute bottom-8 left-4 right-4">
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-2 shadow-lg border border-white/50">
                  <div className="flex justify-around">
                    <button className="flex-1 flex flex-col items-center py-3 px-4 rounded-xl bg-[#7B61FF]/10">
                      <svg className="w-5 h-5 text-[#7B61FF] mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m7 7 10 10M7 17 17 7" />
                      </svg>
                      <span className="text-xs text-[#7B61FF] font-medium">Home</span>
                    </button>
                    <button className="flex-1 flex flex-col items-center py-3 px-4 rounded-xl">
                      <svg className="w-5 h-5 text-gray-500 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span className="text-xs text-gray-500">Search</span>
                    </button>
                    <button className="flex-1 flex flex-col items-center py-3 px-4 rounded-xl">
                      <svg className="w-5 h-5 text-gray-500 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-xs text-gray-500">Profile</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}