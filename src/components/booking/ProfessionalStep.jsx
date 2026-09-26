import OptionCard from './OptionCard';

const ProfessionalStep = ({ professionals, selectedId, onSelect }) => (
  <div className="grid gap-3 sm:grid-cols-2">
    {professionals.map((professional) => (
      <OptionCard
        key={professional._id}
        selected={professional._id === selectedId}
        onClick={() => onSelect(professional)}
      >
        <p className="font-medium">{professional.name}</p>
      </OptionCard>
    ))}
  </div>
);

export default ProfessionalStep;
