import React, { useState, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const initialContent = `
<h2>About Us</h2>
<p>We are a top-tier school, providing quality education to students across the globe.</p>

<h2>Contact</h2>
<p>
    123 School St., Education City<br>
    Email: contact@school.com<br>
    Phone: (123) 456-7890
</p>

<h2>Quick Links</h2>
<ul style="list-style-type: upper-roman;">
    <li>Home</li>
    <li>About</li>
    <li>Courses</li>
    <li>Admissions</li>
    <li>Contact</li>
</ul>

<p>&copy; 2025 School Name. All rights reserved.</p>
`;

const WordLikeEditor = ({ initialData = initialContent, onContentChange }) => {
    const [editorData, setEditorData] = useState(initialData);
    const editorRef = useRef(null);

    const handleSave = () => {
        if (editorRef.current) {
            const data = editorRef.current.getContent();
            console.log('Saved Content:', data);
            if (onContentChange) {
                onContentChange(data);
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
            <div className="bg-white p-4 rounded-lg" style={{ height: '85vh' }}>
                <Editor
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    initialValue={editorData}
                    onEditorChange={(content) => {
                        setEditorData(content);
                        if (onContentChange) {
                            onContentChange(content);
                        }
                    }}
                    init={{
                        height: '100%',
                        menubar: 'file edit view insert format tools table help',
                        plugins: [
                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor',
                            'searchreplace', 'visualblocks', 'code', 'fullscreen',
                            'insertdatetime', 'media', 'table', 'paste', 'wordcount'
                        ],
                        toolbar:
                            'undo redo | formatselect | bold italic underline strikethrough | ' +
                            'forecolor backcolor | alignleft aligncenter alignright alignjustify | ' +
                            'bullist numlist outdent indent | link image table | removeformat | help',
                        advlist_bullet_styles: 'default,circle,square,disc',
                        advlist_number_styles:
                            'default,lower-alpha,upper-alpha,lower-roman,upper-roman,lower-greek',
                        content_style: 'body { font-family: Arial, sans-serif; font-size: 14px }',
                        placeholder: 'Type your content here...',
                        skin_url: '/tinymce/skins/ui/oxide',
                        content_css: '/tinymce/skins/content/default/content.min.css',
                        images_upload_handler: (blobInfo, success, failure) => {
                            // Placeholder for image upload (configure with your server endpoint)
                            failure('Image upload requires server-side configuration');
                        }
                    }}
                />
            </div>
            <button
                onClick={handleSave}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
                Save Content
            </button>
        </div>
    );
};

export default WordLikeEditor;