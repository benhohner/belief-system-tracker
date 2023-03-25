import React from 'react';
import { useStore } from '../../state/store';
import './Header.css';

interface HeaderProps {
  onSignIn: () => void;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSignIn, onSignOut }) => {
  const user = useStore((state) => state.user);

  return (
    <header className="header">
      <h1 className="header__title">BeliefTracker</h1>
      <div className="header__auth">
        {user ? (
          <button className="header__button" onClick={onSignOut}>
            Sign Out
          </button>
        ) : (
          <button className="header__button" onClick={onSignIn}>
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};
