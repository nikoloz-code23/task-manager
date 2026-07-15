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
        class="status-select ${task.completed ? "status-completed" : "status-not-completed"}"
      >
        <option value="completed" class="status-completed" ${task.completed && "selected"}>
          Completed
        </option>
        <option value="not-completed" class="status-not-completed" ${!task.completed && "selected"}>
          Not Completed
        </option>
      </select>
    </div>
  </div>
  `;
