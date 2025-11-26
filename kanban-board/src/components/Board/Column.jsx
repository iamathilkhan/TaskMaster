import React from 'react'
import PropTypes from 'prop-types'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import baseStyles from './KanbanBoard.module.css'
import TaskCard from './TaskCard'
import colStyles from './Column.module.css'

export default function Column({ title, tasks, onAddTask, columnId, onEditTask, onDeleteTask }) {
  return (
    <section className={baseStyles.columnCard} aria-label={title}>
      <div className={baseStyles.columnHeader}>
        <div>
          <h2 className={baseStyles.columnTitle}>{title}</h2>
          <span className={baseStyles.count}>{tasks.length}</span>
        </div>

        <button className={baseStyles.addBtn} onClick={() => onAddTask(columnId)} aria-label={`Add task to ${title}`}>
          + Add
        </button>
      </div>

      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`${baseStyles.droppable} ${snapshot.isDraggingOver ? baseStyles.dragOver : ''}`}
          >
            {tasks.length === 0 && (
              <div className={baseStyles.emptyState}>No tasks — add one</div>
            )}

            {tasks.map((task, idx) => (
              <Draggable key={task.id} draggableId={task.id} index={idx}>
                {(dragProvided, dragSnapshot) => (
                  <div style={{ display: 'contents' }}>
                    <div
                      ref={dragProvided.innerRef}
                      {...dragProvided.draggableProps}
                      {...dragProvided.dragHandleProps}
                      style={dragProvided.draggableProps.style}
                    >
                      <TaskCard
                        task={task}
                        index={idx}
                        provided={dragProvided}
                        snapshot={dragSnapshot}
                        onEdit={(updated) => onEditTask?.(updated)}
                        onDelete={(id) => onDeleteTask?.(id)}
                      />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </section>
  )
}

Column.propTypes = {
  title: PropTypes.string.isRequired,
  tasks: PropTypes.array.isRequired,
  onAddTask: PropTypes.func.isRequired,
  columnId: PropTypes.string.isRequired,
  onEditTask: PropTypes.func,
  onDeleteTask: PropTypes.func,
}


