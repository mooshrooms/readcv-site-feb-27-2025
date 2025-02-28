"use client";

import React, { useEffect, useState, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { useSwipeable } from 'react-swipeable';
import { marked } from 'marked';
import '@fontsource-variable/inter';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css'; 
import "keen-slider/keen-slider.min.css";
import { CSSTransition } from 'react-transition-group';

import cv from './cv';


function App() {
  const [view, setView] = useState('work');
  const [currentProject, setCurrentProject] = useState(null);
  const [currentProjectName, setCurrentProjectName] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [transitionClass, setTransitionClass] = useState('hidden');

  const projects = [...cv.projects, ...cv.sideProjects].filter(x => x.attachments.length > 0);

  const handleProjectChange = (projectName) => {
    setCurrentProjectName(projectName);
  };

  const handleProjectClick = (project) => {
    setCurrentProject(project); // Store the clicked project
    setCurrentProjectName(project.title); // Update the project name
    setView('project'); // Switch view to the project detail view
  };

  useEffect(() => {
    setTransitionClass('hidden');
    setIsVisible(false);

    const timer = setTimeout(() => {
      setIsVisible(true);
      setTransitionClass('visible');
    }, 600);

    return () => clearTimeout(timer);
  }, [view]);

  return (
    <div>
      {/* Navigation component */}
      <Navigation 
        view={view} 
        setView={setView} 
        currentProjectName={currentProjectName} 
        setCurrentProject={setCurrentProject} // Pass function to reset project
        setCurrentProjectName={setCurrentProjectName} // Pass function to reset project name
      />

      {/* Main content with transition effects */}
      <div className={`content ${transitionClass}`}>
        {view === 'work' && (
          <div className="work-view">
            <div className="horizontal-gallery">
              {/* HorizontalGallery with project change handler */}
              <HorizontalGallery 
                projects={projects} 
                onProjectChange={handleProjectChange} 
                onProjectClick={handleProjectClick} // Pass the click handler here
              />
              <div className="gallery-description">
                <p>
                  "regular is perfect" - @stanu_u
                </p>
              </div>
            </div>
            <div className="project-index">
              {/* ProjectIndex with click handler and setCurrentProjectName */}
              <ProjectIndex 
                onProjectClick={handleProjectClick} 
                setDisplayedProjectName={setCurrentProjectName} // Pass the function to update project name
              />
            </div>
          </div>
        )}

      {view === 'project' && currentProject && (
  <div className="project-view">
    {/* Pass the necessary props to ProjectItem */}
    <ProjectItem 
      project={currentProject} 
      setCurrentProject={setCurrentProject} 
      setCurrentProjectName={setCurrentProjectName} 
      setView={setView} 
    />
  </div>
)}

        {view === 'about' && (
          <div className="about-view">
            <About />
          </div>
        )}
      </div>
    </div>
  );
}

function About() {
  useEffect(() => {
    const sections = document.querySelectorAll('.about-section, .contact-section, .experience-section');

    sections.forEach((section, index) => {
      setTimeout(() => {
        section.style.opacity = 1;
        section.style.transform = 'translateY(0)';
      }, index * 100); // Adjust delay as needed
    });
  }, []);

  return (
    <div>
      {/* About Section */}
      <section
        className="about-section section"
        style={{
          opacity: 0,
          transform: 'translateY(20px)',
          transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out',
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: marked(cv.general.about) }} />
      </section>

     {/* Contact Section */}
<section
  className="contact-section section"
  style={{
    opacity: 0,
    transform: 'translateY(20px)',
    transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out',
  }}
>
  <ul className="contact-list">
    {cv.contact.map((contactItem, index) => (
      <li key={index} className="contact-item">
        {contactItem.platform} — <a href={contactItem.url} target="_blank" rel="noopener noreferrer">{contactItem.handle}</a>
      </li>
    ))}
  </ul>
</section>

     
    </div>
  );
}

// Optional: Include wheel scrolling logic if needed
const WheelControls = (slider) => {
  let touchTimeout;
  let position;
  let wheelActive;

  function dispatch(e, name) {
    position.x -= e.deltaX;
    position.y -= e.deltaY;
    slider.container.dispatchEvent(
      new CustomEvent(name, {
        detail: {
          x: position.x,
          y: position.y,
        },
      })
    );
  }

  function wheelStart(e) {
    position = {
      x: e.pageX,
      y: e.pageY,
    };
    dispatch(e, 'ksDragStart');
  }

  function wheel(e) {
    dispatch(e, 'ksDrag');
  }

  function wheelEnd(e) {
    dispatch(e, 'ksDragEnd');
  }

  function eventWheel(e) {
    // Allow vertical scroll while still enabling horizontal scrolling
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault();
      if (!wheelActive) {
        wheelStart(e);
        wheelActive = true;
      }
      wheel(e);
      clearTimeout(touchTimeout);
      touchTimeout = setTimeout(() => {
        wheelActive = false;
        wheelEnd(e);
      }, 50);
    }
  }

  slider.on('created', () => {
    slider.container.addEventListener('wheel', eventWheel, {
      passive: false,
    });
  });
};

