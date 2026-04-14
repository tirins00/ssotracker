import Icon from './Icon';

const StatCard = ({ className, iconName, iconColor, count, label }) => {
  return (
    <div className={`stat-card ${className}`}>
      <div className="stat-icon">
        <Icon name={iconName} size={16} color={iconColor} />
      </div>
      <div className="stat-num">{count}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
};

export default StatCard;