import React, { useEffect } from 'react';

const Home = () => {
  useEffect(() => {
    if (!window.UnicornStudio) {
      window.UnicornStudio = { isInitialized: false };
      const i = document.createElement("script");
      i.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js";
      i.onload = function() {
        if (!window.UnicornStudio.isInitialized) {
          window.UnicornStudio.init();
          window.UnicornStudio.isInitialized = true;
        }
      };
      (document.head || document.body).appendChild(i);
    } else if (window.UnicornStudio && window.UnicornStudio.init && !window.UnicornStudio.isInitialized) {
      window.UnicornStudio.init();
      window.UnicornStudio.isInitialized = true;
    }
  }, []);

  return (
    <div className="antialiased min-h-screen flex flex-col font-light selection:bg-zinc-800 selection:text-zinc-50 relative" style={{ fontFamily: "'Inter', sans-serif", backgroundColor: "#09090b", color: "#fafafa" }}>
      {/* Background (image) added by Aura */}
      <div 
        className="fixed top-0 w-full h-screen bg-cover bg-center -z-10" 
        style={{
          backgroundImage: 'url("https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/64c28d7e-2531-485b-8b49-c07d75acae5d_3840w.webp")',
          maskImage: 'linear-gradient(to bottom, transparent, black 0%, black 80%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 0%, black 80%, transparent)'
        }} 
        data-alpha-mask="80"
      ></div>

      <div 
        className="aura-background-component top-0 w-full h-screen -z-10 absolute" 
        data-alpha-mask="80" 
        style={{
          maskImage: 'linear-gradient(to bottom, transparent, black 0%, black 80%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 0%, black 80%, transparent)'
        }}
      >
        <div className="aura-background-component top-0 w-full -z-10 absolute h-full">
          <div data-us-project="tPmIIl0vKqHO9yqmtge2" className="absolute w-full h-full left-0 top-0 -z-10"></div>
        </div>
      </div>

      {/* Ambient Background Glow */}
      <div className="absolute top-0 inset-x-0 h-screen overflow-hidden -z-10 pointer-events-none flex justify-center">
          <div className="w-full max-w-lg aspect-square bg-zinc-800/20 rounded-full blur-3xl opacity-50 translate-y-[-50%]"></div>
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
          <div className="container mx-auto px-6 h-16 flex items-center justify-between">
              <div className="flex items-center gap-2">
                  <a href="#" className="text-xl font-medium tracking-tighter text-zinc-100 flex items-center gap-1">ImpossibleWEB</a>
              </div>
              
              <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
                  <a href="#services" className="hover:text-zinc-100 transition-colors">Services</a>
                  <a href="#work" className="hover:text-zinc-100 transition-colors">Work</a>
                  <a href="#about" className="hover:text-zinc-100 transition-colors">About</a>
                  <a href="#contact" className="hover:text-zinc-100 transition-colors">Contact</a>
              </nav>

              <div className="flex items-center gap-4">
                  <a href="#" className="hidden md:flex text-sm text-zinc-300 hover:text-zinc-100 transition-colors">Sign in</a>
                  <a href="#contact" className="px-4 py-2 text-sm font-medium bg-zinc-100 text-zinc-950 rounded-md hover:bg-zinc-200 transition-colors">
                      Start Project
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
                      Accepting new projects for Q4
                  </div>

                  <h1 className="text-5xl md:text-7xl font-medium tracking-tight text-zinc-100 max-w-4xl leading-tight mb-6">
                      We build digital experiences that drive measurable growth.
                  </h1>
                  
                  <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-10 font-light">
                      Premium web development, technical SEO, and workflow automation for modern e-commerce and fast-growing tech brands.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                      <a href="#contact" className="w-full sm:w-auto px-6 py-3 text-sm font-medium bg-zinc-100 text-zinc-950 rounded-md hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2">
                          Book Consultation
                          <iconify-icon icon="solar:arrow-right-linear" style={{ strokeWidth: "1.5" }}></iconify-icon>
                      </a>
                      <a href="#work" className="w-full sm:w-auto px-6 py-3 text-sm font-medium bg-transparent border border-zinc-800 text-zinc-300 rounded-md hover:bg-zinc-900 hover:text-zinc-100 transition-colors flex items-center justify-center gap-2">
                          View Portfolio
                      </a>
                  </div>

                  {/* Trust Logos (Abstracted) */}
                  <div className="mt-24 pt-10 border-t border-zinc-900 w-full max-w-5xl">
                      <p className="text-xs text-zinc-500 mb-6 uppercase tracking-widest text-center">Trusted by innovative teams</p>
                      <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale">
                          <span className="text-xl font-medium tracking-tighter text-zinc-400 flex items-center gap-1"><iconify-icon icon="solar:box-linear"></iconify-icon> ACME</span>
                          <span className="text-xl font-medium tracking-tighter text-zinc-400 flex items-center gap-1"><iconify-icon icon="solar:infinity-linear"></iconify-icon> GLOBAL</span>
                          <span className="text-xl font-medium tracking-tighter text-zinc-400 flex items-center gap-1"><iconify-icon icon="solar:planet-linear"></iconify-icon> SPHERE</span>
                          <span className="text-xl font-medium tracking-tighter text-zinc-400 flex items-center gap-1"><iconify-icon icon="solar:triangle-linear"></iconify-icon> APEX</span>
                          <span className="text-xl font-medium tracking-tighter text-zinc-400 flex items-center gap-1 hidden md:flex"><iconify-icon icon="solar:hexagon-linear"></iconify-icon> NEXUS</span>
                      </div>
                  </div>
              </div>
          </section>

          {/* Metrics/Stats Section */}
          <section className="py-20 border-y border-zinc-900 bg-zinc-950/50">
              <div className="container mx-auto px-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-zinc-900">
                      <div className="flex flex-col items-center text-center px-4">
                          <span className="text-4xl font-medium tracking-tight text-zinc-100 mb-2">120+</span>
                          <span className="text-sm text-zinc-500">Projects Delivered</span>
                      </div>
                      <div className="flex flex-col items-center text-center px-4">
                          <span className="text-4xl font-medium tracking-tight text-zinc-100 mb-2">$50M</span>
                          <span className="text-sm text-zinc-500">Revenue Generated</span>
                      </div>
                      <div className="flex flex-col items-center text-center px-4">
                          <span className="text-4xl font-medium tracking-tight text-zinc-100 mb-2">98%</span>
                          <span className="text-sm text-zinc-500">Client Retention</span>
                      </div>
                      <div className="flex flex-col items-center text-center px-4">
                          <span className="text-4xl font-medium tracking-tight text-zinc-100 mb-2">&lt;2</span>
                          <span className="text-sm text-zinc-500">Weeks to Launch</span>
                      </div>
                  </div>
              </div>
          </section>

          {/* Services Section */}
          <section className="py-24 md:py-32" id="services">
              <div className="container mx-auto px-6">
                  <div className="max-w-3xl mb-16">
                      <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-zinc-100 mb-4">Core capabilities</h2>
                      <p className="text-lg text-zinc-400">We focus on high-impact services that directly influence your bottom line. No fluff, just results.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Service Card 1 */}
                      <div className="group p-8 rounded-2xl border border-zinc-900 bg-zinc-950 hover:bg-zinc-900/50 transition-all duration-300">
                          <div className="h-12 w-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 mb-6 group-hover:text-zinc-50 group-hover:border-zinc-700 transition-colors">
                              <iconify-icon icon="solar:code-square-linear" style={{ strokeWidth: "1.5" }} className="text-2xl"></iconify-icon>
                          </div>
                          <h3 className="text-xl font-medium tracking-tight text-zinc-100 mb-3">Custom Web Development</h3>
                          <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                              Blazing fast, scalable applications built with Next.js, React, and modern serverless architectures tailored to your business logic.
                          </p>
                          <ul className="space-y-2 text-sm text-zinc-500">
                              <li className="flex items-center gap-2"><iconify-icon icon="solar:check-circle-linear" className="text-zinc-700"></iconify-icon> Headless Commerce</li>
                              <li className="flex items-center gap-2"><iconify-icon icon="solar:check-circle-linear" className="text-zinc-700"></iconify-icon> Web Applications</li>
                              <li className="flex items-center gap-2"><iconify-icon icon="solar:check-circle-linear" className="text-zinc-700"></iconify-icon> API Integration</li>
                          </ul>
                      </div>

                      {/* Service Card 2 */}
                      <div className="group p-8 rounded-2xl border border-zinc-900 bg-zinc-950 hover:bg-zinc-900/50 transition-all duration-300">
                          <div className="h-12 w-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 mb-6 group-hover:text-zinc-50 group-hover:border-zinc-700 transition-colors">
                              <iconify-icon icon="solar:document-text-linear" style={{ strokeWidth: "1.5" }} className="text-2xl"></iconify-icon>
                          </div>
                          <h3 className="text-xl font-medium tracking-tight text-zinc-100 mb-3">High-Converting Landing Pages</h3>
                          <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                              Pixel-perfect design meets conversion rate optimization. We build landing pages that turn ad clicks into loyal customers.
                          </p>
                          <ul className="space-y-2 text-sm text-zinc-500">
                              <li className="flex items-center gap-2"><iconify-icon icon="solar:check-circle-linear" className="text-zinc-700"></iconify-icon> A/B Testing Setup</li>
                              <li className="flex items-center gap-2"><iconify-icon icon="solar:check-circle-linear" className="text-zinc-700"></iconify-icon> Copywriting Support</li>
                              <li className="flex items-center gap-2"><iconify-icon icon="solar:check-circle-linear" className="text-zinc-700"></iconify-icon> Performance Audits</li>
                          </ul>
                      </div>

                      {/* Service Card 3 */}
                      <div className="group p-8 rounded-2xl border border-zinc-900 bg-zinc-950 hover:bg-zinc-900/50 transition-all duration-300">
                          <div className="h-12 w-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 mb-6 group-hover:text-zinc-50 group-hover:border-zinc-700 transition-colors">
                              <iconify-icon icon="solar:chart-square-linear" style={{ strokeWidth: "1.5" }} className="text-2xl"></iconify-icon>
                          </div>
                          <h3 className="text-xl font-medium tracking-tight text-zinc-100 mb-3">Technical SEO</h3>
                          <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                              Foundation-first search engine optimization. We fix technical debt, improve site speed, and structure data for maximum visibility.
                          </p>
                          <ul className="space-y-2 text-sm text-zinc-500">
                              <li className="flex items-center gap-2"><iconify-icon icon="solar:check-circle-linear" className="text-zinc-700"></iconify-icon> Core Web Vitals</li>
                              <li className="flex items-center gap-2"><iconify-icon icon="solar:check-circle-linear" className="text-zinc-700"></iconify-icon> Schema Markup</li>
                              <li className="flex items-center gap-2"><iconify-icon icon="solar:check-circle-linear" className="text-zinc-700"></iconify-icon> Crawlability Fixes</li>
                          </ul>
                      </div>

                      {/* Service Card 4 */}
                      <div className="group p-8 rounded-2xl border border-zinc-900 bg-zinc-950 hover:bg-zinc-900/50 transition-all duration-300">
                          <div className="h-12 w-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 mb-6 group-hover:text-zinc-50 group-hover:border-zinc-700 transition-colors">
                              <iconify-icon icon="solar:bolt-linear" style={{ strokeWidth: "1.5" }} className="text-2xl"></iconify-icon>
                          </div>
                          <h3 className="text-xl font-medium tracking-tight text-zinc-100 mb-3">Workflow Automation</h3>
                          <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                              Eliminate manual tasks. We design and implement robust automations using n8n and custom webhooks to streamline operations.
                          </p>
                          <ul className="space-y-2 text-sm text-zinc-500">
                              <li className="flex items-center gap-2"><iconify-icon icon="solar:check-circle-linear" className="text-zinc-700"></iconify-icon> CRM Syncing</li>
                              <li className="flex items-center gap-2"><iconify-icon icon="solar:check-circle-linear" className="text-zinc-700"></iconify-icon> Order Processing</li>
                              <li className="flex items-center gap-2"><iconify-icon icon="solar:check-circle-linear" className="text-zinc-700"></iconify-icon> Custom n8n Nodes</li>
                          </ul>
                      </div>
                  </div>
              </div>
          </section>

          {/* Case Studies / Credibility Section */}
          <section id="work" className="py-24 border-t border-zinc-900">
              <div className="container mx-auto px-6">
                  <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                      <div className="max-w-2xl">
                          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-zinc-100 mb-4">Proven results</h2>
                          <p className="text-lg text-zinc-400">We measure success by the impact we create. Here is how we've helped our clients scale.</p>
                      </div>
                      <a href="#" className="text-sm text-zinc-300 hover:text-zinc-100 flex items-center gap-2 transition-colors pb-2">
                          View all case studies
                          <iconify-icon icon="solar:arrow-right-linear"></iconify-icon>
                      </a>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Case Study 1 */}
                      <div className="group relative overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950 aspect-[4/3] flex flex-col justify-between p-8 hover:border-zinc-700 transition-colors">
                          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <div className="relative z-10 flex items-center gap-2 text-zinc-500 text-sm">
                              <iconify-icon icon="solar:shop-linear"></iconify-icon> E-commerce
                          </div>
                          <div className="relative z-10">
                              <div className="text-4xl font-medium tracking-tight text-emerald-400 mb-2">+45%</div>
                              <h3 className="text-lg font-medium text-zinc-100 mb-2">Conversion Rate Increase</h3>
                              <p className="text-sm text-zinc-400">Complete headless Shopify migration and checkout optimization for a D2C apparel brand.</p>
                          </div>
                      </div>

                      {/* Case Study 2 */}
                      <div className="group relative overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950 aspect-[4/3] flex flex-col justify-between p-8 hover:border-zinc-700 transition-colors">
                          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <div className="relative z-10 flex items-center gap-2 text-zinc-500 text-sm">
                              <iconify-icon icon="solar:server-square-linear"></iconify-icon> SaaS
                          </div>
                          <div className="relative z-10">
                              <div className="text-4xl font-medium tracking-tight text-blue-400 mb-2">2.5x</div>
                              <h3 className="text-lg font-medium text-zinc-100 mb-2">Organic Traffic Growth</h3>
                              <p className="text-sm text-zinc-400">Technical SEO overhaul and programmatic content generation structure implementation.</p>
                          </div>
                      </div>

                      {/* Case Study 3 */}
                      <div className="group relative overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950 aspect-[4/3] flex flex-col justify-between p-8 hover:border-zinc-700 transition-colors">
                          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <div className="relative z-10 flex items-center gap-2 text-zinc-500 text-sm">
                              <iconify-icon icon="solar:settings-linear"></iconify-icon> Logistics
                          </div>
                          <div className="relative z-10">
                              <div className="text-4xl font-medium tracking-tight text-purple-400 mb-2">120h</div>
                              <h3 className="text-lg font-medium text-zinc-100 mb-2">Saved Monthly</h3>
                              <p className="text-sm text-zinc-400">Custom n8n automation pipeline bridging legacy ERP systems with modern dispatch tools.</p>
                          </div>
                      </div>
                  </div>
              </div>
          </section>

          {/* Lead Capture / CTA Section */}
          <section id="contact" className="py-24 md:py-32 relative overflow-hidden">
              <div className="absolute inset-0 bg-zinc-900/20 border-y border-zinc-800/50"></div>
              <div className="container mx-auto px-6 relative z-10">
                  <div className="max-w-4xl mx-auto rounded-3xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl p-8 md:p-12 shadow-2xl flex flex-col md:flex-row gap-12">
                      
                      <div className="flex-1">
                          <h2 className="text-3xl font-medium tracking-tight text-zinc-100 mb-4">Ready to scale?</h2>
                          <p className="text-sm text-zinc-400 mb-8">Tell us about your project. We typically respond within 24 hours to schedule a discovery call and provide a detailed proposal.</p>
                          
                          <div className="space-y-4 text-sm text-zinc-300">
                              <div className="flex items-start gap-3">
                                  <iconify-icon icon="solar:check-circle-linear" className="text-zinc-500 mt-0.5 text-base"></iconify-icon>
                                  <span>Direct access to senior developers &amp; strategists</span>
                              </div>
                              <div className="flex items-start gap-3">
                                  <iconify-icon icon="solar:check-circle-linear" className="text-zinc-500 mt-0.5 text-base"></iconify-icon>
                                  <span>Transparent pricing and timeline estimates</span>
                              </div>
                              <div className="flex items-start gap-3">
                                  <iconify-icon icon="solar:check-circle-linear" className="text-zinc-500 mt-0.5 text-base"></iconify-icon>
                                  <span className="">No commitment required for initial consultation</span>
                              </div>
                          </div>
                      </div>

                      <div className="flex-1 w-full">
                          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="space-y-1.5">
                                      <label className="text-xs font-medium text-zinc-400 px-1">Name</label>
                                      <input type="text" placeholder="John Doe" className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 focus:bg-zinc-900 transition-colors" />
                                  </div>
                                  <div className="space-y-1.5">
                                      <label className="text-xs font-medium text-zinc-400 px-1">Work Email</label>
                                      <input type="email" placeholder="john@company.com" className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 focus:bg-zinc-900 transition-colors" />
                                  </div>
                              </div>
                              
                              <div className="space-y-1.5">
                                  <label className="text-xs font-medium text-zinc-400 px-1">Project Type</label>
                                  <div className="relative">
                                      <select defaultValue="" className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-100 appearance-none focus:outline-none focus:border-zinc-600 focus:bg-zinc-900 transition-colors cursor-pointer">
                                          <option value="" disabled className="text-zinc-600">Select an area of interest...</option>
                                          <option value="web">Web Development</option>
                                          <option value="seo">Technical SEO</option>
                                          <option value="automation">Workflow Automation</option>
                                          <option value="other">Other / General Inquiry</option>
                                      </select>
                                      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-zinc-500">
                                          <iconify-icon icon="solar:alt-arrow-down-linear"></iconify-icon>
                                      </div>
                                  </div>
                              </div>

                              <div className="space-y-1.5">
                                  <label className="text-xs font-medium text-zinc-400 px-1">Brief Details</label>
                                  <textarea rows="3" placeholder="Tell us about your goals and current challenges..." className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 focus:bg-zinc-900 transition-colors resize-none"></textarea>
                              </div>

                              <button type="submit" className="w-full py-3 mt-2 text-sm font-medium bg-zinc-100 text-zinc-950 rounded-lg hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2">
                                  Request Proposal
                                  <iconify-icon icon="solar:plain-2-linear" style={{ strokeWidth: "1.5" }}></iconify-icon>
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
                      <a href="#" className="text-xl font-medium tracking-tighter text-zinc-100 flex items-center gap-1 mb-4">
                          <iconify-icon icon="solar:layers-linear" style={{ strokeWidth: "1.5" }}></iconify-icon>
                          STDO.
                      </a>
                      <p className="text-sm text-zinc-400 max-w-sm mb-6">
                          A specialized digital agency focused on building high-performance web experiences, technical SEO, and business automation.
                      </p>
                      <div className="flex items-center gap-4 text-zinc-500">
                          <a href="#" className="hover:text-zinc-100 transition-colors"><iconify-icon icon="solar:letter-linear" className="text-xl"></iconify-icon></a>
                          <a href="#" className="hover:text-zinc-100 transition-colors"><iconify-icon icon="solar:map-point-linear" className="text-xl"></iconify-icon></a>
                      </div>
                  </div>

                  <div className="">
                      <h4 className="text-sm font-medium text-zinc-100 mb-4">Services</h4>
                      <ul className="space-y-3 text-sm text-zinc-400">
                          <li><a href="#" className="hover:text-zinc-100 transition-colors">Web Development</a></li>
                          <li className=""><a href="#" className="hover:text-zinc-100 transition-colors">Landing Pages</a></li>
                          <li className=""><a href="#" className="hover:text-zinc-100 transition-colors">Technical SEO</a></li>
                          <li><a href="#" className="hover:text-zinc-100 transition-colors">n8n Automation</a></li>
                      </ul>
                  </div>

                  <div className="">
                      <h4 className="text-sm font-medium text-zinc-100 mb-4">Company</h4>
                      <ul className="space-y-3 text-sm text-zinc-400">
                          <li className=""><a href="#" className="hover:text-zinc-100 transition-colors">About Us</a></li>
                          <li><a href="#" className="hover:text-zinc-100 transition-colors">Case Studies</a></li>
                          <li><a href="#" className="hover:text-zinc-100 transition-colors">Careers</a></li>
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
                  <p className="">┬⌐ 2024 Studio Agency. All rights reserved.</p>
                  <div className="flex items-center gap-4">
                      <span>Designed for scale.</span>
                      <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500/50"></span>
                      <span>Systems Operational</span>
                  </div>
              </div>
          </div>
      </footer>
    </div>
  );
};

export default Home;
