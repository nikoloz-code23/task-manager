const validateTaskName = (taskName) => {
  const namePattern = /^.{1,50}$/;
  return namePattern.test(taskName.trim());
};

export { validateTaskName };
