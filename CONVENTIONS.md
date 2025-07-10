# File Naming Conventions

This document outlines the file and folder naming conventions for our Next.js project. **All team members must follow these rules** to maintain consistency and avoid confusion.

## 📁 Folder Structure

```
project-root/
├── pages/
├── components/
├── services/
├── lib/
├── public/
├── styles/
└── utils/
```

## 📄 File Naming Rules

### Pages and Routes
- **Format**: lowercase-with-hyphens
- **Examples**: `about-us.js`, `contact-us.js`, `user-profile.js`
- **API Routes**: `api/user-profile.js`, `api/send-email.js`
- **Dynamic Routes**: `[id].js`, `[...slug].js`, `[userId].js`

**Why**: Next.js creates URLs based on file names, so `about-us.js` becomes `/about-us`

### Components
- **Format**: PascalCase
- **Examples**: `UserProfile.jsx`, `NavigationBar.jsx`, `ProductCard.jsx`
- **Rule**: File name must match the component name exactly

```javascript
// ✅ Correct
// File: UserProfile.jsx
export default function UserProfile() { ... }

// ❌ Wrong
// File: userProfile.jsx or user-profile.jsx
export default function UserProfile() { ... }
```

### Services
- **Format**: camelCase with "Service" suffix
- **Examples**: `userService.js`, `apiService.js`, `authService.js`, `paymentService.js`
- **Class Names**: PascalCase (`UserService`, `ApiService`)

```javascript
// ✅ Correct
// File: userService.js
export class UserService { ... }
```

### Lib Files
- **Format**: camelCase
- **Examples**: `auth.js`, `db.js`, `apiClient.js`, `errorHandler.js`, `prisma.js`
- **Purpose**: Core business logic, external service integrations, and app-wide infrastructure
- **Single-purpose**: Simple names like `auth.js`, `db.js`
- **Multi-purpose**: Descriptive names like `apiClient.js`, `errorHandler.js`

### Utility Files
- **Format**: camelCase
- **Examples**: `dateUtils.js`, `stringUtils.js`, `validationUtils.js`, `formatUtils.js`
- **Purpose**: Small, reusable, stateless helper functions that could work in any project
- **Constants**: UPPER_SNAKE_CASE for constant files (`API_ENDPOINTS.js`)

### Static Assets (public/ folder)
- **Format**: lowercase-with-hyphens
- **Examples**: `hero-image.jpg`, `company-logo.svg`, `user-avatar.png`
- **Icons**: `chevron-down.svg`, `search-icon.svg`

### Styling Files
- **CSS Modules**: Match component name (`Button.module.css`)
- **Global Styles**: lowercase (`globals.css`, `variables.css`)
- **Utility Styles**: camelCase (`textUtils.css`) or kebab-case (`text-utils.css`)

### Configuration Files
- **Format**: lowercase with dots/hyphens
- **Examples**: `next.config.js`, `.env.local`, `.eslintrc.js`, `tailwind.config.js`

## 🔄 lib/ vs utils/ Distinction

Understanding the difference between `lib/` and `utils/` folders:

### lib/ - Core Infrastructure
- **Purpose**: Core business logic, external service integrations, and app-wide infrastructure
- **Characteristics**:
  - More complex, app-specific functionality
  - May have state or configuration
  - Often has external dependencies
  - Core part of your application architecture

**Examples**:
```javascript
// lib/auth.js - Authentication service
export class AuthService {
  constructor() {
    this.token = null;
  }
  async login(credentials) { /* complex logic */ }
}

// lib/errorHandler.js - App-specific error handling
export class ErrorHandler {
  static async handleError(error, context) {
    await Logger.error(error, context);
    toast.error(error.message);
  }
}
```

### utils/ - Pure Utilities
- **Purpose**: Small, reusable, stateless helper functions
- **Characteristics**:
  - Generic functions that could work in any project
  - Usually stateless and simple
  - Minimal dependencies
  - Pure utility functions

**Examples**:
```javascript
// utils/dateUtils.js - Generic date utilities
export function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

// utils/stringUtils.js - Generic string helpers
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
```

### Quick Decision Guide
- **Is it app-specific?** → `lib/`
- **Does it have state/config?** → `lib/`
- **Could it work in any project?** → `utils/`
- **Is it a pure function?** → `utils/`

## 🚫 What NOT to Do

```
❌ Mixing conventions randomly
pages/aboutUs.js          // Should be about-us.js
components/user-profile.jsx // Should be UserProfile.jsx
services/UserService.js   // Should be userService.js

❌ Inconsistent naming
services/userService.js
services/payment-service.js  // Should be paymentService.js
services/AuthAPI.js         // Should be authService.js

❌ Non-descriptive names
lib/stuff.js              // Should be specific like dateUtils.js
components/Thing.jsx      // Should be descriptive like ProductCard.jsx
```

## ✅ Good Examples

```
✅ Consistent and clear
pages/
├── about-us.js
├── user-profile.js
├── contact-us.js

components/
├── UserProfile.jsx
├── NavigationBar.jsx
├── ProductCard.jsx

services/
├── userService.js
├── paymentService.js
├── emailService.js

lib/
├── auth.js
├── db.js
├── apiClient.js
├── errorHandler.js

utils/
├── dateUtils.js
├── stringUtils.js
├── validationUtils.js
```

## 🔧 Enforcement

- **ESLint**: We use filename linting rules to enforce these conventions
- **Code Reviews**: All PRs must follow these naming conventions
- **No Exceptions**: These rules apply to all files, no exceptions

## 📝 Quick Reference

| File Type | Convention | Example |
|-----------|------------|---------|
| Pages/Routes | kebab-case | `user-profile.js` |
| Components | PascalCase | `UserProfile.jsx` |
| Services | camelCase + Service | `userService.js` |
| Lib Files | camelCase | `auth.js`, `errorHandler.js` |
| Utilities | camelCase | `dateUtils.js`, `stringUtils.js` |
| Static Assets | kebab-case | `hero-image.jpg` |
| Styles | Match component or kebab-case | `Button.module.css` |
| Config | lowercase + dots | `next.config.js` |

## 🤝 Team Agreement

By working on this project, you agree to follow these conventions. If you have suggestions for changes, please discuss them with the team before implementing.

**Remember**: Consistency is more important than personal preference. These rules ensure our codebase remains maintainable and professional.
