import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

const Home = () => {
  useEffect(() => {
    // UnicornStudio is loaded via index.html script tag — just initialise it
    if (window.UnicornStudio && !window.UnicornStudio.isInitialized) {
      window.UnicornStudio.init();
      window.UnicornStudio.isInitialized = true;
    }
  }, []);

  // Render the background via a portal so it's NOT inside a stacking context
  const background = ReactDOM.createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        saturate: '50%',
        opacity: 0.35,
        mixBlendMode: 'luminosity',
        maskImage: 'linear-gradient(to bottom, transparent, black 0%, black 70%, transparent)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 0%, black 70%, transparent)',
      }}
    >
      <div
        data-us-project="FixNvEwvWwbu3QX9qC3F"
        style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}
      />
    </div>,
    document.body
  );

  return (
    <>
      {background}

      <div
        className="antialiased min-h-screen flex flex-col font-light selection:bg-zinc-800 selection:text-zinc-50"
        style={{ fontFamily: "'Inter', sans-serif", backgroundColor: '#09090b', color: '#fafafa', position: 'relative', zIndex: 1 }}
      >
        {/* Navigation */}
        <header className="sticky top-0 z-50 w-full border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
          <div className="container mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <a href="#" className="text-xl font-medium tracking-tighter text-zinc-100 flex items-center gap-2">
                <iconify-icon icon="solar:terminal-bold" style={{ fontSize: '22px', color: '#34d399' }}></iconify-icon>
                TerminalDock
              </a>
            </div>

            <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
              <a href="#features" className="hover:text-zinc-100 transition-colors">Features</a>
              <a href="#trailer" className="hover:text-zinc-100 transition-colors">Trailer</a>
              <a href="#work" className="hover:text-zinc-100 transition-colors">Showcase</a>
              <a href="#about" className="hover:text-zinc-100 transition-colors">About</a>
              <a href="#contact" className="hover:text-zinc-100 transition-colors">Contact</a>
            </nav>

            <div className="flex items-center gap-4">
              <a href="#" className="hidden md:flex text-sm text-zinc-300 hover:text-zinc-100 transition-colors">Sign in</a>
              <a
                href="#contact"
                className="px-4 py-2 text-sm font-medium bg-zinc-100 text-zinc-950 rounded-md hover:bg-zinc-200 transition-colors"
              >
                Get Started
              </a>
            </div>
          </div>
        </header>

        <main className="flex-grow">
          {/* Hero Section */}
          <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
            <div className="container mx-auto px-6 text-center flex flex-col items-center">

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 text-xs text-zinc-400 mb-8 backdrop-blur-sm">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                Now in public beta — free to try
              </div>

              <h1 className="text-5xl md:text-7xl font-medium tracking-tight text-zinc-100 max-w-4xl leading-tight mb-6">
                Your terminal,<br />elevated and organized.
              </h1>

              <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-10 font-light">
                TerminalDock gives developers a beautifully organized, persistent workspace for their terminals — tabs, sessions, and commands all in one dock.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <a
                  href="#contact"
                  className="w-full sm:w-auto px-6 py-3 text-sm font-medium bg-zinc-100 text-zinc-950 rounded-md hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                >
                  Try for Free
                  <iconify-icon icon="solar:arrow-right-linear" style={{ strokeWidth: '1.5' }}></iconify-icon>
                </a>
                <a
                  href="#work"
                  className="w-full sm:w-auto px-6 py-3 text-sm font-medium bg-transparent border border-zinc-800 text-zinc-300 rounded-md hover:bg-zinc-900 hover:text-zinc-100 transition-colors flex items-center justify-center gap-2"
                >
                  See it in Action
                </a>
              </div>

              {/* Trust Logos */}
              <div className="mt-24 pt-10 border-t border-zinc-900 w-full max-w-5xl">
                <p className="text-xs text-zinc-500 mb-6 uppercase tracking-widest text-center">Loved by developers at</p>
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale">
                  <span className="text-xl font-medium tracking-tighter text-zinc-400 flex items-center gap-1"><iconify-icon icon="solar:code-bold"></iconify-icon> DEVCO</span>
                  <span className="text-xl font-medium tracking-tighter text-zinc-400 flex items-center gap-1"><iconify-icon icon="solar:server-bold"></iconify-icon> STACKR</span>
                  <span className="text-xl font-medium tracking-tighter text-zinc-400 flex items-center gap-1"><iconify-icon icon="solar:cloud-bold"></iconify-icon> NEBULA</span>
                  <span className="text-xl font-medium tracking-tighter text-zinc-400 flex items-center gap-1"><iconify-icon icon="solar:layers-bold"></iconify-icon> APEX</span>
                  <span className="text-xl font-medium tracking-tighter text-zinc-400 flex items-center gap-1 hidden md:flex"><iconify-icon icon="solar:shield-bold"></iconify-icon> NEXUS</span>
                </div>
              </div>
            </div>
          </section>

          {/* Trailer / Video Section */}
          <section className="py-20 md:py-28 relative overflow-hidden" id="trailer">
            <div className="container mx-auto px-6">
              {/* Section header */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 text-xs text-zinc-400 mb-6 backdrop-blur-sm">
                  <iconify-icon icon="solar:play-circle-bold" style={{ color: '#34d399', fontSize: '14px' }}></iconify-icon>
                  See it in action
                </div>
                <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-zinc-100 mb-4">
                  Watch the trailer
                </h2>
                <p className="text-zinc-400 max-w-xl mx-auto">
                  Get a first look at how TerminalDock transforms your workflow. One dock, infinite possibilities.
                </p>
              </div>

              {/* Video container */}
              <div className="relative max-w-4xl mx-auto">
                {/* Glow effect behind the video */}
                <div
                  className="absolute -inset-4 rounded-3xl blur-3xl opacity-20 pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse at center, #34d399 0%, transparent 70%)' }}
                ></div>

                {/* Video wrapper with border + glassmorphism */}
                <div className="relative rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl bg-zinc-950/50 backdrop-blur-sm">
                  {/* Top bar decoration */}
                  <div className="flex items-center gap-1.5 px-4 py-3 border-b border-zinc-800 bg-zinc-950/80">
                    <span className="w-3 h-3 rounded-full bg-zinc-700"></span>
                    <span className="w-3 h-3 rounded-full bg-zinc-700"></span>
                    <span className="w-3 h-3 rounded-full bg-zinc-700"></span>
                    <span className="ml-4 text-xs text-zinc-500 font-mono">terminal-dock — trailer.mp4</span>
                  </div>

                  <video
                    className="w-full aspect-video object-cover"
                    controls
                    playsInline
                    preload="metadata"
                    poster=""
                  >
                    <source src="/termian dock vid1.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>

                {/* Caption below */}
                <p className="text-center text-xs text-zinc-600 mt-4 font-mono">
                  TerminalDock v1.0 — Official Trailer
                </p>
              </div>
            </div>
          </section>

          {/* Metrics/Stats Section */}
          <section className="py-20 border-y border-zinc-900 bg-zinc-950/50">
            <div className="container mx-auto px-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-zinc-900">
                <div className="flex flex-col items-center text-center px-4">
                  <span className="text-4xl font-medium tracking-tight text-zinc-100 mb-2">12k+</span>
                  <span className="text-sm text-zinc-500">Active Developers</span>
                </div>
                <div className="flex flex-col items-center text-center px-4">
                  <span className="text-4xl font-medium tracking-tight text-zinc-100 mb-2">5M+</span>
                  <span className="text-sm text-zinc-500">Commands Docked</span>
                </div>
                <div className="flex flex-col items-center text-center px-4">
                  <span className="text-4xl font-medium tracking-tight text-zinc-100 mb-2">99.9%</span>
                  <span className="text-sm text-zinc-500">Uptime</span>
                </div>
                <div className="flex flex-col items-center text-center px-4">
                  <span className="text-4xl font-medium tracking-tight text-zinc-100 mb-2">4.9★</span>
                  <span className="text-sm text-zinc-500">Avg. Rating</span>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-24 md:py-32" id="features">
            <div className="container mx-auto px-6">
              <div className="max-w-3xl mb-16">
                <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-zinc-100 mb-4">Built for how developers actually work</h2>
                <p className="text-lg text-zinc-400">Every feature is designed to keep you in flow — less context switching, more shipping.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Feature Card 1 */}
                <div className="group p-8 rounded-2xl border border-zinc-900 bg-zinc-950 hover:bg-zinc-900/50 transition-all duration-300">
                  <div className="h-12 w-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 mb-6 group-hover:text-zinc-50 group-hover:border-zinc-700 transition-colors">
                    <iconify-icon icon="solar:terminal-bold-duotone" style={{ strokeWidth: '1.5', fontSize: '24px' }}></iconify-icon>
                  </div>
                  <h3 className="text-xl font-medium tracking-tight text-zinc-100 mb-3">Persistent Session Dock</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                    Never lose your terminal sessions again. Dock them, name them, and resume exactly where you left off — even after a reboot.
                  </p>
                  <ul className="space-y-2 text-sm text-zinc-500">
                    <li className="flex items-center gap-2"><iconify-icon icon="solar:check-circle-linear" className="text-zinc-700"></iconify-icon> Auto-restore sessions</li>
                    <li className="flex items-center gap-2"><iconify-icon icon="solar:check-circle-linear" className="text-zinc-700"></iconify-icon> Named workspaces</li>
                    <li className="flex items-center gap-2"><iconify-icon icon="solar:check-circle-linear" className="text-zinc-700"></iconify-icon> Multi-project support</li>
                  </ul>
                </div>

                {/* Feature Card 2 */}
                <div className="group p-8 rounded-2xl border border-zinc-900 bg-zinc-950 hover:bg-zinc-900/50 transition-all duration-300">
                  <div className="h-12 w-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 mb-6 group-hover:text-zinc-50 group-hover:border-zinc-700 transition-colors">
                    <iconify-icon icon="solar:command-bold-duotone" style={{ strokeWidth: '1.5', fontSize: '24px' }}></iconify-icon>
                  </div>
                  <h3 className="text-xl font-medium tracking-tight text-zinc-100 mb-3">Smart Command Palette</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                    Search, pin and re-run your most-used commands with a single keystroke. Your personal command library, always within reach.
                  </p>
                  <ul className="space-y-2 text-sm text-zinc-500">
                    <li className="flex items-center gap-2"><iconify-icon icon="solar:check-circle-linear" className="text-zinc-700"></iconify-icon> Command history search</li>
                    <li className="flex items-center gap-2"><iconify-icon icon="solar:check-circle-linear" className="text-zinc-700"></iconify-icon> Pinnable favourites</li>
                    <li className="flex items-center gap-2"><iconify-icon icon="solar:check-circle-linear" className="text-zinc-700"></iconify-icon> Fuzzy match</li>
                  </ul>
                </div>

                {/* Feature Card 3 */}
                <div className="group p-8 rounded-2xl border border-zinc-900 bg-zinc-950 hover:bg-zinc-900/50 transition-all duration-300">
                  <div className="h-12 w-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 mb-6 group-hover:text-zinc-50 group-hover:border-zinc-700 transition-colors">
                    <iconify-icon icon="solar:share-bold-duotone" style={{ strokeWidth: '1.5', fontSize: '24px' }}></iconify-icon>
                  </div>
                  <h3 className="text-xl font-medium tracking-tight text-zinc-100 mb-3">Team Sync & Sharing</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                    Share workspace configs and command libraries with your team. Onboard new devs in minutes, not days.
                  </p>
                  <ul className="space-y-2 text-sm text-zinc-500">
                    <li className="flex items-center gap-2"><iconify-icon icon="solar:check-circle-linear" className="text-zinc-700"></iconify-icon> Config export/import</li>
                    <li className="flex items-center gap-2"><iconify-icon icon="solar:check-circle-linear" className="text-zinc-700"></iconify-icon> Team workspaces</li>
                    <li className="flex items-center gap-2"><iconify-icon icon="solar:check-circle-linear" className="text-zinc-700"></iconify-icon> Role permissions</li>
                  </ul>
                </div>

                {/* Feature Card 4 */}
                <div className="group p-8 rounded-2xl border border-zinc-900 bg-zinc-950 hover:bg-zinc-900/50 transition-all duration-300">
                  <div className="h-12 w-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 mb-6 group-hover:text-zinc-50 group-hover:border-zinc-700 transition-colors">
                    <iconify-icon icon="solar:settings-bold-duotone" style={{ strokeWidth: '1.5', fontSize: '24px' }}></iconify-icon>
                  </div>
                  <h3 className="text-xl font-medium tracking-tight text-zinc-100 mb-3">Extensible & Scriptable</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                    Hook into your existing workflow with plugins, webhooks and a full scripting API. Automate the boring stuff.
                  </p>
                  <ul className="space-y-2 text-sm text-zinc-500">
                    <li className="flex items-center gap-2"><iconify-icon icon="solar:check-circle-linear" className="text-zinc-700"></iconify-icon> Plugin ecosystem</li>
                    <li className="flex items-center gap-2"><iconify-icon icon="solar:check-circle-linear" className="text-zinc-700"></iconify-icon> REST & Webhook API</li>
                    <li className="flex items-center gap-2"><iconify-icon icon="solar:check-circle-linear" className="text-zinc-700"></iconify-icon> Custom scripts</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Showcase / Case Studies Section */}
          <section id="work" className="py-24 border-t border-zinc-900">
            <div className="container mx-auto px-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                <div className="max-w-2xl">
                  <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-zinc-100 mb-4">Real productivity gains</h2>
                  <p className="text-lg text-zinc-400">See what developers are saying about switching to TerminalDock.</p>
                </div>
                <a href="#" className="text-sm text-zinc-300 hover:text-zinc-100 flex items-center gap-2 transition-colors pb-2">
                  Read all stories
                  <iconify-icon icon="solar:arrow-right-linear"></iconify-icon>
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Story 1 */}
                <div className="group relative overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950 aspect-[4/3] flex flex-col justify-between p-8 hover:border-zinc-700 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10 flex items-center gap-2 text-zinc-500 text-sm">
                    <iconify-icon icon="solar:code-square-linear"></iconify-icon> Startup Engineering
                  </div>
                  <div className="relative z-10">
                    <div className="text-4xl font-medium tracking-tight text-emerald-400 mb-2">3× faster</div>
                    <h3 className="text-lg font-medium text-zinc-100 mb-2">Onboarding New Devs</h3>
                    <p className="text-sm text-zinc-400">Shared workspace configs cut onboarding from 3 days to under an hour for a 20-person eng team.</p>
                  </div>
                </div>

                {/* Story 2 */}
                <div className="group relative overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950 aspect-[4/3] flex flex-col justify-between p-8 hover:border-zinc-700 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10 flex items-center gap-2 text-zinc-500 text-sm">
                    <iconify-icon icon="solar:server-square-linear"></iconify-icon> Freelance Dev
                  </div>
                  <div className="relative z-10">
                    <div className="text-4xl font-medium tracking-tight text-blue-400 mb-2">80%</div>
                    <h3 className="text-lg font-medium text-zinc-100 mb-2">Less Context Switching</h3>
                    <p className="text-sm text-zinc-400">Managing 6 client projects simultaneously with zero confusion — each with its own persistent dock.</p>
                  </div>
                </div>

                {/* Story 3 */}
                <div className="group relative overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950 aspect-[4/3] flex flex-col justify-between p-8 hover:border-zinc-700 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10 flex items-center gap-2 text-zinc-500 text-sm">
                    <iconify-icon icon="solar:settings-linear"></iconify-icon> DevOps Team
                  </div>
                  <div className="relative z-10">
                    <div className="text-4xl font-medium tracking-tight text-purple-400 mb-2">40h</div>
                    <h3 className="text-lg font-medium text-zinc-100 mb-2">Saved Per Month</h3>
                    <p className="text-sm text-zinc-400">Automated recurring server commands with scripted docks — no more manual SSH juggling.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA / Contact Section */}
          <section id="contact" className="py-24 md:py-32 relative overflow-hidden">
            <div className="absolute inset-0 bg-zinc-900/20 border-y border-zinc-800/50"></div>
            <div className="container mx-auto px-6 relative z-10">
              <div className="max-w-4xl mx-auto rounded-3xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl p-8 md:p-12 shadow-2xl flex flex-col md:flex-row gap-12">

                <div className="flex-1">
                  <h2 className="text-3xl font-medium tracking-tight text-zinc-100 mb-4">Ready to dock in?</h2>
                  <p className="text-sm text-zinc-400 mb-8">Join thousands of developers who've upgraded their terminal workflow. Tell us about your setup — we'll help you get started fast.</p>

                  <div className="space-y-4 text-sm text-zinc-300">
                    <div className="flex items-start gap-3">
                      <iconify-icon icon="solar:check-circle-linear" className="text-zinc-500 mt-0.5 text-base"></iconify-icon>
                      <span>Free tier available — no credit card required</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <iconify-icon icon="solar:check-circle-linear" className="text-zinc-500 mt-0.5 text-base"></iconify-icon>
                      <span>Works with macOS, Linux &amp; Windows WSL</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <iconify-icon icon="solar:check-circle-linear" className="text-zinc-500 mt-0.5 text-base"></iconify-icon>
                      <span>Integrates with your existing shell &amp; dotfiles</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 w-full">
                  <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-400 px-1">Name</label>
                        <input type="text" placeholder="Jane Dev" className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 focus:bg-zinc-900 transition-colors" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-400 px-1">Work Email</label>
                        <input type="email" placeholder="jane@company.com" className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 focus:bg-zinc-900 transition-colors" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-zinc-400 px-1">Your Setup</label>
                      <div className="relative">
                        <select defaultValue="" className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-100 appearance-none focus:outline-none focus:border-zinc-600 focus:bg-zinc-900 transition-colors cursor-pointer">
                          <option value="" disabled className="text-zinc-600">Select your primary OS / shell...</option>
                          <option value="mac-zsh">macOS + zsh</option>
                          <option value="linux-bash">Linux + bash</option>
                          <option value="wsl">Windows + WSL</option>
                          <option value="other">Other</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-zinc-500">
                          <iconify-icon icon="solar:alt-arrow-down-linear"></iconify-icon>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-zinc-400 px-1">Tell us about your workflow</label>
                      <textarea rows="3" placeholder="How many projects do you juggle? What's your biggest terminal pain point?" className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 focus:bg-zinc-900 transition-colors resize-none"></textarea>
                    </div>

                    <button type="submit" className="w-full py-3 mt-2 text-sm font-medium bg-zinc-100 text-zinc-950 rounded-lg hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2">
                      Get Early Access
                      <iconify-icon icon="solar:plain-2-linear" style={{ strokeWidth: '1.5' }}></iconify-icon>
                    </button>
                  </form>
                </div>

              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-zinc-900 bg-zinc-950 pt-16 pb-8">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">

              <div className="md:col-span-2">
                <a href="#" className="text-xl font-medium tracking-tighter text-zinc-100 flex items-center gap-2 mb-4">
                  <iconify-icon icon="solar:terminal-bold" style={{ fontSize: '20px', color: '#34d399' }}></iconify-icon>
                  TerminalDock
                </a>
                <p className="text-sm text-zinc-400 max-w-sm mb-6">
                  A developer productivity tool for organizing terminal sessions, commands, and workflows into one seamless dock.
                </p>
                <div className="flex items-center gap-4 text-zinc-500">
                  <a href="#" className="hover:text-zinc-100 transition-colors"><iconify-icon icon="solar:letter-linear" className="text-xl"></iconify-icon></a>
                  <a href="#" className="hover:text-zinc-100 transition-colors"><iconify-icon icon="solar:github-linear" className="text-xl"></iconify-icon></a>
                  <a href="#" className="hover:text-zinc-100 transition-colors"><iconify-icon icon="solar:twitter-linear" className="text-xl"></iconify-icon></a>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-zinc-100 mb-4">Product</h4>
                <ul className="space-y-3 text-sm text-zinc-400">
                  <li><a href="#" className="hover:text-zinc-100 transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-zinc-100 transition-colors">Changelog</a></li>
                  <li><a href="#" className="hover:text-zinc-100 transition-colors">Roadmap</a></li>
                  <li><a href="#" className="hover:text-zinc-100 transition-colors">Pricing</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium text-zinc-100 mb-4">Resources</h4>
                <ul className="space-y-3 text-sm text-zinc-400">
                  <li><a href="#" className="hover:text-zinc-100 transition-colors">Documentation</a></li>
                  <li><a href="#" className="hover:text-zinc-100 transition-colors">API Reference</a></li>
                  <li><a href="#" className="hover:text-zinc-100 transition-colors">Community</a></li>
                  <li><a href="#" className="hover:text-zinc-100 transition-colors">Blog</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium text-zinc-100 mb-4">Legal</h4>
                <ul className="space-y-3 text-sm text-zinc-400">
                  <li><a href="#" className="hover:text-zinc-100 transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-zinc-100 transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-zinc-100 transition-colors">Cookie Policy</a></li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
              <p>© 2024 TerminalDock. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <span>Built for developers, by developers.</span>
                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500/50"></span>
                <span>All systems operational</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Home;
