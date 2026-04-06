Myanmar School Student Information System (SIS)
A hybrid student management solution designed for environments with unstable internet connectivity, specifically tailored for Christian schools in Myanmar.

🌟 Key Features
Offline-First Architecture: Work seamlessly without an internet connection.

Ethnic Diversity Tracking: Dedicated data fields for Myanmar's 135+ ethnic groups.

Faith-Based Integration: Management of baptismal records and spiritual growth data.

Hybrid Sync: Secure data transfer via USB encrypted backups for remote areas.

PWA Support: Installable on desktops and mobile devices via browser caching.

🛠 Setup & Installation
1. Local Environment
Ensure you have Node.js installed, then run:

Bash
# Install dependencies
npm install

# Run development server
npm run dev
Open http://localhost:3000 to view the system locally.

2. Deployment
To make the dashboard accessible globally (as a central command center):

Push this repository to your GitHub.

Connect the repository to Vercel.

The system will be automatically deployed with a public URL.

📁 Data Collection Workflow
For schools located in "Zero-Internet" zones, follow this protocol:

Data Entry: Teachers enter student information into the provided Student_Template.xlsx.

Conversion: Use the excel_to_db.py script to convert Excel data into system-compatible JSON.

USB Transfer: Copy the encrypted data to a USB drive and transport it to a location with internet access.

Central Sync: Log in to the Vercel dashboard and click "Import USB Data" to merge local records into the cloud database.

⚠️ Important Notices
Connectivity: Thanks to PWA (Progressive Web App) technology, the core UI remains accessible even when offline after the first load.

Data Privacy: Always ensure backup files are encrypted before physical transport.

Standardization: Please use the predefined "Ethnicity Codes" to ensure accurate national statistics.

📊 Analytics Dashboard
Once synced, the system automatically generates:

Annual Enrollment Growth Rates

Ethnic Distribution Charts

Baptismal Status Statistics

💡 Tip for Collaborators
If you are a volunteer or a researcher looking to contribute to this project, please refer to the CONTRIBUTING.md (to be created) for data schema details and UI guidelines.