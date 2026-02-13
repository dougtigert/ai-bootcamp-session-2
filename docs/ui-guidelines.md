# UI Guidelines

## Overview

This document outlines the user interface guidelines for the TODO application. These guidelines ensure a consistent, accessible, and user-friendly experience across all components and features.

## Design Principles

### Simplicity
- Keep the interface clean and uncluttered
- Focus on the core task management functionality
- Minimize cognitive load for users

### Consistency
- Use consistent spacing, typography, and color schemes throughout
- Maintain predictable patterns for similar actions
- Ensure uniform behavior across all interactive elements

### Accessibility
- Follow WCAG 2.1 Level AA standards
- Ensure keyboard navigation for all interactive elements
- Provide sufficient color contrast (minimum 4.5:1 for normal text)
- Include ARIA labels where appropriate

## Visual Design

### Color Palette

#### Primary Colors
- **Primary Blue**: `#1976d2` - Main action buttons, active states
- **Primary Dark**: `#115293` - Hover states, emphasis
- **Primary Light**: `#63a4ff` - Backgrounds, subtle highlights

#### Secondary Colors
- **Secondary Green**: `#4caf50` - Success messages, completed tasks
- **Secondary Orange**: `#ff9800` - Warnings, due soon indicators
- **Secondary Red**: `#f44336` - Error messages, delete actions

#### Neutral Colors
- **Background**: `#fafafa` - Main background
- **Surface**: `#ffffff` - Card backgrounds, modals
- **Text Primary**: `#212121` - Main text content
- **Text Secondary**: `#757575` - Supporting text, labels
- **Divider**: `#e0e0e0` - Lines, borders

### Typography

#### Font Family
- Primary: `'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- Monospace (for dates/times): `'Roboto Mono', 'Courier New', monospace`

#### Font Sizes
- **Headline**: 24px / 1.5rem - Page titles
- **Title**: 20px / 1.25rem - Section headers
- **Subheading**: 16px / 1rem - Card titles, labels
- **Body**: 14px / 0.875rem - Main content, task descriptions
- **Caption**: 12px / 0.75rem - Timestamps, helper text

#### Font Weights
- **Regular**: 400 - Body text
- **Medium**: 500 - Subheadings, buttons
- **Bold**: 700 - Headlines, emphasis

### Spacing

Use a consistent 8px spacing system:
- **xs**: 4px - Tight spacing between related elements
- **sm**: 8px - Standard spacing within components
- **md**: 16px - Spacing between components
- **lg**: 24px - Section spacing
- **xl**: 32px - Page margins, major section breaks

## Component Guidelines

### Buttons

#### Primary Button
- Background: Primary Blue (`#1976d2`)
- Text: White
- Border Radius: 4px
- Padding: 8px 16px
- Font Weight: 500
- Hover: Primary Dark (`#115293`)

#### Secondary Button
- Background: Transparent
- Text: Primary Blue
- Border: 1px solid Primary Blue
- Border Radius: 4px
- Padding: 8px 16px
- Hover: Light blue background

#### Icon Buttons
- Size: 40px × 40px
- Icon Size: 24px
- Border Radius: 50%
- Hover: Light gray background (`#f5f5f5`)

### Task Cards

- Background: Surface White (`#ffffff`)
- Border: 1px solid Divider (`#e0e0e0`)
- Border Radius: 8px
- Padding: 16px
- Shadow: `0 2px 4px rgba(0,0,0,0.1)` on hover
- Transition: 200ms ease for all state changes

### Input Fields

- Border: 1px solid `#bdbdbd`
- Border Radius: 4px
- Padding: 12px
- Font Size: 14px
- Focus Border: 2px solid Primary Blue
- Error Border: 2px solid Secondary Red
- Placeholder Color: Text Secondary (`#757575`)

### Checkboxes

- Size: 18px × 18px
- Border: 2px solid `#757575`
- Border Radius: 2px
- Checked Background: Primary Blue
- Checked Icon: White checkmark

### Status Indicators

#### Task Status
- **Pending**: Gray circle outline
- **In Progress**: Blue circle (half-filled)
- **Completed**: Green checkmark in circle
- **Overdue**: Red exclamation in circle

