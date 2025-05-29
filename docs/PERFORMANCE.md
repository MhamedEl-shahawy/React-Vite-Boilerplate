# Performance Architecture

## Overview

The performance architecture focuses on delivering fast, responsive user experiences through optimized loading, efficient caching, and smart resource management. It implements modern performance patterns and best practices.

## 🚀 Code Splitting Strategy

### Route-Based Code Splitting

```typescript
// src/app/router.tsx
export const createAppRouter = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      path: paths.app.discussions.path,
      lazy: () => import('./routes/app/discussions/discussions').then(convert(queryClient)),
    },
    {
      path: paths.app.discussion.path,
      lazy: () => import('./routes/app/discussions/discussion').then(convert(queryClient)),
    },
    {
      path: paths.app.users.path,
      lazy: () => import('./routes/app/users').then(convert(queryClient)),
    },
  ]);
```

### Component-Level Code Splitting

```typescript
// Lazy load heavy components
const HeavyChart = React.lazy(() => import('./HeavyChart'));

const Dashboard = () => {
  return (
    <div>
      <React.Suspense fallback={<ChartSkeleton />}>
        <HeavyChart />
      </React.Suspense>
    </div>
  );
};
```

### Bundle Optimization

#### Vite Configuration
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        experimentalMinChunkSize: 3500,
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          query: ['@tanstack/react-query'],
        },
      },
    },
  },
});
```

#### Bundle Analysis
```bash
# Analyze bundle size
npx vite-bundle-analyzer

# Build with analysis
yarn build --analyze
```

### Tree Shaking Optimization

```typescript
// Import only what you need
import { format } from 'date-fns/format';
import { Button } from '@/components/ui/button';

// Avoid default imports for large libraries
import { debounce } from 'lodash/debounce';
```

## 📦 Caching Strategy

### Multi-Level Caching Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser Cache                            │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐ │
│  │Static Assets│ │   Images    │ │        Fonts           │ │
│  └─────────────┘ └─────────────┘ └─────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                   Query Cache                               │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐ │
│  │  API Data   │ │ User State  │ │    Background Sync     │ │
│  └─────────────┘ └─────────────┘ └─────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                Component Cache                              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐ │
│  │React.memo() │ │ useMemo()   │ │    useCallback()       │ │
│  └─────────────┘ └─────────────┘ └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Query Cache Configuration

```typescript
// src/lib/react-query.ts
export const queryConfig = {
  queries: {
    staleTime: 1000 * 60,        // 1 minute - data considered fresh
    cacheTime: 1000 * 60 * 5,    // 5 minutes - cache retention
    refetchOnWindowFocus: false,  // Prevent unnecessary refetches
    retry: false,                 // Disable automatic retries
  },
} satisfies DefaultOptions;
```

### Intelligent Cache Invalidation

```typescript
// Smart cache updates
export const useUpdateDiscussion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateDiscussion,
    onSuccess: (updatedDiscussion) => {
      // Update specific discussion
      queryClient.setQueryData(['discussion', updatedDiscussion.id], updatedDiscussion);
      
      // Update discussions list
      queryClient.setQueryData(['discussions'], (old: Discussion[]) =>
        old?.map((discussion) =>
          discussion.id === updatedDiscussion.id ? updatedDiscussion : discussion
        )
      );
      
      // Invalidate related queries
      queryClient.invalidateQueries(['discussions', 'recent']);
    },
  });
};
```

### Component-Level Caching

```typescript
// Memoize expensive components
const ExpensiveComponent = React.memo(({ data }: { data: ComplexData }) => {
  const processedData = useMemo(() => {
    return expensiveDataProcessing(data);
  }, [data]);

  const handleClick = useCallback((id: string) => {
    // Handle click logic
  }, []);

  return <div>{/* Render processed data */}</div>;
});
```

## ⚡ Loading Optimization

### Progressive Loading

#### Skeleton Loading
```typescript
const DiscussionSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
    <div className="h-20 bg-gray-200 rounded"></div>
  </div>
);

