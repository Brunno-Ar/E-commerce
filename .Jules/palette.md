## 2025-02-18 - Icon-Only Buttons
**Learning:** The application uses icon-only buttons (like 'Add to Cart') without ARIA labels or tooltips, making them inaccessible to screen readers and potentially confusing for users.
**Action:** Always check icon-only buttons for `aria-label` and consider adding `matTooltip` for clarity.

## 2025-02-18 - Sidebar Auto-Collapse
**Learning:** Users appreciate sidebars that get out of the way when not in use. Implementing a "close on mouse leave" with a delay (e.g., 4s) is a simple way to achieve this without complex state management or "click outside" listeners.
**Action:** Consider auto-collapse patterns for large navigation drawers that might obscure content.
