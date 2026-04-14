import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <main>
        <h1>Movie Review App</h1>
        <p>Ready for development.</p>
      </main>
    </QueryClientProvider>
  );
}
