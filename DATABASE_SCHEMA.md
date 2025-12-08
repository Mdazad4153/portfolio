# 🗄️ MongoDB Database Schema - Md Azad Portfolio

## 📊 Database Overview

**Database Name:** `portfolio`  
**Total Collections:** 11  
**Database Type:** MongoDB (NoSQL)  
**Connection:** MongoDB Atlas

---

## 📋 Collections Summary

| # | Collection | Purpose | Fields Count | Timestamps |
|---|------------|---------|--------------|------------|
| 1 | **admins** | Admin authentication | 7 | ✅ |
| 2 | **profiles** | Personal profile data | 14 | ✅ |
| 3 | **skills** | Technical skills | 7 | ✅ |
| 4 | **educations** | Education history | 10 | ✅ |
| 5 | **projects** | Portfolio projects | 13 | ✅ |
| 6 | **certificates** | Certificates & awards | 6 | ✅ |
| 7 | **services** | Services offered | 7 | ✅ |
| 8 | **blogs** | Blog posts | 12 | ✅ |
| 9 | **testimonials** | Client testimonials | 8 | ✅ |
| 10 | **contacts** | Contact form messages | 10 | ✅ |
| 11 | **settings** | Site configuration | 14 | ✅ |

---

## 🔐 1. Admin Collection (`admins`)

**Purpose:** Admin user authentication and management

```javascript
{
  _id: ObjectId,                    // Auto-generated MongoDB ID
  email: String,                    // ✅ Required, Unique - Admin email
  password: String,                 // ✅ Required - Hashed password (bcrypt)
  name: String,                     // Default: 'Admin' - Admin display name
  lastLogin: Date,                  // Last successful login timestamp
  loginAttempts: Number,            // Default: 0 - Failed login counter
  lockUntil: Date,                  // Account lock expiry date
  createdAt: Date,                  // ✅ Auto - Record creation time
  updatedAt: Date                   // ✅ Auto - Last update time
}
```

**Methods:**
- `comparePassword(candidatePassword)` - Verify password
- `generateAuthToken()` - Generate JWT token (7 days expiry)

**Hooks:**
- `pre('save')` - Hash password before saving

**Security:**
- Bcrypt hashing (rounds: 12)
- JWT tokens with 7-day expiry
- Login attempt tracking
- Account locking mechanism

---

## 👤 2. Profile Collection (`profiles`)

**Purpose:** Store personal profile information

```javascript
{
  _id: ObjectId,
  name: String,                     // Default: 'Md Azad'
  fullName: String,                 // Default: 'Md Azad Ansari'
  title: String,                    // Default: 'Computer Science Student'
  tagline: String,                  // Professional tagline
  bio: String,                      // Short biography
  about: String,                    // Detailed about section
  email: String,                    // Contact email
  phone: String,                    // Contact phone
  address: String,                  // Default: 'Chhapra, Bihar, India'
  profileImage: String,             // Profile photo URL/path
  resumeUrl: String,                // Resume/CV file URL
  
  socialLinks: {                    // Social media links
    github: String,
    linkedin: String,
    twitter: String,
    instagram: String,
    facebook: String,
    youtube: String,
    whatsapp: String,
    telegram: String
  },
  
  typingTexts: [String],            // Array of typing animation texts
  
  stats: {                          // Portfolio statistics
    projectsCompleted: Number,      // Default: 0
    happyClients: Number,           // Default: 0
    yearsExperience: Number,        // Default: 0
    certificatesEarned: Number      // Default: 0
  },
  
  isAvailable: Boolean,             // Default: true - Available for work
  createdAt: Date,
  updatedAt: Date
}
```

**Note:** Usually only 1 document in this collection

---

## 💻 3. Skill Collection (`skills`)

**Purpose:** Technical and soft skills showcase

```javascript
{
  _id: ObjectId,
  name: String,                     // ✅ Required - Skill name (e.g., "JavaScript")
  category: String,                 // ✅ Enum - Skill category
  proficiency: Number,              // 0-100 - Skill level percentage
  icon: String,                     // Icon identifier or URL
  order: Number,                    // Default: 0 - Display order
  isVisible: Boolean,               // Default: true - Show on portfolio
  createdAt: Date,
  updatedAt: Date
}
```

**Category Enum:**
- `frontend` - Frontend technologies
- `backend` - Backend technologies
- `database` - Database systems
- `tools` - Development tools
- `soft-skills` - Soft skills
- `ai` - AI/ML tools
- `office` - Office software
- `other` - Miscellaneous

