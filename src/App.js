import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaEnvelope, FaGithub, FaLinkedin, FaChevronDown,
  FaUser, FaGraduationCap, FaCogs, FaBriefcase,
  FaProjectDiagram, FaComments, FaServicestack, FaPhone,
  FaCode, FaDatabase, FaChartBar, FaCloud, FaBrain, FaLanguage, FaRobot, FaEye,
  FaExternalLinkAlt, FaTimes, FaCalendarAlt, FaClock
} from "react-icons/fa";
import { FaKaggle } from "react-icons/fa";
import ReactMarkdown from "react-markdown";

/* ---------- SkillAccordion (controlled) ---------- */
function SkillAccordion({ category, skills, isOpen, onToggle, index }) {
  return (
    <div className="mb-4 border rounded-lg shadow">
      <button
        onClick={() => onToggle(index)}
        className="w-full flex justify-between items-center px-4 py-3 text-lg font-semibold hover:bg-[#DED8CD] text-[#282824]"
        aria-expanded={isOpen}
        aria-controls={`skills-panel-${index}`}
      >
        {category}
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <FaChevronDown />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`skills-panel-${index}`}
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="overflow-hidden px-4 md:px-6 pb-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              {skills.map((skill, i) => (
                <div
                  key={i}
                  className="text-[#282824] bg-[#E8E4DD] px-3 py-2 rounded-lg shadow-sm text-sm text-center"
                >
                  {skill}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ----------------- App (Portfolio) ----------------- */
export default function App() {
  const [isTop, setIsTop] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [openIndex, setOpenIndex] = useState(null);
  const [readmes, setReadmes] = useState({});
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectDescriptions, setProjectDescriptions] = useState({});

  useEffect(() => {
    const onScroll = () => setIsTop(window.scrollY <= window.innerHeight * 0.7);
    window.addEventListener("scroll", onScroll);

    const onClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, []);

  const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
  };

  const skillCategories = [
    { category: "Machine Learning", skills: ["Regression", "Classification", "Clustering", "Time Series", "Model Deployment"] },
    { category: "Deep Learning", skills: ["ANN", "Autoencoders", "Image Classification", "Computer Vision", "Transformers"] },
    { category: "NLP", skills: ["RNN", "LSTM", "Transformers", "Text Classification", "Chatbots"] },
    { category: "Data Science", skills: ["Data Collection / Mining", "Visualization (Power BI, Plotly, Matplotlib)", "Pandas, NumPy, SciKit-Learn"] },
    { category: "Tools & Cloud", skills: ["DevOps/MLOps: GitHub, MLflow", "Databases: SQL, MySQL", "Cloud: Microsoft Azure"] },
  ];

  const toggleAccordion = (i) => setOpenIndex(openIndex === i ? null : i);

  /* ---------------- Projects Data ---------------- */
  const projects = [
    { 
      title: "Research Paper Summarizer", 
      image: "/WhatsApp Image 2025-08-20 at 13.10.50_1edfd096.jpg", 
      repo: "mohamed-7oda/Research-Paper-Summarizer",
      shortDesc: "An AI-powered tool that summarizes complex research papers using advanced NLP techniques and transformer models.",
      readTime: "4 Min Read",
      tags: ["NLP", "AI", "Transformers"]
    },
    { 
      title: "Fashion MNIST Classifier", 
      image: "/fashion_mnist.png", 
      repo: "hishamx777/Fashion_Mnist",
      shortDesc: "Deep learning model for classifying fashion items using convolutional neural networks with high accuracy.",
      readTime: "2 Min Read",
      tags: ["Deep Learning", "CNN", "Computer Vision"]
    },
    { 
      title: "CV Analysis", 
      image: "/109QhUlm4EPWJ-Rkv3IGrRA.webp", 
      repo: "hishamx777/cv_analysis",
      shortDesc: "Computer vision application for analyzing and extracting information from resumes and CV documents automatically.",
      readTime: "3 Min Read",
      tags: ["Computer Vision", "NLP", "Automation"]
    },
  ];

  // دالة لاستخراج جزء من النص للوصف المختصر
  const extractShortDescription = (text) => {
    if (!text) return "No description available.";
    
    // إزالة علامات Markdown
    const plainText = text.replace(/#+|\[.*?\]\(.*?\)|\*+|\`+/g, '');
    
    // أخذ أول 150 حرف وإضافة نقاط إذا كان النص أطول
    return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
  };

  useEffect(() => {
    projects.forEach(async (proj) => {
      try {
        const res = await fetch(`https://raw.githubusercontent.com/${proj.repo}/main/README.md`);
        if (res.ok) {
          const text = await res.text();
          setReadmes((prev) => ({ ...prev, [proj.repo]: text }));
          setProjectDescriptions((prev) => ({ 
            ...prev, 
            [proj.repo]: extractShortDescription(text) 
          }));
        } else {
          const res2 = await fetch(`https://raw.githubusercontent.com/${proj.repo}/master/README.md`);
          if (res2.ok) {
            const text = await res2.text();
            setReadmes((prev) => ({ ...prev, [proj.repo]: text }));
            setProjectDescriptions((prev) => ({ 
              ...prev, 
              [proj.repo]: extractShortDescription(text) 
            }));
          } else {
            // إذا لم يتم العثور على README، استخدم الوصف المختصر الموجود في البيانات
            setProjectDescriptions((prev) => ({ 
              ...prev, 
              [proj.repo]: proj.shortDesc 
            }));
          }
        }
      } catch (err) {
        console.error("Error fetching README for", proj.repo, err);
        // إذا فشل جلب README، استخدم الوصف المختصر الموجود في البيانات
        setProjectDescriptions((prev) => ({ 
          ...prev, 
          [proj.repo]: proj.shortDesc 
        }));
      }
    });
  }, []);

  return (
    <div className="bg-[#EFECE6] text-[#282824] min-h-screen">
      {/* Navbar */}
      <motion.nav
        initial={false}
        animate={{
          backgroundColor: isTop ? "rgba(239,236,230,0)" : "#E8E4DD",
          boxShadow: isTop ? "none" : "0 2px 10px rgba(0,0,0,0.1)",
          justifyContent: isTop ? "center" : "space-between",
          padding: isTop ? "1rem 0" : "1rem 1rem",
        }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 w-full flex items-center z-50"
      >
        {!isTop && (
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-lg md:text-xl font-bold text-[#4A4A45] ml-2"
          >
            Hisham Mislhy
          </motion.h1>
        )}

        <div className="flex flex-wrap space-x-2 md:space-x-6 items-center font-medium text-sm md:text-base">
          <a href="#cover" className="hover:text-[#4A4A45] px-1 py-1">Home</a>
          <a href="#about" className="hover:text-[#4A4A45] px-1 py-1">About</a>
          <a href="#projects" className="hover:text-[#4A4A45] px-1 py-1">Projects</a>
          <a href="#contact" className="hover:text-[#4A4A45] px-1 py-1">Contact</a>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center hover:text-[#4A4A45] px-1 py-1"
            >
              More <FaChevronDown className="ml-1" />
            </button>
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  key="dropdown"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="absolute right-0 mt-2 bg-[#DED8CD] shadow-lg rounded-lg w-48 py-2 z-50"
                >
                  <a href="#education" className="block px-4 py-2 hover:bg-[#E8E4DD]">Education</a>
                  <a href="#skills" className="block px-4 py-2 hover:bg-[#E8E4DD]">Skills</a>
                  <a href="#experience" className="block px-4 py-2 hover:bg-[#E8E4DD]">Experience</a>
                  <a href="#testimonials" className="block px-4 py-2 hover:bg-[#E8E4DD]">Testimonials</a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.nav>

      {/* Cover */}
      <section
        id="cover"
        className="min-h-screen flex flex-col md:flex-row items-center justify-center pt-20 bg-gradient-to-r from-[#EFECE6] to-[#E8E4DD] px-4 scroll-mt-20"
      >
        <motion.div
          className="flex-1 p-4 md:p-10 flex flex-col justify-center text-center md:text-left"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <p className="text-base md:text-lg mb-2 text-[#4A4A45] font-semibold">
            Data Scientist | NLP & ML Engineer
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
            Hisham <span className="text-[#4A4A45]">Mislhy</span>
          </h1>
          <p className="text-[#4A4A45] text-base md:text-lg mb-6 max-w-lg mx-auto md:mx-0">
            Computer Science student and certified AI Specialist. Skilled in NLP,
            Machine Learning & Deep Learning, and passionate about building
            intelligent solutions.
          </p>
          <div className="flex justify-center md:justify-start space-x-4">
            <a
              href="mailto:h.mislhy.ai@gmail.com"
              className="p-3 bg-[#DED8CD] rounded-full hover:bg-[#4A4A45] hover:text-white transition"
            >
              <FaEnvelope />
            </a>
            <a
              href="https://github.com"
              className="p-3 bg-[#DED8CD] rounded-full hover:bg-[#4A4A45] hover:text-white transition"
            >
              <FaGithub />
            </a>
            <a
              href="https://linkedin.com/in/hisham-mislhy"
              className="p-3 bg-[#DED8CD] rounded-full hover:bg-[#4A4A45] hover:text-white transition"
            >
              <FaLinkedin />
            </a>
          </div>
        </motion.div>

        <motion.div
          className="flex-1 flex justify-center items-center p-4 md:p-6"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <img src="/profile.jpg" alt="Profile" className="w-full max-w-md h-auto md:h-[70vh] object-cover object-top rounded-2xl shadow-2xl" />
        </motion.div>
      </section>

      {/* About */}
      <motion.section
        id="about"
        className="min-h-screen p-6 md:p-10 pt-20 bg-[#EFECE6] scroll-mt-20"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Image */}
          <div className="flex justify-center order-2 md:order-1">
            <img
              src="/about.png"
              alt="About Illustration"
              className="rounded-2xl shadow-lg w-full max-w-sm border-4 border-[#DED8CD]"
            />
          </div>

          {/* Right Text */}
          <div className="text-left text-[#4A4A45] order-1 md:order-2">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 flex items-center gap-2">
              <span className="text-[#4A4A45]"><i className="inline"><FaUser /></i></span> About Me
            </h2>
            <p className="text-base md:text-lg leading-relaxed mb-4">
              Hello, I'm Hesham, but you can call me <i>"The Math Man."</i>
            </p>
            <p className="text-base md:text-lg leading-relaxed mb-4">
              In my twenties, I’m driven by a passion for innovation, creating new solutions, 
              and tackling problems no one else has been able to solve. 
              My ultimate goal is to invent advanced and groundbreaking technologies.
            </p>
            <p className="text-base md:text-lg leading-relaxed">
              So, if you’re looking for someone passionate about algorithms and engineering 
              innovations to revolutionize your factory’s production, or someone who can replace 
              your accountant with a faster and smarter machine, I’m the one you want.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Education & Training */}
      <motion.section
        id="education"
        className="min-h-screen p-6 md:p-10 pt-20 bg-[#EFECE6] scroll-mt-20 flex flex-col items-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        {/* العنوان */}
        <h2 className="text-3xl md:text-4xl font-bold mb-12 flex items-center justify-center gap-3 text-[#4A4A45]">
          <span className="text-[#4A4A45]"><FaGraduationCap /></span> Education & Training
        </h2>

        {/* Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-[80%]">
          
          {/* 1 - Bachelor */}
          <div className="bg-white shadow-lg rounded-2xl p-6 border border-[#DED8CD] hover:shadow-xl transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center bg-[#EFECE6] border-2 border-[#4A4A45] rounded-xl font-bold text-[#4A4A45]">
                1
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-[#4A4A45]">
                Bachelor’s in Computer Science – October 6 University
              </h3>
            </div>
            <p className="text-gray-600 text-sm md:text-base">
              Gained a solid foundation in software engineering and systems design, covering fundamental CS subjects such as algorithms, databases, object-oriented programming, and computer networks.
            </p>
          </div>

          {/* 2 - Summer Training */}
          <div className="bg-white shadow-lg rounded-2xl p-6 border border-[#DED8CD] hover:shadow-xl transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center bg-[#EFECE6] border-2 border-[#4A4A45] rounded-xl font-bold text-[#4A4A45]">
                2
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-[#4A4A45]">
                Summer Training Internship in NLP – NTI (120 hours)
              </h3>
            </div>
            <p className="text-gray-600 text-sm md:text-base">
              Hands-on experience with Python libraries (NLTK, spaCy, transformers) covering text preprocessing, tokenization, embeddings, and classification. Developed a mini-project on sentiment analysis and a simple Named Entity Recognition (NER) model.
            </p>
          </div>

          {/* 3 - AI Course */}
          <div className="bg-white shadow-lg rounded-2xl p-6 border border-[#DED8CD] hover:shadow-xl transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center bg-[#EFECE6] border-2 border-[#4A4A45] rounded-xl font-bold text-[#4A4A45]">
                3
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-[#4A4A45]">
                AI Course – NTI & Huawei (90 hours)
              </h3>
            </div>
            <p className="text-gray-600 text-sm md:text-base">
              Focused on the basics of machine learning and deep learning, including neural networks, Convolutional Neural Networks (CNNs), and essential training and evaluation methodologies. Completed a mini-project demonstrating image classification on a small dataset.
            </p>
          </div>

          {/* 4 - AI Diploma */}
          <div className="bg-white shadow-lg rounded-2xl p-6 border border-[#DED8CD] hover:shadow-xl transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center bg-[#EFECE6] border-2 border-[#4A4A45] rounded-xl font-bold text-[#4A4A45]">
                4
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-[#4A4A45]">
                AI Diploma – Instant (170 hours)
              </h3>
            </div>
            <p className="text-gray-600 text-sm md:text-base">
              An advanced program encompassing core ML, NLP, MLOops basics, and deployment strategies. Developed mini-projects including a Question-Answering system with RAG (Retrieval-Augmented Generation) and a CV Analysis tool for extracting information from resumes.
            </p>
          </div>
        </div>
      </motion.section>


      {/* Skills */}
      <motion.section
        id="skills"
        className="min-h-screen p-10 pt-20 bg-[#EFECE6] text-center"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold mb-12 flex items-center justify-center gap-2 text-[#4A4A45]">
          <FaCogs className="text-[#4A4A45]" /> Skills
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* بطاقة Programming Languages */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6 border border-[#DED8CD] hover:shadow-xl transition-all duration-300"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <FaCode className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-left text-[#4A4A45]">Programming Languages</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-[#EFECE6] text-[#4A4A45] rounded-full text-sm">Python</span>
              <span className="px-3 py-1 bg-[#EFECE6] text-[#4A4A45] rounded-full text-sm">C++</span>
            </div>
          </motion.div>

          {/* بطاقة Data Techniques */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6 border border-[#DED8CD] hover:shadow-xl transition-all duration-300"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <FaDatabase className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-left text-[#4A4A45]">Data Techniques</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-[#EFECE6] text-[#4A4A45] rounded-full text-sm">Data Collection</span>
              <span className="px-3 py-1 bg-[#EFECE6] text-[#4A4A45] rounded-full text-sm">Data Mining</span>
              <span className="px-3 py-1 bg-[#EFECE6] text-[#4A4A45] rounded-full text-sm">Data Preprocessing</span>
            </div>
          </motion.div>

          {/* بطاقة Data Visualization */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6 border border-[#DED8CD] hover:shadow-xl transition-all duration-300"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-purple-100 rounded-lg mr-4">
                <FaChartBar className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-left text-[#4A4A45]">Data Visualization</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-[#EFECE6] text-[#4A4A45] rounded-full text-sm">Power BI</span>
              <span className="px-3 py-1 bg-[#EFECE6] text-[#4A4A45] rounded-full text-sm">Plotly</span>
              <span className="px-3 py-1 bg-[#EFECE6] text-[#4A4A45] rounded-full text-sm">Matplotlib</span>
              <span className="px-3 py-1 bg-[#EFECE6] text-[#4A4A45] rounded-full text-sm">Seaborn</span>
            </div>
          </motion.div>

          {/* بطاقة DevOps & MLOps Tools */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6 border border-[#DED8CD] hover:shadow-xl transition-all duration-300"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-red-100 rounded-lg mr-4">
                <FaCloud className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-left text-[#4A4A45]">DevOps & MLOps Tools</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-[#EFECE6] text-[#4A4A45] rounded-full text-sm">GitHub</span>
              <span className="px-3 py-1 bg-[#EFECE6] text-[#4A4A45] rounded-full text-sm">Git</span>
              <span className="px-3 py-1 bg-[#EFECE6] text-[#4A4A45] rounded-full text-sm">MLflow</span>
            </div>
          </motion.div>

          {/* بطاقة Deep Learning */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6 border border-[#DED8CD] hover:shadow-xl transition-all duration-300"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-indigo-100 rounded-lg mr-4">
                <FaBrain className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-left text-[#4A4A45]">Deep Learning</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-[#EFECE6] text-[#4A4A45] rounded-full text-sm">Image Classification</span>
              <span className="px-3 py-1 bg-[#EFECE6] text-[#4A4A45] rounded-full text-sm">ANN</span>
              <span className="px-3 py-1 bg-[#EFECE6] text-[#4A4A45] rounded-full text-sm">Autoencoders</span>
            </div>
          </motion.div>

          {/* بطاقة NLP */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6 border border-[#DED8CD] hover:shadow-xl transition-all duration-300"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-pink-100 rounded-lg mr-4">
                <FaLanguage className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-left text-[#4A4A45]">NLP</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-[#EFECE6] text-[#4A4A45] rounded-full text-sm">RNN</span>
              <span className="px-3 py-1 bg-[#EFECE6] text-[#4A4A45] rounded-full text-sm">LSTM</span>
              <span className="px-3 py-1 bg-[#EFECE6] text-[#4A4A45] rounded-full text-sm">Classification</span>
              <span className="px-3 py-1 bg-[#EFECE6] text-[#4A4A45] rounded-full text-sm">Transformers</span>
            </div>
          </motion.div>

          {/* بطاقة Databases */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6 border border-[#DED8CD] hover:shadow-xl transition-all duration-300"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg mr-4">
                <FaDatabase className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-left text-[#4A4A45]">Databases</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-[#EFECE6] text-[#4A4A45] rounded-full text-sm">SQL</span>
              <span className="px-3 py-1 bg-[#EFECE6] text-[#4A4A45] rounded-full text-sm">MySQL</span>
            </div>
          </motion.div>

          {/* بطاقة Data Analysis & Manipulation */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6 border border-[#DED8CD] hover:shadow-xl transition-all duration-300"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-teal-100 rounded-lg mr-4">
                <FaChartBar className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-left text-[#4A4A45]">Data Analysis & Manipulation</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-[#EFECE6] text-[#4A4A45] rounded-full text-sm">Pandas</span>
              <span className="px-3 py-1 bg-[#EFECE6] text-[#4A4A45] rounded-full text-sm">Pandas AI</span>
              <span className="px-3 py-1 bg-[#EFECE6] text-[#4A4A45] rounded-full text-sm">Scikit-Learn</span>
              <span className="px-3 py-1 bg-[#EFECE6] text-[#4A4A45] rounded-full text-sm">NumPy</span>
              <span className="px-3 py-1 bg-[#EFECE6] text-[#4A4A45] rounded-full text-sm">SciPy</span>
              <span className="px-3 py-1 bg-[#EFECE6] text-[#4A4A45] rounded-full text-sm">Excel</span>
            </div>
          </motion.div>

          {/* بطاقة AI & Machine Learning Frameworks */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6 border border-[#DED8CD] hover:shadow-xl transition-all duration-300"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-orange-100 rounded-lg mr-4">
                <FaRobot className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-left text-[#4A4A45]">AI & ML Frameworks</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-[#EFECE6] text-[#4A4A45] rounded-full text-sm">TensorFlow</span>
              <span className="px-3 py-1 bg-[#EFECE6] text-[#4A4A45] rounded-full text-sm">Keras</span>
              <span className="px-3 py-1 bg-[#EFECE6] text-[#4A4A45] rounded-full text-sm">PyTorch</span>
            </div>
          </motion.div>

          {/* بطاقة Machine Learning */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6 border border-[#DED8CD] hover:shadow-xl transition-all duration-300"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <FaBrain className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-left text-[#4A4A45]">Machine Learning</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-[#EFECE6] text-[#4A4A45] rounded-full text-sm">Supervised Learning</span>
              <span className="px-3 py-1 bg-[#EFECE6] text-[#4A4A45] rounded-full text-sm">Regression</span>
              <span className="px-3 py-1 bg-[#EFECE6] text-[#4A4A45] rounded-full text-sm">Classification</span>
              <span className="px-3 py-1 bg-[#EFECE6] text-[#4A4A45] rounded-full text-sm">Unsupervised Learning</span>
              <span className="px-3 py-1 bg-[#EFECE6] text-[#4A4A45] rounded-full text-sm">Clustering</span>
              <span className="px-3 py-1 bg-[#EFECE6] text-[#4A4A45] rounded-full text-sm">Semi-Supervised</span>
              <span className="px-3 py-1 bg-[#EFECE6] text-[#4A4A45] rounded-full text-sm">Time Series</span>
              <span className="px-3 py-1 bg-[#EFECE6] text-[#4A4A45] rounded-full text-sm">AutoML</span>
            </div>
          </motion.div>

          {/* بطاقة Computer Vision */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6 border border-[#DED8CD] hover:shadow-xl transition-all duration-300"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <FaEye className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-left text-[#4A4A45]">Computer Vision</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-[#EFECE6] text-[#4A4A45] rounded-full text-sm">Object Detection</span>
              <span className="px-3 py-1 bg-[#EFECE6] text-[#4A4A45] rounded-full text-sm">Image Segmentation</span>
            </div>
          </motion.div>

          {/* بطاقة Cloud & Deployment Services */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6 border border-[#DED8CD] hover:shadow-xl transition-all duration-300"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-purple-100 rounded-lg mr-4">
                <FaCloud className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-left text-[#4A4A45]">Cloud & Deployment</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-[#EFECE6] text-[#4A4A45] rounded-full text-sm">Microsoft Azure</span>
            </div>
          </motion.div>
        </div>
      </motion.section>


      {/* Experience */}
      <motion.section
        id="experience"
        className="min-h-screen p-6 md:p-10 pt-20 bg-[#EFECE6] scroll-mt-20"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-start">
          {/* Left Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 flex items-center gap-2 text-[#4A4A45]">
              <FaBriefcase /> Experience
            </h2>
            
            <h3 className="text-base md:text-lg font-semibold text-gray-900">
              AI & Data Science Projects (Freelance / Self-Directed)
            </h3>
            <p className="italic text-gray-600 mb-4 text-sm md:text-base">2024 – Present</p>

            <ul className="list-disc pl-4 md:pl-6 space-y-3 text-base md:text-lg leading-relaxed text-gray-700">
              <li>
                Designed and implemented several <b>end-to-end projects</b> in AI, 
                Machine Learning, and Data Science, including:
                <ul className="list-disc pl-4 md:pl-6 mt-2 space-y-2">
                  <li>
                    <b>Image Classification</b> using CNN on Fashion MNIST 
                    (achieved ~88% accuracy).
                  </li>
                  <li>
                    <b>AI CV Analysis Assistant</b> using RAG, Gemini LLM, and FAISS 
                    to streamline recruitment processes.
                  </li>
                  <li>
                    Data preprocessing, visualization, and analysis using 
                    <b> Python, Pandas, Power BI, and advanced ML frameworks.</b>
                  </li>
                </ul>
              </li>
              <li>
                Applied <b>Deep Learning, NLP, and Computer Vision techniques</b> 
                to real-world problems with a focus on automation and efficiency.
              </li>
              <li>
                Deployed solutions with <b>Streamlit, FastAPI, Git/GitHub, 
                and Microsoft Azure.</b>
              </li>
            </ul>
          </div>

          {/* Right Image & Note */}
          <div className="flex flex-col items-center text-center space-y-6 mt-8 md:mt-0">
            <img
              src="/experience.png"
              alt="Experience Illustration"
              className="rounded-2xl shadow-lg w-full max-w-md border-4 border-[#DED8CD]"
            />
            <p className="italic text-gray-700 text-base md:text-lg max-w-md">
              ✨ Passionate about turning ideas into intelligent systems that solve 
              real-world problems and create measurable impact. Always eager to 
              innovate and push boundaries.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Projects */}
      <motion.section
        id="projects"
        className="min-h-screen p-6 md:p-10 pt-20 bg-[#EFECE6] scroll-mt-20"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-8 md:mb-10 text-center flex items-center justify-center gap-2 text-[#4A4A45]">
          <FaProjectDiagram className="text-[#4A4A45]" /> Projects
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {projects.map((proj, idx) => (
            <motion.div
              key={idx}
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#DED8CD] hover:shadow-xl transition-all duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="h-40 md:h-48 overflow-hidden">
                <img 
                  src={proj.image} 
                  alt={proj.title} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                />
              </div>
              
              <div className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-3 text-[#6B6B63] text-xs md:text-sm">
                  <span className="flex items-center gap-1"><FaCalendarAlt /> {proj.date}</span>
                  <span className="flex items-center gap-1"><FaClock /> {proj.readTime}</span>
                </div>
                
                <h3 className="text-lg md:text-xl font-bold mb-3 text-[#4A4A45]">{proj.title}</h3>
                
                <p className="text-[#6B6B63] mb-4 text-sm md:text-base">
                  {projectDescriptions[proj.repo] || "Loading description..."}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {proj.tags.map((tag, i) => (
                    <span 
                      key={i} 
                      className="px-2 py-1 bg-[#EFECE6] text-[#4A4A45] rounded-full text-xs border border-[#DED8CD]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-between items-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedProject(proj)}
                    className="px-3 py-1 md:px-4 md:py-2 bg-[#4A4A45] text-white rounded-lg text-xs md:text-sm font-medium"
                  >
                    View More
                  </motion.button>
                  
                  <a
                    href={`https://github.com/${proj.repo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-[#4A4A45] hover:text-black text-xs md:text-sm"
                  >
                    <FaGithub className="mr-1" /> GitHub
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Modal */}
      <AnimatePresence>
        {selectedProject && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
            />
            
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 p-2 md:p-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                <div className="relative h-40 md:h-64">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="absolute top-2 right-2 md:top-4 md:right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-200"
                  >
                    <FaTimes className="text-[#4A4A45]" />
                  </button>
                </div>
                
                <div className="p-4 md:p-6 overflow-y-auto flex-1">
                  <h3 className="text-xl md:text-2xl font-bold mb-2 text-[#4A4A45]">{selectedProject.title}</h3>
                  
                  <div className="mb-4 md:mb-6">
                    <a
                      href={`https://github.com/${selectedProject.repo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-[#4A4A45] hover:text-black font-medium text-sm md:text-base"
                    >
                      <FaGithub className="mr-2" />
                      View on GitHub
                      <FaExternalLinkAlt className="ml-1 text-xs" />
                    </a>
                  </div>
                  
                  <div className="prose max-w-none text-[#4A4A45] text-sm md:text-base">
                    {readmes[selectedProject.repo] ? (
                      <ReactMarkdown>
                        {readmes[selectedProject.repo]}
                      </ReactMarkdown>
                    ) : (
                      <div className="text-center py-4 md:py-8">
                        <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-[#4A4A45] mx-auto mb-2 md:mb-4"></div>
                        <p>Loading README...</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-3 md:p-4 border-t bg-[#EFECE6] flex justify-end">
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="px-3 py-1 md:px-4 md:py-2 bg-[#4A4A45] text-white rounded-lg hover:bg-[#3a3a34] transition-colors text-sm md:text-base"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Testimonials */}
      <motion.section
        id="testimonials"
        className="min-h-screen p-10 pt-20 scroll-mt-20"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="grid md:grid-cols-2 gap-10 items-stretch">
          {/* Left Image */}
          <div className="w-full h-full">
            <img
              src="/feedback.png" // ضع هنا مسار الصورة
              alt="Testimonials Illustration"
              className="w-full h-full object-cover rounded-2xl shadow-lg"
            />
          </div>

          {/* Right Testimonials */}
          <div className="flex flex-col justify-center">
            <h2 className="text-4xl font-bold mb-10 text-center flex items-center justify-center gap-2 text-[#4A4A45]">
              <FaComments className="text-[#4A4A45]" /> Testimonials
            </h2>

            {/* Testimonial 1 */}
            <div className="border p-6 mb-6 relative">
              <span className="absolute -top-4 left-4 text-4xl text-gray-700">“</span>
              <p className="italic text-lg text-gray-700">
                "Hisham is incredibly detail-oriented and consistently delivers
                high-quality work that exceeds expectations. His dedication to
                perfection is truly commendable."
              </p>
              <span className="absolute -bottom-4 right-4 text-4xl text-gray-700">”</span>
              <p className="mt-4 font-semibold">Instructor at Instant</p>
            </div>

            {/* Testimonial 2 */}
            <div className="border p-6 relative">
              <span className="absolute -top-4 left-4 text-4xl text-gray-700">“</span>
              <p className="italic text-lg text-gray-700">
                "Hisham possesses strong technical knowledge combined with excellent
                communication skills. He translates complex ideas into understandable
                solutions, making collaboration seamless."
              </p>
              <span className="absolute -bottom-4 right-4 text-4xl text-gray-700">”</span>
              <p className="mt-4 font-semibold">Instructor at NTI</p>
            </div>
          </div>
        </div>
      </motion.section>


      {/* Contact + Thank You */}
      <motion.section
        id="contact"
        className="min-h-screen p-10 pt-20 scroll-mt-20"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Left Content */}
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-10">
              Let's collaborate on innovative projects.
            </h2>

            {/* First row */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              {/* Email */}
              <a href="mailto:h.mislhy.ai@gmail.com" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center">
                <p className="font-semibold underline mb-2">Email</p>
                <FaEnvelope className="text-3xl" />
              </a>

              {/* LinkedIn */}
              <a href="https://linkedin.com/in/hishammislhy" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center">
                <p className="font-semibold underline mb-2">LinkedIn</p>
                <FaLinkedin className="text-3xl" />
              </a>

              {/* GitHub */}
              <a href="https://github.com/hishamx777" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center">
                <p className="font-semibold underline mb-2">GitHub</p>
                <FaGithub className="text-3xl" />
              </a>
            </div>

            {/* Second row */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              {/* Kaggle */}
              <a href="https://www.kaggle.com/hishamx777" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center">
                <p className="font-semibold underline mb-2">Kaggle</p>
                <FaKaggle className="text-3xl" />
              </a>

              {/* Phone */}
              <a href="http://wa.me/201508278230" className="flex flex-col items-center">
                <p className="font-semibold underline mb-2">Phone</p>
                <FaPhone className="text-3xl" />
              </a>
            </div>
            <h4 className="text-2xl font-bold">أخيرًا وليس آخرًا</h4>
            <h4 className="text-2xl font-bold">رَبِّ أَوۡزِعۡنِيٓ أَنۡ أَشۡكُرَ نِعۡمَتَكَ ٱلَّتِيٓ أَنۡعَمۡتَ عَلَيَّ وَعَلَىٰ وَٰلِدَيَّ وَأَنۡ أَعۡمَلَ صَٰلِحٗا تَرۡضَىٰهُ وَأَدۡخِلۡنِي بِرَحۡمَتِكَ فِي عِبَادِكَ ٱلصَّٰلِحِينَ</h4>
            <h4 className="text-2xl font-bold">ِAnd Thank You</h4>
          </div>

          {/* Right Image (75%) */}
          <div className="flex justify-center">
            <img
              src="/contact.jpg" // غير المسار حسب مكان الصورة
              alt="Contact Illustration"
              className="w-3/4 rounded-2xl shadow-lg object-cover"
            />
          </div>
        </div>
      </motion.section>
      {/* Footer */}
      <footer className="w-full bg-[#DED8CD] text-[#4A4A45] py-4 mt-16 text-center text-sm md:text-base">
        © {new Date().getFullYear()} Hisham Mislhy. All rights reserved.
      </footer>
    </div>
  );
}