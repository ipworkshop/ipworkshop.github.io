import React, { JSX, useRef } from 'react';

interface EmbedProps {
    src: string;
    height?: string;
    title?: string;
}

interface FullscreenIFrameElement extends HTMLIFrameElement {
    webkitRequestFullscreen?: () => void;
    msRequestFullscreen?: () => void;
}

export default function Embed({
    src,
    height = '500px',
    title = 'Embedded content',
}: EmbedProps): JSX.Element {
    const iframeRef = useRef<FullscreenIFrameElement>(null);

    const handleFullscreen = (): void => {
        const el = iframeRef.current;
        if (!el) return;

        if (el.requestFullscreen) {
            el.requestFullscreen();
        } else if (el.webkitRequestFullscreen) {
            // Safari
            el.webkitRequestFullscreen();
        } else if (el.msRequestFullscreen) {
            // old Edge/IE
            el.msRequestFullscreen();
        }
    };

    return (
        <div style={{ position: 'relative' }}>
            <button
                onClick={handleFullscreen}
                style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    zIndex: 1,
                    padding: '4px 10px',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    background: 'rgba(255,255,255,0.9)',
                }}
            >
                ⛶ Fullscreen
            </button>
            <iframe
                ref={iframeRef}
                src={src}
                title={title}
                allowFullScreen
                style={{ width: '100%', height, border: 'none', display: 'block' }}
            />
        </div>
    );
}