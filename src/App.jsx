

import { useState, useEffect } from "react";

import LearningRecommendations from "./LearningRecommendations";

import "./App.css";



const API = "http://localhost:8080";



function App() {

  // Theme

  const [theme, setTheme] = useState(

    () => localStorage.getItem("theme") || "light"

  );



  // Navigation and authentication

  const [page, setPage] = useState("home");

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");



  // Education

  const [degree, setDegree] = useState("");

  const [college, setCollege] = useState("");

  const [specialization, setSpecialization] = useState("");

  const [graduationYear, setGraduationYear] = useState("");

  const [educationMessage, setEducationMessage] = useState("");

  const [educationRecords, setEducationRecords] = useState([]);

  const [educationLoading, setEducationLoading] = useState(false);



  // Technical skills

  const [skill, setSkill] = useState("");

  const [skillMessage, setSkillMessage] = useState("");

  const [savedSkills, setSavedSkills] = useState([]);
  const [skillsLoading, setSkillsLoading] = useState(false);



  // Skill gap analysis

  const [skillGaps, setSkillGaps] = useState([]);



  // Learning progress

  const [progressData, setProgressData] = useState([]);

  const [progressMessage, setProgressMessage] = useState("");



  // Target career

  const [careerName, setCareerName] = useState(

    () => localStorage.getItem("targetCareer") || ""

  );

  const [careerMessage, setCareerMessage] = useState("");

  const [availableCareers, setAvailableCareers] = useState([]);

  const [careerSearch, setCareerSearch] = useState("");



  // Projects
const [projectName, setProjectName] = useState("");
const [projectDescription, setProjectDescription] = useState("");
const [technologies, setTechnologies] = useState("");
const [projectMessage, setProjectMessage] = useState("");
const [savedProjects, setSavedProjects] = useState([]);
const [selectedProject, setSelectedProject] = useState(null);



  // Certifications

  const [certificationName, setCertificationName] = useState("");

  const [issuingOrganization, setIssuingOrganization] = useState("");

  const [issueYear, setIssueYear] = useState("");

  const [certificationMessage, setCertificationMessage] = useState("");

  const [certifications, setCertifications] = useState([]);

  const [certificationsLoading, setCertificationsLoading] = useState(false);


  // Move to the next field when Enter is pressed

// Move to the next input when Enter is pressed
const handleEnterToNext = (event) => {
  if (event.key !== "Enter") return;

  event.preventDefault();

  const currentInput = event.currentTarget;
  const container = currentInput.closest(".login-box");

  if (!container) return;

  const fields = Array.from(
    container.querySelectorAll(
      'input:not([disabled]), select:not([disabled]), textarea:not([disabled])'
    )
  );

  const currentIndex = fields.indexOf(currentInput);

  if (currentIndex >= 0 && currentIndex < fields.length - 1) {
    fields[currentIndex + 1].focus();
    return;
  }

  // Submit only when Enter is pressed on the last login/register field
  if (page === "login") {
    login();
  } else if (page === "register") {
    register();
  }
};




  // Apply theme

  useEffect(() => {

    document.documentElement.setAttribute("data-theme", theme);

    document.body.setAttribute("data-theme", theme);

    localStorage.setItem("theme", theme);

  }, [theme]);



  const toggleTheme = () => {

    setTheme((current) =>

      current === "light" ? "dark" : "light"

    );

  };



  const userId = () => localStorage.getItem("userId");



  const goToDashboard = () => {

    setMessage("");

    setPage("dashboard");

  };



  // Register

  const register = async () => {

    if (!name.trim() || !email.trim() || !password) {

      setMessage("Please fill all fields.");

      return;

    }



    try {

      const res = await fetch(`${API}/api/auth/register`, {

        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({

          name: name.trim(),

          email: email.trim(),

          password,

        }),

      });



      const data = await res.text();



      if (res.ok) {

        setMessage("Registration successful! You can now log in.");

        setName("");

        setPassword("");

        setPage("login");

      } else {

        setMessage(data || "Registration failed.");

      }

    } catch {

      setMessage("Unable to connect to the backend.");

    }

  };



  // Login

  const login = async () => {

    if (!email.trim() || !password) {

      setMessage("Please enter your email and password.");

      return;

    }



    try {

      const res = await fetch(`${API}/api/auth/login`, {

        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({

          email: email.trim(),

          password,

        }),

      });



      const data = await res.json();



      if (res.ok) {

        if (data.id == null) {

          setMessage("Login succeeded, but the user ID was not returned.");

          return;

        }



        localStorage.setItem("userId", String(data.id));

        setCareerName(localStorage.getItem("targetCareer") || "");

        setMessage("");

        setPassword("");

        setPage("dashboard");

      } else {

        setMessage(

          typeof data === "string"

            ? data

            : data.message || "Invalid email or password."

        );

      }

    } catch {

      setMessage("Unable to connect to the backend.");

    }

  };



  // Load education

  const loadEducation = async () => {

    const id = userId();



    if (!id) {

      setEducationRecords([]);

      setEducationMessage("Please log in first.");

      return;

    }



    setEducationLoading(true);



    try {

      const res = await fetch(

        `${API}/api/education?userId=${encodeURIComponent(id)}`

      );



      if (!res.ok) {

        throw new Error("Unable to load education records.");

      }



      const records = await res.json();



      setEducationRecords(Array.isArray(records) ? records : []);

      setEducationMessage("");

    } catch (error) {

      setEducationMessage(

        error.message || "Unable to connect to the backend."

      );

    } finally {

      setEducationLoading(false);

    }

  };



  // Save education

  const saveEducation = async () => {

    if (

      !degree ||

      !college.trim() ||

      !specialization.trim() ||

      !graduationYear

    ) {

      setEducationMessage("Please fill all fields.");

      return;

    }



    if (!userId()) {

      setEducationMessage("Please log in first.");

      return;

    }



    try {

      const res = await fetch(`${API}/api/education`, {

        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({

          degree,

          college: college.trim(),

          specialization: specialization.trim(),

          graduationYear: Number(graduationYear),

          userId: Number(userId()),

        }),

      });



      if (!res.ok) {

        throw new Error("Failed to save education.");

      }



      setDegree("");

      setCollege("");

      setSpecialization("");

      setGraduationYear("");



      await loadEducation();

      setEducationMessage("Education saved successfully!");

    } catch (error) {

      setEducationMessage(

        error.message || "Backend is not running."

      );

    }

  };



  // Load technical skills for the logged-in user
  const loadSkills = async () => {
    const id = userId();

    if (!id) {
      setSavedSkills([]);
      setSkillMessage("Please log in first.");
      return;
    }

    setSkillsLoading(true);
    try {
      const res = await fetch(
        `${API}/api/skills/user/${encodeURIComponent(id)}`
      );
      if (!res.ok) {
        throw new Error("Unable to load saved technical skills.");
      }
      const records = await res.json();
      setSavedSkills(Array.isArray(records) ? records : []);
    } catch (error) {
      setSkillMessage(error.message || "Unable to load saved skills.");
    } finally {
      setSkillsLoading(false);
    }
  };

  const openTechnicalSkills = () => {
    setPage("skills");
    loadSkills();
  };

  // Save technical skill
  const saveSkill = async () => {

    if (!skill.trim()) {

      setSkillMessage("Please enter a skill.");

      return;

    }



    if (!userId()) {

      setSkillMessage("Please log in first.");

      return;

    }



    try {

      const res = await fetch(`${API}/api/skills`, {

        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({

          skill: skill.trim(),

          userId: Number(userId()),

        }),

      });



      if (!res.ok) {

        throw new Error("Failed to save skill.");

      }



      setSkill("");
      await loadSkills();
      setSkillMessage("Skill saved successfully!");

    } catch (error) {

      setSkillMessage(

        error.message || "Backend is not running."

      );

    }

  };



  // Load learning progress

  const loadProgress = async () => {

    const id = userId();



    if (!id) {

      setProgressData([]);

      setProgressMessage("Please log in first.");

      return;

    }



    setProgressMessage("Loading your progress...");



    try {

      const res = await fetch(

        `${API}/api/progress?userId=${encodeURIComponent(id)}`

      );



      if (!res.ok) {

        throw new Error("Unable to load learning progress.");

      }



      const records = await res.json();

      const safeRecords = Array.isArray(records) ? records : [];



      setProgressData(safeRecords);

      setProgressMessage(

        safeRecords.length ? "" : "No learning progress saved yet."

      );

    } catch (error) {

      setProgressMessage(

        error.message || "Backend is not running."

      );

    }

  };



  // Load available careers

  const loadAvailableCareers = async () => {

    setCareerMessage("");



    try {

      const response = await fetch(

        `${API}/api/career-skills/available-careers`

      );



      if (!response.ok) {

        throw new Error("Failed to load available careers.");

      }



      const careers = await response.json();

      const safeCareers = Array.isArray(careers) ? careers : [];



      setAvailableCareers(safeCareers);



      const savedCareer = localStorage.getItem("targetCareer");



      setCareerName(

        savedCareer && safeCareers.includes(savedCareer)

          ? savedCareer

          : ""

      );



      if (safeCareers.length === 0) {

        setCareerMessage("No careers are available yet.");

        return false;

      }



      return true;

    } catch {

      setCareerMessage("Unable to load careers. Check the backend.");

      return false;

    }

  };



  // Save target career

  const saveCareer = async () => {

    if (!careerName) {

      setCareerMessage("Please select a target career.");

      return;

    }



    if (!userId()) {

      setCareerMessage("Please log in first.");

      return;

    }



    try {

      const res = await fetch(`${API}/api/careers`, {

        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({

          careerName,

          userId: Number(userId()),

        }),

      });



      if (!res.ok) {

        throw new Error("Unable to save target career.");

      }



      localStorage.setItem("targetCareer", careerName);

      setCareerMessage(`Target career saved: ${careerName}`);

    } catch (error) {

      setCareerMessage(

        error.message || "Backend is not running."

      );

    }

  };



  // Load skill gap analysis

  const loadSkillGaps = async () => {

    const id = userId();

    const selectedCareer = localStorage.getItem("targetCareer");



    if (!id) {

      setSkillGaps([]);

      setCareerMessage("Please log in first.");

      return false;

    }



    if (!selectedCareer) {

      setSkillGaps([]);

      setCareerMessage(

        "Please select and save your target career first."

      );

      return false;

    }



    setCareerMessage("");



    try {

      const url =

        `${API}/api/skill-gap/analyze` +

        `?career=${encodeURIComponent(selectedCareer)}` +

        `&userId=${encodeURIComponent(id)}`;



      const response = await fetch(url);



      if (!response.ok) {

        throw new Error(

          `Skill gap analysis failed (${response.status}).`

        );

      }



      const results = await response.json();



      setSkillGaps(Array.isArray(results) ? results : []);

      return true;

    } catch (error) {

      setSkillGaps([]);

      setCareerMessage(

        error.message || "Unable to connect to the backend."

      );

      return false;

    }

  };

// LOAD SAVED PROJECTS
const loadProjects = async () => {
  try {
    const res = await fetch("http://localhost:8080/api/projects");

    if (res.ok) {
      const data = await res.json();
      setSavedProjects(data);
    } else {
      setProjectMessage("Unable to load saved projects");
    }
  } catch {
    setProjectMessage("Backend is not running");
  }
};


const saveProject = async () => {
  if (
    !projectName.trim() ||
    !projectDescription.trim() ||
    !technologies.trim()
  ) {
    setProjectMessage("Please fill all fields");
    return;
  }

  try {
    const res = await fetch("http://localhost:8080/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectName: projectName.trim(),
        description: projectDescription.trim(),
        technologies: technologies.trim(),
      }),
    });

    if (res.ok) {
      setProjectMessage("Project saved successfully!");
      setProjectName("");
      setProjectDescription("");
      setTechnologies("");

      await loadProjects();
    } else {
      setProjectMessage("Failed to save project");
    }
  } catch (error) {
    setProjectMessage(
      error.message || "Backend is not running."
    );
  }
};





  // Load certifications

  const loadCertifications = async () => {

    const id = userId();



    if (!id) {

      setCertifications([]);

      setCertificationMessage("Please log in first.");

      return;

    }



    setCertificationsLoading(true);



    try {

      const res = await fetch(

        `${API}/api/certifications?userId=${encodeURIComponent(id)}`

      );



      if (!res.ok) {

        throw new Error("Unable to load certifications.");

      }



      const data = await res.json();



      setCertifications(Array.isArray(data) ? data : []);

      setCertificationMessage("");

    } catch (error) {

      setCertificationMessage(

        error.message || "Unable to connect to the backend."

      );

    } finally {

      setCertificationsLoading(false);

    }

  };



  // Save certification

  const saveCertification = async () => {

    if (

      !certificationName.trim() ||

      !issuingOrganization.trim() ||

      !issueYear

    ) {

      setCertificationMessage("Please fill all fields.");

      return;

    }



    if (!userId()) {

      setCertificationMessage("Please log in first.");

      return;

    }



    try {

      const res = await fetch(`${API}/api/certifications`, {

        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({

          certificationName: certificationName.trim(),

          issuingOrganization: issuingOrganization.trim(),

          issueYear: Number(issueYear),

          userId: Number(userId()),

        }),

      });



      if (!res.ok) {

        throw new Error("Failed to save certification.");

      }



      setCertificationName("");

      setIssuingOrganization("");

      setIssueYear("");



      await loadCertifications();

      setCertificationMessage("Certification saved successfully!");

    } catch (error) {

      setCertificationMessage(

        error.message || "Backend is not running."

      );

    }

  };



  // Navigation helpers

  const openEducation = async () => {

    setPage("education");

    await loadEducation();

  };



  const openSkillGapPage = async () => {

    setPage("skillgap");

    await loadSkillGaps();

  };



  const openTargetCareerPage = async () => {

    await loadAvailableCareers();

    setPage("career");

  };



  const openRecommendations = async () => {

    setCareerMessage("");

    setPage("recommendations");

    const success = await loadSkillGaps();

    if (!success) {
      setCareerMessage(
        "Unable to load recommendations. Please log in, save your target career, and try again."
      );
    }

  };



  const openProgress = async () => {

    setPage("progress");

    await loadProgress();

  };



  const openCertifications = async () => {

    setPage("certifications");

    await loadCertifications();

  };



  // Logout

  const logout = () => {

    localStorage.removeItem("userId");

    setSkillGaps([]);

    setProgressData([]);

    setCertifications([]);

    setEducationRecords([]);

    setMessage("");

    setCareerMessage("");

    setEducationMessage("");

    setSkillMessage("");

    setProjectMessage("");

    setCertificationMessage("");

    setPage("home");

  };



  // Dashboard calculations

  const availableCount = skillGaps.filter(

    (item) => item.status === "AVAILABLE"

  ).length;



  const missingCount = skillGaps.filter(

    (item) => item.status === "MISSING"

  ).length;



  const completion =

    skillGaps.length > 0

      ? Math.round((availableCount / skillGaps.length) * 100)

      : 0;



  const completedLearning = progressData.filter(

    (item) => item.status === "Completed"

  ).length;

  const filteredCareers = availableCareers.filter((career) =>
    career.toLowerCase().includes(careerSearch.trim().toLowerCase())
  );



  const themeButton = (

    <button

      type="button"

      className="theme-toggle"

      onClick={toggleTheme}

      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}

      aria-pressed={theme === "dark"}

      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}

    >

      {theme === "light" ? "🌙 Dark" : "☀️ Light"}

    </button>

  );



  return (

    <div className="app" data-theme={theme}>

      {/* Navigation */}

      <nav className="navbar">

        <div

          className="logo"

          onClick={() => setPage("home")}

          onKeyDown={(e) => {

            if (e.key === "Enter" || e.key === " ") {

              e.preventDefault();

              setPage("home");

            }

          }}

          role="button"

          tabIndex={0}

          aria-label="Go to home page"

        >

          <span>✦</span> Career Skill Gap Analyzer

        </div>



        <div className="nav-links">

          {page === "home" ? (

            <>

              <a href="#home">Home</a>

              <a href="#features">Features</a>

              <a href="#about">About</a>

{userId() ? (
  <>
    <button
      type="button"
      onClick={goToDashboard}
    >
      Dashboard
    </button>
    <button
      type="button"
      onClick={logout}
    >
      Logout
    </button>
  </>
) : (
  <button
    type="button"
    onClick={() => {
      setPage("login");
      setMessage("");
    }}
  >
    Login
  </button>
)}
{themeButton}


            </>

          ) : (

            <>

              {userId() && page !== "dashboard" && (

                <button

                  type="button"

                  className="secondary-button nav-cta-button"

                  onClick={goToDashboard}

                >

                  Dashboard

                </button>

              )}

<button
  type="button"
  onClick={() => {
    setPage("home");
    setMessage("");
  }}
>
  Home
</button>


              {themeButton}

            </>

          )}

        </div>

      </nav>



      {/* Home */}

      {page === "home" && (

        <main>

          <section id="home" className="hero">

            <div className="hero-content">

              <p className="tagline">YOUR FUTURE STARTS WITH YOUR SKILLS</p>



              <h1>

                Discover Your <span>Skill Gap</span>

              </h1>



              <p className="description">

                Build your career profile, compare your skills with your dream

                job, and get a personalized roadmap to achieve your goals.

              </p>



              <div className="hero-buttons">

                <button

                  type="button"

                  className="primary-button get-started-button"

                  onClick={() => {

                    setPage("register");

                    setMessage("");

                  }}

                >

                  Get Started →

                </button>



                <a href="#features" className="secondary-button">

                  Explore Features

                </a>

              </div>



              <div className="hero-highlights">

                <span>✓ Personalized skill analysis</span>

                <span>✓ Learning recommendations</span>

                <span>✓ Progress tracking</span>

              </div>

            </div>



            <div className="hero-card">

              <div className="card-icon">🎯</div>

              <p className="tagline">YOUR CAREER ROADMAP</p>

              <h2>Turn Learning Into Progress</h2>



              <div className="roadmap-steps">

                <div><span>01</span> Analyze your skills</div>

                <div><span>02</span> Discover skill gaps</div>

                <div><span>03</span> Follow learning resources</div>

                <div><span>04</span> Track your progress</div>

              </div>

            </div>

          </section>



          <section id="features" className="features">

            <div className="section-heading">

              <p>POWERFUL FEATURES</p>

              <h2>Everything You Need to Grow</h2>

              <span>

                A clear path from your current skills to your career goals.

              </span>

            </div>



            <div className="feature-grid">

              <div className="feature-card">

                <div className="feature-icon">📊</div>

                <h3>Skill Gap Analysis</h3>

                <p>

                  Compare your current skills with your target job requirements.

                </p>

              </div>



              <div className="feature-card">

                <div className="feature-icon">🎯</div>

                <h3>Career Goals</h3>

                <p>Choose a career and understand the skills it requires.</p>

              </div>



              <div className="feature-card">

                <div className="feature-icon">📚</div>

                <h3>Learning Recommendations</h3>

                <p>

                  Find helpful resources to learn skills you are missing.

                </p>

              </div>



              <div className="feature-card">

                <div className="feature-icon">📈</div>

                <h3>Progress Tracking</h3>

                <p>

                  Track learning statuses and see your completed learning records.

                </p>

              </div>

            </div>

          </section>



          <section id="about" className="about">

            <h2>Turn Your Skills Into a Career Roadmap</h2>

            <p>

              Understand your current strengths, identify what you need to

              improve, and work toward your desired career one skill at a time.

            </p>



            <button

              type="button"

              className="primary-button"

              onClick={() => {

                setPage("register");

                setMessage("");

              }}

            >

              Start Your Journey →

            </button>

          </section>

        </main>

      )}



      {/* Dashboard */}

      {page === "dashboard" && (

        <main className="dashboard">

          <div className="dashboard-welcome">

            <div>

              <p className="tagline">YOUR PERSONAL WORKSPACE</p>

              <h1>Welcome to Your Dashboard 👋</h1>

              <p>

                Build your profile, review your skills, and keep moving forward.

              </p>

            </div>



            <button

              type="button"

              className="logout-button"

              onClick={logout}

            >

              Logout

            </button>

          </div>



          <div className="stats-grid">

            <div className="stat-card">

              <div className="stat-icon">🎯</div>

              <p>Target Career</p>

              <h3 className="stat-label">

                {localStorage.getItem("targetCareer") || "Not selected"}

              </h3>

            </div>



            <div className="stat-card">

              <div className="stat-icon">📊</div>

              <p>Required Skills</p>

              <h3 className="stat-number">{skillGaps.length}</h3>

            </div>



            <div className="stat-card">

              <div className="stat-icon">✅</div>

              <p>Skills Available</p>

              <h3 className="stat-number">{availableCount}</h3>

            </div>



            <div className="stat-card">

              <div className="stat-icon">📚</div>

              <p>Learning Completed</p>

              <h3 className="stat-number">{completedLearning}</h3>

            </div>

          </div>



          <div className="dashboard-section-heading">

            <div>

              <h2>Your Career Workspace</h2>

              <p>Select a section to manage your career profile.</p>

            </div>

          </div>



          <div className="dashboard-grid">

            <div

              className="feature-card"

              onClick={openEducation}

              role="button"

              tabIndex={0}

              onKeyDown={(e) => {

                if (e.key === "Enter" || e.key === " ") openEducation();

              }}

            >

              <div className="feature-icon">🎓</div>

              <h3>Education</h3>

              <p>Manage your education details.</p>

              <span className="card-action">Open section →</span>

            </div>



            <div

              className="feature-card"

              onClick={openTechnicalSkills}

              role="button"

              tabIndex={0}

            >

              <div className="feature-icon">💻</div>

              <h3>Technical Skills</h3>

              <p>Add skills you already know.</p>

              <span className="card-action">Open section →</span>

            </div>



            <div

              className="feature-card"

              onClick={async () => {
  setSelectedProject(null);
  setProjectMessage("");
  await loadProjects();
  setPage("projects");
}}

              role="button"

              tabIndex={0}

            >

              <div className="feature-icon">📁</div>

              <h3>Projects</h3>

              <p>Showcase your practical experience.</p>

              <span className="card-action">Open section →</span>

            </div>



            <div

              className="feature-card"

              onClick={openCertifications}

              role="button"

              tabIndex={0}

            >

              <div className="feature-icon">📜</div>

              <h3>Certifications</h3>

              <p>Record certifications you have earned.</p>

              <span className="card-action">Open section →</span>

            </div>



            <div

              className="feature-card"

              onClick={openTargetCareerPage}

              role="button"

              tabIndex={0}

            >

              <div className="feature-icon">🚀</div>

              <h3>Target Career</h3>

              <p>Choose your desired job role.</p>

              <span className="card-action">Open section →</span>

            </div>



            <div

              className="feature-card"

              onClick={openSkillGapPage}

              role="button"

              tabIndex={0}

            >

              <div className="feature-icon">📈</div>

              <h3>Skill Gap Analysis</h3>

              <p>Review available and missing skills.</p>

              <span className="card-action">Analyze skills →</span>

            </div>



            <div

              className="feature-card"

              onClick={openRecommendations}

              role="button"

              tabIndex={0}

            >

              <div className="feature-icon">📚</div>

              <h3>Learning Recommendations</h3>

              <p>Explore resources for your missing skills.</p>

              <span className="card-action">Start learning →</span>

            </div>



            <div

              className="feature-card"

              onClick={openProgress}

              role="button"

              tabIndex={0}

            >

              <div className="feature-icon">🏆</div>

              <h3>Progress Tracking</h3>

              <p>Review your saved learning statuses.</p>

              <span className="card-action">View progress →</span>

            </div>

          </div>

        </main>

      )}



      {/* Education */}

      {page === "education" && (

        <section className="dashboard">

          <h1>Education Details</h1>

          <p>Enter your educational information.</p>



          <div className="login-box">

           <input
  placeholder="Degree"
  value={degree}
  onChange={(e) => setDegree(e.target.value)}
  onKeyDown={handleEnterToNext}
/>



          <input
  placeholder="College / University"
  value={college}
  onChange={(e) => setCollege(e.target.value)}
  onKeyDown={handleEnterToNext}
/>

<input
  placeholder="Specialization"
  value={specialization}
  onChange={(e) => setSpecialization(e.target.value)}
  onKeyDown={handleEnterToNext}
/>

<input
  type="number"
  placeholder="Graduation Year"
  min="1900"
  max="2100"
  value={graduationYear}
  onChange={(e) => setGraduationYear(e.target.value)}
  onKeyDown={handleEnterToNext}
/>


<button
  type="button"
  className="login-button"
  onClick={saveEducation}
>
  Save Education
</button>

{educationMessage && (
  <p role="status">{educationMessage}</p>
)}

<button
  type="button"
  className="secondary-button back-dashboard-button"
  onClick={goToDashboard}
>
  Back to Dashboard
</button>
</div>



          <div className="dashboard-section-heading">

            <h2>Your Saved Education</h2>

            <p>{educationRecords.length} education record(s)</p>

          </div>



          <button

            type="button"

            className="secondary-button"

            onClick={loadEducation}

          >

            Refresh Education

          </button>



          {educationLoading ? (

            <p>Loading education records...</p>

          ) : educationRecords.length > 0 ? (

            <div className="feature-grid">

              {educationRecords.map((record) => (

                <div className="feature-card" key={record.id}>

                  <div className="feature-icon">🎓</div>

                  <h3>{record.degree}</h3>

                  <p>

                    <strong>College:</strong> {record.college}

                  </p>

                  <p>

                    <strong>Specialization:</strong> {record.specialization}

                  </p>

                  <p>

                    <strong>Graduation Year:</strong> {record.graduationYear}

                  </p>

                </div>

              ))}

            </div>

          ) : (

            <div className="feature-card">

              <h3>No Education Records Found</h3>

              <p>Save your education details to see them here.</p>

            </div>

          )}

        </section>

      )}




      {/* Technical skills */}
      {page === "skills" && (
        <section className="dashboard">
          <h1>Technical Skills</h1>

          <p>
            Add the technical skills you already know and manage your saved
            skills below.
          </p>

          <div className="login-box">
            <input
              placeholder="Enter a skill (e.g. HTML, CSS, React)"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              onKeyDown={handleEnterToNext}
            />

            <button
              type="button"
              className="login-button"
              onClick={saveSkill}
            >
              Save Technical Skill
            </button>

            {skillMessage && <p role="status">{skillMessage}</p>}
          </div>

          <div className="dashboard-section-heading">
            <h2>Your Saved Technical Skills</h2>
            <p>{savedSkills.length} skill(s) saved</p>
          </div>

          <button
            type="button"
            className="secondary-button"
            onClick={loadSkills}
            disabled={skillsLoading}
          >
            {skillsLoading ? "Refreshing..." : "Refresh Skills"}
          </button>

          {skillsLoading ? (
            <p>Loading technical skills...</p>
          ) : savedSkills.length > 0 ? (
            <div className="feature-grid">
              {savedSkills.map((item, index) => (
                <div
                  className="feature-card"
                  key={item.id ?? index}
                >
                  <div className="feature-icon">💻</div>
                  <h3>{item.skill}</h3>
                </div>
              ))}
            </div>
          ) : (
            <div className="feature-card">
              <div className="feature-icon">💻</div>
              <h3>No Technical Skills Found</h3>
              <p>
                Save a technical skill or click Refresh Skills to check
                your saved records.
              </p>
            </div>
          )}

          <button
            type="button"
            className="secondary-button back-dashboard-button"
            onClick={goToDashboard}
          >
            Back to Dashboard
          </button>
        </section>
      )}



      {/* Target career */}

      {page === "career" && (

        <section className="dashboard">

          <h1>Target Career</h1>

          <p>Select the career you want to achieve.</p>



          <div className="login-box">

            <input
              type="search"
              placeholder="Type a career (e.g. AI Engineer)"
              aria-label="Search careers"
              value={careerSearch}
              onKeyDown={handleEnterToNext}
              onChange={(e) => setCareerSearch(e.target.value)}
            />

            <button
              type="button"
              className="secondary-button"
              onClick={loadAvailableCareers}
            >
              Search Careers
            </button>

            <select

              value={careerName}

              onChange={(e) => {

                setCareerName(e.target.value);

                setCareerMessage("");

              }}

            >

              <option value="">Select your target career</option>

              {filteredCareers.map((career) => (

                <option key={career} value={career}>

                  {career}

                </option>

              ))}

            </select>



            <button

              type="button"

              className="login-button"

              onClick={saveCareer}

            >

              Save Target Career

            </button>



            {careerMessage && <p role="status">{careerMessage}</p>}



            <button

              type="button"

              className="secondary-button"

              onClick={goToDashboard}

            >

              Back to Dashboard

            </button>

          </div>

        </section>

      )}



      {/* Skill Gap Analysis */}

      {page === "skillgap" && (

        <section className="dashboard skill-gap-analysis">

          <p className="tagline">CAREER READINESS</p>

          <h1>Skill Gap Analysis</h1>

          <p>

            Compare your existing skills with your saved target career requirements.

          </p>



          <div className="login-box">

            <h3>

              Target Career:{" "}

              {localStorage.getItem("targetCareer") || "Not selected"}

            </h3>



            <button

              type="button"

              className="login-button"

              onClick={loadSkillGaps}

            >

              Refresh Skill Gap Analysis

            </button>



            {careerMessage && <p role="alert">{careerMessage}</p>}



            {!localStorage.getItem("targetCareer") && (

              <button

                type="button"

                className="secondary-button"

                onClick={openTargetCareerPage}

              >

                Choose Target Career

              </button>

            )}

          </div>



          <div className="skill-gap-summary stats-grid">

            <div className="summary-card stat-card">

              <h3 className="stat-number">{skillGaps.length}</h3>

              <p>Total Required Skills</p>

            </div>



            <div className="summary-card stat-card available-summary">

              <h3 className="stat-number">{availableCount}</h3>

              <p>Skills Available</p>

            </div>



            <div className="summary-card stat-card missing-summary">

              <h3 className="stat-number">{missingCount}</h3>

              <p>Skills Missing</p>

            </div>

          </div>



          {skillGaps.length > 0 && (

            <div className="progress-card">

              <div className="progress-heading">

                <strong>Career Skill Readiness</strong>

                <strong>{completion}%</strong>

              </div>

              <progress value={completion} max="100" />

            </div>

          )}



          <div className="feature-grid">

            {skillGaps.length > 0 ? (

              skillGaps.map((item, index) => (

                <div

                  className={`feature-card ${

                    item.status === "AVAILABLE"

                      ? "skill-available"

                      : "skill-missing"

                  }`}

                  key={item.id ?? `${item.career}-${item.skill}-${index}`}

                >

                  <div className="feature-icon">

                    {item.status === "AVAILABLE" ? "✅" : "📌"}

                  </div>

                  <h3>{item.skill}</h3>

                  <p>Career: {item.career}</p>

                  <p>

                    Status:{" "}

                    <strong

                      className={

                        item.status === "AVAILABLE"

                          ? "status-available"

                          : "status-missing"

                      }

                    >

                      {item.status}

                    </strong>

                  </p>

                </div>

              ))

            ) : (

              <div className="feature-card">

                <div className="feature-icon">📊</div>

                <h3>No Skill Gap Data Available</h3>

                <p>

                  Choose and save a target career, add your technical skills,

                  and refresh the analysis.

                </p>

              </div>

            )}

          </div>



          <button

            type="button"

            className="secondary-button"

            onClick={goToDashboard}

          >

            Back to Dashboard

          </button>

        </section>

      )}



      {/* Learning recommendations */}

      {page === "recommendations" && (

        <section className="dashboard">

          <p className="tagline">YOUR PERSONAL LEARNING PATH</p>

          <h1>Learning Recommendations</h1>

          <p>

            Explore learning resources for the skills required for your target career.

          </p>

          {careerMessage && (
            <p role="alert">{careerMessage}</p>
          )}

          <LearningRecommendations

            missingSkills={skillGaps.filter(

              (item) =>
                String(item.status || "")
                  .trim()
                  .toUpperCase() === "MISSING"

            )}

          />



          <button

            type="button"

            className="secondary-button"

            onClick={goToDashboard}

          >

            Back to Dashboard

          </button>

        </section>

      )}



      {/* Progress tracking */}

      {page === "progress" && (

        <section className="dashboard progress-tracking-page">

          <p className="tagline">YOUR LEARNING JOURNEY</p>

          <h1>Progress Tracking</h1>

          <p>Review learning progress saved to the backend.</p>



          <div className="progress-toolbar">

            <button

              type="button"

              className="primary-button"

              onClick={loadProgress}

            >

              Refresh Progress

            </button>



            <span>{progressData.length} saved learning records</span>

          </div>



          {progressMessage && <p role="status">{progressMessage}</p>}



          <div className="feature-grid">

            {progressData.length > 0 ? (

              progressData.map((item, index) => {

                const value = Math.max(

                  0,

                  Math.min(100, Number(item.progress) || 0)

                );



                return (

                  <div

                    className="feature-card progress-card"

                    key={item.id ?? `${item.skill}-${index}`}

                  >

                    <div className="feature-icon">📈</div>

                    <h3>{item.skill}</h3>



                    <div className="progress-heading">

                      <span>{item.status || "Not Started"}</span>

                      <strong>{value}%</strong>

                    </div>



                    <progress value={value} max="100" />

                    <p>Saved learning progress</p>

                  </div>

                );

              })

            ) : (

              <div className="feature-card">

                <div className="feature-icon">📈</div>

                <h3>No Progress Available</h3>

                <p>

                  Update a learning status in Learning Recommendations,

                  then refresh this page.

                </p>

              </div>

            )}

          </div>



          <div className="progress-back-wrapper">

            <button

              type="button"

              className="secondary-button"

              onClick={goToDashboard}

            >

              ← Back to Dashboard

            </button>

          </div>

        </section>

      )}


      {/* PROJECTS */}
      {page === "projects" && (
        <section className="dashboard">
          <h1>Projects</h1>
          <p>Add and manage your completed projects.</p>

          {!selectedProject && (
            <>
              <div className="login-box">
                <input
                  type="text"
                  placeholder="Project Name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      e.currentTarget.nextElementSibling?.focus();
                    }
                  }}
                />

                <input
                  type="text"
                  placeholder="Project Description"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      e.currentTarget.nextElementSibling?.focus();
                    }
                  }}
                />

                <input
                  type="text"
                  placeholder="Technologies Used"
                  value={technologies}
                  onChange={(e) => setTechnologies(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      saveProject();
                    }
                  }}
                />

                <button
                  type="button"
                  className="login-button"
                  onClick={saveProject}
                >
                  Save Project
                </button>

                {projectMessage && (
                  <p className="register-text">{projectMessage}</p>
                )}
              </div>

              <h2>Saved Projects</h2>

              <div className="feature-grid">
                {savedProjects.length > 0 ? (
                  savedProjects.map((project, index) => (
                    <div
                      className="feature-card"
                      key={project.id ?? index}
                    >
                      <div className="feature-icon">📁</div>
                      <h3>{project.projectName}</h3>
                      <p>{project.description}</p>

                      <button
                        type="button"
                        className="login-button"
                        onClick={() => setSelectedProject(project)}
                      >
                        Open
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="feature-card">
                    <div className="feature-icon">📁</div>
                    <h3>No Projects Saved</h3>
                    <p>Your saved projects will appear here.</p>
                  </div>
                )}
              </div>
            </>
          )}

          {selectedProject && (
            <div className="project-workspace">
              <div className="project-workspace-header">
                <div className="project-folder-icon">📂</div>

                <div className="project-workspace-title">
                  <h2>{selectedProject.projectName}</h2>
                  <p>Project workspace</p>
                </div>

                <span className="project-saved-badge">Saved</span>
              </div>

              <div className="project-workspace-divider" />

              <section className="project-info-section">
                <h3>Project Overview</h3>
                <p>{selectedProject.description}</p>
              </section>

              <section className="project-info-section">
                <h3>Technologies Used</h3>

                <div className="project-tech-tags">
                  {(selectedProject.technologies || "")
                    .split(",")
                    .map((tech) => tech.trim())
                    .filter(Boolean)
                    .map((tech, index) => (
                      <span className="project-tech-tag" key={index}>
                        {tech}
                      </span>
                    ))}
                </div>
              </section>

              <div className="project-workspace-divider" />

              <div className="project-workspace-footer">
                <span>📁 Project details</span>

                <button
                  type="button"
                  className="project-back-button"
                  onClick={() => setSelectedProject(null)}
                >
                  ← Back to Projects
                </button>
              </div>
            </div>
          )}

          <button
            type="button"
            className="secondary-button"
            onClick={() => setPage("dashboard")}
          >
            Back to Dashboard
          </button>
        </section>
      )}

      {/* CERTIFICATIONS */}
      {page === "certifications" && (
        <section className="dashboard">
          <h1>My Certifications</h1>

          <p>
            Add certificates you have earned and view your saved records below.
          </p>

          <div className="login-box">
            <input
              type="text"
              placeholder="Certification Name"
              value={certificationName}
              onChange={(e) => setCertificationName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.currentTarget.nextElementSibling?.focus();
                }
              }}
            />

            <input
              type="text"
              placeholder="Issuing Organization"
              value={issuingOrganization}
              onChange={(e) => setIssuingOrganization(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.currentTarget.nextElementSibling?.focus();
                }
              }}
            />

            <input
              type="number"
              placeholder="Issue Year"
              min="1900"
              max="2100"
              value={issueYear}
              onChange={(e) => setIssueYear(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  saveCertification();
                }
              }}
            />

            <button
              type="button"
              className="login-button"
              onClick={saveCertification}
            >
              Save Certification
            </button>

            {certificationMessage && (
              <p role="status">{certificationMessage}</p>
            )}

            <button
              type="button"
              className="secondary-button"
              onClick={loadCertifications}
            >
              Refresh Certifications
            </button>
          </div>

          <div className="dashboard-section-heading">
            <h2>Your Saved Certificates</h2>
            <p>{certifications.length} certification(s) saved</p>
          </div>

          {certificationsLoading ? (
            <p>Loading certifications...</p>
          ) : certifications.length > 0 ? (
            <div className="feature-grid">
              {certifications.map((cert, index) => (
                <div className="feature-card" key={cert.id ?? index}>
                  <div className="feature-icon">📜</div>
                  <h3>{cert.certificationName}</h3>

                  <p>
                    <strong>Issuing Organization:</strong>{" "}
                    {cert.issuingOrganization}
                  </p>

                  <p>
                    <strong>Issue Year:</strong> {cert.issueYear}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="feature-card">
              <div className="feature-icon">📄</div>
              <h3>No Certifications Found</h3>
              <p>
                Save a certification or click Refresh Certifications
                to check your saved records.
              </p>
            </div>
          )}

          <button
            type="button"
            className="secondary-button back-dashboard-button"
            onClick={goToDashboard}
          >
            Back to Dashboard
          </button>
        </section>
      )}

      {/* LOGIN AND REGISTRATION */}
      {(page === "login" || page === "register") && (
        <div
          className="modal-overlay"
          onClick={() => setPage("home")}
        >
          <div
            className="login-box"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="close-button"
              aria-label="Close login window"
              onClick={() => {
                setPage("home");
                setMessage("");
              }}
            >
              ×
            </button>

            <p className="tagline">
              {page === "login" ? "WELCOME BACK" : "START YOUR JOURNEY"}
            </p>

            <h2>
              {page === "login" ? "Welcome Back" : "Create Your Account"}
            </h2>

            <p>
              {page === "login"
                ? "Log in to continue your career journey."
                : "Create an account to start building your career roadmap."}
            </p>

            {page === "register" && (
              <input
                type="text"
                placeholder="Full Name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    e.currentTarget.nextElementSibling?.focus();
                  }
                }}
              />
            )}

            <input
              type="email"
              placeholder="Email Address"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.currentTarget.nextElementSibling?.focus();
                }
              }}
            />

<input
  type="password"
  placeholder="Password"
  autoComplete={
    page === "login" ? "current-password" : "new-password"
  }
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (page === "login") {
        void login();
      } else {
        void register();
      }
    }
  }}
/>


            <button
              type="button"
              className="login-button"
              onClick={page === "login" ? login : register}
            >
              {page === "login" ? "Login" : "Create Account"}
            </button>

            {message && <p role="alert">{message}</p>}

            <p className="register-text">
              {page === "login"
                ? "New user? "
                : "Already have an account? "}

              <span
                role="button"
                tabIndex={0}
                onClick={() => {
                  setPage(page === "login" ? "register" : "login");
                  setMessage("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setPage(page === "login" ? "register" : "login");
                    setMessage("");
                  }
                }}
              >
                {page === "login" ? "Create an account" : "Login"}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
