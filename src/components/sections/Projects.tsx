import React, { useState, useEffect } from 'react';
import './Projects.css';

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

interface Project {
  name: string;
  desc: string;
  tech: string;
  url: string;
}

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Define the specific repositories we want to show
  const targetRepos = ['not-baguette.github.io', 'HOI4-German-Country-Names', 'trigonoapp', 'WS2P'];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.github.com/users/Not-Baguette/repos?sort=updated&per_page=50&type=public`,
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
        
        const repos: GitHubRepo[] = await response.json();
        
        // Filter and map to get only the target repositories
        const filteredProjects = targetRepos
          .map(repoName => repos.find(repo => repo.name === repoName))
          .filter(repo => repo !== undefined)
          .map((repo: GitHubRepo) => ({
            name: repo.name,
            desc: repo.description || 'No description available',
            tech: repo.language || 'Mixed',
            url: repo.html_url
          }));
        
        setProjects(filteredProjects);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        // Fallback to static data if API fails
        setProjects([
          { name: 'not-baguette.github.io', desc: 'My personal portfolio website', tech: 'JavaScript', url: 'https://github.com/Not-Baguette/not-baguette.github.io' },
          { name: 'HOI4-German-Country-Names', desc: 'HOI4 mod for German country names', tech: 'AMPL', url: 'https://github.com/Not-Baguette/HOI4-German-Country-Names' },
          { name: 'trigonoapp', desc: 'Trigonometric learning app', tech: 'Python', url: 'https://github.com/Not-Baguette/trigonoapp' },
          { name: 'WS2P', desc: 'Windows Suicide Prevention Protocol', tech: 'Python', url: 'https://github.com/Not-Baguette/WS2P' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="projects-box">
        <h3 className="projects-title">
          My Projects ✿
        </h3>
        <div className="project-item">
          Loading projects...
        </div>
      </div>
    );
  }

  return (
    <div className="projects-box">
      <h3 className="projects-title">
        My Projects ✿
      </h3>
      <div className="projects-grid">
        {projects.map((project, i) => (
          <a 
            key={i} 
            href={project.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="project-item project-link"
          >
            <strong className="project-name">{project.name}</strong><br/>
            <span className="project-desc">{project.desc}</span><br/>
            <span className="project-tech">{project.tech}</span>
          </a>
        ))}
      </div>
    </div>
  );
};