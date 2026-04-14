import { useEffect } from 'react';
import Icon from './Icon';

const Toast = ({ message, onDone }) => {
  useEffect(() => {
    const timer = setTimeout(onDone, 3000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="toast">
      <Icon name="check" size={16} color="#22c55e" />
      {message}
    </div>
  );
};

export default Toast;