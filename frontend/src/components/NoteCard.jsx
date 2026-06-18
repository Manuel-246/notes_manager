import React from 'react';

export default function NoteCard({ note, onClick }) {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="note-card" onClick={onClick}>
      <h3 className="note-card-title">{note.title}</h3>
      <p className="note-card-content">{note.content}</p>
      <div className="note-card-footer">
        {note.tags && note.tags.length > 0 && (
          <div className="note-card-tags">
            {note.tags.map((tag, idx) => (
              <span key={idx} className="tag-badge">
                #{tag}
              </span>
            ))}
          </div>
        )}
        <span className="note-card-date">
          Updated {formatDate(note.updatedAt)}
        </span>
      </div>
    </div>
  );
}