function HorizontalGallery({ projects, onProjectChange, onProjectClick }) {
  const [sliderRef] = useKeenSlider({
    loop: true,
    mode: 'free-snap',
    slides: {
      perView: 2.1,
      spacing: 15,
    },
    breakpoints: {
      '(max-width: 768px)': {
        slides: {
          perView: 1.1,
          spacing: 10,
        },
      },
    },
    slideChanged(s) {
      const currentIndex = s.track.details.rel;
      onProjectChange(projects[Math.round(currentIndex)]?.title || '');
    }
  }, [WheelControls]);

  const handleMouseOver = (projectTitle) => {
    onProjectChange(projectTitle);
  };

  const handleMouseOut = () => {
    onProjectChange('');
  };

  return (
    <div>
      {/* Gallery slider */}
      <div ref={sliderRef} className="keen-slider">
        {projects.map((project, index) => (
          <div
            key={index}
            className="keen-slider__slide"
            onMouseOver={() => handleMouseOver(project.title)}
            onMouseOut={handleMouseOut}
            onClick={() => onProjectClick(project)} // Add this line to handle clicks
          >
            {project.attachments.length > 0 && (
              project.attachments[0].type === 'image' ? (
                <img
                  src={project.attachments[0].url}
                  alt={`${project.title} image`}
                  style={{ 
                    width: 'auto', 
                    height: '100vh', 
                    maxWidth: '1000px',  
                    objectFit: 'cover'  
                  }}
                />
              ) : (
                <video
                  src={project.attachments[0].url}
                  autoPlay
                  muted
                  playsInline
                  style={{ 
                    width: 'auto', 
                    height: '100vh', 
                    maxWidth: '1000px',  
                    objectFit: 'cover'  
                  }}
                >
                  <source src={project.attachments[0].url} type="video/mp4" />
                </video>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Navigation({ view, setView, currentProjectName, setCurrentProject, setCurrentProjectName }) {
  const [displayedProjectName, setDisplayedProjectName] = useState(currentProjectName);
  const [fadeClass, setFadeClass] = useState('fade-in');
  const [showProjectName, setShowProjectName] = useState(true);
  const [profileStatus, setProfileStatus] = useState({ text: 'Loading...', emoji: '' });

  useEffect(() => {
    if (currentProjectName !== displayedProjectName) {
      setFadeClass('fade-out');

      const timeout = setTimeout(() => {
        setDisplayedProjectName(currentProjectName);
        setFadeClass('fade-in');
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [currentProjectName, displayedProjectName]);

  // Update the profile status from cv.general.status
  useEffect(() => {
    if (cv.general.status) {
      setProfileStatus(cv.general.status);
    } else {
      setProfileStatus({ text: 'No status available', emoji: '' });
    }
  }, []); // Only run once on mount

  const handleHomeClick = () => {
    window.location.href = '/'; // Navigate to home
  };

  const handleWorkClick = () => {
    setView('work'); // Set view to work
    setCurrentProject(null); // Reset current project
    setCurrentProjectName(''); // Reset project name
  };

  return (
    <div className="navigation-bar">
      <div className="title-project">
        {view !== 'project' && (
          <button onClick={handleHomeClick} className={view === 'home' ? 'active' : ''}>
            {cv.general.displayName}
          </button>
        )}

        {view === 'project' && (
          <>
            {showProjectName ? (
              <div className="project-name" onMouseEnter={() => setShowProjectName(false)} onMouseLeave={() => setShowProjectName(true)}>
                {displayedProjectName}
              </div>
            ) : (
              <button className="title-project-button" onMouseEnter={() => setShowProjectName(false)} onMouseLeave={() => setShowProjectName(true)} onClick={handleHomeClick}>
                {cv.general.displayName}
              </button>
            )}
          </>
        )}

        {view === 'about' && (
          <span className={`profile-status`}>
            
            {profileStatus.emoji && <span className="profile-status-emoji">{profileStatus.emoji}</span>}
            <span className="profile-status-text">{profileStatus.text}</span>
          </span>
        )}

        {view === 'work' && (
          <span className={`current-project ${fadeClass}`}>
            {displayedProjectName}
          </span>
        )}
      </div>

      <ul className="nav-links">
        <li>
          <button onClick={handleWorkClick} className={view === 'work' ? 'active' : ''}>
            Work
          </button>
          <span>, </span>
        </li>
       
        <li>
          <button onClick={() => setView('about')} className={view === 'about' ? 'active' : ''}>
            About
          </button>
        </li>
      </ul>
    </div>
  );
}


function ProjectIndex({ onProjectClick }) {
  const [sortMethod, setSortMethod] = useState('most-recent');
  const [hoveredProject, setHoveredProject] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const projects = [...cv.projects, ...cv.sideProjects];

  const sortedProjects = projects.sort((a, b) => {
    if (sortMethod === 'most-recent') {
      return new Date(b.date) - new Date(a.date);
    } else if (sortMethod === 'a-z') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    const projectItems = document.querySelectorAll('.project-item');

    projectItems.forEach((item) => {
      item.addEventListener('mousemove', handleMouseMove);
    });

    return () => {
      projectItems.forEach((item) => {
        item.removeEventListener('mousemove', handleMouseMove);
      });
    };
  }, []);

  return (
    <div>
      <div className="sort-buttons">
        <button
          className={sortMethod === 'most-recent' ? 'active' : ''}
          onClick={() => setSortMethod('most-recent')}
        >
          Most Recent
        </button>
        <span>, </span>
        <button
          className={sortMethod === 'a-z' ? 'active' : ''}
          onClick={() => setSortMethod('a-z')}
        >
          A — Z
        </button>
      </div>

      <ul className="project-list">
        {sortedProjects.length === 0 ? (
          <p>No projects available.</p>
        ) : (
          sortedProjects.map((project, index) => (
            <li
              key={index}
              className="project-item"
              onMouseEnter={() => setHoveredProject(project)}
              onMouseLeave={() => setHoveredProject(null)}
              onClick={() => onProjectClick(project)} // Use onProjectClick
            >
              <h3>{project.title}</h3>
              <span
                className="view-link"
                style={{ opacity: hoveredProject === project ? 0.5 : 1, transition: 'opacity 0.2s' }}
              >
                View
              </span>
            </li>
          ))
        )}
      </ul>

      {hoveredProject && hoveredProject.attachments && hoveredProject.attachments.length > 0 && (
        <div
          className="hover-preview"
          style={{
            position: 'fixed',
            top: mousePosition.y + 800 + 'px',
            left: mousePosition.x + 0 + 'px',
            pointerEvents: 'none',
            zIndex: 1000,
          }}
        >
          {hoveredProject.attachments[0].type === 'image' ? (
            <img
              src={hoveredProject.attachments[0].url}
              alt={hoveredProject.title}
              style={{ maxWidth: '500px', maxHeight: '450px' }}
            />
          ) : (
            <video
              src={hoveredProject.attachments[0].url}
              autoPlay
              loop
              muted
              style={{ maxWidth: '500px', maxHeight: '450px' }}
            />
          )}
        </div>
      )}
    </div>
  );
}

function ProjectItem({ project, setCurrentProject, setCurrentProjectName, setView }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const galleryRef = useRef(null);

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
    const scrollPosition = (galleryRef.current.scrollWidth / project.attachments.length) * index;
    galleryRef.current.scrollTo({ left: scrollPosition, behavior: 'smooth' });
  };

  const handleScroll = () => {
    const galleryWidth = galleryRef.current.scrollWidth;
    const scrollLeft = galleryRef.current.scrollLeft;
    const index = Math.floor((scrollLeft / galleryWidth) * project.attachments.length);
    setCurrentIndex(index);
  };

  useEffect(() => {
    const gallery = galleryRef.current;
    gallery.addEventListener('scroll', handleScroll);
    return () => gallery.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="project-item-container">
      <div className="main-media-display" ref={galleryRef} style={{ overflowX: 'auto', whiteSpace: 'nowrap', marginTop: '20px' }}>
        <div className="side-by-side-media" style={{ display: 'flex' }}>
          {project.attachments.map((attachment, index) => (
            <div key={index} className="media-item" style={{
              flexShrink: 0,
              width: 'calc(50% - 5px)',
              marginRight: index % 2 === 0 ? '5px' : '0',
              maxHeight: '1000px',
              overflow: 'hidden',
            }}>
              {attachment.type === 'video' ? (
                <video src={attachment.url} controls className="media-content" style={{ height: '100%', width: '100%', objectFit: 'cover' }} />
              ) : (
                <img src={attachment.url} alt={`Media ${index + 1}`} className="media-content" style={{ height: '100%', width: '100%', objectFit: 'cover' }} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="thumbnail-container" style={{ marginTop: '20px' }}>
        <div className="thumbnail-wrapper">
          {project.attachments.map((attachment, index) => (
            <div key={index} className={`thumbnail ${currentIndex === index ? 'active' : ''}`} onClick={() => handleThumbnailClick(index)}>
              <img src={attachment.url} alt={`Thumbnail ${index + 1}`} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      </div>

      <div className="title-description-container">
        <div className="details-left">
          {/* Back to Gallery Button */}
          <button className="back-to-gallery-button" onClick={() => {
            setCurrentProject(null);
            setCurrentProjectName('');
            setView('work');
          }}>
            Back to Gallery
          </button>
          <div className="description-right">
            <p className="project-description">{project.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;