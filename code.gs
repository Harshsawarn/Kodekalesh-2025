// 1. GET SHEET DATA
function getSheetData(sheetName) {
  if (!sheetName) throw new Error('No sheet name given!');
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) throw new Error('Sheet not found: ' + sheetName);
  return sheet.getDataRange().getValues();
}

// 2. FIND SIMILAR CASES - FIXED VERSION
function findSimilarCases(userProblem, lawCategory) {
  try {
    if (!userProblem) userProblem = "";
    if (!lawCategory) lawCategory = "";
    
    const casesData = getSheetData("Cases");
    let similarCases = [];
    if (!casesData || casesData.length <= 1) return [];
    
    const keywords = userProblem.toString().toLowerCase().split(" ").filter(k => k.length > 2);
    const categoryLower = lawCategory.toString().toLowerCase();
    
    for (let i = 1; i < casesData.length; i++) {
      const caseRow = casesData[i];
      if (!caseRow || caseRow.length < 6) continue;
      
      const caseId = caseRow[0] || "";
      const caseName = (caseRow[1] || "").toString();
      const lawUsed = (caseRow[2] || "").toString();
      const outcome = caseRow[3] || "";
      const year = caseRow[4] || "";
      const keyFactor = (caseRow[5] || "").toString();
      
      const caseText = (caseName + " " + lawUsed + " " + keyFactor).toLowerCase();
      
      const matches = (keywords.length > 0 && keywords.some(kw => caseText.includes(kw))) || 
                     (categoryLower.length > 0 && caseText.includes(categoryLower));
      
      if (matches) {
        similarCases.push({
          id: caseId,
          name: caseName,
          law: lawUsed,
          outcome: outcome,
          year: year,
          factor: keyFactor
        });
      }
    }
    return similarCases.slice(0, 5);
  } catch (error) {
    Logger.log("findSimilarCases Error: " + error.toString());
    return [];
  }
}

// 3. CALCULATE SUCCESS RATE
function calculateSuccessRate(cases) {
  if (!cases || cases.length === 0) return {won:0, total:0, percentage:0};
  let won = cases.filter(c => c.outcome && c.outcome.toString().toLowerCase() === "won").length;
  let percentage = cases.length > 0 ? Math.round((won / cases.length) * 100) : 0;
  return {won: won, total: cases.length, percentage: percentage};
}

// 4. GEMINI API - DETAILED AI EXPLANATION
function simplifyLawWithGemini(lawText) {
  const apiKey = "AIzaSyA4HfctoX-vJF6rhUYiuN-ok0yUYuJ_oHI";
  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;

  if (!lawText || lawText.length < 2) {
    return "Please provide more details about your legal issue for AI analysis.";
  }

  const payload = {
    contents: [{
      parts: [{
        text: "You are an expert Indian legal advisor. Analyze this legal situation and provide: 1) Applicable Indian laws, 2) Citizens rights and protections, 3) Key legal points, 4) Possible outcomes, 5) Immediate actions. Keep response 150-200 words, simple language: " + lawText
      }]
    }]
  };

  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const result = JSON.parse(response.getContentText());

    Logger.log("Gemini API Response: " + JSON.stringify(result));

    if (result.candidates && result.candidates[0] && result.candidates[0].content && 
        result.candidates[0].content.parts && result.candidates[0].content.parts[0] && 
        result.candidates[0].content.parts[0].text) {
      const text = result.candidates[0].content.parts[0].text.trim();
      if (text && text.length > 10) {
        return text;
      }
    }

    if (result.error && result.error.message) {
      return "Gemini Error: " + result.error.message + " (Check API key and quota)";
    }

    return "AI could not generate explanation. Please check API key and billing.";
  } catch (error) {
    Logger.log("Gemini Fetch Error: " + error.toString());
    return "Error connecting to AI: " + error.toString();
  }
}

// 5. GENERATE CASES FROM GEMINI
function generateGeminiCases(lawCategory, problem) {
  if (!lawCategory) lawCategory = "Legal Issue";
  if (!problem) problem = "General legal matter";
  
  const prompt = `Generate 3 realistic Indian court cases for a ${lawCategory} issue about: "${problem}". 
  Return ONLY valid JSON array (no markdown or explanation): 
  [{name: "Case Name Year", law: "Law Name", outcome: "Won", year: 2023, factor: "Key reason"}, {name: "Case 2", law: "Law", outcome: "Lost", year: 2022, factor: "Reason"}]`;
  
  const apiKey = "AIzaSyA4HfctoX-vJF6rhUYiuN-ok0yUYuJ_oHI";
  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;
  
  const payload = {contents: [{parts: [{text: prompt}]}]};
  const options = {method: "post", contentType: "application/json", payload: JSON.stringify(payload), muteHttpExceptions: true};
  
  try {
    const response = UrlFetchApp.fetch(url, options);
    const result = JSON.parse(response.getContentText());
    
    if (result.candidates && result.candidates[0]) {
      const text = result.candidates[0].content.parts[0].text;
      Logger.log("Generated cases: " + text);
      
      try {
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const cases = JSON.parse(jsonMatch[0]);
          return cases.map((c, i) => ({
            id: i + 1,
            name: (c.name || "AI Case " + (i+1)),
            law: (c.law || lawCategory),
            outcome: (c.outcome && c.outcome.toLowerCase().includes("won")) ? "Won" : "Lost",
            year: (c.year || 2023),
            factor: (c.factor || "Legal arguments")
          }));
        }
      } catch (parseError) {
        Logger.log("JSON parse error: " + parseError);
      }
    }
    return [];
  } catch (error) {
    Logger.log("Gemini Cases Error: " + error.toString());
    return [];
  }
}

