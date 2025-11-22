import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { ArrowRight, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
    return (
        <section className="relative overflow-hidden py-20 lg:py-32">
            {/* Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-0 right-0 w-[800px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] -z-10" />

            <div className="container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/50 border border-slate-800 text-sm text-blue-400 mb-6">
                        <Sparkles className="h-4 w-4" />
                        <span>Welcome to the Simpleverse</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
                        One Ecosystem.<br />
                        Infinite Possibilities.
                    </h1>

                    <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
                        Discover a suite of powerful, intuitive applications designed to simplify your digital life. Built for performance, crafted for you.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button size="lg" icon={ArrowRight}>
                            Explore Apps
                        </Button>
                        <Button variant="outline" size="lg">
                            Learn More
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
