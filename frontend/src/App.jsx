import React, { useState, useEffect } from 'react';
import NoteCard from './components/NoteCard';
import NoteForm from './components/NoteForm';
import NoteModal from './components/NoteModal';

const API_BASE = '/api/notes';
export default function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  
  // Modals state
  const [activeModal, setActiveModal] = useState(null); // 'create' | 'edit' | 'view' | null
  const [selectedNote, setSelectedNote] = useState(null);
  
  // Toasts notification state
  const [toasts, setToasts] = useState([]);

  // Toast helper
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Fetch notes with search and tag filters
  const fetchNotes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (selectedTag) params.append('tag', selectedTag);

      const response = await fetch(`${API_BASE}?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to load notes');
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error(error);
      showToast('Error loading notes from database', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch when search query or selected tag changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchNotes();
    }, 300); // 300ms debounce for search query
    
    return () => clearTimeout(delayDebounce);
  }, [searchQuery, selectedTag]);

  // Derive unique tags and counts from all notes
  const [allTags, setAllTags] = useState([]);
  useEffect(() => {
    const fetchAllTags = async () => {
      try {
        const response = await fetch(API_BASE);
        if (response.ok) {
          const allNotes = await response.json();
          const tagCounts = {};
          allNotes.forEach((note) => {
            if (note.tags) {
              note.tags.forEach((tag) => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
              });
            }
          });
          const sortedTags = Object.keys(tagCounts)
            .map((tag) => ({ name: tag, count: tagCounts[tag] }))
            .sort((a, b) => b.count - a.count);
          setAllTags(sortedTags);
        }
      } catch (error) {
        console.error('Error fetching tags list:', error);
      }
    };
    fetchAllTags();
  }, [notes]);

  // Create Note handler
  const handleCreateNote = async (noteData) => {
    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteData),
      });

      if (!response.ok) throw new Error('Failed to create note');
      
      showToast('Note created successfully!');
      setActiveModal(null);
      fetchNotes();
    } catch (error) {
      console.error(error);
      showToast('Error creating note', 'error');
    }
  };

  // Edit Note handler
  const handleEditNote = async (noteData) => {
    if (!selectedNote) return;
    try {
const response = await fetch(`${API_BASE}/${selectedNote.id}`, {      
  method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteData),
      });

      if (!response.ok) throw new Error('Failed to update note');

      showToast('Note updated successfully!');
      setActiveModal(null);
      setSelectedNote(null);
      fetchNotes();
    } catch (error) {
      console.error(error);
      showToast('Error updating note', 'error');
    }
  };

  // Delete Note handler
  const handleDeleteNote = async () => {
    if (!selectedNote) return;
    try {
const response = await fetch(`${API_BASE}/${selectedNote.id}`, {
  method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete note');

      showToast('Note deleted successfully!');
      setActiveModal(null);
      setSelectedNote(null);
      fetchNotes();
    } catch (error) {
      console.error(error);
      showToast('Error deleting note', 'error');
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar navigation */}
      <aside className="sidebar">
        <div className="logo-container">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" fill="none">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <span className="logo-text">AetherNotes</span>
        </div>

        <button 
          className="new-note-btn"
          onClick={() => {
            setSelectedNote(null);
            setActiveModal('create');
          }}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          New Note
        </button>

        <nav className="tags-section">
          <h4 className="tags-section-title">Tags & Categories</h4>
          <ul className="tag-list">
            <li>
              <button 
                className={`tag-item-btn ${selectedTag === '' ? 'active' : ''}`}
                onClick={() => setSelectedTag('')}
              >
                <span>📂 All Notes</span>
              </button>
            </li>
            {allTags.map((tag) => (
              <li key={tag.name}>
                <button
                  className={`tag-item-btn ${selectedTag === tag.name ? 'active' : ''}`}
                  onClick={() => setSelectedTag(tag.name)}
                >
                  <span>🏷️ {tag.name}</span>
                  <span className="tag-count">{tag.count}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main View Area */}
      <main className="main-content">
        <header className="header-bar">
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search notes by title, content, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="search-icon">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </span>
          </div>
        </header>

        {loading ? (
          <div className="loading-spinner-container">
            <div className="spinner"></div>
          </div>
        ) : notes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                <polyline points="13 2 13 9 20 9"></polyline>
              </svg>
            </div>
            <h3 className="empty-title">No Notes Found</h3>
            <p className="empty-desc">
              {searchQuery || selectedTag 
                ? "We couldn't find any notes matching your active filters." 
                : "Get started by creating your very first note!"}
            </p>
            {!searchQuery && !selectedTag && (
              <button 
                className="new-note-btn"
                style={{ marginTop: '0.75rem' }}
                onClick={() => {
                  setSelectedNote(null);
                  setActiveModal('create');
                }}
              >
                Create First Note
              </button>
            )}
          </div>
        ) : (
          <div className="notes-grid">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onClick={() => {
                  setSelectedNote(note);
                  setActiveModal('view');
                }}
              />
            ))}
          </div>
        )}
      </main>

      {/* Render modals based on state */}
      {activeModal === 'create' && (
        <NoteForm
          onSave={handleCreateNote}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'edit' && (
        <NoteForm
          note={selectedNote}
          onSave={handleEditNote}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'view' && selectedNote && (
        <NoteModal
          note={selectedNote}
          onEdit={() => setActiveModal('edit')}
          onDelete={handleDeleteNote}
          onClose={() => {
            setActiveModal(null);
            setSelectedNote(null);
          }}
        />
      )}

      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <span className={`toast-icon ${toast.type}`}>
              {toast.type === 'success' ? (
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>
              ) : (
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              )}
            </span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