// 6. GENERATE CITIZEN RESPONSE
function generateCitizenResponse(problem, lawCategory, location) {
  if (!problem) problem = "Legal issue";
  if (!lawCategory) lawCategory = "General";
  if (!location) location = "India";
  
  const cases = findSimilarCases(problem, lawCategory);
  const successRate = calculateSuccessRate(cases);
  
  let aiExplanation = simplifyLawWithGemini(lawCategory + " - " + problem);
  
  let similarCases = cases;
  if (cases.length === 0) {
    similarCases = generateGeminiCases(lawCategory, problem);
  }
  
  let nextSteps = getCustomNextSteps(lawCategory, location);
  let timeline = getCustomTimeline(lawCategory);
  
  return {
    problem: problem,
    category: lawCategory,
    location: location,
    aiExplanation: aiExplanation,
    similarCases: similarCases,
    successRate: successRate,
    nextSteps: nextSteps,
    timeline: timeline,
    helpline: {
      name: "National Legal Services Authority",
      phone: "1877-LEGAL-AID",
      website: "https://nalsa.gov.in/"
    }
  };
}

// 7. GET CUSTOM NEXT STEPS
function getCustomNextSteps(category, location) {
  if (!category) category = "Other";
  
  const steps = {
    "Domestic": [
      "1. Contact women's helpline in " + (location || "your area"),
      "2. Register FIR at police station",
      "3. Consult family law attorney",
      "4. Gather evidence (messages, witnesses)",
      "5. File petition in family court"
    ],
    "Property": [
      "1. Get property documents verified",
      "2. Conduct title search",
      "3. Consult property lawyer",
      "4. File claim with evidence",
      "5. Attend court hearings"
    ],
    "Criminal": [
      "1. File police complaint (FIR)",
      "2. Get FIR copy",
      "3. Hire criminal lawyer",
      "4. Collect evidence & witnesses",
      "5. Appear in criminal court"
    ],
    "Employment": [
      "1. Report to HR with documents",
      "2. File complaint at labor board",
      "3. Consult employment lawyer",
      "4. Gather evidence of harassment",
      "5. File case in labor court"
    ],
    "Family": [
      "1. Consult family court lawyer",
      "2. Gather family documents",
      "3. File petition",
      "4. Attend court hearings",
      "5. Follow court orders"
    ]
  };
  
  return steps[category] || [
    "1. Collect all documents",
    "2. Consult legal professional",
    "3. File case with evidence",
    "4. Attend hearings",
    "5. Follow court orders"
  ];
}

// 8. GET CUSTOM TIMELINE
function getCustomTimeline(category) {
  const timelines = {
    "Domestic": "1-2 years",
    "Property": "3-5 years",
    "Criminal": "2-4 years",
    "Employment": "6-18 months",
    "Family": "1-2 years"
  };
  
  return timelines[category] || "2-3 years (typical in India)";
}

// 9. GENERATE JUDGE RESPONSE
function generateJudgeResponse(caseTitle, legalIssues, documents) {
  if (!caseTitle) caseTitle = "Case";
  if (!legalIssues) legalIssues = "Legal matter";
  if (!documents) documents = "";
  
  const cases = findSimilarCases(legalIssues, "");
  let aiAnalysis = simplifyLawWithGemini("Case: " + caseTitle + ". Issues: " + legalIssues);
  
  return {
    title: caseTitle,
    issues: legalIssues,
    aiAnalysis: aiAnalysis,
    relatedPrecedents: cases,
    missingDocuments: ["Party ID", "Petition", "Affidavit", "Evidence", "Court orders"],
    suggestedTimeline: "18 months",
    nextAction: "Schedule first hearing",
    precedentAnalysis: `Found ${cases.length} precedents. ${cases.filter(c => c.outcome && c.outcome.toString().toLowerCase() === "won").length} ruled similarly.`
  };
}

// 10. DO GET - SERVE WEB APP
function doGet() {
  try {
    return HtmlService.createHtmlOutputFromFile("index");
  } catch (error) {
    return HtmlService.createHtmlOutput("Error: " + error.toString());
  }
}

// 11. DO POST - HANDLE FORM DATA
function doPost(e) {
  const params = e.parameter;
  if (params.type === "citizen") {
    const response = generateCitizenResponse(params.problem || "", params.category || "", params.location || "");
    return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
  }
  if (params.type === "judge") {
    const response = generateJudgeResponse(params.caseTitle || "", params.issues || "", params.documents || "");
    return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
  }
}
