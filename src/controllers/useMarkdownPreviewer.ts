import { useState, useEffect } from 'react';
import { marked } from 'marked';

export const useMarkdownPreviewer = () => {
    const [markdown, setMarkdown] = useState('');
    const [html, setHtml] = useState('');

    // Configure marked for security and features
    useEffect(() => {
        marked.setOptions({
            gfm: true, // GitHub Flavored Markdown
            breaks: true, // Convert \n to <br>
        });
    }, []);

    // Update HTML when markdown changes
    useEffect(() => {
        const parseMarkdown = async () => {
            try {
                const parsed = await marked.parse(markdown);
                setHtml(parsed);
            } catch (error) {
                console.error('Markdown parsing error:', error);
                setHtml('<p style="color: red;">Error parsing markdown</p>');
            }
        };
        parseMarkdown();
    }, [markdown]);

    const loadSample = () => {
        setMarkdown(`# Hello Markdown!

This is a **bold** text and this is *italic*.

## Lists
- Item 1
- Item 2
  - Subitem 2.1

## Code Block
\`\`\`javascript
function hello() {
  console.log("Hello World!");
}
\`\`\`

## Blockquote
> Markdown is a lightweight markup language with plain text formatting syntax.

## Link & Image
[Simpleverse](https://simpleverse.io)
![Image](https://via.placeholder.com/150)

## Table
| Syntax | Description |
| ----------- | ----------- |
| Header | Title |
| Paragraph | Text |
`);
    };

    const clear = () => {
        setMarkdown('');
    };

    const copyHtml = async () => {
        try {
            await navigator.clipboard.writeText(html);
            return true;
        } catch (error) {
            return false;
        }
    };

    const copyMarkdown = async () => {
        try {
            await navigator.clipboard.writeText(markdown);
            return true;
        } catch (error) {
            return false;
        }
    };

    return {
        markdown, setMarkdown,
        html,
        loadSample,
        clear,
        copyHtml,
        copyMarkdown
    };
};
