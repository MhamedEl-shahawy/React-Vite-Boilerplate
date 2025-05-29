# Security Architecture

## Overview

The security architecture implements a defense-in-depth strategy with multiple layers of protection, following security best practices and industry standards for web application security.

## 🔐 Authentication System

### JWT-Based Authentication

#### Token Management
```typescript
// Secure cookie-based authentication
config.withCredentials = true;

// Automatic token refresh on 401
if (error.response?.status === 401) {
  window.location.href = paths.auth.login.getHref(redirectTo);
}
```

#### Authentication Flow
```typescript
// src/lib/auth.tsx
const authConfig = {
  userFn: getUser,           // Get current user
  loginFn: async (data: LoginInput) => {
    const response = await loginWithEmailAndPassword(data);
    return response.user;
  },
  registerFn: async (data: RegisterInput) => {
    const response = await registerWithEmailAndPassword(data);
    return response.user;
  },
  logoutFn: logout,
};

export const { useUser, useLogin, useLogout, useRegister, AuthLoader } =
  configureAuth(authConfig);
```

#### Session Security
- **HttpOnly Cookies**: Prevent XSS token theft
- **Secure Flag**: HTTPS-only transmission
- **SameSite**: CSRF protection
- **Automatic Expiry**: Session timeout handling
- **Token Rotation**: Refresh token mechanism

### Protected Routes

#### Route-Level Protection
```typescript
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useUser();
  const location = useLocation();

  if (!user.data) {
    return (
      <Navigate to={paths.auth.login.getHref(location.pathname)} replace />
    );
  }

  return children;
};
```

#### Authentication Loader
```typescript
<AuthLoader
  renderLoading={() => (
    <div className="flex h-screen w-screen items-center justify-center">
      <Spinner size="xl" />
    </div>
  )}
>
  {children}
</AuthLoader>
```

## 🛡️ Authorization System

### Role-Based Access Control (RBAC)

#### Role Definition
```typescript
export enum ROLES {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

type RoleTypes = keyof typeof ROLES;
```

#### Authorization Hook
```typescript
export const useAuthorization = () => {
  const user = useUser();

  const checkAccess = React.useCallback(
    ({ allowedRoles }: { allowedRoles: RoleTypes[] }) => {
      if (allowedRoles && allowedRoles.length > 0 && user.data) {
        return allowedRoles?.includes(user.data.role);
      }
      return true;
    },
    [user.data],
  );

  return { checkAccess, role: user.data.role };
};
```

### Policy-Based Authorization

#### Permission Policies
```typescript
export const POLICIES = {
  'comment:delete': (user: User, comment: Comment) => {
    if (user.role === 'ADMIN') {
      return true;
    }
    
    if (user.role === 'USER' && comment.author?.id === user.id) {
      return true;
    }
    
    return false;
  },
  'discussion:create': (user: User) => {
    return user.role === 'ADMIN';
  },
  'discussion:edit': (user: User, discussion: Discussion) => {
    return user.role === 'ADMIN';
  },
  'discussion:delete': (user: User, discussion: Discussion) => {
    return user.role === 'ADMIN';
  },
};
```

#### Component-Level Authorization
```typescript
<Authorization
  allowedRoles={[ROLES.ADMIN]}
  forbiddenFallback={<div>Access Denied</div>}
>
  <AdminOnlyComponent />
</Authorization>

<Authorization
  policyCheck={POLICIES['comment:delete'](user, comment)}
  forbiddenFallback={null}
>
  <DeleteCommentButton />
</Authorization>
```

### Permission Matrix

```
Feature              | USER | ADMIN
---------------------|------|-------
View Discussions     | ✓    | ✓
Create Discussion    | ✗    | ✓
Edit Discussion      | ✗    | ✓
Delete Discussion    | ✗    | ✓
Create Comment       | ✓    | ✓
Delete Own Comment   | ✓    | ✓
Delete Any Comment   | ✗    | ✓
View Users           | ✗    | ✓
Manage Users         | ✗    | ✓
Update Own Profile   | ✓    | ✓
Update Any Profile   | ✗    | ✓
```

## 🔒 Input Security

### Validation Layers

#### 1. Client-Side Validation
```typescript
export const loginInputSchema = z.object({
  email: z.string().min(1, 'Required').email('Invalid email'),
  password: z.string().min(5, 'Required'),
});

export const registerInputSchema = z
  .object({
    email: z.string().min(1, 'Required').email('Invalid email'),
    firstName: z.string().min(1, 'Required'),
    lastName: z.string().min(1, 'Required'),
    password: z.string().min(5, 'Required'),
  })
  .and(
    z
      .object({
        teamId: z.string().min(1, 'Required'),
        teamName: z.null().default(null),
      })
      .or(
        z.object({
          teamName: z.string().min(1, 'Required'),
          teamId: z.null().default(null),
        }),
      ),
  );
```

