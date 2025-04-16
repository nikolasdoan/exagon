const GanttChart = () => {
  return (
    <div className="bg-gray-100 rounded-lg p-4">
      <div className="flex mb-1">
        <div className="text-xs text-gray-600">Start</div>
        <div className="ml-auto text-xs text-gray-600">End</div>
      </div>
      <div className="h-8 flex rounded-lg overflow-hidden mb-2">
        {/* Timeline bars with gradient colors */}
        <div className="w-1/3 bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center text-white text-xs font-medium">
          Modeling
        </div>
        <div className="w-1/3 bg-gradient-to-r from-purple-400 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
          Texturing
        </div>
        <div className="w-1/3 bg-gradient-to-r from-indigo-400 to-indigo-500 flex items-center justify-center text-white text-xs font-medium">
          Animation
        </div>
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <div>Week 1</div>
        <div>Week 4</div>
        <div>Week 8</div>
      </div>
    </div>
  );
};

export default GanttChart;