#### Priority Indicators
- **High**: Red flag icon
- **Medium**: Orange flag icon
- **Low**: Gray flag icon

## Layout Guidelines

### Responsive Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Grid System
- Use a 12-column grid for desktop layouts
- Single column for mobile views
- Maximum content width: 1200px
- Center content with auto margins

### Page Structure
```
┌─────────────────────────────────┐
│        Header (64px)             │
├─────────────────────────────────┤
│                                  │
│     Main Content Area            │
│     (Max width: 1200px)          │
│                                  │
└─────────────────────────────────┘
```

## Interaction Guidelines

### Hover States
- Buttons: Darken background by 10%
- Cards: Add subtle shadow
- Links: Underline text
- Transition: 200ms ease

### Active States
- Buttons: Darken background by 20%
- Inputs: Show focus outline
- Cards: Slight scale (0.98)

### Loading States
- Show spinner for operations > 300ms
- Disable buttons during submission
- Display skeleton screens for content loading
- Use progress bars for multi-step operations

### Error States
- Display inline error messages below inputs
- Use Secondary Red color for error text
- Show error icon alongside message
- Provide clear resolution instructions

### Success States
- Show brief toast notifications (3 seconds)
- Use Secondary Green color
- Include success icon
- Auto-dismiss or allow manual close

## Animation Guidelines

### Duration
- **Quick**: 100-200ms - Hover, active states
- **Standard**: 300ms - Transitions, simple animations
- **Complex**: 400-500ms - Multi-step animations, page transitions

### Easing
- **Ease-out**: Primary for entering elements
- **Ease-in**: for exiting elements
- **Ease-in-out**: For state changes

### Effects
- Fade in/out: Opacity transitions
- Slide: Vertical or horizontal movement
- Scale: Subtle size changes (0.95 - 1.05)
- Avoid excessive motion for accessibility

## Iconography

### Icon Set
- Use Material Design Icons or similar consistent set
- Size: 24px standard, 18px for inline, 48px for empty states
- Color: Match text color or use Primary Blue for actions

### Common Icons
- Add task: `+` or `add_circle`
- Delete: `delete` or `trash`
- Edit: `edit` or `pencil`
- Complete: `check` or `check_circle`
- Calendar: `calendar` or `event`
- Priority: `flag` or `priority_high`

## Accessibility Requirements

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Tab order must follow logical reading order
- Provide visible focus indicators
- Support Escape key to close modals/dropdowns

### Screen Readers
- Use semantic HTML elements (`<button>`, `<nav>`, etc.)
- Include ARIA labels for icon buttons
- Provide alt text for images
- Announce dynamic content changes

### Color Contrast
- Text on background: minimum 4.5:1 ratio
- Large text (18px+): minimum 3:1 ratio
- Interactive elements: minimum 3:1 ratio
- Do not rely solely on color to convey information

### Motion Preferences
- Respect `prefers-reduced-motion` media query
- Provide alternatives to animations
- Disable auto-playing animations

## Mobile Considerations

### Touch Targets
- Minimum size: 44px × 44px
- Spacing between targets: 8px minimum
- Use larger padding for mobile buttons

### Mobile Navigation
- Use bottom navigation bar for primary actions
- Implement swipe gestures for common actions (swipe to delete)
- Show mobile-optimized date pickers

### Mobile Forms
- Use appropriate input types (`date`, `email`, etc.)
- Avoid tiny text inputs
- Provide clear labels above inputs
- Show validation inline

## Dark Mode (Future Enhancement)

When implementing dark mode:
- Background: `#121212`
- Surface: `#1e1e1e`
- Primary text: `#ffffff`
- Secondary text: `#b0b0b0`
- Adjust colors for proper contrast
- Test all states in both modes

## Implementation Notes

- Use CSS variables or theme tokens for consistent styling
- Implement responsive design mobile-first
- Test on multiple browsers and devices
- Validate against accessibility guidelines
- Maintain design system documentation

## Resources

- [Material Design Guidelines](https://material.io/design)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility Documentation](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
