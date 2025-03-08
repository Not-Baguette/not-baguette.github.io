# baguette-web

### Animations
- **@keyframes fadeDown**: Defines a fade-down animation.
  - `from`: Initial state with opacity 0 and translateY(-20px).
  - `to`: Final state with opacity 1 and translateY(0).
- **.fade-down**: Applies the fadeDown animation with an initial opacity of 0.
  - `.fade-down-1`: No animation delay.
  - `.fade-down-2`: 0.5s animation delay.
  - `.fade-down-3`: 1s animation delay.
  - `.fade-down-4`: 1.5s animation delay.

### Announcement Blocks
- **.text-block2, .text-block3**: Legacy announcement blocks with similar styles.
  - Shared styles: Centered text, rounded corners, padding, and margin.
- **.text-block**: Main announcement block.
  - Styles: Max width, background color, margin, padding, and border.
- **.text-block2**: Specific background and border colors.
- **.text-block3**: Specific background and border colors.

### Bootstrap Modifications
- **.row**: Adds bottom margin to rows.
- **.project-box**: Flexbox layout for project-box on portfolio.html.
  - `img`: Adds right margin on img, hacky fix.
  - `h2`: Adds bottom margin for all h2.
  - `p`: Removes default margin, cleans p tag default margins.

### Image Styles
- **.pfp**: Profile picture styles.
  - Circular shape, width, max-width, height, margin, display, and border.
- **.pfp.discord**: Specific border color and centered alignment for Discord profile picture.
- **.pfp.telegram**: Specific border color and centered alignment for Telegram profile picture.

### Contact Animations
- **.contact**: Transition effect for contact elements, used on contact.html.
- **.contact:hover**: Scale effect on hover.

### Accordion Styles
- **.accordion-item**: Styles for accordion items.
  - Border, border-radius, margin, background color, and position.
- **.accordion-header**: Styles for accordion headers.
  - Background color, border-bottom, border-radius, display, alignment, and padding.
- **.accordion-button**: Styles for accordion buttons.
  - Color, background color, border, padding, font size, flex-grow, text alignment, width, transition, and focus/active states.
  - `::after`: Removes default icon.
  - `:not(.collapsed)`: Styles for expanded state.
- **.accordion-body**: Styles for accordion bodies.
  - Background color, color, padding, border-top, border-radius, overflow, and word wrapping.

### Window Controls
- **.window-controls**: Flexbox layout for window accordion buttons.
  - `button`: Styles for buttons (size, border, border-radius, background color, and cursor).
  - `.minimize`: Specific background color.
  - `.maximize`: Specific background color.
  - `.close`: Specific background color.

### Video Background
- **body, html**: Full-height layout.
- **.video-background**: Fixed position, full-size background video.
  - `iframe`: Full-size video, object-fit, and blur effect.
- **.content**: Positioned content over the video.
  - Styles: Position, z-index, color, text alignment, vertical centering, and transform.
