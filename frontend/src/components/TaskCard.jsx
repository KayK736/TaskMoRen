const TaskCard = ({ task, onDelete }) => (
  <div className="p-4 bg-white shadow rounded mb-4">
    <h2 className="text-xl font-bold">{task.title}</h2>
    <p>{task.description}</p>
    <p>Status: {task.status}</p>
    <p>Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
    <button onClick={() => onDelete(task._id)} className="text-red-500">Delete</button>
  </div>
);
export default TaskCard;