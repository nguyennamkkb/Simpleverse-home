import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';

export const Contact: React.FC = () => {
    return (
        <section id="contact" className="py-20 bg-white dark:bg-slate-950">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Let's Work Together</h2>
                        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Have a project in mind or want to collaborate? I'd love to hear from you.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Contact Info */}
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                    <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Email</h3>
                                    <a 
                                        href="mailto:nguyennam.kkb@gmail.com" 
                                        className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                    >
                                        nguyennam.kkb@gmail.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                                    <MapPin className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Location</h3>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        Vietnam 🇻🇳
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                                    <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Availability</h3>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        Open for freelance projects
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* CTA Card */}
                        <div className="p-8 rounded-2xl bg-blue-600 dark:bg-blue-700 text-white">
                            <h3 className="text-2xl font-bold mb-4">Ready to start?</h3>
                            <p className="mb-6 text-blue-50">
                                Let's discuss your project and see how I can help bring your ideas to life.
                            </p>
                            <a href="mailto:nguyennam.kkb@gmail.com">
                                <Button 
                                    size="lg" 
                                    className="w-full bg-white text-blue-600 hover:bg-blue-50"
                                >
                                    Send me an email
                                </Button>
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
