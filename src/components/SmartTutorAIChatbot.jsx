"use client";

import { useEffect, useRef, useState } from "react";

const WHATSAPP_NUMBER = "919999999999"; // Replace with your real WhatsApp number
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

const introSequence = [
  "Hi! I’m SmartTutors AI Assistant 👋",
  "I can help you with study doubts, exam preparation, course guidance, mock tests, study plans, and Smart Tutors services.",
  "Tell me your class, subject, or exam goal, and I will guide you.",
];

const educationKeywords = [
  "study",
  "exam",
  "course",
  "class",
  "grade",
  "subject",
  "math",
  "maths",
  "science",
  "english",
  "history",
  "geography",
  "biology",
  "physics",
  "chemistry",
  "commerce",
  "accounts",
  "economics",
  "board",
  "hsc",
  "ssc",
  "mpsc",
  "upsc",
  "banking",
  "railway",
  "aptitude",
  "reasoning",
  "mock",
  "test",
  "timetable",
  "notes",
  "chapter",
  "syllabus",
  "career",
  "resume",
  "interview",
  "gdpi",
  "placement",
  "admission",
  "school",
  "college",
  "teacher",
  "parent",
  "student",
  "marks",
  "revision",
  "homework",
  "assignment",
  "doubt",
  "learn",
  "preparation",
  "quiz",
  "mcq",
  "neet",
  "jee",
  "photosynthesis",
  "newton",
  "algebra",
  "grammar",
  "essay",
  "degree",
  "formula",
  "definition",
  "explain",
  "summarize",
  "summary",
];

const studyPlanQuestions = [
  { key: "classGrade", question: "First, tell me your class or grade." },
  {
    key: "targetExam",
    question:
      "Which exam are you preparing for? For example: Board, NEET, JEE, MPSC, UPSC, SSC, Banking, Railway, or no specific exam.",
  },
  { key: "wakeTime", question: "What time do you wake up in the morning?" },
  { key: "sleepTime", question: "What time do you sleep at night?" },
  {
    key: "schoolTiming",
    question: "What are your school, college, tuition, or coaching timings?",
  },
  { key: "studyHours", question: "How many hours can you study daily?" },
  { key: "weakSubject", question: "Which is your weak subject?" },
  { key: "strongSubject", question: "Which is your strong subject?" },
  {
    key: "goal",
    question:
      "What is your main goal right now? For example: score higher marks, complete syllabus, revision, crack an exam, or improve weak subject.",
  },
];

