// ============================================================================
// INTERACTIVE E-LEARNING COURSE TEMPLATE - Configuration File
// ============================================================================
// This file contains all your course content, settings, and configuration.
// Edit this file to customize your course for different audiences.
//
// QUICK START:
// 1. Change courseTitle and teaserText
// 2. Add your images to the images/ folder
// 3. Modify chapters array with your content
// 4. Set debug: false before publishing
// ============================================================================

const courseData = {
  // ===== BASIC COURSE INFORMATION =====
  courseTitle: "Data Breach: First Response",                    // Course title displayed to learners
  teaserText: "You're the on-call security analyst when alerts start flooding in. Can you contain the breach and save the company?", // Short description

  // ===== COURSE SETTINGS =====
  requireSuccess: false, // If true, only chapters with success: true count as course completion
  debug: true,           // Set to true for preview/testing, false for production/LMS

  // ===== COMPLETION FEEDBACK MESSAGES =====
  // Customize the messages shown when learners complete the course
  feedback: {
    perfectHeader: "Security Hero!",        // Title for optimal path completion
    goodHeader: "Breach Contained",         // Title for good path completion
    retryHeader: "Security Failure",        // Title for poor path completion

    perfect: "Outstanding work! Your quick thinking and perfect decisions prevented a catastrophic data breach. The board is recommending you for promotion!",
    good: "You successfully contained the breach with minimal damage. There are some lessons to learn, but overall a good response.",
    retry: "The breach escalated beyond control. Critical systems were compromised and sensitive data was exfiltrated. Time to review your incident response protocols."
  },

  // ===== VISUAL THEME =====
  // Customize colors to match your organization's branding
  theme: {
    primary: "#0a1929",                      // Main background color
    secondary: "#192841",                    // Card/panel backgrounds
    accent: "#00b3e6",                       // Buttons, highlights, links
    text: "#f0f0f0",                         // Main text color
    gradient: "linear-gradient(135deg, #0a1929, #192841)" // Background gradient
  },

  // ===== COURSE CONTENT =====
  // This is where you define your interactive story chapters.
  // Each chapter can have decisions that branch to other chapters.
  //
  // CHAPTER STRUCTURE:
  // - id: Unique identifier (used for navigation)
  // - title: Chapter title displayed to learner
  // - content: Main chapter text/content
  // - image: Path to chapter image (optional, from images/ folder)
  // - decisions: Array of choices (optional, omit for linear chapters)
  //   - text: Button text shown to learner
  //   - next: ID of next chapter to go to
  // - isFinal: true for ending chapters (learner can't continue)
  // - success: true for successful endings, false for failures
  //
  // EXAMPLES:
  // 1. Simple chapter with no choices:
  //    { id: "intro", title: "Welcome", content: "Welcome to the course!" }
  //
  // 2. Chapter with decisions:
  //    {
  //      id: "choice1",
  //      title: "Make a Decision",
  //      content: "What do you do?",
  //      decisions: [
  //        { text: "Option A", next: "chapterA" },
  //        { text: "Option B", next: "chapterB" }
  //      ]
  //    }
  //
  // 3. Ending chapter:
  //    {
  //      id: "success",
  //      title: "Congratulations!",
  //      content: "You succeeded!",
  //      isFinal: true,
  //      success: true
  //    }
  chapters: [
    {
      id: "alert",
      title: "Midnight Alert",
      content: "It's 2:17 AM when your phone buzzes with alerts. The intrusion detection system has flagged unusual network activity from the finance department. Multiple failed login attempts followed by a successful authentication from an IP address in Eastern Europe.",
      image: "images/phone-alert-screen.jpg",
      decisions: [
        { text: "Immediately lock down the affected account", next: "lockdown" },
        { text: "Monitor the activity to gather more information", next: "monitor" },
        { text: "Call your supervisor for guidance", next: "callSupervisor" }
      ]
    },
    {
      id: "lockdown",
      title: "Account Lockdown",
      content: "You quickly lock the compromised account. The suspicious activity stops, but you notice the attacker was running a script to enumerate other user accounts during their brief access.",
      image: "images/account-lockdown-screen.jpg",
      decisions: [
        { text: "Isolate the affected workstation from the network", next: "isolate" },
        { text: "Run a full system scan on the finance department servers", next: "systemScan" }
      ]
    },
    {
      id: "monitor",
      title: "Monitoring the Intruder",
      content: "You watch as the attacker accesses financial records and begins downloading customer payment information. They're moving quickly and methodically.",
      image: "images/network-traffic-monitoring.jpg",
      decisions: [
        { text: "Cut off access now and lock the account", next: "lateLockdown" },
        { text: "Continue monitoring to see what they're targeting", next: "dataLoss" }
      ]
    },
    {
      id: "callSupervisor",
      title: "Waiting for Authorization",
      content: "Your supervisor doesn't answer. Company policy requires supervisor approval for emergency account lockdowns outside business hours. Meanwhile, the attacker continues accessing sensitive systems.",
      image: "images/unanswered-call-screen.jpg",
      decisions: [
        { text: "Act without approval and lock the account", next: "lateLockdown" },
        { text: "Leave a message and keep monitoring", next: "dataLoss" }
      ]
    },
    {
      id: "isolate",
      title: "Network Isolation",
      content: "You remotely isolate the compromised workstation. System logs reveal the attacker exploited an unpatched vulnerability. There's evidence they attempted to install persistent backdoor access.",
      image: "images/network-isolation-diagram.jpg",
      decisions: [
        { text: "Initiate the formal incident response plan", next: "formalResponse" },
        { text: "Check other systems for the same vulnerability", next: "checkSystems" }
      ]
    },
    {
      id: "systemScan",
      title: "System Scan Results",
      content: "The scan takes 45 minutes to complete. Results show malware already installed on two finance department servers. Sensitive data has likely been compromised during this time.",
      image: "images/malware-scan-results.jpg",
      decisions: [
        { text: "Isolate the infected servers immediately", next: "isolateServers" },
        { text: "Attempt to remove the malware", next: "failedRemoval" }
      ]
    },
    {
      id: "lateLockdown",
      title: "Delayed Response",
      content: "You lock the account, but logs show the attacker already accessed HR databases and downloaded files. They also created a new admin account you didn't notice.",
      image: "images/security-logs-evidence.jpg",
      decisions: [
        { text: "Search for and remove unauthorized accounts", next: "findBackdoors" },
        { text: "Focus on determining what data was stolen", next: "dataAssessment" }
      ]
    },
    {
      id: "dataLoss",
      title: "Major Data Breach",
      content: "The attacker exfiltrates gigabytes of confidential customer and financial data before moving to other systems. By the time you respond, critical damage has been done.",
      image: "images/data-exfiltration-graph.jpg",
      isFinal: true,
      success: false
    },
    {
      id: "formalResponse",
      title: "Incident Response Protocol",
      content: "You activate the incident response team. Together, you patch the vulnerability across all systems, scan for additional compromise, and prepare breach notifications. The quick response prevents data exfiltration.",
      image: "images/incident-response-team.jpg",
      isFinal: true,
      success: true
    },
    {
      id: "checkSystems",
      title: "Vulnerability Check",
      content: "While checking other systems, you discover three more vulnerable workstations. However, you've left the incident response plan uninitiated, leading to uncoordinated efforts.",
      image: "images/vulnerability-scan-results.jpg",
      decisions: [
        { text: "Initiate the formal incident response plan now", next: "lateResponse" },
        { text: "Patch the vulnerable systems yourself", next: "missingEvidence" }
      ]
    },
    {
      id: "isolateServers",
      title: "Server Isolation",
      content: "You isolate the infected servers, but significant data exfiltration has already occurred. The breach will need to be reported to customers and regulators.",
      image: "images/server-isolation-dashboard.jpg",
      decisions: [
        { text: "Begin breach notification procedures", next: "breachNotification" },
        { text: "Restore from backups and resume operations", next: "prematureRestore" }
      ]
    },
    {
      id: "failedRemoval",
      title: "Inadequate Remediation",
      content: "Your attempt to remove the malware alerts the attacker. They activate a wiper program that corrupts critical financial databases before you can stop them.",
      image: "images/corrupted-database-screen.jpg",
      isFinal: true,
      success: false
    },
    {
      id: "findBackdoors",
      title: "Hunting for Backdoors",
      content: "You identify and remove the rogue admin account, as well as two scheduled tasks designed to download additional malware. The attacker's persistence has been broken.",
      image: "images/backdoor-discovery-console.jpg",
      decisions: [
        { text: "Conduct a full security audit", next: "securityAudit" },
        { text: "Declare the incident resolved", next: "prematureClosure" }
      ]
    },
    {
      id: "dataAssessment",
      title: "Breach Assessment",
      content: "You focus on identifying stolen data while the attacker uses their backdoor admin account to install ransomware across the network. Systems begin locking up company-wide.",
      image: "images/ransomware-lock-screen.jpg",
      isFinal: true,
      success: false
    },
    {
      id: "lateResponse",
      title: "Delayed Team Response",
      content: "The formal response begins, but valuable time has been lost. The team contains the breach, but not before customer data was compromised. The company will face regulatory penalties.",
      image: "images/breach-containment-dashboard.jpg",
      isFinal: true,
      success: false
    },
    {
      id: "missingEvidence",
      title: "Evidence Contamination",
      content: "By patching systems without proper forensic procedure, you've destroyed valuable evidence about the attack. The security team can't determine the full scope of the breach.",
      image: "images/forensic-investigation-screen.jpg",
      isFinal: true,
      success: false
    },
    {
      id: "breachNotification",
      title: "Breach Response",
      content: "You follow regulatory requirements and notify affected customers about the data breach. While damage was done, your transparent handling prevents further reputation damage.",
      image: "images/customer-notification-email.jpg",
      isFinal: true,
      success: true
    },
    {
      id: "prematureRestore",
      title: "Evidence Loss",
      content: "Restoring from backups destroys forensic evidence. Without understanding the attack vector, the same vulnerability remains. The attacker regains access within days.",
      image: "images/system-compromise-alert.jpg",
      isFinal: true,
      success: false
    },
    {
      id: "securityAudit",
      title: "Comprehensive Audit",
      content: "The security audit reveals and addresses additional vulnerabilities. Though some data was compromised, your methodical response prevented a much larger breach.",
      image: "images/security-audit-report.jpg",
      isFinal: true,
      success: true
    },
    {
      id: "prematureClosure",
      title: "Incomplete Remediation",
      content: "Declaring the incident resolved was premature. Two weeks later, the same attacker returns through an undiscovered backdoor, this time exfiltrating intellectual property.",
      image: "images/second-breach-alert.jpg",
      isFinal: true,
      success: false
    }
  ]
};

// Data validation function
function validateCourseData(data) {
  const chapterIds = new Set(data.chapters.map(ch => ch.id));
  let isValid = true;

  data.chapters.forEach((chapter, index) => {
    if (chapter.decisions) {
      chapter.decisions.forEach((dec, decIndex) => {
        if (!chapterIds.has(dec.next)) {
          console.error(`Invalid next ID "${dec.next}" in chapter "${chapter.id}" decision ${decIndex + 1}`);
          isValid = false;
        }
      });
    }
  });

  if (isValid) {
    console.log("Course data validation passed.");
  } else {
    console.error("Course data validation failed. Check console for details.");
  }

  return isValid;
}

// Run validation
validateCourseData(courseData);