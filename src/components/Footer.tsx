import { Brain, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900/50 backdrop-blur-xl border-t border-slate-700/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg text-white font-medium">سامانه آزمون</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              سامانه جامع برگزاری آزمون‌های آنلاین و ارزیابی دانشجویان با امکانات پیشرفته و تحلیل SWOT شخصی
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg text-white font-medium mb-4">دسترسی سریع</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">
                  بعدا
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">
                  اضافه
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">
                  خواهد
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">
                  شد
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg text-white font-medium mb-4">اطلاعات تماس</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Brain />
                <span>.M</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail className="w-4 h-4 text-purple-400" />
                <span>m.pourghaffar@iau.ir</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="w-4 h-4 text-purple-400" />
                <span dir="ltr">@MPHXQ</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-purple-400 mt-1" />
                <span>ارومیه، ۳ کیاومتری جاده سلماس،دانشگاه آزاد اسلامی</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-slate-700/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm text-center sm:text-right">
              © ساخته شده با 🤍 برای کلاس
            </p>
            <div className="flex items-center gap-4">

            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
