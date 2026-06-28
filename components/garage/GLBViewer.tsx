'use client';

import dynamic from 'next/dynamic';
import { forwardRef, useImperativeHandle, useRef } from 'react';

export type GLBViewerHandle = { reset: () => void };

export type GLBViewerProps = {
  src: string;
  paintHex?: string;
  autoRotate?: boolean;
  /** Selectable parts inside the GLB → renders numbered hotspot pins. */
  parts?: import('@/lib/types').EnginePart[];
  selectedPartId?: string | null;
  onSelectPart?: (id: string) => void;
};

// Internal prop the dynamic scene uses to expose its imperative handle
// without relying on ref-forwarding through next/dynamic's wrapper.
export type GLBSceneProps = GLBViewerProps & {
  handleRef?: { current: GLBViewerHandle | null };
};

// three/R3F break under SSR (window undefined) — load the Canvas client-only.
const GLBScene = dynamic(() => import('./GLBSceneClient'), { ssr: false });

const GLBViewer = forwardRef<GLBViewerHandle, GLBViewerProps>(function GLBViewer(props, ref) {
  const handleRef = useRef<GLBViewerHandle | null>(null);

  // Bridge the scene's handle (populated once the dynamic chunk mounts) to the
  // ref the parent passed in.
  useImperativeHandle(ref, () => ({
    reset: () => handleRef.current?.reset(),
  }));

  return <GLBScene {...props} handleRef={handleRef} />;
});

export default GLBViewer;
