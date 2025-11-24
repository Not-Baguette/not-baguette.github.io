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
  const targetRepos = [
    { owner: 'Not-Baguette', name: 'not-baguette.github.io' },
    { owner: 'Not-Baguette', name: 'HOI4-German-Country-Names' },
    { owner: 'SimpulAksaraJawa', name: 'beng-frontend' },
    { owner: 'SimpulAksaraJawa', name: 'beng-backend' }
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const allProjects: Project[] = [];
        
        // Fetch each repository individually
        for (const repo of targetRepos) {
          try {
            const response = await fetch(
              `https://api.github.com/repos/${repo.owner}/${repo.name}`,
              {
                headers: {
                  'Accept': 'application/vnd.github.v3+json',
                  'User-Agent': 'Portfolio-Site'
                }
              }
            );
            
            if (response.ok) {
              const repoData: GitHubRepo = await response.json();
              allProjects.push({
                name: repoData.name,
                desc: repoData.description || 'No description available',
                tech: repoData.language || 'Mixed',
                url: repoData.html_url
              });
            }
          } catch (error) {
            console.error(`Failed to fetch ${repo.owner}/${repo.name}:`, error);
          }
        }
        
        setProjects(allProjects);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
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