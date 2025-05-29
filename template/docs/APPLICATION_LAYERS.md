# Application Layers Architecture

## Overview

The application follows a layered architecture pattern with clear separation of concerns, enabling maintainability, testability, and scalability. Each layer has specific responsibilities and well-defined interfaces.

## 🏛️ Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 Presentation Layer                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐ │
│  │ UI Components│ │   Routes    │ │      Layouts           │ │
│  └─────────────┘ └─────────────┘ └─────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                Business Logic Layer                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐ │
│  │Custom Hooks │ │    Auth     │ │    Authorization       │ │
│  └─────────────┘ └─────────────┘ └─────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                 Data Access Layer                           │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐ │
│  │ API Client  │ │TanStack Query│ │    Zustand Store       │ │
│  └─────────────┘ └─────────────┘ └─────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│               Infrastructure Layer                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐ │
│  │Configuration│ │  Utilities  │ │  Testing Infrastructure │ │
│  └─────────────┘ └─────────────┘ └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 1️⃣ Presentation Layer

### Responsibility
- User interface rendering
- User interaction handling
- Visual state management
- Accessibility implementation

### Structure
```
src/
├── components/
│   ├── ui/                 # Design system components
│   ├── layouts/           # Layout components
│   ├── errors/            # Error boundary components
│   └── seo/               # SEO components
├── features/*/components/ # Feature-specific components
└── app/routes/           # Route components
```

### UI Components (Design System)

#### Atomic Components
```typescript
// src/components/ui/button/button.tsx
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, isLoading, icon, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {isLoading && <Spinner size="sm" className="text-current" />}
        {!isLoading && icon && <span className="mr-2">{icon}</span>}
        <span className="mx-2">{children}</span>
      </Comp>
    );
  },
);
```

#### Form Components
```typescript
// src/components/ui/form/form.tsx
const Form = <Schema extends ZodType<any, any, any>, TFormValues extends FieldValues = z.infer<Schema>>({
  onSubmit,
  children,
  className,
  options,
  id,
  schema,
}: FormProps<TFormValues, Schema>) => {
  const form = useForm({ ...options, resolver: zodResolver(schema) });
  
  return (
    <FormProvider {...form}>
      <form
        className={cn('space-y-6', className)}
        onSubmit={form.handleSubmit(onSubmit)}
        id={id}
      >
        {children(form)}
      </form>
    </FormProvider>
  );
};
```

### Layout Components

#### Application Layout
```typescript
// src/components/layouts/app-layout.tsx
export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
```

#### Content Layout
```typescript
// src/components/layouts/content-layout.tsx
export const ContentLayout = ({ children, title }: ContentLayoutProps) => {
  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <Head title={title} />
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="py-4">{children}</div>
      </div>
    </div>
  );
};
```

### Route Components

#### Route Structure
```typescript
// src/app/routes/app/discussions/discussions.tsx
const DiscussionsRoute = () => {
  return (
    <ContentLayout title="Discussions">
      <div className="flex justify-end">
        <Authorization allowedRoles={[ROLES.ADMIN]}>
          <CreateDiscussion />
        </Authorization>
      </div>
      <div className="mt-4">
        <DiscussionsList />
      </div>
    </ContentLayout>
  );
};

export const clientLoader = (queryClient: QueryClient) => async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page')) || 1;
  
  const query = getDiscussionsQueryOptions({ page });
  
  return queryClient.getQueryData(query.queryKey) ?? (await queryClient.fetchQuery(query));
};

export default DiscussionsRoute;
```

## 2️⃣ Business Logic Layer

### Responsibility
- Business rules implementation
- Data transformation
- State management logic
- Cross-cutting concerns

### Structure
```
src/
├── features/*/api/        # Feature-specific API calls
├── hooks/                 # Custom React hooks
├── lib/
│   ├── auth.tsx          # Authentication logic
│   └── authorization.tsx # Authorization logic
└── utils/                # Business utilities
```

### Custom Hooks

#### Data Fetching Hooks
```typescript
// src/features/discussions/api/get-discussions.ts
export const useDiscussions = ({ page, queryConfig }: UseDiscussionsOptions = {}) => {
  return useQuery({
    ...getDiscussionsQueryOptions({ page }),
    ...queryConfig,
  });
};
```

#### Business Logic Hooks
```typescript
// src/hooks/use-disclosure.ts
export const useDisclosure = (defaultIsOpen = false) => {
  const [isOpen, setIsOpen] = React.useState(defaultIsOpen);

  const open = React.useCallback(() => setIsOpen(true), []);
  const close = React.useCallback(() => setIsOpen(false), []);
  const toggle = React.useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, open, close, toggle };
};
```

### Authentication Logic

