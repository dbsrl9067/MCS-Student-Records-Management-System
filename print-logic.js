import { jsPDF } from "jspdf";

export const generateCertificate = (studentData, type) => {
  const doc = new jsPDF();
  
  // 1. school header (logo and schoolname)
  doc.setFontSize(20);
  doc.text("HBC Christian Academy", 105, 20, { align: "center" });
  
  // 2. Setting certification type 
  doc.setFontSize(16);
  const title = type === 'enrollment' ? 'CERTIFICATE OF ENROLLMENT' : 'OFFICIAL TRANSCRIPT';
  doc.text(title, 105, 40, { align: "center" });

  // 3. Enter student's infomation
  doc.setFontSize(12);
  doc.text(`Name: ${studentData.name_en}`, 20, 60);
  doc.text(`Student ID: ${studentData.sid}`, 20, 70);
  doc.text(`Ethnicity: ${studentData.ethnicity}`, 20, 80);
  doc.text(`Date of Birth: ${studentData.birth_date}`, 20, 90);

  // 4. public stamp image (Use saved image in local with Base64) 
  // doc.addImage(schoolSealBase64, 'PNG', 150, 250, 40, 40);

  // 5. PDF download and printout
  doc.save(`${studentData.sid}_${type}.pdf`);
};