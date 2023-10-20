interface DecisionProps {
  decisions: string[];
}

const DecisionPatternButton: React.FC<DecisionProps> = ({ decisions }) => (
  <div className="mb-4">
    {decisions.map((decision, index) => (
      <button
        key={index}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
      >
        {decision}
      </button>
    ))}
  </div>
);

export default DecisionPatternButton;
