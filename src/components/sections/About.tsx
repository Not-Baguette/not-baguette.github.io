import { Container } from '../layout/Container';
import './About.css';


/* unused component for now */
export const About = () => {
  return (
    <section id="about" className="about-section">
      <Container>
        <div className="about-grid grid-2">
          {/* About Content */}
          <div>
            <div className="caption about-caption">
              ABOUT ME
            </div>
            <h2 className="about-title">
              Passionate Developer & Designer
            </h2>
            <div className="about-content">
              <p className="body-large about-text-large">
                I'm a frontend developer and UI designer with 5+ years of experience creating 
                beautiful, functional digital experiences. I specialize in React, TypeScript, 
                and modern web technologies.
              </p>
              <p className="about-text">
                My approach combines technical expertise with a keen eye for design, ensuring 
                that every project not only works flawlessly but also provides an exceptional 
                user experience. I'm passionate about clean code, accessible design, and 
                solving complex problems with elegant solutions.
              </p>
              <p className="about-text">
                When I'm not coding, you can find me exploring new design trends, contributing 
                to open-source projects, or sharing my knowledge through technical writing 
                and mentoring.
              </p>
            </div>
            <div className="about-resume-section">
              <a href="/resume.pdf" className="btn-primary">
                Download Resume
              </a>
            </div>
          </div>

          {/* Statistics/Achievements */}
          <div className="card">
            <h3 className="stats-title">
              Quick Stats
            </h3>
            
            <div className="stats-grid">
              {[
                { number: "50+", label: "Projects Completed" },
                { number: "5+", label: "Years Experience" },
                { number: "20+", label: "Happy Clients" },
                { number: "15+", label: "Technologies" }
              ].map((stat, index) => (
                <div key={index} className="stat-item">
                  <div className="stat-number">
                    {stat.number}
                  </div>
                  <div className="caption stat-label">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="learning-section">
              <div className="caption learning-caption">
                CURRENTLY LEARNING
              </div>
              <div className="learning-tags">
                {["Next.js", "GraphQL", "Three.js"].map((tech, index) => (
                  <span key={index} className="caption learning-tag">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};