**Example:**
```javascript
{
  name: "JavaScript",
  category: "frontend",
  proficiency: 85,
  icon: "javascript",
  order: 1,
  isVisible: true
}
```

---

## 🎓 4. Education Collection (`educations`)

**Purpose:** Academic background and qualifications

```javascript
{
  _id: ObjectId,
  institution: String,              // ✅ Required - School/University name
  degree: String,                   // ✅ Required - Degree type (e.g., "Diploma")
  field: String,                    // ✅ Required - Field of study (e.g., "CSE")
  startYear: String,                // ✅ Required - Start year
  endYear: String,                  // Default: 'Present' - End year
  websiteUrl: String,               // Institution website URL
  grade: String,                    // Grade/GPA/Percentage
  description: String,              // Additional details
  isCurrent: Boolean,               // Default: false - Currently studying
  order: Number,                    // Default: 0 - Display order
  isVisible: Boolean,               // Default: true - Show on portfolio
  createdAt: Date,
  updatedAt: Date
}
```

**Example:**
```javascript
{
  institution: "Government Polytechnic Chhapra",
  degree: "Diploma",
  field: "Computer Science & Engineering",
  startYear: "2023",
  endYear: "Present",
  isCurrent: true,
  grade: "First Division",
  order: 1
}
```

---

## 🚀 5. Project Collection (`projects`)

**Purpose:** Portfolio projects showcase

```javascript
{
  _id: ObjectId,
  title: String,                    // ✅ Required - Project name
  description: String,              // ✅ Required - Short description
  longDescription: String,          // Detailed description
  image: String,                    // Main project image URL
  images: [String],                 // Additional images array
  technologies: [String],           // Tech stack array (e.g., ["React", "Node.js"])
  category: String,                 // ✅ Enum - Project type
  liveUrl: String,                  // Live demo URL
  githubUrl: String,                // GitHub repository URL
  featured: Boolean,                // Default: false - Featured project
  order: Number,                    // Default: 0 - Display order
  isVisible: Boolean,               // Default: true - Show on portfolio
  completedDate: Date,              // Default: Date.now - Completion date
  createdAt: Date,
  updatedAt: Date
}
```

**Category Enum:**
- `web` - Web application
- `mobile` - Mobile app
- `desktop` - Desktop application
- `api` - API/Backend service
- `other` - Other types

**Example:**
```javascript
{
  title: "E-Commerce Platform",
  description: "Full-stack e-commerce solution",
  technologies: ["React", "Node.js", "MongoDB"],
  category: "web",
  liveUrl: "https://demo.com",
  githubUrl: "https://github.com/user/project",
  featured: true
}
```

---

## 🏆 6. Certificate Collection (`certificates`)

**Purpose:** Certifications and achievements

```javascript
{
  _id: ObjectId,
  title: String,                    // ✅ Required - Certificate name
  issuer: String,                   // ✅ Required - Issuing organization
  date: Date,                       // Issue date
  credentialUrl: String,            // Verification URL
  description: String,              // Certificate details
  order: Number,                    // Default: 0 - Display order
  createdAt: Date,
  updatedAt: Date
}
```

**Example:**
```javascript
{
  title: "JavaScript Advanced Certification",
  issuer: "Udemy",
  date: "2024-01-15",
  credentialUrl: "https://udemy.com/certificate/ABC123",
  order: 1
}
```

---

## 🛠️ 7. Service Collection (`services`)

**Purpose:** Services offered to clients

```javascript
{
  _id: ObjectId,
  title: String,                    // ✅ Required - Service name
  description: String,              // ✅ Required - Service description
  icon: String,                     // Default: 'code' - Icon identifier
  features: [String],               // Service features array
  price: String,                    // Pricing information
  order: Number,                    // Default: 0 - Display order
  isVisible: Boolean,               // Default: true - Show on portfolio
  createdAt: Date,
  updatedAt: Date
}
```

**Example:**
```javascript
{
  title: "Web Development",
  description: "Custom website development",
  icon: "code",
  features: ["Responsive Design", "SEO Optimized", "Fast Loading"],
  price: "Starting from ₹5000",
  isVisible: true
}
```

---

## 📝 8. Blog Collection (`blogs`)

**Purpose:** Blog posts and articles

```javascript
{
  _id: ObjectId,
  title: String,                    // ✅ Required - Blog title
  slug: String,                     // ✅ Required, Unique - URL-friendly slug
  excerpt: String,                  // ✅ Required - Short summary
  content: String,                  // ✅ Required - Full blog content
  coverImage: String,               // Cover image URL
  category: String,                 // Default: 'General' - Blog category
  tags: [String],                   // Tags array
  views: Number,                    // Default: 0 - View count
  likes: Number,                    // Default: 0 - Like count
  isPublished: Boolean,             // Default: false - Publish status
  publishedAt: Date,                // Publish timestamp
  isVisible: Boolean,               // Default: true - Show on portfolio
  createdAt: Date,
  updatedAt: Date
}
```

