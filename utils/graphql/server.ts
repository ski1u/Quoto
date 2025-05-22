import axios from 'axios';

const graphqlClient = axios.create({
  baseURL: '/api/graphql', // Your GraphQL endpoint
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function fetchGraphQL<T>(query: string, variables: Record<string, any> = {}): Promise<T> {
  try {
    const response = await graphqlClient.post<{ data: T; errors?: Array<{ message: string }> }>('', { query, variables });
    const { data, errors } = response.data;

    if (errors) {
      throw new Error(errors.map((err: any) => err.message).join(', '));
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || 'GraphQL request failed');
  }
}

export default graphqlClient;