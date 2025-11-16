import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedSphere } from './AnimatedSphere';
import { ShiningStars } from './ShiningStars';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Sparkles, Zap, Brain, Users, Code, Shield } from "lucide-react";

interface LandingPageProps {
  onNavigateToLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToLogin }) => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Intelligence',
      description: 'Leverage cutting-edge AI models to automate complex tasks and generate intelligent solutions with natural language commands.'
    },
    {
      icon: Zap,
      title: 'Lightning Fast Performance',
      description: 'Experience real-time code generation and instant results with our optimized AI engine built for speed and efficiency.'
    },
    {
      icon: Code,
      title: 'Smart Code Generation',
      description: 'Generate production-ready code snippets, complete applications, and technical solutions with context-aware AI assistance.'
    },
    {
      icon: Sparkles,
      title: 'Interactive Sandbox',
      description: 'Test and preview your AI-generated code in a live environment with instant feedback and iterative improvements.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data and projects are protected with enterprise-grade security. We prioritize privacy and never share your information.'
    },
    {
      icon: Users,
      title: 'Collaborative Workflows',
      description: 'Work seamlessly with your team, share AI-generated assets, and collaborate on projects in real-time.'
    }
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl"
        style={{
          background: 'rgba(var(--background), 0.8)'
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShiningStars size="small" count={15} />
            <span className="font-semibold text-lg">Nava AI</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('about')}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('creators')}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Creators
            </button>
            <button
              onClick={onNavigateToLogin}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#7B61FF] to-[#3B82F6] text-white hover:shadow-glow transition-all"
            >
              Login
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={onNavigateToLogin}
            className="md:hidden px-4 py-2 rounded-lg bg-gradient-to-r from-[#7B61FF] to-[#3B82F6] text-white"
          >
            Login
          </button>
        </nav>
      </motion.header>

      {/* Hero Section with 3D Sphere */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#7B61FF] to-[#3B82F6] bg-clip-text text-transparent">
                Welcome to Nava AI
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Transform your ideas into reality with our advanced AI-powered platform. 
                Generate code, create applications, and innovate faster than ever before.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={onNavigateToLogin}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#7B61FF] to-[#3B82F6] text-white shadow-glow-hover transition-all"
                >
                  Get Started
                </button>
                <button
                  onClick={() => scrollToSection('features')}
                  className="px-8 py-3 rounded-xl bg-card/50 backdrop-blur-sm hover:bg-card transition-all"
                >
                  Learn More
                </button>
              </div>
            </motion.div>

            {/* Right side - 3D Animated Sphere */}
            <motion.div
              className="flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <AnimatedSphere />
            </motion.div>
          </div>
        </div>

        {/* Background gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-[#7B61FF]/20 to-transparent blur-3xl pointer-events-none" />
      </section>

      {/* About Section with Image */}
      <section id="about" className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-4">About Nava AI</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Nava AI is a next-generation platform that combines artificial intelligence 
              with intuitive design to help developers, creators, and businesses build 
              powerful applications faster. Our mission is to democratize AI and make 
              advanced technology accessible to everyone.
            </p>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            className="mb-16 rounded-3xl overflow-hidden shadow-3xl"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative h-[400px] w-full">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1645839078449-124db8a049fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMHRlY2hub2xvZ3klMjBuZXVyYWwlMjBuZXR3b3JrfGVufDF8fHx8MTc1OTI0MjAzNXww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="AI Technology Neural Network"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Innovation First',
                description: 'We push the boundaries of what\'s possible with AI, constantly evolving our platform with the latest advancements.'
              },
              {
                title: 'User-Centric Design',
                description: 'Every feature is designed with you in mind, ensuring an intuitive and delightful experience.'
              },
              {
                title: 'Reliability',
                description: 'Built on robust infrastructure to deliver consistent, high-quality results you can depend on.'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm hover:shadow-glow transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to bring your AI-powered projects to life
            </p>
          </motion.div>

          {/* Feature Hero Images */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <motion.div
              className="rounded-3xl overflow-hidden shadow-3xl"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative h-[300px] w-full">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1673255745677-e36f618550d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMGFydGlmaWNpYWwlMjBpbnRlbGxpZ2VuY2UlMjBicmFpbiUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU5MTM1MTYwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="AI Brain Technology"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#7B61FF]/30 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-semibold mb-1">AI-Powered Intelligence</h3>
                  <p className="text-sm opacity-90">Advanced neural networks at work</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="rounded-3xl overflow-hidden shadow-3xl"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative h-[300px] w-full">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1625459201773-9b2386f53ca2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0d2FyZSUyMGRldmVsb3BtZW50JTIwY29kaW5nJTIwcHJvZ3JhbW1pbmd8ZW58MXx8fHwxNzU5MTQ1Mjg5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Software Development Coding"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/30 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-semibold mb-1">Smart Code Generation</h3>
                  <p className="text-sm opacity-90">From concept to production code</p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  className="p-8 rounded-2xl bg-card backdrop-blur-sm hover:shadow-glow transition-all group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7B61FF] to-[#3B82F6] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Image Showcase Section */}
      <section className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left - Image */}
            <motion.div
              className="rounded-3xl overflow-hidden shadow-3xl"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative h-[500px] w-full">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1740933084056-078fac872bff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3b3Jrc3BhY2UlMjBjb2xsYWJvcmF0aW9ufGVufDF8fHx8MTc1OTIyNjUyOXww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Modern Workspace Collaboration"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#7B61FF]/20 to-transparent" />
              </div>
            </motion.div>

            {/* Right - Content */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold mb-6">
                Built for Modern Workflows
              </h2>
              <p className="text-xl text-muted-foreground mb-6">
                Nava AI integrates seamlessly into your existing processes, enhancing 
                productivity without disrupting your workflow. Our platform is designed 
                to complement your creative process, not complicate it.
              </p>
              <div className="space-y-4">
                {[
                  'Real-time collaboration with your team',
                  'Cloud-based accessibility from anywhere',
                  'Secure data handling and privacy protection',
                  'Continuous updates and improvements'
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#7B61FF] to-[#3B82F6] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Second Image Row - Futuristic Interface */}
          <div className="grid md:grid-cols-2 gap-12 items-center mt-20">
            {/* Left - Content */}
            <motion.div
              className="order-2 md:order-1"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold mb-6">
                Cutting-Edge Technology
              </h2>
              <p className="text-xl text-muted-foreground mb-6">
                Experience the future of AI-powered development. Our advanced algorithms 
                and neural network architecture deliver unparalleled performance and accuracy.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Response Time', value: '<100ms' },
                  { label: 'Accuracy', value: '99.8%' },
                  { label: 'Uptime', value: '99.99%' },
                  { label: 'Models', value: '15+' }
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    className="p-4 rounded-xl bg-card/50 backdrop-blur-sm"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                  >
                    <div className="text-2xl font-bold bg-gradient-to-r from-[#7B61FF] to-[#3B82F6] bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right - Image */}
            <motion.div
              className="rounded-3xl overflow-hidden shadow-3xl order-1 md:order-2"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative h-[500px] w-full">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1720962158883-b0f2021fb51e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwaW50ZXJmYWNlJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NTkyNDIwMzZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Futuristic Interface Technology"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tl from-[#3B82F6]/20 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Creators Section */}
      <section id="creators" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-4">Meet the Creators</h2>
            <p className="text-xl text-muted-foreground">
              Built by a passionate team dedicated to pushing the boundaries of AI
            </p>
          </motion.div>

          {/* Team Images */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <motion.div
              className="rounded-3xl overflow-hidden shadow-3xl"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative h-[350px] w-full">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1676276374429-3902f2666824?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbiUyMGRldmVsb3BlcnMlMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzU5MjQ5MTYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Team Collaboration Workspace"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-semibold mb-2">Collaborative Innovation</h3>
                  <p className="text-sm opacity-90">Working together to build the future of AI</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="rounded-3xl overflow-hidden shadow-3xl"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative h-[350px] w-full">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1681164315990-b2a1e375eb69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwdGVhbSUyMGVuZ2luZWVycyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU5MjQ5MTY0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Diverse Engineering Team"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-semibold mb-2">Diverse Expertise</h3>
                  <p className="text-sm opacity-90">Bringing together talents from around the world</p>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="max-w-4xl mx-auto p-12 rounded-3xl bg-card backdrop-blur-sm text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#7B61FF] to-[#3B82F6] flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-semibold mb-4">Nava AI Team</h3>
            <p className="text-muted-foreground text-lg mb-6">
              We're a team of engineers, designers, and AI researchers committed to 
              creating tools that empower creators and developers worldwide. Our diverse 
              backgrounds in machine learning, software engineering, and product design 
              come together to build experiences that are both powerful and accessible.
            </p>
            <div className="flex justify-center gap-3">
              {['Engineering', 'Design', 'AI Research', 'Product'].map((tag, i) => (
                <span
                  key={i}
                  className="px-4 py-2 rounded-full bg-muted text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of developers and creators using Nava AI to build the future
              
            </p>
            <button
              onClick={onNavigateToLogin}
              className="px-10 py-4 rounded-xl bg-gradient-to-r from-[#7B61FF] to-[#3B82F6] text-white text-lg shadow-glow-hover transition-all"
            >
              Start Creating Now
            </button>
          </motion.div>
        </div>

        {/* Background elements */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] bg-gradient-radial from-[#7B61FF]/20 to-transparent blur-3xl" />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground">
          <p>© 2025 Nava AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}; 