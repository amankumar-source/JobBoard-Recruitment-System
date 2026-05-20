import React from 'react';
import { Loader2 } from 'lucide-react';

const Spinner = ({ className = "" }) => {
  return (
    <div className={`min-h-[50vh] flex items-center justify-center ${className}`}>
      <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
    </div>
  );
};

export default Spinner;
