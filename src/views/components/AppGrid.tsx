import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ExternalLink } from 'lucide-react';
import { appsData } from '../../models/appsData';

export const AppGrid: React.FC = () => {
    return (
        <section id="apps" className="py-20 bg-slate-950">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">The Simpleverse Ecosystem</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        A suite of interconnected applications designed to simplify your digital life.
                        Secure, private, and open-source.
                    </p>
                </div>

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
                                <div className="flex items-start justify-between mb-6">
                                    <div className={`p-3 rounded-xl bg-slate-800/50 ${app.color}`}>
                                        <app.icon className="h-6 w-6" />
                                    </div>
                                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${app.status === 'Live' ? 'bg-green-500/10 text-green-400' :
                                            app.status === 'Beta' ? 'bg-blue-500/10 text-blue-400' :
                                                'bg-slate-800 text-slate-400'
                                        }`}>
                                        {app.status}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold mb-2">{app.title}</h3>
                                <p className="text-slate-400 mb-6 flex-grow">{app.description}</p>

                                <Button variant="secondary" className="w-full group" disabled={app.status === 'Coming Soon'}>
                                    {app.status === 'Coming Soon' ? 'Notify Me' : 'Launch App'}
                                    {app.status !== 'Coming Soon' && <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                                </Button>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