const DiscussionsList = () => {
  const { data, isLoading } = useDiscussions();

  if (isLoading) {
    return (
      <div>
        {Array.from({ length: 5 }).map((_, i) => (
          <DiscussionSkeleton key={i} />
        ))}
      </div>
    );
  }

  return <div>{/* Render discussions */}</div>;
};
```

#### Suspense Boundaries
```typescript
const App = () => (
  <React.Suspense fallback={<AppSkeleton />}>
    <Router>
      <Routes>
        <Route
          path="/discussions"
          element={
            <React.Suspense fallback={<DiscussionsSkeleton />}>
              <DiscussionsPage />
            </React.Suspense>
          }
        />
      </Routes>
    </Router>
  </React.Suspense>
);
```

### Prefetching Strategies

#### Route Prefetching
```typescript
// Prefetch on hover
const DiscussionLink = ({ discussionId }: { discussionId: string }) => {
  const queryClient = useQueryClient();

  const handleMouseEnter = () => {
    queryClient.prefetchQuery({
      queryKey: ['discussion', discussionId],
      queryFn: () => getDiscussion(discussionId),
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };

  return (
    <Link
      to={`/discussions/${discussionId}`}
      onMouseEnter={handleMouseEnter}
    >
      View Discussion
    </Link>
  );
};
```

#### Data Prefetching
```typescript
// Prefetch related data
export const clientLoader = (queryClient: QueryClient) => async ({ params }: LoaderFunctionArgs) => {
  const discussionId = params.discussionId!;
  
  // Prefetch discussion and comments in parallel
  await Promise.all([
    queryClient.ensureQueryData({
      queryKey: ['discussion', discussionId],
      queryFn: () => getDiscussion(discussionId),
    }),
    queryClient.ensureQueryData({
      queryKey: ['comments', discussionId],
      queryFn: () => getComments(discussionId),
    }),
  ]);
};
```

## 🎯 Rendering Optimization

### Virtual Scrolling

```typescript
// For large lists
import { FixedSizeList as List } from 'react-window';

const VirtualizedDiscussionsList = ({ discussions }: { discussions: Discussion[] }) => {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      <DiscussionCard discussion={discussions[index]} />
    </div>
  );

  return (
    <List
      height={600}
      itemCount={discussions.length}
      itemSize={120}
      width="100%"
    >
      {Row}
    </List>
  );
};
```

### Pagination Optimization

```typescript
// Infinite scroll with pagination
export const useInfiniteDiscussions = () => {
  return useInfiniteQuery({
    queryKey: ['discussions', 'infinite'],
    queryFn: ({ pageParam = 1 }) => getDiscussions(pageParam),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.meta.hasNextPage ? pages.length + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5,
  });
};

const InfiniteDiscussionsList = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteDiscussions();

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <div>
      {data?.pages.map((page, i) => (
        <React.Fragment key={i}>
          {page.data.map((discussion) => (
            <DiscussionCard key={discussion.id} discussion={discussion} />
          ))}
        </React.Fragment>
      ))}
      <div ref={ref}>
        {isFetchingNextPage && <Spinner />}
      </div>
    </div>
  );
};
```

## 📊 Performance Monitoring

### Core Web Vitals

#### Largest Contentful Paint (LCP)
```typescript
// Optimize LCP with image optimization
const OptimizedImage = ({ src, alt, ...props }: ImageProps) => (
  <img
    src={src}
    alt={alt}
    loading="lazy"
    decoding="async"
    {...props}
  />
);
```

#### First Input Delay (FID)
```typescript
// Optimize FID with event delegation
const useEventDelegation = (containerRef: RefObject<HTMLElement>) => {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleClick = (event: Event) => {
      const target = event.target as HTMLElement;
      const button = target.closest('[data-action]');
      if (button) {
        const action = button.getAttribute('data-action');
        handleAction(action);
      }
    };

    container.addEventListener('click', handleClick);
    return () => container.removeEventListener('click', handleClick);
  }, []);
};
```

#### Cumulative Layout Shift (CLS)
```typescript
// Prevent layout shift with skeleton loading
const DiscussionCard = ({ discussion }: { discussion?: Discussion }) => {
  if (!discussion) {
    return <DiscussionSkeleton />;
  }

  return (
    <div className="min-h-[120px]"> {/* Fixed height to prevent shift */}
      {/* Discussion content */}
    </div>
  );
};
```

### Performance Metrics Collection

```typescript
// Performance monitoring
const usePerformanceMonitoring = () => {
  useEffect(() => {
    // Monitor navigation timing
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'navigation') {
          console.log('Navigation timing:', entry);
        }
      });
    });

    observer.observe({ entryTypes: ['navigation'] });

    return () => observer.disconnect();
  }, []);
};
```

## 🔧 Build Optimization

### Asset Optimization

#### Image Optimization
```typescript
// Responsive images
const ResponsiveImage = ({ src, alt }: { src: string; alt: string }) => (
  <picture>
    <source
      media="(min-width: 768px)"
      srcSet={`${src}?w=800&format=webp 1x, ${src}?w=1600&format=webp 2x`}
    />
    <source
      media="(max-width: 767px)"
      srcSet={`${src}?w=400&format=webp 1x, ${src}?w=800&format=webp 2x`}
    />
    <img
      src={`${src}?w=800&format=jpeg`}
      alt={alt}
      loading="lazy"
      decoding="async"
    />
  </picture>
);
```

#### Font Optimization
```css
/* Preload critical fonts */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/inter-v12-latin-regular.woff2') format('woff2');
}
```

### Compression and Minification

```typescript
// Vite compression plugin
import { defineConfig } from 'vite';
import { compression } from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    compression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
  ],
});
```

## 📈 Performance Best Practices

### Component Optimization

```typescript
// Optimize re-renders
const OptimizedComponent = React.memo(({ data, onAction }: Props) => {
  // Memoize expensive calculations
  const processedData = useMemo(() => {
    return expensiveProcessing(data);
  }, [data]);

  // Memoize event handlers
  const handleAction = useCallback((id: string) => {
    onAction(id);
  }, [onAction]);

  return <div>{/* Component content */}</div>;
});

// Use stable keys for lists
const ItemList = ({ items }: { items: Item[] }) => (
  <div>
    {items.map((item) => (
      <ItemComponent key={item.id} item={item} />
    ))}
  </div>
);
```

### State Update Optimization

```typescript
// Batch state updates
const useOptimizedState = () => {
  const [state, setState] = useState(initialState);

  const updateMultipleFields = useCallback((updates: Partial<State>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  return { state, updateMultipleFields };
};
```

### Network Optimization

```typescript
// Request deduplication
const useDeduplicatedQuery = (key: string, fn: () => Promise<any>) => {
  return useQuery({
    queryKey: [key],
    queryFn: fn,
    staleTime: 1000 * 60, // Prevent duplicate requests for 1 minute
  });
};

// Request batching
const useBatchedRequests = () => {
  const queryClient = useQueryClient();

  const batchRequests = useCallback(async (ids: string[]) => {
    const results = await Promise.all(
      ids.map((id) =>
        queryClient.fetchQuery({
          queryKey: ['item', id],
          queryFn: () => getItem(id),
        })
      )
    );
    return results;
  }, [queryClient]);

  return { batchRequests };
};
```

---

This performance architecture ensures optimal loading times, smooth interactions, and efficient resource utilization across the application.
