# Data Flow Architecture

## Overview

The data flow architecture implements unidirectional data flow patterns with optimistic updates, intelligent caching, and real-time synchronization. It ensures consistent state management across the application.

## 🔄 Data Flow Patterns

### Unidirectional Data Flow

```
User Interaction → Event Handler → Custom Hook → API Call → Backend
     ↓                                                        ↓
UI Update ← State Update ← Cache Update ← Response Processing
```

### Request/Response Flow

```
1. User Interaction (Click, Form Submit)
   ↓
2. Event Handler (onClick, onSubmit)
   ↓
3. Custom Hook (useLogin, useCreateDiscussion)
   ↓
4. API Function (loginWithEmailAndPassword)
   ↓
5. HTTP Client (Axios with interceptors)
   ↓
6. Backend API
   ↓
7. Response Processing
   ↓
8. Cache Update (TanStack Query)
   ↓
9. UI Re-render (React state update)
```

## 🗄️ State Management Strategy

### State Categories

#### 1. Server State (TanStack Query)
- **API Data**: Users, discussions, comments
- **Cache Management**: Automatic caching and invalidation
- **Background Updates**: Seamless data synchronization
- **Optimistic Updates**: Immediate UI feedback

#### 2. Client State (Zustand)
- **UI State**: Modal open/close, loading states
- **User Preferences**: Theme, language settings
- **Notifications**: Global notification system
- **Temporary Data**: Form drafts, filters

#### 3. Form State (React Hook Form)
- **Form Data**: Input values and validation
- **Form State**: Dirty, touched, errors
- **Submission State**: Loading, success, error
- **Field State**: Individual field validation

#### 4. URL State (React Router)
- **Route Parameters**: Dynamic route segments
- **Search Parameters**: Query strings and filters
- **Navigation State**: History and location
- **Route Data**: Loader and action data

### State Flow Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Action   │───▶│  Event Handler  │───▶│   Custom Hook   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   UI Re-render  │◀───│  State Update   │◀───│   API Function  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Cache Update   │◀───│Response Process │◀───│  Backend API    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Optimistic Updates

### Implementation Pattern

```typescript
export const useCreateComment = ({ mutationConfig }: UseCreateCommentOptions = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createComment,
    onMutate: async (newComment) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(['comments', newComment.discussionId]);
      
      // Snapshot previous value
      const previousComments = queryClient.getQueryData(['comments', newComment.discussionId]);
      
      // Optimistically update cache
      queryClient.setQueryData(['comments', newComment.discussionId], (old: Comment[]) => [
        ...old,
        {
          ...newComment,
          id: 'temp-' + Date.now(),
          createdAt: new Date().toISOString(),
          author: getCurrentUser(),
        },
      ]);
      
      return { previousComments };
    },
    onError: (err, newComment, context) => {
      // Rollback on error
      queryClient.setQueryData(
        ['comments', newComment.discussionId],
        context?.previousComments
      );
    },
    onSettled: (data, error, variables) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries(['comments', variables.discussionId]);
    },
    ...mutationConfig,
  });
};
```

### Optimistic Update Benefits
- **Immediate Feedback**: Users see changes instantly
- **Better UX**: No waiting for server response
- **Error Recovery**: Automatic rollback on failure
- **Consistency**: Server refetch ensures data accuracy

## 📊 Cache Management

### Cache Strategy

#### Multi-Level Caching
```
1. Browser Cache (Static Assets)
   ↓
2. Query Cache (TanStack Query)
   ↓
3. Component Cache (React.memo)
   ↓
4. Service Worker Cache (Future)
```

#### Cache Configuration
```typescript
// src/lib/react-query.ts
export const queryConfig = {
  queries: {
    staleTime: 1000 * 60,        // 1 minute
    cacheTime: 1000 * 60 * 5,    // 5 minutes
    refetchOnWindowFocus: false,
    retry: false,
  },
} satisfies DefaultOptions;
```

### Cache Invalidation Patterns

#### Targeted Invalidation
```typescript
// Invalidate specific queries
queryClient.invalidateQueries(['discussions']);
queryClient.invalidateQueries(['discussion', discussionId]);
queryClient.invalidateQueries(['comments', discussionId]);

// Invalidate with filters
queryClient.invalidateQueries({
  queryKey: ['discussions'],
  predicate: (query) => query.queryKey[1]?.page > 1,
});
```

#### Cache Updates
```typescript
// Direct cache updates
queryClient.setQueryData(['discussion', discussionId], updatedDiscussion);

// Functional updates
queryClient.setQueryData(['discussions'], (old: Discussion[]) =>
  old.map((discussion) =>
    discussion.id === discussionId ? updatedDiscussion : discussion
  )
);
```