function getCurrentTheme() {
  if (typeof window === "undefined") return "light";

  const html = document.documentElement;
  const body = document.body;

  const htmlTheme = html.getAttribute("data-theme");
  const bodyTheme = body?.getAttribute("data-theme");

  if (
    html.classList.contains("dark") ||
    body?.classList.contains("dark") ||
    htmlTheme === "dark" ||
    bodyTheme === "dark" ||
    localStorage.getItem("theme") === "dark"
  ) {
    return "dark";
  }

  if (
    html.classList.contains("light") ||
    body?.classList.contains("light") ||
    htmlTheme === "light" ||
    bodyTheme === "light" ||
    localStorage.getItem("theme") === "light"
  ) {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function isEducationRelated(text) {
  const lower = text.toLowerCase();
  return educationKeywords.some((keyword) => lower.includes(keyword));
}

function extractMemory(text, currentMemory) {
  const lower = text.toLowerCase();
  const updated = { ...currentMemory };

  const nameMatch = text.match(/my name is\s+([a-zA-Z ]+)/i);
  if (nameMatch) updated.name = nameMatch[1].trim();

  const classMatch = lower.match(
    /class\s*(\d{1,2})|grade\s*(\d{1,2})|std\s*(\d{1,2})/
  );
  if (classMatch) {
    updated.classGrade = classMatch[1] || classMatch[2] || classMatch[3];
  }

  const exams = [
    "upsc",
    "mpsc",
    "ssc",
    "hsc",
    "banking",
    "railway",
    "jee",
    "neet",
    "board",
    "placement",
  ];
  const foundExam = exams.find((exam) => lower.includes(exam));
  if (foundExam) updated.targetExam = foundExam.toUpperCase();

  const subjects = [
    "math",
    "maths",
    "science",
    "english",
    "physics",
    "chemistry",
    "biology",
    "history",
    "geography",
    "accounts",
    "economics",
    "reasoning",
    "aptitude",
  ];
  const foundSubject = subjects.find((subject) => lower.includes(subject));
  if (foundSubject) updated.weakSubject = foundSubject;

  updated.preferredLanguage = "english";

  if (
    lower.includes("course") ||
    lower.includes("admission") ||
    lower.includes("recommend")
  ) {
    updated.courseInterest = text;
  }

  if (
    lower.includes("goal") ||
    lower.includes("target") ||
    lower.includes("prepare")
  ) {
    updated.studyGoal = text;
  }

  return updated;
}

function getPersonalizedQuickActions(memory) {
  const actions = [];

  if (!memory.classGrade) actions.push("Tell me your class");
  if (!memory.targetExam) actions.push("Tell me your target exam");
  if (!memory.weakSubject) actions.push("Tell me your weak subject");

  if (memory.classGrade || memory.targetExam || memory.weakSubject) {
    actions.push("Make my personal study plan");
  } else {
    actions.push("Make Study Plan");
  }

  if (memory.weakSubject) {
    actions.push(`Help in ${memory.weakSubject}`);
  } else {
    actions.push("Ask Study Question");
  }

  if (memory.targetExam) {
    actions.push(`Mock test for ${memory.targetExam}`);
  } else {
    actions.push("Mock Test Help");
  }

  actions.push("Recommend Course");
  actions.push("Contact Admissions");

  return actions.slice(0, 6);
}

function getCourseRecommendation(memory, text) {
  const lower = text.toLowerCase();
  const classNumber = Number(memory.classGrade);

  if (
    lower.includes("placement") ||
    lower.includes("resume") ||
    lower.includes("interview") ||
    lower.includes("job") ||
    lower.includes("gdpi")
  ) {
    return "Career Launch Studio";
  }

  if (
    lower.includes("upsc") ||
    lower.includes("mpsc") ||
    lower.includes("banking") ||
    lower.includes("ssc") ||
    lower.includes("railway") ||
    lower.includes("government")
  ) {
    return "Competitive Exam Plan";
  }

  if (classNumber >= 6 && classNumber <= 10) {
    return "School Student Plan";
  }

  if (
    classNumber === 11 ||
    classNumber === 12 ||
    lower.includes("hsc") ||
    lower.includes("junior college")
  ) {
    return "HSC / Junior College Plan";
  }

  if (
    lower.includes("college") ||
    lower.includes("semester") ||
    lower.includes("assignment")
  ) {
    return "Academic Excellence Program";
  }

  return "Smart Tutor Course Guidance Plan";
}

function buildPersonalizedStudyPlan(data) {
  const weakSubject = data.weakSubject || "your weak subject";
  const strongSubject = data.strongSubject || "your strong subject";
  const wakeTime = data.wakeTime || "your wake-up time";
  const sleepTime = data.sleepTime || "your sleep time";
  const studyHours = data.studyHours || "2 to 3 hours";
  const classGrade = data.classGrade || "your class";
  const targetExam = data.targetExam || "your exam";
  const schoolTiming = data.schoolTiming || "your daily academic timing";
  const goal = data.goal || "improve your preparation";

  return `Here is your personalized study plan based on your routine:

Student profile:
• Class/Grade: ${classGrade}
• Target exam: ${targetExam}
• Wake-up time: ${wakeTime}
• Sleep time: ${sleepTime}
• School/Coaching timing: ${schoolTiming}
• Daily study time available: ${studyHours}
• Weak subject: ${weakSubject}
• Strong subject: ${strongSubject}
• Goal: ${goal}

Recommended daily routine:
1. Morning session
• Study ${weakSubject} for 30 to 45 minutes after waking up.
• Use this time for concept revision because your mind is fresh.

2. School / College / Coaching time
• Focus properly during class.
• Write down doubts immediately.
• Mark topics that need revision later.

3. Main study session
• 60 minutes: ${weakSubject}
• 45 minutes: practice questions from ${weakSubject}
• 45 minutes: ${strongSubject}
• 30 minutes: class notes or homework
• 20 minutes: recap of the day

4. Night revision
• Before sleeping, revise formulas, definitions, short notes, or mistakes for 10 to 15 minutes.

Weekly plan:
• 5 days: regular study
• 1 day: revision and backlog clearing
• 1 day: mock test or self-test with mistake analysis

Special strategy:
• Give extra time to ${weakSubject}.
• Use ${strongSubject} to build confidence.
• Keep one mistake notebook.
• Every Sunday, review your progress and adjust your schedule.

Next step:
I can also make a full hour-by-hour timetable for you.`;
}

function fallbackReply(text, memory) {
  const lower = text.toLowerCase();

  if (!isEducationRelated(text)) {
    return `Hi! I can help you with Smart Tutors education support.

You can ask me about:
• Study doubts
• School or college subjects
• Exam preparation
• Study timetable
• Mock test strategy
• Course recommendations
• Admission guidance

Please tell me your class, subject, or exam goal, and I will guide you in English.`;
  }

  if (
    lower.includes("course") ||
    lower.includes("recommend") ||
    lower.includes("admission")
  ) {
    const plan = getCourseRecommendation(memory, text);

    return `Based on your details, the best Smart Tutors option is: ${plan}.

To guide you better, please share:
• Your class or grade
• Target exam
• Weak subject
• Daily available study time

Smart Tutors can help with structured preparation, mock tests, mentoring, and progress tracking.`;
  }

  if (
    lower.includes("mock") ||
    lower.includes("test") ||
    lower.includes("mcq")
  ) {
    return `Best mock test method:

• Start with chapter-wise tests
• Then take mixed-subject tests
• Practice with a timer
• Maintain a mistake notebook
• Revise every wrong answer
• Take one full mock test every week

Smart Tutors can help with mock tests, weekly assessments, and progress tracking.`;
  }

  if (lower.includes("photosynthesis")) {
    return `Photosynthesis is the process by which green plants make their own food using sunlight.

Simple explanation:
• Plants take carbon dioxide from the air.
• Roots absorb water from the soil.
• Leaves contain chlorophyll, which captures sunlight.
• Using sunlight, plants convert carbon dioxide and water into glucose.
• Oxygen is released as a by-product.

Formula:
Carbon dioxide + Water + Sunlight → Glucose + Oxygen`;
  }

  if (lower.includes("newton")) {
    return `Newton's laws of motion explain how objects move.

1. First Law:
An object stays at rest or keeps moving unless an external force acts on it.

2. Second Law:
Force = Mass × Acceleration.

3. Third Law:
For every action, there is an equal and opposite reaction.`;
  }

  if (lower.includes("math") || lower.includes("maths")) {
    return `For Maths, follow this method:

• First understand the formula
• Solve 5 easy examples
• Then solve 10 medium questions
• Mark your mistakes
• Revise the same topic next day
• Take a short weekly test

Tell me the exact Maths topic and I will explain it step by step.`;
  }

  return `I can help you with study doubts, study plans, course guidance, exam preparation, admissions, and mock tests.

Please ask your question more clearly, for example:
• Explain photosynthesis
• Recommend a course for UPSC
• Help me prepare for board exams
• Make a timetable for class 10
• Give me a mock test strategy`;
}

export default function SmartTutorAIChatbot() {
  const [theme, setTheme] = useState("light");
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [introPlayed, setIntroPlayed] = useState(false);

  const [memory, setMemory] = useState({
    name: "",
    classGrade: "",
    targetExam: "",
    weakSubject: "",
    strongSubject: "",
    preferredLanguage: "english",
    studyGoal: "",
    courseInterest: "",
  });

  const [studyPlanFlow, setStudyPlanFlow] = useState({
    active: false,
    stepIndex: 0,
    answers: {},
  });

  const bottomRef = useRef(null);
  const styles = getStyles(theme);

  useEffect(() => {
    const updateTheme = () => setTheme(getCurrentTheme());

    updateTheme();

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const onThemeChange = () => updateTheme();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", onThemeChange);
    } else {
      mediaQuery.addListener(onThemeChange);
    }

    const observer = new MutationObserver(updateTheme);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    if (document.body) {
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ["class", "data-theme"],
      });
    }

    const interval = setInterval(updateTheme, 800);

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", onThemeChange);
      } else {
        mediaQuery.removeListener(onThemeChange);
      }
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, showQuickActions]);

  useEffect(() => {
    if (open && !introPlayed && messages.length === 0) {
      playIntroSequence();
    }
  }, [open, introPlayed, messages.length]);

  function playIntroSequence() {
    setIntroPlayed(true);
    setShowQuickActions(false);

    introSequence.forEach((text, index) => {
      setTimeout(() => {
        setMessages((prev) => [...prev, { role: "assistant", content: text }]);

        if (index === introSequence.length - 1) {
          setTimeout(() => {
            setShowQuickActions(true);
          }, 250);
        }
      }, index * 700);
    });
  }

  function addAssistantMessage(content) {
    setMessages((prev) => [...prev, { role: "assistant", content }]);
  }

  function restartConversation() {
    setMessages([]);
    setInput("");
    setTyping(false);
    setShowQuickActions(false);
    setIntroPlayed(false);

    setStudyPlanFlow({
      active: false,
      stepIndex: 0,
      answers: {},
    });

    setMemory({
      name: "",
      classGrade: "",
      targetExam: "",
      weakSubject: "",
      strongSubject: "",
      preferredLanguage: "english",
      studyGoal: "",
      courseInterest: "",
    });
  }

  function startStudyPlanFlow() {
    setShowQuickActions(false);

    setStudyPlanFlow({
      active: true,
      stepIndex: 0,
      answers: {},
    });

    addAssistantMessage(
      "Great. I will create a personalized study plan for you, but first I need a few details."
    );

    setTimeout(() => {
      addAssistantMessage(studyPlanQuestions[0].question);
    }, 350);
  }

  function handleStudyPlanAnswer(answerText) {
    const currentQuestion = studyPlanQuestions[studyPlanFlow.stepIndex];

    const newAnswers = {
      ...studyPlanFlow.answers,
      [currentQuestion.key]: answerText,
    };

    const nextIndex = studyPlanFlow.stepIndex + 1;

    if (nextIndex < studyPlanQuestions.length) {
      setStudyPlanFlow({
        active: true,
        stepIndex: nextIndex,
        answers: newAnswers,
      });

      setTimeout(() => {
        addAssistantMessage(studyPlanQuestions[nextIndex].question);
      }, 350);
    } else {
      const mergedMemory = {
        ...memory,
        ...newAnswers,
        weakSubject: newAnswers.weakSubject || memory.weakSubject,
        strongSubject: newAnswers.strongSubject || memory.strongSubject,
        classGrade: newAnswers.classGrade || memory.classGrade,
        targetExam: newAnswers.targetExam || memory.targetExam,
      };

      setMemory(mergedMemory);

      setStudyPlanFlow({
        active: false,
        stepIndex: 0,
        answers: {},
      });

      setTimeout(() => {
        addAssistantMessage(buildPersonalizedStudyPlan(newAnswers));
      }, 450);
    }
  }

  async function sendMessage(text = input) {
    const cleanText = text.trim();
    if (!cleanText) return;

    const updatedMemory = extractMemory(cleanText, memory);

    setMessages((prev) => [...prev, { role: "user", content: cleanText }]);
    setMemory(updatedMemory);
    setInput("");
    setShowQuickActions(false);

    if (studyPlanFlow.active) {
      handleStudyPlanAnswer(cleanText);
      return;
    }

    if (
      cleanText.toLowerCase().includes("study plan") ||
      cleanText.toLowerCase().includes("timetable")
    ) {
      startStudyPlanFlow();
      return;
    }

    setTyping(true);

    try {
      const response = await fetch("/api/smarttutor-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: cleanText,
          memory: updatedMemory,
          history: [...messages, { role: "user", content: cleanText }].slice(
            -4
          ),
        }),
      });

      let data = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        addAssistantMessage(fallbackReply(cleanText, updatedMemory));
        return;
      }

      addAssistantMessage(
        data?.reply || fallbackReply(cleanText, updatedMemory)
      );
    } catch {
      addAssistantMessage(fallbackReply(cleanText, updatedMemory));
    } finally {
      setTyping(false);
    }
  }

  function handleQuickAction(action) {
    setShowQuickActions(false);

    if (
      action === "Make Study Plan" ||
      action === "Make my personal study plan"
    ) {
      startStudyPlanFlow();
      return;
    }

    if (action === "Tell me your class") {
      addAssistantMessage("Please tell me your class or grade.");
      return;
    }

    if (action === "Tell me your target exam") {
      addAssistantMessage("Please tell me which exam you are preparing for.");
      return;
    }

    if (action === "Tell me your weak subject") {
      addAssistantMessage("Please tell me your weak subject.");
      return;
    }

    if (action.startsWith("Help in ")) {
      const subject = action.replace("Help in ", "");
      sendMessage(`Please help me in ${subject}`);
      return;
    }

    if (action.startsWith("Mock test for ")) {
      const exam = action.replace("Mock test for ", "");
      sendMessage(`I need mock test help for ${exam}`);
      return;
    }

    if (action === "Contact Admissions") {
      window.open(WHATSAPP_LINK, "_blank");
      return;
    }

    const prompts = {
      "Ask Study Question": "I want to ask a study question",
      "Recommend Course": "Please recommend the best Smart Tutors course for me",
      "Mock Test Help": "I need help with mock test preparation",
    };

    sendMessage(prompts[action] || action);
  }

  return (
    <>
      <style jsx global>{`
        @keyframes st-fade-up {
          0% {
            opacity: 0;
            transform: translateY(14px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes st-pop-in {
          0% {
            opacity: 0;
            transform: scale(0.86);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes ai-float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes ai-glow {
          0%,
          100% {
            box-shadow:
              0 18px 44px rgba(59, 130, 246, 0.32),
              inset 0 3px 10px rgba(255, 255, 255, 0.92);
          }
          50% {
            box-shadow:
              0 22px 54px rgba(59, 130, 246, 0.44),
              inset 0 3px 10px rgba(255, 255, 255, 0.96);
          }
        }

        @keyframes bot-blink {
          0%,
          92%,
          100% {
            transform: scaleY(1);
          }
          96% {
            transform: scaleY(0.25);
          }
        }

        @keyframes bot-wave {
          0%,
          100% {
            transform: rotate(0deg);
          }
          20% {
            transform: rotate(-18deg);
          }
          40% {
            transform: rotate(16deg);
          }
          60% {
            transform: rotate(-10deg);
          }
          80% {
            transform: rotate(8deg);
          }
        }

        @keyframes hi-bounce {
          0%,
          100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-4px) scale(1.06);
          }
        }

        @keyframes whatsapp-float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-7px);
          }
        }

        @keyframes whatsapp-glow {
          0%,
          100% {
            box-shadow:
              0 16px 36px rgba(37, 211, 102, 0.28),
              inset 0 3px 10px rgba(255, 255, 255, 0.28);
          }
          50% {
            box-shadow:
              0 20px 46px rgba(37, 211, 102, 0.4),
              inset 0 3px 10px rgba(255, 255, 255, 0.35);
          }
        }

        @keyframes whatsapp-shine {
          0%,
          100% {
            opacity: 0.75;
            transform: translateY(0);
          }
          50% {
            opacity: 1;
            transform: translateY(-2px);
          }
        }
      `}</style>

      <div style={styles.wrapper}>
        {open && (
          <div style={styles.chatBox}>
            <div style={styles.header}>
              <div style={styles.headerLeft}>
                <div style={styles.headerRobotMini}>
                  <div style={styles.headerRobotFace}>🤖</div>
                </div>

                <div>
                  <div style={styles.title}>SmartTutors AI</div>
                  <div style={styles.subtitle}>
                    Study Assistant & Course Guide
                  </div>
                </div>
              </div>

              <div style={styles.headerActions}>
                <button
                  onClick={restartConversation}
                  style={styles.restartButton}
                  type="button"
                  title="Restart conversation"
                >
                  ↻
                </button>

                <button
                  onClick={() => setOpen(false)}
                  style={styles.closeButton}
                  type="button"
                  title="Close"
                >
                  ×
                </button>
              </div>
            </div>

            <div style={styles.messages}>
              {messages.map((message, index) => (
                <div
                  key={index}
                  style={{
                    ...styles.messageRow,
                    justifyContent:
                      message.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      ...styles.messageBubble,
                      ...(message.role === "user"
                        ? styles.userBubble
                        : styles.botBubble),
                    }}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {typing && (
                <div style={styles.messageRow}>
                  <div style={styles.botBubble}>SmartTutors AI is typing...</div>
                </div>
              )}

              {showQuickActions &&
                messages.length === introSequence.length &&
                !studyPlanFlow.active && (
                  <div style={styles.quickGrid}>
                    {getPersonalizedQuickActions(memory).map((action) => (
                      <button
                        key={action}
                        onClick={() => handleQuickAction(action)}
                        style={styles.quickButton}
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                )}

              <div ref={bottomRef} />
            </div>

            <div style={styles.footer}>
              <div style={styles.note}>
                SmartTutors can help with study doubts, course guidance, mock
                tests, personalized study plans, and admissions.
              </div>

              <div style={styles.inputRow}>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendMessage();
                  }}
                  placeholder="Ask your study question..."
                  style={styles.input}
                />

                <button onClick={() => sendMessage()} style={styles.sendButton}>
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={styles.floatingCluster}>
          <button
            onClick={() => window.open(WHATSAPP_LINK, "_blank")}
            style={styles.whatsappButton}
            aria-label="Chat on WhatsApp"
            title="Chat on WhatsApp"
            type="button"
          >
            <div style={styles.whatsappOuter}>
              <div style={styles.whatsappInner}>
                <div style={styles.whatsappShine}></div>
                <svg
                  width="34"
                  height="34"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  style={styles.whatsappSvg}
                >
                  <path
                    fill="#ffffff"
                    d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.33 4.95L2 22l5.28-1.38a9.86 9.86 0 0 0 4.76 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.51 2 12.04 2Zm0 18.14h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.13.82.84-3.05-.2-.31a8.2 8.2 0 1 1 6.98 3.87Zm4.5-6.14c-.25-.12-1.47-.73-1.7-.81-.23-.09-.4-.12-.57.12-.17.25-.65.81-.8.98-.15.17-.3.19-.55.06-.25-.12-1.05-.39-2-1.24-.74-.66-1.24-1.48-1.39-1.73-.15-.25-.02-.38.11-.51.11-.11.25-.3.37-.44.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.57-1.37-.78-1.88-.2-.49-.41-.42-.57-.43h-.49c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.09s.9 2.43 1.03 2.6c.12.17 1.76 2.69 4.27 3.77.6.26 1.07.41 1.43.52.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.16-.48-.29Z"
                  />
                </svg>
              </div>
            </div>
          </button>

          <button
            onClick={() => setOpen(!open)}
            style={styles.aiButton}
            aria-label="Open AI assistant"
            title="Open AI assistant"
            type="button"
          >
            <div style={styles.aiHiBubble}>Hi!</div>

            <div style={styles.aiOuter}>
              <div style={styles.aiInner}>
                <div style={styles.aiGloss}></div>

                <div style={styles.aiBotFace}>
                  <span style={styles.aiEye}></span>
                  <span style={styles.aiEye}></span>
                </div>

                <div style={styles.aiBotBody}>
                  <span style={styles.aiArmLeft}></span>
                  <span style={styles.aiChest}></span>
                  <span style={styles.aiArmRight}></span>
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}

function getStyles(theme) {
  const isDark = theme === "dark";

  const colors = {
    pageGradient: isDark
      ? "linear-gradient(180deg, #020617 0%, #0f172a 50%, #111827 100%)"
      : "linear-gradient(180deg, #eef7ff 0%, #f8fbff 45%, #ffffff 100%)",

    cardBg: isDark ? "rgba(15, 23, 42, 0.97)" : "rgba(255, 255, 255, 0.97)",
    headerBg: isDark
      ? "linear-gradient(135deg, #0f172a, #1e3a8a)"
      : "linear-gradient(135deg, #2563eb, #1d4ed8)",

    botBg: isDark ? "rgba(30, 41, 59, 0.96)" : "white",
    botText: isDark ? "#e5e7eb" : "#0f172a",
    userBg: isDark
      ? "linear-gradient(135deg, #2563eb, #38bdf8)"
      : "linear-gradient(135deg, #2563eb, #0ea5e9)",

    border: isDark ? "rgba(96, 165, 250, 0.18)" : "rgba(37, 99, 235, 0.18)",
    softBorder: isDark
      ? "rgba(96, 165, 250, 0.18)"
      : "rgba(37, 99, 235, 0.12)",
    footerBg: isDark ? "#0f172a" : "white",
    noteBg: isDark ? "rgba(30, 64, 175, 0.22)" : "#eff6ff",
    noteText: isDark ? "#bfdbfe" : "#1e40af",
    inputBg: isDark ? "#111827" : "#f8fbff",
    inputText: isDark ? "#f8fafc" : "#0f172a",
    quickBg: isDark ? "rgba(30,41,59,0.95)" : "rgba(255,255,255,0.92)",
    quickText: isDark ? "#dbeafe" : "#1e3a8a",
    shadow: isDark
      ? "0 24px 70px rgba(0, 0, 0, 0.55)"
      : "0 24px 70px rgba(15, 23, 42, 0.22)",
  };

  return {
    wrapper: {
      position: "fixed",
      right: "18px",
      bottom: "18px",
      zIndex: 99999,
      fontFamily: "Inter, Arial, Helvetica, sans-serif",
    },

    floatingCluster: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      gap: "14px",
      animation: "st-pop-in 0.35s ease both",
    },

    whatsappButton: {
      width: "76px",
      height: "76px",
      borderRadius: "50%",
      border: "none",
      background: "transparent",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      animation:
        "whatsapp-float 3.1s ease-in-out infinite, whatsapp-glow 2.8s ease-in-out infinite",
      overflow: "visible",
      position: "relative",
    },

    whatsappOuter: {
      width: "74px",
      height: "74px",
      borderRadius: "50%",
      background: "radial-gradient(circle at 35% 25%, #60f39d, #25D366 65%, #16a34a 100%)",
      boxShadow: isDark
        ? "0 18px 40px rgba(37, 211, 102, 0.32), inset 0 4px 8px rgba(255,255,255,0.25)"
        : "0 18px 40px rgba(37, 211, 102, 0.30), inset 0 4px 8px rgba(255,255,255,0.32)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    },

    whatsappInner: {
      width: "58px",
      height: "58px",
      borderRadius: "50%",
      background: "linear-gradient(180deg, #34d399 0%, #22c55e 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      boxShadow:
        "inset 0 -4px 8px rgba(0,0,0,0.12), inset 0 4px 10px rgba(255,255,255,0.2)",
      overflow: "hidden",
    },

    whatsappShine: {
      position: "absolute",
      top: "8px",
      left: "10px",
      width: "24px",
      height: "12px",
      borderRadius: "999px",
      background: "rgba(255,255,255,0.28)",
      filter: "blur(1px)",
      animation: "whatsapp-shine 2.4s ease-in-out infinite",
    },

    whatsappSvg: {
      position: "relative",
      zIndex: 2,
      display: "block",
      filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.14))",
    },

    aiButton: {
      width: "88px",
      height: "88px",
      borderRadius: "50%",
      border: "none",
      background: "transparent",
      cursor: "pointer",
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      animation: "ai-float 3.1s ease-in-out infinite",
      overflow: "visible",
    },

    aiHiBubble: {
      position: "absolute",
      top: "-10px",
      right: "-2px",
      background: isDark ? "#eff6ff" : "#ffffff",
      color: "#1d4ed8",
      fontSize: "12px",
      fontWeight: "900",
      padding: "6px 10px",
      borderRadius: "999px",
      boxShadow: "0 10px 24px rgba(15, 23, 42, 0.18)",
      animation: "hi-bounce 1.9s ease-in-out infinite",
      zIndex: 5,
    },

    aiOuter: {
      width: "84px",
      height: "84px",
      borderRadius: "50%",
      background: isDark
        ? "radial-gradient(circle at 32% 24%, #ffffff, #dbeafe 40%, #60a5fa 70%, #2563eb 100%)"
        : "radial-gradient(circle at 32% 24%, #ffffff, #eef6ff 42%, #93c5fd 72%, #3b82f6 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: isDark
        ? "0 18px 44px rgba(59, 130, 246, 0.32), inset 0 3px 10px rgba(255,255,255,0.92)"
        : "0 18px 44px rgba(59, 130, 246, 0.26), inset 0 3px 10px rgba(255,255,255,0.95)",
      animation: "ai-glow 2.8s ease-in-out infinite",
      position: "relative",
    },

    aiInner: {
      width: "64px",
      height: "64px",
      borderRadius: "50%",
      background: "linear-gradient(180deg, #ffffff 0%, #e9f2ff 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      boxShadow:
        "inset 0 -4px 10px rgba(37, 99, 235, 0.16), inset 0 4px 10px rgba(255,255,255,0.85)",
      overflow: "hidden",
    },

    aiGloss: {
      position: "absolute",
      top: "8px",
      left: "12px",
      width: "28px",
      height: "14px",
      borderRadius: "999px",
      background: "rgba(255,255,255,0.55)",
      transform: "rotate(-14deg)",
      filter: "blur(1px)",
    },

    aiBotFace: {
      width: "38px",
      height: "24px",
      borderRadius: "13px",
      background: "linear-gradient(135deg, #2563eb, #4f46e5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "7px",
      position: "relative",
      boxShadow: "0 6px 14px rgba(37, 99, 235, 0.26)",
    },

    aiEye: {
      width: "6px",
      height: "6px",
      borderRadius: "50%",
      background: "#ffffff",
      display: "block",
      animation: "bot-blink 2.8s infinite",
    },

    aiBotBody: {
      width: "38px",
      height: "18px",
      marginTop: "6px",
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },

    aiChest: {
      width: "22px",
      height: "12px",
      borderRadius: "999px",
      background: "linear-gradient(135deg, #60a5fa, #2563eb)",
      boxShadow: "0 4px 8px rgba(37, 99, 235, 0.18)",
    },

    aiArmLeft: {
      position: "absolute",
      left: "1px",
      top: "7px",
      width: "12px",
      height: "4px",
      borderRadius: "999px",
      background: "#ffffff",
      opacity: 0.95,
    },

    aiArmRight: {
      position: "absolute",
      right: "-1px",
      top: "5px",
      width: "14px",
      height: "4px",
      borderRadius: "999px",
      background: "#ffffff",
      transformOrigin: "left center",
      animation: "bot-wave 1.8s ease-in-out infinite",
    },

    chatBox: {
      width: "400px",
      maxWidth: "92vw",
      height: "620px",
      maxHeight: "84vh",
      background: colors.cardBg,
      borderRadius: "26px",
      overflow: "hidden",
      marginBottom: "16px",
      border: `1px solid ${colors.border}`,
      boxShadow: colors.shadow,
      display: "flex",
      flexDirection: "column",
      backdropFilter: "blur(14px)",
      animation: "st-pop-in 0.25s ease both",
    },

    header: {
      background: colors.headerBg,
      color: "white",
      padding: "16px 18px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },

    headerLeft: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },

    headerRobotMini: {
      width: "42px",
      height: "42px",
      borderRadius: "50%",
      background: "rgba(255,255,255,0.18)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25)",
    },

    headerRobotFace: {
      fontSize: "22px",
    },

    headerActions: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },

    restartButton: {
      width: "36px",
      height: "36px",
      borderRadius: "50%",
      border: "1px solid rgba(255,255,255,0.25)",
      background: "rgba(255,255,255,0.16)",
      color: "white",
      fontSize: "18px",
      fontWeight: "800",
      cursor: "pointer",
    },

    title: {
      fontSize: "18px",
      fontWeight: "800",
      letterSpacing: "-0.3px",
    },

    subtitle: {
      fontSize: "12px",
      opacity: 0.9,
      marginTop: "4px",
    },

    closeButton: {
      width: "36px",
      height: "36px",
      borderRadius: "50%",
      border: "1px solid rgba(255,255,255,0.25)",
      background: "rgba(255,255,255,0.16)",
      color: "white",
      fontSize: "24px",
      cursor: "pointer",
    },

    messages: {
      flex: 1,
      padding: "15px",
      background: colors.pageGradient,
      overflowY: "auto",
    },

    messageRow: {
      display: "flex",
      marginBottom: "10px",
      animation: "st-fade-up 0.35s ease both",
    },

    messageBubble: {
      maxWidth: "82%",
      padding: "12px 14px",
      borderRadius: "18px",
      whiteSpace: "pre-line",
      fontSize: "14px",
      lineHeight: "1.5",
      animation: "st-fade-up 0.35s ease both",
    },

    botBubble: {
      background: colors.botBg,
      color: colors.botText,
      border: `1px solid ${colors.softBorder}`,
      boxShadow: isDark
        ? "0 6px 16px rgba(0,0,0,0.24)"
        : "0 6px 16px rgba(15,23,42,0.06)",
    },

    userBubble: {
      background: colors.userBg,
      color: "white",
      boxShadow: "0 8px 18px rgba(37, 99, 235, 0.22)",
    },

    quickGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "9px",
      marginTop: "12px",
      animation: "st-fade-up 0.35s ease both",
    },

    quickButton: {
      padding: "11px",
      borderRadius: "14px",
      border: `1px solid ${colors.border}`,
      background: colors.quickBg,
      color: colors.quickText,
      fontSize: "12px",
      fontWeight: "700",
      cursor: "pointer",
      textAlign: "left",
      boxShadow: isDark
        ? "0 4px 12px rgba(0,0,0,0.25)"
        : "0 4px 12px rgba(15,23,42,0.05)",
    },

    footer: {
      borderTop: `1px solid ${colors.softBorder}`,
      padding: "12px",
      background: colors.footerBg,
    },

    note: {
      background: colors.noteBg,
      color: colors.noteText,
      padding: "9px",
      borderRadius: "12px",
      fontSize: "11px",
      marginBottom: "10px",
      border: `1px solid ${colors.softBorder}`,
    },

    inputRow: {
      display: "flex",
      gap: "8px",
    },

    input: {
      flex: 1,
      padding: "12px",
      borderRadius: "14px",
      border: isDark ? "1px solid #334155" : "1px solid #bfdbfe",
      outline: "none",
      fontSize: "14px",
      background: colors.inputBg,
      color: colors.inputText,
    },

    sendButton: {
      padding: "0 16px",
      borderRadius: "14px",
      border: "none",
      background: colors.userBg,
      color: "white",
      fontWeight: "800",
      cursor: "pointer",
      boxShadow: "0 8px 18px rgba(37, 99, 235, 0.22)",
    },
  };
}