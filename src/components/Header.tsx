import { Brain, Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export function Header({ onMenuClick, showMenuButton = false }: HeaderProps) {
  return (
    <header className="relative top-0 left-0 right-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl text-white font-medium">سامانه آزمونه</h1>
              {/* <p className="text-xs text-gray-400">.</p>
              <p className="text-xs text-gray-400">.</p>
              <p className="text-xs text-gray-400">.</p> */}
              <p></p>
            </div>
          </div>

          {/* Menu Button for Mobile */}
          {showMenuButton && (
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-white" />
            </button>
          )}

          {/* Right Side Info */}
          <div className="hidden sm:flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-400">دانشگاه آزاد اسلامی واحد ارومیه</p>
              <p className="text-xs text-gray-500">Islamic Azad University Urmia Branch</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