#### Cache Removal
```typescript
// Remove from cache
queryClient.removeQueries(['discussion', discussionId]);

// Clear all cache
queryClient.clear();
```

## 🔄 State Synchronization

### Real-Time Updates

#### Polling Strategy
```typescript
export const useDiscussions = ({ page, queryConfig }: UseDiscussionsOptions = {}) => {
  return useQuery({
    ...getDiscussionsQueryOptions({ page }),
    refetchInterval: 30000, // Poll every 30 seconds
    refetchIntervalInBackground: false,
    ...queryConfig,
  });
};
```

#### Manual Refetch
```typescript
const { data, refetch } = useDiscussions();

// Manual refresh
const handleRefresh = () => {
  refetch();
};
```

### Background Synchronization

#### Window Focus Refetch
```typescript
// Refetch on window focus for critical data
export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: getUser,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
};
```

#### Network Recovery
```typescript
// Automatic refetch on network recovery
export const useDiscussions = () => {
  return useQuery({
    queryKey: ['discussions'],
    queryFn: getDiscussions,
    refetchOnReconnect: true,
    networkMode: 'offlineFirst',
  });
};
```

## 📝 Form Data Flow

### Form State Management

#### React Hook Form Integration
```typescript
const CreateDiscussionForm = ({ onSuccess }: CreateDiscussionFormProps) => {
  const createDiscussion = useCreateDiscussion({
    mutationConfig: {
      onSuccess: () => {
        onSuccess();
      },
    },
  });

  return (
    <Form
      onSubmit={(values) => {
        createDiscussion.mutate({ data: values });
      }}
      schema={createDiscussionInputSchema}
    >
      {({ register, formState }) => (
        <>
          <Input
            label="Title"
            error={formState.errors['title']}
            registration={register('title')}
          />
          <Textarea
            label="Body"
            error={formState.errors['body']}
            registration={register('body')}
          />
          <Button
            isLoading={createDiscussion.isPending}
            type="submit"
            className="w-full"
          >
            Create Discussion
          </Button>
        </>
      )}
    </Form>
  );
};
```

### Form Data Flow
```
1. User Input → Form State Update
2. Validation → Error State Update
3. Submit → API Call
4. Success → Cache Update + UI Update
5. Error → Error State Update
```

## 🔄 Error State Management

### Error Handling Flow

#### API Error Handling
```typescript
// Global error interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message;
    
    // Update global error state
    useNotifications.getState().addNotification({
      type: 'error',
      title: 'Error',
      message,
    });

    return Promise.reject(error);
  },
);
```

#### Component Error Boundaries
```typescript
<ErrorBoundary
  FallbackComponent={({ error, resetErrorBoundary }) => (
    <div>
      <h2>Something went wrong:</h2>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )}
  onError={(error, errorInfo) => {
    console.error('Error caught by boundary:', error, errorInfo);
  }}
>
  <App />
</ErrorBoundary>
```

### Error Recovery Patterns

#### Retry Mechanisms
```typescript
const { data, error, refetch, isError } = useDiscussions();

if (isError) {
  return (
    <div>
      <p>Failed to load discussions</p>
      <Button onClick={() => refetch()}>Retry</Button>
    </div>
  );
}
```

#### Fallback UI
```typescript
const DiscussionsList = () => {
  const { data, isLoading, isError } = useDiscussions();

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorFallback />;
  if (!data?.length) return <EmptyState />;

  return (
    <div>
      {data.map((discussion) => (
        <DiscussionCard key={discussion.id} discussion={discussion} />
      ))}
    </div>
  );
};
```

## 📈 Performance Optimization

### Data Loading Optimization

#### Prefetching
```typescript
// Route-level prefetching
export const clientLoader = (queryClient: QueryClient) => async () => {
  const query = getDiscussionsQueryOptions();
  
  return (
    queryClient.getQueryData(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  );
};
```

#### Parallel Loading
```typescript
const DashboardRoute = () => {
  // Load multiple queries in parallel
  const { data: user } = useUser();
  const { data: discussions } = useDiscussions();
  const { data: recentComments } = useRecentComments();

  return (
    <div>
      <UserProfile user={user} />
      <RecentDiscussions discussions={discussions} />
      <RecentComments comments={recentComments} />
    </div>
  );
};
```

### Memory Management

#### Query Cleanup
```typescript
// Automatic cleanup of unused queries
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 5, // 5 minutes
      staleTime: 1000 * 60,     // 1 minute
    },
  },
});
```

#### Component Cleanup
```typescript
// Cleanup on component unmount
useEffect(() => {
  return () => {
    // Cleanup subscriptions, timers, etc.
  };
}, []);
```

---

This data flow architecture ensures efficient, consistent, and performant state management across the entire application.
