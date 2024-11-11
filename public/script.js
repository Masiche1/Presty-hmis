document.getElementById('payButton').addEventListener('click', async function() {
    const phoneNumber = prompt("Enter your phone number:");
    const amount = parseFloat(document.getElementById('totalAmount').textContent);

    try {
        const response = await fetch('http://localhost:3000/mpesa/payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNumber, amount })
        });
        
        const data = await response.json();
        alert('Payment initiated! Check your M-Pesa.');
    } catch (error) {
        console.error('Payment error:', error);
        alert('Payment failed. Please try again.');
    }
});

const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', password: 'password123' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', password: 'mypassword' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', password: 'abc123' },
];

// Display users in the table
function displayUsers() {
    const userList = document.getElementById('userList');
    userList.innerHTML = '';
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>
                <button onclick="viewUser(${user.id})">View</button>
                <button onclick="editUser(${user.id})">Edit</button>
                <button onclick="deactivateUser(${user.id})">Deactivate</button>
                <button onclick="deleteUser(${user.id})">Delete</button>
            </td>
        `;
        userList.appendChild(row);
    });
}

// Create a new user
document.getElementById('createUserForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('newUserName').value;
    const email = document.getElementById('newUserEmail').value;
    const password = document.getElementById('newUserPassword').value;

    const newUser = {
        id: users.length + 1, // Simple ID generation
        name: name,
        email: email,
        password: password // Store the password (use hashing in production)
    };

    users.push(newUser);
    displayUsers();
    
    // Clear the form fields
    document.getElementById('createUserForm').reset();
});

// View user details
function viewUser(userId) {
    const user = users.find(user => user.id === userId);
    alert(`Viewing details for ${user.name}\nEmail: ${user.email}`);
}

// Edit user details
function editUser(userId) {
    const userIndex = users.findIndex(user => user.id === userId);
    const user = users[userIndex];
    const newName = prompt('Edit Name:', user.name);
    const newEmail = prompt('Edit Email:', user.email);
    const newPassword = prompt('Edit Password (leave blank to keep current):', user.password);
    
    if (newName) user.name = newName;
    if (newEmail) user.email = newEmail;
    if (newPassword) user.password = newPassword;

    displayUsers();
}

// Deactivate a user (simple demonstration)
function deactivateUser(userId) {
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
        alert(`${users[userIndex].name} has been deactivated.`);
        users.splice(userIndex, 1); // Remove user for demo purposes
        displayUsers();
    }
}

// Delete a user
function deleteUser(userId) {
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
        users.splice(userIndex, 1);
        displayUsers();
    }
}

// Initialize the user list on page load
displayUsers();

const employees = [
    { name: "John Doe", email: "john@example.com", designation: "Developer", salary: 60000 },
    { name: "Jane Smith", email: "jane@example.com", designation: "Manager", salary: 80000 },
    { name: "Bob Johnson", email: "bob@example.com", designation: "Designer", salary: 55000 },
    { name: "Alice Brown", email: "alice@example.com", designation: "Developer", salary: 62000 },
];

// Initialize statistics and charts
function displayStatistics() {
    const employeeCount = document.getElementById('employeeCount');
    const avgSalary = document.getElementById('avgSalary');
    const designationStats = document.getElementById('designationStats');
    const designationFilter = document.getElementById('designationFilter');

    employeeCount.textContent = employees.length;

    const totalSalary = employees.reduce((sum, employee) => sum + employee.salary, 0);
    avgSalary.textContent = (employees.length ? (totalSalary / employees.length).toFixed(2) : 0.00);

    const designationCount = employees.reduce((acc, employee) => {
        acc[employee.designation] = (acc[employee.designation] || 0) + 1;
        return acc;
    }, {});

    designationStats.innerHTML = Object.entries(designationCount).map(([designation, count]) => {
        return `${designation}: ${count}`;
    }).join(', ');

    // Populate the designation filter
    designationFilter.innerHTML = '<option value="all">All</option>' + 
        Object.keys(designationCount).map(designation => `<option value="${designation}">${designation}</option>`).join('');
    
    // Render salary chart
    renderSalaryChart(designationCount);
}

// Render salary chart
function renderSalaryChart(designationCount) {
    const ctx = document.getElementById('salaryChart').getContext('2d');
    const labels = Object.keys(designationCount);
    const data = labels.map(label => {
        return employees.filter(emp => emp.designation === label).reduce((sum, emp) => sum + emp.salary, 0);
    });

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Total Salary by Designation',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Filter employees by designation
document.getElementById('applyFilterButton').addEventListener('click', function() {
    const selectedDesignation = document.getElementById('designationFilter').value;
    const filteredEmployees = selectedDesignation === 'all' ? employees : employees.filter(emp => emp.designation === selectedDesignation);
    displayFilteredReport(filteredEmployees);
});

// Display filtered payroll report
function displayFilteredReport(filteredEmployees) {
    const payrollReportOutput = document.getElementById('payrollReportOutput');
    payrollReportOutput.innerHTML = '<h3>Payroll Report</h3>';
    filteredEmployees.forEach(employee => {
        payrollReportOutput.innerHTML += `${employee.name} (${employee.designation}): $${employee.salary.toFixed(2)}<br>`;
    });
}

// Generate payroll report
document.getElementById('generatePayrollReportButton').addEventListener('click', function() {
    displayFilteredReport(employees);
});

// Export to CSV
document.getElementById('exportCsvButton').addEventListener('click', function() {
    const csvContent = "data:text/csv;charset=utf-8," + 
        "Name,Email,Designation,Salary\n" +
        employees.map(emp => `${emp.name},${emp.email},${emp.designation},${emp.salary}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "employees.csv");
    document.body.appendChild(link); // Required for FF

    link.click();
});

