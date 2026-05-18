import Link from 'next/link';
import {
  BookOpen,
  Users,
  ClipboardList,
  BarChart3,
  Zap,
  Shield,
  Star,
  ArrowRight,
  CheckCircle,
  GraduationCap,
} from 'lucide-react';

const FEATURES = [
  {
    icon: BookOpen,
    title: 'Smart Classrooms',
    desc: 'Create and manage virtual classrooms with a unique join code system. Stream announcements, share resources, and keep everything organized.',
    color: 'text-violet-500',
    bg: 'bg-violet-500/10',
  },
  {
    icon: ClipboardList,
    title: 'Assignment Management',
    desc: 'Post assignments with deadlines, attach files, and track submissions in real-time. Students get notified instantly.',
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10',
  },
  {
    icon: BarChart3,
    title: 'Grade & Analytics',
    desc: 'Review submissions, assign grades, and add personalized feedback. Students can track their progress over time.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Zap,
    title: 'Real-time Updates',
    desc: 'Get instant notifications for new assignments, grades, and announcements. Stay in the loop without refreshing.',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    icon: Shield,
    title: 'Secure by Design',
    desc: 'JWT authentication, role-based access, and encrypted passwords keep your data safe at all times.',
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
  },
  {
    icon: Users,
    title: 'People Management',
    desc: 'Manage students in each classroom, view profiles, and keep track of who joined and when.',
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
  },
];

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'Computer Science Student',
    college: 'IIT Delhi',
    text: 'Classora completely replaced our need for email chains. Assignments are clear, deadlines are visible, and grades come back fast.',
    rating: 5,
  },
  {
    name: 'Prof. Arjun Mehta',
    role: 'Associate Professor',
    college: 'BITS Pilani',
    text: 'I\'ve tried many tools. Classora is the cleanest and most intuitive. My students adapted in minutes, not days.',
    rating: 5,
  },
  {
    name: 'Zara Khan',
    role: 'MBA Student',
    college: 'IIM Bangalore',
    text: 'The progress tracking feature keeps me accountable. I always know exactly where I stand in every course.',
    rating: 5,
  },
];

const STATS = [
  { value: '50K+', label: 'Students' },
  { value: '3K+', label: 'Educators' },
  { value: '200K+', label: 'Assignments' },
  { value: '99.9%', label: 'Uptime' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#04040f] text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#04040f]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">Classora</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-white/60 hover:text-white transition-colors">Features</a>
              <a href="#testimonials" className="text-sm text-white/60 hover:text-white transition-colors">Testimonials</a>
              <a href="#stats" className="text-sm text-white/60 hover:text-white transition-colors">Stats</a>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-medium text-white/70 hover:text-white transition-colors px-3 py-1.5"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="text-sm font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/25"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-[300px] h-[300px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm text-white/70 mb-8">
            <Zap className="w-3.5 h-3.5 text-violet-400" />
            Modern classroom for the next generation
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-6">
            Learn without{' '}
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              limits.
            </span>
            <br />
            Teach without{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              friction.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            Classora brings students and educators together in a fast, clean, and modern platform.
            Create classes, post assignments, and track progress — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/signup"
              id="cta-primary"
              className="group flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 hover:shadow-2xl hover:shadow-violet-500/30 hover:-translate-y-0.5"
            >
              Start for free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 text-white/70 hover:text-white font-medium px-8 py-3.5 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-200 hover:bg-white/5"
            >
              Sign in to your account
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-6 mt-12 flex-wrap">
            {['No credit card', 'Free forever plan', 'Setup in 2 minutes'].map((item) => (
              <div key={item} className="flex items-center gap-1.5 text-sm text-white/50">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-16 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-white/50 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block text-xs font-semibold uppercase tracking-widest text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full mb-4">
              Features
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything you need to run a great classroom
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Built for modern education — fast, intuitive, and packed with features that actually matter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl border border-white/5 bg-white/2 hover:bg-white/5 hover:border-white/10 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-10 h-10 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-5 h-5 ${feature.color}`} />
                </div>
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8 bg-white/2">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block text-xs font-semibold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full mb-4">
              Testimonials
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Loved by students & teachers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="p-6 rounded-2xl border border-white/5 bg-[#08081a] hover:border-white/10 transition-all duration-300"
              >
                <div className="flex mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-xs font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs text-white/40">{t.role} · {t.college}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative p-10 sm:p-16 rounded-3xl border border-white/10 bg-gradient-to-br from-violet-600/20 to-indigo-600/10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-transparent" />
            <div className="relative">
              <h2 className="text-3xl sm:text-5xl font-bold mb-4">
                Ready to transform your classroom?
              </h2>
              <p className="text-white/60 mb-8 text-lg">
                Join thousands of students and teachers already using Classora.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-white text-[#04040f] font-bold px-8 py-3.5 rounded-xl hover:bg-white/90 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
              >
                Get started for free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <GraduationCap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold">Classora</span>
          </div>
          <p className="text-sm text-white/30">
            © {new Date().getFullYear()} Classora. Built for learners, by learners.
          </p>
          <div className="flex gap-6">
            <Link href="/login" className="text-sm text-white/40 hover:text-white/70 transition-colors">Sign in</Link>
            <Link href="/signup" className="text-sm text-white/40 hover:text-white/70 transition-colors">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
