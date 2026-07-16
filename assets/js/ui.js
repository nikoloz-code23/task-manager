import { createTaskObject } from "./utils.js";
import { taskTemplate } from "./templates.js";

export function renderTasks(tasks, wrapperElement, filterObject) {
  let tasksToRender = tasks;
  wrapperElement.innerHTML = "";
  if (filterObject) {
    // The priority should be the name of the task.
    // This is a quick hack, but change if needed.
    if (filterObject.taskName) {
      tasksToRender = tasks.filter(
        (element) => element.title === filterObject.taskName,
      );
    } else if (filterObject.taskStatus) {
      tasksToRender = tasks.filter(
        (element) => element.completed === filterObject.taskStatus,
      );
    } else if (filterObject.taskName && filterObject.taskStatus) {
      tasksToRender = tasks.filter(
        (element) =>
          element.title === filterObject.taskName &&
          element.completed === filterObject.taskStatus,
      );
    }
  }
  for (const element of tasksToRender) {
    const newTask = createTaskObject(
      element.id,
      element.title,
      element.completed,
    );
    wrapperElement.insertAdjacentHTML("beforeend", taskTemplate(newTask));
  }
}