// Export to PDF
document.getElementById('exportPdfButton').addEventListener('click', function() {
    const doc = new jsPDF();
    doc.text("Payroll Report", 10, 10);
    employees.forEach((employee, index) => {
        doc.text(`${employee.name} (${employee.designation}): $${employee.salary.toFixed(2)}`, 10, 20 + (index * 10));
    });
    doc.save("payroll_report.pdf");
});

// Initialize the statistics on page load
displayStatistics();

const patients = [
    { name: "Alice Smith", age: 30, disease: "Diabetes", treatment: "Insulin", visits: 3, ward: "A", opdType: "general", date: "2023-10-01" },
    { name: "Bob Johnson", age: 45, disease: "Hypertension", treatment: "Medication", visits: 2, ward: "B", opdType: "specialist", date: "2023-09-15" },
    { name: "Charlie Brown", age: 35, disease: "Diabetes", treatment: "Diet Control", visits: 4, ward: "A", opdType: "general", date: "2023-08-20" },
    { name: "David Wilson", age: 50, disease: "Asthma", treatment: "Inhaler", visits: 5, ward: "C", opdType: "general", date: "2023-10-05" },
    { name: "Eva Adams", age: 28, disease: "Hypertension", treatment: "Medication", visits: 1, ward: "B", opdType: "specialist", date: "2023-07-10" },
];

// Display patient statistics
function displayPatientStatistics() {
    const patientCount = document.getElementById('patientCount');
    const diseaseStats = document.getElementById('diseaseStats');
    const diseaseFilter = document.getElementById('diseaseFilter');
    const wardFilter = document.getElementById('wardFilter');

    patientCount.textContent = patients.length;

    const diseaseCount = patients.reduce((acc, patient) => {
        acc[patient.disease] = (acc[patient.disease] || 0) + 1;
        return acc;
    }, {});

    diseaseStats.innerHTML = Object.entries(diseaseCount).map(([disease, count]) => {
        return `${disease}: ${count}`;
    }).join(', ');

    // Populate disease and ward filters
    diseaseFilter.innerHTML = '<option value="all">All Diseases</option>' +
        Object.keys(diseaseCount).map(disease => `<option value="${disease}">${disease}</option>`).join('');

    const wardCount = patients.reduce((acc, patient) => {
        acc[patient.ward] = (acc[patient.ward] || 0) + 1;
        return acc;
    }, {});

    wardFilter.innerHTML = '<option value="all">All Wards</option>' +
        Object.keys(wardCount).map(ward => `<option value="${ward}">${ward}</option>`).join('');

    // Render patient chart
    renderPatientChart(diseaseCount);
}

