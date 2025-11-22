import React, { useState, useEffect, useRef } from 'react';
import './Skills.css';
import { 
  FaReact, 
  FaJs, 
  FaNodeJs, 
  FaPython, 
  FaGitAlt, 
  FaDocker 
} from 'react-icons/fa';
import { 
  SiTypescript, 
  SiMysql, 
  SiMongodb 
} from 'react-icons/si';

export const Skills: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const skillCategories = [
    {
      title: "Frontend Development",
      skills: [
        { name: "React", icon: <FaReact /> },
        { name: "TypeScript", icon: <SiTypescript /> },
        { name: "JavaScript", icon: <FaJs /> }
      ]
    },
    {
      title: "Backend Development",
      skills: [
        { name: "Node.js", icon: <FaNodeJs /> },
        { name: "Python", icon: <FaPython /> },
        { name: "MySQL", icon: <SiMysql /> },
        { name: "MongoDB", icon: <SiMongodb /> },
      ]
    },
    {
      title: "Design & Tools",
      skills: [
        { name: "Git", icon: <FaGitAlt /> },
        { name: "Docker", icon: <FaDocker /> }
      ]
    }
  ];

  // Auto-advance carousel
  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % skillCategories.length;
          return nextIndex;
        });
      }, 3000); // Change every 3 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlaying, skillCategories.length]);

  const handleManualNavigation = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false); // Stop auto-play when user interacts
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleCarouselInteraction = () => {
    setIsAutoPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + skillCategories.length) % skillCategories.length);
    handleCarouselInteraction();
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % skillCategories.length);
    handleCarouselInteraction();
  };

  // Swipe handling
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      // Swipe left - go to next slide
      setCurrentIndex((prevIndex) => (prevIndex + 1) % skillCategories.length);
      handleCarouselInteraction();
    } else if (isRightSwipe) {
      // Swipe right - go to previous slide
      setCurrentIndex((prevIndex) => (prevIndex - 1 + skillCategories.length) % skillCategories.length);
      handleCarouselInteraction();
    }
  };

  return (
    <section className="skills-section">
      <div className="skills-container">
        <div className="skills-header">
          <div className="skills-caption">
            EXPERTISE
          </div>
          <h2 className="skills-title">
            Skills & Technologies
          </h2>
          <p className="skills-description">
            I work with modern technologies and tools to build scalable, performant applications ♡
          </p>
        </div>

        <div className="skills-carousel" onMouseEnter={handleCarouselInteraction}>
          <button className="carousel-nav-btn carousel-prev" onClick={handlePrevious} aria-label="Previous slide">
            &#8249;
          </button>
          
          <div 
            ref={carouselRef}
            className="carousel-container"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div 
              className="carousel-track"
              style={{
                transform: `translateX(-${currentIndex * 33.333}%)`,
                transition: 'transform 0.5s ease-in-out'
              }}
            >
              {skillCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="carousel-slide">
                  <div className="skill-category">
                    <h3 className="category-title">
                      {category.title}
                    </h3>
                    
                    <div className="skills-list">
                      {category.skills.map((skill, skillIndex) => (
                        <div key={skillIndex} className="skill-item">
                          <span className="skill-icon">
                            {skill.icon}
                          </span>
                          <span className="skill-name">
                            {skill.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button className="carousel-nav-btn carousel-next" onClick={handleNext} aria-label="Next slide">
            &#8250;
          </button>
          
          {/* Carousel indicators */}
          <div className="carousel-indicators">
            {skillCategories.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentIndex ? 'active' : ''}`}
                onClick={() => handleManualNavigation(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};