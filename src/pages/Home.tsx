import { motion } from "framer-motion";
import { Gamepad2, LayoutGrid, Zap, Shield, Globe } from "lucide-react";
import { Link } from "wouter";
import { useGetLinks } from "@/hooks/use-links";

export default function Home() {
  const { data: links = [] } = useGetLinks();
  
  const gameCount = links.filter(l => l.category === "games").length;
  const appCount = links.filter(l => l.category === "apps").length;

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Optimized for speed so you can get straight to the action."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Unblocked Access",
      description: "Designed to work anywhere, anytime, without restrictions."
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Clean Interface",
      description: "A distraction-free experience for your favorite web apps."
    }
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8"
            >
              <Zap className="w-4 h-4" />
              Welcome to the Next Generation
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-7xl font-display font-bold mb-6 tracking-tight"
            >
              Your Portal to <span className="text-primary">Everything.</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground mb-10 leading-relaxed"
            >
              A high-performance hub for unblocked games and essential web applications. 
              Built for speed, privacy, and seamless access.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/games">
                <button className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                  <Gamepad2 className="w-5 h-5" />
                  Play Games
                </button>
              </Link>
              <Link href="/apps">
                <button className="w-full sm:w-auto px-8 py-4 bg-card border border-white/10 rounded-2xl font-bold text-lg hover:bg-white/5 transition-all active:scale-95 flex items-center justify-center gap-2">
                  <LayoutGrid className="w-5 h-5" />
                  Launch Apps
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 bg-card rounded-3xl border border-white/5 relative group hover:border-primary/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-display font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quick Access Info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-primary/10 border border-primary/20 rounded-[2rem] p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-primary/20 blur-[120px] rounded-full" />
          <div className="relative z-10 grid md:grid-cols-2 items-center gap-12">
            <div>
              <h2 className="text-4xl font-display font-bold mb-6">Explore the library</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Currently hosting <span className="text-primary font-bold">{gameCount} games</span> and <span className="text-primary font-bold">{appCount} apps</span>. 
                Everything is pre-configured and ready to use immediately.
              </p>
              <Link href="/games">
                <span className="text-primary font-bold hover:underline cursor-pointer flex items-center gap-2">
                  View full library <Zap className="w-4 h-4" />
                </span>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="aspect-square bg-card/50 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center p-4">
                  <span className="text-3xl font-display font-bold text-primary mb-1">{gameCount}</span>
                  <span className="text-sm text-muted-foreground">Games</span>
               </div>
               <div className="aspect-square bg-card/50 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center p-4">
                  <span className="text-3xl font-display font-bold text-primary mb-1">{appCount}</span>
                  <span className="text-sm text-muted-foreground">Apps</span>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
