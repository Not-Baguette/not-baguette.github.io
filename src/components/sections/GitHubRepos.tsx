import React, { useState, useEffect } from 'react';
import './GitHubRepos.css';
import { getFallbackRepositories } from '../../utils/github';
import { FaGithub, FaExternalLinkAlt, FaStar, FaCodeBranch } from 'react-icons/fa';

interface GitHubRepo {
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
}

export const GitHubRepos: React.FC = () => {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        setLoading(true);
        const repositories = await getFallbackRepositories('Not-Baguette');
        // The API function already handles filtering and prioritization
        setRepos(repositories);
      } catch (err) {
        setError('Failed to load repositories');
        console.error('Error fetching repositories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  const getLanguageColor = (language: string | null): string => {
    const colors: { [key: string]: string } = {
      'JavaScript': '#f1e05a',
      'TypeScript': '#2b7489',
      'Python': '#3572A5',
      'Java': '#b07219',
      'HTML': '#e34c26',
      'CSS': '#563d7c',
      'React': '#61dafb',
      'Vue': '#4FC08D',
      'C++': '#f34b7d',
      'C#': '#239120',
      'Go': '#00ADD8',
      'Rust': '#dea584',
      'PHP': '#4F5D95'
    };
    return colors[language || ''] || '#8b949e';
  };

  if (loading) {
    return (
      <div className="github-repos">
        <div className="repos-header">
          <h3 className="repos-title">
            <FaGithub /> My GitHub Projects
          </h3>
        </div>
        <div className="loading-message">
          Loading repositories...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="github-repos">
        <div className="repos-header">
          <h3 className="repos-title">
            <FaGithub /> My GitHub Projects
          </h3>
        </div>
        <div className="error-message">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="github-repos">
      <div className="repos-header">
        <h3 className="repos-title">
          <FaGithub /> My GitHub Projects
        </h3>
        <p className="repos-description">
          Here are some of my recent and notable repositories ♡
        </p>
      </div>
      
      <div className="repos-grid">
        {repos.map((repo) => (
          <div key={repo.id} className="repo-card">
            <div className="repo-header">
              <h4 className="repo-name">
                <a 
                  href={repo.html_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="repo-link"
                >
                  {repo.name}
                </a>
              </h4>
              <div className="repo-links">
                <a 
                  href={repo.html_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="repo-icon-link"
                  title="View on GitHub"
                >
                  <FaGithub />
                </a>
                {repo.homepage && (
                  <a 
                    href={repo.homepage} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="repo-icon-link"
                    title="Live Demo"
                  >
                    <FaExternalLinkAlt />
                  </a>
                )}
              </div>
            </div>
            
            {repo.description && (
              <p className="repo-description">
                {repo.description}
              </p>
            )}
            
            <div className="repo-footer">
              <div className="repo-meta">
                {repo.language && (
                  <span className="repo-language">
                    <span 
                      className="language-dot" 
                      style={{ backgroundColor: getLanguageColor(repo.language) }}
                    ></span>
                    {repo.language}
                  </span>
                )}
                
                <span className="repo-stars">
                  <FaStar /> {repo.stargazers_count}
                </span>
                
                <span className="repo-forks">
                  <FaCodeBranch /> {repo.forks_count}
                </span>
              </div>
              
              {repo.topics && repo.topics.length > 0 && (
                <div className="repo-topics">
                  {repo.topics.slice(0, 3).map((topic) => (
                    <span key={topic} className="repo-topic">
                      {topic}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="repos-footer">
        <a 
          href="https://github.com/Not-Baguette" 
          target="_blank" 
          rel="noopener noreferrer"
          className="view-all-link"
        >
          View all repositories on GitHub →
        </a>
      </div>
    </div>
  );
};