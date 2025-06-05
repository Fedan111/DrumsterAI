import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Play, Check, Star, Volume2, Headphones, Music, Zap } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
const Index = () => {
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisibleSections(prev => new Set([...prev, entry.target.id]));
        }
      });
    }, {
      threshold: 0.2
    });
    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  const isVisible = (id: string) => visibleSections.has(id);
  return <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-md border-b border-cyan-500/20">
        <div className="container rounded-none px-[38px] mx-0 py-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img src="/lovable-uploads/9835b3c5-0451-42ee-a941-7fc6fe76e08a.png" alt="Drumster Logo" className="h-15 w-auto md:h-20 lg:h-20 object-contain drop-shadow-lg transition-all duration-300 hover:scale-105" />
            </div>
            <div className="hidden md:flex space-x-8">
              {['Features', 'How It Works', 'Pricing', 'FAQ'].map(item => <button key={item} onClick={() => scrollToSection(item.toLowerCase().replace(' ', '-'))} className="text-gray-300 hover:text-cyan-400 transition-colors duration-300">
                  {item}
                </button>)}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Video Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <iframe src="https://player.cloudinary.com/embed/?cloud_name=dtnd3scay&public_id=jkpky1plw5op7mublfkm&player[autoplay]=true&player[autoplayMode]=on-scroll&player[muted]=true&player[loop]=true&player[controls]=false&player[hideContextMenu]=true" className="w-full h-full object-cover" style={{
          transform: `translateY(${scrollY * 0.3}px)`
        }} allow="autoplay; fullscreen; encrypted-media; picture-in-picture" allowFullScreen />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 grid md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Content */}
          <div className="text-left animate-fade-in px-[32px]">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Welcome to Drumster
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-4">
              your personal Drum Tutor
            </p>
            <p className="text-lg text-cyan-400 mb-8 font-semibold">
              Learn. Play. Progress.
            </p>
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-8 py-4 text-lg rounded-lg shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105" onClick={() => scrollToSection('pricing')}>
              Get Started
              <Play className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Right Side - Drum Assistant */}
          <div className="flex justify-center mx-[9px] my-0 px-[7px] py-[24px] rounded-none">
            <button className="relative group transition-all duration-300 transform hover:scale-110" onClick={() => alert('Voice Assistant coming soon!')}>
              <img src="/lovable-uploads/7e5b121c-544e-4d63-92e1-173bf29e0111.png" alt="Drum Assistant" className="w-64 h-64 object-contain drop-shadow-2xl animate-bounce-slow" />
              <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-xl group-hover:bg-cyan-400/40 transition-all duration-300 px-0 mx-[18px]" />
              
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-cyan-400" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-6">
          <h2 className={`text-4xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent transition-all duration-1000 ${isVisible('features-title') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} id="features-title" data-animate>
            Powerful Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[{
            icon: Zap,
            title: "Real-Time Feedback",
            desc: "Get instant analysis of your drumming performance",
            delay: "delay-100"
          }, {
            icon: Music,
            title: "Sync With Your Songs",
            desc: "Play along with any track in your library",
            delay: "delay-200"
          }, {
            icon: Headphones,
            title: "Drum-to-MIDI Conversion",
            desc: "Convert your beats into digital format",
            delay: "delay-300"
          }, {
            icon: Star,
            title: "Interactive Lessons",
            desc: "Learn with AI-powered progressive lessons",
            delay: "delay-400"
          }].map((feature, i) => <Card key={i} className={`bg-gray-800/50 border-cyan-500/20 hover:border-cyan-400/50 transition-all duration-700 transform group ${isVisible('features-title') ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'} ${feature.delay}`} data-animate>
                <CardHeader className="text-center">
                  <feature.icon className={`h-12 w-12 text-cyan-400 mx-auto mb-4 group-hover:text-cyan-300 transition-all duration-500 transform ${isVisible('features-title') ? 'animate-icon-bounce' : ''}`} />
                  <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-center">{feature.desc}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-800">
        <div className="container mx-auto px-6">
          <h2 className={`text-4xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent transition-all duration-1000 ${isVisible('works-title') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} id="works-title" data-animate>
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[{
            step: "01",
            title: "Upload a Song",
            desc: "Choose any track from your music library",
            delay: "delay-100"
          }, {
            step: "02",
            title: "AI Analysis",
            desc: "Our AI analyzes the drum patterns and tempo",
            delay: "delay-200"
          }, {
            step: "03",
            title: "Play with Guidance",
            desc: "Follow along with real-time visual cues",
            delay: "delay-300"
          }].map((step, i) => <div key={i} className={`text-center group transition-all duration-700 transform ${isVisible('works-title') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${step.delay}`} data-animate>
                <div className={`w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white transition-all duration-500 transform ${isVisible('works-title') ? 'animate-icon-pulse group-hover:scale-110' : 'scale-90'}`}>
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">{step.title}</h3>
                <p className="text-gray-400">{step.desc}</p>
              </div>)}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="container mx-auto px-6">
          <h2 className={`text-4xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent transition-all duration-1000 ${isVisible('pricing-title') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} id="pricing-title" data-animate>
            Choose Your Plan
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[{
            name: "Free",
            price: "$0",
            features: ["5 songs per month", "Basic lessons", "Community support"],
            popular: false,
            delay: "delay-100"
          }, {
            name: "Pro",
            price: "$9.99",
            features: ["Unlimited songs", "Advanced lessons", "Real-time feedback", "Priority support"],
            popular: true,
            delay: "delay-200"
          }, {
            name: "Ultimate",
            price: "$19.99",
            features: ["Everything in Pro", "AI coaching", "Custom lessons", "1-on-1 sessions"],
            popular: false,
            delay: "delay-300"
          }].map((plan, i) => <Card key={i} className={`relative bg-gray-800/50 border-2 transition-all duration-700 transform ${plan.popular ? 'border-cyan-400 shadow-lg shadow-cyan-400/25' : 'border-gray-600 hover:border-cyan-500/50'} ${isVisible('pricing-title') ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'} ${plan.delay}`} data-animate>
                {plan.popular && <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-white">{plan.name}</CardTitle>
                  <div className="text-4xl font-bold text-cyan-400">{plan.price}</div>
                  <CardDescription className="text-gray-400">per month</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {plan.features.map((feature, j) => <div key={j} className="flex items-center space-x-2">
                      <Check className={`h-5 w-5 text-cyan-400 transition-all duration-500 ${isVisible('pricing-title') ? 'animate-icon-check' : ''}`} style={{
                  animationDelay: `${j * 100}ms`
                }} />
                      <span className="text-gray-300">{feature}</span>
                    </div>)}
                  <Button className={`w-full mt-6 ${plan.popular ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400' : 'bg-gray-700 hover:bg-gray-600'} transition-all duration-300`}>
                    Subscribe
                  </Button>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-800">
        <div className="container mx-auto px-6">
          <h2 className={`text-4xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent transition-all duration-1000 ${isVisible('testimonials-title') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} id="testimonials-title" data-animate>
            What Our Users Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[{
            name: "Alex Johnson",
            role: "Beginner Drummer",
            quote: "Drumster transformed my learning experience. The AI feedback is incredible!",
            delay: "delay-100"
          }, {
            name: "Sarah Chen",
            role: "Music Teacher",
            quote: "I use Drumster with all my students. The progress tracking is fantastic.",
            delay: "delay-200"
          }, {
            name: "Mike Rodriguez",
            role: "Professional Drummer",
            quote: "Even as a pro, Drumster helps me stay sharp and learn new techniques.",
            delay: "delay-300"
          }].map((testimonial, i) => <Card key={i} className={`bg-gray-800/50 border-cyan-500/20 hover:border-cyan-400/50 transition-all duration-700 transform ${isVisible('testimonials-title') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${testimonial.delay}`} data-animate>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, j) => <Star key={j} className={`h-5 w-5 text-yellow-400 fill-current transition-all duration-500 ${isVisible('testimonials-title') ? 'animate-icon-star' : ''}`} style={{
                  animationDelay: `${j * 100}ms`
                }} />)}
                  </div>
                  <p className="text-gray-300 mb-4 italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="text-white font-semibold">{testimonial.name}</p>
                    <p className="text-cyan-400 text-sm">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className={`text-4xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent transition-all duration-1000 ${isVisible('faq-title') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} id="faq-title" data-animate>
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className={`space-y-4 transition-all duration-1000 ${isVisible('faq-title') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`} data-animate>
            {[{
            q: "Do I need acoustic drums to use Drumster?",
            a: "No! Drumster works with electronic drums, practice pads, or even just your hands on any surface."
          }, {
            q: "What devices are supported?",
            a: "Drumster works on desktop, tablet, and mobile devices. Our web app is fully responsive."
          }, {
            q: "Can I cancel my subscription anytime?",
            a: "Yes, you can cancel your subscription at any time with no cancellation fees."
          }, {
            q: "Is there a free trial?",
            a: "Yes! Our Free plan gives you access to basic features with 5 songs per month."
          }].map((item, i) => <AccordionItem key={i} value={`item-${i}`} className="border border-gray-700 rounded-lg px-6 bg-gray-800/30">
                <AccordionTrigger className="text-white hover:text-cyan-400 transition-colors">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-gray-400">
                  {item.a}
                </AccordionContent>
              </AccordionItem>)}
          </Accordion>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className={`py-20 bg-gradient-to-r from-cyan-600 to-blue-600 transition-all duration-1000 ${isVisible('cta-section') ? 'opacity-100' : 'opacity-0'}`} id="cta-section" data-animate>
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Drumming Journey?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of drummers who are already improving with Drumster</p>
          <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105" onClick={() => scrollToSection('pricing')}>
            Start Learning Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-8">
        <div className="container mx-auto px-6 text-center">
          <div className="backdrop-blur-sm rounded-lg p-3 border border-cyan-500/30 shadow-lg shadow-cyan-500/20 inline-block mb-4 bg-slate-950">
            <img src="/lovable-uploads/f3fa6ba6-a67c-485c-bc62-27e1ca12d9ab.png" alt="Drumster Logo" className="h-10 w-auto md:h-12 object-contain drop-shadow-lg" />
          </div>
          <p className="text-gray-400">© 2025 Drumster. All rights reserved.</p>
        </div>
      </footer>
    </div>;
};
export default Index;