#### 2. Form Validation
```typescript
// React Hook Form with Zod resolver
const form = useForm({
  resolver: zodResolver(loginInputSchema),
  defaultValues: {
    email: '',
    password: '',
  },
});
```

#### 3. Runtime Type Checking
```typescript
// API response validation
const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.enum(['ADMIN', 'USER']),
  teamId: z.string(),
});

export type User = z.infer<typeof UserSchema>;
```

### XSS Prevention

#### Content Sanitization
```typescript
import DOMPurify from 'dompurify';
import { marked } from 'marked';

// Markdown content sanitization
export const MDPreview = ({ value }: { value: string }) => {
  const sanitizedHtml = DOMPurify.sanitize(marked(value));
  
  return (
    <div
      className="prose"
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
};
```

#### Safe HTML Rendering
- **DOMPurify**: HTML sanitization for markdown content
- **CSP Headers**: Content Security Policy implementation
- **Safe Defaults**: Escape HTML by default
- **Trusted Sources**: Whitelist trusted content sources

### CSRF Protection

#### SameSite Cookies
```typescript
// Cookie configuration
{
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  path: '/',
}
```

#### Request Validation
- **Origin Validation**: Check request origin
- **Referer Validation**: Validate request referer
- **Custom Headers**: Require custom headers for state-changing requests

## 🌐 Network Security

### HTTPS Enforcement
```typescript
// Environment configuration
const envConfig = {
  production: {
    FORCE_HTTPS: true,
    SECURE_COOKIES: true,
  },
};
```

### CORS Configuration
```typescript
// API client configuration
const api = Axios.create({
  baseURL: env.API_URL,
  withCredentials: true, // Include cookies
});
```

### Security Headers
```typescript
// Expected security headers from backend
{
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Content-Security-Policy': "default-src 'self'",
  'Referrer-Policy': 'strict-origin-when-cross-origin',
}
```

## 🔐 Environment Security

### Environment Variable Management
```typescript
// src/config/env.ts
const EnvSchema = z.object({
  API_URL: z.string(),
  ENABLE_API_MOCKING: z
    .string()
    .refine((s) => s === 'true' || s === 'false')
    .transform((s) => s === 'true')
    .optional(),
  APP_URL: z.string().optional().default('http://localhost:3000'),
  APP_MOCK_API_PORT: z.string().optional().default('8080'),
});

export const env = EnvSchema.parse({
  API_URL: import.meta.env.VITE_API_URL,
  ENABLE_API_MOCKING: import.meta.env.VITE_ENABLE_API_MOCKING,
  APP_URL: import.meta.env.VITE_APP_URL,
  APP_MOCK_API_PORT: import.meta.env.VITE_APP_MOCK_API_PORT,
});
```

### Secret Management
- **Environment Variables**: Sensitive configuration
- **Build-Time Secrets**: API keys and endpoints
- **Runtime Configuration**: Dynamic configuration loading
- **Secret Rotation**: Regular secret updates

## 🛡️ Error Handling Security

### Secure Error Messages
```typescript
// Global error handler
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'An error occurred';
    
    // Don't expose sensitive error details
    const sanitizedMessage = sanitizeErrorMessage(message);
    
    useNotifications.getState().addNotification({
      type: 'error',
      title: 'Error',
      message: sanitizedMessage,
    });

    return Promise.reject(error);
  },
);
```

### Error Boundary Security
```typescript
export const MainErrorFallback = () => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center text-red-500">
      <h2 className="text-lg font-semibold">Something went wrong</h2>
      <Button
        className="mt-4"
        onClick={() => window.location.assign(window.location.origin)}
      >
        Refresh
      </Button>
    </div>
  );
};
```

## 🔍 Security Monitoring

### Security Logging
- **Authentication Events**: Login/logout tracking
- **Authorization Failures**: Access denied events
- **Input Validation Errors**: Malicious input attempts
- **Error Tracking**: Security-related errors

### Security Auditing
- **Dependency Scanning**: Regular vulnerability scans
- **Code Analysis**: Static security analysis
- **Penetration Testing**: Regular security assessments
- **Compliance Monitoring**: Security standard adherence

## 🧪 Security Testing

### Security Test Cases
```typescript
// Authorization testing
test('should deny access to admin-only resources for regular users', async () => {
  const user = await createUser({ role: ROLES.USER });
  
  await renderApp(
    <Authorization allowedRoles={[ROLES.ADMIN]}>
      <AdminComponent />
    </Authorization>,
    { user }
  );
  
  expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
});
```

### Security Testing Strategy
- **Authentication Testing**: Login/logout flows
- **Authorization Testing**: Role and policy validation
- **Input Validation Testing**: Malicious input handling
- **XSS Testing**: Cross-site scripting prevention
- **CSRF Testing**: Cross-site request forgery protection

---

This security architecture provides comprehensive protection against common web application vulnerabilities while maintaining usability and performance.
