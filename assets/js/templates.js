/* Even though the data coming from the API is of a boolean value,
I decided to turn them into strings, just in case if the API makes any changes
with new additional taskStatus, or if I myself will want to extend the program
further with other task statuses, like "In Progress" or stuff.
Right now, I am keeping completed and notCompleted as string representations of
"true" and "false" just for the sake of accomodating the API.
*/
export const TASK_STATUS = {
  completed: "true",
  notCompleted: "false",
};

export const taskTemplate = (task) =>
  `
  <div class="task" data-id="${task.id}">
    <p class="task-header">Task:</p>
    <p class="task-body">
      ${task.title}
    </p>
    <p class="task-header">Created on:</p>
    <p class="task-time">
      ${task.timestamp}
    </p>
    <div class="status-wrapper">
      <label for="status-${task.id}"><strong>Status:</strong></label>
      <select
        name="status"
        class="status-select ${task.completed === TASK_STATUS.completed ? "status-completed" : "status-not-completed"}"
        id="status-${task.id}"
      >
        <option value="true" class="status-completed" ${task.completed === TASK_STATUS.completed ? "selected" : ""}>
          Completed
        </option>
        <option value="false" class="status-not-completed" ${task.completed === TASK_STATUS.notCompleted ? "selected" : ""}>
          Not Completed
        </option>
      </select>
    </div>
    <button type="button" class="delete-button">X</button>
  </div>
  `;
