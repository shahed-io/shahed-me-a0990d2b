import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      {/* Tell Google this is a real 404, not a soft-404. */}
      <Helmet>
        <title>404 — Page Not Found | MD Shahed</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
        {/* Prerender/rendering hint — Googlebot honors this header-style meta */}
        <meta name="prerender-status-code" content="404" />
        <link rel="canonical" href="https://shahed.com.bd/" />
      </Helmet>

      <main
        className="flex min-h-screen items-center justify-center px-6"
        style={{ backgroundImage: "var(--gradient-mesh)" }}
      >
        <div className="mx-auto max-w-xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Error 404
          </p>
          <h1 className="mb-4 text-5xl font-bold text-gradient-primary sm:text-6xl">
            Page not found
          </h1>
          <p className="mb-8 text-lg text-muted-foreground">
            The page <code className="font-mono text-sm">{location.pathname}</code> doesn't exist or has moved.
            Try one of the links below.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" /> Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/blog">
                <Search className="mr-2 h-4 w-4" /> Blog
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg" onClick={() => window.history.back()}>
              <span>
                <ArrowLeft className="mr-2 h-4 w-4" /> Go back
              </span>
            </Button>
          </div>

          <div className="mt-10 text-sm text-muted-foreground">
            <p className="mb-2 font-medium text-foreground">Popular pages</p>
            <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1">
              <li><Link className="underline hover:text-primary" to="/md-shahed">MD Shahed</Link></li>
              <li><Link className="underline hover:text-primary" to="/bangladesh-web-development">Web Development BD</Link></li>
              <li><Link className="underline hover:text-primary" to="/digital-consulting">Consulting</Link></li>
              <li><Link className="underline hover:text-primary" to="/timeline">Timeline</Link></li>
              <li><Link className="underline hover:text-primary" to="/blog">Blog</Link></li>
            </ul>
          </div>
        </div>
      </main>
    </>
  );
};

export default NotFound;
