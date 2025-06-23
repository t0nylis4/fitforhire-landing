import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { 
  Upload, 
  FileText, 
  Sparkles, 
  Check, 
  Zap, 
  Shield, 
  Heart,
  Target,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";
import logoPath from "@assets/Rez_1750286009878.png";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address 📧"),
});

type EmailForm = z.infer<typeof emailSchema>;

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

function WaitlistForm({ className = "", buttonText = "Join NOW 🔥" }: { className?: string; buttonText?: string }) {
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);
  
  const form = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" }
  });

  const { data: waitlistData } = useQuery({
    queryKey: ["/api/waitlist/count"],
  });

  const waitlistMutation = useMutation({
    mutationFn: (data: EmailForm) => apiRequest("POST", "/api/waitlist", data),
    onSuccess: async () => {
      setIsSuccess(true);
      form.reset();
      toast({
        title: "Welcome aboard! 🎉",
        description: "You're now on the waitlist for early access!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/waitlist/count"] });
      setTimeout(() => setIsSuccess(false), 3000);
    },
    onError: (error: any) => {
      const message = error.message.includes("already on our waitlist") 
        ? "You're already on our waitlist! 🎉"
        : "Something went wrong. Please try again! 😅";
      toast({
        title: "Oops!",
        description: message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EmailForm) => {
    waitlistMutation.mutate(data);
  };

  const currentCount = waitlistData?.count || 2500;

  return (
    <Card className={`bg-white/95 backdrop-blur-sm border-0 shadow-2xl ${className}`}>
      <CardContent className="p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              {...form.register("email")}
              type="email"
              placeholder="Enter your email 📧"
              className="flex-1 px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-0 h-auto"
              disabled={waitlistMutation.isPending}
            />
            <Button
              type="submit"
              disabled={waitlistMutation.isPending || isSuccess}
              className={`px-8 py-4 text-lg font-bold rounded-xl h-auto transition-all duration-300 transform hover:scale-105 ${
                isSuccess 
                  ? "bg-green-500 hover:bg-green-600" 
                  : "bg-gray-900 hover:bg-gray-800 text-white"
              }`}
            >
              {waitlistMutation.isPending ? (
                "Joining... ⚡"
              ) : isSuccess ? (
                "Welcome aboard! 🎉"
              ) : (
                buttonText.replace("2,500+", `${currentCount.toLocaleString()}+`)
              )}
            </Button>
          </div>
          
          {form.formState.errors.email && (
            <p className="text-red-500 text-sm mt-2">{form.formState.errors.email.message}</p>
          )}
          
          <p className="text-sm text-gray-600 text-center">Free Trial  •  Get early access  •  No spam, we promise</p>
        </form>
      </CardContent>
    </Card>
  );
}

function StepCard({ step, icon, title, description, delay = 0 }: {
  step: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Card className="h-full bg-gradient-to-br from-cyan-50 to-purple-50 border-0 shadow-lg hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300">
        <CardContent className="p-8 text-center h-full flex flex-col">
          <motion.div 
            className="bg-gradient-to-r from-cyan-400 to-purple-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl group-hover:scale-110 transition-transform duration-300 text-white"
            whileHover={{ rotate: 10 }}
          >
            {icon}
          </motion.div>
          <div className="bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-sm">
            {step}
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
          <p className="text-gray-600 flex-grow ml-[-13px] mr-[-13px] text-[19px]">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function PainPointCard({ icon, quote, name, delay = 0 }: {
  icon: string;
  quote: string;
  name: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
    >
      <Card className="h-full bg-white border-l-4 border-cyan-400 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6 h-full flex flex-col">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-100 to-purple-100 flex items-center justify-center mr-4 text-2xl">
              {icon}
            </div>
            <div className="text-cyan-600 font-semibold text-sm">COMMON PAIN POINT</div>
          </div>
          <p className="text-gray-700 mb-4 text-lg flex-grow italic">"{quote}"</p>
          <div className="bg-gray-50 p-3 rounded-lg border">
            <div className="font-semibold text-gray-900 text-center">{name}</div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function FAQItem({ question, answer, delay = 0 }: {
  question: string;
  answer: string;
  delay?: number;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="border border-gray-200 rounded-lg"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-6 flex justify-between items-center hover:bg-gray-50 transition-colors"
      >
        <h3 className="text-lg font-semibold text-gray-900">{question}</h3>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="px-6 pb-6"
        >
          <p className="text-gray-600 leading-relaxed">{answer}</p>
        </motion.div>
      )}
    </motion.div>
  );
}

function AIResumePreviewSlider() {
  const [sliderValue, setSliderValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const resumeStages = [
    {
      title: "Original Resume",
      description: "Generic student resume",
      content: {
        name: "John Smith",
        title: "Computer Science Student",
        sections: [
          { label: "Experience", items: ["Part-time job", "Another job", "Internship"] },
          { label: "Skills", items: ["JavaScript", "Python", "React"] },
          { label: "Education", items: ["University of State", "Computer Science"] }
        ]
      },
      color: "red",
      result: "0 responses"
    },
    {
      title: "AI Analysis",
      description: "AI identifies key improvements",
      content: {
        name: "John Smith",
        title: "Computer Science Student",
        sections: [
          { label: "Experience", items: ["Part-time job ⚡", "Another job ⚡", "Internship ⚡"] },
          { label: "Skills", items: ["JavaScript ⚡", "Python ⚡", "React ⚡"] },
          { label: "Education", items: ["University of State ⚡", "Computer Science ⚡"] }
        ]
      },
      color: "yellow",
      result: "Analyzing..."
    },
    {
      title: "Optimized Resume",
      description: "Tailored for Software Engineer position",
      content: {
        name: "John Smith",
        title: "Software Engineering Intern",
        sections: [
          { label: "Relevant Experience", items: ["Full-Stack Development", "React Application Builder", "Python Backend Developer"] },
          { label: "Technical Skills", items: ["JavaScript (ES6+)", "Python & Django", "React & Node.js"] },
          { label: "Projects & Education", items: ["CS Degree - State University", "Web Development Projects"] }
        ]
      },
      color: "green",
      result: "3+ interviews"
    }
  ];

  const currentStage = Math.round((sliderValue / 100) * (resumeStages.length - 1));

  const playAnimation = () => {
    setIsAnimating(true);
    setSliderValue(0);
    
    const animateToEnd = () => {
      const duration = 3000;
      const steps = 30;
      const stepSize = 100 / steps;
      const stepDuration = duration / steps;
      
      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        setSliderValue(currentStep * stepSize);
        
        if (currentStep >= steps) {
          clearInterval(timer);
          setIsAnimating(false);
        }
      }, stepDuration);
    };
    
    setTimeout(animateToEnd, 500);
  };

  const resetSlider = () => {
    setSliderValue(0);
    setIsAnimating(false);
  };

  const stage = resumeStages[currentStage];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Resume Preview */}
      <motion.div
        key={currentStage}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative mb-6"
      >
        <div className={`border-2 rounded-xl p-4 shadow-xl transition-all duration-500 ${
          stage.color === 'red' ? 'border-red-200 bg-red-50' :
          stage.color === 'yellow' ? 'border-cyan-200 bg-cyan-50' :
          'border-green-200 bg-green-50'
        }`}>
          {/* Resume Content */}
          <div className="bg-white rounded-lg p-4 mb-3">
            <div className="text-center mb-3">
              <h3 className="text-base font-bold text-gray-900">{stage.content.name}</h3>
              <p className="text-sm text-gray-600">{stage.content.title}</p>
              <div className={`h-1 rounded mt-2 ${
                stage.color === 'red' ? 'bg-gray-200' :
                stage.color === 'yellow' ? 'bg-gradient-to-r from-cyan-200 to-cyan-400' :
                'bg-gradient-to-r from-cyan-500 to-purple-600'
              }`}></div>
            </div>
            
            {stage.content.sections.map((section, idx) => (
              <div key={idx} className="mb-2">
                <h4 className="text-xs font-semibold text-gray-800 mb-1">{section.label}</h4>
                {section.items.map((item, itemIdx) => (
                  <div key={itemIdx} className={`text-xs p-1 mb-1 rounded ${
                    stage.color === 'red' ? 'bg-gray-100' :
                    stage.color === 'yellow' ? 'bg-cyan-100' :
                    ['bg-green-100', 'bg-blue-100', 'bg-purple-100'][itemIdx % 3]
                  }`}>
                    {item}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Stage Info */}
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-bold text-gray-900">{stage.title}</h4>
              <p className="text-xs text-gray-600">{stage.description}</p>
            </div>
            <div className={`text-right text-sm font-semibold ${
              stage.color === 'red' ? 'text-red-600' :
              stage.color === 'yellow' ? 'text-cyan-600' :
              'text-green-600'
            }`}>
              {stage.color === 'red' ? '❌' : stage.color === 'yellow' ? '⚡' : '✅'} {stage.result}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Progress Indicator */}
      <div className="flex justify-center mb-4">
        <div className="flex space-x-2">
          {resumeStages.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentStage 
                  ? 'bg-cyan-400 scale-125' 
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center items-center gap-3 mb-4">
        <Button
          onClick={playAnimation}
          disabled={isAnimating}
          className="bg-white hover:bg-gray-100 text-black font-medium px-4 py-2 rounded-full transition-all duration-200 border border-gray-300 text-sm"
        >
          {isAnimating ? (
            <>
              <Pause className="w-3 h-3 mr-2" />
              Transforming...
            </>
          ) : (
            <>
              <Play className="w-3 h-3 mr-2" />
              Watch AI Transform
            </>
          )}
        </Button>
        
        <Button
          onClick={resetSlider}
          variant="outline"
          className="border-gray-300 hover:bg-gray-50 px-3 py-2 rounded-full transition-all duration-200 text-sm"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Reset
        </Button>
      </div>

      {/* Slider */}
      <div>
        <input
          type="range"
          min="0"
          max="100"
          value={sliderValue}
          onChange={(e) => !isAnimating && setSliderValue(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${sliderValue}%, #e5e7eb ${sliderValue}%, #e5e7eb 100%)`
          }}
        />
        
        <div className="flex justify-between mt-1 text-xs text-gray-600">
          <span>Original</span>
          <span>AI Analysis</span>
          <span>Optimized</span>
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  const painPoints = [
    {
      icon: "😤",
      quote: "I keep applying, but no one ever gets back to me. It's like sending my resume into the void.",
      name: "Emma Shimak"
    },
    {
      icon: "⏰",
      quote: "Applying takes forever. Why do I have to tailor everything from scratch every time?",
      name: "Adam Jamber"
    },
    {
      icon: "🤷‍♀️",
      quote: "I never know if my resume actually matches what they're looking for. It's just guesswork.",
      name: "Lukas Randall"
    }
  ];

  const faqs = [
    {
      question: "How does FitForHire work?",
      answer: "Simply upload your current resume and paste any job description. Our AI analyzes both documents and creates a perfectly tailored resume that highlights exactly what that specific employer is looking for."
    },
    {
      question: "Is FitForHire really free?",
      answer: "Yes! We're committed to helping students land their first jobs. You can try your first resume optimization for free."
    },
    {
      question: "How is this different from ChatGPT?",
      answer: "Unlike generic AI tools, FitForHire is purpose-built for resume optimization. We understand entry-level challenges and focus specifically on helping students and recent graduates showcase their potential to employers."
    },
    {
      question: "Will employers know I used AI?",
      answer: "No. FitForHire enhances your existing experience and skills - it doesn't create fake content. The optimized resume is still authentically you, just presented in the best possible way for each job."
    },
    {
      question: "How long does it take to get results?",
      answer: "Instantly! Upload your resume, paste a job description, and get your optimized resume in seconds. No waiting, no delays - perfect for when you need to apply quickly."
    },
    {
      question: "What if I don't have much experience?",
      answer: "That's exactly why we built FitForHire! We specialize in helping students and recent grads highlight their potential, projects, coursework, and transferable skills in ways that impress employers."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
            >
              <img 
                src={logoPath} 
                alt="FitForHire Logo" 
                className="h-12 w-12"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">FitForHire</span>
            </motion.div>
            <div className="hidden md:flex items-center space-x-6">
              <button 
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-700 hover:text-cyan-600 font-medium transition-colors duration-200"
              >
                How It Works
              </button>
              <button 
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-700 hover:text-cyan-600 font-medium transition-colors duration-200"
              >
                Features
              </button>
              <button 
                onClick={() => document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-700 hover:text-cyan-600 font-medium transition-colors duration-200"
              >
                The Problem
              </button>
              <button 
                onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-700 hover:text-cyan-600 font-medium transition-colors duration-200"
              >
                FAQ
              </button>
              <Button 
                onClick={() => document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold px-6 py-2 rounded-full transition-all duration-300"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-cyan-500 to-purple-600 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <motion.div 
              className="text-center lg:text-left space-y-6"
              variants={stagger}
              initial="initial"
              animate="animate"
            >
              <motion.h1 
                className="text-6xl sm:text-7xl lg:text-8xl font-black leading-tight text-[#ffffff]"
                variants={fadeInUp}
              >
                Tailor Your Resume. Fit The Job.{" "}
                <motion.span 
                  className="inline-block"
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                >
                  💼
                </motion.span>
              </motion.h1>
              
              <motion.p 
                className="text-lg sm:text-xl font-medium text-[#ffffff]"
                variants={fadeInUp}
              >
                The all-in-one AI platform to customize your resume, boost your keywords, and land the interview. Our AI-enhanced resume optimization matches your skills to any job description in seconds.{" "}
                <span className="inline-block">🎯</span>
              </motion.p>
              
              <motion.div variants={fadeInUp}>
                <WaitlistForm className="max-w-lg" />
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <AIResumePreviewSlider />
            </motion.div>
          </div>
        </div>
      </section>
      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">
              How It Works{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                ⚡
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three simple steps to transform your resume from basic to absolutely irresistible to recruiters 🔥
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              step={1}
              icon={<Upload className="w-8 h-8 text-gray-900" />}
              title="Upload Your Resume"
              description="Drop your current resume and let our AI analyze your experience, skills, and achievements 📊"
              delay={0.1}
            />
            
            <StepCard
              step={2}
              icon={<FileText className="w-8 h-8 text-gray-900" />}
              title="Paste Job Description"
              description="Copy any job posting you're interested in. Our AI will decode exactly what they're looking for 🎯"
              delay={0.2}
            />
            
            <StepCard
              step={3}
              icon={<Sparkles className="w-8 h-8 text-gray-900" />}
              title="Get AI-Tailored Resume"
              description="Receive a perfectly optimized resume that highlights exactly what recruiters want to see 🚀"
              delay={0.3}
            />
          </div>
        </div>
      </section>
      {/* Why FitForHire is Different Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">
              Why{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                FitForHire
              </span>{" "}
              is Different 🔥
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto pl-[12px] pr-[12px]">
              We're not like other tools. Here's what makes us unique for students and recent grads.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* What We're NOT */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold text-red-600 mb-6 flex items-center">
                <span className="text-3xl mr-3">❌</span>
                What We're NOT
              </h3>
              <div className="space-y-4">
                <div className="flex items-start p-4 bg-red-50 border border-red-200 rounded-lg">
                  <span className="text-2xl mr-3 mt-1">❌</span>
                  <div>
                    <div className="font-semibold text-red-800">Another resume builder</div>
                    <div className="text-red-600">We don't make you start from scratch</div>
                  </div>
                </div>
                <div className="flex items-start p-4 bg-red-50 border border-red-200 rounded-lg">
                  <span className="text-2xl mr-3 mt-1">❌</span>
                  <div>
                    <div className="font-semibold text-red-800">Another ChatGPT copy-paste</div>
                    <div className="text-red-600">We're purpose-built for resume optimization</div>
                  </div>
                </div>
                <div className="flex items-start p-4 bg-red-50 border border-red-200 rounded-lg">
                  <span className="text-2xl mr-3 mt-1">❌</span>
                  <div>
                    <div className="font-semibold text-red-800">Made for people with 10 years of experience</div>
                    <div className="text-red-600">We understand entry-level challenges</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* What We ARE */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-2xl font-bold text-green-600 mb-6 flex items-center">
                <span className="text-3xl mr-3">✅</span>
                What We ARE
              </h3>
              <div className="space-y-4">
                <div className="flex items-start p-4 bg-green-50 border border-green-200 rounded-lg">
                  <span className="text-2xl mr-3 mt-1">✅</span>
                  <div>
                    <div className="font-semibold text-green-800">We take your current resume</div>
                    <div className="text-green-600">Start with what you already have</div>
                  </div>
                </div>
                <div className="flex items-start p-4 bg-green-50 border border-green-200 rounded-lg">
                  <span className="text-2xl mr-3 mt-1">✅</span>
                  <div>
                    <div className="font-semibold text-green-800">We tailor it to each job posting</div>
                    <div className="text-green-600">Smart optimization for every application</div>
                  </div>
                </div>
                <div className="flex items-start p-4 bg-green-50 border border-green-200 rounded-lg">
                  <span className="text-2xl mr-3 mt-1">✅</span>
                  <div>
                    <div className="font-semibold text-green-800">Built for students & recent grads</div>
                    <div className="text-green-600">Designed for first-time job seekers</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Testimonial/Validation Section */}
      <section id="problem" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">
              The{" "}
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-[#16a6d6]">
                Problem
              </span>{" "}
              😤
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-[18px]">We surveyed 75+ students about their job application struggles. Here's what we found:</p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {painPoints.map((painPoint, index) => (
              <PainPointCard
                key={index}
                {...painPoint}
                delay={index * 0.1}
              />
            ))}
          </div>
          
          {/* Survey Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-white border-0 shadow-xl">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-3 gap-8 text-center">
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <div className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mb-2">
                      75+
                    </div>
                    <div className="text-xl font-semibold text-gray-900">Survey Responses</div>
                    <div className="text-gray-600">Students surveyed</div>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <div className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mb-2">92%</div>
                    <div className="text-xl font-semibold text-gray-900">Want Resume Help</div>
                    <div className="text-gray-600">AI can be a game-changer</div>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <div className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mb-2">87%</div>
                    <div className="text-xl font-semibold text-gray-900">Would Recommend</div>
                    <div className="text-gray-600">Tell a friend</div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                Questions
              </span>{" "}
              🤔
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-[21px]">
              Got questions? We've got answers! Here's everything you need to know about FitForHire.
            </p>
          </motion.div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>
      {/* Final CTA Section */}
      <section id="signup" className="bg-gradient-to-br from-cyan-500 to-purple-600 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 text-[#ffffff]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Ready to get noticed?
          </motion.h2>
          
          <motion.p 
            className="text-xl sm:text-2xl font-medium mb-12 text-[#ffffff]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >Join early users discovering a smarter way to get hired.</motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <WaitlistForm 
              className="max-w-2xl mx-auto mb-6" 
              buttonText="Get Early Access 🔥"
            />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm text-gray-700 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                Free Trial
              </div>
              <div className="flex items-center justify-center gap-2">
                <Zap className="w-4 h-4 text-yellow-600" />
                Instant Results
              </div>
              <div className="flex items-center justify-center gap-2">
                <Shield className="w-4 h-4 text-blue-600" />
                Secure & Private
              </div>
              <div className="flex items-center justify-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                Student Built
              </div>
            </div>
          </motion.div>
          
          
        </div>
      </section>
      {/* Footer */}
      <footer className="text-white py-12 px-4 sm:px-6 lg:px-8 bg-[#ffffff]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <img 
                src={logoPath} 
                alt="FitForHire Logo" 
                className="h-16 w-16"
              />
              <span className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                FitForHire
              </span>
            </div>
            <p className="mb-6 text-[#030000]">
              Built by students, for students. Let's land those interviews together! 💪
            </p>
            <div className="text-center text-[#030000] mb-4">
              <p className="text-sm">Contact: <a href="mailto:tonylisenko4@gmail.com" className="hover:text-cyan-400 transition-colors underline">tonylisenko4@gmail.com</a></p>
            </div>
            <p className="text-sm text-[#050000]">© 2025 FitForHire. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