**Hooks:**
- `pre('save')` - Auto-generate slug from title

**Example:**
```javascript
{
  title: "Understanding React Hooks",
  slug: "understanding-react-hooks",
  excerpt: "A comprehensive guide to React Hooks",
  content: "Full article content...",
  category: "Tutorial",
  tags: ["React", "JavaScript", "Frontend"],
  isPublished: true,
  publishedAt: "2024-02-01"
}
```

---

## ⭐ 9. Testimonial Collection (`testimonials`)

**Purpose:** Client reviews and testimonials

```javascript
{
  _id: ObjectId,
  name: String,                     // ✅ Required - Client name
  role: String,                     // Client's job title
  company: String,                  // Client's company
  image: String,                    // Client photo URL
  content: String,                  // ✅ Required - Testimonial text
  rating: Number,                   // 1-5 - Star rating (Default: 5)
  order: Number,                    // Default: 0 - Display order
  isVisible: Boolean,               // Default: true - Show on portfolio
  createdAt: Date,
  updatedAt: Date
}
```

**Validation:**
- Rating: Min 1, Max 5

**Example:**
```javascript
{
  name: "John Doe",
  role: "CEO",
  company: "Tech Corp",
  content: "Excellent work! Highly recommended.",
  rating: 5,
  isVisible: true
}
```

---

## 📧 10. Contact Collection (`contacts`)

**Purpose:** Contact form submissions

```javascript
{
  _id: ObjectId,
  name: String,                     // ✅ Required - Sender name
  email: String,                    // ✅ Required - Sender email
  phone: String,                    // Sender phone
  subject: String,                  // ✅ Required - Message subject
  message: String,                  // ✅ Required - Message content
  isRead: Boolean,                  // Default: false - Read status
  isReplied: Boolean,               // Default: false - Reply status
  replyMessage: String,             // Admin reply text
  repliedAt: Date,                  // Reply timestamp
  createdAt: Date,                  // Message received time
  updatedAt: Date
}
```

**Workflow:**
1. User submits contact form
2. Message saved with `isRead: false`
3. Admin views message → `isRead: true`
4. Admin replies → `isReplied: true`, `repliedAt` set

**Example:**
```javascript
{
  name: "Jane Smith",
  email: "jane@example.com",
  subject: "Project Inquiry",
  message: "I'd like to discuss a project...",
  isRead: true,
  isReplied: true,
  replyMessage: "Thank you for reaching out...",
  repliedAt: "2024-02-15T10:30:00Z"
}
```

---

## ⚙️ 11. Settings Collection (`settings`)

**Purpose:** Site-wide configuration

```javascript
{
  _id: ObjectId,
  siteName: String,                 // Default: 'Md Azad Portfolio'
  siteDescription: String,          // Default: 'Personal Portfolio Website'
  logo: String,                     // Logo image URL
  favicon: String,                  // Favicon image URL
  primaryColor: String,             // Default: '#6366f1' - Main brand color
  secondaryColor: String,           // Default: '#8b5cf6' - Secondary color
  accentColor: String,              // Default: '#06b6d4' - Accent color
  defaultTheme: String,             // ✅ Enum: 'light', 'dark', 'system'
  enableBlog: Boolean,              // Default: true - Enable blog section
  enableTestimonials: Boolean,      // Default: true - Enable testimonials
  enableServices: Boolean,          // Default: true - Enable services
  enableContact: Boolean,           // Default: true - Enable contact form
  maintenanceMode: Boolean,         // Default: false - Maintenance mode
  seoKeywords: [String],            // SEO keywords array
  googleAnalyticsId: String,        // GA tracking ID
  customCss: String,                // Custom CSS code
  customJs: String,                 // Custom JavaScript code
  createdAt: Date,
  updatedAt: Date
}
```

**Note:** Usually only 1 document in this collection

**Example:**
```javascript
{
  siteName: "Md Azad Portfolio",
  primaryColor: "#6366f1",
  defaultTheme: "dark",
  enableBlog: true,
  maintenanceMode: false,
  seoKeywords: ["web developer", "portfolio", "CSE student"]
}
```

---

## 🔗 Relationships & Data Flow

