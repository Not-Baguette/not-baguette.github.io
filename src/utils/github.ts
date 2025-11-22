/**
 * GitHub API utility functions for fetching repository information
 */

interface GitHubCommit {
  sha: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
  html_url: string;
}

interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  fork: boolean;
}

interface PinnedRepository {
  name: string;
  description: string | null;
  url: string;
  homepageUrl: string | null;
  primaryLanguage: {
    name: string;
    color: string;
  } | null;
  stargazerCount: number;
  forkCount: number;
  repositoryTopics: {
    nodes: Array<{
      topic: {
        name: string;
      };
    }>;
  };
}

/**
 * Fetches the latest commit information from a GitHub repository
 */
export const getLatestCommit = async (owner: string, repo: string): Promise<GitHubCommit | null> => {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Portfolio-Site'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const commits = await response.json();
    return commits[0] || null;
  } catch (error) {
    console.error('Failed to fetch latest commit:', error);
    return null;
  }
};

/**
 * Formats a date string to a readable format
 */
export const formatLastUpdated = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Failed to format date:', error);
    return 'Unknown';
  }
};

/**
 * Gets the last updated date for the repository
 */
export const getLastUpdated = async (owner: string = 'Not-Baguette', repo: string = 'not-baguette.github.io'): Promise<string> => {
  const commit = await getLatestCommit(owner, repo);
  
  if (commit && commit.commit.author.date) {
    return formatLastUpdated(commit.commit.author.date);
  }
  
  // Fallback to current date if API fails
  return formatLastUpdated(new Date().toISOString());
};

/**
 * Fetches pinned repositories using GitHub GraphQL API
 */
export const getPinnedRepositories = async (username: string = 'Not-Baguette'): Promise<PinnedRepository[]> => {
  const query = `
    query {
      user(login: "${username}") {
        pinnedItems(first: 6, types: REPOSITORY) {
          nodes {
            ... on Repository {
              name
              description
              url
              homepageUrl
              primaryLanguage {
                name
                color
              }
              stargazerCount
              forkCount
              repositoryTopics(first: 10) {
                nodes {
                  topic {
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Portfolio-Site',
        // Note: For production, you'd want to use a GitHub token
        // 'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`
      },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      throw new Error(`GitHub GraphQL API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
    }

    return data.data?.user?.pinnedItems?.nodes || [];
  } catch (error) {
    console.error('Failed to fetch pinned repositories:', error);
    // Return empty array as fallback since types don't match
    return [];
  }
};

/**
 * Fallback function to get top repositories when GraphQL fails
 */
export const getFallbackRepositories = async (username: string = 'Not-Baguette'): Promise<GitHubRepository[]> => {
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=50&type=public`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Portfolio-Site'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos = await response.json();
    
    // Define priority repositories that should always be included
    const priorityRepos = [
      'Thornsoul',
      'not-baguette.github.io',
      'Project-Gideon'
    ];
    
    // Filter out forks only (include portfolio site in priority list)
    const filteredRepos = repos.filter((repo: GitHubRepository) => !repo.fork);
    
    // Get only the priority repos in the specified order
    const priority = priorityRepos
      .map(repoName => filteredRepos.find((repo: GitHubRepository) => repo.name === repoName))
      .filter(repo => repo !== undefined) as GitHubRepository[];
    
    // Return only the 3 priority repos
    return priority;
  } catch (error) {
    console.error('Failed to fetch fallback repositories:', error);
    return [];
  }
};