# Network Layer Architecture

## Overview

The network layer provides a robust, secure, and efficient communication system between the frontend application and backend services. It implements modern patterns for API communication, error handling, and data synchronization.

## 🌐 API Client Architecture

### HTTP Client Configuration

```typescript
// src/lib/api-client.ts
import Axios, { InternalAxiosRequestConfig } from 'axios';

export const api = Axios.create({
  baseURL: env.API_URL,
});
```

### Request Interceptors

#### Authentication Interceptor
```typescript
function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  if (config.headers) {
    config.headers.Accept = 'application/json';
  }
  
  config.withCredentials = true; // Include cookies for authentication
  return config;
}

api.interceptors.request.use(authRequestInterceptor);
```

**Features:**
- **Content-Type Headers**: Automatic JSON content type setting
- **Credentials**: Cookie-based authentication with `withCredentials: true`
- **Base URL**: Centralized API endpoint configuration
- **Request Transformation**: Consistent request formatting

### Response Interceptors

#### Global Response Handler
```typescript
api.interceptors.response.use(
  (response) => {
    return response.data; // Extract data automatically
  },
  (error) => {
    const message = error.response?.data?.message || error.message;
    
    // Global error notification
    useNotifications.getState().addNotification({
      type: 'error',
      title: 'Error',
      message,
    });

    // Handle authentication errors
    if (error.response?.status === 401) {
      const searchParams = new URLSearchParams();
      const redirectTo = searchParams.get('redirectTo') || window.location.pathname;
      window.location.href = paths.auth.login.getHref(redirectTo);
    }

    return Promise.reject(error);
  },
);
```

**Features:**
- **Data Extraction**: Automatic response.data extraction
- **Error Handling**: Global error notification system
- **Authentication**: Automatic redirect on 401 unauthorized
- **Error Propagation**: Proper error chain maintenance

## 🔄 Data Fetching Strategy

### TanStack Query Integration

#### Query Configuration
```typescript
// src/lib/react-query.ts
export const queryConfig = {
  queries: {
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60, // 1 minute
  },
} satisfies DefaultOptions;
```

#### Query Patterns

**Standard Query Pattern:**
```typescript
// src/features/users/api/get-users.ts
export const getUsers = (): Promise<{ data: User[] }> => {
  return api.get(`/users`);
};

export const getUsersQueryOptions = () => {
  return queryOptions({
    queryKey: ['users'],
    queryFn: getUsers,
  });
};

export const useUsers = ({ queryConfig }: UseUsersOptions = {}) => {
  return useQuery({
    ...getUsersQueryOptions(),
    ...queryConfig,
  });
};
```

**Paginated Query Pattern:**
```typescript
// src/features/discussions/api/get-discussions.ts
export const getDiscussions = (page = 1): Promise<{
  data: Discussion[];
  meta: Meta;
}> => {
  return api.get(`/discussions`, {
    params: { page },
  });
};

export const getDiscussionsQueryOptions = ({ page }: { page?: number } = {}) => {
  return queryOptions({
    queryKey: page ? ['discussions', { page }] : ['discussions'],
    queryFn: () => getDiscussions(page),
  });
};
```

### Mutation Patterns

#### Standard Mutation
```typescript
export const createDiscussion = (data: CreateDiscussionInput): Promise<Discussion> => {
  return api.post('/discussions', data);
};

export const useCreateDiscussion = ({ mutationConfig }: UseCreateDiscussionOptions = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createDiscussion,
    onSuccess: () => {
      queryClient.invalidateQueries(['discussions']);
    },
    ...mutationConfig,
  });
};
```

#### Optimistic Updates
```typescript
export const useUpdateDiscussion = ({ mutationConfig }: UseUpdateDiscussionOptions = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ data, discussionId }: { data: UpdateDiscussionInput; discussionId: string }) =>
      updateDiscussion({ data, discussionId }),
    onMutate: async ({ data, discussionId }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(['discussion', discussionId]);
      
      // Snapshot previous value
      const previousDiscussion = queryClient.getQueryData(['discussion', discussionId]);
      
      // Optimistically update
      queryClient.setQueryData(['discussion', discussionId], {
        ...previousDiscussion,
        ...data,
      });
      
      return { previousDiscussion };
    },
    onError: (err, { discussionId }, context) => {
      // Rollback on error
      if (context?.previousDiscussion) {
        queryClient.setQueryData(['discussion', discussionId], context.previousDiscussion);
      }
    },
    onSettled: (data, error, { discussionId }) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries(['discussion', discussionId]);
    },
    ...mutationConfig,
  });
};
```

