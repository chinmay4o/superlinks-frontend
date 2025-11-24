/**
 * NEW Bio Builder Components
 *
 * This folder contains the new bio builder implementation used at /bio-builder route.
 * Uses: useBioDataSimple hook, iframe-based preview
 *
 * OLD Bio Builder is in /components/bio-builder/ (legacy)
 * Uses: useBioData hook, react-frame-component based preview
 */

// Main preview component
export { default as BioLivePreview } from './BioLivePreview'
export { default as BioLivePreviewAlt } from './BioLivePreviewAlt'

// Sortable item for drag-and-drop
export { SortableItem } from './SortableItem'

// Tab components
export { default as BioContentTab } from './tabs/BioContentTab'
export { default as BioThemeTab } from './tabs/BioThemeTab'
export { default as BioSettingsTab } from './tabs/BioSettingsTab'
