import { createTaskObject, stringIsEmpty } from "./utils.js";
import { taskTemplate } from "./templates.js";

const taskNamePredicate = (taskTitle, compareAgainst) => {
  return taskTitle.toLocaleLowerCase().includes(compareAgainst);
};

const taskStatusPredicate = (taskStatus, compareAgainst) => {
  return taskStatus.toLocaleLowerCase() === compareAgainst;
};

export function renderTasks(tasks, wrapperElement, filterObject) {
  let tasksToRender = tasks;
  wrapperElement.innerHTML = "";

  if (filterObject) {
    const { taskName, taskStatus } = filterObject;
    const hasNameFilter = !stringIsEmpty(taskName);
    const hasStatusFilter = !stringIsEmpty(taskStatus) && taskStatus !== "all";

    if (hasNameFilter || hasStatusFilter) {
      // De morgan's law.
      tasksToRender = tasksToRender.filter((task) => {
        // if hasNameFilter isn't empty (true)
        // hasNameFilter here will be false and activate the predicate.
        const matchesName =
          !hasNameFilter || taskNamePredicate(task.title, taskName);
        const matchesStatus =
          !hasStatusFilter || taskStatusPredicate(task.completed, taskStatus);

        return matchesName && matchesStatus;
      });
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
