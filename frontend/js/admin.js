const CORRECT_PASSWORD = "admin123";
let currentSelectedCourse = "neet";

const courseAnalyticsData = {
    "neet": { years: { "2024": 120, "2025": 145, "2026": 180 }, gender: { "Boys": 95, "Girls": 85 } },
    "10th": { years: { "2024": 200, "2025": 220, "2026": 250 }, gender: { "Boys": 130, "Girls": 120 } },
    "12th": { years: { "2024": 180, "2025": 190, "2026": 210 }, gender: { "Boys": 110, "Girls": 100 } },
    "cet":  { years: { "2024": 90,  "2025": 110, "2026": 140 }, gender: { "Boys": 80,  "Girls": 60  } },
    "gate": { years: { "2024": 50,  "2025": 65,  "2026": 85  }, gender: { "Boys": 50,  "Girls": 35  } }
};

function handleAdminLogin() {
    const passInput = document.getElementById('adminPassword').value;
    const errorMsg = document.getElementById('errorMsg');

    if (passInput === CORRECT_PASSWORD) {
        errorMsg.style.display = 'none';
        
        const popup = document.getElementById('loginPopup');
        popup.style.display = 'block';
        setTimeout(() => {
            popup.style.display = 'none';
        }, 3000);

        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('dashboardSection').style.display = 'block';

        loadDashboardData(currentSelectedCourse);
    } else {
        errorMsg.style.display = 'block';
    }
}

function handleLogout() {
    document.getElementById('adminPassword').value = '';
    document.getElementById('dashboardSection').style.display = 'none';
    document.getElementById('loginSection').style.display = 'flex';
}

function selectCourse(courseName, element) {
    currentSelectedCourse = courseName;
    
    document.querySelectorAll('.course-card').forEach(card => card.classList.remove('active'));
    element.classList.add('active');

    document.getElementById('analyticsTitle').innerText = `Analytics for ${courseName}`;
    document.getElementById('listTitle').innerText = `Enrolled Students List - ${courseName}`;
    document.getElementById('searchInput').value = '';

    loadDashboardData(courseName);
}

function loadDashboardData(courseName) {
    renderCharts(courseName);
    renderStudentTable(courseName);
}

function renderCharts(courseName) {
    const data = courseAnalyticsData[courseName];

    const yearChart = document.getElementById('yearChart');
    const maxYearVal = Math.max(...Object.values(data.years)) * 1.2;
    
    yearChart.innerHTML = '';
    for (const [year, count] of Object.entries(data.years)) {
        const heightPercent = (count / maxYearVal) * 100;
        yearChart.innerHTML += `
            <div class="bar-group">
                <div class="bar" style="height: ${heightPercent}%;">${count}</div>
                <div class="bar-label">${year}</div>
            </div>
        `;
    }

    const genderChart = document.getElementById('genderChart');
    const maxGenderVal = Math.max(...Object.values(data.gender)) * 1.2;

    genderChart.innerHTML = '';
    for (const [gender, count] of Object.entries(data.gender)) {
        const heightPercent = (count / maxGenderVal) * 100;
        genderChart.innerHTML += `
            <div class="bar-group">
                <div class="bar" style="height: ${heightPercent}%; background-color: ${gender.toLowerCase() === 'boys' ? '#2980b9' : '#e84393'};">${count}</div>
                <div class="bar-label">${gender}</div>
            </div>
        `;
    }
}

function getAllStudents() {
    return JSON.parse(localStorage.getItem('coachingStudents')) || [];
}

function renderStudentTable(courseName) {
    const tbody = document.getElementById('studentTableBody');
    const students = getAllStudents().filter(s => s.course.toLowerCase() === courseName.toLowerCase());

    if (students.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="no-data">No students registered in ${courseName} yet. Register from the Student Registration page!</td></tr>`;
        return;
    }

    tbody.innerHTML = '';
    students.forEach(student => {
        tbody.innerHTML += `
            <tr>
                <td>${student.name}</td>
                <td>${student.gender}</td>
                <td>${student.email}</td>
                <td>${student.phone}</td>
                <td>${student.course}</td>
            </tr>
        `;
    });
}

function filterStudents() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const tbody = document.getElementById('studentTableBody');
    const students = getAllStudents().filter(s => s.course.toLowerCase() === currentSelectedCourse.toLowerCase());

    const filtered = students.filter(s => 
        s.name.toLowerCase().includes(query) ||
        s.email.toLowerCase().includes(query) ||
        s.phone.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="no-data">No matching students found.</td></tr>`;
        return;
    }

    tbody.innerHTML = '';
    filtered.forEach(student => {
        tbody.innerHTML += `
            <tr>
                <td>${student.name}</td>
                <td>${student.gender}</td>
                <td>${student.email}</td>
                <td>${student.phone}</td>
                <td>${student.course}</td>
            </tr>
        `;
    });
}