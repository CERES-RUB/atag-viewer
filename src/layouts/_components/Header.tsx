import { ChevronLeft } from 'lucide-react';

import './Header.css';

export const Header = () => {

  return (
    <header>
      <div className="header-left">
        <a href="../..">
          <ChevronLeft />
          <span>Home</span>
        </a>

        <a href="../../about">About</a>
      </div>
    </header>
  )

}