```
┌─────────────┐
│   ADMIN     │ ─── Manages ──► All Collections
└─────────────┘

┌─────────────┐
│  PROFILE    │ ─── Stats ────► Projects, Certificates Count
└─────────────┘

┌─────────────┐
│  SKILLS     │ ─── Display ──► By Category & Order
└─────────────┘

┌─────────────┐
│ EDUCATION   │ ─── Timeline ─► By StartYear (DESC)
└─────────────┘

┌─────────────┐
│  PROJECTS   │ ─── Filter ───► By Category
│             │ ─── Feature ──► Featured Flag
└─────────────┘

┌─────────────┐
│CERTIFICATES │ ─── Display ──► By Order & Date
└─────────────┘

┌─────────────┐
│  SERVICES   │ ─── Display ──► Active Services Only
└─────────────┘

┌─────────────┐
│    BLOG     │ ─── Filter ───► Published & Visible
│             │ ─── Track ────► Views & Likes
└─────────────┘

┌─────────────┐
│TESTIMONIALS │ ─── Display ──► By Rating & Order
└─────────────┘

┌─────────────┐
│  CONTACTS   │ ─── Track ────► Read & Reply Status
└─────────────┘

┌─────────────┐
│  SETTINGS   │ ─── Control ──► Feature Toggles
│             │ ─── Theme ────► Site Appearance
└─────────────┘
```

---

## 📊 Data Statistics (After Seeding)

| Collection | Seeded Count | Purpose |
|------------|--------------|---------|
| admins | 1 | Default admin user |
| profiles | 1 | Main profile data |
| skills | ~15 | Sample skills |
| educations | ~3 | Educational qualifications |
| projects | 10 | Sample projects |
| certificates | ~5 | Sample certificates |
| services | ~6 | Service offerings |
| blogs | ~3 | Sample blog posts |
| testimonials | ~5 | Sample testimonials |
| contacts | 0 | Empty (filled by users) |
| settings | 1 | Default settings |

---

## 🔍 Indexes & Performance

**Unique Indexes:**
- `admins.email` - Unique admin email
- `blogs.slug` - Unique blog URL slug

**Recommended Indexes (for scaling):**
```javascript
// Skills - Category filtering
db.skills.createIndex({ category: 1, order: 1 })

// Projects - Featured & category filtering
db.projects.createIndex({ featured: -1, category: 1 })

// Blogs - Published & date sorting
db.blogs.createIndex({ isPublished: 1, publishedAt: -1 })

// Contacts - Status filtering
db.contacts.createIndex({ isRead: 1, createdAt: -1 })
```

---

## 🛡️ Validation Rules

### Field Types
- **String**: Text data
- **Number**: Numeric values
- **Boolean**: true/false flags
- **Date**: Timestamps
- **ObjectId**: MongoDB IDs
- **Array**: List of values

### Common Patterns
- `isVisible`: Control public visibility
- `order`: Control display sequence
- `timestamps`: Auto track created/updated
- `required: true`: Mandatory fields
- `default`: Default values
- `unique`: Prevent duplicates
- `enum`: Allowed values only

---

## 📝 Default Admin Credentials

```
Email: azad79900@gmail.com
Password: Azad@4153
```

⚠️ **IMPORTANT:** Change password after first login!

---

## 🚀 Quick Database Commands

```bash
# Connect to MongoDB
mongo "mongodb+srv://mdazad:PASSWORD@cluster0.pvkwwhz.mongodb.net/portfolio"

# Seed database
node seed.js

# Check connection
node test-db.js
```

---

## 📊 ERD (Entity Relationship Diagram)

```
                    ┌──────────────────┐
                    │     ADMIN        │
                    │  Authentication  │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │   Manages All    │
                    └────────┬─────────┘
         ┌───────────────────┼───────────────────┐
         │                   │                   │
    ┌────▼────┐        ┌─────▼─────┐      ┌─────▼─────┐
    │ PROFILE │        │   SKILLS  │      │ EDUCATION │
    └─────────┘        └───────────┘      └───────────┘
         │
    ┌────▼────┐        ┌───────────┐      ┌───────────┐
    │PROJECTS │        │CERTIFICATES│     │ SERVICES  │
    └─────────┘        └───────────┘      └───────────┘
         │
    ┌────▼────┐        ┌───────────┐      ┌───────────┐
    │  BLOG   │        │TESTIMONIALS│     │ CONTACTS  │
    └─────────┘        └───────────┘      └───────────┘
         │
    ┌────▼────┐
    │SETTINGS │
    └─────────┘
```

---

**Created:** December 8, 2025  
**Database:** MongoDB Atlas  
**Total Collections:** 11  
**Status:** ✅ Production Ready

