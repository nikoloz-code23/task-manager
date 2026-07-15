const STATUS = {
  completed: "true",
  notCompleted: "false",
};

export const taskTemplate = (task) =>
  `
  <div class="task" data-id="${task.id}">
    <p class="task-header">Task:</p>
    <h3 class="task-body">
      ${task.title}
    </h3>
    <div class="status-wrapper">
      <p><strong>Status:</strong></p>
      <select
        name="status"
        class="status-select ${task.completed === STATUS.completed ? "status-completed" : "status-not-completed"}"
      >
        <option value="completed" class="status-completed" ${task.completed === STATUS.completed && "selected"}>
          Completed
        </option>
        <option value="not-completed" class="status-not-completed" ${task.completed === STATUS.notCompleted && "selected"}>
          Not Completed
        </option>
      </select>
    </div>
    <button type="button" class="delete-button">X</button>
  </div>
  `;
