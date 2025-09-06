export interface FloatingElementProps {
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
}

export function FloatingElement({ className = '', style, delay = 0 }: FloatingElementProps) {
  const baseClasses = "absolute rounded-full opacity-30 floating";
  const animationStyle = {
    ...style,
    animationDelay: `${delay}s`,
  };

  return (
    <div 
      className={`${baseClasses} ${className}`}
      style={animationStyle}
    />
  );
}