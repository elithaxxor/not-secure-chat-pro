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

---

## [Earlier]
- Initial chat app implementation
