import React, { useState } from 'react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import {
    ArrowLeft,
    FileText,
    Eye,
    Copy,
    Check,
    Trash2,
    Play,
    Code
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMarkdownPreviewer } from '../../../controllers/useMarkdownPreviewer';

export const MarkdownPreviewer: React.FC = () => {
    const {
        markdown, setMarkdown,
        html,
        loadSample,
        clear,
        copyHtml,
        copyMarkdown
    } = useMarkdownPreviewer();

    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleCopy = async (type: 'markdown' | 'html') => {
        const success = type === 'markdown' ? await copyMarkdown() : await copyHtml();
        if (success) {
            setCopiedId(type);
            setTimeout(() => setCopiedId(null), 2000);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <Link to="/tools" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Tools
            </Link>

            <div className="max-w-7xl mx-auto h-[calc(100vh-200px)] min-h-[600px] flex flex-col">
                <div className="text-center mb-6 flex-shrink-0">
                    <h1 className="text-3xl font-bold mb-2">Markdown Previewer</h1>
                    <p className="text-slate-400">
                        Write Markdown and see the HTML result in real-time.
                    </p>
                </div>

                <div className="flex-1 grid lg:grid-cols-2 gap-6 min-h-0">
                    {/* Editor Column */}
                    <Card className="flex flex-col h-full overflow-hidden border-slate-700">
                        <div className="p-4 border-b border-slate-700 bg-slate-900/50 flex justify-between items-center flex-shrink-0">
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-blue-400" />
                                <h3 className="font-semibold text-slate-200">Editor</h3>
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={loadSample} variant="ghost" size="sm" icon={Play}>Sample</Button>
                                <Button onClick={clear} variant="ghost" size="sm" icon={Trash2}>Clear</Button>
                                <Button
                                    onClick={() => handleCopy('markdown')}
                                    variant="ghost"
                                    size="sm"
                                    icon={copiedId === 'markdown' ? Check : Copy}
                                >
                                    {copiedId === 'markdown' ? 'Copied' : 'Copy'}
                                </Button>
                            </div>
                        </div>
                        <textarea
                            value={markdown}
                            onChange={(e) => setMarkdown(e.target.value)}
                            placeholder="# Start typing markdown..."
                            className="flex-1 w-full bg-slate-950 p-4 text-slate-300 font-mono text-sm focus:outline-none resize-none"
                            spellCheck={false}
                        />
                    </Card>

                    {/* Preview Column */}
                    <Card className="flex flex-col h-full overflow-hidden border-slate-700">
                        <div className="p-4 border-b border-slate-700 bg-slate-900/50 flex justify-between items-center flex-shrink-0">
                            <div className="flex items-center gap-2">
                                <Eye className="w-4 h-4 text-green-400" />
                                <h3 className="font-semibold text-slate-200">Preview</h3>
                            </div>
                            <Button
                                onClick={() => handleCopy('html')}
                                variant="ghost"
                                size="sm"
                                icon={copiedId === 'html' ? Check : Code}
                            >
                                {copiedId === 'html' ? 'Copied HTML' : 'Copy HTML'}
                            </Button>
                        </div>
                        <div
                            className="flex-1 w-full bg-slate-50 dark:bg-slate-950 p-8 overflow-y-auto prose prose-slate max-w-none dark:prose-invert"
                            dangerouslySetInnerHTML={{ __html: html }}
                        />
                    </Card>
                </div>
            </div>
        </div>
    );
};
