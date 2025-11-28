import React, { useRef, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface RichTextEditorProps {
    value: string;
    onChange: (content: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
    const quillRef = useRef<any>(null);

    const modules = {
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'align': [] }],
                ['link', 'image'],
                ['clean']
            ],
            handlers: {
                image: imageHandler
            }
        }
    };

    function imageHandler() {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files?.[0];
            if (file) {
                const formData = new FormData();
                formData.append('file', file);

                try {
                    // Get quill instance
                    const quill = quillRef.current?.getEditor();
                    if (!quill) return;

                    const range = quill.getSelection(true);

                    // Show loading state
                    quill.insertEmbed(range.index, 'image', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxOCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjY2NjIiBzdHJva2Utd2lkdGg9IjQiLz48L3N2Zz4=');

                    // Upload to Sanity
                    const res = await fetch("/api/admin/upload?type=image", {
                        method: "POST",
                        body: formData,
                    });
                    const asset = await res.json();

                    if (asset.url) {
                        // Remove loading placeholder
                        quill.deleteText(range.index, 1);
                        // Insert actual image
                        quill.insertEmbed(range.index, 'image', asset.url);
                        // Move cursor to next position
                        quill.setSelection(range.index + 1);
                    }
                } catch (err) {
                    console.error("Image upload failed", err);
                    alert("Image upload failed. Please try again.");
                }
            }
        };
    }

    return (
        <div className="bg-white text-gray-900">
            <style jsx global>{`
                .ql-container {
                    font-family: inherit;
                }
                .ql-editor {
                    min-height: 400px;
                    max-height: 500px;
                    overflow-y: auto;
                    font-size: 16px;
                    line-height: 1.6;
                }
                .ql-editor img {
                    max-width: 100%;
                    height: auto;
                    display: block;
                    margin: 1rem 0;
                    border-radius: 8px;
                }
                .ql-editor h1 {
                    font-size: 2em;
                    font-weight: bold;
                    margin: 1em 0 0.5em;
                }
                .ql-editor h2 {
                    font-size: 1.5em;
                    font-weight: bold;
                    margin: 1em 0 0.5em;
                }
                .ql-editor h3 {
                    font-size: 1.25em;
                    font-weight: bold;
                    margin: 1em 0 0.5em;
                }
                .ql-editor ul, .ql-editor ol {
                    padding-left: 1.5em;
                    margin: 1em 0;
                }
                .ql-editor li {
                    margin: 0.5em 0;
                }
            `}</style>
            <ReactQuill
                ref={quillRef}
                theme="snow"
                value={value}
                onChange={onChange}
                className="mb-16"
                modules={modules}
                placeholder="Write your story content here... You can add text, images, headings, lists, and more!"
            />
        </div>
    );
};

export default RichTextEditor;
