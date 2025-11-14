# ⚖️ NYAYASETU - Bridge to Justice

## 🎯 Project Overview

**Nyayasetu** is an **AI-powered Legal Justice Portal** that makes Indian legal justice accessible to everyone. It bridges citizens, judges, and the legal system using **Google Gemini AI**, smart case matching, and intelligent legal analysis.

**Mission:** *"Synthesize Legal Complexity, Restore Judicial Access"*

---

## ✨ Key Features

### 👤 **For Citizens**
- 🔍 **Smart Legal Analysis** - Describe your problem, get AI-powered legal guidance
- 📚 **Similar Cases Finder** - Find precedents matching your situation
- 📊 **Success Rate** - See percentage of cases won for your issue type
- 🤖 **Gemini AI Backup** - When no database cases exist, AI generates realistic scenarios
- 📞 **Legal Resources** - Direct access to NALSA and legal aid helplines
- ⏱️ **Timeline Estimates** - Know how long your case typically takes

### ⚖️ **For Judges**
- 📋 **Case Organization** - Input case details, get structured AI analysis
- 🔎 **Precedent Search** - Find related cases and rulings instantly
- ✓ **Document Checker** - Get list of required/missing documents
- 🤖 **AI Case Analysis** - Automatic case structuring and law recommendations
- 📈 **Outcome Predictions** - See similar cases and their results

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Backend** | Google Apps Script (JavaScript) |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Database** | Google Sheets |
| **AI/ML** | Google Gemini 1.5 Flash API |
| **Hosting** | Google Apps Script Web App |
| **Deployment** | Free (Google's infrastructure) |

---

## 📦 Project Files

```
nyayasetu/
│
├── Code.gs              # Backend - Google Apps Script
├── index.html           # Frontend - User Interface
├── README.md            # This file
│
└── Google Sheets (Database)
    ├── Cases            # Legal case records
    ├── Laws             # Indian laws reference
    └── Precedents       # Court precedents (optional)
```

---

## ⚡ Installation & Setup

### **Step 1: Create Google Apps Script Project**

1. Visit [script.google.com](https://script.google.com)
2. Create a new project → Name it "Nyayasetu"
3. Delete any default code

### **Step 2: Add Backend (Code.gs)**

1. Copy entire **Code.gs** file
2. Paste into the editor
3. **Save** (Ctrl+S)

### **Step 3: Create Frontend (index.html)**

1. Click **+ Create** → **HTML file**
2. Name it **`index`** (exactly)
3. Copy entire **index.html** code
4. Paste and **Save**

### **Step 4: Create Database (Google Sheets)**

1. Create new Google Sheet named **"Nyayasetu DB"**
2. Create these sheets with columns:

**Sheet 1: "Cases"**
```
| Case ID | Case Name | Law Used | Outcome | Year | Key Factor |
|---------|-----------|----------|---------|------|-----------|
| 1 | Dowry Harassment Delhi | Dowry Act | Won | 2023 | Strong evidence |
| 2 | Property Dispute Mumbai | Property Act | Won | 2022 | Valid documents |
```

**Sheet 2: "Laws"**
```
| Law ID | Law Name | English | Hindi | Category |
|--------|----------|---------|-------|----------|
| 1 | Dowry Prohibition Act | Prevents dowry | Dahej Adhiniyam | Domestic |
| 2 | IPC 498A | Dowry harassment | Dahej Hinsaa | Criminal |
```

### **Step 5: Link Google Sheet to Apps Script**

1. In Apps Script: **Tools** → **Project Settings**
2. Copy the script ID
3. In Google Sheet: **Tools** → **Script Editor**
4. Paste the script ID

### **Step 6: Deploy Web App**

1. In Apps Script: Click **Deploy** (top right)
2. Click **New deployment**
3. Type: Select **Web app**
4. Execute as: Your email
5. Who has access: **Anyone**
6. Click **Deploy**
7. **Copy the URL** - This is your live app!

---

## 🧪 Testing

### **Test Case 1: Database Match**
```
Tab: Citizens
Category: Property
Situation: "My uncle illegally sold our ancestral land"
Location: Bihar
```
**Expected Result:** Shows similar cases from database + success rate

### **Test Case 2: Gemini AI (No Match)**
```
Tab: Citizens
Category: Employment
Situation: "Boss making inappropriate comments at work"
Location: Karnataka
```
**Expected Result:** Full AI explanation + AI-generated hypothetical cases

### **Test Case 3: Judge Portal**
```
Tab: Judges
Case Title: "Land Ownership Dispute - Ranchi"
Issues: "Siblings fighting over inherited property"
Documents: "Deed, sale agreement, identity proofs"
```
**Expected Result:** AI analysis + related precedents + missing documents list

---

## 🔑 API Configuration

**Gemini API Key is pre-configured** in Code.gs:
```javascript
const apiKey = "AIzaSyA4HfctoX-vJF6rhUYiuN-ok0yUYuJ_oHI";
```

### **To use your own API key:**

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikeys)
2. Click **Create API Key**
3. Enable **"Generative Language API"**
4. Copy your key
5. In Code.gs, replace the `apiKey` variable (around line 100)

### **Quota Limits:**
- Free tier: 60 requests/minute
- Rate limited: Auto-throttles requests
- For production: Upgrade to paid tier

---

## 📊 Database Schema

### **Cases Table**
| Field | Type | Purpose |
|-------|------|---------|
| Case ID | Number | Unique identifier |
| Case Name | Text | Case name with year/location |
| Law Used | Text | Applicable law/section (e.g., IPC 498A) |
| Outcome | Text | "Won" or "Lost" |
| Year | Number | Year case was decided |
| Key Factor | Text | Why it won/lost |

### **Laws Table**
| Field | Type | Purpose |
|-------|------|---------|
| Law ID | Number | Unique identifier |
| Law Name | Text | Official law name |
| English | Text | English explanation (50-100 words) |
| Hindi | Text | Hindi translation (optional) |
| Category | Text | Domestic/Property/Criminal/Employment/Family |

---

## 🤖 How AI Works

**User enters legal problem → Backend processes:**

```
1. Search Google Sheets for similar cases
   ↓
2. Call Gemini API with full problem description
   ↓
3. Gemini analyzes and provides:
   - Applicable Indian laws
   - Citizen rights & protections
   - Possible legal outcomes
   - Recommended next steps
   ↓
4. If no database cases found:
   - Generate AI hypothetical similar cases
   - Show success rates
   ↓
5. Display formatted results in UI
```

---

## 🔒 Security & Privacy

✅ **Safe by default:**
- API key is for Gemini (public API)
- All data stored in your own Google Sheets
- No data sent to third parties
- Open-source code (audit-able)

⚠️ **For Production:**
- Add user authentication
- Implement rate limiting
- Add API key rotation
- Use environment variables (not hardcoded keys)
- Add data encryption
- Implement audit logging

---

## 📱 User Interface

### **Citizen Portal**
- Category dropdown (Domestic/Property/Criminal/Employment/Family/Other)
- Text area for problem description
- Location selector (all Indian states)
- "Find Cases & Get Advice" button
- Results show: AI explanation, similar cases, success rate, next steps, timeline

### **Judge Portal**
- Case title input
- Legal issues text area
- Available documents list
- "Organize Case & Find Precedents" button
- Results show: Case analysis, related precedents, missing documents, timeline

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| **"Could not generate" error** | Check Gemini API key is valid. Go to script.google.com → Logs for details |
| **No cases showing** | Ensure "Cases" sheet exists with data. Check sheet name spelling |
| **"Script not found"** | Verify `doGet()` function exists in Code.gs. Redeploy |
| **404 on deployment** | Set deployment access to "Anyone". Redeploy new version |
| **Slow response** | Check Google Sheets permissions. Large databases may need pagination |
| **Blank AI explanation** | Gemini API quota exceeded. Wait 60 seconds or use paid tier |

---

## 🚀 Deployment Checklist

- [ ] Code.gs created and saved
- [ ] index.html created and saved
- [ ] Google Sheet created with "Cases" and "Laws" sheets
- [ ] Sample data added to sheets
- [ ] Gemini API key verified (or using provided key)
- [ ] Web app deployed with "Anyone" access
- [ ] URL copied
- [ ] Tested with sample queries
- [ ] Both portals (Citizen & Judge) working
- [ ] Results displaying correctly

---

## 📈 Future Enhancements

**Phase 2:**
- [ ] Real-time integration with Indian court databases
- [ ] Multi-language support (Hindi, Tamil, Telugu, Marathi, Bengali)
- [ ] Lawyer directory/finder
- [ ] Document upload and AI analysis
- [ ] Case progress tracking
- [ ] SMS/WhatsApp bot integration

**Phase 3:**
- [ ] Mobile app (iOS/Android)
- [ ] Cloud database (Firebase/PostgreSQL)
- [ ] User authentication & profiles
- [ ] Advanced analytics & insights
- [ ] Video consultation integration
- [ ] Real-time case tracking

---

## 💡 Use Cases

### **For Citizens:**
> "I'm facing dowry harassment. What are my rights?"
→ Get legal explanation, similar cases, success rate, next steps

### **For Lawyers:**
> "I have a property dispute case. What precedents should I know?"
→ Find related cases, outcomes, and legal strategies

### **For Judges:**
> "Organizing a complex family law case. What documents do I need?"
→ Get checklist, similar cases, suggested timeline

### **For Law Students:**
> "Research project on IPC 498A. Show me similar cases"
→ Access database of real cases with outcomes

---

## 📚 Resources

- **Indian Penal Code**: [ipc.gov.in](https://ipc.gov.in)
- **National Legal Services Authority**: [nalsa.gov.in](https://nalsa.gov.in)
- **Supreme Court of India**: [supremecourt.gov.in](https://supremecourt.gov.in)
- **Google Gemini API Docs**: [ai.google.dev](https://ai.google.dev)

---

## 🎓 Technical Architecture

```
┌─────────────────────────────────────────┐
│         User Interface (index.html)      │
│  - Citizen Form & Judge Form             │
│  - Tab Navigation                        │
└────────────────┬────────────────────────┘
                 │
                 ↓ (google.script.run)
┌─────────────────────────────────────────┐
│    Google Apps Script Backend            │
│    - Form validation                     │
│    - Database queries                    │
│    - Gemini API calls                    │
│    - Response formatting                 │
└────────────────┬────────────────────────┘
                 │
        ┌────────┴────────┐
        ↓                 ↓
   ┌─────────────┐   ┌──────────────┐
   │  Google     │   │  Gemini AI   │
   │  Sheets DB  │   │  (Gemini API)│
   └─────────────┘   └──────────────┘
```

---

## 📝 License & Credits

- **Built for:** KodeKalesh 2025 Hackathon
- **Technology:** Google Apps Script + Gemini AI
- **Vision:** Make Indian justice system accessible to all
- **Open Source:** Available for educational use

---

## 🤝 Contributing

Want to improve Nyayasetu? You can:
- Add more legal cases to database
- Improve AI prompts for better explanations
- Add more law categories
- Implement new features
- Report bugs

---

## 📞 Support

**Issues or questions?**
- Check logs: Apps Script → View > Logs
- Test with sample queries from README
- Verify API key is valid
- Ensure Google Sheets has proper data

---

## 🎉 Quick Start (5 minutes)

1. ✅ Create Apps Script project
2. ✅ Paste Code.gs
3. ✅ Create index.html
4. ✅ Create Google Sheet with sample data
5. ✅ Deploy as Web App
6. ✅ Share URL - You're live!

**Congratulations! Your Nyayasetu is ready for use!**

---

**⚖️ Justice for All | Nyayasetu 2025**