/**
 * Barrel export for @repo/ui package
 * Allows convenient imports: import { Button, Input } from '@repo/ui'
 * Direct imports also supported: import { Button } from '@repo/ui/button'
 * Task: T2.7
 */

// Primitives (re-exported from primitives/ directory)
export * from './button';
export * from './input';
export * from './textarea';
export * from './label';
export * from './checkbox';
export * from './switch';
export * from './radio-group';
export * from './select-native';
export * from './select-radix';
export * from './heading';
export * from './text';
export * from './link';
export * from './icon';
export * from './container';
export * from './stack';
export * from './grid';
export * from './badge';
export * from './avatar';
export * from './skeleton';
export * from './separator';
export * from './aspect-ratio';
export * from './slider';
export * from './progress';

// Compositions (at root level)
export * from './form-field';
export * from './nav-link';
export * from './stat-card';
export * from './empty-state';
export * from './search-input';

// Radix compositions (at root level)
export * from './accordion';
export * from './alert';
export * from './alert-dialog';
export * from './card';
export * from './collapsible';
export * from './command';
export * from './dialog';
export * from './dropdown-menu';
export * from './form';
export * from './hover-card';
export * from './popover';
export * from './sheet';
export * from './tabs';
export * from './toast';
export * from './toaster';
export * from './toggle';
export * from './toggle-group';
export * from './tooltip';

// Utilities
export * from './utils';
export * from './types';
export * from './use-toast';
