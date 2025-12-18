
import React from 'react';
import { useSound } from '../../contexts/SoundContext';

interface ControlButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  secondary?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  onMouseDown?: () => void;
  onMouseUp?: () => void;
  onMouseLeave?: () => void;
  className?: string;
}

const ControlButton: React.FC<ControlButtonProps> = ({ onClick, children, secondary = false, disabled = false, fullWidth = false, onMouseDown, onMouseUp, onMouseLeave, className }) => {
  const { playHover, playClick } = useSound();

  const handleClick = () => {
      if (!disabled) {
          playClick();
          onClick?.();
      }
  };

  const handleMouseEnter = () => {
      if (!disabled) {
          playHover();
      }
  };

  const handleMouseDown = () => {
      if (!disabled) {
          onMouseDown?.();
      }
  }

  const baseClasses = `px-5 py-2.5 rounded-full font-bold text-sm tracking-wide transition-all duration-200 active:scale-95 disabled:active:scale-100 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-[var(--gold)] ${fullWidth ? 'w-full' : ''}`;
  
  const primaryClasses = "bg-white text-black hover:bg-[var(--gold)] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] border border-transparent";
  
  const secondaryClasses = "bg-white/5 border border-white/10 text-white/90 hover:bg-white/10 hover:border-white/30 hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] backdrop-blur-sm";
  
  const disabledClasses = "opacity-40 cursor-not-allowed shadow-none grayscale";
  
  const finalClasses = [
    baseClasses,
    secondary ? secondaryClasses : primaryClasses,
    disabled ? disabledClasses : '',
    className
  ].join(' ');
  
  return (
    <button 
        onClick={handleClick} 
        onMouseEnter={handleMouseEnter}
        onMouseDown={handleMouseDown} 
        onMouseUp={onMouseUp} 
        onMouseLeave={onMouseLeave} 
        disabled={disabled} 
        className={finalClasses}
    >
      {children}
    </button>
  );
};

export default ControlButton;
