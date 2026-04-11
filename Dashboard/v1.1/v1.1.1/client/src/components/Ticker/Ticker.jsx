import "./Ticker.css"

function NewArrivalsTicker() {
  const models = ["Model 2", "Pegas", "Prius", "Model 2", "Pegas", "Prius"];

  return (
    <div className="ticker-wrapper">
      <div className="ticker-content">
        {/* We repeat the list to ensure the loop looks seamless */}
        {models.map((model, index) => (
          <span key={index} className="ticker-item">
            {model}
          </span>
        ))}
        {/* Duplicate set for infinite loop effect */}
        {models.map((model, index) => (
          <span key={`dup-${index}`} className="ticker-item">
            {model}
          </span>
        ))}
      </div>
    </div>
  );
}

export default NewArrivalsTicker;