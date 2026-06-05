import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Brain, FileCheck, BarChart3, Globe, ArrowRight, CheckCircle,
  Star, Zap, Shield, Clock, Award, ChevronRight, Sparkles
} from 'lucide-react'

const FEATURES = [
  {
    icon: Brain,
    gradient: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50',
    title: 'AI Esse Tahlili',
    desc: 'Gemini AI esseyingizni 3 darajada baholaydi — jiddiy xatolar 🔴, tavsiyalar 🟡, kuchli tomonlar 🟢 bilan belgilaydi.',
  },
  {
    icon: FileCheck,
    gradient: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50',
    title: 'Hujjatlar Checklist',
    desc: "Har bir grant yoki universitet uchun zarur hujjatlar to'liq ro'yxati. PDF va DOCX fayllarni to'g'ridan-to'g'ri yuklang.",
  },
  {
    icon: BarChart3,
    gradient: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
    title: 'Mos Kelish Darajasi',
    desc: "GPA, IELTS, tajriba va esse asosida tanlangan dasturga qanchalik mos kelishingizni 0–100% ko'rsatadi.",
  },
  {
    icon: Globe,
    gradient: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50',
    title: '7+ Xalqaro Dastur',
    desc: 'Fulbright, Chevening, Erasmus+, DAAD, MIT, NUS, KAIST — eng nufuzli grantlar va universitetlar bitta platformada.',
  },
]

const PROGRAMS = [
  { flag: '🇺🇸', name: 'Fulbright', country: 'AQSh' },
  { flag: '🇬🇧', name: 'Chevening', country: 'Britaniya' },
  { flag: '🇪🇺', name: 'Erasmus+', country: 'Yevropa' },
  { flag: '🇩🇪', name: 'DAAD', country: 'Germaniya' },
  { flag: '🏛️', name: 'MIT PhD', country: 'AQSh' },
  { flag: '🇸🇬', name: 'NUS', country: 'Singapur' },
  { flag: '🇰🇷', name: 'KAIST', country: 'Koreya' },
]

const STEPS = [
  { n: '1', icon: Globe, title: "Dastur tanlang", desc: "7+ xalqaro grant va universitetdan o'zingizga mosini toping" },
  { n: '2', icon: Brain, title: "Esse tahlil qiling", desc: "Motivatsion xatingizni kiriting — AI har bir jumlani tahlil qiladi" },
  { n: '3', icon: FileCheck, title: "Hujjat tayyorlang", desc: "Checklist asosida barcha hujjatlarni to'plab yuboring" },
]

const STATS = [
  { value: '7+', label: 'Xalqaro dastur' },
  { value: 'AI', label: 'Esse tahlili' },
  { value: '3', label: 'Baholash darajasi' },
  { value: '5', label: 'Bepul kredit' },
]

