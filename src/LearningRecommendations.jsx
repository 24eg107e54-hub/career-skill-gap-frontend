
import { useEffect, useState } from "react";

// Learning resources catalogue

const learningResources = {
  java: {
    description:
      "Learn Java fundamentals, object-oriented programming, collections, and exception handling.",
    resource: "https://dev.java/learn/",
    duration: "2–3 weeks"
  },
  "spring boot": {
    description:
      "Learn REST APIs, dependency injection, controllers, services, and Spring Data JPA.",
    resource: "https://spring.io/guides",
    duration: "2–3 weeks"
  },
  mysql: {
    description:
      "Practice SQL queries, joins, database design, and CRUD operations.",
    resource: "https://dev.mysql.com/doc/",
    duration: "1–2 weeks"
  },
  "rest api": {
    description:
      "Learn HTTP methods, status codes, JSON, API testing, and REST principles.",
    resource: "https://developer.mozilla.org/en-US/docs/Web/HTTP",
    duration: "1 week"
  },
  html: {
    description:
      "Learn semantic HTML, forms, tables, links, and page structure.",
    resource:
      "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content",
    duration: "3–5 days"
  },
  css: {
    description:
      "Practice selectors, layouts, Flexbox, Grid, responsive design, and styling.",
    resource:
      "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics",
    duration: "1–2 weeks"
  },
  javascript: {
    description:
      "Learn variables, functions, arrays, objects, promises, and asynchronous programming.",
    resource: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
    duration: "2–3 weeks"
  },
  react: {
    description:
      "Learn components, props, state, hooks, events, and API integration.",
    resource: "https://react.dev/learn",
    duration: "2–3 weeks"
  },
  python: {
    description:
      "Practice Python syntax, functions, collections, file handling, and modules.",
    resource: "https://docs.python.org/3/tutorial/",
    duration: "2–3 weeks"
  },
  sql: {
    description:
      "Learn SELECT queries, filtering, joins, grouping, and aggregate functions.",
    resource: "https://www.w3schools.com/sql/",
    duration: "1–2 weeks"
  },
  excel: {
    description:
      "Practice formulas, sorting, filtering, pivot tables, and data visualization.",
    resource: "https://support.microsoft.com/excel",
    duration: "1–2 weeks"
  },
  "power bi": {
    description:
      "Learn data import, Power Query, data modeling, DAX, and dashboards.",
    resource: "https://learn.microsoft.com/power-bi/",
    duration: "2–3 weeks"
  },
  django: {
    description:
      "Learn Django models, views, URLs, templates, and database integration.",
    resource: "https://docs.djangoproject.com/en/stable/intro/",
    duration: "2 weeks"
  },
  flask: {
    description:
      "Learn Flask routing, templates, request handling, and API development.",
    resource: "https://flask.palletsprojects.com/en/stable/tutorial/",
    duration: "1–2 weeks"
  },
  "machine learning": {
    description:
      "Learn supervised learning, model evaluation, feature engineering, and prediction.",
    resource: "https://scikit-learn.org/stable/getting_started.html",
    duration: "3–4 weeks"
  },
  "deep learning": {
    description:
      "Study neural networks, backpropagation, training, and model evaluation.",
    resource: "https://www.tensorflow.org/learn",
    duration: "3–4 weeks"
  },
  tensorflow: {
    description:
      "Practice building, training, and evaluating machine-learning models.",
    resource: "https://www.tensorflow.org/tutorials",
    duration: "2–3 weeks"
  },
  "data structures": {
    description:
      "Practice arrays, linked lists, stacks, queues, trees, graphs, and algorithms.",
    resource: "https://www.geeksforgeeks.org/data-structures/",
    duration: "3–4 weeks"
  },
  "data analysis": {
    description:
      "Learn data cleaning, exploratory analysis, visualization, and interpretation.",
    resource: "https://pandas.pydata.org/docs/getting_started/",
    duration: "2–3 weeks"
  },
  "c++": {
    description:
      "Learn C++ syntax, functions, object-oriented programming, and STL.",
    resource: "https://www.learncpp.com/",
    duration: "3–4 weeks"
  }
};

function getRecommendation(skill) {
  const key = String(skill || "").trim().toLowerCase();

  return (
    learningResources[key] || {
      description: `Study the fundamentals of ${skill}, follow a beginner tutorial, and build a small practical project.`,
      resource: `https://www.google.com/search?q=${encodeURIComponent(
        `${skill} official documentation beginner tutorial`
      )}`,
      duration: "1–2 weeks"
    }
  );
}

