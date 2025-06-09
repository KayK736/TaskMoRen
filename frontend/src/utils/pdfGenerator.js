import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateTaskPDF = (tasks) => {
  try {
    if (!Array.isArray(tasks)) {
      throw new Error('Tasks must be an array');
    }

    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Task List', 14, 15);
    
    // Add date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 25);

    // Prepare table data
    const tableData = tasks.map(task => [
      task.title || 'N/A',
      task.description || 'N/A',
      task.status || 'N/A',
      task.priority || 'N/A',
      task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'
    ]);

    // Add table
    autoTable(doc, {
      head: [['Title', 'Description', 'Status', 'Priority', 'Due Date']],
      body: tableData,
      startY: 35,
      styles: {
        fontSize: 10,
        cellPadding: 5,
      },
      headStyles: {
        fillColor: [79, 70, 229],
        textColor: 255,
        fontSize: 12,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    // Save the PDF
    doc.save('task-list.pdf');
  } catch (error) {
    console.error('Error in generateTaskPDF:', error);
    throw new Error(`Failed to generate task PDF: ${error.message}`);
  }
};

export const generateSchedulePDF = (schedules) => {
  try {
    if (!Array.isArray(schedules)) {
      throw new Error('Schedules must be an array');
    }

    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Schedule Plan', 14, 15);
    
    // Add date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 25);

    // Prepare table data
    const tableData = schedules.map(schedule => [
      schedule.title || 'N/A',
      schedule.description || 'N/A',
      schedule.date ? new Date(schedule.date).toLocaleDateString() : 'N/A',
      schedule.startTime || 'N/A',
      schedule.endTime || 'N/A',
      schedule.type || 'N/A',
      schedule.priority || 'N/A'
    ]);

    // Add table
    autoTable(doc, {
      head: [['Title', 'Description', 'Date', 'Start Time', 'End Time', 'Type', 'Priority']],
      body: tableData,
      startY: 35,
      styles: {
        fontSize: 10,
        cellPadding: 5,
      },
      headStyles: {
        fillColor: [79, 70, 229],
        textColor: 255,
        fontSize: 12,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    // Save the PDF
    doc.save('schedule-plan.pdf');
  } catch (error) {
    console.error('Error in generateSchedulePDF:', error);
    throw new Error(`Failed to generate schedule PDF: ${error.message}`);
  }
}; 