export default function LandingPage() {
  useEffect(() => { document.title = 'Admitly — Xalqaro grantlarga ariza' }, [])
  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">

      {/* ── Navbar ─────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="text-base font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Admitly
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login" className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50">
              Kirish
            </Link>
            <Link to="/register" className="px-4 py-1.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:opacity-90 transition-opacity shadow-sm shadow-blue-200">
              Boshlash →
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative pt-20 pb-24 px-6 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-100 rounded-full blur-3xl opacity-50 pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-700 text-xs font-semibold px-4 py-2 rounded-full mb-8 shadow-sm">
            <Zap size={12} className="text-blue-500" />
            O'zbekiston talabalariga maxsus · Bepul boshlang
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Xalqaro grantlarga{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                AI bilan
              </span>
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 300 12" fill="none">
                <path d="M2 9 Q75 2 150 9 Q225 16 298 9" stroke="url(#u)" strokeWidth="3" strokeLinecap="round" fill="none"/>
                <defs><linearGradient id="u" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#3b82f6"/><stop offset="100%" stopColor="#7c3aed"/></linearGradient></defs>
              </svg>
            </span>
            {' '}tayyorlaning
          </h1>

          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Esseyingizni tahlil qiling, hujjatlar ro'yxatini boshqaring va
            <strong className="text-gray-700"> Fulbright, Chevening, Erasmus+ </strong>
            kabi grantlarga muvaffaqiyatli ariza bering.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <Link to="/register" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-white font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition-opacity shadow-lg shadow-blue-200 text-sm">
              Bepul boshlash <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors text-sm">
              Hisobga kirish
            </Link>
          </div>

          {/* Mini proof */}
          <div className="flex items-center justify-center gap-1 text-xs text-gray-400">
            <Shield size={12} className="text-green-500" /> Bepul 5 kredit &nbsp;·&nbsp;
            <Clock size={12} /> 30 soniyada ro'yxatdan o'tish &nbsp;·&nbsp;
            Kredit karta shart emas
          </div>
        </div>

        {/* Mock UI preview */}
        <div className="relative max-w-4xl mx-auto mt-14">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Fake browser bar */}
            <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 bg-white rounded-md h-6 mx-4 border border-gray-200 flex items-center px-3">
                <span className="text-xs text-gray-400">admitly.uz/essay</span>
              </div>
            </div>
            {/* Mock content */}
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1.5">
                  <div className="h-3 w-48 bg-gray-200 rounded animate-pulse" />
                  <div className="h-2.5 w-32 bg-gray-100 rounded animate-pulse" />
                </div>
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-green-200">
                  78
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[['🔴', '3', 'Jiddiy'], ['🟡', '5', 'Tavsiya'], ['🟢', '8', 'Kuchli']].map(([e, n, l]) => (
                  <div key={l} className="bg-gray-50 rounded-lg p-2.5 text-center">
                    <div className="text-lg">{e}</div>
                    <div className="text-lg font-bold text-gray-800">{n}</div>
                    <div className="text-xs text-gray-500">{l}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {['My academic journey began...', '...demonstrated leadership through...', '...research experience at'].map((t, i) => (
                  <div key={i} className={`text-xs px-3 py-2 rounded-lg border ${
                    i === 0 ? 'bg-red-50 border-red-200 text-red-700'
                    : i === 1 ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-yellow-50 border-yellow-200 text-yellow-700'
                  }`}>{t} <span className="opacity-50">...</span></div>
                ))}
              </div>
            </div>
          </div>
          {/* Glow */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-100/30 to-indigo-100/20 rounded-3xl blur-xl scale-105" />
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────── */}
      <section className="py-10 bg-gradient-to-r from-blue-600 to-indigo-600 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-white text-center">
          {STATS.map(({ value, label }) => (
            <div key={label}>
              <div className="text-3xl font-extrabold">{value}</div>
              <div className="text-blue-200 text-xs mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────── */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-2">Xususiyatlar</p>
            <h2 className="text-3xl font-bold text-gray-900">Nima uchun Admitly?</h2>
            <p className="text-gray-500 mt-2 max-w-lg mx-auto text-sm">
              Hujjat tayyorlashning har bir bosqichi bitta aqlli platformada
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map(({ icon: Icon, gradient, bg, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-sm`}>
                  <Icon size={20} className="text-white" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-2">Jarayon</p>
            <h2 className="text-3xl font-bold text-gray-900">3 qadamda natijaga</h2>
          </div>
          <div className="relative">
            {/* Connector line */}
            <div className="hidden sm:block absolute top-8 left-[16.5%] right-[16.5%] h-0.5 bg-gradient-to-r from-blue-200 via-indigo-200 to-violet-200" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
              {STEPS.map(({ n, icon: Icon, title, desc }) => (
                <div key={n} className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 mb-4 relative z-10">
                    <Icon size={26} className="text-white" />
                  </div>
                  <div className="w-6 h-6 bg-white border-2 border-blue-300 rounded-full flex items-center justify-center text-xs font-bold text-blue-600 mb-3 -mt-2 z-20 relative">
                    {n}
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">{title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Programs ───────────────────────────────────────── */}
      <section className="py-16 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-widest mb-2">Dasturlar</p>
            <h2 className="text-3xl font-bold text-gray-900">Jahonning eng nufuzli grantlari</h2>
            <p className="text-gray-500 mt-2 text-sm">Ro'yxatdan o'ting va batafsil ma'lumot oling</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {PROGRAMS.slice(0, 4).map(({ flag, name, country }) => (
              <div key={name} className="bg-white border border-gray-200 rounded-2xl p-4 text-center hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
                <div className="text-3xl mb-2">{flag}</div>
                <p className="text-sm font-semibold text-gray-900">{name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{country}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3 max-w-xl mx-auto mb-8">
            {PROGRAMS.slice(4).map(({ flag, name, country }) => (
              <div key={name} className="bg-white border border-gray-200 rounded-2xl p-4 text-center hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
                <div className="text-3xl mb-2">{flag}</div>
                <p className="text-sm font-semibold text-gray-900">{name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{country}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link to="/register" className="inline-flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:underline">
              Ro'yxatdan o'ting va batafsil ko'ring <ChevronRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonial ────────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-12 text-white text-center shadow-2xl shadow-blue-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative">
              <div className="flex justify-center gap-1 mb-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <blockquote className="text-lg sm:text-xl font-medium leading-relaxed mb-6">
                "Admitly yordamida esseyimdagi 8 ta kamchilikni topdim va Fulbright uchun arizamni
                to'liq tayyorladim. AI tahlili juda aniq — har bir jumlaga izoh beradi!"
              </blockquote>
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold">D</div>
                <div className="text-left">
                  <p className="font-semibold text-sm">Dilnoza Toshmatova</p>
                  <p className="text-blue-200 text-xs">Toshkent davlat texnika universiteti</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────── */}
      <section className="py-20 px-6 text-center bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-200">
            <Sparkles size={28} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Bugun boshlang</h2>
          <p className="text-gray-500 text-sm mb-8">
            5 ta bepul kredit · 30 soniyada ro'yxatdan o'tish · Kredit karta shart emas
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <Link to="/register" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-white font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition-opacity shadow-lg shadow-blue-200 text-sm">
              Bepul ro'yxatdan o'tish <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-white transition-colors text-sm">
              Kirish
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-5 text-xs text-gray-400">
            {['Bepul 5 kredit', 'AI esse tahlili', '7+ xalqaro dastur', 'Hujjatlar checklist'].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle size={13} className="text-green-500" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <Sparkles size={12} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-700">Admitly</span>
          </div>
          <p className="text-xs text-gray-400">© 2026 Admitly · O'zbekiston talabalariga xalqaro imkoniyatlar</p>
          <div className="flex gap-4 text-xs text-gray-400">
            <Link to="/login" className="hover:text-blue-600 transition-colors">Kirish</Link>
            <Link to="/register" className="hover:text-blue-600 transition-colors">Ro'yxatdan o'tish</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
