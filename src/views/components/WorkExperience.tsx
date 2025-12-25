import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Briefcase } from 'lucide-react';
import { Card } from '../ui/Card';

const workApps = [
    {
        name: 'PicTrace: AR Drawing & Sketch',
        company: 'AMOBEAR',
        description: 'AR drawing app that lets users trace and sketch using augmented reality. Turn photos into outlines and create stunning artworks.',
        link: 'https://apps.apple.com/vn/app/pictrace-ar-drawing-sketch/id6504559449?l=vi',
        logo: 'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/cc/d2/76/ccd27624-7376-5174-1ff2-50d4a8b6e67b/Placeholder.mill/200x200bb-75.webp',
        stats: 'Millions of users worldwide',
        features: ['AR Drawing', 'Photo to Sketch', 'Video Recording', 'Template Library'],
    },
    {
        name: 'Smart Cast: Mirror To PC & TV',
        company: 'AMOBEAR',
        description: 'Screen mirroring app that displays photos, videos, and entire phone screen to TV, PC, or MacBook. Perfect for presentations and entertainment.',
        link: 'https://apps.apple.com/vn/app/smart-cast-mirror-to-pc-tv/id6743468411?l=vi',
        logo: 'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/55/3b/89/553b8980-8347-07c7-4be2-a44e8ce73fe2/Placeholder.mill/200x200bb-75.webp',
        stats: 'Millions of users worldwide',
        features: ['Screen Mirroring', 'Cast Media', 'Whiteboard Mode', 'Multi-device Support'],
    },
    {
        name: 'FacePlus: AI Face Editor',
        company: 'AMOBEAR',
        description: 'AI-powered photo editor that enhances natural beauty with realistic transformations. Features hairstyle makeover and face enhancement.',
        link: 'https://apps.apple.com/vn/app/faceplus-ai-face-editor/id6749175026?l=vi',
        logo: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/a8/77/71/a877719f-c843-80de-1eb3-5ff15824b809/AppIcon-0-0-1x_U007emarketing-0-7-0-85-220.png/200x200ia-75.webp',
        stats: 'Millions of users worldwide',
        features: ['AI Face Enhancement', 'Hairstyle Makeover', 'Natural Filters', 'Beard & Glasses Styles'],
    },
];

export const WorkExperience: React.FC = () => {
    return (
        <section className="py-20 bg-white dark:bg-slate-950">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-400 mb-4">
                        <Briefcase className="h-4 w-4" />
                        <span>Professional Work</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Work at AMOBEAR</h2>
                    <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        iOS applications I've developed for AMOBEAR, reaching thousands of users worldwide
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {workApps.map((app, index) => (
                        <motion.div
                            key={app.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card hoverEffect className="h-full flex flex-col">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
                                        <img 
                                            src={app.logo} 
                                            alt={app.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                        {app.company}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold mb-2">{app.name}</h3>
                                
                                {app.stats && (
                                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">
                                        📊 {app.stats}
                                    </p>
                                )}
                                
                                <p className="text-slate-600 dark:text-slate-400 mb-4 flex-grow">
                                    {app.description}
                                </p>

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

                                <a
                                    href={app.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                                >
                                    View on App Store
                                    <ExternalLink className="h-4 w-4" />
                                </a>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