function LearningRecommendations({ missingSkills = [], apiBase = "" }) {
const activeApi =
  apiBase ||
  import.meta.env.VITE_API_URL ||
  "https://career-skill-gap-backend.onrender.com";
  const API_URL = `${activeApi}/api/progress`;

  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(false);
  const [savingSkills, setSavingSkills] = useState({});
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const userId = localStorage.getItem("userId");

  // Accept skill-gap results and keep only skills marked MISSING.
  const skills = [
    ...new Map(
      (Array.isArray(missingSkills) ? missingSkills : [])
        .filter((item) => {
          if (typeof item === "string") {
            return true;
          }

          return (
            item &&
            String(item.status || "").toUpperCase() === "MISSING"
          );
        })
        .map((item) =>
          typeof item === "string" ? item : item.skill
        )
        .filter(Boolean)
        .map((skill) => [
          String(skill).trim().toLowerCase(),
          String(skill).trim()
        ])
    ).values()
  ];

  useEffect(() => {
    let cancelled = false;

    async function loadProgress() {
      if (!userId) {
        setError("Please log in to load and save learning progress.");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${API_URL}?userId=${encodeURIComponent(userId)}`
        );

        if (!response.ok) {
          throw new Error(
            `Unable to load progress. Server status: ${response.status}`
          );
        }

        const records = await response.json();
        const savedProgress = {};

        records.forEach((record) => {
          const key = String(record.skill || "").trim().toLowerCase();

          if (key) {
            savedProgress[key] = record.status || "Not Started";
          }
        });

        if (!cancelled) {
          setProgress(savedProgress);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message || "Unable to connect to the backend."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProgress();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  async function updateProgress(skill, status) {
    if (!userId) {
      setError("Please log in to save your learning progress.");
      return;
    }

    const skillKey = String(skill).trim().toLowerCase();

    setError("");
    setMessage("");

    setSavingSkills((previous) => ({
      ...previous,
      [skillKey]: true
    }));

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: Number(userId),
          skill: String(skill).trim(),
          status,
          progress:
            status === "Completed"
              ? 100
              : status === "In Progress"
                ? 50
                : 0
        })
      });

      if (!response.ok) {
        const details = await response.text();

        throw new Error(
          `Save failed (${response.status}). ${details}`
        );
      }

      const savedRecord = await response.json();

      setProgress((previous) => ({
        ...previous,
        [skillKey]: savedRecord.status || status
      }));

      setMessage(`${skill} progress saved successfully.`);
    } catch (err) {
      setError(
        err.message || "Unable to save progress. Please try again."
      );
    } finally {
      setSavingSkills((previous) => ({
        ...previous,
        [skillKey]: false
      }));
    }
  }

  return (
    <section className="learning-recommendations">
      <h2>Learning Recommendations</h2>

      <p>
        Follow these resources to improve the skills required for
        your target career.
      </p>

      {error && <p role="alert">{error}</p>}
      {message && <p role="status">{message}</p>}

      {loading && <p>Loading your learning progress...</p>}

      {!loading && skills.length === 0 && (
        <p>
          No missing skills are available yet. Run Skill Gap Analysis
          first to get personalized learning recommendations.
        </p>
      )}

      {!loading && skills.length > 0 && (
        <div className="recommendation-list">
          {skills.map((skill, index) => {
            const recommendation = getRecommendation(skill);
            const skillKey = skill.toLowerCase();
            const status = progress[skillKey] || "Not Started";
            const isSaving = Boolean(savingSkills[skillKey]);

            return (
              <article
                className="recommendation-card"
                key={skillKey}
              >
                <h3>
                  {index + 1}. {skill}
                </h3>

                <p>{recommendation.description}</p>

                <p>
                  <strong>Suggested time:</strong>{" "}
                  {recommendation.duration}
                </p>

                <a
                  href={recommendation.resource}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Start Learning
                </a>

                <div className="learning-progress">
                  <label htmlFor={`progress-${index}`}>
                    Learning Status
                  </label>

                  <select
                    id={`progress-${index}`}
                    value={status}
                    disabled={isSaving}
                    onChange={(event) =>
                      updateProgress(skill, event.target.value)
                    }
                  >
                    <option>Not Started</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>

                  {isSaving && <p>Saving progress...</p>}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default LearningRecommendations;
