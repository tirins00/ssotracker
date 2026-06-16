import { createContext, useContext, useState, useEffect } from 'react';

const BookmarkContext = createContext();

const BOOKMARK_STORAGE_KEY = 'ssotracker.bookmarks.v1';

export const BookmarkProvider = ({ children }) => {
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem(BOOKMARK_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(bookmarks));
    } catch {
      // Ignore storage failures
    }
  }, [bookmarks]);

  const toggleBookmark = (requestId) => {
    setBookmarks((prev) => {
      if (prev.includes(requestId)) {
        return prev.filter((id) => id !== requestId);
      }
      return [...prev, requestId];
    });
  };

  const isBookmarked = (requestId) => bookmarks.includes(requestId);

  const getBookmarkedRequests = (requests) => {
    return requests.filter((r) => isBookmarked(r?.id));
  };

  return (
    <BookmarkContext.Provider value={{ bookmarks, toggleBookmark, isBookmarked, getBookmarkedRequests }}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
};
