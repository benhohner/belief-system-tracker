import React, { useState, useRef, useEffect } from 'react';
import { Belief as BeliefType } from '../../types';
import { useStore } from '../../state/store';
import './BeliefList.css';

interface BeliefListProps {
  beliefs: BeliefType[];
}

export const BeliefList = () => {
  const updateBelief = useStore((state) => state.updateBelief);
  const deleteBelief = useStore((state) => state.deleteBelief);
  const beliefs = useStore((state) => state.beliefs);
  console.log("belieflist rerendered with", beliefs);

  const [editingBeliefId, setEditingBeliefId] = useState<string | null>(null);
  const [description, setDescription] = useState<string>('');

  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingBeliefId) {
      editInputRef.current?.focus();
    }
  }, [editingBeliefId]);

  const handleEdit = (belief: BeliefType) => {
    setEditingBeliefId(belief.id);
    setDescription(belief.description);
  };

  const handleDelete = async (belief: BeliefType) => {
    await deleteBelief(belief.id);
  };

  const handleSave = async (beliefId: string) => {
    await updateBelief(beliefId, { description });
    setEditingBeliefId(null);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && editingBeliefId) {
      handleSave(editingBeliefId);
    }
  };

  return (
    <ul className="belief-list">
      {beliefs.map((belief: BeliefType) => (
        <li key={belief.id} className="belief-list__item">
          {editingBeliefId === belief.id ? (
            <input
              ref={editInputRef}
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => handleSave(belief.id)}
              onKeyUp={handleKeyUp}
            />
          ) : (
            <span>{belief.description}</span>
          )}
          <div className="belief-list__buttons">
            <button
              className="belief-list__edit-button"
              onClick={() => handleEdit(belief)}
            >
              ✏️
            </button>
            <button
              className="belief-list__delete-button"
              onClick={() => handleDelete(belief)}>🗑️</button>
            </div>
        </li>
      ))}
    </ul>
  );
};