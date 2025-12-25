import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';

export const Hero: React.FC = () => {
    return (
        <section className="relative overflow-hidden py-20 lg:py-32">
            {/* Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-500/20 dark:bg-blue-500/20 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-0 right-0 w-[800px] h-[400px] bg-purple-500/10 dark:bg-purple-500/10 rounded-full blur-[100px] -z-10" />

            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-800 text-sm text-blue-600 dark:text-blue-400 mb-6 mx-auto">
                            <span>👋 Hi, I'm Nam Nguyen</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
                            <span className="text-slate-900 dark:text-white">
                                iOS Developer &<br />
                                Product Builder
                            </span>
                        </h1>

                        <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed max-w-2xl mx-auto">
                            I create valuable applications that truly serve users' needs. 
                            Focused on privacy, simplicity, and user experience.
                        </p>

                        <div className="flex flex-wrap gap-4 mb-8 justify-center">
                            <a href="#apps">
                                <Button size="lg" icon={ArrowRight}>
                                    View My Work
                                </Button>
                            </a>
                            <a href="#contact">
                                <Button variant="outline" size="lg">
                                    Get in Touch
                                </Button>
                            </a>
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-4 justify-center">
                            <a 
                                href="mailto:nguyennam.kkb@gmail.com" 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                aria-label="Email"
                            >
                                <Mail className="h-5 w-5" />
                            </a>
                            <a 
                                href="https://github.com/nguyennamkkb" 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                aria-label="GitHub"
                            >
                                <Github className="h-5 w-5" />
                            </a>
                            <a 
                                href="https://www.linkedin.com/in/nguyenluongnam" 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="h-5 w-5" />
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
