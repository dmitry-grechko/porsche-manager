import type React from 'react';

// Minimal JSX typing for the <model-viewer> web component + the bits of its
// runtime API we touch (scene-graph materials for recolor / X-ray).
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          poster?: string;
          'camera-controls'?: boolean | string;
          'touch-action'?: string;
          'auto-rotate'?: boolean | string;
          'auto-rotate-delay'?: number | string;
          'rotation-per-second'?: string;
          'interaction-prompt'?: string;
          'shadow-intensity'?: number | string;
          'shadow-softness'?: number | string;
          exposure?: number | string;
          'tone-mapping'?: string;
          'camera-orbit'?: string;
          'camera-target'?: string;
          'field-of-view'?: string;
          reveal?: string;
          loading?: string;
          ar?: boolean | string;
          'environment-image'?: string;
        },
        HTMLElement
      >;
    }
  }
}

export interface MVMaterial {
  name: string;
  pbrMetallicRoughness: {
    baseColorFactor: number[];
    setBaseColorFactor: (rgba: number[]) => void;
  };
  setAlphaMode?: (mode: 'OPAQUE' | 'MASK' | 'BLEND') => void;
}

export interface ModelViewerElement extends HTMLElement {
  model?: { materials: MVMaterial[] } | null;
  loaded?: boolean;
  cameraOrbit?: string;
  cameraTarget?: string;
}
