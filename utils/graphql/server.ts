import axios, { AxiosError, AxiosInstance } from 'axios';

// Define types for better type safety
interface GraphQLResponse<T> {
  data: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
    extensions?: Record<string, any>;
  }>;
}

interface GraphQLRequest {
  query: string;
  variables?: Record<string, any>;
  operationName?: string;
}

const createGraphQLClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: '/api/graphql',
    headers: {
      'Content-Type': 'application/json',
    },
    // Add timeout to prevent hanging requests
    timeout: 10000,
  });

  // Add request interceptor for authentication
  client.interceptors.request.use((config) => {
    // You can add auth token here if needed
    // const token = getAuthToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  });

  // Add response interceptor for error handling
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      // Handle network errors
      if (!error.response) {
        throw new Error('Network error occurred');
      }
      return Promise.reject(error);
    }
  );

  return client;
};

const graphqlClient = createGraphQLClient();

export async function fetchGraphQL<T>(
  query: string,
  variables: Record<string, any> = {},
  operationName?: string
): Promise<T> {
  try {
    const request: GraphQLRequest = {
      query,
      variables,
      operationName,
    };

    const response = await graphqlClient.post<GraphQLResponse<T>>('', request);
    const { data, errors } = response.data;

    if (errors) {
      // Enhanced error handling with more details
      const errorMessages = errors.map((err) => {
        const message = err.message;
        const location = err.locations
          ? ` at line ${err.locations[0].line}, column ${err.locations[0].column}`
          : '';
        const path = err.path ? ` in ${err.path.join('.')}` : '';
        return `${message}${location}${path}`;
      });
      throw new Error(errorMessages.join('\n'));
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`GraphQL request failed: ${error.message}`);
    }
    throw new Error('GraphQL request failed: Unknown error');
  }
}

// Add a utility function for handling multiple queries
export async function fetchMultipleQueries<T extends Record<string, any>>(
  queries: Record<string, { query: string; variables?: Record<string, any> }>
): Promise<T> {
  const results = await Promise.all(
    Object.entries(queries).map(async ([key, { query, variables }]) => {
      const result = await fetchGraphQL(query, variables);
      return [key, result];
    })
  );

  return Object.fromEntries(results) as T;
}

// Add a utility function for handling pagination
export async function fetchPaginatedData<T>(
  query: string,
  variables: Record<string, any> = {},
  pageSize: number = 10
): Promise<T[]> {
  let hasMore = true;
  let cursor: string | null = null;
  const results: T[] = [];

  while (hasMore) {
    const res: any = await fetchGraphQL<{ data: T[]; hasMore: boolean; cursor: string }>(
      query,
      { ...variables, first: pageSize, after: cursor }
    );

    results.push(...res.data);
    hasMore = res.hasMore;
    cursor = res.cursor;
  }

  return results;
}

export default graphqlClient;

/*
// Basic example
const data = await fetchGraphQL<{ user: User }>(
  `query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
    }
  }`,
  { id: '123' }
);

// Multiple queries
const results = await fetchMultipleQueries<{
  users: { users: User[] };
  posts: { posts: Post[] };
}>({
  users: {
    query: `query { users { id name } }`,
  },
  posts: {
    query: `query { posts { id title } }`,
  },
});

// Paginated data
const allPosts = await fetchPaginatedData<Post>(
  `query GetPosts($first: Int!, $after: String) {
    posts(first: $first, after: $after) {
      data { id title }
      hasMore
      cursor
    }
  }`,
  {},
  20
);
*/