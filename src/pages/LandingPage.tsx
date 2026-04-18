import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  CheckCircle2, 
  CreditCard, 
  Smartphone, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  BarChart3,
  Search,
  ChevronRight,
  Globe,
  Plus,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface LandingPageProps {
  onGetStarted: () => void;
  onMarketplace: () => void;
}

export default function LandingPage({ onGetStarted, onMarketplace }: LandingPageProps) {
  return (
    <div className="bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg text-white">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">RentFlow</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Features</a>
              <a href="#solutions" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Solutions</a>
              <a href="#pricing" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Pricing</a>
              <button onClick={onMarketplace} className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Marketplace</button>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" className="font-semibold" onClick={onGetStarted}>Login</Button>
              <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 px-6 rounded-full" onClick={onGetStarted}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/50 -z-10 rounded-bl-[100px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                The Modern Standard for Rental Management
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
                Manage properties, collect rent, and <span className="text-blue-600">fill vacancies</span> instantly.
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed mb-10 max-w-lg">
                Automate your property management workflow. Integrated M-Pesa payments, automated receipts, and a public marketplace for your units.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="h-14 px-8 text-lg bg-blue-600 hover:bg-blue-700 rounded-xl" onClick={onGetStarted}>
                  Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button variant="outline" className="h-14 px-8 text-lg rounded-xl border-slate-200" onClick={onMarketplace}>
                  Browse Marketplace
                </Button>
              </div>
              <div className="mt-10 flex items-center gap-6 text-sm text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" /> No Credit Card Required
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" /> 14-Day Free Trial
                </div>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-8 border-white">
                <img 
                  src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/c7f8250c-26df-4474-b12f-e48d039cd83b/hero-apartment-building-90702022-1776518356738.webp" 
                  alt="SaaS Dashboard Preview" 
                  className="w-full h-auto"
                />
              </div>
              {/* Floating M-Pesa Card */}
              <div className="absolute -bottom-10 -left-10 z-20 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-[240px] hidden md:block">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Smartphone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">M-Pesa Payment</p>
                    <p className="font-bold text-slate-900">KES 45,000.00</p>
                  </div>
                </div>
                <div className="w-full bg-green-500 h-1.5 rounded-full mb-2 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="h-full bg-white/30"
                  ></motion.div>
                </div>
                <p className="text-xs text-slate-500 font-medium">Verified & Receipt Generated</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-blue-600 font-bold text-sm uppercase tracking-widest mb-4">Everything you need</h2>
            <h3 className="text-4xl font-bold text-slate-900 mb-6">Built for Modern Landlords</h3>
            <p className="text-lg text-slate-600">Stop chasing rent. Stop manual paperwork. Start scaling your portfolio with automation.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Smartphone className="text-green-600" />} 
              title="Instant M-Pesa Integration" 
              description="Full STK Push support. Tenants pay directly from their phones, and your system updates in real-time."
              color="green"
            />
            <FeatureCard 
              icon={<Zap className="text-blue-600" />} 
              title="Automated Utility Billing" 
              description="Calculate water, electricity, and service charges automatically. Split costs easily among tenants."
              color="blue"
            />
            <FeatureCard 
              icon={<FileText className="text-purple-600" />} 
              title="Receipt Generation" 
              description="Digital, tamper-proof receipts generated for every payment. Accessible via public verification URLs."
              color="purple"
            />
            <FeatureCard 
              icon={<Globe className="text-indigo-600" />} 
              title="Public Marketplace" 
              description="List your vacant units to the public. Integrated booking flow with applicant screening."
              color="indigo"
            />
            <FeatureCard 
              icon={<ShieldCheck className="text-red-600" />} 
              title="Deposit Management" 
              description="Track security deposits, handle deductions for damages, and manage refunds seamlessly."
              color="red"
            />
            <FeatureCard 
              icon={<BarChart3 className="text-amber-600" />} 
              title="Financial Analytics" 
              description="Detailed reporting on income, expenses, arrears, and occupancy rates across all properties."
              color="amber"
            />
          </div>
        </div>
      </section>

      {/* Booking Layout Preview */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
             <div className="order-2 lg:order-1">
                <img 
                  src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/c7f8250c-26df-4474-b12f-e48d039cd83b/modern-living-room-interior-dadeea56-1776518356364.webp" 
                  alt="Unit Layout" 
                  className="rounded-2xl shadow-2xl"
                />
             </div>
             <div className="order-1 lg:order-2">
                <h3 className="text-3xl font-bold text-slate-900 mb-6">Interactive Unit Booking</h3>
                <p className="text-lg text-slate-600 mb-8">
                  Let prospective tenants see exactly what they are booking. Our interactive unit layouts and visual galleries help close deals faster.
                </p>
                <ul className="space-y-4">
                  {[
                    "Visual unit layout diagrams",
                    "Automated availability tracking",
                    "Tenant application workflow",
                    "Security deposit pre-payment"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 font-medium text-slate-700">
                      <div className="bg-blue-100 p-1 rounded-full text-blue-600">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <Button className="mt-10 bg-slate-900 hover:bg-slate-800 text-white px-8 rounded-xl h-12" onClick={onMarketplace}>
                  View Demo Marketplace
                </Button>
             </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Simple, Scalable Pricing</h2>
            <p className="text-lg text-slate-600">Choose the plan that fits your property portfolio.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard 
              name="Starter" 
              price="0" 
              description="Perfect for small landlords." 
              features={["Up to 5 Units", "M-Pesa Integration", "Basic Receipting", "Email Support"]}
            />
            <PricingCard 
              name="Professional" 
              price="20" 
              description="For growing property portfolios." 
              popular={true}
              features={["Up to 50 Units", "Utility Management", "Tenant Marketplace", "Financial Analytics", "Priority Support"]}
            />
            <PricingCard 
              name="Business" 
              price="50" 
              description="For large scale property firms." 
              features={["Unlimited Units", "Multiple Staff Accounts", "Whitelabel Portal", "API Access", "Dedicated Account Manager"]}
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-blue-600 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 to-blue-600 -z-10"></div>
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-5xl font-bold mb-8">Ready to automate your rental business?</h2>
          <p className="text-xl text-blue-100 mb-10">Join 500+ property managers who use RentFlow to save 10+ hours every week.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="h-14 px-10 text-lg bg-white text-blue-600 hover:bg-blue-50 rounded-xl" onClick={onGetStarted}>
              Get Started for Free
            </Button>
            <Button variant="outline" className="h-14 px-10 text-lg border-blue-400 text-white hover:bg-blue-700 rounded-xl">
              Talk to Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-blue-600 p-2 rounded-lg text-white">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold text-white">RentFlow</span>
              </div>
              <p className="text-sm leading-relaxed">
                Cloud-based property management for the modern African landlord. Integrated payments, automated flows.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Product</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Marketplace</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Company</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Legal</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
            <p>© 2024 RentFlow SaaS. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-white transition-colors">Facebook</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: { icon: React.ReactNode, title: string, description: string, color: string }) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    red: 'bg-red-50 text-red-600',
    amber: 'bg-amber-50 text-amber-600'
  };

  return (
    <Card className="p-8 border-slate-100 hover:shadow-xl transition-shadow duration-300">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${colorMap[color]}`}>
        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { className: 'w-6 h-6' }) : icon}
      </div>
      <h4 className="text-xl font-bold text-slate-900 mb-4">{title}</h4>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </Card>
  );
}

function PricingCard({ name, price, description, features, popular = false }: { name: string, price: string, description: string, features: string[], popular?: boolean }) {
  return (
    <Card className={`p-8 relative flex flex-col ${popular ? 'border-2 border-blue-600 shadow-2xl scale-105 z-10' : 'border-slate-100 shadow-lg'}`}>
      {popular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
          Most Popular
        </div>
      )}
      <div className="mb-8">
        <h4 className="text-xl font-bold text-slate-900 mb-2">{name}</h4>
        <p className="text-slate-500 text-sm">{description}</p>
      </div>
      <div className="mb-8">
        <div className="flex items-baseline">
          <span className="text-4xl font-extrabold text-slate-900">${price}</span>
          <span className="text-slate-500 ml-2">/month</span>
        </div>
      </div>
      <ul className="space-y-4 mb-10 flex-1">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
            <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
      <Button className={`w-full h-12 rounded-xl font-bold ${popular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}>
        Choose {name}
      </Button>
    </Card>
  );
}