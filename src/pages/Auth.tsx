import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { z } from "zod";
import { Sparkles, Mail, Lock, User, ArrowLeft, KeyRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { RippleButton } from "@/components/ui/ripple-button";
import { useToast } from "@/hooks/use-toast";

const signupSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().trim().email("Invalid email address").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
});

const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address").max(255),
  password: z.string().min(1, "Password is required").max(72),
});

const resetSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
  confirmPassword: z.string(),
}).refine((value) => value.password === value.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [mode, setMode] = useState<"login" | "signup" | "forgot" | "reset">(() => location.pathname === "/login" ? "login" : "signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleEnabled] = useState(false);
  const [networkError, setNetworkError] = useState(false);

  useEffect(() => {
    document.title = mode === "signup" ? "Sign up — SHAHED" : mode === "forgot" ? "Forgot password — SHAHED" : mode === "reset" ? "Set new password — SHAHED" : "Login — SHAHED";
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setMode("reset");
        setLoading(false);
      } else if (session && mode !== "reset") {
        navigate("/", { replace: true });
      }
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && mode !== "reset") navigate("/", { replace: true });
    });
    return () => subscription.unsubscribe();
  }, [mode, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "reset") {
        const parsed = resetSchema.safeParse({ password, confirmPassword });
        if (!parsed.success) {
          toast({ title: "Invalid password", description: parsed.error.issues[0].message, variant: "destructive" });
          return;
        }
        const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
        if (error) {
          toast({ title: "Password update failed", description: error.message, variant: "destructive" });
          return;
        }
        toast({ title: "Password updated", description: "You can now log in with your new password." });
        await supabase.auth.signOut();
        setPassword("");
        setConfirmPassword("");
        setMode("login");
      } else if (mode === "forgot") {
        const parsed = z.string().trim().email("Invalid email address").safeParse(email);
        if (!parsed.success) {
          toast({ title: "Invalid email", description: parsed.error.issues[0].message, variant: "destructive" });
          return;
        }
        const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
          redirectTo: `${window.location.origin}/login`,
        });
        if (error) {
          toast({ title: "Could not send reset email", description: error.message, variant: "destructive" });
          return;
        }
        toast({ title: "Reset email sent", description: "Check your inbox and follow the password reset link." });
      } else if (mode === "signup") {
        const parsed = signupSchema.safeParse({ name, email, password });
        if (!parsed.success) {
          toast({ title: "Invalid input", description: parsed.error.issues[0].message, variant: "destructive" });
          return;
        }
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { display_name: parsed.data.name },
          },
        });
        if (error) {
          toast({ title: "Signup failed", description: error.message, variant: "destructive" });
          return;
        }
        toast({ title: "Account created", description: "Welcome aboard!" });
      } else {
        const parsed = loginSchema.safeParse({ email, password });
        if (!parsed.success) {
          toast({ title: "Invalid input", description: parsed.error.issues[0].message, variant: "destructive" });
          return;
        }
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) {
          const offline = /failed to fetch|network|fetch/i.test(error.message);
          setNetworkError(offline);
          toast({
            title: offline ? "Connection problem" : "Login failed",
            description: offline ? "Supabase server-এ সংযোগ করা যাচ্ছে না। Internet/DNS connection পরীক্ষা করে আবার চেষ্টা করুন।" : error.message,
            variant: "destructive",
          });
          return;
        }
        setNetworkError(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin },
      });
      if (error) {
        const description = /missing oauth secret|unsupported provider/i.test(error.message)
          ? "Supabase Dashboard → Authentication → Providers → Google-এ Client ID ও Client Secret বসিয়ে Google provider Enable করুন।"
          : error.message;
        toast({ title: "Google sign-in failed", description, variant: "destructive" });
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  const isFormMode = mode === "login" || mode === "signup";

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-20 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-primary/30 blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] rounded-full bg-accent/25 blur-[120px] animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        <div className="glass-card p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-primary mb-4">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="font-heading text-3xl font-semibold tracking-tight mb-2">
              {mode === "signup" ? "Create account" : mode === "forgot" ? "Forgot password?" : mode === "reset" ? "Set a new password" : "Welcome back"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {mode === "signup" ? "Sign up to get started" : mode === "forgot" ? "Enter your email and we will send a reset link" : mode === "reset" ? "Choose a strong password for your account" : "Login to your account"}
            </p>
          </div>

          {googleEnabled && isFormMode && <button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-white/95 text-[#1f1f1f] rounded-full py-3 text-sm font-medium transition-all shadow-[0_2px_10px_-2px_rgba(0,0,0,0.4)] hover:shadow-[0_4px_16px_-2px_rgba(0,0,0,0.5)] disabled:opacity-50 border border-white/10"
          >
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>
              <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
              <path fill="#FBBC05" d="M11.69 28.18c-.44-1.32-.69-2.73-.69-4.18s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"/>
              <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/>
            </svg>
            Continue with Google
          </button>}

          {isFormMode && <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {networkError && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                Login service এখন reachable নয়। Internet connection পরীক্ষা করে আবার চেষ্টা করুন।
                <button type="button" onClick={() => window.location.reload()} className="ml-2 font-medium underline">Retry</button>
              </div>
            )}
            {mode === "signup" && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  aria-label="Full name"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={80}
                  className="w-full glass rounded-full pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            )}
            {mode !== "reset" && <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                aria-label="Email address"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                maxLength={255}
                className="w-full glass rounded-full pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>}
            {mode !== "forgot" && mode !== "reset" && <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                aria-label="Password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                maxLength={72}
                className="w-full glass rounded-full pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>}
            {mode === "reset" && <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="password" aria-label="New password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} required maxLength={72} className="w-full glass rounded-full pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>}
            {mode === "reset" && <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="password" aria-label="Confirm new password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required maxLength={72} className="w-full glass rounded-full pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>}

            <RippleButton type="submit" variant="primary" size="lg" disabled={loading} className="w-full">
              {loading ? "Please wait..." : mode === "signup" ? "Create account" : mode === "forgot" ? "Send reset link" : mode === "reset" ? "Update password" : "Login"}
            </RippleButton>
          </form>

          {mode === "login" && <button type="button" onClick={() => setMode("forgot")} className="mt-4 w-full text-center text-sm text-primary hover:underline">Forgot password?</button>}
          <p className="text-center text-sm text-muted-foreground mt-6">
            {mode === "signup" ? "Already have an account?" : mode === "login" ? "Don't have an account?" : "Remember your password?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "signup" || mode === "reset" ? "login" : "signup")}
              className="text-gradient font-medium hover:underline"
            >
              {mode === "signup" || mode === "reset" ? "Login" : "Sign up"}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
};

export default AuthPage;
