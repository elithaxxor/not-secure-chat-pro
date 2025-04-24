# Changelog

## [2025-04-22]
### Added
- User list sidebar with real-time updates and accessibility improvements
- Message reactions (emoji UI, backend wiring pending)
- Accessible emoji picker with keyboard navigation and focus styling
- Avatar preview in join modal
- Client-side rate limiting for spam prevention
- Avatar upload validation (type/size)
- Message history (localStorage-based)
- Browser notifications for new messages
- Dark mode (theming toggle)
- Language selector (English/Spanish, i18n-ready)
- Loading/error feedback for async/server events
- `.gitignore`, `Dockerfile`, and GitHub Actions workflow for CI/CD

### Improved
- Accessibility: ARIA roles, labels, focus outlines, keyboard navigation for all major flows
- CSS refactored: sidebar, emoji picker, avatar preview, focus styles moved to `chat.css`
- Input sanitization throughout client
- README.md and documentation updated for all new features and accessibility

### Fixed
- Removed dead code and duplicate scripts
- Fixed avatar preview display and validation logic

### Security
- Sanitized all user-generated content
- Avatar upload validation
- Rate limiting for spam prevention

## [Unreleased]
- Full modularization of frontend JavaScript (user.js, chat.js, admin.js, ui.js, utils.js)
- Private messaging and admin controls (mute, kick, ban) implemented
- Emoji reactions UI and backend support
- Accessibility improvements: ARIA, keyboard navigation, color contrast
- Responsive UI and theming (light/dark mode)
- Language selector (English, Español)
- Avatar upload/validation and user list sidebar
- Local message history (localStorage)
- Browser notifications for new messages
- Comprehensive Cypress tests (including a11y with axe-core)
- Documentation update (README, testing, accessibility)

## [Earlier]
- Initial chat app with WebSocket backend
- Basic message sending/receiving
- Minimal UI