## 🔧 API Layer Organization

### Feature-Based API Structure
```
src/features/
├── auth/api/
│   ├── login.ts
│   ├── register.ts
│   └── logout.ts
├── discussions/api/
│   ├── get-discussions.ts
│   ├── get-discussion.ts
│   ├── create-discussion.ts
│   ├── update-discussion.ts
│   └── delete-discussion.ts
├── comments/api/
│   ├── get-comments.ts
│   ├── create-comment.ts
│   └── delete-comment.ts
├── users/api/
│   ├── get-users.ts
│   ├── update-profile.ts
│   └── delete-user.ts
└── teams/api/
    └── get-teams.ts
```

### API Conventions

#### Consistent Response Format
```typescript
// Success Response
{
  data: T | T[],
  meta?: {
    page: number;
    totalPages: number;
    totalCount: number;
  }
}

// Error Response
{
  message: string;
  errors?: Record<string, string[]>;
}
```

#### Type-Safe API Contracts
```typescript
// src/types/api.ts
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'USER';
  teamId: string;
}

export interface AuthResponse {
  user: User;
  jwt: string;
}

export interface Discussion {
  id: string;
  title: string;
  body: string;
  author: User;
  createdAt: string;
  updatedAt: string;
}
```

## 🚀 Performance Optimizations

### Caching Strategy

#### Query Caching
- **Stale Time**: 1 minute for most queries
- **Cache Time**: 5 minutes default
- **Background Refetching**: Automatic data synchronization
- **Intelligent Invalidation**: Targeted cache updates

#### Cache Invalidation Patterns
```typescript
// Invalidate related queries
queryClient.invalidateQueries(['discussions']);
queryClient.invalidateQueries(['discussion', discussionId]);

// Update specific cache entries
queryClient.setQueryData(['discussion', discussionId], updatedDiscussion);

// Remove from cache
queryClient.removeQueries(['discussion', discussionId]);
```

### Request Optimization

#### Request Deduplication
- **Automatic Deduplication**: TanStack Query prevents duplicate requests
- **Request Batching**: Multiple queries in single request where possible
- **Parallel Requests**: Independent queries run concurrently

#### Error Recovery
```typescript
const queryConfig = {
  retry: (failureCount, error) => {
    // Don't retry on 4xx errors
    if (error.response?.status >= 400 && error.response?.status < 500) {
      return false;
    }
    // Retry up to 3 times for other errors
    return failureCount < 3;
  },
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
};
```

## 🛡️ Network Security

### Request Security

#### CORS Configuration
```typescript
// Credentials included for authentication
config.withCredentials = true;

// Proper CORS headers expected from backend
// Access-Control-Allow-Credentials: true
// Access-Control-Allow-Origin: specific domain
```

#### Request Validation
- **Input Sanitization**: Client-side validation before sending
- **Schema Validation**: Zod schemas for request/response validation
- **Rate Limiting**: Prevent abuse with request throttling

### Response Security

#### Response Validation
```typescript
// Runtime type checking with Zod
const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.enum(['ADMIN', 'USER']),
});

// Validate API responses
const validateUser = (data: unknown): User => {
  return UserSchema.parse(data);
};
```

#### Error Handling Security
- **Error Message Sanitization**: No sensitive data in error messages
- **Error Logging**: Secure error tracking without exposing internals
- **Graceful Degradation**: Fallback UI for network failures

## 🧪 Testing Network Layer

### Mock Service Worker (MSW)
```typescript
// src/testing/mocks/handlers/auth.ts
export const authHandlers = [
  http.post(`${env.API_URL}/auth/login`, async ({ request }) => {
    const credentials = await request.json() as LoginBody;
    const result = authenticate(credentials);
    
    return HttpResponse.json(result, {
      headers: {
        'Set-Cookie': `${AUTH_COOKIE}=${result.jwt}; Path=/;`,
      },
    });
  }),
];
```

### Network Testing Strategies
- **Unit Tests**: API function testing with mocked responses
- **Integration Tests**: Feature testing with MSW
- **E2E Tests**: Real network requests in test environment
- **Error Scenario Testing**: Network failure simulation

---

This network layer architecture ensures reliable, secure, and performant communication between the frontend and backend systems.
