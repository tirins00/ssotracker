const DocumentCard = ({ doc, selected, onSelect }) => {
  return (
    <div
      className={`doc-card ${selected ? 'selected' : ''}`}
      onClick={() => onSelect(doc)}
    >
      <h4>{doc.title}</h4>
      <p>{doc.desc}</p>
      <span className="doc-badge">{doc.days}</span>
    </div>
  );
};

export default DocumentCard;