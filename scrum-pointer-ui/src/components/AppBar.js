'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const Appbar = () => {
  const router = useRouter();

  return (
    <nav className="bg-primary text-text py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-6">
        <a 
          href="#" onClick={(e) => {
            e.preventDefault();
            router.push('/');
          }} 
          className="text-2xl font-bold hover:text-accent transition-all">Agile Pointer</a>
        {/* <ul className="flex space-x-6">
          <li><a href="#" className="text-lg hover:text-accent transition-all">Home</a></li>
          <li><a href="#" className="text-lg hover:text-accent transition-all">Features</a></li>
          <li><a href="#" className="text-lg hover:text-accent transition-all">Pricing</a></li>
          <li><a href="#" className="text-lg hover:text-accent transition-all">Contact</a></li>
        </ul> */}
        {/* <button className="bg-accent text-primary font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-all">
          Sign Up
        </button> */}
      </div>
    </nav>
  );
};

export default Appbar;
