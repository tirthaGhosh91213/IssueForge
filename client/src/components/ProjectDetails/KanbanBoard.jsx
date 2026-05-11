import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { motion } from "framer-motion";
import { User, AlertTriangle, Clock, CheckCircle } from "lucide-react";

const COLUMNS = [
  { id: "pending", title: "Pending", icon: <AlertTriangle className="w-5 h-5 text-amber-500" />, color: "bg-amber-50", borderColor: "border-amber-200" },
  { id: "working", title: "In Progress", icon: <Clock className="w-5 h-5 text-blue-500" />, color: "bg-blue-50", borderColor: "border-blue-200" },
  { id: "fixed", title: "Completed", icon: <CheckCircle className="w-5 h-5 text-emerald-500" />, color: "bg-emerald-50", borderColor: "border-emerald-200" },
];

export default function KanbanBoard({ issues, onStatusChange }) {
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return; // Dropped outside
    if (destination.droppableId === source.droppableId && destination.index === source.index) return; // Dropped in same place

    // Notify parent to update backend and local state
    onStatusChange(draggableId, destination.droppableId);
  };

  const getIssuesByStatus = (statusId) => {
    // "working" might be stored as "progress" in legacy DB, map it if necessary
    // Currently, our statuses are mostly 'pending', 'progress', 'fixed'. 
    // We will use 'pending', 'working', 'fixed' as per our columns but map 'progress' to 'working'.
    const mappedStatusId = statusId === 'working' ? 'progress' : statusId;
    
    return issues.filter(issue => {
      const issueStatus = issue.status === 'progress' ? 'working' : issue.status;
      return issueStatus === statusId;
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
        {COLUMNS.map((col) => {
          const colIssues = getIssuesByStatus(col.id);

          return (
            <div key={col.id} className="flex flex-col h-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Column Header */}
              <div className={`px-5 py-4 border-b ${col.borderColor} ${col.color} flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  {col.icon}
                  <h3 className="font-bold text-gray-800">{col.title}</h3>
                </div>
                <span className="bg-white text-gray-600 px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm">
                  {colIssues.length}
                </span>
              </div>

              {/* Droppable Area */}
              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 p-4 min-h-[400px] transition-colors ${snapshot.isDraggingOver ? "bg-gray-50" : "bg-gray-50/30"}`}
                  >
                    {colIssues.map((issue, index) => (
                      <Draggable key={issue._id} draggableId={issue._id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`mb-4 p-5 bg-white rounded-xl border ${snapshot.isDragging ? "border-indigo-400 shadow-xl scale-105" : "border-gray-200 shadow-sm"} transition-all`}
                            style={{ ...provided.draggableProps.style }}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-bold text-gray-900 text-sm line-clamp-2">{issue.title}</h4>
                            </div>
                            
                            {/* Badges */}
                            <div className="flex flex-wrap gap-2 mt-3">
                              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border
                                ${issue.priority === 'high' ? 'bg-red-50 text-red-600 border-red-100' : 
                                  issue.priority === 'medium' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                                  'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                {issue.priority}
                              </span>
                            </div>

                            {/* Assigned Users & Date */}
                            <div className="flex items-center justify-between mt-4 border-t border-gray-100 pt-3">
                              <div className="flex -space-x-2">
                                {issue.assignedTo?.length > 0 ? (
                                  issue.assignedTo.slice(0, 3).map((emp, i) => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center shadow-sm" title={emp.name}>
                                      <span className="text-xs font-bold text-indigo-700">{emp.name?.charAt(0)}</span>
                                    </div>
                                  ))
                                ) : (
                                  <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center border-dashed" title="Unassigned">
                                    <User className="w-4 h-4 text-gray-400" />
                                  </div>
                                )}
                                {issue.assignedTo?.length > 3 && (
                                  <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center shadow-sm">
                                    <span className="text-xs font-bold text-gray-600">+{issue.assignedTo.length - 3}</span>
                                  </div>
                                )}
                              </div>
                              <span className="text-xs text-gray-400 font-medium">
                                {new Date(issue.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
