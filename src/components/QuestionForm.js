import React, { useState, useEffect } from "react";

function QuestionForm({ onAdd }) {
  const [formData, setFormData] = useState({
    prompt: "",
    answer1: "",
    answer2: "",
    answer3: "",
    answer4: "",
    correctIndex: 0,
  });

  // Create a ref to track if the component is mounted
  const isMounted = React.useRef(true);

  // Cleanup function to set the ref to false when unmounted
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const { prompt, correctIndex, ...answers } = formData;
    const answerArray = [answers.answer1, answers.answer2, answers.answer3, answers.answer4];

    const newQuestion = {
      prompt,
      answers: answerArray,
      correctIndex: parseInt(correctIndex, 10),
    };

    const controller = new AbortController();
    const { signal } = controller;

    try {
      const response = await fetch('http://localhost:4000/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newQuestion),
        signal,
      });

      if (response.ok) {
        const savedQuestion = await response.json();
        if (isMounted.current) {
          onAdd(savedQuestion); // Notify parent component about the new question
          setFormData({
            prompt: "",
            answer1: "",
            answer2: "",
            answer3: "",
            answer4: "",
            correctIndex: 0,
          });
        }
      } else {
        console.error('Error adding question:', response.statusText);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error adding question:', error);
      }
    }

    // Abort the request when the component unmounts
    return () => {
      controller.abort();
    };
  }

  return (
    <section>
      <h1>New Question</h1>
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
        <label>
          Prompt:
          <input
            type="text"
            name="prompt"
            value={formData.prompt}
            onChange={handleChange}
          />
        </label>
        <label>
          Answer 1:
          <input
            type="text"
            name="answer1"
            value={formData.answer1}
            onChange={handleChange}
          />
        </label>
        <label>
          Answer 2:
          <input
            type="text"
            name="answer2"
            value={formData.answer2}
            onChange={handleChange}
          />
        </label>
        <label>
          Answer 3:
          <input
            type="text"
            name="answer3"
            value={formData.answer3}
            onChange={handleChange}
          />
        </label>
        <label>
          Answer 4:
          <input
            type="text"
            name="answer4"
            value={formData.answer4}
            onChange={handleChange}
          />
        </label>
        <label>
          Correct Answer:
          <select
            name="correctIndex"
            value={formData.correctIndex}
            onChange={handleChange}
          >
            <option value="0">{formData.answer1}</option>
            <option value="1">{formData.answer2}</option>
            <option value="2">{formData.answer3}</option>
            <option value="3">{formData.answer4}</option>
          </select>
        </label>
        <button type="submit">Add Question</button>
      </form>
    </section>
  );
}

export default QuestionForm;