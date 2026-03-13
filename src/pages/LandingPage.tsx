import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Laptop, 
  Settings, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Cpu, 
  HardDrive, 
  Wifi, 
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const services = [
    { icon: <Laptop className="w-8 h-8" />, title: "Laptop Repair", desc: "Screen replacement, battery issues, and hardware fixes." },
    { icon: <Settings className="w-8 h-8" />, title: "Computer Repair", desc: "Desktop troubleshooting and performance optimization." },
    { icon: <Cpu className="w-8 h-8" />, title: "Hardware Upgrade", desc: "RAM, SSD, and GPU upgrades for faster performance." },
    { icon: <ShieldCheck className="w-8 h-8" />, title: "Virus Removal", desc: "Complete malware cleanup and security setup." },
    { icon: <HardDrive className="w-8 h-8" />, title: "Data Recovery", desc: "Recover lost files from damaged drives." },
    { icon: <Wifi className="w-8 h-8" />, title: "Networking Setup", desc: "Home and office Wi-Fi and LAN configuration." },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Cpu className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight">360 iT Solutions</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-sm font-medium hover:text-indigo-600 transition-colors">Home</a>
              <a href="#services" className="text-sm font-medium hover:text-indigo-600 transition-colors">Services</a>
              <a href="#about" className="text-sm font-medium hover:text-indigo-600 transition-colors">About</a>
              <a href="#contact" className="text-sm font-medium hover:text-indigo-600 transition-colors">Contact</a>
              <Link to="/login" className="text-sm font-semibold text-white bg-indigo-600 px-6 py-2.5 rounded-full hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200">
                Login
              </Link>
            </div>

            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white border-b border-slate-100 px-4 py-6 space-y-4"
          >
            <a href="#home" className="block text-lg font-medium">Home</a>
            <a href="#services" className="block text-lg font-medium">Services</a>
            <a href="#about" className="block text-lg font-medium">About</a>
            <a href="#contact" className="block text-lg font-medium">Contact</a>
            <Link to="/login" className="block text-lg font-semibold text-indigo-600">Login</Link>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 lg:pt-48 lg:pb-32 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-indigo-600 uppercase bg-indigo-50 rounded-full">
              Hyderabad's Trusted IT Partner
            </span>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-tight">
              Professional Computer Repair <br className="hidden lg:block" />
              <span className="text-indigo-600">& IT Services</span>
            </h1>
            <p className="text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed">
              Hardware repair, software installation, networking, laptop repair and expert IT support. Fast, reliable, and affordable solutions for your tech.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/track" className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                Check Repair Status <ChevronRight className="w-4 h-4" />
              </Link>
              <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-slate-200 text-slate-900 font-bold rounded-2xl hover:border-indigo-600 hover:text-indigo-600 transition-all">
                Login to Dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Expert Services</h2>
            <p className="text-slate-600">Comprehensive IT solutions for home and business.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((s, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="bg-indigo-50 text-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                  {s.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                <p className="text-slate-600 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">Why Choose 360 iT Solutions?</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Located in the heart of Hyderabad, we provide top-notch IT services with a focus on quality and customer satisfaction. Our team of expert technicians is dedicated to solving your technical problems quickly and efficiently.
            </p>
            <div className="space-y-4">
              {[
                { title: "Fast Service", desc: "Most repairs completed within 24-48 hours." },
                { title: "Expert Technicians", desc: "Certified professionals with years of experience." },
                { title: "Affordable Pricing", desc: "Transparent costs with no hidden charges." },
                { title: "Trusted Support", desc: "Ongoing assistance for all your IT needs." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mt-1">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold">{item.title}</h4>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden bg-slate-100">
              <img 
                src="https://images.unsplash.com/photo-1591405351990-4726e331f141?auto=format&fit=crop&q=80&w=800" 
                alt="IT Service" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-indigo-600 text-white p-8 rounded-3xl shadow-2xl hidden sm:block">
              <p className="text-4xl font-bold mb-1">10+</p>
              <p className="text-sm font-medium opacity-80 uppercase tracking-widest">Years Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-8">Get in Touch</h2>
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Our Location</h4>
                  <p className="text-slate-400">Ameerpet, Hyderabad, Telangana 500016, India</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Call Us</h4>
                  <p className="text-slate-400">+91 98765 43210</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Email Us</h4>
                  <p className="text-slate-400">support@360itsolutions.com</p>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden h-[400px] bg-slate-800">
            {/* Map Placeholder */}
            <div className="w-full h-full flex items-center justify-center text-slate-500 italic">
              Google Maps Integration
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Cpu className="text-indigo-600 w-6 h-6" />
            <span className="text-lg font-bold">360 iT Solutions</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 360 iT Solutions. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">Twitter</a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">Facebook</a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
