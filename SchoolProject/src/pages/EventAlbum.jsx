import React, { useState, useEffect, useMemo } from 'react';
import './EventAlbum.css';

// Predefined rotations for polaroid effect
const rotations = ['rotate-2', 'rotate-1', '-rotate-1', '-rotate-2', 'rotate-0'];

// Calculate styles for images dynamically based on container size
const getDynamicStyle = (index, totalImages, containerWidth) => {
  const baseSize = Math.min(containerWidth * (totalImages > 3 ? 0.25 : 0.35), 200); // Smaller size for more images
  let position;

  if (totalImages === 3) {
    if (index === 0) {
      position = { top: '70%', left: '50%' }; // Bottom center
    } else if (index === 1) {
      position = { top: '30%', left: '40%' }; // Top left
    } else {
      position = { top: '30%', left: '60%' }; // Top right
    }
  } else if (totalImages === 5) {
    // Position five images in a tight cluster with 5% overlap
    const spread = 15; // Reduced spread for tighter clustering
    const verticalSpread = 10; // Reduced vertical spread
    const overlap = 5; // 5% overlap
    const baseLeft = 50 + (index - 2) * (spread - overlap); // Center and adjust for overlap
    const baseTop = 50 + (index % 2 === 0 ? -verticalSpread : verticalSpread); // Alternate vertically
    position = { top: `${baseTop}%`, left: `${baseLeft}%` };
  } else {
    const spread = Math.min(60 / totalImages, 20);
    const baseLeft = Math.min(index * spread + 15, 85 - spread);
    const baseTop = 50 + (index % 2 === 0 ? -20 : 20) - Math.floor(index / 2) * 15;
    position = { top: `${baseTop}%`, left: `${baseLeft}%` };
  }

  return {
    rotation: rotations[index % rotations.length],
    position: {
      ...position,
      transform: 'translate(-50%, -50%)',
    },
    size: {
      width: `${baseSize}px`,
      height: `${baseSize * 0.7}px`,
    },
    zIndex: totalImages - index, // Higher zIndex for later images
  };
};

// Persistent storage for styles and text positions
const persistentStyles = new Map();
const persistentTextPositions = new Map();

// Initialize default styles
const initializeDefaultStyles = (defaultEvents) => {
  const initialStyles = {};
  const initialTextPositions = {};
  defaultEvents.forEach((event, index) => {
    if (!persistentStyles.has(event.id)) {
      const styles = event.images.map((_, i) =>
        getDynamicStyle(i, event.images.length, 900)
      );
      persistentStyles.set(event.id, styles);
      persistentTextPositions.set(event.id, index % 2 === 1);
    }
    initialStyles[event.id] = persistentStyles.get(event.id);
    initialTextPositions[event.id] = persistentTextPositions.get(event.id);
  });
  return { initialStyles, initialTextPositions };
};

const EventAlbum = ({ events }) => {
  const defaultEvents = [
    {
      id: 1,
      title: 'Summer Beach Party',
      images: [
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300',
        'https://images.unsplash.com/photo-1509233725247-49e657c54213?w=300',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300',
        'https://images.unsplash.com/photo-1509233725247-49e657c54213?w=300',
      ],
      description: 'A vibrant beach party with music and dancing under the sun.',
      date: '2025-06-15',
    },
    {
      id: 2,
      title: 'Sunset Wedding',
      images: [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300',
        'https://images.unsplash.com/photo-1519741497674-611481863552?w=300',
      ],
      description: 'A romantic wedding ceremony at sunset by the ocean.',
      date: '2025-07-20',
    },
    {
      id: 3,
      title: 'Tropical Festival',
      images: [
        'https://images.unsplash.com/photo-1508739773434-c26b3d09e206?w=300',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300',
        'https://images.unsplash.com/photo-1497436072909-60f69c25e1d7?w=300',
      ],
      description: 'Celebrating tropical vibes with food, music, and fun.',
      date: '2025-08-10',
    },
  ];

  const { initialStyles, initialTextPositions } = useMemo(
    () => initializeDefaultStyles(defaultEvents),
    []
  );
  const [eventStyles, setEventStyles] = useState(initialStyles);
  const [textPositions, setTextPositions] = useState(initialTextPositions);

  // Update styles when events change or on mount
  useEffect(() => {
    const newStyles = { ...eventStyles };
    const newTextPositions = { ...textPositions };
    const containerWidth = window.innerWidth > 768 ? 900 : window.innerWidth * 0.9;

    (events || defaultEvents).forEach((event, index) => {
      if (!persistentStyles.has(event.id)) {
        const styles = event.images.map((_, i) =>
          getDynamicStyle(i, event.images.length, containerWidth)
        );
        persistentStyles.set(event.id, styles);
        persistentTextPositions.set(event.id, index % 2 === 1);
      }
      newStyles[event.id] = persistentStyles.get(event.id);
      newTextPositions[event.id] = persistentTextPositions.get(event.id);
    });

    setEventStyles(newStyles);
    setTextPositions(newTextPositions);
  }, [events]);

  const displayEvents = events || defaultEvents;

  return (
    <div className="p-4 sm:p-8 md:p-12 bg-gradient-to-br from-rose-50 via-ivory-50 to-sky-50 min-h-screen">
      <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-12 md:mb-24 text-center text-indigo-900 font-[cursive] drop-shadow-xl">
        Cherished Moments
      </h2>
      {displayEvents.map((event, eventIndex) => {
        const textOnRight = textPositions[event.id] ?? (eventIndex % 2 === 1);
        const styles = eventStyles[event.id] || [];

        return (
          <div
            key={event.id}
            className="mb-12 md:mb-28 flex flex-col lg:flex-row items-center justify-center gap-4 md:gap-8 animate-fade-in"
          >
            <div
              className={`w-full lg:w-2/5 p-4 sm:p-8 md:p-12 flex flex-col justify-center ${
                textOnRight ? 'order-2' : 'order-1'
              }`}
            >
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-4 md:mb-6 text-indigo-800 font-[cursive] drop-shadow-md">
                {event.title}
              </h3>
              <p className="text-gray-800 mb-4 md:mb-6 italic text-lg sm:text-xl md:text-2xl leading-relaxed">
                {event.description}
              </p>
              <p className="text-sm sm:text-base text-gray-700">
                {event.date} | Location: Beach Name, 52th Street City 123 AFS 789
              </p>
            </div>
            <div
              className={`w-full lg:w-3/5 p-4 sm:p-8 md:p-12 flex justify-center ${
                textOnRight ? 'order-1' : 'order-2'
              }`}
            >
              <div className="relative w-full max-w-[90vw] sm:max-w-[700px] md:max-w-[900px] aspect-[4/3] rounded-2xl p-4 sm:p-6 overflow-visible album-container">
                {event.images.map((image, index) => {
                  const style = styles[index] || {
                    rotation: 'rotate-0',
                    position: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
                    size: { width: '200px', height: '140px' },
                    zIndex: 0,
                  };

                  return (
                    <div
                      key={`${event.id}-${index}`}
                      className={`absolute polaroid ${style.rotation}`}
                      style={{
                        top: style.position.top,
                        left: style.position.left,
                        transform: style.position.transform,
                        width: style.size.width,
                        height: style.size.height,
                        zIndex: style.zIndex,
                      }}
                    >
                      <img
                        src={image}
                        alt={`${event.title} photo ${index + 1}`}
                        loading="lazy"
                        className="w-full h-full object-cover rounded"
                        aria-label={`${event.title} image ${index + 1}`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EventAlbum;