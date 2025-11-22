import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { toolsData } from '../../models/toolsData';

export const ToolsPage: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-20">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold mb-4">Developer Tools</h1>
                <p className="text-slate-400 max-w-2xl mx-auto">
                    A collection of simple, privacy-focused utilities to help with your daily tasks.
                    All processing happens locally in your browser.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {toolsData.map((tool, index) => (
                    <motion.div
                        key={tool.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Link to={tool.path}>
                            <Card hoverEffect className="h-full flex flex-col items-center text-center p-8">
                                <div className={`mb-6 p-4 rounded-full bg-slate-800/50 ${tool.color}`}>
                                    <tool.icon className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{tool.name}</h3>
                                <p className="text-slate-400">{tool.description}</p>
                            </Card>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
