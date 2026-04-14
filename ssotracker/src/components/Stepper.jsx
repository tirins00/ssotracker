import Icon from './Icon';

const Stepper = ({ steps, currentStep }) => {
  const getStatus = (i) => {
    if (i + 1 < currentStep) return 'done';
    if (i + 1 === currentStep) return 'active';
    return 'inactive';
  };

  return (
    <div className="stepper">
      {steps.map((label, i) => (
        <div
          key={i}
          style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 0 }}
        >
          <div className="step">
            <div className={`step-num ${getStatus(i)}`}>
              {getStatus(i) === 'done'
                ? <Icon name="check" size={13} color="#fff" />
                : i + 1}
            </div>
            <span className={`step-label ${getStatus(i) === 'active' ? 'active' : 'inactive'}`}>
              {label}
            </span>
          </div>
          {i < steps.length - 1 && <div className="step-divider" />}
        </div>
      ))}
    </div>
  );
};

export default Stepper;