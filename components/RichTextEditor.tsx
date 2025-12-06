import React, { useRef, useMemo } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface RichTextEditorProps {
    value: string;
    onChange: (content: string) => void;
    onUploadStart?: () => void;
    onUploadEnd?: () => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, onUploadStart, onUploadEnd }) => {
    const quillRef = useRef<any>(null);

    const imageHandler = React.useCallback(() => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files?.[0];
            if (file) {
                // Notify parent that upload started
                if (onUploadStart) onUploadStart();

                const formData = new FormData();
                formData.append('file', file);

                // Get quill instance
                let quill = quillRef.current?.getEditor();
                if (!quill) {
                    if (onUploadEnd) onUploadEnd();
                    return;
                }

                // Save current selection
                const range = quill.getSelection(true);
                if (!range) {
                    if (onUploadEnd) onUploadEnd();
                    return;
                }

                // Insert temporary loading text
                const loadingText = "[Uploading...]";
                const insertIndex = range.index;
                quill.insertText(insertIndex, loadingText, { 'color': '#999', 'italic': true });

                // Move cursor after loading text
                quill.setSelection(insertIndex + loadingText.length);

                try {
                    // Upload to Sanity
                    const res = await fetch("/api/admin/upload?type=image", {
                        method: "POST",
                        body: formData,
                    });

                    if (!res.ok) {
                        throw new Error("Upload failed with status: " + res.status);
                    }

                    const asset = await res.json();
                    console.log("Upload success, asset:", asset);

                    // RE-GET quill instance to ensure we have the live one
                    quill = quillRef.current?.getEditor();
                    if (!quill) return;

                    // Find and remove the placeholder text
                    const content = quill.getText();
                    let placeholderIndex = content.indexOf(loadingText);

                    // If exact match not found, try to find partial matches
                    if (placeholderIndex === -1) {
                        // Look for common partial remnants
                        const partials = ['[Uploading', 'Uploading...', 'Uploading'];
                        for (const partial of partials) {
                            placeholderIndex = content.indexOf(partial);
                            if (placeholderIndex !== -1) {
                                // Find the end - look for ] or just use partial length
                                const endBracket = content.indexOf(']', placeholderIndex);
                                const lengthToDelete = endBracket !== -1
                                    ? (endBracket - placeholderIndex + 1)
                                    : partial.length;
                                quill.deleteText(placeholderIndex, lengthToDelete);
                                break;
                            }
                        }
                    } else {
                        // Delete the exact loading text
                        quill.deleteText(placeholderIndex, loadingText.length);
                    }

                    // Insert the image at the cleaned position
                    if (asset.url) {
                        const finalIndex = placeholderIndex !== -1 ? placeholderIndex : insertIndex;
                        quill.insertEmbed(finalIndex, 'image', asset.url);
                        quill.setSelection(finalIndex + 1);

                        // Final cleanup: remove any remaining fragments like '...]' or '..]'
                        setTimeout(() => {
                            const q = quillRef.current?.getEditor();
                            if (q) {
                                const text = q.getText();
                                const fragments = ['...]', '..]', '..', ']'];
                                for (const fragment of fragments) {
                                    const idx = text.indexOf(fragment);
                                    if (idx !== -1) {
                                        q.deleteText(idx, fragment.length);
                                        break; // Only remove one fragment at a time
                                    }
                                }
                            }
                        }, 50);
                    } else {
                        console.error("Invalid asset response (missing url):", asset);
                        alert("Image uploaded but URL is missing.");
                    }

                } catch (err) {
                    console.error("Image upload failed", err);

                    // RE-GET quill instance and clean up placeholder
                    quill = quillRef.current?.getEditor();
                    if (quill) {
                        const content = quill.getText();
                        let placeholderIndex = content.indexOf(loadingText);

                        if (placeholderIndex !== -1) {
                            quill.deleteText(placeholderIndex, loadingText.length);
                        } else {
                            // Try to find and remove partial matches
                            const partials = ['[Uploading', 'Uploading...', 'Uploading', '...]', '..]'];
                            for (const partial of partials) {
                                placeholderIndex = content.indexOf(partial);
                                if (placeholderIndex !== -1) {
                                    quill.deleteText(placeholderIndex, partial.length);
                                    break;
                                }
                            }
                        }
                    }

                    alert("Image upload failed. Please try again.");
                } finally {
                    // Notify parent that upload ended
                    if (onUploadEnd) onUploadEnd();
                }
            }
        };
    }, [onUploadStart, onUploadEnd]);

    // Memoize modules to prevent re-initialization of the editor on every render
    const modules = useMemo(() => ({
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
    }), [imageHandler]);

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
