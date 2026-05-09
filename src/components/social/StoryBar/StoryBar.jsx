import React from 'react';
import styles from './StoryBar.module.css';

const stories = [
  { id: 1, title: 'Yeni İllər', img: 'https://images.unsplash.com/photo-1543508282-6319a3e2621f?q=80&w=200&auto=format&fit=crop' },
  { id: 2, title: 'Sevgililər', img: 'https://images.unsplash.com/photo-1518196775791-2e1bbd382284?q=80&w=200&auto=format&fit=crop' },
  { id: 3, title: 'Ad Günü', img: 'https://images.unsplash.com/photo-1530103043960-ef38714abb15?q=80&w=200&auto=format&fit=crop' },
  { id: 4, title: 'Toy-Nişan', img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=200&auto=format&fit=crop' },
  { id: 5, title: 'Endirim', img: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=200&auto=format&fit=crop' },
  { id: 6, title: 'Lüks', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200&auto=format&fit=crop' },
  { id: 7, title: 'Sürpriz', img: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=200&auto=format&fit=crop' },
];

const StoryBar = () => {
  return (
    <div className={styles.storyContainer}>
      <div className={styles.storyTrack}>
        {stories.map(story => (
          <div key={story.id} className={styles.storyItem}>
            <div className={styles.imageWrapper}>
              <img src={story.img} alt={story.title} />
            </div>
            <span>{story.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoryBar;
