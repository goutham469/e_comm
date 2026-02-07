function SectionIndicatorCard({ text })
{
  return (
    <div className="w-full px-6 py-4 flex items-center bg-stone-200">
      <p className="text-sm md:text-base font-medium text-blue-900">
        {text}
      </p>
    </div>
  );
}

export default SectionIndicatorCard;