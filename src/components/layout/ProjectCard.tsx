interface ProjectCardProps {
  title: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
  projectUrl?: string;
  githubUrl?: string;
}

export const ProjectCard = ({ 
  title, 
  description, 
  technologies, 
  imageUrl, 
  projectUrl, 
  githubUrl 
}: ProjectCardProps) => {
  return (
    <div className="card" style={{
      transition: 'all 0.3s ease',
      border: '2px solid var(--color-secondary)',
      background: 'linear-gradient(135deg, rgba(255, 107, 157, 0.1) 0%, rgba(0, 212, 255, 0.1) 50%, rgba(57, 255, 20, 0.1) 100%)',
      position: 'relative'
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px) rotateX(5deg)';
        e.currentTarget.style.boxShadow = 'var(--shadow-neon), 0px 15px 30px rgba(0, 0, 0, 0.3)';
        e.currentTarget.style.borderColor = 'var(--color-accent)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) rotateX(0deg)';
        e.currentTarget.style.boxShadow = 'var(--shadow-soft)';
        e.currentTarget.style.borderColor = 'var(--color-secondary)';
      }}
    >
      {/* Retro Header Bar */}
      <div style={{
        background: 'linear-gradient(90deg, var(--color-secondary), var(--color-tertiary))',
        height: '30px',
        margin: 'calc(-1 * var(--space-6)) calc(-1 * var(--space-6)) var(--space-4) calc(-1 * var(--space-6))',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 'var(--space-4)',
        fontFamily: 'var(--font-retro)',
        fontSize: 'var(--font-caption)',
        color: 'var(--color-black)'
      }}>
        • • • PROJECT.EXE
      </div>

      {/* Project Image */}
      <div style={{
        width: '100%',
        height: '180px',
        background: 'linear-gradient(45deg, var(--color-primary), var(--color-primary-light))',
        borderRadius: 'var(--radius-button)',
        marginBottom: 'var(--space-6)',
        overflow: 'hidden',
        position: 'relative',
        border: '2px solid var(--color-border)'
      }}>
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'saturate(1.2) contrast(1.1)'
            }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            background: 'radial-gradient(circle, var(--color-secondary) 0%, var(--color-tertiary) 100%)',
            backgroundSize: '200% 200%',
            animation: 'pulse 2s ease-in-out infinite',
            color: 'var(--color-text)',
            fontFamily: 'var(--font-accent)',
            fontWeight: '500'
          }}>
            Project Preview
          </div>
        )}
        
        {/* Scan Lines Effect */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0, 0, 0, 0.1) 3px, rgba(0, 0, 0, 0.1) 6px)',
          pointerEvents: 'none'
        }}></div>
      </div>

      {/* Project Content */}
      <div>
        <h3 className="glitch-text" style={{
          marginBottom: 'var(--space-3)',
          color: 'var(--color-text)',
          fontFamily: 'var(--font-heading)',
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
          background: 'linear-gradient(45deg, var(--color-secondary), var(--color-tertiary))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          {title}.exe
        </h3>
        
        <p style={{
          marginBottom: 'var(--space-6)',
          color: 'var(--color-text)',
          lineHeight: 'var(--line-height-relaxed)',
          background: 'rgba(0, 0, 0, 0.3)',
          padding: 'var(--space-3)',
          borderRadius: 'var(--radius-button)',
          border: '1px solid var(--color-border)',
          fontFamily: 'var(--font-body)'
        }}>
          {description}
        </p>

        {/* Technologies */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--space-2)',
          marginBottom: 'var(--space-6)'
        }}>
          {technologies.map((tech, index) => (
            <span
              key={index}
              className="caption"
              style={{
                background: `linear-gradient(45deg, ${
                  index % 3 === 0 ? 'var(--color-accent)' : 
                  index % 3 === 1 ? 'var(--color-secondary)' : 'var(--color-tertiary)'
                }, ${
                  index % 3 === 0 ? 'var(--color-tertiary)' : 
                  index % 3 === 1 ? 'var(--color-accent)' : 'var(--color-secondary)'
                })`,
                color: 'var(--color-black)',
                padding: 'var(--space-1) var(--space-3)',
                borderRadius: 'var(--radius-input)',
                border: '1px solid var(--color-border)',
                fontFamily: 'var(--font-retro)',
                fontSize: '10px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)'
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          {projectUrl && (
            <a 
              href={projectUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-primary"
              style={{
                fontSize: 'var(--font-caption)',
                padding: 'var(--space-2) var(--space-4)'
              }}
            >
              🌐 Demo
            </a>
          )}
          {githubUrl && (
            <a 
              href={githubUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{
                fontSize: 'var(--font-caption)',
                padding: 'var(--space-2) var(--space-4)'
              }}
            >
              💾 Code
            </a>
          )}
        </div>
      </div>
    </div>
  );
};