// Placeholder AI service — connect to your AI provider here
export const generateTaskSuggestions = async (prompt) => {
  // simulate an API call
  return Promise.resolve([
    { id: 's1', suggestion: `Try splitting the work: ${prompt} — into smaller subtasks.` },
    { id: 's2', suggestion: `Add acceptance criteria for: ${prompt}` }
  ])
}

export default {
  generateTaskSuggestions,
}