#### Auth Configuration
```typescript
// src/lib/auth.tsx
const authConfig = {
  userFn: getUser,
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

export const { useUser, useLogin, useLogout, useRegister, AuthLoader } = configureAuth(authConfig);
```

### Authorization Logic

#### Role-Based Authorization
```typescript
// src/lib/authorization.tsx
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

## 3️⃣ Data Access Layer

### Responsibility
- API communication
- Data caching
- State synchronization
- Error handling

### Structure
```
src/
├── lib/
│   ├── api-client.ts     # HTTP client configuration
│   └── react-query.ts    # Query configuration
├── features/*/api/       # Feature-specific endpoints
└── types/api.ts          # API type definitions
```

### API Client

#### HTTP Client Setup
```typescript
// src/lib/api-client.ts
export const api = Axios.create({
  baseURL: env.API_URL,
});

api.interceptors.request.use(authRequestInterceptor);
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Global error handling
    handleApiError(error);
    return Promise.reject(error);
  },
);
```

### Server State Management

#### Query Configuration
```typescript
// src/lib/react-query.ts
export const queryConfig = {
  queries: {
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60,
  },
} satisfies DefaultOptions;
```

### Client State Management

#### Notification Store
```typescript
// src/components/ui/notifications/notifications-store.ts
type NotificationsStore = {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  dismissNotification: (id: string) => void;
};

export const useNotifications = create<NotificationsStore>((set) => ({
  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        { ...notification, id: nanoid() },
      ],
    })),
  dismissNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((notification) => notification.id !== id),
    })),
}));
```

## 4️⃣ Infrastructure Layer

### Responsibility
- Configuration management
- Utility functions
- Testing infrastructure
- Build and deployment

### Structure
```
src/
├── config/               # Configuration files
│   ├── env.ts           # Environment variables
│   └── paths.ts         # Route paths
├── utils/               # Utility functions
│   ├── cn.ts           # Class name utilities
│   └── format.ts       # Formatting utilities
└── testing/            # Testing infrastructure
    ├── mocks/          # Mock implementations
    ├── test-utils.tsx  # Testing utilities
    └── setup-tests.ts  # Test setup
```

### Configuration Management

#### Environment Configuration
```typescript
// src/config/env.ts
const EnvSchema = z.object({
  API_URL: z.string(),
  ENABLE_API_MOCKING: z.boolean().optional(),
  APP_URL: z.string().default('http://localhost:3000'),
});

export const env = EnvSchema.parse({
  API_URL: import.meta.env.VITE_API_URL,
  ENABLE_API_MOCKING: import.meta.env.VITE_ENABLE_API_MOCKING === 'true',
  APP_URL: import.meta.env.VITE_APP_URL,
});
```

#### Path Configuration
```typescript
// src/config/paths.ts
export const paths = {
  home: {
    path: '/',
    getHref: () => '/',
  },
  auth: {
    login: {
      path: '/auth/login',
      getHref: (redirectTo?: string) =>
        `/auth/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
    },
    register: {
      path: '/auth/register',
      getHref: () => '/auth/register',
    },
  },
  app: {
    root: { path: '/app', getHref: () => '/app' },
    dashboard: { path: '/app', getHref: () => '/app' },
    discussions: { path: '/app/discussions', getHref: () => '/app/discussions' },
    discussion: { path: '/app/discussions/:discussionId', getHref: (id: string) => `/app/discussions/${id}` },
    users: { path: '/app/users', getHref: () => '/app/users' },
    profile: { path: '/app/profile', getHref: () => '/app/profile' },
  },
} as const;
```

### Utility Functions

#### Class Name Utilities
```typescript
// src/utils/cn.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

#### Formatting Utilities
```typescript
// src/utils/format.ts
import dayjs from 'dayjs';

export const formatDate = (date: string) => dayjs(date).format('MMMM D, YYYY');
```

## 🔄 Layer Communication

### Data Flow Between Layers
```
Presentation Layer
       ↓ (User Events)
Business Logic Layer
       ↓ (API Calls)
Data Access Layer
       ↓ (HTTP Requests)
Infrastructure Layer
```

### Communication Patterns

#### Top-Down Communication
- Props passing from parent to child components
- Context providers for shared state
- Custom hooks for business logic

#### Bottom-Up Communication
- Event handlers and callbacks
- State updates through hooks
- Error propagation through error boundaries

### Cross-Cutting Concerns

#### Error Handling
```typescript
// Global error boundary
<ErrorBoundary FallbackComponent={MainErrorFallback}>
  <App />
</ErrorBoundary>
```

#### Loading States
```typescript
// Suspense boundaries
<React.Suspense fallback={<Spinner />}>
  <LazyComponent />
</React.Suspense>
```

---

This layered architecture ensures clean separation of concerns, making the application maintainable, testable, and scalable.
