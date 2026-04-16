import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Mail, Lock, User, Crown, ArrowRight, Check } from 'lucide-react';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!agreeTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }
    
    setIsLoading(true);
    const result = await signup(name, email, password);
    if (result.success) {
      navigate('/');
    } else {
      // Clean up the firebase error message a bit for the user
      let errMsg = result.error || 'An error occurred during signup';
      if (errMsg.includes('weak-password')) errMsg = 'Password should be at least 6 characters';
      if (errMsg.includes('email-already-in-use')) errMsg = 'Email address is already in use';
      if (errMsg.includes('invalid-email')) errMsg = 'Invalid email address';
      if (errMsg.includes('operation-not-allowed')) errMsg = 'Email/Password sign in is disabled in Firebase Console';
      setError(errMsg);
    }
    setIsLoading(false);
  };

  const benefits = [
    'Exclusive member discounts',
    'Early access to new collections',
    'Free shipping on all orders',
    'Personalized style recommendations'
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&auto=format&fit=crop"
          alt="Luxury Fashion"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-3 mb-8">
            <Crown className="h-10 w-10 text-amber-400" />
            <span className="text-4xl font-serif font-bold">Veloura</span>
          </div>
          <h2 className="text-5xl font-serif mb-6 leading-tight">
            Join the<br />
            <span className="text-amber-400">Elite</span>
          </h2>
          <p className="text-white/70 text-lg max-w-md mb-8">
            Create an account and unlock exclusive benefits designed for the discerning.
          </p>
          <ul className="space-y-3">
            {benefits.map((benefit, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <Check className="h-4 w-4 text-amber-400" />
                </div>
                <span className="text-white/80">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center bg-stone-50 px-4 sm:px-8 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <Crown className="h-8 w-8 text-amber-500" />
            <span className="text-2xl font-serif font-bold text-slate-900">Veloura</span>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-serif text-slate-900 mb-2">Create Account</h1>
              <p className="text-slate-500">Join Veloura for exclusive access</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-12 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 pr-12 h-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-12"
                  required
                />
              </div>

              <div className="flex items-start gap-3">
                <Checkbox 
                  id="terms" 
                  checked={agreeTerms}
                  onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                />
                <label htmlFor="terms" className="text-sm text-slate-600 leading-relaxed cursor-pointer">
                  I agree to the{' '}
                  <Link to="#" className="text-amber-600 hover:text-amber-700">Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="#" className="text-amber-600 hover:text-amber-700">Privacy Policy</Link>
                </label>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full btn-gold h-12"
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-slate-600">
                Already have an account?{' '}
                <Link to="/login" className="text-amber-600 font-medium hover:text-amber-700">
                  Sign in
                </Link>
              </p>
            </div>

            <div className="mt-8 pt-6 border-t">
              <p className="text-center text-sm text-slate-500 mb-4">Or sign up with</p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 h-12">
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5 mr-2" />
                  Google
                </Button>
                <Button variant="outline" className="flex-1 h-12">
                  <img src="https://www.svgrepo.com/show/448234/facebook.svg" alt="Facebook" className="h-5 w-5 mr-2" />
                  Facebook
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
