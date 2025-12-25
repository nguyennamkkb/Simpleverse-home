import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { ExternalLink, Sparkles } from 'lucide-react';
import { appsData } from '../../models/appsData';

export const AppGrid: React.FC = () => {
    return (
        <section id="apps" className="py-20 bg-slate-50 dark:bg-slate-950">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-400 mb-4">
                        <Sparkles className="h-4 w-4" />
                        <span>Personal Projects</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
                    <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Applications I've built to solve real problems
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {appsData.map((app, index) => (
                        <motion.div
                            key={app.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card hoverEffect className="h-full flex flex-col">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
                                        {app.logo ? (
                                            <img 
                                                src={app.logo} 
                                                alt={app.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-purple-600 flex items-center justify-center">
                                                <app.icon className="h-8 w-8 text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                                        app.status === 'Live' 
                                            ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
                                            : app.status === 'Beta' 
                                            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' 
                                            : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                    }`}>
                                        {app.status}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold mb-2">{app.title}</h3>
                                
                                {app.stats && (
                                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">
                                        🔒 {app.stats}
                                    </p>
                                )}
                                
                                <p className="text-slate-600 dark:text-slate-400 mb-4 flex-grow">
                                    {app.description}
                                </p>

                                {app.features && (
                                    <div className="mb-4">
                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Key Features:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {app.features.map((feature) => (
                                                <span
                                                    key={feature}
                                                    className="text-xs px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                                                >
                                                    {feature}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {app.status === 'Coming Soon' ? (
                                    <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                        Coming Soon
                                    </span>
                                ) : (
                                    <a
                                        href={app.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                                    >
                                        View on App Store
                                        <ExternalLink className="h-4 w-4" />
                                    </a>
                                )}
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
