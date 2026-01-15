import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Github, Zap } from 'lucide-react';

function Home() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-background flex flex-col items-center justify-center text-center selection:bg-primary/30">
      {/* Dynamic Grid Background */}
      <div className="absolute inset-0 w-full h-full bg-grid-white/[0.02] -z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50 z-0 pointer-events-none" />

      {/* Floating Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[30vw] h-[30vw] bg-primary/20 rounded-full blur-[100px] animate-float opacity-60" />
        <div
          className="absolute bottom-[-10%] right-[20%] w-[30vw] h-[30vw] bg-secondary/20 rounded-full blur-[100px] animate-float opacity-60"
          style={{ animationDelay: '2s' }}
        />
      </div>

      <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center gap-8 py-20">
        {/* Badge */}
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary backdrop-blur-sm transition-colors hover:bg-primary/10">
            <Zap className="mr-2 h-3.5 w-3.5" />
            <span className="text-secondary-foreground">
              FlowCraft v2.0 is now live
            </span>
          </div>
        </div>

        {/* Hero Text */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl leading-[1.1]">
            <span className="block text-foreground drop-shadow-sm">
              Automate Your Data
            </span>
            <span className="block bg-gradient-to-r from-primary via-indigo-400 to-primary bg-[length:200%_auto] bg-clip-text text-transparent animate-text-shine">
              Without Limits
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-muted-foreground text-lg md:text-xl leading-relaxed">
            Build, visualize, and scale complex data workflows with our next-gen
            node editor. Experience the future of automation today.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full justify-center">
          <Link to="/dashboard">
            <Button
              size="lg"
              className="h-14 px-8 text-lg rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_30px_-5px_var(--color-primary)] hover:shadow-[0_0_50px_-10px_var(--color-primary)] transition-all duration-300 hover:scale-105"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <a
            href="https://github.com/imvikashdev/react-flow-example"
            target="_blank"
            rel="noreferrer"
          >
            <Button
              variant="outline"
              size="lg"
              className="h-14 px-8 text-lg rounded-full border border-primary/20 bg-background/50 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 hover:scale-105"
            >
              <Github className="mr-2 h-5 w-5" />
              View on GitHub
            </Button>
          </a>
        </div>

        {/* 3D App Showcase */}
        <div className="mt-20 w-full max-w-6xl perspective-1000">
          <div className="relative group transform transition-all duration-700 hover:rotate-x-2 preserve-3d">
            {/* Glow backing */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />

            {/* Main Image Container */}
            <div className="relative rounded-2xl border border-border/50 bg-background/80 shadow-2xl backdrop-blur-xl overflow-hidden ring-1 ring-white/10 transform transition-transform group-hover:translate-y-[-10px]">
              {/* Browser-like header */}
              <div className="h-10 border-b border-border/50 bg-muted/30 flex items-center px-4 space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>

              {/* Image */}
              <img
                alt="FlowCraft Interface"
                className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity"
                src="/demo.png"
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;