// Render patient chart
function renderPatientChart(diseaseCount) {
    const ctx = document.getElementById('patientChart').getContext('2d');
    const labels = Object.keys(diseaseCount);
    const data = labels.map(label => diseaseCount[label]);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of Patients by Disease',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Filter patients by selected criteria
document.getElementById('applyFilterButton').addEventListener('click', function() {
    const selectedDisease = document.getElementById('diseaseFilter').value;
    const selectedWard = document.getElementById('wardFilter').value;
    const selectedOpdType = document.getElementById('opdTypeFilter').value;
    const selectedDuration = document.getElementById('durationFilter').value;

    const filteredPatients = patients.filter(patient => {
        const meetsDisease = selectedDisease === 'all' || patient.disease === selectedDisease;
        const meetsWard = selectedWard === 'all' || patient.ward === selectedWard;
        const meetsOpdType = selectedOpdType === 'all' || patient.opdType === selectedOpdType;
        const meetsDuration = selectedDuration === 'all' || isWithinDuration(patient.date, selectedDuration);
        
        return meetsDisease && meetsWard && meetsOpdType && meetsDuration;
    });

    displayFilteredPatientReport(filteredPatients);
});

// Check if a patient's date falls within the selected duration
function isWithinDuration(date, duration) {
    const patientDate = new Date(date);
    const currentDate = new Date();
    
    switch (duration) {
        case '1week':
            return (currentDate - patientDate) <= (7 * 24 * 60 * 60 * 1000);
        case '1month':
            return (currentDate - patientDate) <= (30 * 24 * 60 * 60 * 1000);
        case '6months':
            return (currentDate - patientDate) <= (180 * 24 * 60 * 60 * 1000);
        default:
            return true;
    }
}

// Display filtered patient report
function displayFilteredPatientReport(filteredPatients) {
    const patientReportOutput = document.getElementById('patientReportOutput');
    patientReportOutput.innerHTML = '<h3>Patient Report</h3>';
    filteredPatients.forEach(patient => {
        patientReportOutput.innerHTML += `${patient.name}, Age: ${patient.age}, Disease: ${patient.disease}, Treatment: ${patient.treatment}, Visits: ${patient.visits}, Ward: ${patient.ward}, OPD Type: ${patient.opdType}, Date: ${patient.date}<br>`;
    });
}

// Generate patient report
document.getElementById('generatePatientReportButton').addEventListener('click', function() {
    displayFilteredPatientReport(patients);
});

// Export to CSV
document.getElementById('exportPatientCsvButton').addEventListener('click', function() {
    const csvContent = "data:text/csv;charset=utf-8," + 
        "Name,Age,Disease,Treatment,Visits,Ward,OPD Type,Date\n" +
        patients.map(patient => `${patient.name},${patient.age},${patient.disease},${patient.treatment},${patient.visits},${patient.ward},${patient.opdType},${patient.date}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "patients.csv");
    document.body.appendChild(link);

    link.click();
});

// Export to PDF
document.getElementById('exportPatientPdfButton').addEventListener('click', function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text("Patient Report", 10, 10);
    patients.forEach((patient, index) => {
        doc.text(`${patient.name}, Age: ${patient.age}, Disease: ${patient.disease}, Treatment: ${patient.treatment}, Visits: ${patient.visits}, Ward: ${patient.ward}, OPD Type: ${patient.opdType}, Date: ${patient.date}`, 10, 20 + (index * 10));
    });
    doc.save("patient_report.pdf");
});

// Initialize the statistics on page load
displayPatientStatistics();

function updatePrice(category, index) {
    let price;
    switch (category) {
        case 'consultation':
            price = document.querySelectorAll('#consultationTable input')[index].value;
            alert(`Updated Consultation Price: $${price}`);
            break;
        case 'service':
            price = document.querySelectorAll('#servicesTable input')[index].value;
            alert(`Updated Service Price: $${price}`);
            break;
        case 'drug':
            price = document.querySelectorAll('#drugsTable input')[index].value;
            alert(`Updated Drug Price: $${price}`);
            break;
        case 'labTest':
            price = document.querySelectorAll('#labTestsTable input')[index].value;
            alert(`Updated Lab Test Price: $${price}`);
            break;
        default:
            break;
    }
}

function deleteItem(category, button) {
    const row = button.closest('tr');
    row.parentNode.removeChild(row);
    alert(`Deleted ${category} item.`);
}

function addItem(category) {
    let type, price;
    switch (category) {
        case 'consultation':
            type = document.getElementById('newConsultationType').value;
            price = document.getElementById('newConsultationPrice').value;
            break;
        case 'service':
            type = document.getElementById('newServiceType').value;
            price = document.getElementById('newServicePrice').value;
            break;
        case 'drug':
            type = document.getElementById('newDrugType').value;
            price = document.getElementById('newDrugPrice').value;
            break;
        case 'labTest':
            type = document.getElementById('newLabTestType').value;
            price = document.getElementById('newLabTestPrice').value;
            break;
        default:
            return;
    }

    if (type && price) {
        const tableBody = document.querySelector(`#${category}Table tbody`);
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${type}</td>
            <td><input type="number" value="${price}" /></td>
            <td>
                <button onclick="updatePrice('${category}', tableBody.rows.length - 1)">Update</button>
                <button onclick="deleteItem('${category}', this)">Delete</button>
            </td>
        `;
        tableBody.appendChild(newRow);

        // Clear input fields
        document.getElementById(`new${capitalizeFirstLetter(category)}Type`).value = '';
        document.getElementById(`new${capitalizeFirstLetter(category)}Price`).value = '';
    } else {
        alert("Please fill in both fields.");
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Sample price list data
const consultations = [
    { type: 'General Consultation', price: 50 },
    { type: 'Specialist Consultation', price: 100 },
];

const medicalServices = [
    { type: 'X-Ray', price: 80 },
    { type: 'Ultrasound', price: 120 },
];

const drugs = [
    { type: 'Paracetamol', price: 5 },
    { type: 'Amoxicillin', price: 15 },
];

const labTests = [
    { type: 'Blood Test', price: 30 },
    { type: 'Urine Test', price: 20 },
];

// Initialize invoice and receipt numbers
let invoiceNumber = parseInt(document.getElementById('invoiceNumber').value);
let receiptNumber = parseInt(document.getElementById('receiptNumber').value);

// Populate service options
function populateOptions() {
    populateSelect('consultationSelect', consultations);
    populateSelect('medicalServiceSelect', medicalServices);
    populateSelect('drugSelect', drugs);
    populateSelect('labTestSelect', labTests);
}

function populateSelect(selectId, items) {
    const select = document.getElementById(selectId);
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item.type;
        option.textContent = `${item.type} - $${item.price}`;
        select.appendChild(option);
    });
}

// Toggle visibility of insurance fields
function toggleInsuranceFields() {
    const paymentMethod = document.getElementById('paymentMethod').value;
    const insuranceDetails = document.getElementById('insuranceDetails');
    insuranceDetails.style.display = paymentMethod === 'insurance' ? 'block' : 'none';
}

// Add selected item to invoice
function addServiceToInvoice() {
    const quantity = parseInt(document.getElementById('quantityInput').value);
    let selectedItem = null;
    let selectedType = '';

    const consultationSelect = document.getElementById('consultationSelect');
    if (consultationSelect.value) {
        selectedItem = consultations.find(service => service.type === consultationSelect.value);
        selectedType = 'Consultation';
    }

    const medicalServiceSelect = document.getElementById('medicalServiceSelect');
    if (medicalServiceSelect.value) {
        selectedItem = medicalServices.find(service => service.type === medicalServiceSelect.value);
        selectedType = 'Medical Service';
    }

    const drugSelect = document.getElementById('drugSelect');
    if (drugSelect.value) {
        selectedItem = drugs.find(service => service.type === drugSelect.value);
        selectedType = 'Drug';
    }

    const labTestSelect = document.getElementById('labTestSelect');
    if (labTestSelect.value) {
        selectedItem = labTests.find(service => service.type === labTestSelect.value);
        selectedType = 'Lab Test';
    }

    if (!selectedItem || quantity <= 0) {
        alert('Please select an item and enter a valid quantity.');
        return;
    }

    const totalPrice = selectedItem.price * quantity;

    const invoiceTableBody = document.querySelector('#invoiceTable tbody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${selectedItem.type}</td>
        <td>${selectedType}</td>
        <td>$${selectedItem.price}</td>
        <td>${quantity}</td>
        <td>$${totalPrice}</td>
        <td><button onclick="removeItem(this)">Remove</button></td>
    `;
    invoiceTableBody.appendChild(newRow);
    
    updateTotalAmount();

    consultationSelect.selectedIndex = 0;
    medicalServiceSelect.selectedIndex = 0;
    drugSelect.selectedIndex = 0;
    labTestSelect.selectedIndex = 0;
}

// Remove an item from the invoice
function removeItem(button) {
    const row = button.closest('tr');
    row.parentNode.removeChild(row);
    updateTotalAmount();
}

// Update the total amount
function updateTotalAmount() {
    const invoiceRows = document.querySelectorAll('#invoiceTable tbody tr');
    let totalAmount = 0;

    invoiceRows.forEach(row => {
        const totalCell = row.cells[4].textContent;
        totalAmount += parseFloat(totalCell.replace('$', ''));
    });

    document.getElementById('totalAmount').textContent = totalAmount.toFixed(2);
}

// Generate receipt
function generateReceipt() {
    const receiptContent = [];
    const patientName = document.getElementById('patientName').value;
    const patientId = document.getElementById('patientId').value;
    const patientContact = document.getElementById('patientContact').value;
    const opdNumber = document.getElementById('opdNumber').value;
    const hospitalName = document.getElementById('hospitalName').value;
    const hospitalAddress = document.getElementById('hospitalAddress').value;
    const hospitalContact = document.getElementById('hospitalContact').value;
    const billingOfficer = document.getElementById('billingOfficer').value;
    const paymentMethod = document.getElementById('paymentMethod').value;
    const insuranceProvider = document.getElementById('insuranceProvider').value;
    const insurancePolicyNumber = document.getElementById('insurancePolicyNumber').value;
    const dateTime = new Date().toLocaleString();

    receiptContent.push(`Receipt Number: ${receiptNumber}`);
    receiptContent.push(`Date & Time: ${dateTime}`);
    receiptContent.push(`Invoice Number: ${invoiceNumber}`);
    receiptContent.push(`OPD No: ${opdNumber}`);
    receiptContent.push(`Receipt for: ${patientName} (ID: ${patientId}, Contact: ${patientContact})`);
    receiptContent.push(`Hospital: ${hospitalName}`);
    receiptContent.push(`Hospital: ${hospitalEmail}`);
    receiptContent.push(`Address: ${hospitalAddress}`);
    receiptContent.push(`Contact: ${hospitalContact}`);
    receiptContent.push(`Billing Officer: ${billingOfficer}`);
    receiptContent.push(`Payment Method: ${paymentMethod}`);

    if (paymentMethod === 'insurance') {
        receiptContent.push(`Insurance Provider: ${insuranceProvider}`);
        receiptContent.push(`Policy Number: ${insurancePolicyNumber}`);
    }

    receiptContent.push("\nItems:");

    const invoiceRows = document.querySelectorAll('#invoiceTable tbody tr');
    
    invoiceRows.forEach(row => {
        const item = row.cells[0].textContent;
        const type = row.cells[1].textContent;
        const price = row.cells[2].textContent;
        const quantity = row.cells[3].textContent;
        const total = row.cells[4].textContent;
        receiptContent.push(`${item} (${type}) | ${price} x ${quantity} = ${total}`);
    });

    receiptContent.push(`\nTotal Amount: $${document.getElementById('totalAmount').textContent}`);
    document.getElementById('receiptContent').textContent = receiptContent.join('\n');
    document.getElementById('receipt').style.display = 'block';
    
    // Increment receipt number for the next receipt
    receiptNumber++;
    document.getElementById('receiptNumber').value = receiptNumber;

    // Show digital stamp
    document.getElementById('digitalStamp').style.display = 'block';
}

// Print invoice
function printInvoice() {
    const invoiceTable = document.getElementById('invoiceTable').outerHTML;
    const patientName = document.getElementById('patientName').value;
    const patientId = document.getElementById('patientId').value;
    const patientContact = document.getElementById('patientContact').value;
    const opdNumber = document.getElementById('opdNumber').value;
    const hospitalName = document.getElementById('hospitalName').value;
    const hospitalEmail = document.getElementById('hospitalEmail').value;
    const hospitalAddress = document.getElementById('hospitalAddress').value;
    const hospitalContact = document.getElementById('hospitalContact').value;
    const billingOfficer = document.getElementById('billingOfficer').value;
    const dateTime = new Date().toLocaleString();

    const printWindow = window.open('', '_blank', 'height=600,width=800');
    printWindow.document.write(`
        <html>
        <head>
            <title>Invoice</title>
            <style>
                body { font-family: Arial, sans-serif; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid black; padding: 8px; text-align: left; }
                h1, h2 { color: #333; }
            </style>
        </head>
        <body>
            <h1>${hospitalName}</h1>
            <p>${hospitalAddress}</p>
            <p>Contact: ${hospitalContact}</p>
            <h2>Invoice for: ${patientName} (ID: ${patientId}, Contact: ${patientContact})</h2>
            <p>OPD No: ${opdNumber}</p>
            <p>Billing Officer: ${billingOfficer}</p>
            <p>Date & Time: ${dateTime}</p>
            <p>Invoice Number: ${invoiceNumber}</p>
            ${invoiceTable}
            <h2>Total Amount: $${document.getElementById('totalAmount').textContent}</h2>
            <img src="stamp.png" alt="Digital Stamp" style="width:100px;"/>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Pay now function (stub)
function payNow() {
    const paymentMethod = document.getElementById('paymentMethod').value;
    alert(`Payment of $${document.getElementById('totalAmount').textContent} received via ${paymentMethod}.`);
}

// Edit invoice function (stub)
function editInvoice() {
    alert('Edit invoice functionality to be implemented.');
}

// Delete invoice function (stub)
function deleteInvoice() {
    if (confirm('Are you sure you want to delete this invoice?')) {
        document.querySelector('#invoiceTable tbody').innerHTML = ''; // Clear the invoice items
        updateTotalAmount(); // Reset total amount
        alert('Invoice deleted successfully.');
    }
}

// Initialize service options on page load
populateOptions();
