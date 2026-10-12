

import { useState, useEffect } from "react";

import LearningRecommendations from "./LearningRecommendations";

import "./App.css";



const API = import.meta.env.VITE_API_URL || "https://career-skill-gap-backend.onrender.com";

const POPULAR_SKILLS = [
  "Java", "Spring Boot", "React", "SQL", "MySQL", "JavaScript",
  "Python", "HTML", "CSS", "Git", "REST API", "Docker", "Node.js",
  "Django", "Power BI", "Pandas", "AWS", "Data Structures"
];

const CAREER_PROFILES = {
  "Java Developer": ["Java", "Spring Boot", "MySQL", "REST API", "Git"],
  "Frontend Developer": ["HTML", "CSS", "JavaScript", "React", "Git"],
  "Full Stack Developer": ["Java", "Spring Boot", "React", "JavaScript", "MySQL"],
  "Python Developer": ["Python", "Django", "SQL", "Git"],
  "Data Analyst": ["Python", "SQL", "Excel", "Power BI", "Pandas"]
};

// Student Avatar matching the portal reference design
function StudentAvatar({ size = 36, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`student-avatar-svg ${className}`}
      style={{ borderRadius: "50%", flexShrink: 0, display: "block" }}
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="50" fill="#fed7aa" />
      {/* Shirt */}
      <path d="M 18 100 C 18 76, 32 68, 50 68 C 68 68, 82 76, 82 100 Z" fill="#991b1b" />
      {/* Shirt Collar V-shape */}
      <polygon points="50,86 41,68 59,68" fill="#fef3c7" />
      {/* Neck */}
      <rect x="43" y="58" width="14" height="15" fill="#fed7aa" rx="2" />
      {/* Head */}
      <ellipse cx="50" cy="44" rx="20" ry="22" fill="#fbcfe8" />
      {/* Hair */}
      <path d="M 30 40 C 30 23, 40 18, 50 18 C 60 18, 70 23, 70 40 C 70 32, 65 26, 50 26 C 35 26, 30 32, 30 40 Z" fill="#9a3412" />
      {/* Beard & Hair sides */}
      <path d="M 31 43 C 31 59, 39 67, 50 67 C 61 67, 69 59, 69 43 C 67 56, 59 62, 50 62 C 41 62, 33 56, 31 43 Z" fill="#9a3412" />
      {/* Eyes */}
      <circle cx="43" cy="42" r="2.3" fill="#1e293b" />
      <circle cx="57" cy="42" r="2.3" fill="#1e293b" />
      {/* Eyebrows */}
      <path d="M 40 37 Q 43 35 46 37" stroke="#78350f" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M 54 37 Q 57 35 60 37" stroke="#78350f" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* Smile */}
      <path d="M 45 52 Q 50 56 55 52" stroke="#78350f" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function App() {

  // Theme
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  // Student Profile state
  const [studentId, setStudentId] = useState(
    () => localStorage.getItem("studentId") || "24eg107e54"
  );
  const [currentUserName, setCurrentUserName] = useState(
    () => localStorage.getItem("userName") || "Bhanu"
  );
  const [currentUserEmail, setCurrentUserEmail] = useState(
    () => localStorage.getItem("userEmail") || "24eg107e54@anurag.edu.in"
  );
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [editStudentIdInput, setEditStudentIdInput] = useState("");
  const [editUserNameInput, setEditUserNameInput] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);

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

  // View Mode states (Grid vs List) for all features
  const [educationViewMode, setEducationViewMode] = useState("grid");
  const [skillsViewMode, setSkillsViewMode] = useState("grid");
  const [projectsViewMode, setProjectsViewMode] = useState("grid");
  const [certificationsViewMode, setCertificationsViewMode] = useState("grid");

  // Confirmation Modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    isDanger: true,
    action: null,
  });

  const openConfirmModal = ({
    title,
    message,
    confirmText = "Confirm",
    isDanger = true,
    action,
  }) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      confirmText,
      isDanger,
      action,
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal({
      isOpen: false,
      title: "",
      message: "",
      confirmText: "Confirm",
      isDanger: true,
      action: null,
    });
  };

  const handleExecuteConfirm = async () => {
    const actionToRun = confirmModal.action;
    closeConfirmModal();
    if (typeof actionToRun === "function") {
      await actionToRun();
    }
  };

  // Recycle Bin state
  const [recycleBin, setRecycleBin] = useState(() => {
    const id = localStorage.getItem("userId");
    if (!id) return [];
    try {
      return JSON.parse(localStorage.getItem(`recycle_bin_${id}`)) || [];
    } catch {
      return [];
    }
  });

  const [recycleSearch, setRecycleSearch] = useState("");
  const [recycleTypeFilter, setRecycleTypeFilter] = useState("all");
  const [recycleDateFilter, setRecycleDateFilter] = useState("all");
  const [recycleViewMode, setRecycleViewMode] = useState("grid");
  const [recycleMessage, setRecycleMessage] = useState("");

  const saveRecycleBin = (items) => {
    setRecycleBin(items);
    const id = localStorage.getItem("userId");
    if (id) {
      localStorage.setItem(`recycle_bin_${id}`, JSON.stringify(items));
    }
  };

  const addToRecycleBin = (type, title, details, payload) => {
    const newItem = {
      binId: `bin_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      type,
      title,
      details,
      payload,
      deletedAt: new Date().toISOString(),
    };
    const updated = [newItem, ...recycleBin];
    saveRecycleBin(updated);
  };

  // Filter recycle bin items by query, type, and date
  const filteredRecycleItems = recycleBin.filter((item) => {
    if (recycleSearch.trim()) {
      const q = recycleSearch.toLowerCase();
      const matchTitle = (item.title || "").toLowerCase().includes(q);
      const matchDetails = (item.details || "").toLowerCase().includes(q);
      if (!matchTitle && !matchDetails) return false;
    }
    if (recycleTypeFilter !== "all" && item.type !== recycleTypeFilter) {
      return false;
    }
    if (recycleDateFilter !== "all" && item.deletedAt) {
      const itemDate = new Date(item.deletedAt);
      const now = new Date();
      if (recycleDateFilter === "today") {
        const isSameDay =
          itemDate.getDate() === now.getDate() &&
          itemDate.getMonth() === now.getMonth() &&
          itemDate.getFullYear() === now.getFullYear();
        if (!isSameDay) return false;
      } else if (recycleDateFilter === "week") {
        const diffDays = (now - itemDate) / (1000 * 60 * 60 * 24);
        if (diffDays > 7) return false;
      } else if (recycleDateFilter === "month") {
        const isSameMonth =
          itemDate.getMonth() === now.getMonth() &&
          itemDate.getFullYear() === now.getFullYear();
        if (!isSameMonth) return false;
      }
    }
    return true;
  });

  // Prompt confirmation before deleting a technical skill
  const promptDeleteSkill = (item) => {
    openConfirmModal({
      title: "DO YOU WANT TO DELETE?",
      message: `Are you sure you want to delete technical skill "${item.skill}"? It will be moved to the Recycle Bin where you can restore it anytime.`,
      confirmText: "Yes, Delete",
      isDanger: true,
      action: async () => {
        addToRecycleBin(
          "Technical Skill",
          item.skill,
          `Proficiency: ${item.proficiencyLevel || "Not specified"}`,
          item
        );
        await deleteSkill(item.id);
      },
    });
  };

  // Prompt confirmation before deleting a project
  const promptDeleteProject = (project) => {
    openConfirmModal({
      title: "DO YOU WANT TO DELETE?",
      message: `Are you sure you want to delete project "${project.projectTitle}"? It will be moved to the Recycle Bin where you can restore it anytime.`,
      confirmText: "Yes, Delete",
      isDanger: true,
      action: async () => {
        addToRecycleBin(
          "Project",
          project.projectTitle,
          project.techStack ? `Tech Stack: ${project.techStack}` : (project.projectDescription || ""),
          project
        );
        await deleteProject(project.id);
      },
    });
  };

  // Prompt confirmation before deleting a certification
  const promptDeleteCertification = (cert) => {
    openConfirmModal({
      title: "DO YOU WANT TO DELETE?",
      message: `Are you sure you want to delete certification "${cert.certificationName}"? It will be moved to the Recycle Bin where you can restore it anytime.`,
      confirmText: "Yes, Delete",
      isDanger: true,
      action: async () => {
        addToRecycleBin(
          "Certification",
          cert.certificationName,
          `Issued By: ${cert.issuingOrganization || "N/A"} (${cert.issueYear || "N/A"})`,
          cert
        );
        await deleteCertification(cert.id);
      },
    });
  };

  // Prompt confirmation before deleting education record
  const promptDeleteEducation = (record) => {
    openConfirmModal({
      title: "DO YOU WANT TO DELETE?",
      message: `Are you sure you want to delete education record "${record.degree} - ${record.college}"? It will be moved to the Recycle Bin where you can restore it anytime.`,
      confirmText: "Yes, Delete",
      isDanger: true,
      action: async () => {
        addToRecycleBin(
          "Education",
          `${record.degree} - ${record.college}`,
          `Specialization: ${record.specialization || "N/A"}, Year: ${record.graduationYear || "N/A"}`,
          record
        );
        await deleteEducation(record.id);
      },
    });
  };

  // Prompt confirmation before logout
  const promptLogout = () => {
    openConfirmModal({
      title: "ARE YOU SURE YOU WANT TO LOGOUT?",
      message: "Do you want to logout? You will need your login credentials to sign back in.",
      confirmText: "Yes, Logout",
      isDanger: false,
      action: () => {
        logout();
      },
    });
  };

  // Restore deleted item back to user profile via backend API
  const restoreFromRecycleBin = async (binItem) => {
    if (!binItem || !userId()) return;
    try {
      const currentUserId = Number(userId());
      if (binItem.type === "Technical Skill") {
        const payload = {
          skill: binItem.payload.skill,
          proficiencyLevel: binItem.payload.proficiencyLevel || "INTERMEDIATE",
          userId: currentUserId,
        };
        const res = await fetch(`${API}/api/skills`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to restore skill.");
        await loadSkills();
        if (localStorage.getItem("targetCareer")) loadSkillGaps();
      } else if (binItem.type === "Project") {
        const payload = {
          projectTitle: binItem.payload.projectTitle,
          projectDescription: binItem.payload.projectDescription || "",
          techStack: binItem.payload.techStack || "",
          projectRole: binItem.payload.projectRole || "",
          projectLink: binItem.payload.projectLink || "",
          userId: currentUserId,
        };
        const res = await fetch(`${API}/api/projects`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to restore project.");
        await loadProjects();
      } else if (binItem.type === "Certification") {
        const payload = {
          certificationName: binItem.payload.certificationName,
          issuingOrganization: binItem.payload.issuingOrganization || "",
          issueYear: binItem.payload.issueYear ? Number(binItem.payload.issueYear) : new Date().getFullYear(),
          userId: currentUserId,
        };
        const res = await fetch(`${API}/api/certifications`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to restore certification.");
        await loadCertifications();
      } else if (binItem.type === "Education") {
        const payload = {
          degree: binItem.payload.degree,
          college: binItem.payload.college,
          specialization: binItem.payload.specialization || "",
          graduationYear: Number(binItem.payload.graduationYear) || new Date().getFullYear(),
          userId: currentUserId,
        };
        const res = await fetch(`${API}/api/education`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to restore education record.");
        await loadEducation();
      }

      const updated = recycleBin.filter((i) => i.binId !== binItem.binId);
      saveRecycleBin(updated);
      setRecycleMessage(`Successfully restored "${binItem.title}" back to your profile!`);
    } catch (err) {
      setRecycleMessage(err.message || "Failed to restore item.");
    }
  };

  // Permanently delete single item from Recycle Bin
  const promptPermanentDelete = (binItem) => {
    openConfirmModal({
      title: "DO YOU WANT TO DELETE PERMANENTLY?",
      message: `Are you sure you want to permanently delete "${binItem.title}" from the Recycle Bin? This action cannot be reversed.`,
      confirmText: "Delete Permanently",
      isDanger: true,
      action: () => {
        const updated = recycleBin.filter((i) => i.binId !== binItem.binId);
        saveRecycleBin(updated);
        setRecycleMessage(`Permanently removed "${binItem.title}".`);
      },
    });
  };

  // Permanently empty entire Recycle Bin
  const promptEmptyBin = () => {
    if (recycleBin.length === 0) return;
    openConfirmModal({
      title: "DO YOU WANT TO EMPTY RECYCLE BIN?",
      message: `Are you sure you want to permanently delete all ${recycleBin.length} item(s) in the Recycle Bin? This cannot be undone.`,
      confirmText: "Empty Recycle Bin",
      isDanger: true,
      action: () => {
        saveRecycleBin([]);
        setRecycleMessage("Recycle bin has been emptied.");
      },
    });
  };


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
    if (userId()) {
      loadSkills();
      loadAvailableCareers();
      if (localStorage.getItem("targetCareer")) {
        loadSkillGaps();
      }
    }
  };

  useEffect(() => {
    if (localStorage.getItem("userId")) {
      loadSkills();
      loadAvailableCareers();
      if (localStorage.getItem("targetCareer")) {
        loadSkillGaps();
      }
    }
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileDropdownOpen &&
        !e.target.closest(".profile-dropdown-container")
      ) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileDropdownOpen]);

  // Unified navigation handlers for Navbar and Profile Dropdown
  const handleNavHome = () => {
    setProfileDropdownOpen(false);
    setPage("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavFeatures = () => {
    setProfileDropdownOpen(false);
    if (page !== "home") {
      setPage("home");
      setTimeout(() => {
        document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNavAbout = () => {
    setProfileDropdownOpen(false);
    if (page !== "home") {
      setPage("home");
      setTimeout(() => {
        document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNavDashboard = () => {
    setProfileDropdownOpen(false);
    goToDashboard();
  };

  const handleNavRecycleBin = () => {
    setProfileDropdownOpen(false);
    setPage("recycleBin");
    setRecycleMessage("");
  };

  const handleOpenProfileModal = () => {
    setProfileDropdownOpen(false);
    setEditStudentIdInput(studentId);
    setEditUserNameInput(currentUserName);
    setIsEditingProfile(false);
    setProfileModalOpen(true);
  };

  const handleSaveProfile = () => {
    const sId = editStudentIdInput.trim() || studentId || "24eg107e54";
    const uName = editUserNameInput.trim() || currentUserName || "Bhanu";
    setStudentId(sId);
    setCurrentUserName(uName);
    localStorage.setItem("studentId", sId);
    localStorage.setItem("userName", uName);
    setIsEditingProfile(false);
  };

  const handleLogoutAction = () => {
    setProfileDropdownOpen(false);
    promptLogout();
  };



  // Register
  const register = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail || !password) {
      setMessage("INVALID CREDENTIALS OR NO PROPER DETAILS: Please fill all fields.");
      return;
    }

    if (trimmedName.length < 2) {
      setMessage("INVALID CREDENTIALS OR NO PROPER DETAILS: Name must contain at least 2 characters.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setMessage("INVALID CREDENTIALS OR NO PROPER DETAILS: Please provide a valid email address (e.g. name@example.com).");
      return;
    }

    if (password.length < 4) {
      setMessage("INVALID CREDENTIALS OR NO PROPER DETAILS: Password must be at least 4 characters long.");
      return;
    }

    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          password,
        }),
      });

      const rawText = await res.text();
      let data = {};
      try {
        data = JSON.parse(rawText);
      } catch {
        data = rawText;
      }

      if (res.ok) {
        setMessage("Registration successful! You can now log in.");
        localStorage.setItem("userName", trimmedName);
        localStorage.setItem("userEmail", trimmedEmail);
        const sId = localStorage.getItem("studentId") || "24eg107e54";
        localStorage.setItem("studentId", sId);
        setCurrentUserName(trimmedName);
        setCurrentUserEmail(trimmedEmail);
        setStudentId(sId);
        setName("");
        setPassword("");
        setPage("login");
      } else {
        // Parse error message cleanly - NEVER show raw JSON like {"timestamp":... "status":500 ...}
        if (typeof data === "object" && data !== null) {
          if (data.message && typeof data.message === "string" && !data.message.includes("Internal Server Error")) {
            if (data.message.toLowerCase().includes("already registered")) {
              setMessage("This email is already registered. Please log in or use another email.");
            } else {
              setMessage(data.message);
            }
          } else {
            setMessage("INVALID CREDENTIALS OR NO PROPER DETAILS: Please check your input and try again.");
          }
        } else if (typeof data === "string" && (data.includes("timestamp") || data.includes("500") || data.includes("Internal Server Error") || data.startsWith("{"))) {
          setMessage("INVALID CREDENTIALS OR NO PROPER DETAILS: Please verify your information and try again.");
        } else {
          setMessage("INVALID CREDENTIALS OR NO PROPER DETAILS: " + (data || "Registration failed."));
        }
      }
    } catch {
      setMessage("Unable to connect to the backend server. Please verify your connection.");
    }
  };

  // Login
  const login = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setMessage("INVALID CREDENTIALS OR NO PROPER DETAILS: Please enter your email and password.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setMessage("INVALID CREDENTIALS OR NO PROPER DETAILS: Please enter a valid registered email address.");
      return;
    }

    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          password,
        }),
      });

      const rawText = await res.text();
      let data = {};
      try {
        data = JSON.parse(rawText);
      } catch {
        data = rawText;
      }

      if (res.ok) {
        if (data.id == null) {
          setMessage("Login succeeded, but the user ID was not returned.");
          return;
        }

        localStorage.setItem("userId", String(data.id));

        const uName = data.name || trimmedEmail.split("@")[0] || "Student";
        const uEmail = data.email || trimmedEmail;
        const sId = localStorage.getItem("studentId") || "24eg107e54";
        localStorage.setItem("userName", uName);
        localStorage.setItem("userEmail", uEmail);
        localStorage.setItem("studentId", sId);
        setCurrentUserName(uName);
        setCurrentUserEmail(uEmail);
        setStudentId(sId);

        try {
          const userBin = JSON.parse(localStorage.getItem(`recycle_bin_${data.id}`)) || [];
          setRecycleBin(userBin);
        } catch {
          setRecycleBin([]);
        }

        setCareerName(localStorage.getItem("targetCareer") || "");
        setMessage("");
        setPassword("");
        setPage("dashboard");
      } else {
        // If account does not exist or credentials incorrect
        if (typeof data === "object" && data !== null && (data.status === 500 || data.error === "Internal Server Error")) {
          setMessage("INVALID CREDENTIALS OR NO PROPER DETAILS: Account not found. Please register or create an account to login.");
        } else {
          setMessage("Account not found or invalid credentials. Please create an account or register to login.");
        }
      }
    } catch {
      setMessage("Unable to connect to the backend server. Please try again later.");
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

  // Delete education record
  const deleteEducation = async (educationId) => {
    if (!educationId) return;
    try {
      const res = await fetch(`${API}/api/education/${educationId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete education record.");
      await loadEducation();
      setEducationMessage("Education record removed successfully!");
    } catch (error) {
      setEducationMessage(error.message || "Unable to delete education record.");
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

  // Delete technical skill
  const deleteSkill = async (skillId) => {
    if (!skillId) return;
    try {
      const res = await fetch(`${API}/api/skills/${skillId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete skill.");
      await loadSkills();
      if (localStorage.getItem("targetCareer")) {
        loadSkillGaps();
      }
      setSkillMessage("Skill removed successfully!");
    } catch (error) {
      setSkillMessage(error.message || "Unable to delete skill.");
    }
  };

  // Quick-add popular skill
  const quickAddSkill = async (skillName) => {
    if (!skillName || !userId()) {
      setSkillMessage("Please log in first.");
      return;
    }
    const alreadyExists = savedSkills.some(
      (s) => (s.skill || "").toLowerCase().trim() === skillName.toLowerCase().trim()
    );
    if (alreadyExists) {
      setSkillMessage(`"${skillName}" is already in your profile!`);
      return;
    }
    try {
      const res = await fetch(`${API}/api/skills`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skill: skillName.trim(),
          userId: Number(userId()),
        }),
      });
      if (!res.ok) throw new Error("Failed to add skill.");
      await loadSkills();
      if (localStorage.getItem("targetCareer")) {
        loadSkillGaps();
      }
      setSkillMessage(`"${skillName}" added to profile!`);
    } catch (error) {
      setSkillMessage(error.message || "Failed to add skill.");
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
    const res = await fetch(`${API}/api/projects`);

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
    const res = await fetch(`${API}/api/projects`, {
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

// Delete project
const deleteProject = async (projectId) => {
  if (!projectId) return;
  try {
    const res = await fetch(`${API}/api/projects/${projectId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete project.");
    if (selectedProject?.id === projectId) {
      setSelectedProject(null);
    }
    await loadProjects();
    setProjectMessage("Project deleted successfully!");
  } catch (error) {
    setProjectMessage(error.message || "Failed to delete project.");
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

  // Delete certification
  const deleteCertification = async (certId) => {
    if (!certId) return;
    try {
      const res = await fetch(`${API}/api/certifications/${certId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete certification.");
      await loadCertifications();
      setCertificationMessage("Certification removed successfully!");
    } catch (error) {
      setCertificationMessage(error.message || "Failed to delete certification.");
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
    setRecycleBin([]);
    setProfileDropdownOpen(false);
    setProfileModalOpen(false);
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
        <div className="navbar-left">
          <div
            className="logo"
            onClick={handleNavHome}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleNavHome();
              }
            }}
            aria-label="Go to home page"
          >
            <span>✦</span> Career Skill Gap Analyzer
          </div>
        </div>

        <div className="nav-links">
          {userId() ? (
            <div className="profile-dropdown-container">
              <button
                type="button"
                className="nav-profile-btn"
                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                title="Account Menu"
                aria-expanded={profileDropdownOpen}
              >
                <StudentAvatar size={34} />
                <span className="nav-profile-roll">{studentId || "24eg107e54"}</span>
                <span className={`nav-profile-chevron ${profileDropdownOpen ? "open" : ""}`}>▾</span>
              </button>

              {profileDropdownOpen && (
                <div className="profile-dropdown-card" onClick={(e) => e.stopPropagation()}>
                  <div
                    className="profile-dropdown-header"
                    onClick={handleOpenProfileModal}
                    title="Click to view full profile"
                  >
                    <StudentAvatar size={46} />
                    <div className="profile-dropdown-user-info">
                      <div className="profile-dropdown-id">{studentId || "24eg107e54"}</div>
                      <div className="profile-dropdown-name">{currentUserName || "Student"}</div>
                      <div className="profile-dropdown-email">{currentUserEmail || "student@anurag.edu.in"}</div>
                    </div>
                  </div>

                  <div className="profile-dropdown-divider" />

                  <div className="profile-dropdown-menu">
                    <div
                      className="profile-menu-item"
                      role="button"
                      tabIndex={0}
                      onClick={handleOpenProfileModal}
                      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleOpenProfileModal()}
                    >
                      <span className="profile-menu-icon">👤</span>
                      <span className="profile-menu-label">My Profile</span>
                      <span className="profile-menu-hint">View details</span>
                    </div>

                    <div
                      className={`profile-menu-item ${page === "home" ? "active" : ""}`}
                      role="button"
                      tabIndex={0}
                      onClick={handleNavHome}
                      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleNavHome()}
                    >
                      <span className="profile-menu-icon">🏠</span>
                      <span className="profile-menu-label">Home</span>
                    </div>

                    <div
                      className="profile-menu-item"
                      role="button"
                      tabIndex={0}
                      onClick={handleNavFeatures}
                      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleNavFeatures()}
                    >
                      <span className="profile-menu-icon">⚡</span>
                      <span className="profile-menu-label">Features</span>
                    </div>

                    <div
                      className="profile-menu-item"
                      role="button"
                      tabIndex={0}
                      onClick={handleNavAbout}
                      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleNavAbout()}
                    >
                      <span className="profile-menu-icon">ℹ️</span>
                      <span className="profile-menu-label">About</span>
                    </div>

                    <div
                      className={`profile-menu-item ${page === "dashboard" ? "active" : ""}`}
                      role="button"
                      tabIndex={0}
                      onClick={handleNavDashboard}
                      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleNavDashboard()}
                    >
                      <span className="profile-menu-icon">📊</span>
                      <span className="profile-menu-label">Dashboard</span>
                    </div>

                    <div
                      className={`profile-menu-item ${page === "recycleBin" ? "active" : ""}`}
                      role="button"
                      tabIndex={0}
                      onClick={handleNavRecycleBin}
                      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleNavRecycleBin()}
                    >
                      <span className="profile-menu-icon">🗑️</span>
                      <span className="profile-menu-label">Bin</span>
                      {recycleBin.length > 0 && (
                        <span className="profile-menu-badge">{recycleBin.length}</span>
                      )}
                    </div>

                    <div
                      className="profile-menu-item"
                      role="button"
                      tabIndex={0}
                      onClick={toggleTheme}
                      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && toggleTheme()}
                    >
                      <span className="profile-menu-icon">{theme === "light" ? "🌙" : "☀️"}</span>
                      <span className="profile-menu-label">Theme: {theme === "light" ? "Light" : "Dark"}</span>
                      <span className="profile-menu-hint">Toggle</span>
                    </div>
                  </div>

                  <div className="profile-dropdown-divider" />

                  <div className="profile-dropdown-footer">
                    <button
                      type="button"
                      className="profile-dropdown-signout"
                      onClick={handleLogoutAction}
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <a href="#home" onClick={handleNavHome}>Home</a>
              <a href="#features" onClick={handleNavFeatures}>Features</a>
              <a href="#about" onClick={handleNavAbout}>About</a>
              {themeButton}
              <button
                type="button"
                className="login-button"
                onClick={() => {
                  setPage("login");
                  setMessage("");
                }}
              >
                Login
              </button>
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



            <div className="dashboard-header-buttons">
              <button
                type="button"
                className="secondary-button export-report-btn"
                onClick={() => window.print()}
              >
                📄 Print / Export Report (PDF)
              </button>
              <button
                type="button"
                className="logout-button"
                onClick={promptLogout}
              >
                Logout
              </button>
            </div>

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

          {/* Career Readiness Comparison Matrix */}
          <div className="career-comparison-section">
            <div className="dashboard-section-heading">
              <div>
                <h2>🎯 Career Readiness Comparison</h2>
                <p>See how your current skills match up against top career roles.</p>
              </div>
            </div>

            <div className="career-comparison-grid">
              {Object.entries(CAREER_PROFILES).map(([careerTitle, reqSkills]) => {
                const userSkillNames = savedSkills.map((s) => (s.skill || "").toLowerCase().trim());
                const matchedCount = reqSkills.filter((req) => userSkillNames.includes(req.toLowerCase().trim())).length;
                const matchPct = Math.round((matchedCount / reqSkills.length) * 100);
                const isSelected = (localStorage.getItem("targetCareer") || "") === careerTitle;

                return (
                  <div key={careerTitle} className={`career-match-card ${isSelected ? "selected-target" : ""}`}>
                    <div className="career-match-header">
                      <h4>
                        {careerTitle}
                        {isSelected && <span className="current-target-tag">Active Goal</span>}
                      </h4>
                      <span className={`match-badge ${matchPct >= 70 ? "high" : matchPct >= 40 ? "medium" : "low"}`}>
                        {matchPct}% Match
                      </span>
                    </div>

                    <div className="match-progress-bar">
                      <div className="match-progress-fill" style={{ width: `${matchPct}%` }} />
                    </div>

                    <p className="match-stats">
                      {matchedCount} of {reqSkills.length} required skills in your profile
                    </p>

                    <button
                      type="button"
                      className="secondary-button switch-career-btn"
                      onClick={async () => {
                        setCareerName(careerTitle);
                        localStorage.setItem("targetCareer", careerTitle);
                        try {
                          await fetch(`${API}/api/careers`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ careerName: careerTitle, userId: Number(userId()) }),
                          });
                        } catch (_) {}
                        await loadSkillGaps();
                        setPage("skillgap");
                      }}
                    >
                      {isSelected ? "View Skill Gap →" : "Target This Career →"}
                    </button>
                  </div>
                );
              })}
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

            <div
              className="feature-card recycle-dashboard-card"
              onClick={() => {
                setPage("recycleBin");
                setRecycleMessage("");
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setPage("recycleBin");
                  setRecycleMessage("");
                }
              }}
            >
              <div className="feature-icon">🗑️</div>
              <h3>Recycle Bin</h3>
              <p>
                {recycleBin.length > 0
                  ? `${recycleBin.length} deleted item(s) preserved.`
                  : "View and restore deleted skills & records."}
              </p>
              <span className="card-action">Manage bin →</span>
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



          <div className="section-toolbar">
            <div className="section-toolbar-left">
              <h2>Your Saved Education</h2>
              <span className="section-count-badge">
                {educationRecords.length} record(s)
              </span>
            </div>

            <div className="section-toolbar-right">
              <button
                type="button"
                className="secondary-button"
                onClick={loadEducation}
              >
                {educationLoading ? "Refreshing..." : "↻ Refresh"}
              </button>

              <div className="view-mode-toggle" role="group" aria-label="View mode">
                <button
                  type="button"
                  className={`view-toggle-btn ${educationViewMode === "grid" ? "active" : ""}`}
                  onClick={() => setEducationViewMode("grid")}
                  title="Grid View"
                >
                  ⊞ Grid
                </button>
                <button
                  type="button"
                  className={`view-toggle-btn ${educationViewMode === "list" ? "active" : ""}`}
                  onClick={() => setEducationViewMode("list")}
                  title="List View"
                >
                  ☰ List
                </button>
              </div>
            </div>
          </div>

          {educationLoading ? (
            <p>Loading education records...</p>
          ) : educationRecords.length > 0 ? (
            educationViewMode === "grid" ? (
              <div className="feature-grid">
                {educationRecords.map((record) => (
                  <div className="feature-card education-card-with-delete" key={record.id}>
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
                    {record.id && (
                      <button
                        type="button"
                        className="delete-skill-btn"
                        onClick={() => promptDeleteEducation(record)}
                        title="Remove education record"
                        aria-label={`Delete education record ${record.degree}`}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="feature-table-wrapper">
                <table className="feature-table">
                  <thead>
                    <tr>
                      <th>Degree</th>
                      <th>College / Institution</th>
                      <th>Specialization</th>
                      <th>Graduation Year</th>
                      <th style={{ textAlign: "right" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {educationRecords.map((record) => (
                      <tr key={record.id}>
                        <td className="table-title-cell">
                          <span className="table-cell-icon">🎓</span>
                          <strong>{record.degree}</strong>
                        </td>
                        <td>{record.college}</td>
                        <td>{record.specialization || "—"}</td>
                        <td>{record.graduationYear}</td>
                        <td style={{ textAlign: "right" }}>
                          {record.id && (
                            <button
                              type="button"
                              className="table-delete-btn"
                              onClick={() => promptDeleteEducation(record)}
                              title="Delete education record"
                              aria-label={`Delete ${record.degree}`}
                            >
                              ✕ Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
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

          <div className="quick-skills-section">
            <p className="quick-skills-title">⚡ Suggested Skills (Click to add instantly):</p>
            <div className="quick-skills-pills">
              {POPULAR_SKILLS.filter(
                (p) => !savedSkills.some((s) => (s.skill || "").toLowerCase().trim() === p.toLowerCase().trim())
              ).slice(0, 14).map((p) => (
                <button
                  key={p}
                  type="button"
                  className="quick-skill-pill"
                  onClick={() => quickAddSkill(p)}
                >
                  + {p}
                </button>
              ))}
            </div>
          </div>

          <div className="section-toolbar">
            <div className="section-toolbar-left">
              <h2>Your Saved Technical Skills</h2>
              <span className="section-count-badge">
                {savedSkills.length} skill(s) saved
              </span>
            </div>

            <div className="section-toolbar-right">
              <button
                type="button"
                className="secondary-button"
                onClick={loadSkills}
                disabled={skillsLoading}
              >
                {skillsLoading ? "Refreshing..." : "↻ Refresh Skills"}
              </button>

              <div className="view-mode-toggle" role="group" aria-label="View mode">
                <button
                  type="button"
                  className={`view-toggle-btn ${skillsViewMode === "grid" ? "active" : ""}`}
                  onClick={() => setSkillsViewMode("grid")}
                  title="Grid View"
                >
                  ⊞ Grid
                </button>
                <button
                  type="button"
                  className={`view-toggle-btn ${skillsViewMode === "list" ? "active" : ""}`}
                  onClick={() => setSkillsViewMode("list")}
                  title="List View"
                >
                  ☰ List
                </button>
              </div>
            </div>
          </div>

          {skillsLoading ? (
            <p>Loading technical skills...</p>
          ) : savedSkills.length > 0 ? (
            skillsViewMode === "grid" ? (
              <div className="feature-grid">
                {savedSkills.map((item, index) => (
                  <div
                    className="feature-card skill-card-with-delete"
                    key={item.id ?? index}
                  >
                    <div className="feature-icon">💻</div>
                    <h3>{item.skill}</h3>
                    {item.id && (
                      <button
                        type="button"
                        className="delete-skill-btn"
                        onClick={() => promptDeleteSkill(item)}
                        title="Remove skill"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="feature-table-wrapper">
                <table className="feature-table">
                  <thead>
                    <tr>
                      <th>Technical Skill</th>
                      <th>Proficiency / Status</th>
                      <th style={{ textAlign: "right" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {savedSkills.map((item, index) => (
                      <tr key={item.id ?? index}>
                        <td className="table-title-cell">
                          <span className="table-cell-icon">💻</span>
                          <strong>{item.skill}</strong>
                        </td>
                        <td>
                          <span className="table-pill proficiency-pill">
                            {item.proficiencyLevel || "Proficient"}
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          {item.id && (
                            <button
                              type="button"
                              className="table-delete-btn"
                              onClick={() => promptDeleteSkill(item)}
                              title="Delete skill"
                              aria-label={`Delete ${item.skill}`}
                            >
                              ✕ Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
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



            <div className="skill-gap-btn-row">
              <button
                type="button"
                className="login-button"
                onClick={loadSkillGaps}
              >
                Refresh Skill Gap Analysis
              </button>
              <button
                type="button"
                className="secondary-button export-report-btn"
                onClick={() => window.print()}
              >
                📄 Print / Export Report (PDF)
              </button>
            </div>



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
            apiBase={API}
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

              <div className="section-toolbar">
                <div className="section-toolbar-left">
                  <h2>Saved Projects</h2>
                  <span className="section-count-badge">
                    {savedProjects.length} project(s)
                  </span>
                </div>

                <div className="section-toolbar-right">
                  <div className="view-mode-toggle" role="group" aria-label="View mode">
                    <button
                      type="button"
                      className={`view-toggle-btn ${projectsViewMode === "grid" ? "active" : ""}`}
                      onClick={() => setProjectsViewMode("grid")}
                      title="Grid View"
                    >
                      ⊞ Grid
                    </button>
                    <button
                      type="button"
                      className={`view-toggle-btn ${projectsViewMode === "list" ? "active" : ""}`}
                      onClick={() => setProjectsViewMode("list")}
                      title="List View"
                    >
                      ☰ List
                    </button>
                  </div>
                </div>
              </div>

              {savedProjects.length > 0 ? (
                projectsViewMode === "grid" ? (
                  <div className="feature-grid">
                    {savedProjects.map((project, index) => (
                      <div
                        className="feature-card"
                        key={project.id ?? index}
                      >
                        <div className="feature-icon">📁</div>
                        <h3>{project.projectName}</h3>
                        <p>{project.description}</p>

                        <div className="project-card-actions">
                          <button
                            type="button"
                            className="login-button"
                            onClick={() => setSelectedProject(project)}
                          >
                            Open
                          </button>
                          {project.id && (
                            <button
                              type="button"
                              className="secondary-button delete-card-btn"
                              onClick={() => promptDeleteProject(project)}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="feature-table-wrapper">
                    <table className="feature-table">
                      <thead>
                        <tr>
                          <th>Project Title</th>
                          <th>Technologies</th>
                          <th>Overview</th>
                          <th style={{ textAlign: "right" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {savedProjects.map((project, index) => (
                          <tr key={project.id ?? index}>
                            <td className="table-title-cell">
                              <span className="table-cell-icon">📁</span>
                              <strong>{project.projectName}</strong>
                            </td>
                            <td>
                              <div className="table-tech-tags">
                                {(project.technologies || "")
                                  .split(",")
                                  .map((t) => t.trim())
                                  .filter(Boolean)
                                  .map((t, i) => (
                                    <span key={i} className="table-pill tech-pill">
                                      {t}
                                    </span>
                                  ))}
                              </div>
                            </td>
                            <td className="table-desc-cell">{project.description}</td>
                            <td style={{ textAlign: "right" }}>
                              <div className="table-action-group">
                                <button
                                  type="button"
                                  className="table-open-btn"
                                  onClick={() => setSelectedProject(project)}
                                >
                                  Open
                                </button>
                                {project.id && (
                                  <button
                                    type="button"
                                    className="table-delete-btn"
                                    onClick={() => promptDeleteProject(project)}
                                    title="Delete project"
                                  >
                                    ✕ Delete
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              ) : (
                <div className="feature-card">
                  <div className="feature-icon">📁</div>
                  <h3>No Projects Saved</h3>
                  <p>Your saved projects will appear here.</p>
                </div>
              )}
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

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="button"
                    className="secondary-button delete-card-btn"
                    onClick={() => {
                      promptDeleteProject(selectedProject);
                      setSelectedProject(null);
                    }}
                  >
                    Delete Project
                  </button>
                  <button
                    type="button"
                    className="project-back-button"
                    onClick={() => setSelectedProject(null)}
                  >
                    ← Back to Projects
                  </button>
                </div>
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

          <div className="section-toolbar">
            <div className="section-toolbar-left">
              <h2>Your Saved Certificates</h2>
              <span className="section-count-badge">
                {certifications.length} certificate(s) saved
              </span>
            </div>

            <div className="section-toolbar-right">
              <button
                type="button"
                className="secondary-button"
                onClick={loadCertifications}
                disabled={certificationsLoading}
              >
                {certificationsLoading ? "Refreshing..." : "↻ Refresh"}
              </button>

              <div className="view-mode-toggle" role="group" aria-label="View mode">
                <button
                  type="button"
                  className={`view-toggle-btn ${certificationsViewMode === "grid" ? "active" : ""}`}
                  onClick={() => setCertificationsViewMode("grid")}
                  title="Grid View"
                >
                  ⊞ Grid
                </button>
                <button
                  type="button"
                  className={`view-toggle-btn ${certificationsViewMode === "list" ? "active" : ""}`}
                  onClick={() => setCertificationsViewMode("list")}
                  title="List View"
                >
                  ☰ List
                </button>
              </div>
            </div>
          </div>

          {certificationsLoading ? (
            <p>Loading certifications...</p>
          ) : certifications.length > 0 ? (
            certificationsViewMode === "grid" ? (
              <div className="feature-grid">
                {certifications.map((cert, index) => (
                  <div className="feature-card cert-card-with-delete" key={cert.id ?? index}>
                    <div className="feature-icon">📜</div>
                    <h3>{cert.certificationName}</h3>

                    <p>
                      <strong>Issuing Organization:</strong>{" "}
                      {cert.issuingOrganization}
                    </p>

                    <p>
                      <strong>Issue Year:</strong> {cert.issueYear}
                    </p>

                    {cert.id && (
                      <button
                        type="button"
                        className="delete-skill-btn"
                        onClick={() => promptDeleteCertification(cert)}
                        title="Remove certification"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="feature-table-wrapper">
                <table className="feature-table">
                  <thead>
                    <tr>
                      <th>Certificate Name</th>
                      <th>Issuing Organization</th>
                      <th>Issue Year</th>
                      <th style={{ textAlign: "right" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {certifications.map((cert, index) => (
                      <tr key={cert.id ?? index}>
                        <td className="table-title-cell">
                          <span className="table-cell-icon">📜</span>
                          <strong>{cert.certificationName}</strong>
                        </td>
                        <td>{cert.issuingOrganization}</td>
                        <td>{cert.issueYear}</td>
                        <td style={{ textAlign: "right" }}>
                          {cert.id && (
                            <button
                              type="button"
                              className="table-delete-btn"
                              onClick={() => promptDeleteCertification(cert)}
                              title="Delete certification"
                              aria-label={`Delete ${cert.certificationName}`}
                            >
                              ✕ Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
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

      {/* RECYCLE BIN */}
      {page === "recycleBin" && (
        <section className="dashboard recycle-bin-page">
          <div className="recycle-page-header">
            <div className="recycle-header-info">
              <p className="dashboard-sub">DELETION & RECOVERY VAULT</p>
              <h1>🗑️ Recycle Bin</h1>
              <p className="recycle-header-desc">
                Safely manage, filter, and restore accidentally deleted skills,
                projects, certifications, and educational records.
              </p>
            </div>

            <div className="recycle-header-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={goToDashboard}
              >
                ← Back to Dashboard
              </button>
              {recycleBin.length > 0 && (
                <button
                  type="button"
                  className="danger-outline-button"
                  onClick={promptEmptyBin}
                  title="Empty all items in the Recycle Bin"
                >
                  🗑️ Empty Entire Bin
                </button>
              )}
            </div>
          </div>

          {recycleMessage && (
            <div className="recycle-status-banner" role="status">
              <span>{recycleMessage}</span>
              <button
                type="button"
                className="close-banner-btn"
                onClick={() => setRecycleMessage("")}
                aria-label="Dismiss message"
              >
                ✕
              </button>
            </div>
          )}

          {/* Filter and View Controls */}
          <div className="recycle-filter-bar">
            <div className="recycle-search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search title, tech stack, organization..."
                value={recycleSearch}
                onChange={(e) => setRecycleSearch(e.target.value)}
                aria-label="Search deleted items"
              />
              {recycleSearch && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => setRecycleSearch("")}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="recycle-filters-group">
              <div className="filter-item">
                <label htmlFor="recycle-type-select">Type:</label>
                <select
                  id="recycle-type-select"
                  value={recycleTypeFilter}
                  onChange={(e) => setRecycleTypeFilter(e.target.value)}
                >
                  <option value="all">All Types ({recycleBin.length})</option>
                  <option value="Technical Skill">
                    Technical Skills (
                    {recycleBin.filter((i) => i.type === "Technical Skill").length}
                    )
                  </option>
                  <option value="Project">
                    Projects (
                    {recycleBin.filter((i) => i.type === "Project").length}
                    )
                  </option>
                  <option value="Certification">
                    Certifications (
                    {recycleBin.filter((i) => i.type === "Certification").length}
                    )
                  </option>
                  <option value="Education">
                    Education (
                    {recycleBin.filter((i) => i.type === "Education").length}
                    )
                  </option>
                </select>
              </div>

              <div className="filter-item">
                <label htmlFor="recycle-date-select">Deleted:</label>
                <select
                  id="recycle-date-select"
                  value={recycleDateFilter}
                  onChange={(e) => setRecycleDateFilter(e.target.value)}
                >
                  <option value="all">All Dates</option>
                  <option value="today">Today</option>
                  <option value="week">Past 7 Days</option>
                  <option value="month">This Month</option>
                </select>
              </div>

              <div className="view-mode-toggle" role="group" aria-label="View mode">
                <button
                  type="button"
                  className={`view-toggle-btn ${recycleViewMode === "grid" ? "active" : ""}`}
                  onClick={() => setRecycleViewMode("grid")}
                  title="Grid View"
                >
                  ⊞ Grid
                </button>
                <button
                  type="button"
                  className={`view-toggle-btn ${recycleViewMode === "list" ? "active" : ""}`}
                  onClick={() => setRecycleViewMode("list")}
                  title="List / Table View"
                >
                  ☰ List
                </button>
              </div>
            </div>
          </div>

          <div className="recycle-summary-bar">
            <span>
              Showing <strong>{filteredRecycleItems.length}</strong> of{" "}
              <strong>{recycleBin.length}</strong> deleted item(s)
            </span>
          </div>

          {filteredRecycleItems.length === 0 ? (
            <div className="recycle-empty-card">
              <div className="recycle-empty-icon">
                {recycleBin.length === 0 ? "🎉" : "🔍"}
              </div>
              <h3>
                {recycleBin.length === 0
                  ? "Recycle Bin is Empty"
                  : "No Matching Items Found"}
              </h3>
              <p>
                {recycleBin.length === 0
                  ? "Items deleted from Technical Skills, Projects, Certifications, or Education will appear here and can be restored anytime."
                  : "Try clearing your search query or switching filters to view other deleted items."}
              </p>
              {recycleBin.length > 0 && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => {
                    setRecycleSearch("");
                    setRecycleTypeFilter("all");
                    setRecycleDateFilter("all");
                  }}
                >
                  Reset Filters
                </button>
              )}
            </div>
          ) : recycleViewMode === "grid" ? (
            <div className="recycle-grid">
              {filteredRecycleItems.map((item) => (
                <div className="recycle-card" key={item.binId}>
                  <div className="recycle-card-header">
                    <span className={`recycle-type-pill type-${item.type.replace(/\s+/g, "").toLowerCase()}`}>
                      {item.type === "Technical Skill" && "💻 "}
                      {item.type === "Project" && "📁 "}
                      {item.type === "Certification" && "📜 "}
                      {item.type === "Education" && "🎓 "}
                      {item.type}
                    </span>
                    <span className="recycle-timestamp">
                      {new Date(item.deletedAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <h3 className="recycle-card-title">{item.title}</h3>
                  <p className="recycle-card-details">{item.details}</p>

                  <div className="recycle-card-actions">
                    <button
                      type="button"
                      className="restore-btn"
                      onClick={() => restoreFromRecycleBin(item)}
                      title="Restore back to active profile"
                    >
                      ↺ Restore
                    </button>
                    <button
                      type="button"
                      className="perm-delete-btn"
                      onClick={() => promptPermanentDelete(item)}
                      title="Delete permanently"
                    >
                      ✕ Permanent Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="recycle-table-wrapper">
              <table className="recycle-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Title</th>
                    <th>Details</th>
                    <th>Deleted At</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecycleItems.map((item) => (
                    <tr key={item.binId}>
                      <td>
                        <span className={`recycle-type-pill type-${item.type.replace(/\s+/g, "").toLowerCase()}`}>
                          {item.type === "Technical Skill" && "💻 "}
                          {item.type === "Project" && "📁 "}
                          {item.type === "Certification" && "📜 "}
                          {item.type === "Education" && "🎓 "}
                          {item.type}
                        </span>
                      </td>
                      <td className="recycle-table-title">{item.title}</td>
                      <td className="recycle-table-details">{item.details}</td>
                      <td className="recycle-table-date">
                        {new Date(item.deletedAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td>
                        <div className="recycle-row-actions">
                          <button
                            type="button"
                            className="restore-btn-sm"
                            onClick={() => restoreFromRecycleBin(item)}
                            title="Restore back to profile"
                          >
                            ↺ Restore
                          </button>
                          <button
                            type="button"
                            className="perm-delete-btn-sm"
                            onClick={() => promptPermanentDelete(item)}
                            title="Delete permanently"
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div style={{ marginTop: "24px" }}>
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

            {message && (
              <div className="auth-alert-box" role="alert">
                <p className="auth-alert-text">{message}</p>
                {page === "login" &&
                  (message.includes("register") ||
                    message.includes("create an account") ||
                    message.includes("Account not found")) && (
                    <button
                      type="button"
                      className="inline-register-btn"
                      onClick={() => {
                        setPage("register");
                        setMessage("");
                      }}
                    >
                      ✨ Create Account / Register Here →
                    </button>
                  )}
              </div>
            )}

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

      {/* Interactive Confirmation Modal */}
      {confirmModal.isOpen && (
        <div
          className="modal-backdrop"
          onClick={closeConfirmModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-modal-title"
        >
          <div
            className="confirm-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`confirm-modal-icon ${
                confirmModal.isDanger ? "danger-icon" : "warning-icon"
              }`}
            >
              {confirmModal.isDanger ? "🗑️" : "🚪"}
            </div>
            <h2 id="confirm-modal-title" className="confirm-modal-title">
              {confirmModal.title}
            </h2>
            <p className="confirm-modal-message">{confirmModal.message}</p>
            <div className="confirm-modal-actions">
              <button
                type="button"
                className="secondary-button modal-cancel-btn"
                onClick={closeConfirmModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`login-button ${
                  confirmModal.isDanger
                    ? "danger-confirm-btn"
                    : "warning-confirm-btn"
                }`}
                onClick={handleExecuteConfirm}
              >
                {confirmModal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Profile Modal */}
      {profileModalOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setProfileModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="profile-modal-title"
        >
          <div
            className="profile-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="profile-modal-header-banner">
              <span className="profile-modal-univ-tag">🏛️ ANURAG UNIVERSITY</span>
              <button
                type="button"
                className="profile-modal-close"
                onClick={() => setProfileModalOpen(false)}
                title="Close Profile"
              >
                ✕
              </button>
            </div>

            <div className="profile-modal-user-header">
              <div className="profile-modal-avatar-wrapper">
                <StudentAvatar size={74} />
              </div>
              <div className="profile-modal-user-titles">
                <h2 id="profile-modal-title" className="profile-modal-name">
                  {currentUserName || "Student"}
                </h2>
                <div className="profile-modal-id-badge">
                  ROLL NO: <strong>{studentId || "24eg107e54"}</strong>
                </div>
                <div className="profile-modal-email-text">
                  {currentUserEmail || "student@anurag.edu.in"}
                </div>
              </div>
            </div>

            {/* Profile info cards */}
            <div className="profile-modal-card">
              <div className="profile-card-header">
                <span className="profile-card-title">Student Information</span>
                {!isEditingProfile ? (
                  <button
                    type="button"
                    className="profile-edit-toggle-btn"
                    onClick={() => {
                      setEditStudentIdInput(studentId);
                      setEditUserNameInput(currentUserName);
                      setIsEditingProfile(true);
                    }}
                  >
                    ✏️ Edit
                  </button>
                ) : (
                  <button
                    type="button"
                    className="profile-edit-toggle-btn save-btn"
                    onClick={handleSaveProfile}
                  >
                    💾 Save
                  </button>
                )}
              </div>

              {isEditingProfile ? (
                <div className="profile-edit-form">
                  <div className="profile-field-group">
                    <label>Student Roll Number</label>
                    <input
                      type="text"
                      value={editStudentIdInput}
                      onChange={(e) => setEditStudentIdInput(e.target.value)}
                      placeholder="e.g. 24eg107e54"
                    />
                  </div>
                  <div className="profile-field-group">
                    <label>Student Full Name</label>
                    <input
                      type="text"
                      value={editUserNameInput}
                      onChange={(e) => setEditUserNameInput(e.target.value)}
                      placeholder="e.g. Bhanu"
                    />
                  </div>
                </div>
              ) : (
                <div className="profile-info-grid">
                  <div className="profile-info-item">
                    <span className="profile-info-label">Roll Number:</span>
                    <span className="profile-info-val bold-val">{studentId || "24eg107e54"}</span>
                  </div>
                  <div className="profile-info-item">
                    <span className="profile-info-label">Full Name:</span>
                    <span className="profile-info-val">{currentUserName || "Student"}</span>
                  </div>
                  <div className="profile-info-item">
                    <span className="profile-info-label">Institution:</span>
                    <span className="profile-info-val">Anurag University</span>
                  </div>
                  <div className="profile-info-item">
                    <span className="profile-info-label">Target Career:</span>
                    <span className="profile-info-val career-val">
                      {careerName || localStorage.getItem("targetCareer") || "Not selected"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Academic & Skill Inventory Stats */}
            <div className="profile-modal-card">
              <div className="profile-card-header">
                <span className="profile-card-title">Academic & Skill Inventory</span>
              </div>
              <div className="profile-stats-grid">
                <div className="profile-stat-tile">
                  <span className="profile-tile-emoji">💻</span>
                  <span className="profile-tile-num">{savedSkills.length}</span>
                  <span className="profile-tile-label">Skills Added</span>
                </div>
                <div className="profile-stat-tile">
                  <span className="profile-tile-emoji">🚀</span>
                  <span className="profile-tile-num">{savedProjects.length}</span>
                  <span className="profile-tile-label">Projects</span>
                </div>
                <div className="profile-stat-tile">
                  <span className="profile-tile-emoji">🎓</span>
                  <span className="profile-tile-num">{educationRecords.length}</span>
                  <span className="profile-tile-label">Education</span>
                </div>
                <div className="profile-stat-tile">
                  <span className="profile-tile-emoji">🏆</span>
                  <span className="profile-tile-num">{certifications.length}</span>
                  <span className="profile-tile-label">Certificates</span>
                </div>
                <div className="profile-stat-tile">
                  <span className="profile-tile-emoji">🗑️</span>
                  <span className="profile-tile-num">{recycleBin.length}</span>
                  <span className="profile-tile-label">Bin Items</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="profile-modal-footer">
              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  setProfileModalOpen(false);
                  goToDashboard();
                }}
              >
                📊 Dashboard
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  setProfileModalOpen(false);
                  setPage("recycleBin");
                }}
              >
                🗑️ Recycle Bin ({recycleBin.length})
              </button>
              <button
                type="button"
                className="login-button"
                onClick={() => setProfileModalOpen(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
