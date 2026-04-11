import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';

const FullRepoEditor = () => {
    const [fileTree, setFileTree] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);

    // 1. Fetch the entire file tree on mount
    useEffect(() => {
        fetch('http://localhost:3000/api/editor/github/tree', { credentials: 'include' })
            .then(res => res.json())
            .then(data => setFileTree(data))
            .catch(err => console.error("Tree load failed", err));
    }, []);

    // 2. Fetch specific file content when clicked
    const openFile = async (path) => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:3000/api/editor/github/get-content?path=${path}`, { credentials: 'include' });
            const data = await res.json();
            setSelectedFile(path);
            setCode(data.content);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/editor/github/push-changes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    path: selectedFile,
                    content: code,
                    message: `Updated ${selectedFile} via Site Editor`
                })
            });

            if (response.ok) alert("Changes pushed to GitHub successfully!");
        } catch (err) {
            alert("Failed to push changes.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex vh-100 bg-dark text-white">
            {/* Sidebar: File Explorer */}
            <div className="border-end border-secondary p-3" style={{ width: '250px', overflowY: 'auto' }}>
                <h6 className="text-uppercase text-muted small fw-bold mb-3">Explorer</h6>
                <ul className="list-unstyled">
                    {fileTree.map(file => (
                        <li key={file.path} 
                            className={`py-1 px-2 rounded cursor-pointer ${selectedFile === file.path ? 'bg-primary' : 'hover-bg-secondary'}`}
                            onClick={() => file.type === 'blob' && openFile(file.path)}
                            style={{ cursor: 'pointer', fontSize: '14px' }}>
                            <i className={`bi ${file.type === 'tree' ? 'bi-folder' : 'bi-file-earmark-code'} me-2`}></i>
                            {file.path}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Main: Editor */}
            <div className="flex-grow-1 d-flex flex-column">
                <div className="bg-secondary p-2 d-flex justify-content-between">
                    <span>{selectedFile || "Select a file to edit"}</span>
                    {selectedFile && <button className="btn btn-sm btn-success" onClick={handleSave}>Push Changes</button>}
                </div>
                <Editor
                    height="100%"
                    theme="vs-dark"
                    path={selectedFile}
                    value={code}
                    onChange={(val) => setCode(val)}
                    loading={<div className="text-white">Loading Editor...</div>}
                />
            </div>
        </div>
    );
};

export default FullRepoEditor;