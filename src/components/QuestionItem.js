import React from "react";

function QuestionItem({ question, onDelete, onUpdate }) {
  const { id, prompt, answers, correctIndex } = question;

  const options = answers.map((answer, index) => (
    <option key={index} value={index}>
      {answer}
    </option>
  ));

  const handleDelete = () => {
    fetch(`http://localhost:4000/questions/${id}`, { method: 'DELETE' })
      .then(response => {
        if (response.ok) {
          onDelete(id); // Notify parent component to remove the deleted question
        } else {
          console.error('Error deleting question:', response.statusText);
        }
      })
      .catch(error => console.error('Error deleting question:', error));
  };

  const handleCorrectIndexChange = (event) => {
    const newCorrectIndex = parseInt(event.target.value, 10);
    onUpdate(id, newCorrectIndex); // Call the onUpdate function with the new correct index
  };

  return (
    <li>
      <h4>Question {id}</h4>
      <h5>Prompt: {prompt}</h5>
      <label>
        Correct Answer:
        <select
          value={correctIndex}
          onChange={handleCorrectIndexChange}
        >
          {options}
        </select>
      </label>
      <button onClick={handleDelete}>Delete Question</button>
    </li>
  );
}

export default QuestionItem;