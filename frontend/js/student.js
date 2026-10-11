document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Collect student data
    const student = {
        name: document.getElementById('fullName').value,
        gender: document.getElementById('gender').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        course: document.getElementById('course').value,
        date: new Date().toISOString()
    };

    // Save to localStorage so Admin page can retrieve it
    let students = JSON.parse(localStorage.getItem('coachingStudents')) || [];
    students.push(student);
    localStorage.setItem('coachingStudents', JSON.stringify(students));

    // Show success popup
    const popup = document.getElementById('successPopup');
    popup.style.display = 'block';
    setTimeout(() => {
        popup.style.display = 'none';
    }, 3000);

    // Undo / Clear form information completely
    this.reset();
});