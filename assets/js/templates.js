export const taskTemplate = (task) =>
  `
  <div class="task" id="${task.id}">
    <p class="task-header">Task:</p>
    <h3 class="task-body">
      ${task.title}
    </h3>
    <div class="status-wrapper">
      <p><strong>Status:</strong></p>
      <select
        name="status"
        id="status"
        class="status-select ${task.completed ? "status-completed" : "status-not-completed"}"
      >
        <option value="completed" class="status-completed">
          Completed
        </option>
        <option value="not-completed" class="status-not-completed">
          Not Completed
        </option>
      </select>
    </div>
  </div>
  `;
