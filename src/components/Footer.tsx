import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  Crown, 
  Mail, 
  Phone, 
  MapPin, 
  Instagram, 
  Facebook, 
  Twitter,
  ArrowRight,
  CreditCard,
  Truck,
  Shield,
  RotateCcw
} from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success('Thank you for subscribing!');
      setEmail('');
    }
  };

  const footerLinks = {
    shop: [
      { name: 'New Arrivals', href: '/shop/all' },
      { name: 'Men\'s Collection', href: '/shop/men' },
      { name: 'Women\'s Collection', href: '/shop/women' },
      { name: 'Accessories', href: '/shop/all' },
      { name: 'Sale', href: '/shop/all' }
    ],
    support: [
      { name: 'Contact Us', href: '#' },
      { name: 'FAQs', href: '#' },
      { name: 'Shipping Info', href: '#' },
      { name: 'Returns & Exchanges', href: '#' },
      { name: 'Size Guide', href: '#' }
    ],
    company: [
      { name: 'About Us', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Press', href: '#' },
      { name: 'Sustainability', href: '#' },
      { name: 'Affiliates', href: '#' }
    ]
  };

  return (
    <footer className="bg-slate-900 text-white">
      {/* Features Bar */}
      <div className="border-b border-white/10">
        <div className="container-premium py-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'On orders above ₹5000' },
              { icon: Shield, title: 'Secure Payment', desc: '100% secure checkout' },
              { icon: RotateCcw, title: 'Easy Returns', desc: '30-day return policy' },
              { icon: CreditCard, title: 'Flexible Payment', desc: 'Multiple payment options' }
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="font-medium">{feature.title}</p>
                  <p className="text-sm text-white/60">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="container-premium py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-serif mb-2">Join the Veloura Family</h3>
              <p className="text-white/60">Subscribe for exclusive offers, early access to new arrivals, and style tips</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-80">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 h-12"
                  required
                />
              </div>
              <Button type="submit" className="btn-gold h-12 px-6">
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-premium py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <Crown className="h-8 w-8 text-amber-400" />
              <span className="text-3xl font-serif font-bold">Veloura</span>
            </Link>
            <p className="text-white/60 mb-6 max-w-sm">
              Redefining luxury fashion with curated collections that blend timeless elegance 
              with contemporary sophistication. Experience the art of dressing well.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-white/60">
                <MapPin className="h-5 w-5 text-amber-400" />
                <span>123 Luxury Avenue, Mumbai 400001</span>
              </div>
              <div className="flex items-center gap-3 text-white/60">
                <Phone className="h-5 w-5 text-amber-400" />
                <span>+91 1800 123 4567</span>
              </div>
              <div className="flex items-center gap-3 text-white/60">
                <Mail className="h-5 w-5 text-amber-400" />
                <span>care@veloura.com</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-medium text-lg mb-6">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-white/60 hover:text-amber-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-lg mb-6">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-white/60 hover:text-amber-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-lg mb-6">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-white/60 hover:text-amber-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-premium py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm">
              © 2024 Veloura. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link to="#" className="text-white/40 hover:text-white text-sm">Privacy Policy</Link>
              <Link to="#" className="text-white/40 hover:text-white text-sm">Terms of Service</Link>
              <Link to="#" className="text-white/40 hover:text-white text-sm">Cookie Policy</Link>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-amber-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-amber-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-amber-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
